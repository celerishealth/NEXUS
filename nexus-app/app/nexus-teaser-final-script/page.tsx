export default function NexusTeaserFinalScriptPage() {
  const teaserTimeline = [
    {
      time: "0:00 - 0:04",
      scene: "Black Screen / First Impact",
      visual: "Pure black. Deep bass hit. Tiny white text fades in with premium spacing.",
      screenText: "Every business has tools.",
      voice: "Every business has tools.",
      music: "Single deep cinematic bass hit, then low pulse.",
      emotion: "Curiosity",
    },
    {
      time: "0:04 - 0:10",
      scene: "Operational Chaos",
      visual: "Rapid premium cuts: missed messages, pending order, refund risk, stock confusion, owner under pressure.",
      screenText: "But tools do not think together.",
      voice: "But tools do not think together.",
      music: "Rising tension, digital ticks, controlled pressure.",
      emotion: "Pressure",
    },
    {
      time: "0:10 - 0:17",
      scene: "Hidden Risk",
      visual: "Customer message splits into risk signals: price, payment, delivery, refund, stock, replacement.",
      screenText: "Risks hide inside decisions.",
      voice: "Messages come in. Risks hide inside decisions.",
      music: "Tension grows. Short impact on each risk tag.",
      emotion: "Danger",
    },
    {
      time: "0:17 - 0:25",
      scene: "Old Tools Are Not Enough",
      visual: "Three dark panels appear: Chatbot, CRM, ERP. Each one freezes like an incomplete system.",
      screenText: "Chatbots answer. CRMs store. ERPs manage.",
      voice: "Chatbots answer. CRMs store. ERPs manage.",
      music: "Three heavy impact hits. One for each category.",
      emotion: "Realization",
    },
    {
      time: "0:25 - 0:33",
      scene: "NEXUS Reveal",
      visual: "Dark premium dashboard reveal. Slow camera push. NEXUS appears as the operating layer.",
      screenText: "NEXUS operates.",
      voice: "But business needs an operating system. This is NEXUS.",
      music: "First major heroic rise.",
      emotion: "Power",
    },
    {
      time: "0:33 - 0:45",
      scene: "A-to-Z Operating Flow",
      visual: "Flow animation: Customer Input → Memory → Risk Check → Owner Approval → Audit → Safe Response.",
      screenText: "Memory. Safety. Owner Approval. Audit. Recovery.",
      voice: "An AI Business Operating System built for memory, safety, owner approval, audit visibility, fallback, and controlled execution.",
      music: "Hybrid trailer rhythm begins. Powerful but clean.",
      emotion: "Command",
    },
    {
      time: "0:45 - 0:53",
      scene: "Owner In Command",
      visual: "Owner approval queue. Risky action remains locked until owner decision. Audit trail appears beside it.",
      screenText: "The owner remains in command.",
      voice: "NEXUS does not blindly execute. It protects decisions. It keeps the owner in command.",
      music: "Hero rise. Strong pulse. No clutter.",
      emotion: "Trust",
    },
    {
      time: "0:53 - 0:58",
      scene: "Safety Boundary",
      visual: "Safety layer, fallback, recovery, subscription lock, controlled demo path flash in clean sequence.",
      screenText: "Not chaos. Not guesswork. Not blind automation.",
      voice: "Not chaos. Not guesswork. Not blind automation.",
      music: "Build reaches final peak.",
      emotion: "Confidence",
    },
    {
      time: "0:58 - 1:00",
      scene: "Final Logo Lock",
      visual: "NEXUS title lockup on deep dark background. Final clean impact. Cut to silence.",
      screenText: "NEXUS — AI Business Operating System",
      voice: "NEXUS operates.",
      music: "Final trailer hit. Silence.",
      emotion: "Wow",
    },
  ];

  const finalVoiceover = `Every business has tools.

But tools do not think together.

Messages come in.
Risks hide inside decisions.

Chatbots answer.
CRMs store.
ERPs manage.

But business needs an operating system.

This is NEXUS.

An AI Business Operating System built for memory, safety, owner approval, audit visibility, fallback, and controlled execution.

NEXUS does not blindly execute.
It protects decisions.
It keeps the owner in command.

Not chaos.
Not guesswork.
Not blind automation.

NEXUS operates.`;

  const finalScreenText = [
    "Every business has tools.",
    "But tools do not think together.",
    "Risks hide inside decisions.",
    "Chatbots answer.",
    "CRMs store.",
    "ERPs manage.",
    "NEXUS operates.",
    "Memory. Safety. Owner Approval. Audit. Recovery.",
    "The owner remains in command.",
    "Not chaos. Not guesswork. Not blind automation.",
    "NEXUS — AI Business Operating System",
  ];

  const directorRules = [
    "No weak opening. First 5 seconds must feel premium and serious.",
    "No cheap stock-video energy.",
    "No cartoon animation.",
    "No fake live customer claim.",
    "No real customer data.",
    "No payment or signup pressure.",
    "No copyrighted movie clips.",
    "No copyrighted music.",
    "Every frame must show one clear idea.",
    "NEXUS must feel like an operating command layer, not a chatbot.",
    "Owner control must be visible.",
    "Safety before execution must be visible.",
  ];

  const musicCues = [
    "0:00 — Deep bass hit.",
    "0:04 — Low tension pulse begins.",
    "0:10 — Digital risk ticks.",
    "0:17 — Three impact hits for chatbot, CRM, ERP.",
    "0:25 — Hero rise when NEXUS appears.",
    "0:33 — Hybrid trailer rhythm begins.",
    "0:45 — Strong command pulse.",
    "0:53 — Final build.",
    "0:58 — Final trailer hit.",
    "1:00 — Cut to silence.",
  ];

  const safetyBoundary = [
    "This teaser does not claim uncontrolled live execution.",
    "This teaser does not show real customers.",
    "This teaser does not show private business data.",
    "This teaser does not collect payment.",
    "This teaser does not activate subscriptions.",
    "This teaser does not onboard customers.",
    "This teaser shows controlled concept, safety, owner approval, and operating-system positioning.",
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto w-full max-w-7xl px-6 py-12 md:px-10">
        <a
          href="/nexus-public-launch"
          className="text-sm font-bold text-emerald-300 hover:text-emerald-200"
        >
          ← Back to NEXUS Public Launch
        </a>

        <div className="mt-8 w-fit rounded-full border border-purple-400/30 bg-purple-400/10 px-4 py-2 text-sm font-semibold text-purple-200">
          Final 60-Second Teaser Script — Movie-Level
        </div>

        <h1 className="mt-8 max-w-5xl text-4xl font-black tracking-tight md:text-6xl">
          NEXUS Cinematic Teaser Final Script
        </h1>

        <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
          This page locks the exact 60-second teaser structure for NEXUS. It defines timecode,
          visual direction, screen text, voiceover, music cue, and emotional target for every scene.
        </p>

        <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
          <h2 className="text-3xl font-black">Core Teaser Line</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {["Chatbots answer.", "CRMs store.", "ERPs manage.", "NEXUS operates."].map((line) => (
              <div key={line} className="rounded-2xl border border-white/10 bg-slate-950/80 p-5 text-lg font-black">
                {line}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl font-black">60-Second Timeline</h2>
          <div className="mt-6 grid gap-5">
            {teaserTimeline.map((scene) => (
              <div key={scene.time} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-black text-cyan-200">
                    {scene.time}
                  </span>
                  <span className="rounded-full border border-purple-400/30 bg-purple-400/10 px-3 py-1 text-xs font-black text-purple-200">
                    {scene.scene}
                  </span>
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-black text-emerald-200">
                    {scene.emotion}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-4">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Visual</p>
                    <p className="mt-3 text-sm leading-6 text-slate-200">{scene.visual}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Screen Text</p>
                    <p className="mt-3 text-sm font-black leading-6 text-white">{scene.screenText}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Voiceover</p>
                    <p className="mt-3 text-sm leading-6 text-slate-200">{scene.voice}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Music</p>
                    <p className="mt-3 text-sm leading-6 text-slate-200">{scene.music}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6 md:p-8">
            <h2 className="text-3xl font-black">Final Voiceover</h2>
            <pre className="mt-5 whitespace-pre-wrap rounded-2xl border border-white/10 bg-slate-950/80 p-5 text-sm leading-7 text-slate-200">
              {finalVoiceover}
            </pre>
          </div>

          <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6 md:p-8">
            <h2 className="text-3xl font-black">Final Screen Text</h2>
            <div className="mt-6 grid gap-3">
              {finalScreenText.map((line) => (
                <div key={line} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm font-bold text-slate-200">
                  {line}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-14 grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-purple-400/20 bg-purple-400/10 p-6 md:p-8">
            <h2 className="text-3xl font-black">Music Cues</h2>
            <div className="mt-6 grid gap-3">
              {musicCues.map((cue) => (
                <div key={cue} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm font-bold text-slate-200">
                  {cue}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-yellow-400/20 bg-yellow-400/10 p-6 md:p-8">
            <h2 className="text-3xl font-black">Director Rules</h2>
            <div className="mt-6 grid gap-3">
              {directorRules.map((rule) => (
                <div key={rule} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm font-bold text-slate-200">
                  ✓ {rule}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-14 rounded-3xl border border-red-400/20 bg-red-400/10 p-6 md:p-8">
          <h2 className="text-3xl font-black">Hard Safety Boundary</h2>
          <div className="mt-6 grid gap-3">
            {safetyBoundary.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm font-bold text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
