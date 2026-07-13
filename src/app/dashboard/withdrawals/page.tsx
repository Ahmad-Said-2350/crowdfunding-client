"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { StatCard } from "@/components/ui/StatCard";
import { fetchJSON } from "@/lib/api";

export default function WithdrawalsPage() {
  const [summary, setSummary] = useState({ raisedCredits: 0, withdrawableDollars: 0, canWithdraw: false });
  const [credits, setCredits] = useState("");
  const [paymentSystem, setPaymentSystem] = useState("Stripe");
  const [account, setAccount] = useState("");
  const [message, setMessage] = useState("");

  const load = () =>
    fetchJSON<typeof summary>("/api/creator/withdrawals/summary")
      .then(setSummary)
      .catch(() => undefined);

  useEffect(() => {
    load();
  }, []);

  const withdrawalAmount = Number(credits || 0) / 20;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      await fetchJSON("/api/withdrawals", {
        method: "POST",
        body: JSON.stringify({
          withdrawal_credit: Number(credits),
          payment_system: paymentSystem,
          account_number: account,
        }),
      });
      setMessage("Withdrawal request submitted for admin review.");
      setCredits("");
      setAccount("");
      load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Withdrawal failed.");
    }
  };

  return (
    <>
      <DashboardHeader
        eyebrow="Creator earnings"
        title="Withdrawals"
        description="Creators withdraw at 20 credits = $1. A minimum of 200 credits ($10) is required."
      />
      <div className="grid gap-5 md:grid-cols-3">
        <StatCard label="Raised credits" value={summary.raisedCredits} />
        <StatCard label="Withdrawable ($)" value={summary.withdrawableDollars.toFixed(2)} />
        <StatCard label="Minimum threshold" value="200 credits" detail="Equals $10 at platform rate" />
      </div>
      <form onSubmit={submit} className="mt-10 grid max-w-xl gap-5">
        <label>
          <span className="field-label">Credits to withdraw</span>
          <Input type="number" min={200} max={summary.raisedCredits} value={credits} onChange={(e) => setCredits(e.target.value)} required />
        </label>
        <label>
          <span className="field-label">Withdraw amount ($)</span>
          <Input value={withdrawalAmount ? withdrawalAmount.toFixed(2) : ""} readOnly />
        </label>
        <label>
          <span className="field-label">Payment system</span>
          <Select value={paymentSystem} onChange={(e) => setPaymentSystem(e.target.value)}>
            <option>Stripe</option>
            <option>Bkash</option>
            <option>Rocket</option>
            <option>Nagad</option>
          </Select>
        </label>
        <label>
          <span className="field-label">Account number</span>
          <Input value={account} onChange={(e) => setAccount(e.target.value)} required minLength={4} />
        </label>
        {summary.canWithdraw && Number(credits) <= summary.raisedCredits ? (
          <Button type="submit">Withdraw</Button>
        ) : (
          <p className="text-sm font-semibold text-red-700">Insufficient credit</p>
        )}
        {message && <p className="text-sm">{message}</p>}
      </form>
    </>
  );
}
