type TimelineBlock = {
  block: string;
  time: string;
  phase: string;
  videoLayer: string;
  textLayer: string[];
  voiceoverCue: string;
  motionCue: string;
  audioCue: string;
  safetyLock: string;
};

const lockedLine = [
  "Chatbots answer.",
  "CRMs store.",
  "ERPs manage.",
  "NEXUS operates.",
];

const timelineBlocks: TimelineBlock[] = [
  {
    block: "01",
    time: "0:00 - 0:12",
    phase: "Chaos ignition",
    videoLayer:
      "Fast fictional UI cards: customer messages, pending decisions, hidden risks, owner interruption signals.",
    textLayer: ["Messages everywhere", "Context missing"],
    voiceoverCue:
      "Every growing business reaches a breaking point.",
    motionCue:
      "Fast cuts, slight shake, overlapping cards, dark premium background.",
    audioCue:
      "Low cinematic pulse begins. No copyrighted music or copied trailer audio.",
    safetyLock:
      "Fictional UI only. No real customer names, phone numbers, emails, orders, or private screenshots.",
  },
  {
    block: "02",
    time: "0:12 - 0:25",
    phase: "Chaos pressure",
    videoLayer:
      "Scattered inbox, notes, manual spreadsheet block, and risk tags drift apart.",
    textLayer: ["Owner overloaded", "Risk hidden"],
    voiceoverCue:
      "Messages arrive from everywhere. Customers wait. Teams lose context. Owners get pulled into every decision.",
    motionCue:
      "Increase visual pressure, then freeze on the word control.",
    audioCue:
      "Pulse rises but stays clean and original.",
    safetyLock:
      "No real tools, no personal notifications, no real operations footage.",
  },
  {
    block: "03",
    time: "0:25 - 0:42",
    phase: "Old system limit",
    videoLayer:
      "Four neutral abstract panels: chatbot, CRM, ERP, spreadsheet.",
    textLayer: ["Chatbots answer.", "CRMs store.", "ERPs manage.", "NEXUS operates."],
    voiceoverCue:
      "A chatbot can answer. A CRM can store. An ERP can manage.",
    motionCue:
      "Reveal one panel at a time. Keep NEXUS line visually strongest.",
    audioCue:
      "Controlled impact hit on NEXUS operates.",
    safetyLock:
      "Positioning only. No competitor logos, screenshots, or superiority claims.",
  },
  {
    block: "04",
    time: "0:42 - 0:55",
    phase: "Operating layer need",
    videoLayer:
      "The four old-system panels collapse into one dark operating layer.",
    textLayer: ["It needs an operating layer", "Control without chaos"],
    voiceoverCue:
      "But business pressure does not arrive in separate boxes. It needs an operating layer.",
    motionCue:
      "Fragmented panels align into a single command structure.",
    audioCue:
      "Tension drops into a clean controlled rise.",
    safetyLock:
      "No launch, signup, payment, onboarding, pilot, or customer activation UI.",
  },
  {
    block: "05",
    time: "0:55 - 1:15",
    phase: "NEXUS reveal",
    videoLayer:
      "NEXUS command interface reveal with memory, safety, owner command, recovery, and audit layers.",
    textLayer: ["AI Business Operating System", "Memory", "Safety"],
    voiceoverCue:
      "NEXUS is an AI Business Operating System.",
    motionCue:
      "Slow hero reveal. Premium, clean, uncluttered.",
    audioCue:
      "Main cinematic theme rises. Original/royalty-safe only.",
    safetyLock:
      "Internal preview-only. No fake production usage or launch-readiness claim.",
  },
  {
    block: "06",
    time: "1:15 - 1:25",
    phase: "Command definition",
    videoLayer:
      "Layer labels connect: context, risk, rules, safe options, owner command.",
    textLayer: ["Context", "Risk", "Business rules", "Owner Command"],
    voiceoverCue:
      "It reads context, detects risk, remembers business rules, prepares safe options, and keeps the owner in command.",
    motionCue:
      "Clean connecting lines between layers.",
    audioCue:
      "Confident but not hype-heavy.",
    safetyLock:
      "Do not show real database data, API keys, or execution buttons.",
  },
  {
    block: "07",
    time: "1:25 - 1:45",
    phase: "Customer memory",
    videoLayer:
      "Fictional customer card connects to prior concern, preference, and business rule.",
    textLayer: ["Prior context found", "Business rule matched"],
    voiceoverCue:
      "Businesses do not lose customers only because of bad replies. They lose customers when memory disappears.",
    motionCue:
      "Memory cards attach smoothly to message context.",
    audioCue:
      "Tone becomes calmer and more trustworthy.",
    safetyLock:
      "Fictional customer memory only. No real customer records or support history.",
  },
  {
    block: "08",
    time: "1:45 - 2:05",
    phase: "Safe draft",
    videoLayer:
      "Safe response draft appears with review state and no-send boundary.",
    textLayer: ["Safe draft prepared", "No restart from zero"],
    voiceoverCue:
      "NEXUS structures customer context, business rules, prior concerns, and safe response drafts so the business does not restart from zero every time.",
    motionCue:
      "Draft card slides in but does not send.",
    audioCue:
      "Subtle trust swell.",
    safetyLock:
      "No real message sending. No customer onboarding or live workspace.",
  },
  {
    block: "09",
    time: "2:05 - 2:25",
    phase: "Risk detected",
    videoLayer:
      "Fictional risky action appears: refund, price promise, stock promise, delivery commitment, or escalation.",
    textLayer: ["Risk detected", "Execution paused"],
    voiceoverCue:
      "Power without safety can damage a business. So NEXUS does not blindly execute risky actions.",
    motionCue:
      "Action locks before execution. Risk reason becomes visible.",
    audioCue:
      "Sharp safety lock sound. Original effect only.",
    safetyLock:
      "No real refund, payment, stock update, delivery promise, or message execution.",
  },
  {
    block: "10",
    time: "2:25 - 2:45",
    phase: "Owner approval",
    videoLayer:
      "Owner approval queue shows risk explanation, safe option, and approve/reject boundary.",
    textLayer: ["Owner approval required", "Zero damage boundary"],
    voiceoverCue:
      "It explains the risk, prepares a safe option, and waits for owner approval.",
    motionCue:
      "Risk explanation expands. Execution remains locked.",
    audioCue:
      "Controlled silence after safety lock, then resume.",
    safetyLock:
      "Owner approval is preview-only. No live approval action or real execution.",
  },
  {
    block: "11",
    time: "2:45 - 3:05",
    phase: "Failure detection",
    videoLayer:
      "Simulated AI/channel failure appears and shifts into fallback active state.",
    textLayer: ["Failure detected", "Fallback active"],
    voiceoverCue:
      "Real businesses cannot stop because one tool fails. NEXUS is designed around continuity.",
    motionCue:
      "Brief glitch, then immediate controlled recovery.",
    audioCue:
      "Short disruption tone, then stable recovery pulse.",
    safetyLock:
      "Simulated failure only. No production incident or outage proof claim.",
  },
  {
    block: "12",
    time: "3:05 - 3:20",
    phase: "Recovery queue",
    videoLayer:
      "Recovery queue, audit trail, and manual-safe review state become visible.",
    textLayer: ["Recovery queue", "Audit trail"],
    voiceoverCue:
      "If something breaks, it records what happened, protects the business, and routes work into a controlled recovery path.",
    motionCue:
      "Timeline markers lock into place.",
    audioCue:
      "Calm control returns.",
    safetyLock:
      "No real production logs, real outage data, or hidden reliability claim.",
  },
  {
    block: "13",
    time: "3:20 - 3:45",
    phase: "Owner command",
    videoLayer:
      "One operating view shows approvals, memory, safe drafts, risk queues, recovery, summaries, and audit.",
    textLayer: ["One command layer", "Approvals", "Memory", "Safety"],
    voiceoverCue:
      "The owner does not need more noise. The owner needs one command layer.",
    motionCue:
      "Dashboard sections animate in urgency order.",
    audioCue:
      "Main theme expands with premium weight.",
    safetyLock:
      "No open customer workspace, signup, payment, paid pilot, or onboarding flow.",
  },
  {
    block: "14",
    time: "3:45 - 4:05",
    phase: "Business operating view",
    videoLayer:
      "Operating view highlights what happened, what needs approval, what is risky, what is safe, and what should happen next.",
    textLayer: ["What happened", "What needs approval", "What is safe", "What is next"],
    voiceoverCue:
      "What happened. What needs approval. What is risky. What is safe. What should happen next.",
    motionCue:
      "Slow cinematic pan across command dashboard.",
    audioCue:
      "Clean power, no aggressive hype.",
    safetyLock:
      "Do not imply launch readiness, real customer success, revenue, traction, or production use.",
  },
  {
    block: "15",
    time: "4:05 - 4:20",
    phase: "Trust locks",
    videoLayer:
      "Minimal black screen with trust principles.",
    textLayer: ["Fictional data", "Preview-only", "Owner approval", "No real execution"],
    voiceoverCue:
      "Chatbots answer. CRMs store. ERPs manage. NEXUS operates.",
    motionCue:
      "Text appears slowly with generous spacing.",
    audioCue:
      "Final theme slows down.",
    safetyLock:
      "This shot explicitly states preview-only and no real execution.",
  },
  {
    block: "16",
    time: "4:20 - 4:30",
    phase: "Final lock",
    videoLayer:
      "Final NEXUS wordmark and locked operating statement.",
    textLayer: ["NEXUS operates.", "Control before scale."],
    voiceoverCue:
      "A business operating system for owners who need control, memory, safety, and continuity before scale.",
    motionCue:
      "Final line holds. Fade to black.",
    audioCue:
      "Final cinematic hit, then clean fade.",
    safetyLock:
      "No fake claims, no copyrighted assets, no customer data, no launch authorization.",
  },
];

