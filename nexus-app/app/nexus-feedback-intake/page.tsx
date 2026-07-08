export default function NexusFeedbackIntakePage() {
  const feedbackQuestions = [
    {
      no: "01",
      question: "Did you understand NEXUS within 60 seconds?",
      answerType: "Yes / No / Partially",
      purpose: "Checks first-message clarity.",
    },
    {
      no: "02",
      question: "Does NEXUS feel different from a chatbot, CRM, or ERP?",
      answerType: "Yes / No / Not sure",
      purpose: "Checks category differentiation.",
    },
    {
      no: "03",
      question: "What felt most powerful?",
      answerType: "Short text",
      purpose: "Finds the strongest message.",
    },
    {
      no: "04",
      question: "What felt confusing?",
      answerType: "Short text",
      purpose: "Finds friction before demo scaling.",
    },
    {
      no: "05",
      question: "Would you request a controlled demo?",
      answerType: "Yes / No / Maybe",
      purpose: "Checks real demo intent.",
    },
    {
      no: "06",
      question: "How much trust does the page create?",
      answerType: "1 to 10",
      purpose: "Checks public trust level.",
    },
    {
      no: "07",
      question: "Any final suggestion?",
      answerType: "Short text",
      purpose: "Captures open feedback.",
    },
  ];

  const copyTemplate = `NEXUS Feedback

1. Did you understand NEXUS within 60 seconds?
Answer:

2. Does NEXUS feel different from a chatbot, CRM, or ERP?
Answer:

3. What felt most powerful?
Answer:

4. What felt confusing?
Answer:

5. Would you request a controlled demo?
Answer:

6. Trust score from 1 to 10:
Answer:

7. Final suggestion:
Answer:`;

  const ownerRules = [
    "Copy reviewer replies manually from LinkedIn, WhatsApp, or email.",
    "Do not ask for customer data, passwords, payment details, or private business records.",
    "Classify feedback as clear, confused, interested, demo requested, price asked, rejected, or no reply.",
    "Do not promise onboarding, automation execution, payments, or customer data processing.",
    "Use feedback only for clarity, trust, positioning, and controlled demo readiness.",
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

        <div className="mt-8 w-fit rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-200">
          First Feedback Intake — Manual Safe Mode
        </div>

        <h1 className="mt-8 text-4xl font-black tracking-tight md:text-6xl">
          NEXUS Feedback Intake
        </h1>

        <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
          Use this page to collect first reviewer feedback after public launch. This is a
          manual intake system. It does not save data, process customer records, collect
          payments, activate subscriptions, or onboard customers.
        </p>

        <section className="mt-10 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6 md:p-8">
          <h2 className="text-3xl font-black">Message to Send After Acceptance</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Send this only after the reviewer accepts the connection or agrees to review.
          </p>
          <pre className="mt-5 whitespace-pre-wrap rounded-2xl border border-white/10 bg-slate-950/80 p-5 text-sm leading-7 text-slate-200">
{`Can you review this NEXUS page and answer these 7 short questions?

Page:
https://nexus-app-ten-smoky.vercel.app/nexus-public-launch

Feedback questions:
https://nexus-app-ten-smoky.vercel.app/nexus-feedback-intake

No signup. No payment. Just feedback.`}
          </pre>
        </section>

        <section className="mt-14 grid gap-5">
          {feedbackQuestions.map((item) => (
            <div key={item.no} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <p className="text-sm font-black text-emerald-300">QUESTION {item.no}</p>
              <h2 className="mt-2 text-2xl font-black">{item.question}</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                    Answer Type
                  </p>
                  <p className="mt-2 text-sm font-bold text-slate-200">{item.answerType}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                    Purpose
                  </p>
                  <p className="mt-2 text-sm font-bold text-slate-200">{item.purpose}</p>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-14 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6 md:p-8">
          <h2 className="text-3xl font-black">Copy-Paste Feedback Template</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            The owner can paste this into LinkedIn, WhatsApp, email, or a manual notes file.
          </p>
          <pre className="mt-5 whitespace-pre-wrap rounded-2xl border border-white/10 bg-slate-950/80 p-5 text-sm leading-7 text-slate-200">
            {copyTemplate}
          </pre>
        </section>

        <section className="mt-14 rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
          <h2 className="text-3xl font-black">Owner Handling Rules</h2>
          <div className="mt-6 grid gap-3">
            {ownerRules.map((rule) => (
              <div key={rule} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm font-bold text-slate-200">
                ✓ {rule}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-3xl border border-red-400/20 bg-red-400/10 p-6 md:p-8">
          <h2 className="text-3xl font-black">Hard Boundary</h2>
          <p className="mt-4 max-w-4xl text-base leading-8 text-slate-200">
            This feedback intake page is not a working form and does not store submissions.
            It is a controlled manual review layer only. It does not authorize open signup,
            payment collection, subscription activation, customer onboarding, customer data
            processing, or real execution.
          </p>
        </section>
      </section>
    </main>
  );
}
