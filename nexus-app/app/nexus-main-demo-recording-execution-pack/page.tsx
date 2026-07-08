type RecordingStep = {
  step: string;
  title: string;
  action: string;
  requiredOutput: string;
  blocked: string[];
  safetyLock: string;
};

type CaptureRoute = {
  order: string;
  route: string;
  purpose: string;
  captureInstruction: string;
  durationTarget: string;
};

const lockedLine = [
  "Chatbots answer.",
  "CRMs store.",
  "ERPs manage.",
  "NEXUS operates.",
];

const preRecordingSteps: RecordingStep[] = [
  {
    step: "01",
    title: "Clean Browser Setup",
    action:
      "Open a fresh browser window with only NEXUS preview routes. Close Gmail, WhatsApp, payment dashboards, databases, and personal tabs.",
    requiredOutput:
      "A clean recording environment with no private tabs, no notifications, and no account data visible.",
    blocked: [
      "Private notifications",
      "Real inboxes",
      "Payment dashboards",
      "Database consoles",
      "Environment files",
    ],
    safetyLock:
      "Screen recording must never expose private accounts, API keys, customer data, or operational secrets.",
  },
  {
    step: "02",
    title: "Preview Route Check",
    action:
      "Open each NEXUS cinematic route and confirm it loads before recording.",
    requiredOutput:
      "All required preview pages open correctly and are ready for capture.",
    blocked: [
      "Broken routes",
      "Unverified screens",
      "Live execution pages",
      "Signup/payment/onboarding pages",
    ],
    safetyLock:
      "Only preview-only internal routes are allowed in the video.",
  },
  {
    step: "03",
    title: "Screen Recording Setup",
    action:
      "Use Windows screen recording, OBS, or a browser-safe recorder. Capture browser only, not full desktop when possible.",
    requiredOutput:
      "Clean 1080p or higher screen recording with readable text and no background distractions.",
    blocked: [
      "Full desktop with private files",
      "Taskbar notifications",
      "Personal folders",
      "Secrets or local path exposure",
    ],
    safetyLock:
      "Recording should capture the product narrative, not personal machine context.",
  },
  {
    step: "04",
    title: "Voiceover Recording",
    action:
      "Record the Day 588 final voiceover separately in a quiet room before editing.",
    requiredOutput:
      "Clear voiceover audio with calm, premium, serious delivery.",
    blocked: [
      "Hype promises",
      "Fake launch claims",
      "Fake customer proof",
      "Revenue or partnership claims",
    ],
    safetyLock:
      "Voiceover must remain preview-only and must not claim live customers, revenue, partnerships, or launch readiness.",
  },
  {
    step: "05",
    title: "Cinematic Capture Pass",
    action:
      "Record slow scrolls, zoom-safe sections, and clean still holds from the approved preview pages.",
    requiredOutput:
      "Reusable screen clips for chaos, command layer, storyboard, asset plan, voiceover, and timeline sections.",
    blocked: [
      "Real customer workspace",
      "Real execution buttons",
      "Live database rows",
      "Production logs",
    ],
    safetyLock:
      "All captured content must be fictional-data-safe and non-executing.",
  },
  {
    step: "06",
    title: "Safety Review Before Editing",
    action:
      "Watch every captured clip once before editing and delete any clip that shows private data, real accounts, notifications, secrets, or risky claims.",
    requiredOutput:
      "A clean clip folder approved for internal demo editing.",
    blocked: [
      "Private data",
      "API keys",
      "Personal notifications",
      "Copyrighted assets",
      "Fake claims",
    ],
    safetyLock:
      "Unsafe clips must be deleted before edit begins.",
  },
];

