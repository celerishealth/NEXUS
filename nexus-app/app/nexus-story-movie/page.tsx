"use client";

import { useEffect, useMemo, useState } from "react";

const scenes = [
  {
    code: "01",
    mood: "danger",
    headline: "Owner ka business overload ho gaya",
    owner: "Orders, complaints, discounts, delivery — sab ek saath aa raha hai.",
    customer: "Best rate do. Stock confirm karo. Damaged item replace bhi karo.",
    nexus: "No operating layer detected",
    status: "CHAOS",
    action: "Manual work is creating business risk.",
    chips: ["late reply", "wrong promise", "no audit"]
  },
  {
    code: "02",
    mood: "entry",
    headline: "NEXUS command layer activate hota hai",
    owner: "Mujhe automation nahi, control chahiye.",
    customer: "Fast reply milega? Safe reply milega?",
    nexus: "AI Business Operating System online",
    status: "NEXUS ONLINE",
    action: "Memory, safety, approval and audit connect together.",
    chips: ["memory", "safety", "approval"]
  },
  {
    code: "03",
    mood: "analysis",
    headline: "NEXUS request ko tod kar samajhta hai",
    owner: "Pehle intent samjho, phir draft banao.",
    customer: "Price, stock, delivery, discount aur replacement confirm karo.",
    nexus: "Intent mapped: price • stock • delivery • complaint • risk",
    status: "AI ANALYSIS",
    action: "NEXUS business request ko structured action me convert karta hai.",
    chips: ["price", "stock", "delivery"]
  },
  {
    code: "04",
    mood: "risk",
    headline: "Risky promise auto-send nahi hota",
    owner: "Discount aur replacement bina approval ke mat bhejna.",
    customer: "Abhi confirm kar do.",
    nexus: "High-risk action blocked",
    status: "RISK BLOCKED",
    action: "Safety layer damage hone se pehle risky action rokta hai.",
    chips: ["discount risk", "replacement risk", "payment risk"]
  },
  {
    code: "05",
    mood: "approval",
    headline: "Owner final command deta hai",
    owner: "Safe reply approve. Replacement ke liye damage photo mango.",
    customer: "Theek hai, main photo bhejta hoon.",
    nexus: "Safe action approved. Risky promise held.",
    status: "OWNER COMMAND",
    action: "NEXUS draft banata hai. Owner approve, reject ya edit karta hai.",
    chips: ["approve", "reject", "edit"]
  },
  {
    code: "06",
    mood: "audit",
    headline: "Har decision ka record banta hai",
    owner: "Is customer ke liye replacement checking strict rakhna.",
    customer: "Process clear hai.",
    nexus: "Memory updated. Audit visible. Recovery ready.",
    status: "BUSINESS PROTECTED",
    action: "Context, log and fallback business ko safe direction me rakhte hain.",
    chips: ["audit", "memory", "recovery"]
  },
  {
    code: "07",
    mood: "result",
    headline: "Business owner control me aa jata hai",
    owner: "Ab business mere command me hai.",
    customer: "Fast, clear, professional support.",
    nexus: "Owner stays in command",
    status: "NEXUS ACTIVE",
    action: "NEXUS is an AI Business Operating System — not a chatbot.",
    chips: ["zero-damage direction", "zero-stop direction", "premium control"]
  }
];

