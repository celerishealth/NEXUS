import { createHash } from "node:crypto";

import {
  PROPOSED_REVENUE_GROWTH_SPECIALISTS,
  validateRevenueGrowthWorkforceExpansionPlan,
  type RevenueGrowthWorkforceExpansionPlan,
} from "./revenueGrowthWorkforceExpansionPlan";

export const REVENUE_GROWTH_WORKFORCE_EXPANSION_DECISION_VERSION =
  "nexus-revenue-growth-workforce-expansion-decision-v1" as const;

export const REVENUE_GROWTH_WORKFORCE_OWNER_ID =
  "owner-prashant-001" as const;

export const REVENUE_GROWTH_WORKFORCE_EXPANSION_DECISIONS = [
  "APPROVE_REVENUE_GROWTH_WORKFORCE_EXPANSION_PLAN",
  "REJECT_AND_RETAIN_REVENUE_GROWTH_WORKFORCE_EXPANSION_PLANNING",
] as const;

export type RevenueGrowthWorkforceExpansionDecisionType =
  (
    typeof REVENUE_GROWTH_WORKFORCE_EXPANSION_DECISIONS
  )[number];

export interface CreateRevenueGrowthWorkforceExpansionDecisionInput {
  readonly expansionPlan:
    RevenueGrowthWorkforceExpansionPlan;
  readonly decisionId: string;
  readonly ownerId:
    typeof REVENUE_GROWTH_WORKFORCE_OWNER_ID;
  readonly decision:
    RevenueGrowthWorkforceExpansionDecisionType;
  readonly reason: string;
  readonly decidedAt: string;
}

export interface RevenueGrowthCandidateExpansionEligibility {
  readonly expansionSequence: number;
  readonly employeeId: string;
  readonly employeeCode: string;
  readonly rosterExpansionPreparationEligible:
    boolean;
  readonly rosterAdmissionAuthorized: false;
  readonly factoryAdmissionAuthorized: false;
  readonly templatePreparationAuthorized: false;
  readonly qualificationExecutionAuthorized: false;
  readonly ownerQualificationApprovalRecorded:
    false;
  readonly activationCandidatePreparationAuthorized:
    false;
  readonly ownerActivationAuthorized: false;
  readonly runtimeActivationAuthorized: false;
  readonly controlledWorkAuthorized: false;
}

