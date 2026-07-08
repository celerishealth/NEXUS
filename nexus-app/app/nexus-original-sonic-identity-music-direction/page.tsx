// Day 597 safety amendment for Day 596 sonic identity:
// NEXUS remains an AI Business Operating System.
// NEXUS is not a chatbot, not a CRM clone, not an ERP clone, and not generic automation.
// NEXUS music must remain original, ownable, legal-safe, and aligned with owner command.
// No copyrighted music, no copied movie trailer sound, no celebrity voice, and no known brand sonic logo.
type SonicPrinciple = {
  principle: string;
  meaning: string;
  emotionalEffect: string;
};

type MusicMovement = {
  movement: string;
  time: string;
  scene: string;
  sonicDirection: string;
  instruments: string[];
  rhythm: string;
  emotion: string;
  blocked: string[];
};

type SignatureSound = {
  sound: string;
  role: string;
  design: string;
};

const lockedLine = [
  "Chatbots answer.",
  "CRMs store.",
  "ERPs manage.",
  "NEXUS operates.",
];

const sonicPrinciples: SonicPrinciple[] = [
  {
    principle: "NEXUS does not sound like a song. It sounds like control arriving.",
    meaning:
      "The music must feel like scattered business chaos becoming one operating layer.",
    emotionalEffect:
      "Viewer feels: the noise is ending, command is coming.",
  },
  {
    principle: "Original before cinematic.",
    meaning:
      "The sound must not copy movie trailers, copyrighted music, brand sounds, or celebrity voices.",
    emotionalEffect:
      "NEXUS earns its own sonic identity instead of borrowing emotion from others.",
  },
  {
    principle: "Power without noise.",
    meaning:
      "The score must feel premium, deep, and controlled, not loud or chaotic.",
    emotionalEffect:
      "Viewer feels trust, weight, and seriousness.",
  },
  {
    principle: "Human owner, machine precision.",
    meaning:
      "Blend warm human pulse with clean digital motion.",
    emotionalEffect:
      "Viewer feels NEXUS is intelligent infrastructure, but the owner remains in command.",
  },
  {
    principle: "Memory has warmth. Safety has weight. Recovery has motion. Command has silence.",
    meaning:
      "Each NEXUS pillar gets a distinct sound behavior.",
    emotionalEffect:
      "The audience feels product meaning through sound, not only words.",
  },
  {
    principle: "Silence is a weapon.",
    meaning:
      "Use controlled silence before owner approval, risk lock, and final NEXUS operates line.",
    emotionalEffect:
      "Important moments become unforgettable.",
  },
];

