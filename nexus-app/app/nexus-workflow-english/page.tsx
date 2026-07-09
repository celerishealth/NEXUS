"use client";

import { useEffect, useState } from "react";

const scenes = [
  {
    no: "01",
    title: "The Business Problem",
    himani: "Varnika, what problem does NEXUS solve for a business owner?",
    varnika: "When messages, orders, complaints, discounts, and delivery questions arrive together, NEXUS turns chaos into a controlled workflow.",
    nexus: "Customer request captured.",
    status: "REQUEST CAPTURED",
    active: 0
  },
  {
    no: "02",
    title: "Not Just A Chatbot",
    himani: "Is NEXUS just another chatbot?",
    varnika: "No. A chatbot only replies. NEXUS controls the full business workflow: message, intent, draft, safety, owner approval, audit, memory, and recovery.",
    nexus: "Workflow control layer online.",
    status: "OPERATING SYSTEM",
    active: 1
  },
  {
    no: "03",
    title: "Understanding The Request",
    himani: "What happens when a customer asks for price, stock, discount, and replacement together?",
    varnika: "NEXUS separates the request into business parts. It understands what is safe, what is risky, and what needs owner review.",
    nexus: "Intent mapped into business categories.",
    status: "INTENT MAPPED",
    active: 2
  },
  {
    no: "04",
    title: "AI Draft Without Blind Execution",
    himani: "Does NEXUS send the AI reply automatically?",
    varnika: "No. NEXUS prepares a professional draft, but it does not blindly execute risky actions.",
    nexus: "Safe draft prepared for owner review.",
    status: "DRAFT READY",
    active: 3
  },
  {
    no: "05",
    title: "Risk Block And Owner Approval",
    himani: "What if the reply includes discount, payment, replacement, or delivery promises?",
    varnika: "NEXUS blocks risky actions and asks the owner to approve, reject, or edit before anything goes out.",
    nexus: "High-risk action blocked. Owner approval required.",
    status: "RISK BLOCKED",
    active: 4
  },
  {
    no: "06",
    title: "Memory, Audit And Recovery",
    himani: "What makes NEXUS powerful after the reply is handled?",
    varnika: "NEXUS keeps customer memory, audit logs, and recovery paths visible, so the business stays controlled and protected.",
    nexus: "Memory ready. Audit visible. Recovery path protected.",
    status: "BUSINESS PROTECTED",
    active: 5
  }
];

const workflow = [
  "Capture",
  "Understand",
  "Draft",
  "Risk Check",
  "Owner Approval",
  "Audit + Memory"
];

