"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/Button";
import { fetchJSON } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const packages = [
  ["100", "100", "$10"],
  ["300", "300", "$25"],
  ["800", "800", "$60"],
  ["1500", "1,500", "$110"],
] as const;

function PurchaseCreditContent() {
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const { refreshUser } = useAuth();
  const params = useSearchParams();

  useEffect(() => {
    const sessionId = params.get("session_id");
    const success = params.get("success");
    if (success && sessionId) {
      fetchJSON("/api/payments/confirm", {
        method: "POST",
        body: JSON.stringify({ sessionId }),
      })
        .then(async () => {
          setMessage("Payment confirmed. Credits were added to your balance.");
          await refreshUser();
        })
        .catch((e) => setMessage(e instanceof Error ? e.message : "Could not confirm payment."));
    }
  }, [params, refreshUser]);

  const buy = async (key: string) => {
    setBusy(key);
    setMessage("");
    try {
      const result = await fetchJSON<{ mode: string; url?: string; message?: string }>(
        "/api/payments/create-checkout",
        { method: "POST", body: JSON.stringify({ packageKey: key }) }
      );
      if (result.url) window.location.href = result.url;
      else {
        setMessage(result.message || "Credits added.");
        await refreshUser();
      }
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Checkout failed.");
    } finally {
      setBusy("");
    }
  };

  return (
    <>
      <DashboardHeader
        eyebrow="Fund your account"
        title="Purchase credits"
        description="Secure Stripe checkout. Ten Fundora credits equal one US dollar at purchase."
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {packages.map(([key, credits, price]) => (
          <article key={key} className="border-t-4 border-[var(--ibm-blue)] bg-white p-6">
            <p className="text-sm text-[var(--muted)]">Fundora credits</p>
            <h2 className="mt-2 text-3xl font-semibold">{credits}</h2>
            <p className="mt-5 font-serif text-2xl">{price}</p>
            <Button className="mt-6 w-full" disabled={!!busy} onClick={() => void buy(key)}>
              {busy === key ? "Opening checkout…" : "Purchase"}
            </Button>
          </article>
        ))}
      </div>
      {message && <p className="mt-6 bg-white p-4 text-sm">{message}</p>}
    </>
  );
}

export default function PurchaseCredit() {
  return (
    <Suspense fallback={<div>Loading credit packages…</div>}>
      <PurchaseCreditContent />
    </Suspense>
  );
}
