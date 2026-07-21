import { createHash } from "node:crypto";

import {
  REVENUE_GROWTH_WORKFORCE_OWNER_ID,
} from "./revenueGrowthWorkforceExpansionDecision";

import {
  validateRevenueGrowthWorkforceRosterAdmissionExecution,
  type RevenueGrowthWorkforceRosterAdmissionExecution,
} from "./revenueGrowthWorkforceRosterAdmissionExecution";

export const REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_DECISION_VERSION =
  "nexus-revenue-growth-workforce-factory-admission-decision-v1" as const;

export const REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_DECISIONS = [
  "APPROVE_REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION",
  "REJECT_AND_RETAIN_REVENUE_GROWTH_ROSTER_ADMISSION_ONLY",
] as const;

export type RevenueGrowthWorkforceFactoryAdmissionDecisionType =
  typeof REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_DECISIONS[number];

export interface CreateRevenueGrowthWorkforceFactoryAdmissionDecisionInput {
  readonly rosterAdmissionExecution:
    RevenueGrowthWorkforceRosterAdmissionExecution;
  readonly decisionId: string;
  readonly ownerId:
    typeof REVENUE_GROWTH_WORKFORCE_OWNER_ID;
  readonly decision:
    RevenueGrowthWorkforceFactoryAdmissionDecisionType;
  readonly reason: string;
  readonly decidedAt: string;
}

export interface RevenueGrowthCandidateFactoryAdmissionEligibility {
  readonly employeeId: string;
  readonly employeeCode: string;
  readonly publicName: string;
  readonly officialRole: string;
  readonly department:
    "SALES" | "MARKETING";
  readonly sourceRosterStatus:
    "PLANNED_CANDIDATE";
  readonly targetFactoryLifecycleState:
    "PLANNED_CANDIDATE";
  readonly factoryAdmissionAuthorized:
    boolean;
  readonly templatePreparationAuthorized:
    false;
  readonly qualificationAdmissionAuthorized:
    false;
  readonly qualificationExecutionAuthorized:
    false;
  readonly qualificationEvidenceAccepted:
    false;
  readonly ownerQualificationApproved:
    false;
  readonly activationCandidatePrepared:
    false;
  readonly ownerActivationApproved:
    false;
  readonly runtimeAuthorized: false;
  readonly controlledWorkAuthorized: false;
}

export interface RevenueGrowthWorkforceFactoryAdmissionDecision {
  readonly version:
    typeof REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_DECISION_VERSION;
  readonly decisionId: string;
  readonly decisionState:
    "OWNER_REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_DECISION_RECORDED";
  readonly ownerId:
    typeof REVENUE_GROWTH_WORKFORCE_OWNER_ID;
  readonly sourceExecutionId: string;
  readonly sourceExecutionDigest: string;
  readonly sourceRosterDigest: string;
  readonly admittedRosterCandidateCount:
    9;
  readonly decision:
    RevenueGrowthWorkforceFactoryAdmissionDecisionType;
  readonly factoryAdmissionApproved:
    boolean;
  readonly reason: string;
  readonly reviewedExecution: Readonly<{
    executionState:
      "OWNER_CONTROLLED_REVENUE_GROWTH_ROSTER_ADMISSION_EXECUTED";
    sourceRosterPreserved: true;
    sourceNextStep:
      "AWAIT_OWNER_REVENUE_GROWTH_FACTORY_ADMISSION_DECISION";
    humanLikeEmployeeStandardBound:
      true;
    humanImpersonationAuthorized:
      false;
  }>;
  readonly candidateFactoryAdmissionEligibility:
    readonly RevenueGrowthCandidateFactoryAdmissionEligibility[];
  readonly authorityBoundary: Readonly<{
    ownerDecisionRecorded: true;
    ownerIdentityBound: true;
    sourceExecutionBound: true;
    approvalBypassAllowed: false;
    factoryAdmissionAuthorized:
      boolean;
    factoryRecordCreationAuthorized:
      boolean;
    initialLifecycleStateLocked:
      true;
    directTemplateBypassBlocked: true;
    directQualificationBypassBlocked:
      true;
    incompleteQualificationBlocked:
      true;
    directActivationBypassBlocked:
      true;
    selfActivationBlocked: true;
    templatePreparationAuthorized:
      false;
    qualificationAdmissionAuthorized:
      false;
    qualificationExecutionAuthorized:
      false;
    qualificationEvidenceAccepted:
      false;
    ownerQualificationApproved:
      false;
    activationCandidatePrepared:
      false;
    ownerActivationApproved: false;
    runtimeAuthorized: false;
    controlledWorkAuthorized: false;
    contentDraftingAuthorityGranted:
      false;
    videoGenerationExecutionAuthorized:
      false;
    liveSocialPostingAuthorized:
      false;
    paidAdvertisingSpendAuthorized:
      false;
    customerMessagingAuthorized: false;
    customerDataAccessAuthorized: false;
    externalDeliveryAuthorized: false;
    productionExecutionAuthorized:
      false;
    paymentExecutionAuthorized: false;
    financialCommitmentAuthorized:
      false;
    legalCommitmentAuthorized: false;
    autonomousExecutionAuthorized:
      false;
    publicLaunchAuthorized: false;
  }>;
  readonly nextStep:
    | "APPLY_OWNER_CONTROLLED_REVENUE_GROWTH_FACTORY_ADMISSION"
    | "RETAIN_REVENUE_GROWTH_ROSTER_ADMISSION_ONLY";
  readonly decidedAt: string;
  readonly decisionDigest: string;
}

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9._:-]{2,127}$/;

