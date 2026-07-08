const lockedLine = [
  "Chatbots answer.",
  "CRMs store.",
  "ERPs manage.",
  "NEXUS operates.",
];

const languageRules = [
  "Simple before clever.",
  "Power without hype.",
  "Relatable before technical.",
  "Owner command before automation.",
  "Trust before scale.",
  "Every word must earn its place.",
  "No fake proof. No weak claims. No generic SaaS language.",
];

const weakToStrong = [
  {
    weak: "NEXUS helps businesses manage messages.",
    strong:
      "NEXUS turns scattered business pressure into one owner-controlled operating layer.",
  },
  {
    weak: "NEXUS can reply to customers.",
    strong:
      "NEXUS prepares safe responses with context, memory, and owner control.",
  },
  {
    weak: "NEXUS stores customer information.",
    strong:
      "NEXUS keeps business context alive so every conversation does not restart from zero.",
  },
  {
    weak: "NEXUS automates business work.",
    strong:
      "NEXUS pauses risky actions, explains the risk, and waits for owner approval.",
  },
  {
    weak: "NEXUS has fallback.",
    strong:
      "When one tool fails, NEXUS protects the business and routes work into a controlled recovery path.",
  },
  {
    weak: "NEXUS dashboard is useful.",
    strong:
      "NEXUS shows what happened, what needs approval, what is risky, what is safe, and what should happen next.",
  },
];

const powerWords = [
  {
    word: "Operates",
    meaning:
      "The final identity word. It signals control, continuity, and business operating-system power.",
  },
  {
    word: "Command",
    meaning:
      "The owner-control word. It makes the owner feel in control, not replaced.",
  },
  {
    word: "Memory",
    meaning:
      "The continuity word. It solves forgotten context and repeated conversations.",
  },
  {
    word: "Safety",
    meaning:
      "The trust word. It proves NEXUS does not blindly damage business.",
  },
  {
    word: "Recovery",
    meaning:
      "The Zero Stop word. It keeps the business moving when tools fail.",
  },
  {
    word: "Approval",
    meaning:
      "The risk-control word. It keeps high-impact actions under owner decision.",
  },
  {
    word: "Context",
    meaning:
      "The understanding word. It shows NEXUS is not replying blindly.",
  },
  {
    word: "Continuity",
    meaning:
      "The infrastructure word. It makes NEXUS feel like a business operating layer, not a temporary tool.",
  },
];

const finalVoiceoverImpactLock = [
  "Every growing business reaches a breaking point.",
  "Messages arrive from everywhere. Customers wait. Teams lose context. Owners get pulled into every decision.",
  "The business is moving, but control is scattered.",
  "A chatbot can answer. A CRM can store. An ERP can manage.",
  "But business pressure does not arrive in separate boxes.",
  "It needs an operating layer.",
  "NEXUS is an AI Business Operating System.",
  "It reads context, detects risk, remembers business rules, prepares safe options, and keeps the owner in command.",
  "The goal is control without chaos.",
  "Businesses lose customers when memory disappears.",
  "NEXUS keeps business context alive so every conversation does not restart from zero.",
  "Power without safety can damage a business.",
  "So NEXUS does not blindly execute risky actions.",
  "It explains the risk, prepares a safe option, and waits for owner approval.",
  "When one tool fails, NEXUS protects the business and routes work into a controlled recovery path.",
  "The owner does not need more noise.",
  "The owner needs one command layer.",
  "What happened. What needs approval. What is risky. What is safe. What should happen next.",
  "Chatbots answer. CRMs store. ERPs manage. NEXUS operates.",
  "A business operating system for owners who need control, memory, safety, and continuity before scale.",
];

const blockedLanguage = [
  "World's number one without proof",
  "Guaranteed revenue",
  "Trusted by thousands",
  "Live customers",
  "Production ready",
  "Fully automated everything",
  "No human needed",
  "Instant success",
  "Market leader",
  "Launch ready",
  "Payment active",
  "Customer onboarding open",
];

const qualityGate = [
  "Can a non-technical business owner understand it instantly?",
  "Does the line sound premium without hype?",
  "Does it protect NEXUS from chatbot, CRM, or ERP clone drift?",
  "Does it show owner command?",
  "Does it avoid fake claims?",
  "Does it avoid real customer data?",
  "Does it make NEXUS feel like an operating system?",
  "Does the word earn its place in the video?",
];

export const metadata = {
  title: "NEXUS Main Demo Language Impact Lock v1",
  description:
    "Day 591 NEXUS language impact lock for the cinematic main demo film.",
};

export default function NexusMainDemoLanguageImpactLockPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-12 md:px-10">
        <header className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/50">
            NEXUS Day 591
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
            Main Demo Language Impact Lock v1
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-white/70">
            A language quality gate for the NEXUS cinematic main demo. This
            locks every word to be simple, powerful, relatable, premium,
            legally safe, and aligned with the AI Business Operating System
            vision before recording and editing.
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

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
          <h2 className="text-3xl font-bold">Language Rules</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {languageRules.map((rule) => (
              <div
                key={rule}
                className="rounded-2xl border border-white/10 bg-black/35 p-4 text-sm leading-6 text-white/75"
              >
                {rule}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
          <h2 className="text-3xl font-bold">Weak to 10/10 Language Upgrades</h2>
          <div className="mt-6 grid gap-4">
            {weakToStrong.map((item) => (
              <article
                key={item.weak}
                className="rounded-2xl border border-white/10 bg-black/35 p-5"
              >
                <div className="grid gap-4 lg:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">
                      Weak
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/55">
                      {item.weak}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">
                      Strong
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-white/85">
                      {item.strong}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
            <h2 className="text-3xl font-bold">Power Word Locks</h2>
            <div className="mt-6 grid gap-3">
              {powerWords.map((item) => (
                <div
                  key={item.word}
                  className="rounded-2xl border border-white/10 bg-black/35 p-4"
                >
                  <p className="text-xl font-bold">{item.word}</p>
                  <p className="mt-2 text-sm leading-6 text-white/65">
                    {item.meaning}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
            <h2 className="text-3xl font-bold">Blocked Language</h2>
            <div className="mt-6 grid gap-3">
              {blockedLanguage.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-black/35 p-4 text-sm leading-6 text-white/72"
                >
                  {item}
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
          <h2 className="text-3xl font-bold">Final Voiceover Impact Lock</h2>
          <div className="mt-6 grid gap-3">
            {finalVoiceoverImpactLock.map((line) => (
              <div
                key={line}
                className="rounded-2xl border border-white/10 bg-black/35 p-4 text-sm leading-6 text-white/78"
              >
                {line}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
          <h2 className="text-3xl font-bold">10/10 Quality Gate</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {qualityGate.map((item) => (
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