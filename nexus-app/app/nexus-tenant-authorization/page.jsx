import {
  getProtectedApiTenantAuthorizationGuardPosture,
} from "../../lib/nexus/protectedApiTenantAuthorizationGuard.mjs";

import {
  getProtectedApiTenantAuthorizationPosture,
} from "../../lib/nexus/protectedApiTenantAuthorizationStore.mjs";

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

export default function TenantAuthorizationPage() {
  const guard =
    getProtectedApiTenantAuthorizationGuardPosture();

  const store =
    getProtectedApiTenantAuthorizationPosture();

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
          NEXUS DAY 671 · TENANT AUTHORIZATION
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
          Signed identities now require an
          active PostgreSQL tenant-owner
          membership before protected logic.
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
          A valid signature alone is no longer
          enough. The tenant, owner identity,
          membership, owner role, and authority
          epoch must all be active and match the
          signed request.
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
              Authorization mode
            </div>

            <strong style={{ fontSize: 22 }}>
              {store.mode}
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
              Required role
            </div>

            <strong style={{ fontSize: 25 }}>
              OWNER
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
              Cross-tenant access
            </div>

            <strong style={{ fontSize: 25 }}>
              DENIED
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

            <strong style={{ fontSize: 25 }}>
              {store.databaseConfigured
                ? "YES"
                : "NOT YET"}
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
          {guard.controls.map(
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
            Live migration remains unauthorized
          </strong>

          <p
            style={{
              marginBottom: 0,
              color: "#fde68a",
              lineHeight: 1.7,
            }}
          >
            The tenant authorization schema and
            integration are prepared, tested,
            and fail-closed. No live database
            migration or membership creation was
            performed. Protected POST requests
            remain blocked until the migration
            and configuration are explicitly
            authorized.
          </p>
        </section>
      </div>
    </main>
  );
}