const editingRules = [
  "Keep final edit between 4:20 and 4:40 unless later validator approves a shorter cut.",
  "Use only original or royalty-safe audio.",
  "Use fictional data and preview-only NEXUS screens.",
  "Do not show real customer data, private screenshots, API keys, .env files, production logs, or personal notifications.",
  "Do not add fake traction, fake revenue, fake customers, fake partnerships, or launch-readiness claims.",
  "Do not show signup, payment, customer onboarding, pilot access, or real execution.",
  "Every transition must support the arc: Chaos -> Control -> Power -> Trust -> Command.",
];

export const metadata = {
  title: "NEXUS Main Demo Editing Timeline Plan v1",
  description:
    "Day 589 NEXUS editing timeline plan for the 3-5 minute cinematic main demo film.",
};

export default function NexusMainDemoEditingTimelinePlanPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-12 md:px-10">
        <header className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/50">
            NEXUS Day 589
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
            Main Demo Editing Timeline Plan v1
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-white/70">
            A second-by-second editing map for the NEXUS cinematic main demo.
            This locks the edit structure before recording and preserves the
            preview-only, fictional-data-safe, owner-command-first production
            boundary.
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
          {timelineBlocks.map((block) => (
            <article
              key={block.block}
              className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/45">
                    Block {block.block} / {block.time}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold">{block.phase}</h2>
                </div>
                <span className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-white/60">
                  Edit Lock
                </span>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl bg-black/35 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
                    Video Layer
                  </h3>
                  <p className="mt-3 leading-7 text-white/75">
                    {block.videoLayer}
                  </p>
                </div>

                <div className="rounded-2xl bg-black/35 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
                    Text Layer
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {block.textLayer.map((text) => (
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
                    Voiceover + Motion + Audio
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/70">
                    <span className="font-semibold text-white/85">VO:</span>{" "}
                    {block.voiceoverCue}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-white/70">
                    <span className="font-semibold text-white/85">Motion:</span>{" "}
                    {block.motionCue}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-white/70">
                    <span className="font-semibold text-white/85">Audio:</span>{" "}
                    {block.audioCue}
                  </p>
                </div>

                <div className="rounded-2xl bg-black/35 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
                    Safety Lock
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/70">
                    {block.safetyLock}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
          <h2 className="text-3xl font-bold">Editing Rules</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {editingRules.map((rule) => (
              <div
                key={rule}
                className="rounded-2xl border border-white/10 bg-black/35 p-4 text-sm leading-6 text-white/75"
              >
                {rule}
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}