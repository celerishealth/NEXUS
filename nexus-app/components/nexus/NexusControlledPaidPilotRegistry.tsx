import { nexusControlledPaidPilotRegistryCards } from "@/lib/nexus/nexusControlledPaidPilotRegistryCards";

const accentClasses: Record<string, string> = {
  cyan: "border-cyan-400/20 shadow-cyan-950/20 text-cyan-300 border-cyan-300/30 text-cyan-100 hover:border-cyan-200 hover:bg-cyan-300/10",
  emerald: "border-emerald-400/20 shadow-emerald-950/20 text-emerald-300 border-emerald-300/30 text-emerald-100 hover:border-emerald-200 hover:bg-emerald-300/10",
  amber: "border-amber-400/20 shadow-amber-950/20 text-amber-300 border-amber-300/30 text-amber-100 hover:border-amber-200 hover:bg-amber-300/10",
  rose: "border-rose-400/20 shadow-rose-950/20 text-rose-300 border-rose-300/30 text-rose-100 hover:border-rose-200 hover:bg-rose-300/10",
  violet: "border-violet-400/20 shadow-violet-950/20 text-violet-300 border-violet-300/30 text-violet-100 hover:border-violet-200 hover:bg-violet-300/10",
  sky: "border-sky-400/20 shadow-sky-950/20 text-sky-300 border-sky-300/30 text-sky-100 hover:border-sky-200 hover:bg-sky-300/10",
  fuchsia: "border-fuchsia-400/20 shadow-fuchsia-950/20 text-fuchsia-300 border-fuchsia-300/30 text-fuchsia-100 hover:border-fuchsia-200 hover:bg-fuchsia-300/10",
  lime: "border-lime-400/20 shadow-lime-950/20 text-lime-300 border-lime-300/30 text-lime-100 hover:border-lime-200 hover:bg-lime-300/10",
  orange: "border-orange-400/20 shadow-orange-950/20 text-orange-300 border-orange-300/30 text-orange-100 hover:border-orange-200 hover:bg-orange-300/10",
  red: "border-red-400/20 shadow-red-950/20 text-red-300 border-red-300/30 text-red-100 hover:border-red-200 hover:bg-red-300/10",
  yellow: "border-yellow-400/20 shadow-yellow-950/20 text-yellow-300 border-yellow-300/30 text-yellow-100 hover:border-yellow-200 hover:bg-yellow-300/10",
};

function pickAccent(accent: string, index: number) {
  const fallback = ["cyan", "emerald", "amber", "rose", "violet", "sky"][index % 6];
  return accentClasses[accent] ?? accentClasses[fallback];
}

export default function NexusControlledPaidPilotRegistry() {
  return (
    <section className="rounded-3xl border border-slate-700/60 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/30">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
        Day 214 · Dashboard Registry Cleanup
      </p>
      <h2 className="mt-3 text-2xl font-bold text-white">
        Controlled Paid Pilot Safety Registry
      </h2>
      <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">
        Compact registry for recent controlled paid pilot readiness and execution architecture contracts.
        This keeps the dashboard lighter while preserving owner control, read-only discipline, Zero Damage,
        Zero Stop, audit readiness, rollback readiness, incident readiness, and manual escalation visibility.
      </p>

      <div className="mt-6 grid gap-4">
        {nexusControlledPaidPilotRegistryCards.map((card, index) => {
          const accent = pickAccent(card.accent, index);
          const parts = accent.split(" ");
          const border = parts[0];
          const shadow = parts[1];
          const label = parts[2];
          const linkBorder = parts[3];
          const linkText = parts[4];
          const hoverBorder = parts[5];
          const hoverBg = parts[6];

          return (
            <article
              key={card.href}
              className={`rounded-2xl border ${border} bg-slate-950/60 p-5 shadow-xl ${shadow}`}
            >
              <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${label}`}>
                Day {card.day} · {card.label}
              </p>
              <h3 className="mt-2 text-lg font-bold text-white">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{card.description}</p>
              <a
                href={card.href}
                className={`mt-4 inline-flex rounded-full border ${linkBorder} px-4 py-2 text-sm font-semibold ${linkText} ${hoverBorder} ${hoverBg}`}
              >
                View API
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}