const captureRoutes: CaptureRoute[] = [
  {
    order: "01",
    route: "/nexus-main-demo-film-script",
    purpose:
      "Use as master narrative reference for script rhythm and segment order.",
    captureInstruction:
      "Capture only clean sections showing the cinematic arc and core line.",
    durationTarget: "10-20 seconds of usable reference footage",
  },
  {
    order: "02",
    route: "/nexus-main-demo-film-script-validator",
    purpose:
      "Use as safety proof that script remains preview-only and legally controlled.",
    captureInstruction:
      "Capture validator PASS cards and final verdict slowly.",
    durationTarget: "8-15 seconds",
  },
  {
    order: "03",
    route: "/nexus-main-demo-storyboard-shot-list",
    purpose:
      "Use for shot-list visuals and storyboard-style planning clips.",
    captureInstruction:
      "Capture 3-5 clean shot cards with smooth vertical scroll.",
    durationTarget: "15-25 seconds",
  },
  {
    order: "04",
    route: "/nexus-main-demo-storyboard-shot-list-validator",
    purpose:
      "Use for storyboard validation and trust boundary proof.",
    captureInstruction:
      "Capture validation sections for identity, fake claims, data safety, and execution boundary.",
    durationTarget: "10-18 seconds",
  },
  {
    order: "05",
    route: "/nexus-main-demo-asset-screen-recording-plan",
    purpose:
      "Use for recording plan, allowed assets, blocked assets, and capture safety.",
    captureInstruction:
      "Capture allowed vs blocked asset groups and recording rules.",
    durationTarget: "12-20 seconds",
  },
  {
    order: "06",
    route: "/nexus-main-demo-voiceover-screen-text-final",
    purpose:
      "Use for final voiceover and screen text references.",
    captureInstruction:
      "Capture key voiceover blocks and screen text rules.",
    durationTarget: "12-20 seconds",
  },
  {
    order: "07",
    route: "/nexus-main-demo-editing-timeline-plan",
    purpose:
      "Use as the main editing map for final sequence timing.",
    captureInstruction:
      "Capture timeline blocks, editing rules, and final safety boundaries.",
    durationTarget: "15-25 seconds",
  },
];

const recordingRules = [
  "Record browser-only whenever possible.",
  "Use fictional data only.",
  "No real customer names, phone numbers, emails, orders, invoices, chats, or private screenshots.",
  "No API keys, .env files, production logs, database consoles, Gmail, WhatsApp, or payment dashboards.",
  "No copyrighted music, movie clips, celebrity voices, copied trailer audio, or external brand assets.",
  "No fake traction, fake revenue, fake customers, fake partnerships, market proof, production usage, or launch-readiness claim.",
  "No open signup, payment, customer onboarding, pilot access, or real execution.",
  "Final video remains internal demo material until separate launch authorization exists.",
];

const folderPlan = [
  "recordings/raw-screen-captures",
  "recordings/voiceover",
  "recordings/approved-clips",
  "recordings/rejected-unsafe-clips",
  "recordings/final-edit",
];

export const metadata = {
  title: "NEXUS Main Demo Recording Execution Pack v1",
  description:
    "Day 590 NEXUS recording execution pack for the 3-5 minute cinematic main demo film.",
};

export default function NexusMainDemoRecordingExecutionPackPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-12 md:px-10">
        <header className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/50">
            NEXUS Day 590
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
            Main Demo Recording Execution Pack v1
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-white/70">
            The recording execution pack for the NEXUS 3-5 minute cinematic
            main demo film. This page turns the locked script, storyboard,
            asset plan, voiceover, and editing timeline into a safe recording
            checklist before capture begins.
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
          {preRecordingSteps.map((step) => (
            <article
              key={step.step}
              className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/45">
                    Step {step.step}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold">{step.title}</h2>
                </div>
                <span className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-white/60">
                  Required
                </span>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                <div className="rounded-2xl bg-black/35 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
                    Action
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/75">
                    {step.action}
                  </p>
                </div>

                <div className="rounded-2xl bg-black/35 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
                    Required Output
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/75">
                    {step.requiredOutput}
                  </p>
                </div>

                <div className="rounded-2xl bg-black/35 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
                    Safety Lock
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/70">
                    {step.safetyLock}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {step.blocked.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/10 px-3 py-2 text-xs text-white/65"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
          <h2 className="text-3xl font-bold">Capture Route Order</h2>
          <div className="mt-6 grid gap-4">
            {captureRoutes.map((item) => (
              <article
                key={item.order}
                className="rounded-2xl border border-white/10 bg-black/35 p-5"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
                      Route {item.order}
                    </p>
                    <h3 className="mt-1 text-xl font-bold">{item.route}</h3>
                  </div>
                  <span className="text-sm text-white/50">
                    {item.durationTarget}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-white/72">
                  {item.purpose}
                </p>
                <p className="mt-3 text-sm leading-6 text-white/60">
                  {item.captureInstruction}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
            <h2 className="text-3xl font-bold">Recording Rules</h2>
            <div className="mt-6 grid gap-3">
              {recordingRules.map((rule) => (
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
            <h2 className="text-3xl font-bold">Folder Plan</h2>
            <div className="mt-6 grid gap-3">
              {folderPlan.map((folder) => (
                <div
                  key={folder}
                  className="rounded-2xl border border-white/10 bg-black/35 p-4 font-mono text-sm leading-6 text-white/75"
                >
                  {folder}
                </div>
              ))}
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}