type StoryboardShot = {
  shot: string;
  time: string;
  phase: string;
  camera: string;
  visual: string;
  screenText: string[];
  motion: string;
  safety: string;
};

const lockedLine = [
  "Chatbots answer.",
  "CRMs store.",
  "ERPs manage.",
  "NEXUS operates.",
];

const storyboardShots: StoryboardShot[] = [
  {
    shot: "01",
    time: "0:00 - 0:12",
    phase: "Chaos",
    camera: "Fast macro cuts with shallow depth, no real customer data visible.",
    visual:
      "Fictional message cards, missed follow-up markers, stock uncertainty, and owner interruption signals appear in rapid sequence.",
    screenText: ["Too many messages", "Too many decisions", "Too little control"],
    motion:
      "Cards overlap, shake subtly, and move faster until the screen feels overloaded.",
    safety:
      "Use fictional UI cards only. Do not show real customer names, orders, phone numbers, email addresses, or private screenshots.",
  },
  {
    shot: "02",
    time: "0:12 - 0:25",
    phase: "Chaos",
    camera: "Wide dashboard-style frame with controlled blur around scattered tools.",
    visual:
      "Separate panels represent manual inbox, spreadsheet, support notes, approval delays, and risk uncertainty.",
    screenText: ["Context scattered", "Risk hidden", "Owner overloaded"],
    motion:
      "Panels drift apart to show fragmentation before freezing on a tension beat.",
    safety:
      "No third-party brand logos, no real software screenshots, and no competitor comparison claims.",
  },
  {
    shot: "03",
    time: "0:25 - 0:42",
    phase: "Old System Limit",
    camera: "Four clean vertical panels, each panel isolated.",
    visual:
      "Chatbot, CRM, ERP, and spreadsheet concepts appear as neutral abstract blocks, each doing one limited task.",
    screenText: lockedLine,
    motion:
      "Each line appears one by one. Final line receives the strongest visual weight.",
    safety:
      "Positioning only. Do not claim verified superiority, market proof, or customer traction.",
  },
  {
    shot: "04",
    time: "0:42 - 0:55",
    phase: "Transition to Control",
    camera: "Slow push-in toward a dark command center interface.",
    visual:
      "Scattered panels collapse into one central NEXUS command layer.",
    screenText: ["One operating layer", "Owner command", "Safety first"],
    motion:
      "Noise reduces. Cards align into structured columns. The visual rhythm becomes controlled.",
    safety:
      "No launch, signup, payment, onboarding, or live execution UI.",
  },
  {
    shot: "05",
    time: "0:55 - 1:15",
    phase: "NEXUS Awakens",
    camera: "Hero interface reveal, premium black background, minimal glow.",
    visual:
      "NEXUS appears above memory, safety, audit, fallback, and approval layers.",
    screenText: ["AI Business Operating System", "Memory", "Safety", "Recovery", "Audit"],
    motion:
      "Layer labels rise from bottom to top, showing operating-system structure.",
    safety:
      "Internal preview-only. Fictional data. No production usage claim.",
  },
  {
    shot: "06",
    time: "1:15 - 1:35",
    phase: "Customer Memory",
    camera: "Close-up on a fictional customer context card.",
    visual:
      "A repeat customer issue appears with preference, previous concern, safe response draft, and business rule context.",
    screenText: ["Prior context found", "Business rule matched", "Safe draft prepared"],
    motion:
      "Memory cards attach to the message thread in a clean structured motion.",
    safety:
      "Do not show real database records. Do not imply live customer memory is active.",
  },
  {
    shot: "07",
    time: "1:35 - 2:05",
    phase: "Customer Memory",
    camera: "Split-screen: left chaos, right NEXUS structured memory.",
    visual:
      "The same fictional request moves from scattered notes into a safe operating view.",
    screenText: ["Before: scattered", "After: controlled", "No restart from zero"],
    motion:
      "Left side fades down. Right side becomes stable and readable.",
    safety:
      "Use invented scenario only. No real customer, order, or medical/financial/private data.",
  },
  {
    shot: "08",
    time: "2:05 - 2:25",
    phase: "Owner Approval",
    camera: "Sharp center-frame safety alert.",
    visual:
      "A risky action appears: refund, price promise, stock promise, delivery commitment, or complaint escalation.",
    screenText: ["Risk detected", "Execution paused", "Owner approval required"],
    motion:
      "Red-risk style alert locks the action, then routes it to owner review.",
    safety:
      "No real refund, price change, payment, shipment, stock update, or message send.",
  },
  {
    shot: "09",
    time: "2:25 - 2:45",
    phase: "Safety Layer",
    camera: "Controlled approval queue view.",
    visual:
      "Owner sees reason, risk type, safe draft, and approve/reject decision boundary.",
    screenText: ["Explain risk", "Prepare safe option", "Owner stays in command"],
    motion:
      "Risk explanation expands below the action. No automatic execution is shown.",
    safety:
      "Owner approval remains conceptual and preview-only. No real execution trigger.",
  },
  {
    shot: "10",
    time: "2:45 - 3:05",
    phase: "Zero Stop Recovery",
    camera: "Simulated failure screen, then recovery queue.",
    visual:
      "A fictional AI/channel failure appears. NEXUS moves work into fallback and audit-safe recovery path.",
    screenText: ["Failure detected", "Fallback active", "Recovery queue ready"],
    motion:
      "Glitch effect appears briefly, then resolves into clean recovery structure.",
    safety:
      "Simulated failure only. No production incident claim.",
  },
  {
    shot: "11",
    time: "3:05 - 3:20",
    phase: "Zero Stop Recovery",
    camera: "Timeline audit trail shot.",
    visual:
      "NEXUS shows what happened, what paused, what needs review, and what can continue safely.",
    screenText: ["Audit log", "Continuity layer", "Manual-safe review"],
    motion:
      "Timeline markers lock into place, proving control and traceability.",
    safety:
      "Do not show real audit logs, real customer events, or production system history.",
  },
  {
    shot: "12",
    time: "3:20 - 3:45",
    phase: "Command Layer",
    camera: "Wide owner dashboard reveal.",
    visual:
      "One operating screen shows approvals, memory, safe drafts, risk queue, daily summary, recovery, and audit.",
    screenText: ["One command layer", "Memory", "Approvals", "Safety", "Recovery", "Audit"],
    motion:
      "Dashboard sections animate in sequence from most urgent to least urgent.",
    safety:
      "No paid access, onboarding, open signup, or customer activation.",
  },
  {
    shot: "13",
    time: "3:45 - 4:05",
    phase: "Power",
    camera: "Slow cinematic orbit around the command interface.",
    visual:
      "The owner view becomes calm, precise, and premium. The chaos from the opening is now fully organized.",
    screenText: ["Chaos controlled", "Risk contained", "Owner in command"],
    motion:
      "Low-speed parallax and subtle depth. No clutter.",
    safety:
      "No fake customer proof, fake revenue, fake traction, or fake launch-readiness claims.",
  },
  {
    shot: "14",
    time: "4:05 - 4:20",
    phase: "Trust",
    camera: "Minimal black screen with controlled typography.",
    visual:
      "Trust principles appear: fictional data, preview-only, owner approval, no real execution.",
    screenText: ["Fictional data", "Preview-only", "Owner approval", "No real execution"],
    motion:
      "Text appears slowly, one principle at a time.",
    safety:
      "This shot explicitly protects legal-safe demo boundaries.",
  },
  {
    shot: "15",
    time: "4:20 - 4:30",
    phase: "Command Close",
    camera: "Final NEXUS wordmark lockup.",
    visual:
      "The core line returns. NEXUS remains as the final operating statement.",
    screenText: lockedLine,
    motion:
      "First three lines fade back. NEXUS operates remains locked on screen.",
    safety:
      "No fake claims, no real customer data, no copyrighted assets, no launch authorization.",
  },
];

