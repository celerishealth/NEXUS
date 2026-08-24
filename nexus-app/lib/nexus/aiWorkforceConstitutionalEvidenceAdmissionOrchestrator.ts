import {
  verifyConstitutionalEvidenceAdmission,
  type ConstitutionalEvidenceAdmissionVerificationContext,
  type ConstitutionalEvidenceAdmissionVerificationResult,
  type SignedConstitutionalEvidenceAdmissionRecord,
} from "./aiWorkforceConstitutionalEvidenceAdmission";
import {
  createConstitutionalEvidenceReplayIdentity,
  guardConstitutionalEvidenceReplay,
  type ConstitutionalEvidenceReplayGuardResult,
  type ConstitutionalEvidenceReplayStore,
} from "./aiWorkforceConstitutionalEvidenceReplayGuard";

export const AI_WORKFORCE_CONSTITUTIONAL_EVIDENCE_ADMISSION_ORCHESTRATOR_VERSION =
  "NEXUS_AI_WORKFORCE_CONSTITUTIONAL_EVIDENCE_ADMISSION_ORCHESTRATOR_V1" as const;

export interface ConstitutionalEvidenceAdmissionOrchestrationResult {
  readonly orchestrationState:
    | "ADMISSION_REJECTED"
    | "REPLAY_BLOCKED"
    | "REPLAY_RESERVED_NO_AUTHORITY";
  readonly admitted: false;
  readonly admissionVerification:
    ConstitutionalEvidenceAdmissionVerificationResult;
  readonly replayGuard:
    ConstitutionalEvidenceReplayGuardResult | null;
  readonly constitutionalExecutionAuthorityGranted: false;
  readonly providerExecutionAuthorized: false;
  readonly paymentExecutionAuthorized: false;
  readonly legalFilingAuthorized: false;
  readonly externalDeliveryAuthorized: false;
  readonly publicLaunchAuthorized: false;
}

export async function orchestrateConstitutionalEvidenceAdmission(
  record: unknown,
  verificationContext: ConstitutionalEvidenceAdmissionVerificationContext,
  replayStore: ConstitutionalEvidenceReplayStore | null | undefined,
): Promise<ConstitutionalEvidenceAdmissionOrchestrationResult> {
  const admissionVerification =
    verifyConstitutionalEvidenceAdmission(
      record,
      verificationContext,
    );

  if (
    admissionVerification.verificationState !==
    "VERIFIED_NO_REPLAY"
  ) {
    return Object.freeze({
      orchestrationState: "ADMISSION_REJECTED",
      admitted: false,
      admissionVerification,
      replayGuard: null,
      constitutionalExecutionAuthorityGranted: false,
      providerExecutionAuthorized: false,
      paymentExecutionAuthorized: false,
      legalFilingAuthorized: false,
      externalDeliveryAuthorized: false,
      publicLaunchAuthorized: false,
    });
  }

  const verifiedRecord =
    record as SignedConstitutionalEvidenceAdmissionRecord;

  const replayGuard =
    await guardConstitutionalEvidenceReplay(
      createConstitutionalEvidenceReplayIdentity({
        tenantId: verifiedRecord.tenantId,
        evidenceIssuerId: verifiedRecord.evidenceIssuerId,
        evidenceIssuerKeyId: verifiedRecord.evidenceIssuerKeyId,
        actionId: verifiedRecord.actionId,
        nonce: verifiedRecord.nonce,
      }),
      replayStore,
    );

  return Object.freeze({
    orchestrationState:
      replayGuard.replayState === "REPLAY_RESERVED_NO_AUTHORITY"
        ? "REPLAY_RESERVED_NO_AUTHORITY"
        : "REPLAY_BLOCKED",
    admitted: false,
    admissionVerification,
    replayGuard,
    constitutionalExecutionAuthorityGranted: false,
    providerExecutionAuthorized: false,
    paymentExecutionAuthorized: false,
    legalFilingAuthorized: false,
    externalDeliveryAuthorized: false,
    publicLaunchAuthorized: false,
  });
}