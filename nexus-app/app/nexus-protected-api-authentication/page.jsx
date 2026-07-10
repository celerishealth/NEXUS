import {
  getProtectedApiAuthenticationPosture,
} from "../../lib/nexus/protectedApiSignedEnvelope.mjs";

import {
  getProtectedApiReplayStorePosture,
} from "../../lib/nexus/protectedApiReplayStore.mjs";

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
  const authentication =
    getProtectedApiAuthenticationPosture();

  const replayStore =
    getProtectedApiReplayStorePosture();

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
          NEXUS DAY 670 · DURABLE REPLAY SECURITY
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
          Signed requests now consume their
          nonce through one atomic PostgreSQL
          replay ledger.
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
          Concurrent servers, restarts, and
          duplicate requests use the same
          tenant-bound and owner-bound database
          uniqueness boundary. A nonce can be
          inserted only once.
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
              Durable mode
            </div>

            <strong style={{ fontSize: 23 }}>
              {replayStore.mode}
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
              Atomic control
            </div>

            <strong style={{ fontSize: 23 }}>
              PRIMARY KEY
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
              Database configured
            </div>

            <strong style={{ fontSize: 23 }}>
              {replayStore.databaseConfigured
                ? "YES"
                : "NOT YET"}
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
              Production fallback
            </div>

            <strong style={{ fontSize: 23 }}>
              BLOCKED
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
          {authentication.controls.map(
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
            Migration execution remains owner-controlled
          </strong>

          <p
            style={{
              marginBottom: 0,
              color: "#fde68a",
              lineHeight: 1.7,
            }}
          >
            The PostgreSQL adapter and migration
            are ready, but no live migration was
            executed. Production requests remain
            blocked until DATABASE_URL is
            configured, the migration is applied
            through an authorized process, and
            replay mode is set to
            postgres-atomic-v1.
          </p>
        </section>
      </div>
    </main>
  );
}
