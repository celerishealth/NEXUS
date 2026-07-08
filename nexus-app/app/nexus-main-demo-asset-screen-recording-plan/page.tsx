// Day 588 safety amendment for Day 587 asset and screen recording plan:
// No real customer data, no private screenshots, no live database data, and no production logs.
// No copyrighted music, no movie clips, no celebrity voices, and no external brand assets.
// No fake traction, no fake revenue, no fake customers, no fake partnerships, no fake market proof, and no launch-readiness claim.
// No open signup, no payment, no customer onboarding, no pilot access, and no real execution.
// NEXUS remains an AI Business Operating System, not a chatbot, not a CRM clone, and not an ERP clone.
type RecordingSegment = {
  segment: string;
  time: string;
  screen: string;
  capture: string;
  requiredAssets: string[];
  blockedAssets: string[];
  safetyLock: string;
};

type AssetGroup = {
  group: string;
  allowed: string[];
  blocked: string[];
};

const lockedLine = [
  "Chatbots answer.",
  "CRMs store.",
  "ERPs manage.",
  "NEXUS operates.",
];

const recordingSegments: RecordingSegment[] = [
  {
    segment: "01",
    time: "0:00 - 0:25",
    screen: "Fictional Chaos Opening",
    capture:
      "Record or compose fictional message cards showing overload, scattered context, delayed approvals, and owner pressure.",
    requiredAssets: [
      "Fictional inbox cards",
      "Fictional delay markers",
      "Fictional risk tags",
      "Dark premium background",
    ],
    blockedAssets: [
      "Real customer names",
      "Real phone numbers",
      "Real email addresses",
      "Private screenshots",
    ],
    safetyLock:
      "Opening must show business chaos without exposing real people, real orders, or private operational data.",
  },
  {
    segment: "02",
    time: "0:25 - 0:55",
    screen: "Old System Limit Comparison",
    capture:
      "Use neutral abstract panels for chatbot, CRM, ERP, and spreadsheet limitations before NEXUS appears.",
    requiredAssets: [
      "Neutral system blocks",
      "Locked core line typography",
      "No brand names",
      "No competitor logos",
    ],
    blockedAssets: [
      "Competitor screenshots",
      "Brand logos",
      "Unverified superiority claims",
      "Fake market proof",
    ],
    safetyLock:
      "This is positioning only. Do not claim verified market superiority or use external brand assets.",
  },
  {
    segment: "03",
    time: "0:55 - 1:25",
    screen: "NEXUS Command Layer Reveal",
    capture:
      "Record the NEXUS preview interface or compose a safe mock UI showing memory, safety, approvals, recovery, and audit.",
    requiredAssets: [
      "NEXUS preview route",
      "Memory layer labels",
      "Safety layer labels",
      "Owner command labels",
    ],
    blockedAssets: [
      "Open signup screen",
      "Payment screen",
      "Customer onboarding screen",
      "Live execution trigger",
    ],
    safetyLock:
      "The reveal must stay internal preview-only and must not imply launch, paid access, or live customer readiness.",
  },
  {
    segment: "04",
    time: "1:25 - 2:05",
    screen: "Customer Memory Demo",
    capture:
      "Show fictional memory cards: prior concern, business rule, preference, safe draft, and review state.",
    requiredAssets: [
      "Fictional customer card",
      "Fictional prior context",
      "Business rule card",
      "Safe draft card",
    ],
    blockedAssets: [
      "Real database rows",
      "Real customer memory",
      "Real support history",
      "Medical or financial private data",
    ],
    safetyLock:
      "Customer memory must be fictional, structured, and preview-only.",
  },
  {
    segment: "05",
    time: "2:05 - 2:45",
    screen: "Owner Approval + Safety Lock",
    capture:
      "Show a fictional risky action paused for owner approval with risk reason and safe option.",
    requiredAssets: [
      "Risk detected card",
      "Execution paused card",
      "Owner approval required card",
      "Safe option card",
    ],
    blockedAssets: [
      "Real refund",
      "Real payment",
      "Real stock update",
      "Real message send",
    ],
    safetyLock:
      "Risky business actions must pause. No blind automation or real execution is allowed.",
  },
  {
    segment: "06",
    time: "2:45 - 3:20",
    screen: "Fallback + Recovery Queue",
    capture:
      "Show simulated failure, fallback active state, recovery queue, audit trail, and manual-safe review.",
    requiredAssets: [
      "Simulated failure card",
      "Fallback active card",
      "Recovery queue card",
      "Audit timeline card",
    ],
    blockedAssets: [
      "Production incident claim",
      "Real outage data",
      "Real logs",
      "Hidden failure language",
    ],
    safetyLock:
      "Failure must be simulated. NEXUS should show transparent recovery, not fake production history.",
  },
  {
    segment: "07",
    time: "3:20 - 4:05",
    screen: "Owner Command Dashboard",
    capture:
      "Show one operating view with approvals, memory, safe drafts, risk queue, daily summary, recovery, and audit.",
    requiredAssets: [
      "Owner command dashboard",
      "Approval queue panel",
      "Memory panel",
      "Audit panel",
    ],
    blockedAssets: [
      "Open signup",
      "Paid pilot activation",
      "Customer onboarding",
      "Real customer workspace",
    ],
    safetyLock:
      "Dashboard must communicate command and control without authorizing public launch or customer access.",
  },
  {
    segment: "08",
    time: "4:05 - 4:30",
    screen: "Trust Close",
    capture:
      "End with trust principles and the locked NEXUS positioning line.",
    requiredAssets: [
      "Fictional data label",
      "Preview-only label",
      "Owner approval label",
      "Locked core line",
    ],
    blockedAssets: [
      "Fake traction claim",
      "Fake revenue claim",
      "Fake customer claim",
      "Fake partnership claim",
    ],
    safetyLock:
      "Close must build trust through boundaries, not fake proof.",
  },
];

