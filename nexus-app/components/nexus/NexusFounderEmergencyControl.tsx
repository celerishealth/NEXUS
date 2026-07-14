"use client";

import {
  type FormEvent,
  useState,
} from "react";

import {
  FounderEmergencyClientError,
  type FounderEmergencyOperationSnapshot,
  type FounderEmergencySession,
  issueFounderEmergencySession,
  pauseFounderEmergency,
  readFounderEmergencyStatus,
  revokeFounderEmergencySession,
} from "@/lib/nexus/founderEmergencyClient";

type BusyAction =
  | "login"
  | "status"
  | "pause"
  | "logout"
  | null;

function safeMessage(
  error: unknown,
): string {
  return error instanceof
    FounderEmergencyClientError
    ? error.message
    : "Founder emergency control failed safely. No action was taken.";
}

function formatTransitionTime(
  value: number,
): string {
  const date = new Date(value);

  return Number.isNaN(
    date.getTime(),
  )
    ? "Unavailable"
    : date.toLocaleString();
}

export default function NexusFounderEmergencyControl() {
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

  const [snapshot, setSnapshot] =
    useState<FounderEmergencyOperationSnapshot | null>(
      null,
    );

  const [
    emergencyPauseAvailable,
    setEmergencyPauseAvailable,
  ] = useState(false);

  const [busy, setBusy] =
    useState<BusyAction>(null);

  const [message, setMessage] =
    useState("");

  const [
    pauseConfirmationOpen,
    setPauseConfirmationOpen,
  ] = useState(false);

  async function authenticate(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setBusy("login");
    setMessage("");
    setSnapshot(null);
    setEmergencyPauseAvailable(
      false,
    );
    setPauseConfirmationOpen(
      false,
    );

    try {
      const issuedSession =
        await issueFounderEmergencySession({
          tenantId,
          email,
          password,
        });

      setPassword("");
      setSession(issuedSession);

      const current =
        await readFounderEmergencyStatus(
          issuedSession.accessToken,
        );

      setSnapshot(current);
      setEmergencyPauseAvailable(
        current.emergencyPauseAvailable,
      );
      setMessage(
        "Authenticated founder emergency status verified.",
      );
    } catch (error) {
      setPassword("");
      setSession(null);
      setMessage(
        safeMessage(error),
      );
    } finally {
      setBusy(null);
    }
  }

  async function refreshStatus() {
    if (!session) {
      setMessage(
        "Authenticate before reading founder emergency status.",
      );
      return;
    }

    setBusy("status");
    setMessage("");
    setPauseConfirmationOpen(
      false,
    );

    try {
      const current =
        await readFounderEmergencyStatus(
          session.accessToken,
        );

      setSnapshot(current);
      setEmergencyPauseAvailable(
        current.emergencyPauseAvailable,
      );
      setMessage(
        "Founder emergency status refreshed.",
      );
    } catch (error) {
      setMessage(
        safeMessage(error),
      );
    } finally {
      setBusy(null);
    }
  }

  async function confirmEmergencyPause() {
    if (!session) {
      setMessage(
        "Authenticate before requesting an emergency pause.",
      );
      return;
    }

    setBusy("pause");
    setMessage("");

    try {
      const paused =
        await pauseFounderEmergency(
          session.accessToken,
        );

      setSnapshot(paused);
      setEmergencyPauseAvailable(
        false,
      );
      setPauseConfirmationOpen(
        false,
      );
      setMessage(
        paused.pauseStatus ===
          "already-paused"
          ? "Operations were already paused. No second mutation was performed."
          : "Emergency pause verified. Controlled operations are paused.",
      );
    } catch (error) {
      setPauseConfirmationOpen(
        false,
      );
      setMessage(
        safeMessage(error),
      );
    } finally {
      setBusy(null);
    }
  }

  function lockBrowserSession(
    nextMessage: string,
  ) {
    setSession(null);
    setSnapshot(null);
    setPassword("");
    setMessage(nextMessage);
    setEmergencyPauseAvailable(
      false,
    );
    setPauseConfirmationOpen(
      false,
    );
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
    setPauseConfirmationOpen(
      false,
    );

    try {
      await revokeFounderEmergencySession(
        accessToken,
      );

      lockBrowserSession(
        "Authenticated logout verified. Browser-held access token cleared. No resume action was performed.",
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
        setSnapshot(null);
        setEmergencyPauseAvailable(
          false,
        );
        setMessage(
          safeMessage(error),
        );
      }
    } finally {
      setBusy(null);
    }
  }

  const isPaused =
    snapshot?.operationStatus ===
    "paused";

  return (
    <section className="mb-6 rounded-3xl border border-red-400/30 bg-slate-950/90 p-6 shadow-2xl shadow-red-950/20">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-300">
            Day 803 Â· Owner-only emergency control
          </p>

          <h2 className="mt-3 text-2xl font-bold text-white">
            Founder Emergency Pause
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            Authenticate with the existing tenant-owner session boundary,
            verify the server-bound operation state, and pause controlled
            operations only after explicit confirmation.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-2 text-emerald-200">
            Owner-controlled
          </span>
          <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-amber-200">
            Pause only
          </span>
          <span className="rounded-full border border-slate-500/50 bg-slate-800 px-3 py-2 text-slate-200">
            No resume control
          </span>
        </div>
      </div>

      {!session ? (
        <form
          className="mt-6 grid gap-4 rounded-2xl border border-slate-700 bg-slate-900/70 p-5 lg:grid-cols-3"
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
              className="rounded-xl bg-sky-500 px-5 py-3 font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
              type="submit"
              disabled={busy !== null}
            >
              {busy === "login"
                ? "Authenticatingâ€¦"
                : "Authenticate and verify status"}
            </button>

            <p className="mt-3 text-xs leading-5 text-slate-400">
              The access token is held only in this page&apos;s memory. It is
              not written to local storage or session storage.
            </p>
          </div>
        </form>
      ) : (
        <div className="mt-6 grid gap-4">
          <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Authenticated session
                </p>
                <p className="mt-2 font-semibold text-white">
                  Tenant {session.tenantId} Â· Actor {session.actorId}
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Role {session.role} Â· Expires {session.expiresAt}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  className="rounded-xl border border-sky-400/40 px-4 py-2 font-semibold text-sky-200 disabled:opacity-50"
                  type="button"
                  onClick={refreshStatus}
                  disabled={busy !== null}
                >
                  {busy === "status"
                    ? "Refreshingâ€¦"
                    : "Refresh status"}
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
          </div>

          {snapshot ? (
            <div className="grid gap-4 lg:grid-cols-3">
              <article className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Operation state
                </p>
                <p
                  className={`mt-3 text-2xl font-bold ${
                    isPaused
                      ? "text-amber-300"
                      : "text-emerald-300"
                  }`}
                >
                  {snapshot.operationStatus.toUpperCase()}
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  State version {snapshot.stateVersion}
                </p>
              </article>

              <article className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Server-bound identity
                </p>
                <p className="mt-3 font-semibold text-white">
                  {snapshot.tenantId}
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  Owner {snapshot.ownerActorId}
                </p>
              </article>

              <article className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Last transition
                </p>
                <p className="mt-3 font-semibold text-white">
                  {formatTransitionTime(
                    snapshot.lastTransitionAt,
                  )}
                </p>
                <p className="mt-2 break-all text-xs text-slate-400">
                  Signal {snapshot.blockingSignalId ?? "None"}
                </p>
              </article>
            </div>
          ) : null}

          <div className="rounded-2xl border border-red-400/30 bg-red-950/20 p-5">
            <h3 className="font-bold text-red-100">
              Emergency action boundary
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              The browser sends no tenant ID, owner ID, signal ID, or resume
              instruction to the pause endpoint. Identity is derived from the
              active bearer session and the emergency signal is generated by
              the server.
            </p>

            {!pauseConfirmationOpen ? (
              <button
                className="mt-4 rounded-xl bg-red-500 px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
                type="button"
                onClick={() => {
                  setPauseConfirmationOpen(
                    true,
                  );
                  setMessage("");
                }}
                disabled={
                  busy !== null ||
                  isPaused ||
                  !emergencyPauseAvailable
                }
              >
                {isPaused
                  ? "Operations already paused"
                  : "Open emergency-pause confirmation"}
              </button>
            ) : (
              <div className="mt-4 rounded-xl border border-red-300/40 bg-red-950/50 p-4">
                <p className="font-semibold text-red-100">
                  Confirm the founder emergency pause?
                </p>
                <p className="mt-2 text-sm leading-6 text-red-100/80">
                  This is a pause-only operation. It does not authorize live
                  provider execution and it does not provide a resume action.
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    className="rounded-xl bg-red-500 px-5 py-3 font-bold text-white disabled:opacity-50"
                    type="button"
                    onClick={confirmEmergencyPause}
                    disabled={busy !== null}
                  >
                    {busy === "pause"
                      ? "Pausing safelyâ€¦"
                      : "Confirm emergency pause"}
                  </button>

                  <button
                    className="rounded-xl border border-slate-500 px-5 py-3 font-semibold text-slate-200 disabled:opacity-50"
                    type="button"
                    onClick={() => {
                      setPauseConfirmationOpen(
                        false,
                      );
                    }}
                    disabled={busy !== null}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {message ? (
        <p
          className="mt-4 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200"
          role="status"
        >
          {message}
        </p>
      ) : null}

      <div className="mt-5 grid gap-2 text-xs text-slate-400 sm:grid-cols-2">
        <p>Live provider execution: unauthorized</p>
        <p>Resume API/control: not available</p>
      </div>
    </section>
  );
}