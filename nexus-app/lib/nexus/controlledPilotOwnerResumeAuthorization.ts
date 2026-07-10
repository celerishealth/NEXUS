import {
  createHmac,
  randomUUID,
  timingSafeEqual,
} from "node:crypto";

import type {
  ControlledPilotRecoveryDecision,
} from "./controlledPilotRecoveryGate";

const TOKEN_AUDIENCE = "nexus-controlled-pilot-resume";
const TOKEN_TYPE = "controlled-pilot-owner-resume";
const TOKEN_VERSION = 1;

const DEFAULT_TTL_SECONDS = 300;
const MIN_TTL_SECONDS = 60;
const MAX_TTL_SECONDS = 900;
const MINIMUM_SECRET_LENGTH = 32;
const MAX_CLOCK_SKEW_SECONDS = 30;

export interface ControlledPilotOwnerResumeAuthorizationInput {
  tenantId: string;
  signalId: string;
  ownerId: string;
  ownerRole: "owner";
  ownerApproved: boolean;
  recoveryDecision: ControlledPilotRecoveryDecision;
  ttlSeconds?: number;
}

export interface ControlledPilotOwnerResumeProofPayload {
  version: 1;
  type: typeof TOKEN_TYPE;
  audience: typeof TOKEN_AUDIENCE;
  tenantId: string;
  signalId: string;
  ownerId: string;
  tokenId: string;
  issuedAt: number;
  expiresAt: number;
}

export interface ControlledPilotOwnerResumeProofIssued {
  ok: true;
  token: string;
  tokenId: string;
  tenantId: string;
  signalId: string;
  issuedAt: number;
  expiresAt: number;
  automaticResumeAuthorized: false;
  pilotOperationPermitted: false;
  liveProviderExecutionAuthorized: false;
  publicLaunchAuthorized: false;
}

export interface ControlledPilotOwnerResumeProofRejected {
  ok: false;
  code:
    | "INVALID_SIGNING_SECRET"
    | "INVALID_OWNER_AUTHORIZATION_INPUT"
    | "OWNER_APPROVAL_REQUIRED"
    | "OWNER_ROLE_REQUIRED"
    | "RECOVERY_DECISION_NOT_READY";
  reason: string;
  automaticResumeAuthorized: false;
  pilotOperationPermitted: false;
  liveProviderExecutionAuthorized: false;
  publicLaunchAuthorized: false;
}

export type ControlledPilotOwnerResumeProofIssueResult =
  | ControlledPilotOwnerResumeProofIssued
  | ControlledPilotOwnerResumeProofRejected;

export interface ControlledPilotOwnerResumeProofVerificationInput {
  token: string;
  signingSecret: string;
  expectedTenantId: string;
  expectedSignalId: string;
  consumedTokenIds?: readonly string[];
  nowEpochSeconds?: number;
}

export interface ControlledPilotOwnerResumeProofVerified {
  valid: true;
  code: "SIGNED_OWNER_RESUME_PROOF_VALID";
  payload: ControlledPilotOwnerResumeProofPayload;
  persistentConsumptionRequired: true;
  automaticResumeAuthorized: false;
  pilotOperationPermitted: false;
  liveProviderExecutionAuthorized: false;
  publicLaunchAuthorized: false;
}

export interface ControlledPilotOwnerResumeProofInvalid {
  valid: false;
  code:
    | "INVALID_SIGNING_SECRET"
    | "INVALID_VERIFICATION_INPUT"
    | "MALFORMED_TOKEN"
    | "UNSUPPORTED_TOKEN_HEADER"
    | "INVALID_TOKEN_SIGNATURE"
    | "INVALID_TOKEN_PAYLOAD"
    | "TOKEN_NOT_YET_VALID"
    | "TOKEN_EXPIRED"
    | "TENANT_BINDING_MISMATCH"
    | "SIGNAL_BINDING_MISMATCH"
    | "TOKEN_ALREADY_CONSUMED";
  reason: string;
  persistentConsumptionRequired: true;
  automaticResumeAuthorized: false;
  pilotOperationPermitted: false;
  liveProviderExecutionAuthorized: false;
  publicLaunchAuthorized: false;
}

export type ControlledPilotOwnerResumeProofVerification =
  | ControlledPilotOwnerResumeProofVerified
  | ControlledPilotOwnerResumeProofInvalid;

interface TokenHeader {
  alg: "HS256";
  typ: "NEXUS-PILOT-RESUME";
  version: 1;
}

function failIssue(
  code: ControlledPilotOwnerResumeProofRejected["code"],
  reason: string,
): ControlledPilotOwnerResumeProofRejected {
  return {
    ok: false,
    code,
    reason,
    automaticResumeAuthorized: false,
    pilotOperationPermitted: false,
    liveProviderExecutionAuthorized: false,
    publicLaunchAuthorized: false,
  };
}