function canonicalize(
  value: unknown,
): string {
  if (
    value === null ||
    typeof value !== "object"
  ) {
    const primitive =
      JSON.stringify(value);

    if (primitive === undefined) {
      throw new Error(
        "Unsupported deterministic factory-admission decision value.",
      );
    }

    return primitive;
  }

  if (Array.isArray(value)) {
    return (
      "[" +
      value
        .map(canonicalize)
        .join(",") +
      "]"
    );
  }

  const record =
    value as Record<string, unknown>;

  return (
    "{" +
    Object.keys(record)
      .sort()
      .map(
        (key) =>
          JSON.stringify(key) +
          ":" +
          canonicalize(record[key]),
      )
      .join(",") +
    "}"
  );
}

function sha256(
  value: unknown,
): string {
  return createHash("sha256")
    .update(
      canonicalize(value),
      "utf8",
    )
    .digest("hex");
}

function deepFreeze<T>(
  value: T,
): Readonly<T> {
  if (
    value !== null &&
    typeof value === "object" &&
    !Object.isFrozen(value)
  ) {
    Object.freeze(value);

    for (
      const child of
      Object.values(
        value as Record<string, unknown>,
      )
    ) {
      if (
        child !== null &&
        typeof child === "object"
      ) {
        deepFreeze(child);
      }
    }
  }

  return value as Readonly<T>;
}

function requireIdentifier(
  label: string,
  value: string,
): void {
  if (
    value !== value.trim() ||
    !SAFE_IDENTIFIER_PATTERN.test(value)
  ) {
    throw new Error(
      `${label} must be a canonical safe identifier.`,
    );
  }
}

function requireDigest(
  label: string,
  value: string,
): void {
  if (
    !/^[0-9a-f]{64}$/.test(value)
  ) {
    throw new Error(
      `${label} must be a SHA-256 digest.`,
    );
  }
}

function requireTimestamp(
  label: string,
  value: string,
): void {
  const parsed =
    Date.parse(value);

  if (
    !Number.isFinite(parsed) ||
    new Date(parsed)
      .toISOString() !== value
  ) {
    throw new Error(
      `${label} must be an exact ISO timestamp.`,
    );
  }
}

function requireReason(
  value: string,
): void {
  if (
    value !== value.trim() ||
    value.length < 20 ||
    value.length > 1000
  ) {
    throw new Error(
      "Factory-admission decision reason must contain between 20 and 1000 trimmed characters.",
    );
  }
}

