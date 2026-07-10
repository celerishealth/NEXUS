import {
  getProtectedApiAuthenticationPosture,
} from "../../lib/nexus/protectedApiSignedEnvelope.mjs";

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
        ENFORCED
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

export default function ProtectedApiAuthenticationPage() {
  const posture =
    getProtectedApiAuthenticationPosture();

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
          NEXUS DAY 669 · SIGNED API AUTHENTICATION
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
          Protected requests are now signed,
          tenant-bound, owner-bound, body-bound,
          and time-bound before evaluation.
        </h1>

        <p
          style={{
            maxWidth: 920,
            marginBottom: 32,
            color: "#94a3b8",
            fontSize: 18,
            lineHeight: 1.7,
          }}
        >
          Every protected POST request must
          prove its identity and body integrity
          through an HMAC envelope. Expired,
          altered, incorrectly routed, unsigned,
          or replayed requests fail closed.
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
              Authentication
            </div>

            <strong style={{ fontSize: 26 }}>
              HMAC-SHA256
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
              Freshness window
            </div>

            <strong style={{ fontSize: 26 }}>
              {
                posture.maximumClockSkewMs /
                60000
              } minutes
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
              Production default
            </div>

            <strong style={{ fontSize: 26 }}>
              FAIL-CLOSED
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

            <strong style={{ fontSize: 26 }}>
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
              "1px solid rgba(245,158,11,0.3)",
            background:
              "rgba(120,53,15,0.18)",
          }}
        >
          <strong>
            Durable production replay protection remains mandatory
          </strong>

          <p
            style={{
              marginBottom: 0,
              color: "#fde68a",
              lineHeight: 1.7,
            }}
          >
            Process-local nonce protection is
            active for controlled preview use.
            Production POST requests remain
            blocked by default until shared
            durable nonce persistence is
            explicitly authorized. No execution
            authority is granted.
          </p>
        </section>
      </div>
    </main>
  );
}
