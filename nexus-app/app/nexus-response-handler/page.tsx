export default function NexusResponseHandlerPage() {
  const responseTypes = [
    {
      type: "Accepted connection",
      action: "Send the public launch page link and ask for clarity feedback.",
      message:
        "Thanks for connecting. I’m building NEXUS — an AI Business Operating System.\n\nCan you review this one page and tell me if the idea is clear?\n\nhttps://nexus-app-ten-smoky.vercel.app/nexus-public-launch\n\nNo signup. No payment. Just feedback.",
    },
    {
      type: "Positive reply",
      action: "Ask the 7 feedback questions. Do not sell yet.",
      message:
        "Thank you. Please check only clarity and trust first:\n\n1. Do you understand NEXUS within 60 seconds?\n2. Does it feel different from chatbot/CRM/ERP?\n3. What feels most powerful?\n4. What feels confusing?\n5. Would you request a controlled demo?",
    },
    {
      type: "Confused reply",
      action: "Clarify in one short message. Do not over-explain.",
      message:
        "NEXUS is an AI Business Operating System. It helps position owner-controlled business operations with safety boundaries, audit visibility, customer memory concepts, fallback planning, and phased rollout. It is not a chatbot or CRM.",
    },
    {
      type: "Asks for demo",
      action: "Send demo request page. No automatic access.",
      message:
        "Great. Please use this owner-reviewed demo request page:\n\nhttps://nexus-app-ten-smoky.vercel.app/nexus-demo-request\n\nDo not send customer data, payment details, passwords, or private business records. Access is reviewed manually.",
    },
    {
      type: "Asks price",
      action: "Do not quote randomly. Keep paid pilot owner-controlled.",
      message:
        "Pricing is not open publicly yet. NEXUS is currently in controlled review. Paid pilot access will be owner-reviewed, limited-scope, and safety-gated.",
    },
    {
      type: "No reply",
      action: "Do nothing for 48 hours. No spam.",
      message:
        "No follow-up immediately. Wait 48 hours. If still no response, send one short follow-up only.",
    },
  ];

  const hardBoundaries = [
    "No uncontrolled signup",
    "No payment collection",
    "No subscription activation",
    "No customer onboarding",
    "No customer data processing",
    "No real execution",
    "No overpromising",
    "No fake readiness",
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto w-full max-w-6xl px-6 py-12 md:px-10">
        <a
          href="/nexus-public-launch"
          className="text-sm font-bold text-emerald-300 hover:text-emerald-200"
        >
          ← Back to NEXUS Public Launch
        </a>

        <div className="mt-8 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200 w-fit">
          Outreach Response Handling — Owner-Controlled
        </div>

        <h1 className="mt-8 text-4xl font-black tracking-tight md:text-6xl">
          First Reply Handling System
        </h1>

        <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
          Use this page when someone accepts, replies, asks for a demo, asks for pricing,
          or does not reply. Keep every response controlled, clear, and safety-locked.
        </p>

        <section className="mt-10 grid gap-5">
          {responseTypes.map((item, index) => (
            <div key={item.type} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <p className="text-sm font-black text-emerald-300">CASE {index + 1}</p>
              <h2 className="mt-2 text-2xl font-black">{item.type}</h2>
              <p className="mt-3 text-sm font-bold text-cyan-200">{item.action}</p>
              <pre className="mt-5 whitespace-pre-wrap rounded-2xl border border-white/10 bg-slate-950/80 p-5 text-sm leading-7 text-slate-200">
                {item.message}
              </pre>
            </div>
          ))}
        </section>

        <section className="mt-14 rounded-3xl border border-red-400/20 bg-red-400/10 p-6 md:p-8">
          <h2 className="text-3xl font-black">Hard Boundary</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {hardBoundaries.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm font-bold">
                {item}
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
