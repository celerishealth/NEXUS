type ValidatorItem = {
  category: string;
  result: "PASS";
  requirement: string;
  evidence: string;
};

const lockedLine = [
  "Chatbots answer.",
  "CRMs store.",
  "ERPs manage.",
  "NEXUS operates.",
];

const validatorItems: ValidatorItem[] = [
  {
    category: "Simple Language",
    result: "PASS",
    requirement:
      "Every major line must be easy for a non-technical business owner to understand in one listening pass.",
    evidence:
      "Day 591 locks simple-before-clever language and converts generic SaaS wording into direct business-pressure language.",
  },
  {
    category: "Power Without Hype",
    result: "PASS",
    requirement:
      "NEXUS language must sound strong without exaggerated, unsupported, or fake claims.",
    evidence:
      "Day 592 adds a corrective safety amendment to Day 591 and blocks fake customers, fake revenue, fake traction, fake partnerships, market proof, production-ready claims, and launch-ready claims.",
  },
  {
    category: "Relatable Business Pain",
    result: "PASS",
    requirement:
      "The demo must speak to business pressure: messages, decisions, risk, memory loss, failure, and owner overload.",
    evidence:
      "The final language lock starts with business chaos and moves into control, memory, safety, recovery, and command.",
  },
  {
    category: "AI Business Operating System Identity",
    result: "PASS",
    requirement:
      "NEXUS must remain an AI Business Operating System, not chatbot, CRM clone, ERP clone, or generic automation tool.",
    evidence:
      "The locked positioning line remains: Chatbots answer. CRMs store. ERPs manage. NEXUS operates.",
  },
  {
    category: "Owner Command",
    result: "PASS",
    requirement:
      "The language must make the owner feel in command, not replaced by automation.",
    evidence:
      "The lock uses command, approval, risk explanation, safe options, and owner decision language.",
  },
  {
    category: "Memory Impact",
    result: "PASS",
    requirement:
      "Customer memory must feel relatable, not like a basic database feature.",
    evidence:
      "The language upgrades storage into business context staying alive so every conversation does not restart from zero.",
  },
  {
    category: "Safety Impact",
    result: "PASS",
    requirement:
      "Safety must feel like protection, not limitation.",
    evidence:
      "The language states that power without safety can damage a business and keeps risky actions under owner approval.",
  },
  {
    category: "Recovery Impact",
    result: "PASS",
    requirement:
      "Recovery must communicate Zero Stop continuity in simple business language.",
    evidence:
      "The language says that when one tool fails, NEXUS protects the business and routes work into a controlled recovery path.",
  },
  {
    category: "No Fake Proof",
    result: "PASS",
    requirement:
      "The language must not claim fake customers, revenue, traction, partnerships, market leadership, production readiness, or launch readiness.",
    evidence:
      "The Day 592 amendment explicitly locks no fake proof and no launch-readiness language.",
  },
  {
    category: "10/10 Word Gate",
    result: "PASS",
    requirement:
      "Every word must earn its place in the video.",
    evidence:
      "The quality gate requires each line to be understandable, premium, vision-aligned, and operating-system-grade.",
  },
];

const verdict = [
  "Day 591 language impact lock is valid after Day 592 fake-claim safety amendment.",
  "The main demo language is ready for recording guidance.",
  "NEXUS identity remains locked as an AI Business Operating System.",
  "No chatbot, CRM clone, ERP clone, or generic SaaS drift is allowed.",
  "No fake proof, real customer data, payment, onboarding, launch, or real execution is authorized.",
  "Next step can refine recording execution using this language-impact validator as a safety gate.",
];

export const metadata = {
  title: "NEXUS Main Demo Language Impact Validator v1",
  description:
    "Day 592 NEXUS validator for the main demo language impact lock.",
};

export default function NexusMainDemoLanguageImpactValidatorPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-12 md:px-10">
        <header className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/50">
            NEXUS Day 592
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
            Main Demo Language Impact Validator v1
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-white/70">
            Validation layer for the Day 591 language impact lock. This
            confirms the NEXUS main demo language is simple, powerful,
            relatable, premium, legally safe, 10/10 quality-gated, and aligned
            with the AI Business Operating System vision.
          </p>

          <div className="mt-8 grid gap-3 md:grid-cols-4">
            {lockedLine.map((line) => (
              <div
                key={line}
                className="rounded-2xl border border-white/10 bg-black/40 p-4 text-center text-sm font-semibold text-white/80"
              >
                {line}
              </div>
            ))}
          </div>
        </header>

        <section className="grid gap-4">
          {validatorItems.map((item) => (
            <article
              key={item.category}
              className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/45">
                    {item.category}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold">
                    {item.requirement}
                  </h2>
                </div>
                <span className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-white/70">
                  {item.result}
                </span>
              </div>
              <p className="mt-5 max-w-4xl leading-7 text-white/70">
                {item.evidence}
              </p>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
          <h2 className="text-3xl font-bold">Validator Verdict</h2>
          <div className="mt-6 grid gap-3">
            {verdict.map((line) => (
              <div
                key={line}
                className="rounded-2xl border border-white/10 bg-black/35 p-4 text-sm leading-6 text-white/75"
              >
                {line}
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}