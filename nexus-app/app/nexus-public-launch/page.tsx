export default function NexusPublicLaunchPage() {
  const pillars = [
    "AI Business Operating System",
    "Owner-controlled decisions",
    "Safety-first execution boundaries",
    "Audit-ready operating visibility",
    "Customer memory architecture",
    "Fallback and recovery discipline",
    "Subscription lock discipline",
    "Phased rollout: Demo → Controlled Trial → Paid Pilot → Subscription",
  ];

  const blocked = [
    "No uncontrolled signup",
    "No uncontrolled customer onboarding",
    "No uncontrolled payment collection",
    "No uncontrolled subscription activation",
    "No uncontrolled customer data processing",
    "No uncontrolled real execution",
    "No government API execution",
    "No global trade execution",
  ];

  const reviewSteps = [
    "Owner reviews the request",
    "Scope is checked manually",
    "Safety boundaries are confirmed",
    "Named access is approved only if safe",
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-12 md:px-10">
        <div className="mb-10 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-200 w-fit">
          NEXUS Public Launch Entry — Safety-Locked Mode
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <h1 className="text-4xl font-black tracking-tight md:text-6xl">
              NEXUS
              <span className="block bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
                AI Business Operating System
              </span>
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              NEXUS is entering public launch entry as a safety-first AI Business Operating System
              for owner-controlled business operations, audit visibility, customer memory architecture,
              fallback planning, recovery discipline, and phased execution boundaries.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="/nexus-demo-request"
                className="rounded-2xl bg-emerald-400 px-6 py-4 text-center text-sm font-black uppercase tracking-wide text-slate-950 shadow-lg shadow-emerald-400/20 transition hover:bg-emerald-300"
              >
                Request Controlled Demo
              </a>
              <a
                href="#safety-boundary"
                className="rounded-2xl border border-white/15 px-6 py-4 text-center text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white/10"
              >
                View Safety Boundary
              </a>
            </div>

            <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-400">
              Controlled demo requests are owner-reviewed only. This page does not create open signup,
              payment access, subscription activation, customer onboarding, or real execution.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-cyan-950/40">
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-200">
                Launch Status
              </p>
              <p className="mt-3 text-2xl font-black text-white">
                Publicly Positionable
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                NEXUS can now be publicly explained and reviewed under strict safety-locked launch mode.
              </p>
            </div>

            <div className="mt-5 grid gap-3">
              {blocked.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm font-semibold text-slate-200">
                  ✓ {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar) => (
            <div key={pillar} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-sm font-bold text-slate-200">{pillar}</p>
            </div>
          ))}
        </section>

        <section id="safety-boundary" className="mt-16 rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-200">
            Safety Boundary
          </p>
          <h2 className="mt-4 text-3xl font-black">Not a chatbot. Not a CRM. Not an ERP. Not an automation clone.</h2>
          <p className="mt-5 max-w-4xl text-base leading-8 text-slate-300">
            NEXUS is built as an AI Business Operating System. Public launch entry allows positioning,
            explanation, and owner-reviewed controlled demo requests. Risky execution remains gated.
            Customer onboarding, payment collection, subscription activation, customer data processing,
            and real-world execution require explicit owner-controlled approval.
          </p>
        </section>

        <section id="request-controlled-demo" className="mt-16 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6 md:p-8">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-emerald-200">
            Owner-Reviewed Access
          </p>
          <h2 className="mt-4 text-3xl font-black">Request Controlled Demo</h2>
          <p className="mt-5 max-w-4xl text-base leading-8 text-slate-200">
            Controlled demo access is not automatic. Every request must be reviewed by the owner before
            any access, trial, paid pilot, subscription, onboarding, data processing, or execution step.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {reviewSteps.map((step, index) => (
              <div key={step} className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
                <p className="text-2xl font-black text-emerald-300">0{index + 1}</p>
                <p className="mt-3 text-sm font-bold text-white">{step}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/80 p-5">
            <p className="text-sm font-bold text-slate-200">
              Demo request instruction:
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Share your name, business type, and reason for requesting a controlled demo with the owner.
              Do not send sensitive customer data, payment details, passwords, private business records, or production credentials.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}

