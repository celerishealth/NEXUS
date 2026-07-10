import {
  getProtectedApiSecurityPosture,
} from "../../lib/nexus/protectedApiRequestGuard.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function ControlCard({ control }) {
  return (
    <article
      style={{
        padding: 18,
        borderRadius: 16,
        border:
          "1px solid rgba(34,197,94,0.28)",
        background:
          "rgba(15,23,42,0.84)",
      }}
    >
      <strong
        style={{
          color: "#86efac",
          fontSize: 13,
        }}
      >
        ACTIVE
      </strong>

      <div
        style={{
          marginTop: 8,
          color: "#e2e8f0",
          overflowWrap: "anywhere",
        }}
      >
        {control}
      </div>
    </article>
  );
}

export default function ProtectedApiSecurityPage() {
  const posture =
    getProtectedApiSecurityPosture();

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
          maxWidth: 1120,
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
          NEXUS DAY 668 · PROTECTED API SECURITY
        </p>

        <h1
          style={{
            maxWidth: 980,
            margin: "18px 0",
            fontSize:
              "clamp(34px, 6vw, 66px)",
            lineHeight: 1,
          }}
        >
          Every protected action endpoint now
          enters through one fail-closed request
          security boundary.
        </h1>

        <p
          style={{
            maxWidth: 900,
            marginBottom: 32,
            color: "#94a3b8",
            fontSize: 18,
            lineHeight: 1.7,
          }}
        >
          Invalid methods, content types,
          oversized bodies, malformed JSON,
          non-object payloads, and untrusted
          browser origins are rejected before
          owner authorization or pipeline
          evaluation begins.
        </p>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <article
            style={{
              padding: 20,
              borderRadius: 18,
              background:
                "rgba(15,23,42,0.84)",
            }}
          >
            <div style={{ color: "#94a3b8" }}>
              Maximum JSON body
            </div>

            <strong style={{ fontSize: 28 }}>
              {
                posture.maximumBodyBytes /
                1024
              } KB
            </strong>
          </article>

          <article
            style={{
              padding: 20,
              borderRadius: 18,
              background:
                "rgba(15,23,42,0.84)",
            }}
          >
            <div style={{ color: "#94a3b8" }}>
              Security controls
            </div>

            <strong style={{ fontSize: 28 }}>
              {posture.controls.length}
            </strong>
          </article>

          <article
            style={{
              padding: 20,
              borderRadius: 18,
              background:
                "rgba(15,23,42,0.84)",
            }}
          >
            <div style={{ color: "#94a3b8" }}>
              Real execution
            </div>

            <strong style={{ fontSize: 28 }}>
              LOCKED
            </strong>
          </article>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 14,
          }}
        >
          {posture.controls.map(
            (control) => (
              <ControlCard
                key={control}
                control={control}
              />
            ),
          )}
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
            Request acceptance is not execution
          </strong>

          <p
            style={{
              marginBottom: 0,
              color: "#bfdbfe",
              lineHeight: 1.7,
            }}
          >
            Passing the request guard only
            permits further owner-controlled
            validation. Provider invocation,
            persistence, payments, WhatsApp
            delivery, customer actions, live
            migrations, public launch, and
            uncontrolled AI execution remain
            unauthorized.
          </p>
        </section>
      </div>
    </main>
  );
}