export default function NexusStoryMoviePage() {
  const [index, setIndex] = useState(0);
  const scene = scenes[index];

  const progress = useMemo(() => Math.round(((index + 1) / scenes.length) * 100), [index]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current >= scenes.length - 1 ? 0 : current + 1));
    }, 5600);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className={`movie ${scene.mood}`}>
      <section className="frame">
        <div className="scanline" />

        <header className="top">
          <div>
            <p className="kicker">NEXUS CINEMATIC STORY DEMO</p>
            <h1>AI Business Operating System</h1>
          </div>
          <div className="badge">Preview only • No real execution</div>
        </header>

        <div className="progress">
          <div style={{ width: `${progress}%` }} />
        </div>

        <section className="cinemaGrid">
          <aside className="story">
            <div className="sceneBadge">SCENE {scene.code}</div>
            <h2>{scene.headline}</h2>

            <div className="ownerBlock">
              <div className="face">
                <span>O</span>
              </div>
              <div>
                <small>BUSINESS OWNER</small>
                <strong>{scene.owner}</strong>
              </div>
            </div>

            <div className="phone">
              <div className="phoneHeader">
                <span />
                Customer Message
              </div>
              <div className="bubble">{scene.customer}</div>
              <div className="typing">
                <i />
                <i />
                <i />
              </div>
            </div>
          </aside>

          <section className="core">
            <div className="energy energyOne" />
            <div className="energy energyTwo" />

            <div className="orb">
              <div className="orbInner">
                <p>NEXUS</p>
                <h3>{scene.status}</h3>
              </div>
            </div>

            <div className="nexusSpeech">{scene.nexus}</div>

            <div className="chips">
              {scene.chips.map((chip) => (
                <span key={chip}>{chip}</span>
              ))}
            </div>
          </section>

          <aside className="system">
            <div className="actionCard">
              <small>SYSTEM ACTION</small>
              <strong>{scene.action}</strong>
            </div>

            <div className="stack">
              <div>
                <small>MEMORY</small>
                <strong>Context ready</strong>
              </div>
              <div>
                <small>SAFETY</small>
                <strong>Risk checked</strong>
              </div>
              <div>
                <small>APPROVAL</small>
                <strong>Owner control</strong>
              </div>
              <div>
                <small>AUDIT</small>
                <strong>Decision logged</strong>
              </div>
            </div>
          </aside>
        </section>

        <footer>
          <button onClick={() => setIndex((current) => Math.max(current - 1, 0))}>Previous</button>
          <button className="primary" onClick={() => setIndex((current) => (current >= scenes.length - 1 ? 0 : current + 1))}>
            Next Scene
          </button>
        </footer>
      </section>

      <style>{`
        * { box-sizing: border-box; }

        body {
          margin: 0;
          background: #01030a;
        }

        .movie {
          min-height: 100vh;
          padding: 22px;
          color: #f8fafc;
          font-family: Arial, Helvetica, sans-serif;
          background:
            radial-gradient(circle at 15% 12%, rgba(0, 102, 255, 0.38), transparent 30%),
            radial-gradient(circle at 82% 70%, rgba(20, 255, 196, 0.16), transparent 34%),
            linear-gradient(135deg, #01030a, #07111f 55%, #01030a);
          overflow: hidden;
        }

        .frame {
          position: relative;
          max-width: 1320px;
          min-height: calc(100vh - 44px);
          margin: 0 auto;
          padding: 24px;
          border-radius: 34px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(2, 6, 23, 0.80);
          box-shadow: 0 50px 150px rgba(0,0,0,0.72);
          overflow: hidden;
        }

        .scanline {
          pointer-events: none;
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent, rgba(96,165,250,0.08), transparent);
          height: 180px;
          animation: scan 4.6s infinite linear;
          opacity: 0.6;
        }

        .top {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          gap: 20px;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .kicker {
          margin: 0 0 8px;
          color: #93c5fd;
          font-size: 12px;
          font-weight: 1000;
          letter-spacing: 0.25em;
        }

        h1 {
          margin: 0;
          font-size: clamp(38px, 6vw, 78px);
          line-height: 0.88;
          letter-spacing: -0.075em;
          text-shadow: 0 0 34px rgba(147,197,253,0.45);
        }

        .badge {
          padding: 10px 14px;
          border-radius: 999px;
          color: #dbeafe;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.16);
          font-size: 13px;
          white-space: nowrap;
        }

        .progress {
          position: relative;
          z-index: 2;
          height: 8px;
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
          overflow: hidden;
          margin-bottom: 20px;
        }

        .progress div {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #60a5fa, #22c55e);
          transition: width 700ms ease;
          box-shadow: 0 0 22px rgba(34,197,94,0.75);
        }

        .cinemaGrid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 0.95fr 1.05fr 0.78fr;
          gap: 18px;
          align-items: stretch;
        }

        .story,
        .core,
        .system {
          min-height: 548px;
          border-radius: 30px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.055);
          backdrop-filter: blur(20px);
          overflow: hidden;
        }

        .story {
          padding: 24px;
        }

        .sceneBadge {
          display: inline-flex;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(96,165,250,0.20);
          color: #bfdbfe;
          font-weight: 1000;
          font-size: 12px;
          letter-spacing: 0.15em;
          margin-bottom: 18px;
        }

        h2 {
          margin: 0 0 22px;
          font-size: clamp(34px, 4.8vw, 61px);
          line-height: 0.91;
          letter-spacing: -0.065em;
        }

        .ownerBlock {
          display: flex;
          gap: 14px;
          align-items: center;
          padding: 16px;
          border-radius: 24px;
          background: rgba(37, 99, 235, 0.24);
          border: 1px solid rgba(96,165,250,0.24);
          margin-bottom: 16px;
        }

        .face {
          width: 62px;
          height: 62px;
          flex: 0 0 auto;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #60a5fa, #22c55e);
          box-shadow: 0 0 28px rgba(96,165,250,0.55);
        }

        .face span {
          color: #020617;
          font-size: 28px;
          font-weight: 1000;
        }

        small {
          display: block;
          color: #93c5fd;
          font-size: 12px;
          font-weight: 1000;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 7px;
        }

        .ownerBlock strong {
          display: block;
          font-size: 21px;
          line-height: 1.18;
        }

        .phone {
          position: relative;
          min-height: 238px;
          padding: 18px;
          border-radius: 28px;
          background:
            radial-gradient(circle at top right, rgba(34,197,94,0.18), transparent 40%),
            linear-gradient(180deg, rgba(15,23,42,0.95), rgba(8,47,73,0.62));
          border: 1px solid rgba(255,255,255,0.13);
        }

        .phoneHeader {
          color: #bfdbfe;
          font-size: 12px;
          font-weight: 1000;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          margin-bottom: 18px;
        }

        .phoneHeader span {
          display: inline-block;
          width: 10px;
          height: 10px;
          margin-right: 8px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 18px #22c55e;
        }

        .bubble {
          padding: 18px;
          border-radius: 22px 22px 22px 7px;
          background: rgba(14,165,233,0.28);
          border: 1px solid rgba(125,211,252,0.22);
          font-size: 23px;
          line-height: 1.15;
          font-weight: 900;
        }

        .typing {
          position: absolute;
          left: 22px;
          bottom: 18px;
          display: flex;
          gap: 8px;
        }

        .typing i {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #67e8f9;
          animation: dot 1.1s infinite ease-in-out;
        }

        .typing i:nth-child(2) { animation-delay: 0.15s; }
        .typing i:nth-child(3) { animation-delay: 0.30s; }

        .core {
          position: relative;
          display: grid;
          place-items: center;
          padding: 26px;
        }

        .energy {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(96,165,250,0.28), transparent 64%);
          animation: wave 2.7s infinite ease-in-out;
        }

        .energyOne {
          width: 420px;
          height: 420px;
        }

        .energyTwo {
          width: 530px;
          height: 530px;
          animation-delay: 0.7s;
          opacity: 0.55;
        }

        .orb {
          position: relative;
          z-index: 2;
          width: min(360px, 78vw);
          aspect-ratio: 1;
          border-radius: 50%;
          display: grid;
          place-items: center;
          padding: 9px;
          background: linear-gradient(135deg, #60a5fa, #22c55e);
          box-shadow: 0 0 90px rgba(96,165,250,0.45);
          animation: float 4s infinite ease-in-out;
        }

        .risk .orb {
          background: linear-gradient(135deg, #f97316, #ef4444);
          box-shadow: 0 0 90px rgba(239,68,68,0.45);
        }

        .approval .orb,
        .result .orb {
          background: linear-gradient(135deg, #22c55e, #60a5fa);
        }

        .orbInner {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          display: grid;
          place-items: center;
          text-align: center;
          padding: 24px;
          background: #020617;
        }

        .orbInner p {
          margin: 0;
          color: #93c5fd;
          font-size: 18px;
          font-weight: 1000;
          letter-spacing: 0.25em;
        }

        .orbInner h3 {
          margin: 0;
          font-size: clamp(34px, 4.5vw, 60px);
          line-height: 0.86;
          letter-spacing: -0.065em;
        }

        .nexusSpeech {
          position: relative;
          z-index: 3;
          width: 100%;
          margin-top: -26px;
          padding: 18px;
          border-radius: 24px;
          text-align: center;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          font-size: 23px;
          line-height: 1.14;
          font-weight: 1000;
          box-shadow: 0 20px 55px rgba(0,0,0,0.28);
        }

        .chips {
          position: relative;
          z-index: 3;
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 16px;
        }

        .chips span {
          padding: 10px 12px;
          border-radius: 999px;
          color: #bbf7d0;
          background: rgba(34,197,94,0.12);
          border: 1px solid rgba(34,197,94,0.24);
          font-size: 13px;
          font-weight: 1000;
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }

        .system {
          padding: 18px;
          display: grid;
          gap: 14px;
        }

        .actionCard {
          padding: 22px;
          border-radius: 26px;
          background:
            linear-gradient(135deg, rgba(96,165,250,0.22), rgba(34,197,94,0.10)),
            rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.13);
        }

        .actionCard strong {
          display: block;
          font-size: 26px;
          line-height: 1.08;
          letter-spacing: -0.03em;
        }

        .stack {
          display: grid;
          gap: 12px;
        }

        .stack div {
          padding: 18px;
          min-height: 84px;
          border-radius: 22px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.11);
        }

        .stack div:first-child {
          background: rgba(34,197,94,0.12);
          border-color: rgba(34,197,94,0.25);
        }

        .stack strong {
          display: block;
          font-size: 21px;
          line-height: 1.05;
        }

        footer {
          position: relative;
          z-index: 3;
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 18px;
        }

        button {
          border: 0;
          border-radius: 999px;
          padding: 12px 18px;
          color: #f8fafc;
          background: rgba(255,255,255,0.11);
          font-weight: 1000;
          cursor: pointer;
        }

        button.primary {
          color: #020617;
          background: linear-gradient(90deg, #93c5fd, #86efac);
        }

        @keyframes scan {
          0% { transform: translateY(-220px); }
          100% { transform: translateY(980px); }
        }

        @keyframes wave {
          0%, 100% { transform: scale(0.88); opacity: 0.4; }
          50% { transform: scale(1.08); opacity: 0.95; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-9px); }
        }

        @keyframes dot {
          0%, 100% { opacity: 0.25; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-5px); }
        }

        @media (max-width: 980px) {
          .movie { padding: 12px; overflow: auto; }

          .frame {
            min-height: auto;
            padding: 16px;
            border-radius: 25px;
          }

          .top,
          .cinemaGrid {
            display: grid;
            grid-template-columns: 1fr;
          }

          .badge { white-space: normal; }

          .story,
          .core,
          .system {
            min-height: auto;
          }
        }
      `}</style>
    </main>
  );
}
