export default function NexusPpaOwnerApprovalPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <section className="mx-auto max-w-5xl">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-300">
          Controlled internal owner review
        </p>
        <h1 className="mt-4 text-4xl font-black">
          PPA Industrial Solution Owner Approval and Safe Reply Draft
        </h1>
        <p className="mt-4 leading-7 text-slate-300">
          NEXUS prepares internal draft evidence but does not make external
          commitments without the authenticated owner decision.
        </p>

        <h2 className="mt-8 text-2xl font-black text-emerald-200">
          Owner approval actions
        </h2>
        <ul className="mt-4 space-y-3 text-slate-300">
          <li>Review the detected product, quantity, city, urgency and use case.</li>
          <li>Edit the safe draft before any later authorized workflow.</li>
          <li>Approve, reject or request more information.</li>
          <li>Keep price, delivery, warranty and payment commitments locked.</li>
        </ul>

        <h2 className="mt-8 text-2xl font-black text-amber-200">
          Sample internal inquiry
        </h2>
        <p className="mt-4 leading-7 text-slate-300">
          A customer requests warehouse safety signage and asks for price,
          delivery timing, installation support and warranty details.
        </p>

        <h2 className="mt-8 text-2xl font-black text-cyan-200">
          Safe draft before approval
        </h2>
        <p className="mt-4 leading-7 text-slate-300">
          Thank you for the inquiry. Please confirm quantity, installation
          location, city and required timeline. Final price, delivery, warranty,
          installation and payment terms require owner review.
        </p>

        <h2 className="mt-8 text-2xl font-black text-red-200">
          Risk flags and locked boundary
        </h2>
        <ul className="mt-4 space-y-3 text-slate-300">
          <li>No automatic price or discount commitment.</li>
          <li>No automatic delivery, warranty or installation promise.</li>
          <li>No automatic payment, refund or compliance claim.</li>
          <li>Public launch and external customer contact remain unauthorized.</li>
        </ul>
      </section>
    </main>
  );
}