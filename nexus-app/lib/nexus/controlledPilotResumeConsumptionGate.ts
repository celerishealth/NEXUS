import type {
  ControlledPilotOwnerResumeProofInvalid,
  ControlledPilotOwnerResumeProofPayload,
} from "./controlledPilotOwnerResumeAuthorization";

import {
  verifyControlledPilotOwnerResumeProof,
} from "./controlledPilotOwnerResumeAuthorization";

export interface ControlledPilotResumeProofConsumptionRecord {
  tokenId: string;
  tenantId: string;
  signalId: string;
  ownerId: string;
  issuedAt: number;
  expiresAt: number;
  consumedAt: number;
}

export type ControlledPilotResumeProofConsumptionResult =
  | {
      status: "consumed";
      consumedAt: number;
    }
  | {
      status: "already-consumed";
      consumedAt: number | null;
    }
  | {
      status: "binding-conflict";
    }
  | {
      status: "ledger-unavailable";
    };

export interface ControlledPilotResumeProofLedger {
  consumeOnce(
    record: ControlledPilotResumeProofConsumptionRecord,
  ): Promise<ControlledPilotResumeProofConsumptionResult>;
}

export interface ControlledPilotResumeAuthorizationInput {
  proofToken: string;
  signingSecret: string;
  expectedTenantId: string;
  expectedSignalId: string;
  ledger: ControlledPilotResumeProofLedger;
  nowEpochSeconds?: number;
}

export interface ControlledPilotResumeAuthorized {
  authorized: true;
  code: "CONTROLLED_PILOT_RESUME_AUTHORIZED";
  proof: ControlledPilotOwnerResumeProofPayload;
  consumption: {
    tokenId: string;
    consumedAt: number;
  };
  automaticResumeAuthorized: false;
  pilotOperationPermitted: true;
  liveProviderExecutionAuthorized: false;
  publicLaunchAuthorized: false;
}

export interface ControlledPilotResumeRejected {
  authorized: false;
  code:
    | "INVALID_AUTHORIZATION_INPUT"
    | "SIGNED_PROOF_REJECTED"
    | "PROOF_ALREADY_CONSUMED"
    | "PROOF_BINDING_CONFLICT"
    | "CONSUMPTION_LEDGER_UNAVAILABLE"
    | "INVALID_CONSUMPTION_RESPONSE";
  reason: string;
  verificationCode?:
    ControlledPilotOwnerResumeProofInvalid["code"];
  automaticResumeAuthorized: false;
  pilotOperationPermitted: false;
  liveProviderExecutionAuthorized: false;
  publicLaunchAuthorized: false;
}

export type ControlledPilotResumeAuthorizationResult =
  | ControlledPilotResumeAuthorized
  | ControlledPilotResumeRejected;

function reject(
  code: ControlledPilotResumeRejected["code"],
  reason: string,
  verificationCode?:
    ControlledPilotOwnerResumeProofInvalid["code"],
): ControlledPilotResumeRejected {
  return {
    authorized: false,
    code,
    reason,
    ...(verificationCode
      ? {
          verificationCode,
        }
      : {}),
    automaticResumeAuthorized: false,
    pilotOperationPermitted: false,
    liveProviderExecutionAuthorized: false,
    publicLaunchAuthorized: false,
  };
}

function isValidEpochSecond(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 0
  );
}

function hasAtomicLedger(
  value: unknown,
): value is ControlledPilotResumeProofLedger {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (
      value as {
        consumeOnce?: unknown;
      }
    ).consumeOnce === "function"
  );
}

export async function authorizeControlledPilotResume(
  input: ControlledPilotResumeAuthorizationInput,
): Promise<ControlledPilotResumeAuthorizationResult> {
  const nowEpochSeconds =
    input?.nowEpochSeconds ??
    Math.floor(Date.now() / 1000);

  if (
    !input ||
    !hasAtomicLedger(input.ledger) ||
    !isValidEpochSecond(nowEpochSeconds)
  ) {
    return reject(
      "INVALID_AUTHORIZATION_INPUT",
      "Resume authorization input or atomic consumption ledger is invalid.",
    );
  }

  const verification =
    verifyControlledPilotOwnerResumeProof({
      token: input.proofToken,
      signingSecret: input.signingSecret,
      expectedTenantId: input.expectedTenantId,
      expectedSignalId: input.expectedSignalId,
      nowEpochSeconds,
    });

  if (!verification.valid) {
    return reject(
      "SIGNED_PROOF_REJECTED",
      verification.reason,
      verification.code,
    );
  }

  const proof = verification.payload;

  let consumption:
    ControlledPilotResumeProofConsumptionResult;

  try {
    consumption = await input.ledger.consumeOnce({
      tokenId: proof.tokenId,
      tenantId: proof.tenantId,
      signalId: proof.signalId,
      ownerId: proof.ownerId,
      issuedAt: proof.issuedAt,
      expiresAt: proof.expiresAt,
      consumedAt: nowEpochSeconds,
    });
  } catch {
    return reject(
      "CONSUMPTION_LEDGER_UNAVAILABLE",
      "The atomic consumption ledger failed. Pilot resume remains blocked.",
    );
  }

  if (
    !consumption ||
    typeof consumption !== "object" ||
    typeof consumption.status !== "string"
  ) {
    return reject(
      "INVALID_CONSUMPTION_RESPONSE",
      "The atomic consumption ledger returned an invalid response.",
    );
  }

  if (consumption.status === "already-consumed") {
    return reject(
      "PROOF_ALREADY_CONSUMED",
      "The signed owner resume proof has already been consumed.",
    );
  }

  if (consumption.status === "binding-conflict") {
    return reject(
      "PROOF_BINDING_CONFLICT",
      "The proof identifier conflicts with an existing tenant or incident binding.",
    );
  }

  if (consumption.status === "ledger-unavailable") {
    return reject(
      "CONSUMPTION_LEDGER_UNAVAILABLE",
      "The atomic consumption ledger is unavailable. Pilot resume remains blocked.",
    );
  }

  if (
    consumption.status !== "consumed" ||
    !isValidEpochSecond(consumption.consumedAt) ||
    consumption.consumedAt < proof.issuedAt ||
    consumption.consumedAt >= proof.expiresAt
  ) {
    return reject(
      "INVALID_CONSUMPTION_RESPONSE",
      "The atomic consumption result is incomplete, outside the proof lifetime or invalid.",
    );
  }

  return {
    authorized: true,
    code: "CONTROLLED_PILOT_RESUME_AUTHORIZED",
    proof,
    consumption: {
      tokenId: proof.tokenId,
      consumedAt: consumption.consumedAt,
    },
    automaticResumeAuthorized: false,
    pilotOperationPermitted: true,
    liveProviderExecutionAuthorized: false,
    publicLaunchAuthorized: false,
  };
}
