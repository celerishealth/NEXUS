export default function NexusDemoRequestPage() {
  const requestFields = [
    "Name",
    "Business type",
    "Role / responsibility",
    "Why you want to review NEXUS",
    "What business problem you want to solve",
    "Whether you understand this is owner-reviewed access only",
  ];

  const feedbackQuestions = [
    "Do you understand what NEXUS is within 60 seconds?",
    "Does NEXUS feel different from chatbot, CRM, ERP, and automation tools?",
    "Does the safety-first owner-control positioning feel strong?",
    "Which screen or message feels most powerful?",
    "Which word, section, or explanation feels confusing?",
    "Would you request a controlled demo after seeing this?",
    "What would make NEXUS feel more premium and trustworthy?",
  ];

  const notAllowed = [
    "Do not submit customer data",
    "Do not submit payment information",
    "Do not submit passwords",
    "Do not submit private business records",
    "Do not request production execution",
    "Do not assume automatic access",
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
          Owner-Reviewed Controlled Demo Request
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <h1 className="text-4xl font-black tracking-tight md:text-6xl">
              Request Controlled Demo
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              NEXUS controlled demo access is manually reviewed by the owner. This request path
              does not create open signup, customer onboarding, payment collection, subscription
              activation, customer data processing, or real execution.
            </p>

            <div className="mt-8 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6">
              <h2 className="text-2xl font-black">Request Template</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Copy this structure and send it to the owner through the owner-approved channel.
              </p>

              <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/80 p-5 font-mono text-sm leading-7 text-slate-200">
                <p>Name:</p>
                <p>Business type:</p>
                <p>Role:</p>
                <p>Reason for controlled demo:</p>
                <p>Business problem:</p>
                <p>I understand access is owner-reviewed only: Yes / No</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">Safe Request Fields</h2>
            <div className="mt-5 grid gap-3">
              {requestFields.map((field) => (
                <div key={field} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm font-semibold text-slate-200">
                  ✓ {field}
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="mt-14 rounded-3xl border border-red-400/20 bg-red-400/10 p-6 md:p-8">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-red-200">
            Safety Rule
          </p>
          <h2 className="mt-4 text-3xl font-black">Do not send sensitive data.</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {notAllowed.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm font-bold text-slate-100">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-emerald-200">
            Reviewer Feedback
          </p>
          <h2 className="mt-4 text-3xl font-black">Use these 7 questions for the first 3 trusted reviewers.</h2>
          <div className="mt-6 grid gap-4">
            {feedbackQuestions.map((question, index) => (
              <div key={question} className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                <p className="text-sm font-black text-emerald-300">Q{index + 1}</p>
                <p className="mt-2 text-base font-bold text-white">{question}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6 md:p-8">
          <h2 className="text-3xl font-black">Owner Review Checklist</h2>
          <p className="mt-4 max-w-4xl text-base leading-8 text-slate-200">
            Approve a demo request only if the requester is named, trusted, scope is clear,
            no sensitive data is included, no payment is requested, no onboarding is triggered,
            and no real execution is expected.
          </p>
        </section>
      </section>
    </main>
  );
}
