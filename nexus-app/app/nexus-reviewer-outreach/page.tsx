export default function NexusReviewerOutreachPage() {
  const reviewerTypes = [
    "Trusted business owner",
    "Trusted technical reviewer",
    "Trusted operations / business thinker",
  ];

  const feedbackQuestions = [
    "Did you understand NEXUS within 60 seconds?",
    "Does NEXUS feel different from chatbot, CRM, ERP, and automation tools?",
    "Does the owner-control and safety-first positioning feel strong?",
    "Which part feels most powerful?",
    "Which part feels confusing?",
    "Would you request a controlled demo?",
    "What would make NEXUS feel more premium and trustworthy?",
  ];

  const boundaries = [
    "No public blast",
    "No open signup",
    "No payment collection",
    "No subscription activation",
    "No customer onboarding",
    "No customer data processing",
    "No real execution",
    "Owner-reviewed access only",
  ];

  const whatsappMessage = `Hi, I am building NEXUS — an AI Business Operating System.

It is not a chatbot, not a CRM, not an ERP, and not an automation clone.

NEXUS is designed for owner-controlled business operations, safety-first decisions, audit visibility, customer memory, fallback planning, and phased launch discipline.

I am opening a very limited controlled demo review for trusted reviewers only.

Can you review the public launch page and tell me:
1. Do you understand what NEXUS is?
2. Does it feel powerful and different?
3. What is confusing?
4. Would you request a controlled demo?

Launch page: /nexus-public-launch
Demo request page: /nexus-demo-request

No payment, no signup, no customer data, and no real execution. This is review-only.`;

  const linkedinMessage = `Hi, I am preparing NEXUS for controlled review.

NEXUS is an AI Business Operating System for owner-controlled business operations — built around safety, audit visibility, customer memory, fallback planning, and phased execution.

It is not a chatbot, CRM clone, ERP clone, or automation clone.

I am inviting only a few trusted reviewers first. Would you be open to reviewing the launch page and giving feedback on clarity, trust, and positioning?

No payment, no signup, no sensitive data, and no real execution.`;

  const emailMessage = `Subject: Request for trusted review — NEXUS AI Business Operating System

Hi,

I am opening a limited trusted-review round for NEXUS.

NEXUS is an AI Business Operating System designed for owner-controlled business operations, safety-first execution boundaries, audit visibility, customer memory architecture, fallback planning, and phased rollout discipline.

It is not a chatbot, not a CRM clone, not an ERP clone, and not an automation clone.

I would like your feedback on:
1. Whether the product is clear within 60 seconds
2. Whether it feels different and powerful
3. Whether the safety and owner-control positioning is trustworthy
4. What feels confusing
5. Whether you would request a controlled demo

This review does not include payment, signup, customer data, onboarding, or real execution.

Thank you.`;

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
          First Reviewer Outreach — Owner-Controlled
        </div>

        <h1 className="mt-8 text-4xl font-black tracking-tight md:text-6xl">
          First 3 Trusted Reviewers
        </h1>

        <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
          Use this page to contact the first three trusted reviewers. This is not public blasting,
          not paid access, not customer onboarding, and not real execution. The goal is controlled
          feedback before wider exposure.
        </p>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          {reviewerTypes.map((type, index) => (
            <div key={type} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <p className="text-3xl font-black text-emerald-300">0{index + 1}</p>
              <p className="mt-3 text-lg font-black">{type}</p>
            </div>
          ))}
        </section>

        <section className="mt-14 rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
          <h2 className="text-3xl font-black">WhatsApp Message</h2>
          <pre className="mt-5 whitespace-pre-wrap rounded-2xl border border-white/10 bg-slate-950/80 p-5 text-sm leading-7 text-slate-200">
            {whatsappMessage}
          </pre>
        </section>

        <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
          <h2 className="text-3xl font-black">LinkedIn Message</h2>
          <pre className="mt-5 whitespace-pre-wrap rounded-2xl border border-white/10 bg-slate-950/80 p-5 text-sm leading-7 text-slate-200">
            {linkedinMessage}
          </pre>
        </section>

        <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
          <h2 className="text-3xl font-black">Email Message</h2>
          <pre className="mt-5 whitespace-pre-wrap rounded-2xl border border-white/10 bg-slate-950/80 p-5 text-sm leading-7 text-slate-200">
            {emailMessage}
          </pre>
        </section>

        <section className="mt-14 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6 md:p-8">
          <h2 className="text-3xl font-black">Feedback Questions</h2>
          <div className="mt-6 grid gap-4">
            {feedbackQuestions.map((question, index) => (
              <div key={question} className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
                <p className="text-sm font-black text-emerald-300">Q{index + 1}</p>
                <p className="mt-2 text-base font-bold">{question}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-3xl border border-red-400/20 bg-red-400/10 p-6 md:p-8">
          <h2 className="text-3xl font-black">Hard Boundary</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {boundaries.map((item) => (
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
