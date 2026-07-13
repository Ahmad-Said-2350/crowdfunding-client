"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [onClose]);
  if (!open) return null;
  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-4" onMouseDown={onClose}>
    <section role="dialog" aria-modal="true" aria-label={title} className="max-h-[90vh] w-full max-w-xl overflow-auto bg-white p-6 shadow-2xl" onMouseDown={(e) => e.stopPropagation()}>
      <header className="mb-5 flex items-center justify-between"><h2 className="font-serif text-2xl">{title}</h2><button onClick={onClose} aria-label="Close"><X /></button></header>
      {children}
    </section>
  </div>;
}
