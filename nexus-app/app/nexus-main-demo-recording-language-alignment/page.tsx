type AlignmentCheck = {
  check: string;
  recordingRule: string;
  languageRule: string;
  passCondition: string;
};

type CaptureInstruction = {
  segment: string;
  focus: string;
  mustFeelLike: string;
  mustAvoid: string[];
};

const lockedLine = [
  "Chatbots answer.",
  "CRMs store.",
  "ERPs manage.",
  "NEXUS operates.",
];

const alignmentChecks: AlignmentCheck[] = [
  {
    check: "Opening Chaos",
    recordingRule:
      "Record fictional pressure: messages, delays, risk, and owner overload.",
    languageRule:
      "Use simple business pain language, not technical dashboard explanation.",
    passCondition:
      "A non-technical owner must instantly feel: this is my business chaos.",
  },
  {
    check: "Old System Limit",
    recordingRule:
      "Show neutral abstract panels only: chatbot, CRM, ERP, spreadsheet.",
    languageRule:
      "Use the locked line without competitor attack or fake superiority proof.",
    passCondition:
      "The viewer understands NEXUS is not another chatbot, CRM, or ERP clone.",
  },
  {
    check: "NEXUS Reveal",
    recordingRule:
      "Capture NEXUS as one owner-controlled operating layer.",
    languageRule:
      "Say AI Business Operating System clearly and connect it to context, risk, memory, safety, and owner command.",
    passCondition:
      "NEXUS must feel like infrastructure, not a simple reply tool.",
  },
  {
    check: "Customer Memory",
    recordingRule:
      "Use fictional memory cards only.",
    languageRule:
      "Explain memory as business context staying alive, not database storage.",
    passCondition:
      "The viewer must understand: no conversation restarts from zero.",
  },
  {
    check: "Owner Approval",
    recordingRule:
      "Show risky action paused before execution.",
    languageRule:
      "Make safety feel like protection, not limitation.",
    passCondition:
      "The viewer must trust that NEXUS does not blindly damage the business.",
  },
  {
    check: "Recovery",
    recordingRule:
      "Show simulated failure and controlled recovery queue.",
    languageRule:
      "Explain recovery as business continuity when one tool fails.",
    passCondition:
      "The viewer must feel Zero Stop continuity without fake uptime claims.",
  },
  {
    check: "Command Layer",
    recordingRule:
      "Show one operating view: approvals, memory, safe drafts, risk, recovery, audit.",
    languageRule:
      "Use command words: what happened, what needs approval, what is risky, what is safe, what should happen next.",
    passCondition:
      "The owner must feel clear control, not more noise.",
  },
  {
    check: "Trust Close",
    recordingRule:
      "End with preview-only trust locks and the core NEXUS line.",
    languageRule:
      "Use slow, premium, no-hype delivery.",
    passCondition:
      "Trust must come from clarity, safety, and control, not fake proof.",
  },
];

