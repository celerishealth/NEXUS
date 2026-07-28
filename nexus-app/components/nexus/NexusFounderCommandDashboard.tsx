"use client";

import {
  type FormEvent,
  useState,
} from "react";

import {
  FounderCommandSnapshotClientError,
  type FounderCommandSnapshotResult,
  readFounderCommandSnapshot,
} from "@/lib/nexus/founderCommandSnapshotClient";
import {
  FounderGrowthSnapshotClientError,
  type FounderGrowthSnapshotResult,
  readFounderGrowthSnapshot,
} from "@/lib/nexus/founderGrowthSnapshotClient";

import {
  FounderEmergencyClientError,
  type FounderEmergencySession,
  issueFounderEmergencySession,
  revokeFounderEmergencySession,
} from "@/lib/nexus/founderEmergencyClient";

type BusyAction =
  | "login"
  | "refresh"
  | "logout"
  | null;

function safeMessage(
  error: unknown,
): string {
  if (
    error instanceof
      FounderCommandSnapshotClientError ||
    error instanceof
      FounderEmergencyClientError
  ) {
    return error.message;
  }

  return "Founder command dashboard failed safely. No action was taken.";
}

function readRecordText(
  value: unknown,
  field: string,
  fallback: string,
): string {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    return fallback;
  }

  const candidate =
    (value as Record<string, unknown>)[field];

  return typeof candidate === "string" &&
    candidate.trim().length > 0
    ? candidate.trim()
    : fallback;
}