export default function NexusWorkflowEnglishPage() {
  const [index, setIndex] = useState(0);
  const scene = scenes[index];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current >= scenes.length - 1 ? 0 : current + 1));
    }, 7000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="page">
      <section className="frame">
        <header className="top">
          <div>
            <p>NEXUS ENGLISH WORKFLOW MOVIE</p>
            <h1>Varnika explains how NEXUS controls a business workflow.</h1>
          </div>
          <span>Preview only • No real execution</span>
        </header>

        <section className="workflowBar">
          {workflow.map((item, i) => (
            <div className={i === scene.active ? "step active" : "step"} key={item}>
              <b>{String(i + 1).padStart(2, "0")}</b>
              <span>{item}</span>
            </div>
          ))}
        </section>

        <section className="stage">
          <div className="story">
            <div className="shopBoard">VARNIKA BUSINESS</div>

            <div className="people">
              <div className="person">
                <div className="face himaniFace">H</div>
                <strong>Himani</strong>
              </div>
              <div className="person">
                <div className="face varnikaFace">V</div>
                <strong>Varnika</strong>
              </div>
            </div>

            <div className="bubble himaniBubble">
              <small>HIMANI ASKS</small>
              {scene.himani}
            </div>

            <div className="bubble varnikaBubble">
              <small>VARNIKA EXPLAINS</small>
              {scene.varnika}
            </div>
          </div>

          <div className="nexus">
            <div className="sceneNo">SCENE {scene.no}</div>
            <h2>{scene.title}</h2>

            <div className="orb">
              <div className="ring one" />
              <div className="ring two" />
              <div className="core">
                <small>NEXUS</small>
                <strong>{scene.status}</strong>
              </div>
            </div>

            <div className="nexusAction">
              <small>NEXUS ACTION</small>
              <strong>{scene.nexus}</strong>
            </div>
          </div>

          <div className="proof">
            <div className={scene.active >= 0 ? "card on" : "card"}>
              <small>INPUT</small>
              <strong>Customer message captured</strong>
            </div>
            <div className={scene.active >= 1 ? "card on" : "card"}>
              <small>CONTROL</small>
              <strong>Workflow layer active</strong>
            </div>
            <div className={scene.active >= 2 ? "card on" : "card"}>
              <small>AI</small>
              <strong>Intent understood</strong>
            </div>
            <div className={scene.active >= 3 ? "card on" : "card"}>
              <small>DRAFT</small>
              <strong>Reply prepared</strong>
            </div>
            <div className={scene.active >= 4 ? "card risk" : "card"}>
              <small>SAFETY</small>
              <strong>Risk blocked</strong>
            </div>
            <div className={scene.active >= 5 ? "card approve" : "card"}>
              <small>OWNER</small>
              <strong>Audit, memory, recovery</strong>
            </div>
          </div>
        </section>

        <footer>
          <button onClick={() => setIndex((current) => Math.max(current - 1, 0))}>Previous</button>
          <button onClick={() => setIndex((current) => (current >= scenes.length - 1 ? 0 : current + 1))}>Next Scene</button>
        </footer>
      </section>

      <style>{`
        * { box-sizing: border-box; }

        body { margin: 0; background: #020617; }

        .page {
          min-height: 100vh;
          padding: 18px;
          color: #f8fafc;
          font-family: Arial, Helvetica, sans-serif;
          background:
            radial-gradient(circle at 15% 12%, rgba(37,99,235,0.42), transparent 30%),
            radial-gradient(circle at 88% 80%, rgba(34,197,94,0.22), transparent 34%),
            linear-gradient(135deg, #020617, #0f172a 58%, #020617);
          overflow: hidden;
        }

        .frame {
          max-width: 1360px;
          min-height: calc(100vh - 36px);
          margin: 0 auto;
          padding: 22px;
          border-radius: 34px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(2,6,23,0.80);
          box-shadow: 0 44px 140px rgba(0,0,0,0.68);
        }

        .top {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .top p {
          margin: 0 0 8px;
          color: #93c5fd;
          font-size: 12px;
          font-weight: 1000;
          letter-spacing: 0.22em;
        }

        h1 {
          margin: 0;
          max-width: 980px;
          font-size: clamp(32px, 4.8vw, 62px);
          line-height: 0.92;
          letter-spacing: -0.06em;
        }

        .top span {
          white-space: nowrap;
          padding: 10px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.14);
          color: #dbeafe;
          font-size: 13px;
        }

        .workflowBar {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 10px;
          margin-bottom: 16px;
        }

        .step {
          padding: 12px;
          min-height: 72px;
          border-radius: 18px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.10);
          color: #94a3b8;
        }

        .step.active {
          background: linear-gradient(135deg, rgba(96,165,250,0.35), rgba(34,197,94,0.22));
          border-color: rgba(147,197,253,0.42);
          color: #f8fafc;
          box-shadow: 0 0 32px rgba(96,165,250,0.22);
        }

        .step b {
          display: block;
          color: #93c5fd;
          font-size: 13px;
          margin-bottom: 6px;
        }

        .step span {
          font-size: 15px;
          font-weight: 1000;
        }

        .stage {
          display: grid;
          grid-template-columns: 1.02fr 0.9fr 0.72fr;
          gap: 16px;
        }

        .story,
        .nexus,
        .proof {
          min-height: 548px;
          border-radius: 30px;
          border: 1px solid rgba(255,255,255,0.13);
          background: rgba(255,255,255,0.06);
          overflow: hidden;
        }

        .story {
          position: relative;
          background:
            radial-gradient(circle at top right, rgba(253,230,138,0.20), transparent 26%),
            linear-gradient(180deg, #0f3151, #082f49 58%, #064e3b);
        }

        .shopBoard {
          position: absolute;
          top: 30px;
          left: 36px;
          right: 36px;
          padding: 16px;
          border-radius: 24px;
          text-align: center;
          background: linear-gradient(90deg, #93c5fd, #86efac);
          color: #020617;
          font-weight: 1000;
          letter-spacing: 0.14em;
          box-shadow: 0 18px 45px rgba(0,0,0,0.30);
        }

        .people {
          position: absolute;
          bottom: 34px;
          left: 48px;
          right: 48px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .person {
          text-align: center;
          animation: bounce 2.8s infinite ease-in-out;
        }

        .person:nth-child(2) { animation-delay: 0.5s; }

        .face {
          width: 96px;
          height: 96px;
          margin: 0 auto 10px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          color: #020617;
          font-size: 40px;
          font-weight: 1000;
          border: 5px solid rgba(255,255,255,0.58);
        }

        .varnikaFace { background: #facc15; box-shadow: 0 0 34px rgba(250,204,21,0.45); }
        .himaniFace { background: #fb7185; box-shadow: 0 0 34px rgba(251,113,133,0.45); }

        .person strong {
          display: inline-block;
          padding: 7px 12px;
          border-radius: 999px;
          background: rgba(2,6,23,0.72);
          border: 1px solid rgba(255,255,255,0.16);
          font-size: 15px;
        }

        .bubble {
          position: absolute;
          max-width: 365px;
          padding: 18px;
          border-radius: 26px;
          font-size: 22px;
          line-height: 1.15;
          font-weight: 950;
          background: rgba(15,23,42,0.84);
          border: 1px solid rgba(255,255,255,0.16);
          box-shadow: 0 20px 50px rgba(0,0,0,0.30);
        }

        .bubble small {
          display: block;
          margin-bottom: 8px;
          color: #bfdbfe;
          font-size: 11px;
          letter-spacing: 0.18em;
          font-weight: 1000;
        }

        .himaniBubble {
          left: 34px;
          top: 120px;
          background: rgba(20,184,166,0.26);
        }

        .varnikaBubble {
          right: 34px;
          top: 292px;
          background: rgba(37,99,235,0.32);
        }

        .nexus {
          display: grid;
          justify-items: center;
          text-align: center;
          padding: 22px;
          background:
            radial-gradient(circle at center, rgba(96,165,250,0.24), transparent 58%),
            rgba(255,255,255,0.055);
        }

        .sceneNo {
          justify-self: start;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(96,165,250,0.18);
          color: #bfdbfe;
          font-weight: 1000;
          font-size: 12px;
          letter-spacing: 0.16em;
        }

        h2 {
          margin: 10px 0 4px;
          font-size: clamp(34px, 4vw, 54px);
          line-height: 0.92;
          letter-spacing: -0.06em;
        }

        .orb {
          position: relative;
          width: 275px;
          height: 275px;
          display: grid;
          place-items: center;
          margin: 8px 0;
        }

        .ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 4px solid rgba(96,165,250,0.65);
          animation: pulse 2.4s infinite ease-in-out;
        }

        .ring.two {
          inset: 24px;
          border-color: rgba(34,197,94,0.75);
          animation-delay: 0.55s;
        }

        .core {
          z-index: 2;
          width: 194px;
          height: 194px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          padding: 20px;
          background: #020617;
          box-shadow: 0 0 80px rgba(96,165,250,0.48);
        }

        .core small {
          color: #93c5fd;
          font-size: 15px;
          font-weight: 1000;
          letter-spacing: 0.24em;
        }

        .core strong {
          font-size: 30px;
          line-height: 0.9;
          letter-spacing: -0.04em;
        }

        .nexusAction {
          width: 100%;
          padding: 18px;
          border-radius: 24px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.14);
        }

        .nexusAction small {
          display: block;
          margin-bottom: 8px;
          color: #bbf7d0;
          font-size: 11px;
          letter-spacing: 0.16em;
          font-weight: 1000;
        }

        .nexusAction strong {
          display: block;
          font-size: 24px;
          line-height: 1.15;
        }

        .proof {
          padding: 16px;
          display: grid;
          gap: 10px;
        }

        .card {
          padding: 15px;
          border-radius: 20px;
          background: rgba(255,255,255,0.055);
          border: 1px solid rgba(255,255,255,0.10);
          opacity: 0.55;
        }

        .card.on {
          opacity: 1;
          background: rgba(96,165,250,0.14);
          border-color: rgba(96,165,250,0.26);
        }

        .card.risk {
          opacity: 1;
          background: rgba(239,68,68,0.18);
          border-color: rgba(248,113,113,0.32);
        }

        .card.approve {
          opacity: 1;
          background: rgba(34,197,94,0.16);
          border-color: rgba(34,197,94,0.32);
        }

        .card small {
          display: block;
          margin-bottom: 7px;
          color: #93c5fd;
          font-size: 11px;
          font-weight: 1000;
          letter-spacing: 0.14em;
        }

        .card strong {
          font-size: 19px;
          line-height: 1.05;
        }

        footer {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 16px;
        }

        button {
          border: 0;
          border-radius: 999px;
          padding: 12px 18px;
          color: #020617;
          background: linear-gradient(90deg, #93c5fd, #86efac);
          font-weight: 1000;
          cursor: pointer;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-9px); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(0.92); opacity: 0.55; }
          50% { transform: scale(1.07); opacity: 1; }
        }

        @media (max-width: 980px) {
          .page { padding: 12px; overflow: auto; }
          .frame { padding: 16px; min-height: auto; border-radius: 24px; }
          .top, .stage, .workflowBar { display: grid; grid-template-columns: 1fr; }
          .top span { white-space: normal; }
          .story, .nexus, .proof { min-height: 560px; }
        }
      `}</style>
    </main>
  );
}