const captureInstructions: CaptureInstruction[] = [
  {
    segment: "0:00 - 0:25",
    focus: "Chaos opening",
    mustFeelLike:
      "Business pressure is real, urgent, and relatable.",
    mustAvoid: [
      "Private screenshots",
      "Real customer data",
      "Random clutter",
      "Over-technical language",
    ],
  },
  {
    segment: "0:25 - 0:55",
    focus: "Category separation",
    mustFeelLike:
      "NEXUS is a different category: it operates.",
    mustAvoid: [
      "Competitor logos",
      "Aggressive comparison",
      "Fake market proof",
      "Generic SaaS words",
    ],
  },
  {
    segment: "0:55 - 1:25",
    focus: "Operating-system reveal",
    mustFeelLike:
      "A premium control layer appears above scattered work.",
    mustAvoid: [
      "Signup UI",
      "Payment UI",
      "Customer onboarding",
      "Production-ready claim",
    ],
  },
  {
    segment: "1:25 - 2:05",
    focus: "Memory impact",
    mustFeelLike:
      "NEXUS remembers business context so the owner does not restart from zero.",
    mustAvoid: [
      "Database-console visuals",
      "Real support history",
      "Private records",
      "CRM-clone wording",
    ],
  },
  {
    segment: "2:05 - 2:45",
    focus: "Safety and owner approval",
    mustFeelLike:
      "NEXUS protects the business before acting.",
    mustAvoid: [
      "Blind automation",
      "Real refund",
      "Real payment",
      "Real message send",
    ],
  },
  {
    segment: "2:45 - 3:20",
    focus: "Recovery",
    mustFeelLike:
      "Failure becomes controlled, visible, and recoverable.",
    mustAvoid: [
      "Real outage claim",
      "Production log",
      "Fake uptime promise",
      "Hidden failure language",
    ],
  },
  {
    segment: "3:20 - 4:05",
    focus: "Owner command",
    mustFeelLike:
      "The owner can see, judge, approve, and command the business from one layer.",
    mustAvoid: [
      "Too much text",
      "Messy dashboard clutter",
      "Generic automation language",
      "Open customer workspace",
    ],
  },
  {
    segment: "4:05 - 4:30",
    focus: "Trust close",
    mustFeelLike:
      "Premium, simple, memorable, and safe.",
    mustAvoid: [
      "Fake traction",
      "Fake revenue",
      "Fake customers",
      "Launch authorization",
    ],
  },
];

const finalGate = [
  "Every recorded clip must pass Day 591 language impact lock.",
  "Every voice line must pass Day 592 language impact validator.",
  "No weak wording, no filler, no fake proof, no generic SaaS language.",
  "NEXUS must remain an AI Business Operating System.",
  "The final feeling must be: chaos became control, control became trust, and the owner stayed in command.",
];

export const metadata = {
  title: "NEXUS Recording Pack Language Alignment v1",
  description:
    "Day 593 NEXUS alignment between recording execution and language impact gates.",
};

export default function NexusMainDemoRecordingLanguageAlignmentPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-12 md:px-10">
        <header className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/50">
            NEXUS Day 593
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
            Recording Pack Language Alignment v1
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-white/70">
            Alignment layer connecting the Day 590 recording execution pack
            with the Day 591 language impact lock and Day 592 validator. This
            ensures the final recording feels simple, powerful, relatable,
            premium, safe, and operating-system-grade.
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
          {alignmentChecks.map((item) => (
            <article
              key={item.check}
              className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/45">
                Alignment Check
              </p>
              <h2 className="mt-2 text-2xl font-bold">{item.check}</h2>

              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                <div className="rounded-2xl bg-black/35 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
                    Recording Rule
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/72">
                    {item.recordingRule}
                  </p>
                </div>
                <div className="rounded-2xl bg-black/35 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
                    Language Rule
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/72">
                    {item.languageRule}
                  </p>
                </div>
                <div className="rounded-2xl bg-black/35 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
                    Pass Condition
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/72">
                    {item.passCondition}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
          <h2 className="text-3xl font-bold">Capture Instructions</h2>
          <div className="mt-6 grid gap-4">
            {captureInstructions.map((item) => (
              <article
                key={item.segment}
                className="rounded-2xl border border-white/10 bg-black/35 p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
                  {item.segment}
                </p>
                <h3 className="mt-2 text-xl font-bold">{item.focus}</h3>
                <p className="mt-3 text-sm leading-6 text-white/72">
                  {item.mustFeelLike}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.mustAvoid.map((blocked) => (
                    <span
                      key={blocked}
                      className="rounded-full border border-white/10 px-3 py-2 text-xs text-white/65"
                    >
                      {blocked}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
          <h2 className="text-3xl font-bold">Final Recording Gate</h2>
          <div className="mt-6 grid gap-3">
            {finalGate.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-black/35 p-4 text-sm leading-6 text-white/75"
              >
                {item}
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}