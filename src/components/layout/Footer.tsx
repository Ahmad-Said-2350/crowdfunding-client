import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[var(--ink)] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-2">
        <div>
          <Link href="/" className="font-serif text-2xl font-bold">Fundora.</Link>
          <p className="mt-3 max-w-md text-sm text-gray-400">Transparent crowdfunding for ideas that deserve momentum.</p>
        </div>
        <div className="flex items-center gap-5 md:justify-end">
          <a aria-label="LinkedIn" href="https://www.linkedin.com/in/ahmad-said-2350" target="_blank" rel="noreferrer" className="text-sm font-medium hover:text-blue-300">LinkedIn</a>
          <a aria-label="Facebook" href="https://www.facebook.com/ahmad.said.2350" target="_blank" rel="noreferrer" className="text-sm font-medium hover:text-blue-300">Facebook</a>
          <a aria-label="GitHub" href="https://github.com/Ahmad-Said-2350" target="_blank" rel="noreferrer" className="text-sm font-medium hover:text-blue-300">GitHub</a>
        </div>
      </div>
      <div className="border-t border-gray-700 py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Fundora. Built for measurable impact.
      </div>
    </footer>
  );
}
