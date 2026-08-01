export default function NexusPpaRiskEnginePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <section className="mx-auto max-w-5xl">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-300">
          Controlled internal risk preview
        </p>
        <h1 className="mt-4 text-4xl font-black">
          PPA Industrial Solution Risk Engine Rules
        </h1>
        <p className="mt-4 leading-7 text-slate-300">
          These static rules protect the PPA internal NEXUS preview while
          preserving owner authority and reusable sector boundaries.
        </p>

        <h2 className="mt-8 text-2xl font-black text-red-200">
          Blocked until owner approval
        </h2>
        <ul className="mt-4 space-y-3 text-slate-300">
          <li>Final price, discount and negotiation terms.</li>
          <li>Fixed delivery dates, installation promises and site visits.</li>
          <li>Warranty, replacement, refund and return commitments.</li>
          <li>Advance, credit, invoice, GST and payment terms.</li>
          <li>Safety, compliance, certification and performance claims.</li>
        </ul>

        <h2 className="mt-8 text-2xl font-black text-emerald-200">
          Safe allowed draft behavior
        </h2>
        <ul className="mt-4 space-y-3 text-slate-300">
          <li>Ask for quantity, city, location, use case and required timeline.</li>
          <li>Identify missing specifications without inventing facts.</li>
          <li>State that commercial and technical commitments require owner approval.</li>
        </ul>

        <h2 className="mt-8 text-2xl font-black text-cyan-200">
          Owner approval actions
        </h2>
        <ul className="mt-4 space-y-3 text-slate-300">
          <li>Approve, edit, reject or request more information.</li>
          <li>Keep the inquiry in internal preview or bounded sandbox status.</li>
          <li>Record the decision without authorizing external execution.</li>
        </ul>

        <h2 className="mt-8 text-2xl font-black text-red-200">
          Locked boundary
        </h2>
        <p className="mt-4 leading-7 text-slate-300">
          Public launch, payment execution, customer contact, live provider
          execution and uncontrolled AI actions remain unauthorized.
        </p>
      </section>
    </main>
  );
}