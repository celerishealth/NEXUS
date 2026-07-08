export default function NexusOutreachTrackerPage() {
  const targetRules = [
    "Founder",
    "CEO",
    "Business Owner",
    "AI Automation Founder",
    "Agency Owner",
    "E-commerce / D2C Owner",
    "Operations Lead",
  ];

  const avoidRules = [
    "Students",
    "Job seekers",
    "Irrelevant employees",
    "Profiles with no business context",
    "Mass random outreach",
    "Payment or signup pressure",
  ];

  const trackerRows = [
    {
      no: "01",
      name: "Ajay Singh",
      type: "Founder & CEO",
      channel: "LinkedIn",
      status: "Sent / Pending",
      next: "Wait for accept",
    },
    {
      no: "02",
      name: "Sudhanshu Bharane",
      type: "Director / research",
      channel: "LinkedIn",
      status: "Withdrawn",
      next: "Skip for 3 weeks",
    },
    {
      no: "03",
      name: "Next founder / owner",
      type: "Founder / owner",
      channel: "LinkedIn",
      status: "To send",
      next: "Send without note",
    },
  ];

  const acceptedMessage = `Thanks for connecting. I’m building NEXUS — an AI Business Operating System.

Can you review this one page and tell me if the idea is clear?

https://nexus-app-ten-smoky.vercel.app/nexus-public-launch

No signup. No payment. Just feedback.`;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto w-full max-w-6xl px-6 py-12 md:px-10">
        <a
          href="/nexus-public-launch"
          className="text-sm font-bold text-emerald-300 hover:text-emerald-200"
        >
          ← Back to NEXUS Public Launch
        </a>

        <div className="mt-8 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-200 w-fit">
          First Outreach Tracking — Safety-Locked
        </div>

        <h1 className="mt-8 text-4xl font-black tracking-tight md:text-6xl">
          NEXUS Outreach Tracker
        </h1>

        <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
          Track controlled reviewer outreach after public deployment. LinkedIn custom notes are limited,
          so continue with connection requests without notes and send the NEXUS link only after acceptance.
        </p>

        <section className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6">
            <h2 className="text-2xl font-black">Target Profiles</h2>
            <div className="mt-5 grid gap-3">
              {targetRules.map((rule) => (
                <div key={rule} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm font-bold">
                  ✓ {rule}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-red-400/20 bg-red-400/10 p-6">
            <h2 className="text-2xl font-black">Avoid</h2>
            <div className="mt-5 grid gap-3">
              {avoidRules.map((rule) => (
                <div key={rule} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm font-bold">
                  {rule}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-14 rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
          <h2 className="text-3xl font-black">Manual Outreach Log</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Update this manually while sending requests. Keep outreach controlled. Do not spam.
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[760px] border-separate border-spacing-y-3 text-left text-sm">
              <thead>
                <tr className="text-slate-400">
                  <th className="px-4">No.</th>
                  <th className="px-4">Name</th>
                  <th className="px-4">Profile Type</th>
                  <th className="px-4">Channel</th>
                  <th className="px-4">Status</th>
                  <th className="px-4">Next Action</th>
                </tr>
              </thead>
              <tbody>
                {trackerRows.map((row) => (
                  <tr key={row.no} className="rounded-2xl bg-slate-900/80">
                    <td className="rounded-l-2xl px-4 py-4 font-black text-emerald-300">{row.no}</td>
                    <td className="px-4 py-4 font-bold text-white">{row.name}</td>
                    <td className="px-4 py-4 text-slate-200">{row.type}</td>
                    <td className="px-4 py-4 text-slate-200">{row.channel}</td>
                    <td className="px-4 py-4 text-slate-200">{row.status}</td>
                    <td className="rounded-r-2xl px-4 py-4 text-slate-200">{row.next}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-14 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6 md:p-8">
          <h2 className="text-3xl font-black">Message After Acceptance</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Send this only after the connection request is accepted.
          </p>
          <pre className="mt-5 whitespace-pre-wrap rounded-2xl border border-white/10 bg-slate-950/80 p-5 text-sm leading-7 text-slate-200">
            {acceptedMessage}
          </pre>
        </section>

        <section className="mt-14 rounded-3xl border border-red-400/20 bg-red-400/10 p-6 md:p-8">
          <h2 className="text-3xl font-black">Hard Boundary</h2>
          <p className="mt-4 max-w-4xl text-base leading-8 text-slate-200">
            This outreach tracker does not authorize open signup, payment collection, subscription activation,
            customer onboarding, customer data processing, or real execution. It is feedback-only and owner-controlled.
          </p>
        </section>
      </section>
    </main>
  );
}