export default function NexusFounderCommandDashboard() {
  const [tenantId, setTenantId] =
    useState("");
  const [email, setEmail] =
    useState("");
  const [password, setPassword] =
    useState("");

  const [session, setSession] =
    useState<FounderEmergencySession | null>(
      null,
    );
  const [result, setResult] =
    useState<FounderCommandSnapshotResult | null>(
      null,
    );
  const [busy, setBusy] =
    useState<BusyAction>(null);
  const [message, setMessage] =
    useState("");
  const [growthResult, setGrowthResult] =
    useState<FounderGrowthSnapshotResult | null>(
      null,
    );
  const [growthMessage, setGrowthMessage] =
    useState("");

  async function loadGrowthSnapshot(
    currentSession: FounderEmergencySession,
  ) {
    setGrowthMessage("");

    try {
      const growth =
        await readFounderGrowthSnapshot({
          accessToken:
            currentSession.accessToken,
          expectedTenantId:
            currentSession.tenantId,
          expectedOwnerActorId:
            currentSession.actorId,
        });

      setGrowthResult(growth);
      setGrowthMessage(
        "Founder growth snapshot verified.",
      );
    } catch (error) {
      setGrowthResult(null);
      setGrowthMessage(
        error instanceof
          FounderGrowthSnapshotClientError
          ? error.message
          : "Founder growth snapshot request failed safely. No action was taken.",
      );
    }
  }

  function lockBrowserSession(
    nextMessage: string,
  ) {
    setSession(null);
    setResult(null);
    setGrowthResult(null);
    setGrowthMessage("");
    setPassword("");
    setMessage(nextMessage);
  }

  async function authenticate(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setBusy("login");
    setMessage("");
    setResult(null);
    setGrowthResult(null);
    setGrowthMessage("");

    try {
      const issuedSession =
        await issueFounderEmergencySession({
          tenantId,
          email,
          password,
        });

      const current =
        await readFounderCommandSnapshot({
          accessToken:
            issuedSession.accessToken,
          expectedTenantId:
            issuedSession.tenantId,
          expectedOwnerActorId:
            issuedSession.actorId,
        });

      setPassword("");
      setSession(issuedSession);
      setResult(current);
      setMessage(
        "Authenticated founder command snapshot verified.",
      );
      await loadGrowthSnapshot(issuedSession);
    } catch (error) {
      setPassword("");
      setSession(null);
      setResult(null);
      setGrowthResult(null);
      setGrowthMessage("");
      setMessage(safeMessage(error));
    } finally {
      setBusy(null);
    }
  }

  async function refreshSnapshot() {
    if (!session) {
      setMessage(
        "Authenticate before reading the founder command snapshot.",
      );
      return;
    }

    setBusy("refresh");
    setMessage("");

    try {
      const current =
        await readFounderCommandSnapshot({
          accessToken:
            session.accessToken,
          expectedTenantId:
            session.tenantId,
          expectedOwnerActorId:
            session.actorId,
        });

      setResult(current);
      setMessage(
        "Founder command snapshot refreshed.",
      );
      await loadGrowthSnapshot(session);
    } catch (error) {
      setResult(null);
      setGrowthResult(null);
      setGrowthMessage("");

      if (
        error instanceof
          FounderCommandSnapshotClientError &&
        error.status === 401
      ) {
        lockBrowserSession(
          "Session expired or was revoked. Browser-held access token cleared safely.",
        );
      } else {
        setMessage(safeMessage(error));
      }
    } finally {
      setBusy(null);
    }
  }

  async function logoutFounderSession() {
    if (!session) {
      setMessage(
        "Authenticate before requesting an authenticated logout.",
      );
      return;
    }

    const accessToken =
      session.accessToken;

    setBusy("logout");
    setMessage("");

    try {
      await revokeFounderEmergencySession(
        accessToken,
      );

      lockBrowserSession(
        "Authenticated logout verified. Browser-held access token cleared. No execution or resume action was performed.",
      );
    } catch (error) {
      if (
        error instanceof
          FounderEmergencyClientError &&
        error.status === 401
      ) {
        lockBrowserSession(
          "Session was already invalid or revoked. Browser-held access token cleared safely.",
        );
      } else {
        setResult(null);
        setGrowthResult(null);
        setGrowthMessage("");
        setMessage(safeMessage(error));
      }
    } finally {
      setBusy(null);
    }
  }

  const actionEntries =
    result
      ? Object.entries(
          result.snapshot.actions,
        )
      : [];
  const outboxEntries =
    result
      ? Object.entries(
          result.snapshot.outbox,
        )
      : [];
  const auditEntries =
    result?.snapshot.audit ?? [];

  return (
    <section className="rounded-[2rem] border border-sky-400/25 bg-slate-950/95 p-5 shadow-2xl shadow-sky-950/30 sm:p-8">
      <header className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-sky-300">
            Owner-only operational visibility
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">
            Founder Command Dashboard
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            Authenticate through the existing tenant-owner session boundary
            and read the server-bound controlled-action snapshot. This surface
            is read-only and exposes no execution, approval, provider mutation,
            payment, customer-contact, or resume controls.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-2 text-emerald-200">
            Read-only
          </span>
          <span className="rounded-full border border-sky-300/30 bg-sky-300/10 px-3 py-2 text-sky-200">
            Owner-bound
          </span>
          <span className="rounded-full border border-slate-500 bg-slate-800 px-3 py-2 text-slate-200">
            No execution
          </span>
        </div>
      </header>

      {!session ? (
        <form
          className="mt-8 grid gap-4 rounded-2xl border border-slate-700 bg-slate-900/75 p-5 lg:grid-cols-3"
          onSubmit={authenticate}
        >
          <label className="grid gap-2 text-sm font-semibold text-slate-200">
            Workspace ID
            <input
              className="rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400"
              value={tenantId}
              onChange={(event) => {
                setTenantId(
                  event.target.value,
                );
              }}
              autoComplete="organization"
              required
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-200">
            Owner email
            <input
              className="rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(
                  event.target.value,
                );
              }}
              autoComplete="username"
              required
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-200">
            Password
            <input
              className="rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(
                  event.target.value,
                );
              }}
              autoComplete="current-password"
              required
            />
          </label>

          <div className="lg:col-span-3">
            <button
              className="rounded-xl bg-sky-400 px-5 py-3 font-black text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
              type="submit"
              disabled={busy !== null}
            >
              {busy === "login"
                ? "Authenticating..."
                : "Authenticate and load snapshot"}
            </button>

            <p className="mt-3 text-xs leading-5 text-slate-400">
              The access token is held only in this component&apos;s memory.
              It is not persisted in browser storage.
            </p>
          </div>
        </form>
      ) : (
        <div className="mt-8 grid gap-5">
          <section className="rounded-2xl border border-slate-700 bg-slate-900/75 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                  Authenticated founder session
                </p>
                <p className="mt-2 font-semibold text-white">
                  Tenant {session.tenantId} / Actor {session.actorId}
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Role {session.role} / Expires {session.expiresAt}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  className="rounded-xl border border-sky-400/40 px-4 py-2 font-semibold text-sky-200 disabled:opacity-50"
                  type="button"
                  onClick={refreshSnapshot}
                  disabled={busy !== null}
                >
                  {busy === "refresh"
                    ? "Refreshing..."
                    : "Refresh snapshot"}
                </button>

                <button
                  className="rounded-xl border border-slate-500 px-4 py-2 font-semibold text-slate-200 disabled:opacity-50"
                  type="button"
                  onClick={logoutFounderSession}
                  disabled={busy !== null}
                >
                  {busy === "logout"
                    ? "Revoking session..."
                    : "Log out and revoke session"}
                </button>
              </div>
            </div>
          </section>

          {result ? (
            <>
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <article className="rounded-2xl border border-slate-700 bg-slate-900/75 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Revision
                  </p>
                  <p
                    className="mt-3 text-3xl font-black text-white"
                    aria-label="Snapshot revision"
                  >
                    {result.snapshot.revision}
                  </p>
                </article>

                <article className="rounded-2xl border border-slate-700 bg-slate-900/75 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Kill switch
                  </p>
                  <p
                    className={`mt-3 text-2xl font-black ${
                      result.snapshot.killSwitch.engaged
                        ? "text-red-300"
                        : "text-emerald-300"
                    }`}
                  >
                    {result.snapshot.killSwitch.engaged
                      ? "ENGAGED"
                      : "CLEAR"}
                  </p>
                  <p className="mt-2 text-xs text-slate-400">
                    {result.snapshot.killSwitch.reason ??
                      "No blocking reason"}
                  </p>
                </article>

                <article className="rounded-2xl border border-slate-700 bg-slate-900/75 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Controlled actions
                  </p>
                  <p className="mt-3 text-3xl font-black text-white">
                    {actionEntries.length}
                  </p>
                </article>

                <article className="rounded-2xl border border-slate-700 bg-slate-900/75 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Outbox records
                  </p>
                  <p className="mt-3 text-3xl font-black text-white">
                    {outboxEntries.length}
                  </p>
                </article>

                <article className="rounded-2xl border border-slate-700 bg-slate-900/75 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Audit records
                  </p>
                  <p className="mt-3 text-3xl font-black text-white">
                    {auditEntries.length}
                  </p>
                </article>
              </section>

              <section
                aria-label="Founder growth evidence"
                className="rounded-2xl border border-sky-300/20 bg-sky-950/20 p-5"
              >
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-300">
                    Growth-to-revenue evidence
                  </p>
                  <h2 className="text-xl font-bold text-white">
                    Verified inquiry totals
                  </h2>
                  <p className="text-sm leading-6 text-slate-300">
                    Exact-tenant aggregate evidence only. Customer contact, provider execution, payments, and public launch remain unauthorized.
                  </p>
                </div>

                {growthResult ? (
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <article className="rounded-xl border border-slate-700 bg-slate-950/70 p-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                        Total inquiries
                      </p>
                      <p
                        aria-label="Growth total inquiries"
                        className="mt-2 text-3xl font-black text-white"
                      >
                        {growthResult.snapshot.totalInquiries}
                      </p>
                    </article>
                    <article className="rounded-xl border border-slate-700 bg-slate-950/70 p-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                        Unique customers
                      </p>
                      <p
                        aria-label="Growth unique customers"
                        className="mt-2 text-3xl font-black text-white"
                      >
                        {growthResult.snapshot.uniqueCustomers}
                      </p>
                    </article>
                  </div>
                ) : (
                  <p className="mt-5 rounded-xl border border-amber-300/25 bg-amber-950/20 p-4 text-sm text-amber-100">
                    {growthMessage ||
                      "Founder growth evidence has not been verified."}
                  </p>
                )}

                <p className="mt-4 text-xs leading-5 text-slate-400">
                  Qualified leads, quotations, orders, and revenue remain unavailable until separately verified evidence exists.
                </p>
              </section>

              <section className="grid gap-5 xl:grid-cols-2">
                <article className="rounded-2xl border border-slate-700 bg-slate-900/75 p-5">
                  <h2 className="text-xl font-bold text-white">
                    Controlled-action evidence
                  </h2>

                  {actionEntries.length > 0 ? (
                    <ul className="mt-4 grid gap-3">
                      {actionEntries.map(
                        ([actionId, action]) => (
                          <li
                            className="rounded-xl border border-slate-700 bg-slate-950/70 p-4"
                            key={actionId}
                          >
                            <p className="break-all font-semibold text-sky-200">
                              {actionId}
                            </p>
                            <p className="mt-2 text-sm text-slate-300">
                              Status{" "}
                              {readRecordText(
                                action,
                                "status",
                                "Unavailable",
                              )}
                            </p>
                          </li>
                        ),
                      )}
                    </ul>
                  ) : (
                    <p className="mt-4 text-sm text-slate-400">
                      No controlled actions are present for this tenant.
                    </p>
                  )}
                </article>

                <article className="rounded-2xl border border-slate-700 bg-slate-900/75 p-5">
                  <h2 className="text-xl font-bold text-white">
                    Audit evidence
                  </h2>

                  {auditEntries.length > 0 ? (
                    <ul className="mt-4 grid gap-3">
                      {auditEntries.map(
                        (entry, index) => (
                          <li
                            className="rounded-xl border border-slate-700 bg-slate-950/70 p-4"
                            key={`${readRecordText(
                              entry,
                              "auditId",
                              "audit",
                            )}-${index}`}
                          >
                            <p className="break-all font-semibold text-emerald-200">
                              {readRecordText(
                                entry,
                                "auditId",
                                `Audit record ${index + 1}`,
                              )}
                            </p>
                            <p className="mt-2 text-sm text-slate-300">
                              Tenant{" "}
                              {readRecordText(
                                entry,
                                "tenantId",
                                "Unavailable",
                              )}
                            </p>
                          </li>
                        ),
                      )}
                    </ul>
                  ) : (
                    <p className="mt-4 text-sm text-slate-400">
                      No audit records are present for this tenant.
                    </p>
                  )}
                </article>
              </section>

              <section className="rounded-2xl border border-amber-300/25 bg-amber-950/20 p-5">
                <h2 className="font-bold text-amber-100">
                  Locked operational boundary
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Request {result.requestId}. Boundary{" "}
                  {result.executionBoundary}. Live provider execution,
                  provider mutation, resume, payments, public launch, and
                  customer contact remain unauthorized.
                </p>
              </section>
            </>
          ) : (
            <section className="rounded-2xl border border-amber-300/25 bg-amber-950/20 p-5">
              <p className="text-sm text-amber-100">
                No verified snapshot is currently displayed. Refresh only
                after confirming the authenticated founder session.
              </p>
            </section>
          )}
        </div>
      )}

      {message ? (
        <p
          className="mt-5 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200"
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      ) : null}

      <footer className="mt-6 grid gap-2 text-xs text-slate-400 sm:grid-cols-3">
        <p>Provider execution: unauthorized</p>
        <p>Provider mutation: unauthorized</p>
        <p>Resume control: unavailable</p>
      </footer>
    </section>
  );
}
