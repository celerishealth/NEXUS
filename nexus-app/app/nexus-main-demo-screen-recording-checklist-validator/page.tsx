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
    category: "Clean Browser",
    result: "PASS",
    requirement:
      "Recording must use a clean browser with only approved NEXUS preview routes.",
    evidence:
      "Day 594 blocks Gmail, WhatsApp, payment dashboards, database consoles, private tabs, and private notifications.",
  },
  {
    category: "Readable Display",
    result: "PASS",
    requirement:
      "Recording must be clear, premium, and readable at 1080p or higher.",
    evidence:
      "Day 594 requires readable text, clean display, no blurry UI, no messy desktop, and no taskbar popups.",
  },
  {
    category: "Fictional Data Only",
    result: "PASS",
    requirement:
      "Recording must not expose real customer names, phone numbers, emails, orders, chats, invoices, logs, or private screenshots.",
    evidence:
      "Day 594 locks fictional UI, fictional cards, and preview-only NEXUS routes.",
  },
  {
    category: "Secrets Protection",
    result: "PASS",
    requirement:
      "Recording must never show API keys, environment variables, .env files, database keys, tokens, or secret local paths.",
    evidence:
      "Day 594 includes a dedicated secrets block and prohibits recording code secrets or local configuration.",
  },
  {
    category: "No Fake Claims",
    result: "PASS",
    requirement:
      "Recording must not claim fake traction, fake revenue, fake customers, fake partnerships, market proof, production-ready status, or launch-ready status.",
    evidence:
      "Day 594 keeps all language preview-only and proof-safe.",
  },
  {
    category: "No Real Execution",
    result: "PASS",
    requirement:
      "Recording must not show signup, payment, onboarding, pilot access, refund, stock update, delivery promise, or real message send.",
    evidence:
      "Day 594 blocks all live business action and keeps the demo internal preview-only.",
  },
  {
    category: "Copyright Safety",
    result: "PASS",
    requirement:
      "Recording must use original voiceover and legal-safe background audio only.",
    evidence:
      "Day 594 blocks copyrighted songs, copied trailer audio, movie clips, celebrity voices, and external brand sound effects.",
  },
  {
    category: "10/10 Language Gate",
    result: "PASS",
    requirement:
      "Every recorded line must be simple, powerful, relatable, premium, owner-command-first, and trust-building.",
    evidence:
      "Day 594 requires every recorded line to pass the 10/10 language gate and avoid generic SaaS wording, weak filler, hype, chatbot drift, CRM clone drift, and ERP clone drift.",
  },
  {
    category: "Approved Route Order",
    result: "PASS",
    requirement:
      "Recording must follow the approved route order across script, storyboard, asset plan, voiceover, timeline, recording pack, language lock, language validator, and recording-language alignment.",
    evidence:
      "Day 594 locks nine approved recording routes with hold-time and language-feeling guidance.",
  },
  {
    category: "NEXUS Identity",
    result: "PASS",
    requirement:
      "NEXUS must remain an AI Business Operating System, not a chatbot, not a CRM clone, and not an ERP clone.",
    evidence:
      "The locked line remains visible: Chatbots answer. CRMs store. ERPs manage. NEXUS operates.",
  },
];

const goNoGoVerdict = [
  "Day 594 screen recording checklist is valid.",
  "Recording can proceed only with preview-only NEXUS routes and fictional data.",
  "The browser must be clean before every capture.",
  "Unsafe clips must be deleted before editing.",
  "No fake proof, no real customer data, no copyrighted assets, no signup, no payment, no onboarding, and no real execution are authorized.",
  "NEXUS identity remains locked as an AI Business Operating System.",
];

export const metadata = {
  title: "NEXUS Main Demo Screen Recording Checklist Validator v1",
  description:
    "Day 595 NEXUS validator for the final screen recording checklist.",
};

export default function NexusMainDemoScreenRecordingChecklistValidatorPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-12 md:px-10">
        <header className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/50">
            NEXUS Day 595
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
            Main Demo Screen Recording Checklist Validator v1
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-white/70">
            Validation layer for the Day 594 final screen recording checklist.
            This confirms the recording gate remains clean, preview-only,
            fictional-data-safe, legally controlled, 10/10 language-gated, and
            aligned with the NEXUS AI Business Operating System vision.
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
          <h2 className="text-3xl font-bold">Recording Go / No-Go Verdict</h2>
          <div className="mt-6 grid gap-3">
            {goNoGoVerdict.map((line) => (
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