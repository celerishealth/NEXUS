type DemoSegment = {
  segment: string;
  time: string;
  phase: string;
  voiceover: string[];
  screenText: string[];
  delivery: string;
  safety: string;
};

const lockedLine = [
  "Chatbots answer.",
  "CRMs store.",
  "ERPs manage.",
  "NEXUS operates.",
];

const demoSegments: DemoSegment[] = [
  {
    segment: "01",
    time: "0:00 - 0:25",
    phase: "Chaos",
    voiceover: [
      "Every growing business reaches a breaking point.",
      "Messages arrive from everywhere. Customers wait. Teams lose context. Owners get pulled into every decision.",
      "The business is moving, but control is scattered.",
    ],
    screenText: [
      "Messages everywhere",
      "Context missing",
      "Owner overloaded",
      "Risk hidden",
    ],
    delivery:
      "Start low, serious, and cinematic. Build pressure slowly. No hype.",
    safety:
      "Use fictional visual cards only. No real customer data, private messages, phone numbers, emails, or order details.",
  },
  {
    segment: "02",
    time: "0:25 - 0:55",
    phase: "Old System Limit",
    voiceover: [
      "A chatbot can answer.",
      "A CRM can store.",
      "An ERP can manage.",
      "But business pressure does not arrive in separate boxes.",
      "It needs an operating layer.",
    ],
    screenText: lockedLine,
    delivery:
      "Say each line with a pause. Make the final NEXUS line stronger and slower.",
    safety:
      "Positioning only. No competitor logos, screenshots, fake superiority proof, or market claims.",
  },
  {
    segment: "03",
    time: "0:55 - 1:25",
    phase: "NEXUS Awakens",
    voiceover: [
      "NEXUS is an AI Business Operating System.",
      "It does not just answer. It reads context, detects risk, remembers business rules, prepares safe options, and keeps the owner in command.",
      "The goal is control without chaos.",
    ],
    screenText: [
      "AI Business Operating System",
      "Context",
      "Memory",
      "Safety",
      "Owner Command",
    ],
    delivery:
      "Confident and premium. This is the first major reveal.",
    safety:
      "Internal preview-only. No signup, payment, onboarding, paid access, production usage, or launch-readiness claim.",
  },
  {
    segment: "04",
    time: "1:25 - 2:05",
    phase: "Customer Memory",
    voiceover: [
      "Businesses do not lose customers only because of bad replies.",
      "They lose customers when memory disappears.",
      "NEXUS structures customer context, business rules, prior concerns, and safe response drafts so the business does not restart from zero every time.",
    ],
    screenText: [
      "Prior context found",
      "Business rule matched",
      "Safe draft prepared",
      "No restart from zero",
    ],
    delivery:
      "Calmer, more thoughtful. Show trust and usefulness.",
    safety:
      "Customer examples must be fictional. Do not show real database rows, support history, customer memory, or private operational data.",
  },
  {
    segment: "05",
    time: "2:05 - 2:45",
    phase: "Owner Approval + Safety",
    voiceover: [
      "Power without safety can damage a business.",
      "So NEXUS does not blindly execute risky actions.",
      "When a refund, price promise, stock promise, delivery commitment, or escalation appears, NEXUS pauses.",
      "It explains the risk, prepares a safe option, and waits for owner approval.",
    ],
    screenText: [
      "Risk detected",
      "Execution paused",
      "Owner approval required",
      "Zero damage boundary",
    ],
    delivery:
      "Firm and controlled. This section must feel like protection, not limitation.",
    safety:
      "No real refund, payment, stock update, delivery commitment, message send, or risky business execution.",
  },
  {
    segment: "06",
    time: "2:45 - 3:20",
    phase: "Zero Stop Recovery",
    voiceover: [
      "Real businesses cannot stop because one tool fails.",
      "NEXUS is designed around continuity.",
      "If something breaks, it does not hide the failure. It records what happened, protects the business, and routes work into a controlled recovery path.",
    ],
    screenText: [
      "Failure detected",
      "Fallback active",
      "Recovery queue",
      "Audit trail",
    ],
    delivery:
      "Start with tension, then resolve into calm control.",
    safety:
      "Simulated failure only. No real outage, production incident, production log, or hidden reliability claim.",
  },
  {
    segment: "07",
    time: "3:20 - 4:05",
    phase: "Owner Command Layer",
    voiceover: [
      "The owner does not need more noise.",
      "The owner needs one command layer.",
      "NEXUS brings approvals, memory, safe drafts, risk queues, recovery, summaries, and audit into one operating view.",
      "What happened. What needs approval. What is risky. What is safe. What should happen next.",
    ],
    screenText: [
      "One command layer",
      "Approvals",
      "Memory",
      "Safety",
      "Recovery",
      "Audit",
    ],
    delivery:
      "Powerful, slower, and clean. This is the main value moment.",
    safety:
      "Do not show open customer workspace, paid pilot activation, signup, payment, onboarding, or real execution.",
  },
  {
    segment: "08",
    time: "4:05 - 4:30",
    phase: "Trust Close",
    voiceover: [
      "Chatbots answer.",
      "CRMs store.",
      "ERPs manage.",
      "NEXUS operates.",
      "A business operating system for owners who need control, memory, safety, and continuity before scale.",
    ],
    screenText: [
      "Fictional data",
      "Preview-only",
      "Owner approval",
      "No real execution",
      "NEXUS operates.",
    ],
    delivery:
      "Final lines must be slow, premium, and memorable.",
    safety:
      "No fake traction, fake revenue, fake customers, fake partnerships, copyrighted assets, or launch authorization.",
  },
];

