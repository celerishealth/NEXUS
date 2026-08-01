export default function NexusPpaOperatingSummaryPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <section className="mx-auto max-w-5xl">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-300">
          Controlled internal pilot summary
        </p>
        <h1 className="mt-4 text-4xl font-black">
          PPA Industrial Solution Internal Pilot Operating Summary
        </h1>

        <h2 className="mt-8 text-2xl font-black text-emerald-200">
          Available preview capabilities
        </h2>
        <ul className="mt-4 space-y-3 text-slate-300">
          <li>Review a synthetic or sanitized customer inquiry.</li>
          <li>Inspect detected requirements and risk flags.</li>
          <li>Review a safe internal response draft.</li>
          <li>Preview quotation, audit and follow-up states.</li>
        </ul>

        <h2 className="mt-8 text-2xl font-black text-cyan-200">
          Controlled sequence
        </h2>
        <ol className="mt-4 space-y-3 text-slate-300">
          <li>Inquiry evidence is recorded for internal review.</li>
          <li>NEXUS prepares bounded analysis and a draft.</li>
          <li>The owner reviews, edits, approves or rejects.</li>
          <li>Only preview and sandbox evidence may continue.</li>
        </ol>

        <h2 className="mt-8 text-2xl font-black text-red-200">
          Disabled authority
        </h2>
        <ul className="mt-4 space-y-3 text-slate-300">
          <li>Public launch remains blocked.</li>
          <li>Payment, billing and customer signup remain disabled.</li>
          <li>External sending and live provider execution remain unauthorized.</li>
        </ul>
      </section>
    </main>
  );
}