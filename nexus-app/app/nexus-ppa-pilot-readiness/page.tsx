export default function NexusPpaPilotReadinessPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <section className="mx-auto max-w-5xl">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-300">
          Controlled internal pilot readiness
        </p>
        <h1 className="mt-4 text-4xl font-black">
          PPA Industrial Solution Internal Pilot Readiness Review
        </h1>
        <p className="mt-4 leading-7 text-slate-300">
          This review records the bounded preview foundation for the first
          internal NEXUS business tenant.
        </p>

        <h2 className="mt-8 text-2xl font-black text-emerald-200">
          Ready foundation
        </h2>
        <ul className="mt-4 space-y-3 text-slate-300">
          <li>PPA tenant and industrial safety sector context are defined.</li>
          <li>Inquiry, risk, draft, owner review and quotation previews exist.</li>
          <li>Audit and follow-up evidence remain visible.</li>
          <li>Owner approval and risk locks remain active.</li>
        </ul>

        <h2 className="mt-8 text-2xl font-black text-red-200">
          Readiness exclusions
        </h2>
        <ul className="mt-4 space-y-3 text-slate-300">
          <li>Public launch is blocked.</li>
          <li>Customer signup, payment and billing are disabled.</li>
          <li>Real customer inbox and WhatsApp auto-send are unauthorized.</li>
          <li>Live execution and uncontrolled AI authority remain off.</li>
        </ul>
      </section>
    </main>
  );
}