export interface RevenueGrowthWorkforceExpansionDecision {
  readonly version:
    typeof REVENUE_GROWTH_WORKFORCE_EXPANSION_DECISION_VERSION;
  readonly decisionId: string;
  readonly decisionState:
    "OWNER_REVENUE_GROWTH_WORKFORCE_EXPANSION_DECISION_RECORDED";
  readonly ownerId:
    typeof REVENUE_GROWTH_WORKFORCE_OWNER_ID;
  readonly sourcePlanningId: string;
  readonly sourcePlanningDigest: string;
  readonly sourceRosterDigest: string;
  readonly decision:
    RevenueGrowthWorkforceExpansionDecisionType;
  readonly expansionPlanApproved: boolean;
  readonly rosterExpansionPreparationEligible:
    boolean;
  readonly reason: string;
  readonly reviewedPlan: Readonly<{
    planningState:
      "REVENUE_GROWTH_WORKFORCE_EXPANSION_PLANNING_RECORDED";
    existingRevenueEmployeeCount: 8;
    proposedCandidateCount: 9;
    proposedEmployeeCodes:
      readonly string[];
    expansionSequence:
      readonly number[];
    sourceOwnerExpansionDecisionRequired:
      true;
    sourceOwnerExpansionDecisionRecorded:
      false;
    sourceNextStep:
      "AWAIT_OWNER_REVENUE_GROWTH_ROSTER_EXPANSION_DECISION";
  }>;
  readonly candidateExpansionEligibility:
    readonly RevenueGrowthCandidateExpansionEligibility[];
  readonly authorityBoundary: Readonly<{
    ownerDecisionRecorded: true;
    ownerIdentityBound: true;
    sourcePlanningBound: true;
    approvalBypassAllowed: false;
    rosterExpansionPreparationEligible:
      boolean;
    rosterMutationAuthorized: false;
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
    | "PREPARE_OWNER_CONTROLLED_REVENUE_GROWTH_ROSTER_EXPANSION"
    | "RETAIN_REVENUE_GROWTH_WORKFORCE_EXPANSION_PLANNING_ONLY";
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
        "Unsupported deterministic revenue-growth owner-decision value.",
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

function requireReason(
  reason: string,
): void {
  const normalized =
    reason.trim();

  if (
    normalized.length < 12 ||
    normalized.length > 1000
  ) {
    throw new Error(
      "Revenue-growth owner decision reason length is invalid.",
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

export function validateRevenueGrowthWorkforceExpansionDecision(
  record:
    RevenueGrowthWorkforceExpansionDecision,
): void {
  const {
    decisionDigest,
    ...unsignedRecord
  } = record;

  requireDigest(
    "Revenue-growth decision digest",
    decisionDigest,
  );

  if (
    sha256(unsignedRecord) !==
    decisionDigest
  ) {
    throw new Error(
      "Revenue-growth owner decision digest verification failed.",
    );
  }

  requireIdentifier(
    "Revenue-growth decision ID",
    record.decisionId,
  );

  requireIdentifier(
    "Revenue-growth source planning ID",
    record.sourcePlanningId,
  );

  requireDigest(
    "Revenue-growth source planning digest",
    record.sourcePlanningDigest,
  );

  requireDigest(
    "Revenue-growth source roster digest",
    record.sourceRosterDigest,
  );

  requireReason(
    record.reason,
  );

  requireExactIsoTimestamp(
    "Revenue-growth decision time",
    record.decidedAt,
  );

  if (
    record.version !==
      REVENUE_GROWTH_WORKFORCE_EXPANSION_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_REVENUE_GROWTH_WORKFORCE_EXPANSION_DECISION_RECORDED" ||
    record.ownerId !==
      REVENUE_GROWTH_WORKFORCE_OWNER_ID
  ) {
    throw new Error(
      "Revenue-growth owner decision identity is invalid.",
    );
  }

  if (
    record.decision !==
      "APPROVE_REVENUE_GROWTH_WORKFORCE_EXPANSION_PLAN" &&
    record.decision !==
      "REJECT_AND_RETAIN_REVENUE_GROWTH_WORKFORCE_EXPANSION_PLANNING"
  ) {
    throw new Error(
      "Revenue-growth owner decision is invalid.",
    );
  }

  const approved =
    record.decision ===
      "APPROVE_REVENUE_GROWTH_WORKFORCE_EXPANSION_PLAN";

  if (
    record.expansionPlanApproved !==
      approved ||
    record.rosterExpansionPreparationEligible !==
      approved
  ) {
    throw new Error(
      "Revenue-growth owner decision approval state is invalid.",
    );
  }

  const reviewedPlan =
    record.reviewedPlan;

  if (
    reviewedPlan.planningState !==
      "REVENUE_GROWTH_WORKFORCE_EXPANSION_PLANNING_RECORDED" ||
    reviewedPlan.existingRevenueEmployeeCount !==
      8 ||
    reviewedPlan.proposedCandidateCount !==
      9 ||
    reviewedPlan.proposedEmployeeCodes.length !==
      9 ||
    reviewedPlan.expansionSequence.length !==
      9 ||
    reviewedPlan.sourceOwnerExpansionDecisionRequired !==
      true ||
    reviewedPlan.sourceOwnerExpansionDecisionRecorded !==
      false ||
    reviewedPlan.sourceNextStep !==
      "AWAIT_OWNER_REVENUE_GROWTH_ROSTER_EXPANSION_DECISION" ||
    record.candidateExpansionEligibility.length !==
      9
  ) {
    throw new Error(
      "Revenue-growth reviewed expansion plan is invalid.",
    );
  }

  record.candidateExpansionEligibility.forEach(
    (candidate, index) => {
      const expected =
        PROPOSED_REVENUE_GROWTH_SPECIALISTS[
          index
        ];

      if (
        candidate.expansionSequence !==
          index + 1 ||
        reviewedPlan.expansionSequence[index] !==
          index + 1 ||
        candidate.employeeId !==
          expected.employeeId ||
        candidate.employeeCode !==
          expected.employeeCode ||
        reviewedPlan.proposedEmployeeCodes[index] !==
          expected.employeeCode ||
        candidate.rosterExpansionPreparationEligible !==
          approved ||
        candidate.rosterAdmissionAuthorized !==
          false ||
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
          "Revenue-growth candidate expansion eligibility is invalid.",
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
    boundary.sourcePlanningBound !==
      true ||
    boundary.approvalBypassAllowed !==
      false ||
    boundary.rosterExpansionPreparationEligible !==
      approved ||
    boundary.rosterMutationAuthorized !==
      false ||
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
      "Revenue-growth owner decision authority boundary is invalid.",
    );
  }

  const expectedNextStep =
    approved
      ? "PREPARE_OWNER_CONTROLLED_REVENUE_GROWTH_ROSTER_EXPANSION"
      : "RETAIN_REVENUE_GROWTH_WORKFORCE_EXPANSION_PLANNING_ONLY";

  if (
    record.nextStep !==
    expectedNextStep
  ) {
    throw new Error(
      "Revenue-growth owner decision next step is invalid.",
    );
  }
}

export function createRevenueGrowthWorkforceExpansionDecision(
  input:
    CreateRevenueGrowthWorkforceExpansionDecisionInput,
): RevenueGrowthWorkforceExpansionDecision {
  const source =
    input.expansionPlan;

  validateRevenueGrowthWorkforceExpansionPlan(
    source,
  );

  requireIdentifier(
    "Revenue-growth decision ID",
    input.decisionId,
  );

  requireIdentifier(
    "Revenue-growth owner ID",
    input.ownerId,
  );

  requireReason(
    input.reason,
  );

  requireExactIsoTimestamp(
    "Revenue-growth decision time",
    input.decidedAt,
  );

  if (
    input.ownerId !==
      REVENUE_GROWTH_WORKFORCE_OWNER_ID
  ) {
    throw new Error(
      "Only the verified NEXUS owner can issue the revenue-growth expansion decision.",
    );
  }

  if (
    input.decision !==
      "APPROVE_REVENUE_GROWTH_WORKFORCE_EXPANSION_PLAN" &&
    input.decision !==
      "REJECT_AND_RETAIN_REVENUE_GROWTH_WORKFORCE_EXPANSION_PLANNING"
  ) {
    throw new Error(
      "Revenue-growth owner decision is invalid.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
    Date.parse(source.preparedAt)
  ) {
    throw new Error(
      "Revenue-growth owner decision cannot precede expansion planning.",
    );
  }

  const approved =
    input.decision ===
      "APPROVE_REVENUE_GROWTH_WORKFORCE_EXPANSION_PLAN";

  const decisionCore = {
    version:
      REVENUE_GROWTH_WORKFORCE_EXPANSION_DECISION_VERSION,
    decisionId:
      input.decisionId,
    decisionState:
      "OWNER_REVENUE_GROWTH_WORKFORCE_EXPANSION_DECISION_RECORDED" as const,
    ownerId:
      input.ownerId,
    sourcePlanningId:
      source.planningId,
    sourcePlanningDigest:
      source.planningDigest,
    sourceRosterDigest:
      source.sourceRosterDigest,
    decision:
      input.decision,
    expansionPlanApproved:
      approved,
    rosterExpansionPreparationEligible:
      approved,
    reason:
      input.reason.trim(),
    reviewedPlan: {
      planningState:
        source.planningState,
      existingRevenueEmployeeCount:
        source.existingRevenueEmployeeCount,
      proposedCandidateCount:
        source.proposedCandidateCount,
      proposedEmployeeCodes:
        source.proposedCandidates.map(
          (candidate) =>
            candidate.employeeCode,
        ),
      expansionSequence:
        source.expansionSequence,
      sourceOwnerExpansionDecisionRequired:
        source.ownerExpansionDecisionRequired,
      sourceOwnerExpansionDecisionRecorded:
        source.ownerExpansionDecisionRecorded,
      sourceNextStep:
        source.nextStep,
    },
    candidateExpansionEligibility:
      source.proposedCandidates.map(
        (candidate) => ({
          expansionSequence:
            candidate.expansionSequence,
          employeeId:
            candidate.employeeId,
          employeeCode:
            candidate.employeeCode,
          rosterExpansionPreparationEligible:
            approved,
          rosterAdmissionAuthorized:
            false as const,
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
      sourcePlanningBound:
        true as const,
      approvalBypassAllowed:
        false as const,
      rosterExpansionPreparationEligible:
        approved,
      rosterMutationAuthorized:
        false as const,
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
        ? "PREPARE_OWNER_CONTROLLED_REVENUE_GROWTH_ROSTER_EXPANSION" as const
        : "RETAIN_REVENUE_GROWTH_WORKFORCE_EXPANSION_PLANNING_ONLY" as const,
    decidedAt:
      input.decidedAt,
  };

  const decision =
    deepFreeze({
      ...decisionCore,
      decisionDigest:
        sha256(decisionCore),
    }) as RevenueGrowthWorkforceExpansionDecision;

  validateRevenueGrowthWorkforceExpansionDecision(
    decision,
  );

  return decision;
}
