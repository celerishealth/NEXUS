import { createHash } from "node:crypto";

import {
  WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER,
  type WorldClassAIWorkforceMasterRoster,
} from "./worldClassAIWorkforceMasterRoster";

import {
  PROPOSED_REVENUE_GROWTH_SPECIALISTS,
} from "./revenueGrowthWorkforceExpansionPlan";

import {
  validateRevenueGrowthWorkforceExpansionDecision,
  type RevenueGrowthWorkforceExpansionDecision,
} from "./revenueGrowthWorkforceExpansionDecision";

import {
  REVENUE_GROWTH_WORKFORCE_EXPANSION_APPROVAL_DECISION,
} from "./revenueGrowthWorkforceExpansionApprovalRecord";

export const REVENUE_GROWTH_WORKFORCE_ROSTER_EXPANSION_PREPARATION_VERSION =
  "nexus-revenue-growth-workforce-roster-expansion-preparation-v1" as const;

export interface CreateRevenueGrowthWorkforceRosterExpansionPreparationInput {
  readonly preparationId: string;
  readonly approvalDecision:
    RevenueGrowthWorkforceExpansionDecision;
  readonly sourceRoster:
    WorldClassAIWorkforceMasterRoster;
  readonly preparedAt: string;
}

export interface PreparedRevenueGrowthRosterCandidate {
  readonly expansionSequence: number;
  readonly employeeId: string;
  readonly employeeCode: string;
  readonly publicName: string;
  readonly officialRole: string;
  readonly department:
    "SALES" | "MARKETING";
  readonly priorityTier:
    "REVENUE_READINESS_PRIORITY";
  readonly targetRosterStatus:
    "PLANNED_CANDIDATE";
  readonly rosterEntryPrepared: true;
  readonly qualificationRequired: true;
  readonly activationAuthorized: false;
  readonly consequentialAuthorityAuthorized:
    false;
  readonly externalCommunicationAuthorized:
    false;
  readonly productionExecutionAuthorized:
    false;
  readonly financialCommitmentAuthorized:
    false;
  readonly legalCommitmentAuthorized: false;
  readonly rosterAdmissionAuthorized: false;
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

export interface RevenueGrowthWorkforceRosterExpansionPreparation {
  readonly version:
    typeof REVENUE_GROWTH_WORKFORCE_ROSTER_EXPANSION_PREPARATION_VERSION;
  readonly preparationId: string;
  readonly preparationState:
    "OWNER_CONTROLLED_REVENUE_GROWTH_ROSTER_EXPANSION_PREPARED";
  readonly sourceDecisionId: string;
  readonly sourceDecisionDigest: string;
  readonly sourcePlanningId: string;
  readonly sourcePlanningDigest: string;
  readonly sourceRosterVersion:
    WorldClassAIWorkforceMasterRoster["version"];
  readonly sourceRosterDigest: string;
  readonly candidateCount: 9;
  readonly preparedCandidates:
    readonly PreparedRevenueGrowthRosterCandidate[];
  readonly expansionSequence:
    readonly number[];
  readonly sourceRosterPreserved: true;
  readonly ownerRosterAdmissionDecisionRequired:
    true;
  readonly ownerRosterAdmissionDecisionRecorded:
    false;
  readonly authorityBoundary: Readonly<{
    preparationOnly: true;
    sourceApprovalDecisionBound: true;
    sourceRosterPreserved: true;
    duplicateIdentityBlocked: true;
    rosterEntryDefinitionsPrepared: true;
    rosterMutationAuthorized: false;
    rosterAdmissionAuthorized: false;
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
    "AWAIT_OWNER_REVENUE_GROWTH_ROSTER_ADMISSION_DECISION";
  readonly preparedAt: string;
  readonly preparationDigest: string;
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
        "Unsupported deterministic roster-expansion preparation value.",
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

function requireUnique(
  label: string,
  values: readonly string[],
): void {
  if (
    new Set(values).size !==
    values.length
  ) {
    throw new Error(
      `${label} must not contain duplicates.`,
    );
  }
}

export function validateRevenueGrowthWorkforceRosterExpansionPreparation(
  record:
    RevenueGrowthWorkforceRosterExpansionPreparation,
): void {
  const {
    preparationDigest,
    ...unsignedRecord
  } = record;

  requireDigest(
    "Roster-expansion preparation digest",
    preparationDigest,
  );

  if (
    sha256(unsignedRecord) !==
    preparationDigest
  ) {
    throw new Error(
      "Roster-expansion preparation digest verification failed.",
    );
  }

  requireIdentifier(
    "Roster-expansion preparation ID",
    record.preparationId,
  );

  requireIdentifier(
    "Roster-expansion source decision ID",
    record.sourceDecisionId,
  );

  requireIdentifier(
    "Roster-expansion source planning ID",
    record.sourcePlanningId,
  );

  requireDigest(
    "Roster-expansion source decision digest",
    record.sourceDecisionDigest,
  );

  requireDigest(
    "Roster-expansion source planning digest",
    record.sourcePlanningDigest,
  );

  requireDigest(
    "Roster-expansion source roster digest",
    record.sourceRosterDigest,
  );

  requireExactIsoTimestamp(
    "Roster-expansion preparation time",
    record.preparedAt,
  );

  if (
    record.version !==
      REVENUE_GROWTH_WORKFORCE_ROSTER_EXPANSION_PREPARATION_VERSION ||
    record.preparationState !==
      "OWNER_CONTROLLED_REVENUE_GROWTH_ROSTER_EXPANSION_PREPARED" ||
    record.candidateCount !== 9 ||
    record.preparedCandidates.length !==
      9 ||
    record.expansionSequence.length !==
      9 ||
    record.sourceRosterPreserved !==
      true ||
    record.ownerRosterAdmissionDecisionRequired !==
      true ||
    record.ownerRosterAdmissionDecisionRecorded !==
      false ||
    record.nextStep !==
      "AWAIT_OWNER_REVENUE_GROWTH_ROSTER_ADMISSION_DECISION"
  ) {
    throw new Error(
      "Roster-expansion preparation identity is invalid.",
    );
  }

  record.preparedCandidates.forEach(
    (candidate, index) => {
      const expected =
        PROPOSED_REVENUE_GROWTH_SPECIALISTS[
          index
        ];

      if (
        candidate.expansionSequence !==
          index + 1 ||
        record.expansionSequence[index] !==
          index + 1 ||
        candidate.employeeId !==
          expected.employeeId ||
        candidate.employeeCode !==
          expected.employeeCode ||
        candidate.publicName !==
          expected.publicName ||
        candidate.officialRole !==
          expected.officialRole ||
        candidate.department !==
          expected.department ||
        candidate.priorityTier !==
          "REVENUE_READINESS_PRIORITY" ||
        candidate.targetRosterStatus !==
          "PLANNED_CANDIDATE" ||
        candidate.rosterEntryPrepared !==
          true ||
        candidate.qualificationRequired !==
          true ||
        candidate.activationAuthorized !==
          false ||
        candidate.consequentialAuthorityAuthorized !==
          false ||
        candidate.externalCommunicationAuthorized !==
          false ||
        candidate.productionExecutionAuthorized !==
          false ||
        candidate.financialCommitmentAuthorized !==
          false ||
        candidate.legalCommitmentAuthorized !==
          false ||
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
          "Prepared revenue-growth roster candidate binding is invalid.",
        );
      }
    },
  );

  requireUnique(
    "Prepared roster employee IDs",
    record.preparedCandidates.map(
      (candidate) =>
        candidate.employeeId,
    ),
  );

  requireUnique(
    "Prepared roster employee codes",
    record.preparedCandidates.map(
      (candidate) =>
        candidate.employeeCode,
    ),
  );

  requireUnique(
    "Prepared roster public names",
    record.preparedCandidates.map(
      (candidate) =>
        candidate.publicName.toLowerCase(),
    ),
  );

  const boundary =
    record.authorityBoundary;

  if (
    boundary.preparationOnly !== true ||
    boundary.sourceApprovalDecisionBound !==
      true ||
    boundary.sourceRosterPreserved !==
      true ||
    boundary.duplicateIdentityBlocked !==
      true ||
    boundary.rosterEntryDefinitionsPrepared !==
      true ||
    boundary.rosterMutationAuthorized !==
      false ||
    boundary.rosterAdmissionAuthorized !==
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
      "Roster-expansion preparation authority boundary is invalid.",
    );
  }
}

export function createRevenueGrowthWorkforceRosterExpansionPreparation(
  input:
    CreateRevenueGrowthWorkforceRosterExpansionPreparationInput,
): RevenueGrowthWorkforceRosterExpansionPreparation {
  const decision =
    input.approvalDecision;

  validateRevenueGrowthWorkforceExpansionDecision(
    decision,
  );

  requireIdentifier(
    "Roster-expansion preparation ID",
    input.preparationId,
  );

  requireExactIsoTimestamp(
    "Roster-expansion preparation time",
    input.preparedAt,
  );

  requireDigest(
    "Source roster digest",
    input.sourceRoster.rosterDigest,
  );

  if (
    decision.decision !==
      "APPROVE_REVENUE_GROWTH_WORKFORCE_EXPANSION_PLAN" ||
    decision.expansionPlanApproved !==
      true ||
    decision.rosterExpansionPreparationEligible !==
      true ||
    decision.nextStep !==
      "PREPARE_OWNER_CONTROLLED_REVENUE_GROWTH_ROSTER_EXPANSION"
  ) {
    throw new Error(
      "Approved revenue-growth roster-expansion preparation evidence is required.",
    );
  }

  if (
    decision.sourceRosterDigest !==
      input.sourceRoster.rosterDigest
  ) {
    throw new Error(
      "Roster-expansion approval is not bound to the supplied source roster.",
    );
  }

  if (
    Date.parse(input.preparedAt) <
    Date.parse(decision.decidedAt)
  ) {
    throw new Error(
      "Roster-expansion preparation cannot precede owner approval.",
    );
  }

  const existingIds =
    new Set(
      input.sourceRoster.entries.map(
        (entry) =>
          entry.employeeId,
      ),
    );

  const existingCodes =
    new Set(
      input.sourceRoster.entries.map(
        (entry) =>
          entry.employeeCode,
      ),
    );

  const existingNames =
    new Set(
      input.sourceRoster.entries.map(
        (entry) =>
          entry.publicName.toLowerCase(),
      ),
    );

  for (
    const candidate of
    PROPOSED_REVENUE_GROWTH_SPECIALISTS
  ) {
    if (
      existingIds.has(
        candidate.employeeId,
      ) ||
      existingCodes.has(
        candidate.employeeCode,
      ) ||
      existingNames.has(
        candidate.publicName.toLowerCase(),
      )
    ) {
      throw new Error(
        `Revenue-growth roster candidate collides with the immutable source roster: ${candidate.officialRole}.`,
      );
    }
  }

  const preparedCandidates =
    PROPOSED_REVENUE_GROWTH_SPECIALISTS.map(
      (candidate, index) => ({
        expansionSequence:
          index + 1,
        ...candidate,
        priorityTier:
          "REVENUE_READINESS_PRIORITY" as const,
        targetRosterStatus:
          "PLANNED_CANDIDATE" as const,
        rosterEntryPrepared:
          true as const,
        qualificationRequired:
          true as const,
        activationAuthorized:
          false as const,
        consequentialAuthorityAuthorized:
          false as const,
        externalCommunicationAuthorized:
          false as const,
        productionExecutionAuthorized:
          false as const,
        financialCommitmentAuthorized:
          false as const,
        legalCommitmentAuthorized:
          false as const,
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
    );

  const preparationCore = {
    version:
      REVENUE_GROWTH_WORKFORCE_ROSTER_EXPANSION_PREPARATION_VERSION,
    preparationId:
      input.preparationId,
    preparationState:
      "OWNER_CONTROLLED_REVENUE_GROWTH_ROSTER_EXPANSION_PREPARED" as const,
    sourceDecisionId:
      decision.decisionId,
    sourceDecisionDigest:
      decision.decisionDigest,
    sourcePlanningId:
      decision.sourcePlanningId,
    sourcePlanningDigest:
      decision.sourcePlanningDigest,
    sourceRosterVersion:
      input.sourceRoster.version,
    sourceRosterDigest:
      input.sourceRoster.rosterDigest,
    candidateCount:
      9 as const,
    preparedCandidates,
    expansionSequence:
      preparedCandidates.map(
        (candidate) =>
          candidate.expansionSequence,
      ),
    sourceRosterPreserved:
      true as const,
    ownerRosterAdmissionDecisionRequired:
      true as const,
    ownerRosterAdmissionDecisionRecorded:
      false as const,
    authorityBoundary: {
      preparationOnly:
        true,
      sourceApprovalDecisionBound:
        true,
      sourceRosterPreserved:
        true,
      duplicateIdentityBlocked:
        true,
      rosterEntryDefinitionsPrepared:
        true,
      rosterMutationAuthorized:
        false,
      rosterAdmissionAuthorized:
        false,
      factoryAdmissionAuthorized:
        false,
      templatePreparationAuthorized:
        false,
      qualificationExecutionAuthorized:
        false,
      ownerQualificationApprovalRecorded:
        false,
      activationCandidatePreparationAuthorized:
        false,
      ownerActivationAuthorized:
        false,
      runtimeActivationAuthorized:
        false,
      controlledWorkAuthorized:
        false,
      contentDraftingAuthorityGranted:
        false,
      videoGenerationExecutionAuthorized:
        false,
      liveSocialPostingAuthorized:
        false,
      paidAdvertisingSpendAuthorized:
        false,
      customerMessagingAuthorized:
        false,
      customerDataAccessAuthorized:
        false,
      externalDeliveryAuthorized:
        false,
      productionExecutionAuthorized:
        false,
      paymentExecutionAuthorized:
        false,
      financialCommitmentAuthorized:
        false,
      legalCommitmentAuthorized:
        false,
      autonomousExecutionAuthorized:
        false,
      publicLaunchAuthorized:
        false,
    } as const,
    nextStep:
      "AWAIT_OWNER_REVENUE_GROWTH_ROSTER_ADMISSION_DECISION" as const,
    preparedAt:
      input.preparedAt,
  };

  const preparation =
    deepFreeze({
      ...preparationCore,
      preparationDigest:
        sha256(preparationCore),
    }) as RevenueGrowthWorkforceRosterExpansionPreparation;

  validateRevenueGrowthWorkforceRosterExpansionPreparation(
    preparation,
  );

  return preparation;
}

export const REVENUE_GROWTH_WORKFORCE_ROSTER_EXPANSION_PREPARATION =
  createRevenueGrowthWorkforceRosterExpansionPreparation({
    preparationId:
      "revenue-growth-workforce-roster-expansion-preparation-001",
    approvalDecision:
      REVENUE_GROWTH_WORKFORCE_EXPANSION_APPROVAL_DECISION,
    sourceRoster:
      WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER,
    preparedAt:
      "2026-07-20T18:12:48.051Z",
  });
