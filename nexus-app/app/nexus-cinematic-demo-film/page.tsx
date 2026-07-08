export default function NexusCinematicDemoFilmPage() {
  const emotionArc = [
    {
      phase: "01",
      name: "Chaos",
      feeling: "Business owner feels pressure, scattered tools, missed leads, risk, confusion.",
      screen: "Dark screen, rapid notifications, unresolved customer messages, dashboard fragments.",
    },
    {
      phase: "02",
      name: "Control",
      feeling: "NEXUS appears as the command layer. The system is not noisy. It is disciplined.",
      screen: "Slow reveal of NEXUS command dashboard with operating layers.",
    },
    {
      phase: "03",
      name: "Power",
      feeling: "Customer message becomes structured operating flow: memory, risk, owner approval, audit.",
      screen: "Animated flow: Input → Memory → Risk → Owner Approval → Audit → Safe Response.",
    },
    {
      phase: "04",
      name: "Trust",
      feeling: "NEXUS does not blindly execute. It protects the owner and the business.",
      screen: "Safety boundary, fallback, recovery, subscription lock, controlled demo gate.",
    },
    {
      phase: "05",
      name: "Command",
      feeling: "Customer understands this is not a chatbot. It is a business operating system.",
      screen: "Final hero lockup: NEXUS — AI Business Operating System.",
    },
  ];

  const teaserScenes = [
    {
      time: "0:00 - 0:05",
      title: "Black Screen / Bass Hit",
      visual: "Pure black. One deep cinematic impact. Tiny white text appears slowly.",
      text: "Every business has tools.",
      voice: "Every business has tools.",
      music: "Low bass pulse. No melody yet.",
    },
    {
      time: "0:05 - 0:13",
      title: "Business Chaos",
      visual: "Fast cuts: missed messages, angry customer, payment doubt, stock confusion, delivery pressure.",
      text: "But tools do not think together.",
      voice: "But tools do not think together.",
      music: "Rising tension, digital ticks, controlled pressure.",
    },
    {
      time: "0:13 - 0:22",
      title: "Old System Breakdown",
      visual: "Three panels flash: Chatbot, CRM, ERP. Each panel freezes, then fades.",
      text: "Chatbots answer. CRMs store. ERPs manage.",
      voice: "Chatbots answer. CRMs store. ERPs manage.",
      music: "Impact hit on every category.",
    },
    {
      time: "0:22 - 0:32",
      title: "NEXUS Reveal",
      visual: "Dark premium dashboard reveal. Slow camera push. NEXUS appears as operating layer.",
      text: "NEXUS operates.",
      voice: "But business needs an operating system. This is NEXUS.",
      music: "First major cinematic rise.",
    },
    {
      time: "0:32 - 0:47",
      title: "A-to-Z Operating Flow",
      visual: "Customer input flows into memory, risk detection, owner approval, audit log, safe response.",
      text: "Memory. Safety. Owner Approval. Audit. Recovery.",
      voice: "An AI Business Operating System built for memory, safety, owner approval, audit visibility, fallback, and controlled execution.",
      music: "Powerful hybrid trailer rhythm.",
    },
    {
      time: "0:47 - 0:57",
      title: "Owner In Command",
      visual: "Owner approval queue. Risky action remains locked until owner decision.",
      text: "The owner remains in command.",
      voice: "Not blind automation. Not chaos. The owner remains in command.",
      music: "Hero rise. Slow pulse.",
    },
    {
      time: "0:57 - 1:00",
      title: "Final Logo",
      visual: "NEXUS logo/title on dark background. One final clean impact.",
      text: "NEXUS — AI Business Operating System",
      voice: "NEXUS operates.",
      music: "Final trailer hit. Cut to silence.",
    },
  ];

  const mainFilmCoverage = [
    "Business chaos before NEXUS",
    "Why chatbot, CRM, ERP, and scattered automation are not enough",
    "NEXUS identity as AI Business Operating System",
    "Customer message enters NEXUS",
    "Customer memory and continuity concept",
    "Risk detection for pricing, payment, stock, delivery, refund, replacement, and sensitive actions",
    "Owner approval queue and decision control",
    "Safe response preparation",
    "Audit log and trace visibility",
    "Fallback and recovery readiness",
    "Subscription lock and entitlement boundary",
    "Public launch page",
    "Demo request page",
    "Feedback intake page",
    "Final message: NEXUS operates, owner remains in command",
  ];

  const visualLaws = [
    "Dark premium command-center look only.",
    "No cheap Canva-style animation.",
    "No cartoon characters.",
    "No fake customers.",
    "No real private data.",
    "No copyrighted movie clips.",
    "No copyrighted music.",
    "Every frame must communicate one business idea.",
    "Every transition must feel intentional.",
    "Dashboard must look like a business operating command layer, not a chatbot screen.",
    "Use slow zooms, clean typography, strong contrast, and precise motion.",
    "No overpromising: show controlled execution, not uncontrolled automation.",
  ];

  const soundDirection = [
    "Start with low bass tension.",
    "Use heartbeat-style pulse during chaos.",
    "Use deep impact hits for old-tool comparison.",
    "Use rising hybrid trailer music when NEXUS appears.",
    "Use clean silence before final logo for power.",
    "Music must be copyright-free or originally created.",
    "No happy corporate background music.",
    "No cheap tech intro music.",
  ];

  const directorChecklist = [
    "Viewer must understand NEXUS is not a chatbot.",
    "Viewer must understand NEXUS is not a CRM clone.",
    "Viewer must understand NEXUS is not an ERP clone.",
    "Viewer must feel NEXUS is an operating layer.",
    "Viewer must see owner approval.",
    "Viewer must see safety before execution.",
    "Viewer must see memory and continuity.",
    "Viewer must see audit visibility.",
    "Viewer must see fallback and recovery thinking.",
    "Viewer must see controlled demo path.",
    "Viewer must not see fake live customer execution.",
    "Viewer must not be asked for payment or signup.",
  ];

  const voiceover = `Every business has tools.

But tools do not think together.

Messages come in.
Risks hide inside decisions.
Customers expect speed.
Owners need control.

Chatbots answer.
CRMs store.
ERPs manage.

But business needs an operating system.

This is NEXUS.

An AI Business Operating System built for memory, safety, owner approval, audit visibility, fallback, and controlled execution.

NEXUS does not blindly execute.
It checks risk.
It protects decisions.
It keeps the owner in command.

Not chaos.
Not guesswork.
Not blind automation.

NEXUS operates.`;

  const reviewerMessage = `Hi, I’m building NEXUS — an AI Business Operating System.

Please watch this short cinematic demo first, then tell me if the idea is clear.

No signup. No payment. Just feedback.

Demo video:
[VIDEO LINK HERE]

Public page:
https://nexus-app-ten-smoky.vercel.app/nexus-public-launch`;

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
          World-Class Cinematic Direction — Zero Cheapness
        </div>

        <h1 className="mt-8 max-w-5xl text-4xl font-black tracking-tight md:text-6xl">
          NEXUS Cinematic Demo Film Upgrade
        </h1>

        <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
          This is the director-level upgrade for presenting NEXUS like a premium
          operating-system launch film. The goal is not a normal SaaS explainer.
          The goal is immediate clarity, command, power, and trust.
        </p>

        <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
          <h2 className="text-3xl font-black">Core Movie Positioning</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {["Chatbots answer.", "CRMs store.", "ERPs manage.", "NEXUS operates."].map((line) => (
              <div key={line} className="rounded-2xl border border-white/10 bg-slate-950/80 p-5 text-lg font-black">
                {line}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl font-black">Emotion Arc</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-5">
            {emotionArc.map((item) => (
              <div key={item.phase} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-sm font-black text-emerald-300">{item.phase}</p>
                <h3 className="mt-3 text-2xl font-black">{item.name}</h3>
                <p className="mt-4 text-sm leading-6 text-slate-300">{item.feeling}</p>
                <p className="mt-4 rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm font-bold text-slate-200">
                  {item.screen}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl font-black">60-Second Teaser — Shot by Shot</h2>
          <div className="mt-6 grid gap-5">
            {teaserScenes.map((scene) => (
              <div key={scene.time} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-black text-cyan-200">
                    {scene.time}
                  </span>
                  <span className="rounded-full border border-purple-400/30 bg-purple-400/10 px-3 py-1 text-xs font-black text-purple-200">
                    {scene.title}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-4">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Visual</p>
                    <p className="mt-3 text-sm leading-6 text-slate-200">{scene.visual}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Screen Text</p>
                    <p className="mt-3 text-sm font-black leading-6 text-white">{scene.text}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Voice</p>
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
          <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6 md:p-8">
            <h2 className="text-3xl font-black">Main Film A-to-Z Coverage</h2>
            <div className="mt-6 grid gap-3">
              {mainFilmCoverage.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm font-bold text-slate-200">
                  ✓ {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-red-400/20 bg-red-400/10 p-6 md:p-8">
            <h2 className="text-3xl font-black">Visual Laws</h2>
            <div className="mt-6 grid gap-3">
              {visualLaws.map((rule) => (
                <div key={rule} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm font-bold text-slate-200">
                  {rule}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-14 rounded-3xl border border-purple-400/20 bg-purple-400/10 p-6 md:p-8">
          <h2 className="text-3xl font-black">Sound and Music Direction</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {soundDirection.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm font-bold text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-3xl border border-yellow-400/20 bg-yellow-400/10 p-6 md:p-8">
          <h2 className="text-3xl font-black">Director Checklist</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {directorChecklist.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm font-bold text-slate-200">
                ✓ {item}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6 md:p-8">
          <h2 className="text-3xl font-black">Teaser Voiceover</h2>
          <pre className="mt-5 whitespace-pre-wrap rounded-2xl border border-white/10 bg-slate-950/80 p-5 text-sm leading-7 text-slate-200">
            {voiceover}
          </pre>
        </section>

        <section className="mt-14 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6 md:p-8">
          <h2 className="text-3xl font-black">Reviewer Message After Video Is Ready</h2>
          <pre className="mt-5 whitespace-pre-wrap rounded-2xl border border-white/10 bg-slate-950/80 p-5 text-sm leading-7 text-slate-200">
            {reviewerMessage}
          </pre>
        </section>

        <section className="mt-14 rounded-3xl border border-red-400/20 bg-red-400/10 p-6 md:p-8">
          <h2 className="text-3xl font-black">Hard Boundary</h2>
          <p className="mt-4 max-w-4xl text-base leading-8 text-slate-200">
            This page defines cinematic direction only. It does not claim uncontrolled live
            execution. It does not authorize open signup, payment collection, subscription
            activation, customer onboarding, customer data processing, or real execution.
            All visuals must be original or properly licensed, and all music must be
            copyright-free or originally created.
          </p>
        </section>
      </section>
    </main>
  );
}