const productionLocks = [
  "Use fictional data only.",
  "No real customer data, private screenshots, live database data, or production logs.",
  "No copyrighted music, movie clips, celebrity voices, or external brand assets.",
  "No fake traction, fake revenue, fake customers, fake partnerships, or market proof.",
  "No open signup, payment, customer onboarding, pilot access, or real execution.",
  "Keep NEXUS as an AI Business Operating System: not chatbot, not CRM clone, not ERP clone.",
];

export const metadata = {
  title: "NEXUS Main Demo Storyboard Shot List v1",
  description:
    "Day 585 NEXUS cinematic storyboard and shot list for the 3-5 minute main demo film.",
};

export default function NexusMainDemoStoryboardShotListPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-12 md:px-10">
        <header className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/50">
            NEXUS Day 585
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
            Main Demo Storyboard Shot List v1
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-white/70">
            A production-safe storyboard for the NEXUS 3-5 minute main demo
            film. The sequence preserves the locked cinematic arc: chaos to
            control, control to power, power to trust, and trust to owner
            command.
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
          {storyboardShots.map((shot) => (
            <article
              key={shot.shot}
              className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/45">
                    Shot {shot.shot} / {shot.time}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold">{shot.phase}</h2>
                </div>
                <span className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-white/60">
                  Preview-only
                </span>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl bg-black/35 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
                    Camera
                  </h3>
                  <p className="mt-3 leading-7 text-white/75">{shot.camera}</p>
                </div>

                <div className="rounded-2xl bg-black/35 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
                    Visual
                  </h3>
                  <p className="mt-3 leading-7 text-white/75">{shot.visual}</p>
                </div>

                <div className="rounded-2xl bg-black/35 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
                    Screen Text
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {shot.screenText.map((text) => (
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
                    Motion + Safety
                  </h3>
                  <p className="mt-3 leading-7 text-white/75">{shot.motion}</p>
                  <p className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-white/60">
                    {shot.safety}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
          <h2 className="text-3xl font-bold">Production Locks</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {productionLocks.map((lock) => (
              <div
                key={lock}
                className="rounded-2xl border border-white/10 bg-black/35 p-4 text-sm leading-6 text-white/75"
              >
                {lock}
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}