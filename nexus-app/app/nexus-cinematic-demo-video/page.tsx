export default function NexusCinematicDemoVideoPage() {
  const movieStructure = [
    {
      act: "ACT 01",
      title: "The Business Chaos",
      duration: "0:00 - 0:20",
      visual: "Fast cuts: WhatsApp messages, missed leads, manual follow-ups, customer pressure, owner stress, scattered tools.",
      voiceover:
        "Businesses do not fail because they lack tools. They fail because tools do not think together.",
      screenText: "Too many tools. No operating brain.",
    },
    {
      act: "ACT 02",
      title: "Old Tools Are Not Enough",
      duration: "0:20 - 0:40",
      visual: "Three cinematic panels: Chatbot answers, CRM stores, ERP manages. Then the screen goes dark.",
      voiceover:
        "Chatbots answer. CRMs store. ERPs manage. But business needs something deeper — an operating system.",
      screenText: "Chatbot ≠ Business OS. CRM ≠ Business OS. ERP ≠ Business OS.",
    },
    {
      act: "ACT 03",
      title: "NEXUS Enters",
      duration: "0:40 - 1:00",
      visual: "Premium dark dashboard reveal. Slow zoom. NEXUS appears as the operating layer above customer memory, safety, owner approval, audit logs, and fallback.",
      voiceover:
        "NEXUS is an AI Business Operating System. It connects business memory, safety, owner control, audit visibility, and controlled execution into one operating layer.",
      screenText: "NEXUS — AI Business Operating System",
    },
    {
      act: "ACT 04",
      title: "Customer Message Comes In",
      duration: "1:00 - 1:25",
      visual: "A customer asks a business question. NEXUS receives the request and classifies it.",
      voiceover:
        "When a customer message comes in, NEXUS does not blindly answer. It first understands the context, detects risk, checks boundaries, and prepares a safe path.",
      screenText: "Input → Context → Risk Check",
    },
    {
      act: "ACT 05",
      title: "Risk Detection",
      duration: "1:25 - 1:50",
      visual: "Risk detector highlights pricing, payment, delivery, stock, refund, and replacement risk.",
      voiceover:
        "Pricing, payment, delivery, refund, stock, replacement, and sensitive actions are treated as controlled risk zones.",
      screenText: "Zero Damage before speed.",
    },
    {
      act: "ACT 06",
      title: "Owner Approval",
      duration: "1:50 - 2:15",
      visual: "Owner approval queue appears. Pending, approved, rejected states show clearly.",
      voiceover:
        "NEXUS keeps the owner in control. Risky actions wait for owner approval instead of executing silently.",
      screenText: "Owner remains in command.",
    },
    {
      act: "ACT 07",
      title: "Customer Memory",
      duration: "2:15 - 2:40",
      visual: "Customer memory layer shows safe preview cards: preference, history, prior issue, last interaction. No real private data shown.",
      voiceover:
        "NEXUS is continuity-first. It is designed around business memory, so every interaction can become more consistent, more controlled, and more useful over time.",
      screenText: "Memory creates continuity.",
    },
    {
      act: "ACT 08",
      title: "Audit Logs",
      duration: "2:40 - 3:00",
      visual: "Audit timeline shows: request received, risk detected, owner decision, safe response prepared.",
      voiceover:
        "Every important step needs traceability. NEXUS is built with audit visibility so decisions are not invisible.",
      screenText: "Every action needs a trace.",
    },
    {
      act: "ACT 09",
      title: "Fallback and Recovery",
      duration: "3:00 - 3:25",
      visual: "System detects failure. Instead of crashing, it moves to fallback and recovery state.",
      voiceover:
        "When systems fail, business should not stop. NEXUS is designed with fallback and recovery thinking.",
      screenText: "Zero Stop is the direction.",
    },
    {
      act: "ACT 10",
      title: "Subscription Lock",
      duration: "3:25 - 3:45",
      visual: "Access gate shows plan, entitlement, lock, review state, and disabled risky access.",
      voiceover:
        "Access must be controlled. Paid pilot, subscription, and entitlement boundaries are not random buttons. They are safety gates.",
      screenText: "Access is controlled. Execution is gated.",
    },
    {
      act: "ACT 11",
      title: "NEXUS Operating Flow",
      duration: "3:45 - 4:20",
      visual: "Full A-to-Z flow animates: customer message → memory → risk → owner approval → audit → response → recovery → dashboard.",
      voiceover:
        "This is the NEXUS operating flow: customer input, memory, risk check, owner approval, audit log, safe response, recovery readiness, and business visibility.",
      screenText: "A-to-Z business operating flow.",
    },
    {
      act: "ACT 12",
      title: "Final Positioning",
      duration: "4:20 - 4:45",
      visual: "Final cinematic hero screen with NEXUS logo, public page, and controlled demo request.",
      voiceover:
        "NEXUS is not a chatbot. Not a CRM clone. Not an ERP clone. It is an AI Business Operating System built for owner-controlled business operations.",
      screenText: "NEXUS — Built for controlled business operation.",
    },
  ];

  const shotRules = [
    "Every scene must show one clear idea only.",
    "No clutter, no cheap animation, no fake automation claims.",
    "Use dark premium UI, slow zooms, sharp text, and clean transitions.",
    "Show NEXUS as operating layer, not as a chatbot.",
    "Show safety, owner approval, audit logs, customer memory, fallback, and subscription lock.",
    "Use only original visuals and copyright-free music.",
    "Do not show real customer data, passwords, payments, private business records, or fake live customers.",
  ];

  const videoVersions = [
    {
      name: "Teaser",
      length: "45-60 seconds",
      goal: "Break attention and make people understand the category.",
      use: "LinkedIn first message after acceptance.",
    },
    {
      name: "Main Demo Film",
      length: "3-5 minutes",
      goal: "Explain NEXUS A-to-Z with cinematic story and dashboard flow.",
      use: "Serious reviewer feedback.",
    },
    {
      name: "Owner Walkthrough",
      length: "6-8 minutes",
      goal: "Explain full internal logic, safety boundary, and controlled launch model.",
      use: "Trusted founder / serious operator review.",
    },
  ];

  const demoChecklist = [
    "Open with business chaos.",
    "Explain why chatbot, CRM, and ERP are not enough.",
    "Reveal NEXUS as AI Business Operating System.",
    "Show customer input flow.",
    "Show AI risk detection.",
    "Show owner approval queue.",
    "Show customer memory concept.",
    "Show audit log traceability.",
    "Show fallback and recovery readiness.",
    "Show subscription and entitlement lock.",
    "Show controlled demo request path.",
    "Close with safety-locked public launch boundary.",
  ];

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
          Cinematic Demo Video Production — A-to-Z
        </div>

        <h1 className="mt-8 max-w-5xl text-4xl font-black tracking-tight md:text-6xl">
          NEXUS Movie-Level Demo Blueprint
        </h1>

        <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
          NEXUS must be understood visually. This package defines the cinematic demo film
          structure, scene-by-scene story, voiceover, screen text, production rules, and
          reviewer message for high-quality public validation.
        </p>

        <section className="mt-10 grid gap-5 md:grid-cols-3">
          {videoVersions.map((video) => (
            <div key={video.name} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <h2 className="text-2xl font-black">{video.name}</h2>
              <p className="mt-3 text-sm font-bold text-purple-200">{video.length}</p>
              <p className="mt-4 text-sm leading-6 text-slate-300">{video.goal}</p>
              <p className="mt-4 rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm font-bold text-slate-200">
                Use: {video.use}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-14">
          <h2 className="text-3xl font-black">Main Demo Film — Scene-by-Scene</h2>
          <div className="mt-6 grid gap-5">
            {movieStructure.map((scene) => (
              <div key={scene.act} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-black text-emerald-200">
                    {scene.act}
                  </span>
                  <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-black text-cyan-200">
                    {scene.duration}
                  </span>
                </div>
                <h3 className="mt-5 text-2xl font-black">{scene.title}</h3>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Visual</p>
                    <p className="mt-3 text-sm leading-6 text-slate-200">{scene.visual}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Voiceover</p>
                    <p className="mt-3 text-sm leading-6 text-slate-200">{scene.voiceover}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Screen Text</p>
                    <p className="mt-3 text-sm font-black leading-6 text-white">{scene.screenText}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6 md:p-8">
            <h2 className="text-3xl font-black">A-to-Z Demo Checklist</h2>
            <div className="mt-6 grid gap-3">
              {demoChecklist.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm font-bold text-slate-200">
                  ✓ {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-red-400/20 bg-red-400/10 p-6 md:p-8">
            <h2 className="text-3xl font-black">Production Rules</h2>
            <div className="mt-6 grid gap-3">
              {shotRules.map((rule) => (
                <div key={rule} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm font-bold text-slate-200">
                  {rule}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-14 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6 md:p-8">
          <h2 className="text-3xl font-black">Message After Video Is Ready</h2>
          <pre className="mt-5 whitespace-pre-wrap rounded-2xl border border-white/10 bg-slate-950/80 p-5 text-sm leading-7 text-slate-200">
            {reviewerMessage}
          </pre>
        </section>

        <section className="mt-14 rounded-3xl border border-red-400/20 bg-red-400/10 p-6 md:p-8">
          <h2 className="text-3xl font-black">Hard Boundary</h2>
          <p className="mt-4 max-w-4xl text-base leading-8 text-slate-200">
            This package creates the video production blueprint only. It does not claim
            that NEXUS is executing live customer operations. It does not authorize open
            signup, payment collection, subscription activation, customer onboarding,
            customer data processing, or real execution.
          </p>
        </section>
      </section>
    </main>
  );
}
