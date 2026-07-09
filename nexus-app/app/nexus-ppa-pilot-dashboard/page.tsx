export default function NexusPpaPilotDashboardPage() {
  return (
    <main className='min-h-screen bg-slate-950 px-6 py-10 text-white'>
      <section className='mx-auto max-w-7xl'>
        <div className='rounded-[2rem] border border-cyan-400/30 bg-slate-900 p-8 shadow-2xl shadow-cyan-950/40'>
          <p className='text-sm font-bold uppercase tracking-[0.35em] text-cyan-300'>Day 606 - Premium Internal Pilot Dashboard</p>
          <h1 className='mt-5 text-4xl font-black tracking-tight md:text-6xl'>PPA Industrial Solution NEXUS Pilot Dashboard</h1>
          <p className='mt-5 max-w-4xl text-lg leading-8 text-slate-300'>A premium preview of the complete PPA operating loop inside NEXUS. Inquiry, risk, draft, approval, quotation, audit, memory and follow-up are visible together while real execution remains disabled.</p>
          <div className='mt-8 grid gap-4 md:grid-cols-4'>
            <div className='rounded-2xl border border-emerald-400/30 bg-emerald-950/30 p-4 font-black text-emerald-200'>Owner Approval ON</div>
            <div className='rounded-2xl border border-amber-400/30 bg-amber-950/30 p-4 font-black text-amber-200'>Risk Lock ON</div>
            <div className='rounded-2xl border border-cyan-400/30 bg-cyan-950/30 p-4 font-black text-cyan-200'>Audit Visible</div>
            <div className='rounded-2xl border border-red-400/30 bg-red-950/30 p-4 font-black text-red-200'>Execution OFF</div>
          </div>
        </div>

        <section className='mt-8 grid gap-5 lg:grid-cols-3'>
          <div className='rounded-3xl border border-white/10 bg-white/5 p-6'>
            <p className='text-xs font-bold uppercase tracking-[0.25em] text-cyan-300'>01 Inquiry</p>
            <h2 className='mt-3 text-2xl font-black'>Customer Request</h2>
            <p className='mt-3 leading-7 text-slate-300'>Customer asks for logo projector light, safety belt, warehouse safety item, signage or custom industrial safety product.</p>
          </div>

          <div className='rounded-3xl border border-white/10 bg-white/5 p-6'>
            <p className='text-xs font-bold uppercase tracking-[0.25em] text-cyan-300'>02 Understanding</p>
            <h2 className='mt-3 text-2xl font-black'>NEXUS Detection</h2>
            <p className='mt-3 leading-7 text-slate-300'>NEXUS identifies product, quantity, city, urgency, use case, installation need and missing details.</p>
          </div>

          <div className='rounded-3xl border border-white/10 bg-white/5 p-6'>
            <p className='text-xs font-bold uppercase tracking-[0.25em] text-amber-300'>03 Risk</p>
            <h2 className='mt-3 text-2xl font-black'>Risk Flags</h2>
            <p className='mt-3 leading-7 text-slate-300'>Price, discount, delivery, warranty, installation, payment, replacement and claim risks stay locked.</p>
          </div>

          <div className='rounded-3xl border border-white/10 bg-white/5 p-6'>
            <p className='text-xs font-bold uppercase tracking-[0.25em] text-emerald-300'>04 Draft</p>
            <h2 className='mt-3 text-2xl font-black'>Safe Reply</h2>
            <p className='mt-3 leading-7 text-slate-300'>NEXUS prepares a safe internal reply draft and asks for missing details without making external commitments.</p>
          </div>

          <div className='rounded-3xl border border-white/10 bg-white/5 p-6'>
            <p className='text-xs font-bold uppercase tracking-[0.25em] text-emerald-300'>05 Approval</p>
            <h2 className='mt-3 text-2xl font-black'>Owner Control</h2>
            <p className='mt-3 leading-7 text-slate-300'>Owner can approve, edit, reject, ask for more details or create quotation draft after review.</p>
          </div>

          <div className='rounded-3xl border border-white/10 bg-white/5 p-6'>
            <p className='text-xs font-bold uppercase tracking-[0.25em] text-cyan-300'>06 Quotation</p>
            <h2 className='mt-3 text-2xl font-black'>Draft Quote</h2>
            <p className='mt-3 leading-7 text-slate-300'>Quotation shell includes customer, product, quantity, city, approved price, delivery note, warranty note, payment terms and validity.</p>
          </div>
        </section>

        <section className='mt-8 grid gap-5 lg:grid-cols-2'>
          <div className='rounded-[2rem] border border-cyan-400/20 bg-cyan-950/20 p-8'>
            <h2 className='text-3xl font-black text-cyan-200'>Audit and Memory Panel</h2>
            <ul className='mt-5 space-y-3 text-slate-300'>
              <li>Inquiry state recorded.</li>
              <li>Risk flags recorded.</li>
              <li>Owner decision recorded.</li>
              <li>Quotation state recorded.</li>
              <li>Customer memory state updated.</li>
              <li>Follow-up state marked for next action.</li>
            </ul>
          </div>

          <div className='rounded-[2rem] border border-red-400/20 bg-red-950/20 p-8'>
            <h2 className='text-3xl font-black text-red-200'>Locked Execution Boundary</h2>
            <p className='mt-5 leading-8 text-slate-200'>This is preview only. Public launch, customer signup, payment automation, WhatsApp auto-send, live execution and uncontrolled AI actions remain unauthorized until validated.</p>
          </div>
        </section>
      </section>
    </main>
  );
}
