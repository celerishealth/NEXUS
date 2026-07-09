"use client";

import { useEffect, useState } from "react";

const scenes = [
  {
    no: "01",
    title: "Business overload",
    varnika: "Himani, mere paas orders, complaints aur delivery messages ek saath aa rahe hain.",
    himani: "Agar galat reply chala gaya to customer bhi naraz hoga aur business ko loss bhi ho sakta hai.",
    nexus: "No control layer active.",
    status: "CHAOS"
  },
  {
    no: "02",
    title: "Need for control",
    varnika: "Mujhe sirf chatbot nahi chahiye. Mujhe pura business control chahiye.",
    himani: "Matlab AI fast reply de, lekin risky promise owner ke bina send na kare?",
    nexus: "NEXUS AI Business Operating System online.",
    status: "NEXUS ENTRY"
  },
  {
    no: "03",
    title: "Customer request understood",
    varnika: "Agar customer price, stock, discount aur replacement ek saath pooche to?",
    himani: "System ko pehle samajhna chahiye ki kya safe hai aur kya risky hai.",
    nexus: "Intent detected: price, stock, delivery, discount, replacement.",
    status: "AI ANALYSIS"
  },
  {
    no: "04",
    title: "Risk stopped",
    varnika: "Discount aur replacement bina meri approval ke confirm mat karna.",
    himani: "Haan, warna ek wrong promise se business damage ho sakta hai.",
    nexus: "High-risk action blocked. Owner approval required.",
    status: "RISK BLOCKED"
  },
  {
    no: "05",
    title: "Owner command",
    varnika: "Safe reply approve karo. Replacement ke liye damage photo mango.",
    himani: "Ab customer ko fast reply bhi milega aur business safe bhi rahega.",
    nexus: "Safe reply approved. Risky promise held.",
    status: "OWNER COMMAND"
  },
  {
    no: "06",
    title: "Business protected",
    varnika: "Ab mujhe har decision ka record, memory aur recovery path dikh raha hai.",
    himani: "Isliye NEXUS chatbot nahi, business operating system hai.",
    nexus: "Memory active. Audit visible. Recovery ready.",
    status: "NEXUS ACTIVE"
  }
];

