import { createHash } from "node:crypto";

import {
  REVENUE_GROWTH_WORKFORCE_OWNER_ID,
} from "./revenueGrowthWorkforceExpansionDecision";

import {
  validateRevenueGrowthWorkforceRosterExpansionPreparation,
  type RevenueGrowthWorkforceRosterExpansionPreparation,
} from "./revenueGrowthWorkforceRosterExpansionPreparation";

export const REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_DECISION_VERSION =
  "nexus-revenue-growth-workforce-roster-admission-decision-v1" as const;

export const REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_DECISIONS = [
  "APPROVE_REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION",
  "REJECT_AND_RETAIN_REVENUE_GROWTH_ROSTER_EXPANSION_PREPARATION",
] as const;

export type RevenueGrowthWorkforceRosterAdmissionDecisionType =
  typeof REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_DECISIONS[number];

export interface CreateRevenueGrowthWorkforceRosterAdmissionDecisionInput {
  readonly preparation:
    RevenueGrowthWorkforceRosterExpansionPreparation;
  readonly decisionId: string;
  readonly ownerId:
    typeof REVENUE_GROWTH_WORKFORCE_OWNER_ID;
  readonly decision:
    RevenueGrowthWorkforceRosterAdmissionDecisionType;
  readonly reason: string;
  readonly decidedAt: string;
}

export interface RevenueGrowthCandidateRosterAdmissionEligibility {
  readonly expansionSequence: number;
  readonly employeeId: string;
  readonly employeeCode: string;
  readonly publicName: string;
  readonly officialRole: string;
  readonly department:
    "SALES" | "MARKETING";
  readonly targetRosterStatus:
    "PLANNED_CANDIDATE";
  readonly rosterEntryPrepared: true;
  readonly rosterAdmissionAuthorized: boolean;
  readonly factoryAdmissionAuthorized: false;
  readonly templatePreparationAuthorized: false;
  readonly qualificationExecutionAuthorized:
    false;
  readonly ownerQualificationApprovalRecorded:
    false;
  readonly activationCandidatePreparationAuthorized:
    false;
  readonly ownerActivationAuthorized: false;
  readonly runtimeActivationAuthorized: false;
  readonly controlledWorkAuthorized: false;
}

export interface RevenueGrowthWorkforceRosterAdmissionDecision {
  readonly version:
    typeof REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_DECISION_VERSION;
  readonly decisionId: string;
  readonly decisionState:
    "OWNER_REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_DECISION_RECORDED";
  readonly ownerId:
    typeof REVENUE_GROWTH_WORKFORCE_OWNER_ID;
  readonly sourcePreparationId: string;
  readonly sourcePreparationDigest: string;
  readonly sourceExpansionDecisionId: string;
  readonly sourceExpansionDecisionDigest:
    string;
  readonly sourcePlanningId: string;
  readonly sourcePlanningDigest: string;
  readonly sourceRosterDigest: string;
  readonly candidateCount: 9;
  readonly decision:
    RevenueGrowthWorkforceRosterAdmissionDecisionType;
  readonly rosterAdmissionApproved: boolean;
  readonly reason: string;
  readonly reviewedPreparation: Readonly<{
    preparationState:
      "OWNER_CONTROLLED_REVENUE_GROWTH_ROSTER_EXPANSION_PREPARED";
    sourceRosterPreserved: true;
    ownerRosterAdmissionDecisionRequired:
      true;
    sourceOwnerRosterAdmissionDecisionRecorded:
      false;
    sourceNextStep:
      "AWAIT_OWNER_REVENUE_GROWTH_ROSTER_ADMISSION_DECISION";
  }>;
  readonly candidateRosterAdmissionEligibility:
    readonly RevenueGrowthCandidateRosterAdmissionEligibility[];
  readonly authorityBoundary: Readonly<{
    ownerDecisionRecorded: true;
    ownerIdentityBound: true;
    sourcePreparationBound: true;
    approvalBypassAllowed: false;
    rosterMutationAuthorized: boolean;
    rosterAdmissionAuthorized: boolean;
    postAdmissionRosterValidationRequired:
      boolean;
    factoryAdmissionAuthorized: false;
    templatePreparationAuthorized: false;
    qualificationExecutionAuthorized: false;
    ownerQualificationApprovalRecorded:
      false;
    activationCandidatePreparationAuthorized:
      false;
    ownerActivationAuthorized: false;
    runtimeActivationAuthorized: false;
    controlledWorkAuthorized: false;
    contentDraftingAuthorityGranted: false;
    videoGenerationExecutionAuthorized: false;
    liveSocialPostingAuthorized: false;
    paidAdvertisingSpendAuthorized: false;
    customerMessagingAuthorized: false;
    customerDataAccessAuthorized: false;
    externalDeliveryAuthorized: false;
    productionExecutionAuthorized: false;
    paymentExecutionAuthorized: false;
    financialCommitmentAuthorized: false;
    legalCommitmentAuthorized: false;
    autonomousExecutionAuthorized: false;
    publicLaunchAuthorized: false;
  }>;
  readonly nextStep:
    | "APPLY_OWNER_CONTROLLED_REVENUE_GROWTH_ROSTER_ADMISSION"
    | "RETAIN_REVENUE_GROWTH_ROSTER_EXPANSION_PREPARATION_ONLY";
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
        "Unsupported deterministic roster-admission decision value.",
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

function requireExactIsoTimestamp(
  label: string,
  value: string,
): void {
  const timestamp =
    Date.parse(value);

  if (
    !Number.isFinite(timestamp) ||
    new Date(timestamp)
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
      "Roster-admission decision reason must contain between 20 and 1000 trimmed characters.",
    );
  }
}