function failVerification(
  code: ControlledPilotOwnerResumeProofInvalid["code"],
  reason: string,
): ControlledPilotOwnerResumeProofInvalid {
  return {
    valid: false,
    code,
    reason,
    persistentConsumptionRequired: true,
    automaticResumeAuthorized: false,
    pilotOperationPermitted: false,
    liveProviderExecutionAuthorized: false,
    publicLaunchAuthorized: false,
  };
}

function normalizeRequiredString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  return normalized.length > 0 ? normalized : null;
}

function isSigningSecretValid(secret: unknown): secret is string {
  return (
    typeof secret === "string" &&
    secret.length >= MINIMUM_SECRET_LENGTH
  );
}

function encodeJson(value: unknown): string {
  return Buffer.from(
    JSON.stringify(value),
    "utf8",
  ).toString("base64url");
}

function signEncodedToken(
  encodedHeader: string,
  encodedPayload: string,
  signingSecret: string,
): string {
  return createHmac("sha256", signingSecret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest()
    .toString("base64url");
}

function safeSignatureMatch(
  providedSignature: string,
  expectedSignature: string,
): boolean {
  try {
    const provided = Buffer.from(providedSignature, "base64url");
    const expected = Buffer.from(expectedSignature, "base64url");

    if (
      provided.length === 0 ||
      expected.length === 0 ||
      provided.length !== expected.length
    ) {
      return false;
    }

    return timingSafeEqual(provided, expected);
  } catch {
    return false;
  }
}

function parseJsonPart(value: string): unknown {
  return JSON.parse(
    Buffer.from(value, "base64url").toString("utf8"),
  );
}

function isTokenHeader(value: unknown): value is TokenHeader {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    record.alg === "HS256" &&
    record.typ === "NEXUS-PILOT-RESUME" &&
    record.version === TOKEN_VERSION
  );
}

function isProofPayload(
  value: unknown,
): value is ControlledPilotOwnerResumeProofPayload {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    record.version === TOKEN_VERSION &&
    record.type === TOKEN_TYPE &&
    record.audience === TOKEN_AUDIENCE &&
    normalizeRequiredString(record.tenantId) !== null &&
    normalizeRequiredString(record.signalId) !== null &&
    normalizeRequiredString(record.ownerId) !== null &&
    normalizeRequiredString(record.tokenId) !== null &&
    typeof record.issuedAt === "number" &&
    Number.isInteger(record.issuedAt) &&
    typeof record.expiresAt === "number" &&
    Number.isInteger(record.expiresAt) &&
    record.expiresAt > record.issuedAt
  );
}

function normalizeTtlSeconds(value: unknown): number | null {
  if (value === undefined) {
    return DEFAULT_TTL_SECONDS;
  }

  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value < MIN_TTL_SECONDS ||
    value > MAX_TTL_SECONDS
  ) {
    return null;
  }

  return value;
}

export function issueControlledPilotOwnerResumeProof(
  input: ControlledPilotOwnerResumeAuthorizationInput,
  signingSecret: string,
  nowEpochSeconds = Math.floor(Date.now() / 1000),
): ControlledPilotOwnerResumeProofIssueResult {
  if (!isSigningSecretValid(signingSecret)) {
    return failIssue(
      "INVALID_SIGNING_SECRET",
      `Signing secret must contain at least ${MINIMUM_SECRET_LENGTH} characters.`,
    );
  }

  const tenantId = normalizeRequiredString(input?.tenantId);
  const signalId = normalizeRequiredString(input?.signalId);
  const ownerId = normalizeRequiredString(input?.ownerId);
  const ttlSeconds = normalizeTtlSeconds(input?.ttlSeconds);

  if (
    !tenantId ||
    !signalId ||
    !ownerId ||
    ttlSeconds === null ||
    !Number.isInteger(nowEpochSeconds) ||
    nowEpochSeconds < 0
  ) {
    return failIssue(
      "INVALID_OWNER_AUTHORIZATION_INPUT",
      "Tenant, signal, owner, TTL or issue-time input is invalid.",
    );
  }

  if (input.ownerRole !== "owner") {
    return failIssue(
      "OWNER_ROLE_REQUIRED",
      "Only the authenticated tenant owner may create a resume authorization proof.",
    );
  }

  if (input.ownerApproved !== true) {
    return failIssue(
      "OWNER_APPROVAL_REQUIRED",
      "Explicit owner approval is required before a signed proof can be created.",
    );
  }

  const decision = input.recoveryDecision;

  if (
    !decision ||
    decision.code !== "OWNER_RESUME_APPROVAL_REQUIRED" ||
    decision.status !== "hold-for-owner-review" ||
    decision.ownerActionRequired !== true ||
    decision.pilotOperationPermitted !== false ||
    decision.signalId !== signalId
  ) {
    return failIssue(
      "RECOVERY_DECISION_NOT_READY",
      "The recovery decision is not ready or does not match the incident signal.",
    );
  }

  const payload: ControlledPilotOwnerResumeProofPayload = {
    version: TOKEN_VERSION,
    type: TOKEN_TYPE,
    audience: TOKEN_AUDIENCE,
    tenantId,
    signalId,
    ownerId,
    tokenId: randomUUID(),
    issuedAt: nowEpochSeconds,
    expiresAt: nowEpochSeconds + ttlSeconds,
  };

  const header: TokenHeader = {
    alg: "HS256",
    typ: "NEXUS-PILOT-RESUME",
    version: TOKEN_VERSION,
  };

  const encodedHeader = encodeJson(header);
  const encodedPayload = encodeJson(payload);
  const signature = signEncodedToken(
    encodedHeader,
    encodedPayload,
    signingSecret,
  );

  return {
    ok: true,
    token: `${encodedHeader}.${encodedPayload}.${signature}`,
    tokenId: payload.tokenId,
    tenantId: payload.tenantId,
    signalId: payload.signalId,
    issuedAt: payload.issuedAt,
    expiresAt: payload.expiresAt,
    automaticResumeAuthorized: false,
    pilotOperationPermitted: false,
    liveProviderExecutionAuthorized: false,
    publicLaunchAuthorized: false,
  };
}