const finalScreenTextRules = [
  "Use short text only. Do not overload the frame.",
  "Every screen text line must support the operating-system vision.",
  "Never show real names, phone numbers, emails, orders, API keys, logs, or private screenshots.",
  "Do not write fake claims like live with customers, revenue generated, trusted by brands, or production ready.",
  "Keep all claims preview-only, cinematic-planning-only, and fictional-data-safe.",
];

const voiceoverRules = [
  "Voice should sound calm, premium, and serious.",
  "Avoid shouting, hype, or exaggerated promises.",
  "Pause after each core line.",
  "Pronounce NEXUS clearly as a command-layer product.",
  "Do not mention launch, customers, revenue, partnerships, or production usage.",
  "Keep the message: control, memory, safety, continuity, owner command.",
];

export const metadata = {
  title: "NEXUS Main Demo Voiceover and Screen Text Final v1",
  description:
    "Day 588 NEXUS final voiceover and screen text for the 3-5 minute cinematic main demo film.",
};

export default function NexusMainDemoVoiceoverScreenTextFinalPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-12 md:px-10">
        <header className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/50">
            NEXUS Day 588
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
            Main Demo Voiceover + Screen Text Final v1
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-white/70">
            Final voiceover and screen text package for the NEXUS 3-5 minute
            cinematic main demo film. This locks the spoken narrative before
            recording while preserving preview-only, fictional-data-safe, and
            legal-safe production boundaries.
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
          {demoSegments.map((segment) => (
            <article
              key={segment.segment}
              className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/45">
                    Segment {segment.segment} / {segment.time}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold">{segment.phase}</h2>
                </div>
                <span className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-white/60">
                  Final VO
                </span>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl bg-black/35 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
                    Voiceover
                  </h3>
                  <div className="mt-3 space-y-3">
                    {segment.voiceover.map((line) => (
                      <p key={line} className="leading-7 text-white/78">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-black/35 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
                    Screen Text
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {segment.screenText.map((text) => (
                      <span
                        key={text}
                        className="rounded-full border border-white/10 px-3 py-2 text-sm text-white/75"
                      >
                        {text}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-black/35 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
                    Delivery
                  </h3>
                  <p className="mt-3 leading-7 text-white/72">
                    {segment.delivery}
                  </p>
                </div>

                <div className="rounded-2xl bg-black/35 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
                    Safety
                  </h3>
                  <p className="mt-3 leading-7 text-white/72">
                    {segment.safety}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
            <h2 className="text-3xl font-bold">Screen Text Rules</h2>
            <div className="mt-6 grid gap-3">
              {finalScreenTextRules.map((rule) => (
                <div
                  key={rule}
                  className="rounded-2xl border border-white/10 bg-black/35 p-4 text-sm leading-6 text-white/75"
                >
                  {rule}
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
            <h2 className="text-3xl font-bold">Voiceover Rules</h2>
            <div className="mt-6 grid gap-3">
              {voiceoverRules.map((rule) => (
                <div
                  key={rule}
                  className="rounded-2xl border border-white/10 bg-black/35 p-4 text-sm leading-6 text-white/75"
                >
                  {rule}
                </div>
              ))}
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}