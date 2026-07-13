export function DashboardHeader({eyebrow,title,description}:{eyebrow:string;title:string;description:string}){
  return <header className="mb-8"><p className="text-xs font-semibold uppercase tracking-[.18em] text-[var(--ibm-blue)]">{eyebrow}</p><h1 className="mt-2 font-serif text-3xl md:text-4xl">{title}</h1><p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">{description}</p></header>;
}
