type SonicValidatorItem = {
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

const validatorItems: SonicValidatorItem[] = [
  {
    category: "Original Sonic Identity",
    result: "PASS",
    requirement:
      "NEXUS music must be original and must not copy movie trailers, known brand sounds, celebrity voices, or copyrighted music.",
    evidence:
      "Day 596 locks original-before-cinematic music direction and Day 597 adds a safety amendment preserving original, ownable, legal-safe NEXUS sound.",
  },
  {
    category: "AI Business Operating System Identity",
    result: "PASS",
    requirement:
      "Sonic identity must preserve NEXUS as an AI Business Operating System, not chatbot, CRM clone, ERP clone, or generic automation.",
    evidence:
      "Day 597 adds an explicit identity amendment to the Day 596 sonic identity source.",
  },
  {
    category: "NEXUS-Owned Sound World",
    result: "PASS",
    requirement:
      "The score must feel like NEXUS only, not generic corporate stock music or entertainment noise.",
    evidence:
      "Day 596 defines NEXUS as control arriving, risk pausing, memory returning, recovery moving, and owner command becoming final.",
  },
  {
    category: "Sonic Arc",
    result: "PASS",
    requirement:
      "The music must follow the locked emotional arc: Chaos -> Control -> Power -> Trust -> Command.",
    evidence:
      "Day 596 maps movements from chaos to old-system limit, NEXUS reveal, memory, safety, recovery, command layer, and trust close.",
  },
  {
    category: "Signature Sounds",
    result: "PASS",
    requirement:
      "NEXUS must have repeatable ownable sound marks for core identity, command, memory, safety, recovery, and final logo.",
    evidence:
      "Day 596 locks NEXUS Core Tone, Owner Command Pulse, Memory Chime, Safety Lock, Recovery Sweep, and NEXUS Sonic Logo.",
  },
  {
    category: "Power Without Noise",
    result: "PASS",
    requirement:
      "The score must feel premium, deep, controlled, and powerful without becoming loud, cheap, or overdramatic.",
    evidence:
      "Day 596 blocks overhyped trailer climax, war drums, copied cinematic motifs, fake applause, and generic corporate music.",
  },
  {
    category: "Owner Command",
    result: "PASS",
    requirement:
      "The sound must reinforce owner control, not blind automation.",
    evidence:
      "Day 596 defines Owner Command Pulse and uses silence, controlled lock hits, and final command tone to make owner authority feel central.",
  },
  {
    category: "Memory Warmth",
    result: "PASS",
    requirement:
      "Customer memory must sound warm, contextual, and human, not robotic or decorative.",
    evidence:
      "Day 596 uses warm low piano, soft analog pad, memory chime, and subtle heartbeat pulse for the Customer Memory movement.",
  },
  {
    category: "Safety Weight",
    result: "PASS",
    requirement:
      "Risk and safety moments must sound protective, not panicked.",
    evidence:
      "Day 596 requires silence drop, heavy low lock hit, tight digital gate, and controlled bass return while blocking alarm panic sounds and cheap error beeps.",
  },
  {
    category: "Recovery Motion",
    result: "PASS",
    requirement:
      "Recovery must sound like failure becoming controlled and recoverable.",
    evidence:
      "Day 596 defines micro glitch, reverse swell, recovery pulse, and audit tick while blocking horror glitch, game error sounds, and fake outage drama.",
  },
];

const verdict = [
  "Day 596 sonic identity is valid after Day 597 identity safety amendment.",
  "NEXUS now has an original music direction and ownable sonic system.",
  "No copyrighted music, copied trailer sound, celebrity voice, known brand sonic logo, or generic stock feeling is allowed.",
  "The sound must make viewers feel that control is arriving.",
  "NEXUS remains an AI Business Operating System.",
  "Next step can continue into recording session runbook using this sonic validator as a music safety gate.",
];

export const metadata = {
  title: "NEXUS Original Sonic Identity Validator v1",
  description:
    "Day 597 NEXUS validator for the original sonic identity and music direction.",
};

export default function NexusOriginalSonicIdentityValidatorPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-12 md:px-10">
        <header className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/50">
            NEXUS Day 597
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
            Original Sonic Identity Validator v1
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-white/70">
            Validation layer for the Day 596 original sonic identity and music
            direction. This confirms NEXUS music remains original, ownable,
            cinematic, legal-safe, emotionally powerful, and aligned with the
            AI Business Operating System vision.
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
          <h2 className="text-3xl font-bold">Sonic Validator Verdict</h2>
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