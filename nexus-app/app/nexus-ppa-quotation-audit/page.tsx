export default function NexusPpaQuotationAuditPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <section className="mx-auto max-w-5xl">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-300">
          Controlled internal quotation preview
        </p>
        <h1 className="mt-4 text-4xl font-black">
          PPA Industrial Solution Quotation Draft and Audit Record
        </h1>
        <p className="mt-4 leading-7 text-slate-300">
          This page documents a static quotation-draft and audit preview. It
          does not generate, send or execute a real customer quotation.
        </p>

        <h2 className="mt-8 text-2xl font-black text-emerald-200">
          Quotation draft fields
        </h2>
        <ul className="mt-4 space-y-3 text-slate-300">
          <li>Customer reference, product, quantity and city.</li>
          <li>Owner-reviewed price and validity placeholders.</li>
          <li>Delivery, installation, warranty and payment notes.</li>
          <li>Draft status and required next owner action.</li>
        </ul>

        <h2 className="mt-8 text-2xl font-black text-cyan-200">
          Sample quotation draft
        </h2>
        <p className="mt-4 leading-7 text-slate-300">
          Draft only: warehouse safety signage, quantity pending confirmation,
          price pending owner approval, delivery and warranty not committed.
        </p>

        <h2 className="mt-8 text-2xl font-black text-amber-200">
          Audit record
        </h2>
        <ul className="mt-4 space-y-3 text-slate-300">
          <li>Inquiry reference and detected requirements recorded.</li>
          <li>Risk flags and owner decision state recorded.</li>
          <li>Quotation remains a non-delivered internal draft.</li>
        </ul>

        <h2 className="mt-8 text-2xl font-black text-red-200">
          Follow-up and locked boundary
        </h2>
        <ul className="mt-4 space-y-3 text-slate-300">
          <li>Follow-up remains pending owner-controlled review.</li>
          <li>Public launch and real quotation delivery remain blocked.</li>
          <li>Payment execution and customer contact remain unauthorized.</li>
        </ul>
      </section>
    </main>
  );
}