export function verifyControlledPilotOwnerResumeProof(
  input: ControlledPilotOwnerResumeProofVerificationInput,
): ControlledPilotOwnerResumeProofVerification {
  if (!isSigningSecretValid(input?.signingSecret)) {
    return failVerification(
      "INVALID_SIGNING_SECRET",
      `Signing secret must contain at least ${MINIMUM_SECRET_LENGTH} characters.`,
    );
  }

  const token = normalizeRequiredString(input?.token);
  const expectedTenantId = normalizeRequiredString(
    input?.expectedTenantId,
  );
  const expectedSignalId = normalizeRequiredString(
    input?.expectedSignalId,
  );

  const nowEpochSeconds =
    input?.nowEpochSeconds ??
    Math.floor(Date.now() / 1000);

  if (
    !token ||
    !expectedTenantId ||
    !expectedSignalId ||
    !Number.isInteger(nowEpochSeconds) ||
    nowEpochSeconds < 0
  ) {
    return failVerification(
      "INVALID_VERIFICATION_INPUT",
      "Token verification input is incomplete or invalid.",
    );
  }

  const parts = token.split(".");

  if (parts.length !== 3 || parts.some((part) => part.length === 0)) {
    return failVerification(
      "MALFORMED_TOKEN",
      "Signed owner resume proof is malformed.",
    );
  }

  const [
    encodedHeader,
    encodedPayload,
    providedSignature,
  ] = parts;

  let header: unknown;
  let payload: unknown;

  try {
    header = parseJsonPart(encodedHeader);
    payload = parseJsonPart(encodedPayload);
  } catch {
    return failVerification(
      "MALFORMED_TOKEN",
      "Signed owner resume proof cannot be decoded.",
    );
  }

  if (!isTokenHeader(header)) {
    return failVerification(
      "UNSUPPORTED_TOKEN_HEADER",
      "Signed owner resume proof uses an unsupported header.",
    );
  }

  const expectedSignature = signEncodedToken(
    encodedHeader,
    encodedPayload,
    input.signingSecret,
  );

  if (
    !safeSignatureMatch(
      providedSignature,
      expectedSignature,
    )
  ) {
    return failVerification(
      "INVALID_TOKEN_SIGNATURE",
      "Signed owner resume proof signature is invalid.",
    );
  }

  if (!isProofPayload(payload)) {
    return failVerification(
      "INVALID_TOKEN_PAYLOAD",
      "Signed owner resume proof payload is invalid.",
    );
  }

  if (
    payload.issuedAt >
    nowEpochSeconds + MAX_CLOCK_SKEW_SECONDS
  ) {
    return failVerification(
      "TOKEN_NOT_YET_VALID",
      "Signed owner resume proof issue time is in the future.",
    );
  }

  if (payload.expiresAt <= nowEpochSeconds) {
    return failVerification(
      "TOKEN_EXPIRED",
      "Signed owner resume proof has expired.",
    );
  }

  if (payload.tenantId !== expectedTenantId) {
    return failVerification(
      "TENANT_BINDING_MISMATCH",
      "Signed owner resume proof does not belong to the expected tenant.",
    );
  }

  if (payload.signalId !== expectedSignalId) {
    return failVerification(
      "SIGNAL_BINDING_MISMATCH",
      "Signed owner resume proof does not belong to the expected incident signal.",
    );
  }

  const consumedTokenIds =
    input.consumedTokenIds ?? [];

  if (consumedTokenIds.includes(payload.tokenId)) {
    return failVerification(
      "TOKEN_ALREADY_CONSUMED",
      "Signed owner resume proof has already been consumed.",
    );
  }

  return {
    valid: true,
    code: "SIGNED_OWNER_RESUME_PROOF_VALID",
    payload,
    persistentConsumptionRequired: true,
    automaticResumeAuthorized: false,
    pilotOperationPermitted: false,
    liveProviderExecutionAuthorized: false,
    publicLaunchAuthorized: false,
  };
}
