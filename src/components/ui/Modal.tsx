"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  footer?: React.ReactNode;
};

export function Modal({ open, onClose, title, description, children, size = "md", footer }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[rgba(12,20,34,0.45)] p-4 backdrop-blur-[2px]" onMouseDown={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "max-h-[90vh] w-full overflow-auto rounded-xl bg-white shadow-[var(--shadow-lg)] animate-in",
          size === "sm" && "max-w-md",
          size === "md" && "max-w-lg",
          size === "lg" && "max-w-2xl"
        )}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-4 border-b border-[var(--border)] px-6 py-5">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[var(--ink)]">{title}</h2>
            {description && <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-[var(--muted)] transition hover:bg-[var(--bg)] hover:text-[var(--ink)]"
          >
            <X size={18} />
          </button>
        </header>
        <div className="px-6 py-5">{children}</div>
        {footer && (
          <footer className="flex flex-wrap items-center justify-end gap-3 border-t border-[var(--border)] bg-[var(--bg)] px-6 py-4">
            {footer}
          </footer>
        )}
      </section>
    </div>
  );
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "primary",
  busy = false,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "primary" | "danger";
  busy?: boolean;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose} disabled={busy}>{cancelLabel}</Button>
          <Button variant={tone === "danger" ? "danger" : "primary"} size="sm" onClick={() => void onConfirm()} disabled={busy}>
            {busy ? "Working…" : confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm leading-6 text-[var(--muted)]">This action is logged for accountability on Pledgekit.</p>
    </Modal>
  );
}
