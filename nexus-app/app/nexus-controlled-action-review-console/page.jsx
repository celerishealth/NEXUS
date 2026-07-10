import {
  createControlledActionReviewScenario,
} from "../../lib/nexus/controlledActionReviewConsolePreview.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function PipelineCard({
  title,
  result,
}) {
  return (
    <article
      style={{
        padding: 22,
        borderRadius: 20,
        border:
          "1px solid rgba(148,163,184,0.24)",
        background:
          "rgba(15,23,42,0.86)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          gap: 16,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 20,
          }}
        >
          {title}
        </h2>

        <strong
          style={{
            padding: "7px 12px",
            borderRadius: 999,
            background: result.completed
              ? "rgba(34,197,94,0.16)"
              : "rgba(239,68,68,0.16)",
          }}
        >
          {result.completed
            ? "VERIFIED"
            : "BLOCKED"}
        </strong>
      </div>

      <p
        style={{
          color: "#94a3b8",
          overflowWrap: "anywhere",
        }}
      >
        {result.state}
      </p>

      <div
        style={{
          display: "grid",
          gap: 9,
          marginTop: 18,
        }}
      >
        {result.stages.map(
          (stage, index) => (
            <div
              key={stage.key}
              style={{
                display: "grid",
                gridTemplateColumns:
                  "30px 1fr auto",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 12,
                background:
                  "rgba(2,6,23,0.58)",
              }}
            >
              <strong>
                {index + 1}
              </strong>

              <span
                style={{
                  color: "#cbd5e1",
                }}
              >
                {stage.label}
              </span>

              <strong
                style={{
                  color: stage.passed
                    ? "#86efac"
                    : "#fca5a5",
                }}
              >
                {stage.passed
                  ? "PASS"
                  : "STOP"}
              </strong>
            </div>
          ),
        )}
      </div>

      <div
        style={{
          marginTop: 18,
          padding: 14,
          borderRadius: 12,
          background:
            "rgba(30,58,138,0.18)",
          color: "#bfdbfe",
          lineHeight: 1.6,
        }}
      >
        Next:{" "}
        <strong>
          {result.nextRequiredAction}
        </strong>
      </div>
    </article>
  );
}

export default function ControlledActionReviewConsolePage() {
  const approved =
    createControlledActionReviewScenario();

  const rejected =
    createControlledActionReviewScenario({
      decision:
        "REJECT_PERMANENTLY",
    });

  const rework =
    createControlledActionReviewScenario({
      decision: "REQUIRE_REWORK",
    });

  const forged =
    createControlledActionReviewScenario({
      forgedReview: true,
    });

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "54px 24px",
        color: "#f8fafc",
        background:
          "radial-gradient(circle at top, #172554 0%, #020617 56%)",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <p
          style={{
            letterSpacing: "0.16em",
            color: "#60a5fa",
            fontWeight: 800,
            fontSize: 12,
          }}
        >
          NEXUS DAY 667 · UNIFIED OWNER CONTROL CONSOLE
        </p>

        <h1
          style={{
            maxWidth: 1000,
            margin: "18px 0",
            fontSize:
              "clamp(34px, 6vw, 66px)",
            lineHeight: 1,
          }}
        >
          One console now shows the complete
          owner-controlled action lifecycle.
        </h1>

        <p
          style={{
            maxWidth: 920,
            marginBottom: 34,
            color: "#94a3b8",
            fontSize: 18,
            lineHeight: 1.7,
          }}
        >
          Admission, recovery, intent, owner
          claim, provider simulation, signed
          resolution, and tamper-evident
          evidence are consolidated into one
          deterministic fail-closed workflow.
        </p>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(360px, 1fr))",
            gap: 18,
          }}
        >
          <PipelineCard
            title="Owner-approved candidate"
            result={approved}
          />

          <PipelineCard
            title="Permanent owner rejection"
            result={rejected}
          />

          <PipelineCard
            title="Owner-required rework"
            result={rework}
          />

          <PipelineCard
            title="Forged review attempt"
            result={forged}
          />
        </section>

        <section
          style={{
            marginTop: 28,
            padding: 22,
            borderRadius: 18,
            border:
              "1px solid rgba(96,165,250,0.25)",
            background:
              "rgba(30,58,138,0.16)",
          }}
        >
          <strong>
            Unified review does not authorize execution
          </strong>

          <p
            style={{
              marginBottom: 0,
              color: "#bfdbfe",
              lineHeight: 1.7,
            }}
          >
            Every displayed outcome remains
            local, owner-controlled, and
            evidence-only. No provider,
            database, payment, WhatsApp
            channel, customer action, live
            migration, public launch, or
            uncontrolled AI execution occurs.
          </p>
        </section>
      </div>
    </main>
  );
}