export function validateRevenueGrowthWorkforceFactoryAdmissionDecision(
  record:
    RevenueGrowthWorkforceFactoryAdmissionDecision,
): void {
  const {
    decisionDigest,
    ...unsignedRecord
  } = record;

  requireDigest(
    "Factory-admission decision digest",
    decisionDigest,
  );

  if (
    sha256(unsignedRecord) !==
    decisionDigest
  ) {
    throw new Error(
      "Factory-admission decision digest verification failed.",
    );
  }

  requireIdentifier(
    "Factory-admission decision ID",
    record.decisionId,
  );

  requireIdentifier(
    "Factory-admission source execution ID",
    record.sourceExecutionId,
  );

  requireDigest(
    "Factory-admission source execution digest",
    record.sourceExecutionDigest,
  );

  requireDigest(
    "Factory-admission source roster digest",
    record.sourceRosterDigest,
  );

  requireReason(
    record.reason,
  );

  requireTimestamp(
    "Factory-admission decision time",
    record.decidedAt,
  );

  if (
    record.version !==
      REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_DECISION_RECORDED" ||
    record.ownerId !==
      REVENUE_GROWTH_WORKFORCE_OWNER_ID ||
    record.admittedRosterCandidateCount !==
      9 ||
    record.candidateFactoryAdmissionEligibility.length !==
      9
  ) {
    throw new Error(
      "Factory-admission decision identity is invalid.",
    );
  }

  if (
    record.decision !==
      "APPROVE_REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION" &&
    record.decision !==
      "REJECT_AND_RETAIN_REVENUE_GROWTH_ROSTER_ADMISSION_ONLY"
  ) {
    throw new Error(
      "Factory-admission decision is unsupported.",
    );
  }

  const approved =
    record.decision ===
    "APPROVE_REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION";

  if (
    record.factoryAdmissionApproved !==
      approved
  ) {
    throw new Error(
      "Factory-admission approval outcome is inconsistent.",
    );
  }

  const reviewed =
    record.reviewedExecution;

  if (
    reviewed.executionState !==
      "OWNER_CONTROLLED_REVENUE_GROWTH_ROSTER_ADMISSION_EXECUTED" ||
    reviewed.sourceRosterPreserved !==
      true ||
    reviewed.sourceNextStep !==
      "AWAIT_OWNER_REVENUE_GROWTH_FACTORY_ADMISSION_DECISION" ||
    reviewed.humanLikeEmployeeStandardBound !==
      true ||
    reviewed.humanImpersonationAuthorized !==
      false
  ) {
    throw new Error(
      "Reviewed roster-admission execution is invalid.",
    );
  }

  record.candidateFactoryAdmissionEligibility.forEach(
    (candidate) => {
      if (
        candidate.sourceRosterStatus !==
          "PLANNED_CANDIDATE" ||
        candidate.targetFactoryLifecycleState !==
          "PLANNED_CANDIDATE" ||
        candidate.factoryAdmissionAuthorized !==
          approved ||
        candidate.templatePreparationAuthorized !==
          false ||
        candidate.qualificationAdmissionAuthorized !==
          false ||
        candidate.qualificationExecutionAuthorized !==
          false ||
        candidate.qualificationEvidenceAccepted !==
          false ||
        candidate.ownerQualificationApproved !==
          false ||
        candidate.activationCandidatePrepared !==
          false ||
        candidate.ownerActivationApproved !==
          false ||
        candidate.runtimeAuthorized !==
          false ||
        candidate.controlledWorkAuthorized !==
          false
      ) {
        throw new Error(
          "Revenue-growth candidate factory-admission eligibility is invalid.",
        );
      }
    },
  );

  const boundary =
    record.authorityBoundary;

  if (
    boundary.ownerDecisionRecorded !==
      true ||
    boundary.ownerIdentityBound !==
      true ||
    boundary.sourceExecutionBound !==
      true ||
    boundary.approvalBypassAllowed !==
      false ||
    boundary.factoryAdmissionAuthorized !==
      approved ||
    boundary.factoryRecordCreationAuthorized !==
      approved ||
    boundary.initialLifecycleStateLocked !==
      true ||
    boundary.directTemplateBypassBlocked !==
      true ||
    boundary.directQualificationBypassBlocked !==
      true ||
    boundary.incompleteQualificationBlocked !==
      true ||
    boundary.directActivationBypassBlocked !==
      true ||
    boundary.selfActivationBlocked !==
      true ||
    boundary.templatePreparationAuthorized !==
      false ||
    boundary.qualificationAdmissionAuthorized !==
      false ||
    boundary.qualificationExecutionAuthorized !==
      false ||
    boundary.qualificationEvidenceAccepted !==
      false ||
    boundary.ownerQualificationApproved !==
      false ||
    boundary.activationCandidatePrepared !==
      false ||
    boundary.ownerActivationApproved !==
      false ||
    boundary.runtimeAuthorized !==
      false ||
    boundary.controlledWorkAuthorized !==
      false ||
    boundary.contentDraftingAuthorityGranted !==
      false ||
    boundary.videoGenerationExecutionAuthorized !==
      false ||
    boundary.liveSocialPostingAuthorized !==
      false ||
    boundary.paidAdvertisingSpendAuthorized !==
      false ||
    boundary.customerMessagingAuthorized !==
      false ||
    boundary.customerDataAccessAuthorized !==
      false ||
    boundary.externalDeliveryAuthorized !==
      false ||
    boundary.productionExecutionAuthorized !==
      false ||
    boundary.paymentExecutionAuthorized !==
      false ||
    boundary.financialCommitmentAuthorized !==
      false ||
    boundary.legalCommitmentAuthorized !==
      false ||
    boundary.autonomousExecutionAuthorized !==
      false ||
    boundary.publicLaunchAuthorized !==
      false
  ) {
    throw new Error(
      "Factory-admission decision authority boundary is invalid.",
    );
  }

  const expectedNextStep =
    approved
      ? "APPLY_OWNER_CONTROLLED_REVENUE_GROWTH_FACTORY_ADMISSION"
      : "RETAIN_REVENUE_GROWTH_ROSTER_ADMISSION_ONLY";

  if (
    record.nextStep !==
      expectedNextStep
  ) {
    throw new Error(
      "Factory-admission decision next step is invalid.",
    );
  }
}