const musicMovements: MusicMovement[] = [
  {
    movement: "01",
    time: "0:00 - 0:25",
    scene: "Chaos",
    sonicDirection:
      "Low irregular pulse, distant digital ticks, soft pressure build, no melody yet.",
    instruments: [
      "Sub bass pulse",
      "Muted digital ticks",
      "Low cinematic air",
      "Soft metallic texture",
    ],
    rhythm:
      "Uneven rhythm, slightly unstable, like business pressure arriving from many directions.",
    emotion:
      "Urgency, overload, scattered control.",
    blocked: [
      "Action trailer drums",
      "Copyrighted beat",
      "Bollywood-style copy",
      "Famous movie rhythm",
    ],
  },
  {
    movement: "02",
    time: "0:25 - 0:55",
    scene: "Old System Limit",
    sonicDirection:
      "Pulse becomes segmented. Each old system line gets a short dry hit. NEXUS line gets the first deep unified tone.",
    instruments: [
      "Dry UI hit",
      "Short bass mark",
      "Minimal clock texture",
      "Deep NEXUS tone",
    ],
    rhythm:
      "Four-part structure: chatbot, CRM, ERP, NEXUS. Final hit must feel different.",
    emotion:
      "Category separation and anticipation.",
    blocked: [
      "Competitor parody sound",
      "Comedy sound",
      "Overdramatic boom",
      "Copied trailer impact",
    ],
  },
  {
    movement: "03",
    time: "0:55 - 1:25",
    scene: "NEXUS Reveal",
    sonicDirection:
      "First NEXUS theme appears: three rising notes and one grounded final tone.",
    instruments: [
      "Hybrid brass pad",
      "Deep synth foundation",
      "Clean digital shimmer",
      "Controlled sub impact",
    ],
    rhythm:
      "Slow, confident, symmetrical. No rush.",
    emotion:
      "Control arrives. The operating layer wakes up.",
    blocked: [
      "Hero superhero theme copy",
      "Movie studio intro copy",
      "Known SaaS brand tone",
      "Celebrity voice tag",
    ],
  },
  {
    movement: "04",
    time: "1:25 - 2:05",
    scene: "Customer Memory",
    sonicDirection:
      "Warm pulse enters. Softer harmonic layer shows context returning.",
    instruments: [
      "Warm low piano note",
      "Soft analog pad",
      "Light memory chime",
      "Subtle heartbeat pulse",
    ],
    rhythm:
      "Slower and smoother. Memory should feel human, not robotic.",
    emotion:
      "Trust, context, no restart from zero.",
    blocked: [
      "Emotional stock music clichÃ©",
      "Sad piano template",
      "Sentimental overkill",
      "Copied melody",
    ],
  },
  {
    movement: "05",
    time: "2:05 - 2:45",
    scene: "Owner Approval + Safety",
    sonicDirection:
      "Music cuts into silence at risk detection, then a heavy safety lock sound lands.",
    instruments: [
      "Silence drop",
      "Heavy low lock hit",
      "Tight digital gate",
      "Controlled bass return",
    ],
    rhythm:
      "Stop, lock, explain, resume.",
    emotion:
      "Protection. Power under control.",
    blocked: [
      "Alarm panic sound",
      "Cheap error beep",
      "Police siren",
      "Copied app notification",
    ],
  },
  {
    movement: "06",
    time: "2:45 - 3:20",
    scene: "Zero Stop Recovery",
    sonicDirection:
      "Brief glitch texture dissolves into a stable recovery pulse.",
    instruments: [
      "Micro glitch",
      "Reverse swell",
      "Recovery pulse",
      "Audit tick",
    ],
    rhythm:
      "Failure appears for less than two seconds, then rhythm stabilizes.",
    emotion:
      "Failure becomes visible, controlled, and recoverable.",
    blocked: [
      "Horror glitch",
      "Game error sound",
      "Fake outage drama",
      "Cyberpunk copy",
    ],
  },
  {
    movement: "07",
    time: "3:20 - 4:05",
    scene: "Owner Command Layer",
    sonicDirection:
      "Full NEXUS theme expands. Low pulse, clean command rhythm, premium lift.",
    instruments: [
      "Deep synth bed",
      "Hybrid orchestral swell",
      "Digital command pulse",
      "Clean upper shimmer",
    ],
    rhythm:
      "Steady and confident, like a business operating system coming online.",
    emotion:
      "Power, trust, clarity, owner command.",
    blocked: [
      "Overhyped trailer climax",
      "War drums",
      "Copied cinematic motif",
      "Generic corporate music",
    ],
  },
  {
    movement: "08",
    time: "4:05 - 4:30",
    scene: "Trust Close",
    sonicDirection:
      "Music reduces to silence, then final NEXUS sonic logo lands: three rise notes, one command tone.",
    instruments: [
      "Minimal air",
      "Final sub tone",
      "Soft digital lock",
      "NEXUS sonic logo",
    ],
    rhythm:
      "Slow. Spacious. Final line must breathe.",
    emotion:
      "Unforgettable close. Trust through restraint.",
    blocked: [
      "Fake applause",
      "Crowd sound",
      "Victory fanfare",
      "Known logo sound",
    ],
  },
];

const signatureSounds: SignatureSound[] = [
  {
    sound: "NEXUS Core Tone",
    role:
      "Main identity sound.",
    design:
      "One deep grounded tone that appears whenever chaos becomes control.",
  },
  {
    sound: "Owner Command Pulse",
    role:
      "Decision and approval sound.",
    design:
      "A short low pulse followed by silence, signaling owner authority.",
  },
  {
    sound: "Memory Chime",
    role:
      "Customer context sound.",
    design:
      "A soft two-note chime that feels warm, not childish or decorative.",
  },
  {
    sound: "Safety Lock",
    role:
      "Risk pause sound.",
    design:
      "A heavy but clean lock hit with no panic, alarm, or fear.",
  },
  {
    sound: "Recovery Sweep",
    role:
      "Fallback and continuity sound.",
    design:
      "A reverse sweep into a stable pulse, showing failure turning into control.",
  },
  {
    sound: "NEXUS Sonic Logo",
    role:
      "Final brand audio mark.",
    design:
      "Three rising notes plus one deep final command tone. Short, original, and owned by NEXUS.",
  },
];