export default function NexusAnimatedStoryMoviePage() {
  const [index, setIndex] = useState(0);
  const scene = scenes[index];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current >= scenes.length - 1 ? 0 : current + 1));
    }, 6500);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="page">
      <section className="movieFrame">
        <header className="top">
          <div>
            <p>NEXUS ORIGINAL ANIMATED DIALOGUE STORY</p>
            <h1>Varnika aur Himani samajhti hain NEXUS ka kaam</h1>
          </div>
          <span>Preview only • No real execution</span>
        </header>

        <section className="stage">
          <div className="storyWorld">
            <div className="shopBoard">VARNIKA BUSINESS</div>

            <div className="character varnika">
              <div className="head">V</div>
              <div className="body" />
              <strong>Varnika</strong>
            </div>

            <div className="character himani">
              <div className="head">H</div>
              <div className="body" />
              <strong>Himani</strong>
            </div>

            <div className="bubble varnikaBubble">
              <small>VARNIKA</small>
              {scene.varnika}
            </div>

            <div className="bubble himaniBubble">
              <small>HIMANI</small>
              {scene.himani}
            </div>
          </div>

          <div className="nexusPanel">
            <div className="sceneNo">SCENE {scene.no}</div>
            <h2>{scene.title}</h2>

            <div className="nexusOrb">
              <div className="ring one" />
              <div className="ring two" />
              <div className="core">
                <small>NEXUS</small>
                <strong>{scene.status}</strong>
              </div>
            </div>

            <div className="nexusSpeak">
              <small>NEXUS ACTION</small>
              {scene.nexus}
            </div>

            <div className="pillars">
              <div><span>Memory</span><strong>Context</strong></div>
              <div><span>Safety</span><strong>Risk Check</strong></div>
              <div><span>Approval</span><strong>Owner</strong></div>
              <div><span>Audit</span><strong>Record</strong></div>
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

        body {
          margin: 0;
          background: #020617;
        }

        .page {
          min-height: 100vh;
          padding: 20px;
          color: #f8fafc;
          font-family: Arial, Helvetica, sans-serif;
          background:
            radial-gradient(circle at 15% 10%, rgba(37,99,235,0.40), transparent 32%),
            radial-gradient(circle at 85% 78%, rgba(34,197,94,0.22), transparent 34%),
            linear-gradient(135deg, #020617, #0f172a 60%, #020617);
          overflow: hidden;
        }

        .movieFrame {
          max-width: 1320px;
          min-height: calc(100vh - 40px);
          margin: 0 auto;
          padding: 24px;
          border-radius: 34px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(2,6,23,0.78);
          box-shadow: 0 40px 140px rgba(0,0,0,0.65);
        }

        .top {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          align-items: flex-start;
          margin-bottom: 20px;
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
          max-width: 920px;
          font-size: clamp(34px, 5vw, 64px);
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

        .stage {
          display: grid;
          grid-template-columns: 1.12fr 0.88fr;
          gap: 18px;
        }

        .storyWorld,
        .nexusPanel {
          min-height: 585px;
          border-radius: 30px;
          border: 1px solid rgba(255,255,255,0.13);
          background: rgba(255,255,255,0.06);
          overflow: hidden;
        }

        .storyWorld {
          position: relative;
          background:
            radial-gradient(circle at top right, rgba(253,230,138,0.22), transparent 22%),
            linear-gradient(180deg, #0f3151, #082f49 55%, #064e3b);
        }

        .shopBoard {
          position: absolute;
          top: 32px;
          left: 42px;
          right: 42px;
          padding: 17px;
          border-radius: 24px;
          text-align: center;
          background: linear-gradient(90deg, #93c5fd, #86efac);
          color: #020617;
          font-weight: 1000;
          letter-spacing: 0.14em;
          box-shadow: 0 18px 45px rgba(0,0,0,0.30);
        }

        .character {
          position: absolute;
          bottom: 44px;
          width: 160px;
          text-align: center;
          animation: bounce 2.7s infinite ease-in-out;
        }

        .varnika { left: 90px; }
        .himani { right: 90px; animation-delay: 0.55s; }

        .head {
          width: 92px;
          height: 92px;
          margin: 0 auto;
          border-radius: 50%;
          display: grid;
          place-items: center;
          color: #020617;
          font-size: 38px;
          font-weight: 1000;
          background: #facc15;
          border: 5px solid rgba(255,255,255,0.58);
          box-shadow: 0 0 34px rgba(250,204,21,0.45);
        }

        .himani .head {
          background: #fb7185;
          box-shadow: 0 0 34px rgba(251,113,133,0.45);
        }

        .body {
          width: 118px;
          height: 112px;
          margin: -4px auto 8px;
          border-radius: 38px 38px 20px 20px;
          background: linear-gradient(180deg, #2563eb, #1d4ed8);
          border: 4px solid rgba(255,255,255,0.24);
        }

        .himani .body {
          background: linear-gradient(180deg, #14b8a6, #0f766e);
        }

        .character strong {
          display: inline-block;
          padding: 7px 12px;
          border-radius: 999px;
          background: rgba(2,6,23,0.72);
          border: 1px solid rgba(255,255,255,0.16);
          font-size: 15px;
        }

        .bubble {
          position: absolute;
          max-width: 350px;
          padding: 18px;
          border-radius: 26px;
          font-size: 24px;
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

        .varnikaBubble {
          left: 36px;
          top: 130px;
          background: rgba(37,99,235,0.28);
        }

        .himaniBubble {
          right: 36px;
          top: 285px;
          background: rgba(20,184,166,0.24);
        }

        .nexusPanel {
          display: grid;
          justify-items: center;
          text-align: center;
          padding: 24px;
          background:
            radial-gradient(circle at center, rgba(96,165,250,0.22), transparent 58%),
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
          font-size: clamp(36px, 4.5vw, 58px);
          line-height: 0.92;
          letter-spacing: -0.06em;
          text-transform: capitalize;
        }

        .nexusOrb {
          position: relative;
          width: 285px;
          height: 285px;
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
          width: 195px;
          height: 195px;
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
          font-size: 32px;
          line-height: 0.9;
          letter-spacing: -0.04em;
        }

        .nexusSpeak {
          width: 100%;
          padding: 18px;
          border-radius: 24px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.14);
          font-size: 24px;
          line-height: 1.15;
          font-weight: 1000;
        }

        .nexusSpeak small {
          display: block;
          margin-bottom: 8px;
          color: #bbf7d0;
          font-size: 11px;
          letter-spacing: 0.16em;
        }

        .pillars {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-top: 14px;
        }

        .pillars div {
          padding: 15px;
          border-radius: 20px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
        }

        .pillars span {
          display: block;
          color: #93c5fd;
          font-size: 11px;
          font-weight: 1000;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .pillars strong {
          font-size: 18px;
        }

        footer {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 18px;
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
          .movieFrame { padding: 16px; min-height: auto; border-radius: 24px; }
          .top, .stage { display: grid; grid-template-columns: 1fr; }
          .top span { white-space: normal; }
          .storyWorld, .nexusPanel { min-height: 600px; }
        }
      `}</style>
    </main>
  );
}
