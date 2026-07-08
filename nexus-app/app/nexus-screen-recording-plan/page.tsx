export default function NexusScreenRecordingPlanPage() {
  const recordingSettings = [
    {
      label: "Browser",
      value: "Chrome / Edge only",
      reason: "Clean production look and stable screen recording.",
    },
    {
      label: "URL",
      value: "https://nexus-app-ten-smoky.vercel.app",
      reason: "Record live production pages only, not local dev screens.",
    },
    {
      label: "Zoom",
      value: "90% to 100%",
      reason: "Keep the dashboard premium, readable, and cinematic.",
    },
    {
      label: "Window",
      value: "Full browser window, bookmarks hidden",
      reason: "No clutter, no private tabs, no distraction.",
    },
    {
      label: "Audio",
      value: "No live microphone during raw screen recording",
      reason: "Voiceover and music will be added later cleanly.",
    },
    {
      label: "Data",
      value: "No real customer data, passwords, payments, or private records",
      reason: "NEXUS remains safety-locked and owner-controlled.",
    },
  ];

  const screenShots = [
    {
      no: "01",
      route: "/nexus-public-launch",
      duration: "8-10 sec",
      movement: "Slow hero reveal. Pause on NEXUS identity.",
      purpose: "Show public launch positioning and category.",
      mustShow: "AI Business Operating System, owner control, safety boundary.",
    },
    {
      no: "02",
      route: "/nexus-cinematic-demo-film",
      duration: "10-12 sec",
      movement: "Slow scroll through emotion arc and core movie positioning.",
      purpose: "Show movie-level direction and NEXUS operating identity.",
      mustShow: "Chatbots answer. CRMs store. ERPs manage. NEXUS operates.",
    },
    {
      no: "03",
      route: "/nexus-cinematic-demo-video",
      duration: "8-10 sec",
      movement: "Scroll through A-to-Z production package.",
      purpose: "Show full cinematic demo production depth.",
      mustShow: "Teaser, main demo film, owner walkthrough.",
    },
    {
      no: "04",
      route: "/nexus-demo-request",
      duration: "6-8 sec",
      movement: "Pause on controlled demo request section.",
      purpose: "Show safe next action without open signup.",
      mustShow: "No payment, no private data, owner-reviewed demo path.",
    },
    {
      no: "05",
      route: "/nexus-reviewer-outreach",
      duration: "6-8 sec",
      movement: "Slow scroll through reviewer outreach message.",
      purpose: "Show controlled reviewer flow.",
      mustShow: "Feedback-only outreach, no selling pressure.",
    },
    {
      no: "06",
      route: "/nexus-outreach-tracker",
      duration: "6-8 sec",
      movement: "Pause on manual outreach tracker.",
      purpose: "Show disciplined validation tracking.",
      mustShow: "Pending, accepted, replied, feedback, next action.",
    },
    {
      no: "07",
      route: "/nexus-response-handler",
      duration: "8-10 sec",
      movement: "Scroll through response cases.",
      purpose: "Show exact reply handling without overpromising.",
      mustShow: "Accepted connection, confused reply, demo request, pricing question.",
    },
    {
      no: "08",
      route: "/nexus-feedback-intake",
      duration: "8-10 sec",
      movement: "Pause on seven feedback questions.",
      purpose: "Show structured review intake.",
      mustShow: "Clarity, differentiation, powerful point, confusion, demo interest, trust score.",
    },
  ];

  const recordingFlow = [
    "Open only one clean browser window.",
    "Close WhatsApp, LinkedIn, email, downloads, and private tabs.",
    "Open the production URL.",
    "Record each route in the order listed.",
    "Move mouse slowly and only when needed.",
    "Do not click random buttons.",
    "Do not show terminal, GitHub, Vercel, environment files, or private accounts.",
    "Stop recording after final feedback intake screen.",
    "Save raw recording as NEXUS-RAW-SCREEN-RECORDING-DAY-581.mp4.",
  ];

  const cameraRules = [
    "Every screen must feel like a command center.",
    "No fast shaking mouse movement.",
    "No accidental scroll jumps.",
    "No private browser notifications.",
    "No cheap zoom effects during raw recording.",
    "Pause on important text for at least two seconds.",
    "Keep the screen clean, dark, premium, and readable.",
    "Record in landscape format only.",
  ];

  const safetyBoundary = [
    "No real customer data",
    "No payment details",
    "No passwords",
    "No private business records",
    "No fake live customers",
    "No uncontrolled execution claim",
    "No open signup claim",
    "No subscription activation claim",
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

        <div className="mt-8 w-fit rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200">
          Cinematic Screen Recording Plan — Production Safe
        </div>

        <h1 className="mt-8 max-w-5xl text-4xl font-black tracking-tight md:text-6xl">
          NEXUS Screen Recording Plan
        </h1>

        <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
          This plan defines exactly what to record for the NEXUS cinematic demo film.
          The raw recording must show only clean production pages, controlled motion,
          premium visual discipline, and zero private data.
        </p>

        <section className="mt-10 grid gap-5 md:grid-cols-3">
          {recordingSettings.map((item) => (
            <div key={item.label} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
              <h2 className="mt-3 text-xl font-black">{item.value}</h2>
              <p className="mt-4 text-sm leading-6 text-slate-300">{item.reason}</p>
            </div>
          ))}
        </section>

        <section className="mt-14">
          <h2 className="text-3xl font-black">Recording Shot List</h2>
          <div className="mt-6 grid gap-5">
            {screenShots.map((shot) => (
              <div key={shot.no} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-black text-emerald-200">
                    SHOT {shot.no}
                  </span>
                  <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-black text-cyan-200">
                    {shot.duration}
                  </span>
                  <span className="rounded-full border border-purple-400/30 bg-purple-400/10 px-3 py-1 text-xs font-black text-purple-200">
                    {shot.route}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Movement</p>
                    <p className="mt-3 text-sm leading-6 text-slate-200">{shot.movement}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Purpose</p>
                    <p className="mt-3 text-sm leading-6 text-slate-200">{shot.purpose}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Must Show</p>
                    <p className="mt-3 text-sm font-bold leading-6 text-white">{shot.mustShow}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6 md:p-8">
            <h2 className="text-3xl font-black">Recording Flow</h2>
            <div className="mt-6 grid gap-3">
              {recordingFlow.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm font-bold text-slate-200">
                  ✓ {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-purple-400/20 bg-purple-400/10 p-6 md:p-8">
            <h2 className="text-3xl font-black">Camera Rules</h2>
            <div className="mt-6 grid gap-3">
              {cameraRules.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm font-bold text-slate-200">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-14 rounded-3xl border border-red-400/20 bg-red-400/10 p-6 md:p-8">
          <h2 className="text-3xl font-black">Hard Safety Boundary</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {safetyBoundary.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm font-bold text-slate-200">
                {item}
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-4xl text-base leading-8 text-slate-200">
            This page creates the screen recording plan only. It does not authorize open signup,
            payment collection, subscription activation, customer onboarding, customer data
            processing, or real execution.
          </p>
        </section>
      </section>
    </main>
  );
}