const musicRules = [
  "No copyrighted music.",
  "No copied movie trailer sound.",
  "No celebrity voice.",
  "No known brand sonic logo.",
  "No fake crowd, applause, victory, or hype sound.",
  "No generic corporate stock feeling.",
  "No panic alarm unless it is fully original and controlled.",
  "Every sound must support the arc: Chaos -> Control -> Power -> Trust -> Command.",
  "Final NEXUS music must feel like business control arriving, not entertainment noise.",
];

const directorNote = [
  "The NEXUS score should not chase emotion. It should command emotion.",
  "The music must make the viewer feel that NEXUS is not another tool; it is the operating layer above the chaos.",
  "The most powerful moments should not be the loudest. They should be the cleanest.",
  "When the line NEXUS operates appears, the sound must feel final.",
];

export const metadata = {
  title: "NEXUS Original Sonic Identity and Music Direction v1",
  description:
    "Day 596 NEXUS original sonic identity and music direction lock for the cinematic main demo.",
};

export default function NexusOriginalSonicIdentityMusicDirectionPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-12 md:px-10">
        <header className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/50">
            NEXUS Day 596
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
            Original Sonic Identity + Music Direction v1
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-white/70">
            A world-class original sonic direction for the NEXUS cinematic main
            demo. This locks the music as a unique NEXUS identity system:
            control arriving, risk pausing, memory returning, recovery moving,
            and owner command becoming final.
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

        <section className="grid gap-4 lg:grid-cols-2">
          {sonicPrinciples.map((item) => (
            <article
              key={item.principle}
              className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/45">
                Sonic Principle
              </p>
              <h2 className="mt-2 text-2xl font-bold">{item.principle}</h2>
              <p className="mt-4 text-sm leading-6 text-white/72">
                {item.meaning}
              </p>
              <p className="mt-4 rounded-2xl border border-white/10 bg-black/35 p-4 text-sm leading-6 text-white/65">
                {item.emotionalEffect}
              </p>
            </article>
          ))}
        </section>

        <section className="grid gap-4">
          {musicMovements.map((item) => (
            <article
              key={item.movement}
              className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/45">
                    Movement {item.movement} / {item.time}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold">{item.scene}</h2>
                </div>
                <span className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-white/60">
                  Original Only
                </span>
              </div>

              <p className="mt-5 max-w-5xl text-sm leading-6 text-white/72">
                {item.sonicDirection}
              </p>

              <div className="mt-6 grid gap-4 lg:grid-cols-4">
                <div className="rounded-2xl bg-black/35 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
                    Instruments
                  </h3>
                  <div className="mt-3 space-y-2">
                    {item.instruments.map((instrument) => (
                      <p key={instrument} className="text-sm leading-6 text-white/72">
                        {instrument}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-black/35 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
                    Rhythm
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/72">
                    {item.rhythm}
                  </p>
                </div>

                <div className="rounded-2xl bg-black/35 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
                    Emotion
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/72">
                    {item.emotion}
                  </p>
                </div>

                <div className="rounded-2xl bg-black/35 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
                    Blocked
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.blocked.map((blocked) => (
                      <span
                        key={blocked}
                        className="rounded-full border border-white/10 px-3 py-2 text-xs text-white/65"
                      >
                        {blocked}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
            <h2 className="text-3xl font-bold">NEXUS Signature Sounds</h2>
            <div className="mt-6 grid gap-3">
              {signatureSounds.map((item) => (
                <div
                  key={item.sound}
                  className="rounded-2xl border border-white/10 bg-black/35 p-4"
                >
                  <p className="text-xl font-bold">{item.sound}</p>
                  <p className="mt-2 text-sm leading-6 text-white/65">
                    {item.role}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/55">
                    {item.design}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
            <h2 className="text-3xl font-bold">Music Rules</h2>
            <div className="mt-6 grid gap-3">
              {musicRules.map((rule) => (
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

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
          <h2 className="text-3xl font-bold">Director Note</h2>
          <div className="mt-6 grid gap-3">
            {directorNote.map((note) => (
              <div
                key={note}
                className="rounded-2xl border border-white/10 bg-black/35 p-4 text-sm leading-6 text-white/78"
              >
                {note}
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}