export function createRevenueGrowthWorkforceFactoryAdmissionDecision(
  input:
    CreateRevenueGrowthWorkforceFactoryAdmissionDecisionInput,
): RevenueGrowthWorkforceFactoryAdmissionDecision {
  const source =
    input.rosterAdmissionExecution;

  validateRevenueGrowthWorkforceRosterAdmissionExecution(
    source,
  );

  requireIdentifier(
    "Factory-admission decision ID",
    input.decisionId,
  );

  requireReason(
    input.reason,
  );

  requireTimestamp(
    "Factory-admission decision time",
    input.decidedAt,
  );

  if (
    input.ownerId !==
    REVENUE_GROWTH_WORKFORCE_OWNER_ID
  ) {
    throw new Error(
      "Only the verified NEXUS owner can issue the revenue-growth factory-admission decision.",
    );
  }

  if (
    source.nextStep !==
      "AWAIT_OWNER_REVENUE_GROWTH_FACTORY_ADMISSION_DECISION" ||
    source.admittedCandidateCount !==
      9 ||
    source.authorityBoundary
      .factoryAdmissionAuthorized !==
      false
  ) {
    throw new Error(
      "Revenue-growth roster-admission execution is not awaiting an owner factory-admission decision.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
    Date.parse(source.executedAt)
  ) {
    throw new Error(
      "Factory-admission decision cannot precede roster admission.",
    );
  }

  const approved =
    input.decision ===
    "APPROVE_REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION";

  const admittedEntries =
    source.entries.slice(
      source.sourceEmployeeCount,
    );

  const decisionCore = {
    version:
      REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_DECISION_VERSION,
    decisionId:
      input.decisionId,
    decisionState:
      "OWNER_REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_DECISION_RECORDED" as const,
    ownerId:
      input.ownerId,
    sourceExecutionId:
      source.executionId,
    sourceExecutionDigest:
      source.executionDigest,
    sourceRosterDigest:
      source.sourceRosterDigest,
    admittedRosterCandidateCount:
      9 as const,
    decision:
      input.decision,
    factoryAdmissionApproved:
      approved,
    reason:
      input.reason,
    reviewedExecution: {
      executionState:
        source.executionState,
      sourceRosterPreserved:
        source.sourceRosterPreserved,
      sourceNextStep:
        source.nextStep,
      humanLikeEmployeeStandardBound:
        true as const,
      humanImpersonationAuthorized:
        source.humanLikeEmployeeStandard
          .humanImpersonationAuthorized,
    },
    candidateFactoryAdmissionEligibility:
      admittedEntries.map(
        (entry) => ({
          employeeId:
            entry.employeeId,
          employeeCode:
            entry.employeeCode,
          publicName:
            entry.publicName,
          officialRole:
            entry.officialRole,
          department:
            entry.department as
              | "SALES"
              | "MARKETING",
          sourceRosterStatus:
            "PLANNED_CANDIDATE" as const,
          targetFactoryLifecycleState:
            "PLANNED_CANDIDATE" as const,
          factoryAdmissionAuthorized:
            approved,
          templatePreparationAuthorized:
            false as const,
          qualificationAdmissionAuthorized:
            false as const,
          qualificationExecutionAuthorized:
            false as const,
          qualificationEvidenceAccepted:
            false as const,
          ownerQualificationApproved:
            false as const,
          activationCandidatePrepared:
            false as const,
          ownerActivationApproved:
            false as const,
          runtimeAuthorized:
            false as const,
          controlledWorkAuthorized:
            false as const,
        }),
      ),
    authorityBoundary: {
      ownerDecisionRecorded:
        true as const,
      ownerIdentityBound:
        true as const,
      sourceExecutionBound:
        true as const,
      approvalBypassAllowed:
        false as const,
      factoryAdmissionAuthorized:
        approved,
      factoryRecordCreationAuthorized:
        approved,
      initialLifecycleStateLocked:
        true as const,
      directTemplateBypassBlocked:
        true as const,
      directQualificationBypassBlocked:
        true as const,
      incompleteQualificationBlocked:
        true as const,
      directActivationBypassBlocked:
        true as const,
      selfActivationBlocked:
        true as const,
      templatePreparationAuthorized:
        false as const,
      qualificationAdmissionAuthorized:
        false as const,
      qualificationExecutionAuthorized:
        false as const,
      qualificationEvidenceAccepted:
        false as const,
      ownerQualificationApproved:
        false as const,
      activationCandidatePrepared:
        false as const,
      ownerActivationApproved:
        false as const,
      runtimeAuthorized:
        false as const,
      controlledWorkAuthorized:
        false as const,
      contentDraftingAuthorityGranted:
        false as const,
      videoGenerationExecutionAuthorized:
        false as const,
      liveSocialPostingAuthorized:
        false as const,
      paidAdvertisingSpendAuthorized:
        false as const,
      customerMessagingAuthorized:
        false as const,
      customerDataAccessAuthorized:
        false as const,
      externalDeliveryAuthorized:
        false as const,
      productionExecutionAuthorized:
        false as const,
      paymentExecutionAuthorized:
        false as const,
      financialCommitmentAuthorized:
        false as const,
      legalCommitmentAuthorized:
        false as const,
      autonomousExecutionAuthorized:
        false as const,
      publicLaunchAuthorized:
        false as const,
    },
    nextStep:
      approved
        ? "APPLY_OWNER_CONTROLLED_REVENUE_GROWTH_FACTORY_ADMISSION" as const
        : "RETAIN_REVENUE_GROWTH_ROSTER_ADMISSION_ONLY" as const,
    decidedAt:
      input.decidedAt,
  };

  const decision =
    deepFreeze({
      ...decisionCore,
      decisionDigest:
        sha256(decisionCore),
    }) as RevenueGrowthWorkforceFactoryAdmissionDecision;

  validateRevenueGrowthWorkforceFactoryAdmissionDecision(
    decision,
  );

  return decision;
}
