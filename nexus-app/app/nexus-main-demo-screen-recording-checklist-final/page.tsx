type ChecklistItem = {
  section: string;
  item: string;
  passRule: string;
  blocked: string[];
};

type RecordingRoute = {
  order: string;
  route: string;
  captureGoal: string;
  holdTime: string;
  languageFeeling: string;
};

const lockedLine = [
  "Chatbots answer.",
  "CRMs store.",
  "ERPs manage.",
  "NEXUS operates.",
];

const preFlightChecklist: ChecklistItem[] = [
  {
    section: "Browser",
    item: "Open a fresh browser window with only approved NEXUS preview routes.",
    passRule:
      "No Gmail, WhatsApp, payment dashboard, database console, personal tab, or private notification is visible.",
    blocked: ["Gmail", "WhatsApp", "Payment dashboard", "Database console", "Private notifications"],
  },
  {
    section: "Display",
    item: "Use clean 1080p or higher browser recording with readable text.",
    passRule:
      "Text must be readable, UI must feel premium, and the frame must not look cluttered.",
    blocked: ["Blurry text", "Messy desktop", "Taskbar popups", "Personal folders"],
  },
  {
    section: "Data",
    item: "Use only fictional UI, fictional cards, and preview-only NEXUS routes.",
    passRule:
      "No real customer data, phone numbers, emails, orders, chats, invoices, logs, or private screenshots.",
    blocked: ["Real customer data", "Phone numbers", "Emails", "Orders", "Private screenshots"],
  },
  {
    section: "Secrets",
    item: "Never record code secrets or local configuration.",
    passRule:
      "No API keys, environment variables, .env files, database keys, tokens, or private local paths.",
    blocked: ["API keys", ".env files", "Tokens", "Database keys", "Secret local paths"],
  },
  {
    section: "Claims",
    item: "Keep all language preview-only and proof-safe.",
    passRule:
      "No fake traction, fake revenue, fake customers, fake partnerships, market proof, production-ready claim, or launch-ready claim.",
    blocked: ["Fake traction", "Fake revenue", "Fake customers", "Fake partnerships", "Launch-ready claim"],
  },
  {
    section: "Execution",
    item: "Do not record any live business action.",
    passRule:
      "No signup, payment, onboarding, pilot access, refund, stock update, delivery promise, or real message send.",
    blocked: ["Signup", "Payment", "Onboarding", "Pilot access", "Real execution"],
  },
  {
    section: "Audio",
    item: "Use original voiceover and legal-safe background audio only.",
    passRule:
      "No copyrighted songs, copied trailer audio, movie clips, celebrity voices, or external brand sound effects.",
    blocked: ["Copyrighted music", "Movie clips", "Celebrity voices", "Copied trailer audio"],
  },
  {
    section: "Language",
    item: "Every recorded line must pass the 10/10 language gate.",
    passRule:
      "Simple, powerful, relatable, premium, owner-command-first, trust-building, and aligned with the AI Business Operating System vision.",
    blocked: ["Generic SaaS wording", "Weak filler", "Hype", "Chatbot drift", "CRM clone drift", "ERP clone drift"],
  },
];