export function validateRevenueGrowthWorkforceRosterAdmissionDecision(
  record:
    RevenueGrowthWorkforceRosterAdmissionDecision,
): void {
  const {
    decisionDigest,
    ...unsignedRecord
  } = record;

  requireDigest(
    "Roster-admission decision digest",
    decisionDigest,
  );

  if (
    sha256(unsignedRecord) !==
    decisionDigest
  ) {
    throw new Error(
      "Roster-admission decision digest verification failed.",
    );
  }

  requireIdentifier(
    "Roster-admission decision ID",
    record.decisionId,
  );

  requireIdentifier(
    "Roster-admission source preparation ID",
    record.sourcePreparationId,
  );

  requireIdentifier(
    "Roster-admission source expansion decision ID",
    record.sourceExpansionDecisionId,
  );

  requireIdentifier(
    "Roster-admission source planning ID",
    record.sourcePlanningId,
  );

  requireDigest(
    "Roster-admission source preparation digest",
    record.sourcePreparationDigest,
  );

  requireDigest(
    "Roster-admission source expansion decision digest",
    record.sourceExpansionDecisionDigest,
  );

  requireDigest(
    "Roster-admission source planning digest",
    record.sourcePlanningDigest,
  );

  requireDigest(
    "Roster-admission source roster digest",
    record.sourceRosterDigest,
  );

  requireReason(
    record.reason,
  );

  requireExactIsoTimestamp(
    "Roster-admission decision time",
    record.decidedAt,
  );

  if (
    record.version !==
      REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_DECISION_RECORDED" ||
    record.ownerId !==
      REVENUE_GROWTH_WORKFORCE_OWNER_ID ||
    record.candidateCount !== 9 ||
    record.candidateRosterAdmissionEligibility.length !==
      9
  ) {
    throw new Error(
      "Roster-admission decision identity is invalid.",
    );
  }

  if (
    record.decision !==
      "APPROVE_REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION" &&
    record.decision !==
      "REJECT_AND_RETAIN_REVENUE_GROWTH_ROSTER_EXPANSION_PREPARATION"
  ) {
    throw new Error(
      "Roster-admission decision is unsupported.",
    );
  }

  const approved =
    record.decision ===
    "APPROVE_REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION";

  if (
    record.rosterAdmissionApproved !==
      approved
  ) {
    throw new Error(
      "Roster-admission approval outcome is inconsistent.",
    );
  }

  const reviewed =
    record.reviewedPreparation;

  if (
    reviewed.preparationState !==
      "OWNER_CONTROLLED_REVENUE_GROWTH_ROSTER_EXPANSION_PREPARED" ||
    reviewed.sourceRosterPreserved !==
      true ||
    reviewed.ownerRosterAdmissionDecisionRequired !==
      true ||
    reviewed.sourceOwnerRosterAdmissionDecisionRecorded !==
      false ||
    reviewed.sourceNextStep !==
      "AWAIT_OWNER_REVENUE_GROWTH_ROSTER_ADMISSION_DECISION"
  ) {
    throw new Error(
      "Reviewed roster-expansion preparation is invalid.",
    );
  }

  record.candidateRosterAdmissionEligibility.forEach(
    (candidate, index) => {
      if (
        candidate.expansionSequence !==
          index + 1 ||
        candidate.targetRosterStatus !==
          "PLANNED_CANDIDATE" ||
        candidate.rosterEntryPrepared !==
          true ||
        candidate.rosterAdmissionAuthorized !==
          approved ||
        candidate.factoryAdmissionAuthorized !==
          false ||
        candidate.templatePreparationAuthorized !==
          false ||
        candidate.qualificationExecutionAuthorized !==
          false ||
        candidate.ownerQualificationApprovalRecorded !==
          false ||
        candidate.activationCandidatePreparationAuthorized !==
          false ||
        candidate.ownerActivationAuthorized !==
          false ||
        candidate.runtimeActivationAuthorized !==
          false ||
        candidate.controlledWorkAuthorized !==
          false
      ) {
        throw new Error(
          "Revenue-growth candidate roster-admission eligibility is invalid.",
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
    boundary.sourcePreparationBound !==
      true ||
    boundary.approvalBypassAllowed !==
      false ||
    boundary.rosterMutationAuthorized !==
      approved ||
    boundary.rosterAdmissionAuthorized !==
      approved ||
    boundary.postAdmissionRosterValidationRequired !==
      approved ||
    boundary.factoryAdmissionAuthorized !==
      false ||
    boundary.templatePreparationAuthorized !==
      false ||
    boundary.qualificationExecutionAuthorized !==
      false ||
    boundary.ownerQualificationApprovalRecorded !==
      false ||
    boundary.activationCandidatePreparationAuthorized !==
      false ||
    boundary.ownerActivationAuthorized !==
      false ||
    boundary.runtimeActivationAuthorized !==
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
      "Roster-admission decision authority boundary is invalid.",
    );
  }

  const expectedNextStep =
    approved
      ? "APPLY_OWNER_CONTROLLED_REVENUE_GROWTH_ROSTER_ADMISSION"
      : "RETAIN_REVENUE_GROWTH_ROSTER_EXPANSION_PREPARATION_ONLY";

  if (
    record.nextStep !==
    expectedNextStep
  ) {
    throw new Error(
      "Roster-admission decision next step is invalid.",
    );
  }
}

export function createRevenueGrowthWorkforceRosterAdmissionDecision(
  input:
    CreateRevenueGrowthWorkforceRosterAdmissionDecisionInput,
): RevenueGrowthWorkforceRosterAdmissionDecision {
  const source =
    input.preparation;

  validateRevenueGrowthWorkforceRosterExpansionPreparation(
    source,
  );

  requireIdentifier(
    "Roster-admission decision ID",
    input.decisionId,
  );

  requireReason(
    input.reason,
  );

  requireExactIsoTimestamp(
    "Roster-admission decision time",
    input.decidedAt,
  );

  if (
    input.ownerId !==
    REVENUE_GROWTH_WORKFORCE_OWNER_ID
  ) {
    throw new Error(
      "Only the verified NEXUS owner can issue the revenue-growth roster-admission decision.",
    );
  }

  if (
    input.decision !==
      "APPROVE_REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION" &&
    input.decision !==
      "REJECT_AND_RETAIN_REVENUE_GROWTH_ROSTER_EXPANSION_PREPARATION"
  ) {
    throw new Error(
      "Unsupported revenue-growth roster-admission decision.",
    );
  }

  if (
    source.ownerRosterAdmissionDecisionRequired !==
      true ||
    source.ownerRosterAdmissionDecisionRecorded !==
      false ||
    source.nextStep !==
      "AWAIT_OWNER_REVENUE_GROWTH_ROSTER_ADMISSION_DECISION"
  ) {
    throw new Error(
      "Revenue-growth roster-expansion preparation is not awaiting an owner admission decision.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
    Date.parse(source.preparedAt)
  ) {
    throw new Error(
      "Roster-admission decision cannot precede roster-expansion preparation.",
    );
  }

  const approved =
    input.decision ===
    "APPROVE_REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION";

  const decisionCore = {
    version:
      REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_DECISION_VERSION,
    decisionId:
      input.decisionId,
    decisionState:
      "OWNER_REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_DECISION_RECORDED" as const,
    ownerId:
      input.ownerId,
    sourcePreparationId:
      source.preparationId,
    sourcePreparationDigest:
      source.preparationDigest,
    sourceExpansionDecisionId:
      source.sourceDecisionId,
    sourceExpansionDecisionDigest:
      source.sourceDecisionDigest,
    sourcePlanningId:
      source.sourcePlanningId,
    sourcePlanningDigest:
      source.sourcePlanningDigest,
    sourceRosterDigest:
      source.sourceRosterDigest,
    candidateCount:
      9 as const,
    decision:
      input.decision,
    rosterAdmissionApproved:
      approved,
    reason:
      input.reason,
    reviewedPreparation: {
      preparationState:
        source.preparationState,
      sourceRosterPreserved:
        source.sourceRosterPreserved,
      ownerRosterAdmissionDecisionRequired:
        source.ownerRosterAdmissionDecisionRequired,
      sourceOwnerRosterAdmissionDecisionRecorded:
        source.ownerRosterAdmissionDecisionRecorded,
      sourceNextStep:
        source.nextStep,
    },
    candidateRosterAdmissionEligibility:
      source.preparedCandidates.map(
        (candidate) => ({
          expansionSequence:
            candidate.expansionSequence,
          employeeId:
            candidate.employeeId,
          employeeCode:
            candidate.employeeCode,
          publicName:
            candidate.publicName,
          officialRole:
            candidate.officialRole,
          department:
            candidate.department,
          targetRosterStatus:
            candidate.targetRosterStatus,
          rosterEntryPrepared:
            candidate.rosterEntryPrepared,
          rosterAdmissionAuthorized:
            approved,
          factoryAdmissionAuthorized:
            false as const,
          templatePreparationAuthorized:
            false as const,
          qualificationExecutionAuthorized:
            false as const,
          ownerQualificationApprovalRecorded:
            false as const,
          activationCandidatePreparationAuthorized:
            false as const,
          ownerActivationAuthorized:
            false as const,
          runtimeActivationAuthorized:
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
      sourcePreparationBound:
        true as const,
      approvalBypassAllowed:
        false as const,
      rosterMutationAuthorized:
        approved,
      rosterAdmissionAuthorized:
        approved,
      postAdmissionRosterValidationRequired:
        approved,
      factoryAdmissionAuthorized:
        false as const,
      templatePreparationAuthorized:
        false as const,
      qualificationExecutionAuthorized:
        false as const,
      ownerQualificationApprovalRecorded:
        false as const,
      activationCandidatePreparationAuthorized:
        false as const,
      ownerActivationAuthorized:
        false as const,
      runtimeActivationAuthorized:
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
        ? "APPLY_OWNER_CONTROLLED_REVENUE_GROWTH_ROSTER_ADMISSION" as const
        : "RETAIN_REVENUE_GROWTH_ROSTER_EXPANSION_PREPARATION_ONLY" as const,
    decidedAt:
      input.decidedAt,
  };

  const decision =
    deepFreeze({
      ...decisionCore,
      decisionDigest:
        sha256(decisionCore),
    }) as RevenueGrowthWorkforceRosterAdmissionDecision;

  validateRevenueGrowthWorkforceRosterAdmissionDecision(
    decision,
  );

  return decision;
}