const assetGroups: AssetGroup[] = [
  {
    group: "Allowed Visual Assets",
    allowed: [
      "NEXUS preview UI routes",
      "Fictional UI cards",
      "Abstract system blocks",
      "Original icons created inside the project",
      "Dark premium backgrounds",
      "Text animation",
      "Screen recording of preview-only pages",
    ],
    blocked: [
      "Real customer screenshots",
      "Private business data",
      "External brand logos",
      "Competitor product screenshots",
      "Copyrighted movie clips",
    ],
  },
  {
    group: "Allowed Audio Assets",
    allowed: [
      "Original voiceover",
      "Royalty-safe or self-created background music",
      "Original UI sound effects",
      "Subtle cinematic pulses",
    ],
    blocked: [
      "Copyrighted songs",
      "Movie trailer audio",
      "Celebrity voices",
      "Copied brand sound effects",
    ],
  },
  {
    group: "Allowed Data Assets",
    allowed: [
      "Fictional customer names",
      "Fictional orders",
      "Fictional risk cards",
      "Fictional audit events",
      "Fictional owner review states",
    ],
    blocked: [
      "Real customer names",
      "Real phone numbers",
      "Real emails",
      "Real order IDs",
      "Live database rows",
      "Production logs",
    ],
  },
  {
    group: "Allowed Product Claims",
    allowed: [
      "Internal preview-only",
      "Cinematic planning",
      "AI Business Operating System vision",
      "Owner approval boundary",
      "Safety-first operating layer",
    ],
    blocked: [
      "Fake traction",
      "Fake revenue",
      "Fake customers",
      "Fake partnerships",
      "Launch-readiness claim",
      "Paid access availability",
    ],
  },
];

const recordingRules = [
  "Record only preview-safe NEXUS screens or fictional composed UI.",
  "Keep browser tabs clean before screen recording.",
  "Do not show file paths containing secrets, API keys, environment variables, or private accounts.",
  "Use browser zoom and cinematic crop carefully; no unread private notifications should appear.",
  "Do not record Gmail, WhatsApp, payment dashboards, real databases, or real customer tools.",
  "Final video remains internal demo planning until launch, pilot, and customer access are separately authorized.",
];

export const metadata = {
  title: "NEXUS Main Demo Asset List and Screen Recording Plan v1",
  description:
    "Day 587 NEXUS asset list and screen recording plan for the 3-5 minute cinematic main demo film.",
};

export default function NexusMainDemoAssetScreenRecordingPlanPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-12 md:px-10">
        <header className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/50">
            NEXUS Day 587
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
            Main Demo Asset List + Screen Recording Plan v1
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-white/70">
            A production-safe asset and screen recording plan for the NEXUS
            cinematic main demo film. This locks what can be recorded, what must
            be fictional, and what remains blocked before any video production
            begins.
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
          {recordingSegments.map((segment) => (
            <article
              key={segment.segment}
              className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/45">
                    Segment {segment.segment} / {segment.time}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold">{segment.screen}</h2>
                </div>
                <span className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-white/60">
                  Screen Plan
                </span>
              </div>

              <p className="mt-5 max-w-5xl leading-7 text-white/72">
                {segment.capture}
              </p>

              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                <div className="rounded-2xl bg-black/35 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
                    Required Assets
                  </h3>
                  <div className="mt-3 space-y-2">
                    {segment.requiredAssets.map((asset) => (
                      <p key={asset} className="text-sm leading-6 text-white/75">
                        {asset}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-black/35 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
                    Blocked Assets
                  </h3>
                  <div className="mt-3 space-y-2">
                    {segment.blockedAssets.map((asset) => (
                      <p key={asset} className="text-sm leading-6 text-white/75">
                        {asset}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-black/35 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
                    Safety Lock
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/70">
                    {segment.safetyLock}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          {assetGroups.map((group) => (
            <article
              key={group.group}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
            >
              <h2 className="text-2xl font-bold">{group.group}</h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-black/35 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
                    Allowed
                  </h3>
                  <div className="mt-3 space-y-2">
                    {group.allowed.map((item) => (
                      <p key={item} className="text-sm leading-6 text-white/75">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-black/35 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
                    Blocked
                  </h3>
                  <div className="mt-3 space-y-2">
                    {group.blocked.map((item) => (
                      <p key={item} className="text-sm leading-6 text-white/75">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
          <h2 className="text-3xl font-bold">Screen Recording Rules</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {recordingRules.map((rule) => (
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