const recordingRoutes: RecordingRoute[] = [
  {
    order: "01",
    route: "/nexus-main-demo-film-script",
    captureGoal:
      "Capture the master story and core positioning line as script reference.",
    holdTime: "10-15 seconds",
    languageFeeling:
      "Movie-level narrative foundation, serious and premium.",
  },
  {
    order: "02",
    route: "/nexus-main-demo-storyboard-shot-list",
    captureGoal:
      "Capture clean storyboard cards for visual planning and shot rhythm.",
    holdTime: "15-20 seconds",
    languageFeeling:
      "Chaos becoming controlled structure.",
  },
  {
    order: "03",
    route: "/nexus-main-demo-asset-screen-recording-plan",
    captureGoal:
      "Capture allowed assets, blocked assets, and screen recording rules.",
    holdTime: "10-15 seconds",
    languageFeeling:
      "Trust through safety and clarity.",
  },
  {
    order: "04",
    route: "/nexus-main-demo-voiceover-screen-text-final",
    captureGoal:
      "Capture final voiceover and screen text references.",
    holdTime: "12-18 seconds",
    languageFeeling:
      "Simple, powerful, relatable, and premium.",
  },
  {
    order: "05",
    route: "/nexus-main-demo-editing-timeline-plan",
    captureGoal:
      "Capture timeline blocks and editing rules for sequence control.",
    holdTime: "15-20 seconds",
    languageFeeling:
      "Professional edit discipline.",
  },
  {
    order: "06",
    route: "/nexus-main-demo-recording-execution-pack",
    captureGoal:
      "Capture recording execution steps and route order.",
    holdTime: "12-18 seconds",
    languageFeeling:
      "Recording readiness with no unsafe exposure.",
  },
  {
    order: "07",
    route: "/nexus-main-demo-language-impact-lock",
    captureGoal:
      "Capture power word locks and weak-to-strong language upgrades.",
    holdTime: "15-20 seconds",
    languageFeeling:
      "Every word feels 10/10.",
  },
  {
    order: "08",
    route: "/nexus-main-demo-language-impact-validator",
    captureGoal:
      "Capture validation that language is simple, powerful, relatable, premium, and safe.",
    holdTime: "10-15 seconds",
    languageFeeling:
      "Trust-building proof without fake proof.",
  },
  {
    order: "09",
    route: "/nexus-main-demo-recording-language-alignment",
    captureGoal:
      "Capture alignment between screen recording and language impact gate.",
    holdTime: "12-18 seconds",
    languageFeeling:
      "Final control before actual recording.",
  },
];

const finalRecordingGate = [
  "Record browser-only if possible.",
  "Use a clean browser window with only approved NEXUS routes.",
  "Do one silent screen-capture pass first.",
  "Do voiceover separately, then edit with screen footage.",
  "Delete any clip that shows private data, secrets, notifications, real accounts, or unsafe claims.",
  "Final recording must feel: Chaos became control, control became trust, and the owner stayed in command.",
];

export const metadata = {
  title: "NEXUS Main Demo Screen Recording Checklist Final v1",
  description:
    "Day 594 NEXUS final screen recording checklist for the cinematic main demo film.",
};

export default function NexusMainDemoScreenRecordingChecklistFinalPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-12 md:px-10">
        <header className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/50">
            NEXUS Day 594
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
            Main Demo Screen Recording Checklist Final v1
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-white/70">
            Final screen recording checklist for the NEXUS cinematic main demo.
            This locks the browser setup, safety gate, language gate, approved
            route order, and final recording rules before capture begins.
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
          {preFlightChecklist.map((item) => (
            <article
              key={`${item.section}-${item.item}`}
              className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/45">
                {item.section}
              </p>
              <h2 className="mt-2 text-2xl font-bold">{item.item}</h2>
              <p className="mt-4 max-w-4xl text-sm leading-6 text-white/72">
                {item.passRule}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {item.blocked.map((blocked) => (
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
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
          <h2 className="text-3xl font-bold">Approved Recording Route Order</h2>
          <div className="mt-6 grid gap-4">
            {recordingRoutes.map((route) => (
              <article
                key={route.order}
                className="rounded-2xl border border-white/10 bg-black/35 p-5"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
                      Route {route.order}
                    </p>
                    <h3 className="mt-1 text-xl font-bold">{route.route}</h3>
                  </div>
                  <span className="text-sm text-white/50">{route.holdTime}</span>
                </div>
                <p className="mt-4 text-sm leading-6 text-white/72">
                  {route.captureGoal}
                </p>
                <p className="mt-3 text-sm leading-6 text-white/58">
                  {route.languageFeeling}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
          <h2 className="text-3xl font-bold">Final Recording Gate</h2>
          <div className="mt-6 grid gap-3">
            {finalRecordingGate.map((item) => (
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