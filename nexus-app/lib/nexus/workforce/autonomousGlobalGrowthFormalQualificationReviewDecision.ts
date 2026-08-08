import {
  createHash,
} from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "./engineeringAIWorkforceDevelopmentPlanDecision";

import {
  AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_TEST_PLAN,
  AUTONOMOUS_GLOBAL_GROWTH_INTERNAL_TENANT_ID,
  type AutonomousGlobalGrowthFormalQualificationTestPlan,
} from "./autonomousGlobalGrowthFormalQualificationTestPlan";

import {
  AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_FIXTURE_PACK,
  type AutonomousGlobalGrowthFormalQualificationFixturePack,
} from "./autonomousGlobalGrowthFormalQualificationFixturePack";

import {
  AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE,
  type AutonomousGlobalGrowthFormalQualificationExecutionEvidenceLedger,
  validateAutonomousGlobalGrowthFormalQualificationExecutionEvidence,
} from "./autonomousGlobalGrowthFormalQualificationExecutionEvidence";

export const AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_REVIEW_DECISION_VERSION =
  "nexus-autonomous-global-growth-formal-qualification-review-decision-v1" as const;

export type AutonomousGlobalGrowthFormalQualificationReviewOutcome =
  | "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION"
  | "REJECT_AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION";

export interface CreateAutonomousGlobalGrowthFormalQualificationReviewDecisionInput {
  readonly decisionId: string;

  readonly evidenceLedger:
    AutonomousGlobalGrowthFormalQualificationExecutionEvidenceLedger;

  readonly plan:
    AutonomousGlobalGrowthFormalQualificationTestPlan;

  readonly fixturePack:
    AutonomousGlobalGrowthFormalQualificationFixturePack;

  readonly tenantId:
    typeof AUTONOMOUS_GLOBAL_GROWTH_INTERNAL_TENANT_ID;

  readonly ownerId:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;

  readonly outcome:
    AutonomousGlobalGrowthFormalQualificationReviewOutcome;

  readonly rationale: string;
  readonly reviewedAt: string;
}

export interface EngineeringAIWorkforceCandidateFormalQualificationReviewRecord {
  readonly developmentSequence:
    number;

  readonly employeeId: string;
  readonly employeeCode: string;
  readonly publicName: string;
  readonly officialRole: string;

  readonly templateId: string;
  readonly templateDigest: string;

  readonly candidatePlanId: string;
  readonly candidatePlanDigest: string;

  readonly candidateFixturePackId:
    string;

  readonly candidateFixturePackDigest:
    string;

  readonly candidateEvidenceLedgerId:
    string;

  readonly candidateEvidenceLedgerDigest:
    string;

  readonly qualificationCasesExecuted:
    100;

  readonly qualificationCasesPassed:
    100;

  readonly qualificationCasesFailed:
    0;

  readonly qualificationEvidenceCollected:
    100;

  readonly assertionsExecuted:
    1300;

  readonly assertionsPassed:
    1300;

  readonly assertionsFailed:
    0;

  readonly assertionDerivedEvidenceVerified:
    true;

  readonly hardCodedPassingEvidenceAccepted:
    false;

  readonly formalQualificationEngineInvocationAuthorized:
    boolean;

  readonly qualificationEngineInvoked:
    false;

  readonly formalQualificationIssued:
    false;

  readonly qualifiedManifestCreated:
    false;

  readonly activationCandidateCreated:
    false;

  readonly runtimeActivated:
    false;

  readonly candidateReviewDigest:
    string;
}

export interface AutonomousGlobalGrowthFormalQualificationReviewDecision {
  readonly version:
    typeof AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_REVIEW_DECISION_VERSION;

  readonly decisionId: string;

  readonly decisionState:
    | "AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_ENGINE_ADMISSION_APPROVED"
    | "AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_REJECTED";

  readonly tenantId:
    typeof AUTONOMOUS_GLOBAL_GROWTH_INTERNAL_TENANT_ID;

  readonly ownerId:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;

  readonly evaluatorId: string;

  readonly evidenceLedgerId: string;
  readonly evidenceLedgerDigest: string;

  readonly planningId: string;
  readonly planningDigest: string;

  readonly fixturePackId: string;
  readonly fixturePackDigest: string;

  readonly outcome:
    AutonomousGlobalGrowthFormalQualificationReviewOutcome;

  readonly rationale: string;

  readonly candidateReviewCount: 9;

  readonly candidateReviews:
    readonly EngineeringAIWorkforceCandidateFormalQualificationReviewRecord[];

  readonly evidenceSummary: Readonly<{
    qualificationCasesExecuted:
      900;

    qualificationCasesPassed:
      900;

    qualificationCasesFailed:
      0;

    qualificationEvidenceCollected:
      900;

    assertionsExecuted:
      11700;

    assertionsPassed:
      11700;

    assertionsFailed:
      0;

    exactNineCandidatesReviewed:
      true;

    independentEvaluatorEvidenceVerified:
      true;

    assertionDerivedEvidenceVerified:
      true;

    hardCodedPassingEvidenceAccepted:
      false;
  }>;

  readonly nextStep:
    | "INVOKE_OWNER_APPROVED_AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_ENGINE"
    | "RETURN_AUTONOMOUS_GLOBAL_GROWTH_WORKFORCE_TO_CONTROLLED_REQUALIFICATION";

  readonly authorityBoundary: Readonly<{
    executionEvidenceBound: true;
    formalPlanBound: true;
    formalFixturePackBound: true;

    exactNineCandidatesRequired:
      true;

    independentEvaluatorEvidenceVerified:
      true;

    ownerReviewRequired: true;
    ownerDecisionRecorded: true;
    ownerIdentityBound: true;

    approvalBypassAllowed:
      false;

    formalQualificationEngineInvocationAuthorized:
      boolean;

    qualificationEngineInvoked:
      false;

    qualificationReportCreated:
      false;

    formalQualificationIssued:
      false;

    qualifiedManifestCreated:
      false;

    activationCandidateCreated:
      false;

    ownerActivationRecorded:
      false;

    runtimeActivated: false;

    controlledWorkAuthorized:
      false;

    repositoryReadAuthorized:
      false;

    repositoryWriteAuthorized:
      false;

    branchCreationAuthorized:
      false;

    pullRequestPreparationAuthorized:
      false;

    mergeAuthorized: false;

    productionDeploymentAuthorized:
      false;

    secretsAccessAuthorized:
      false;

    realCustomerDataAccessAuthorized:
      false;

    realCustomerContactAuthorized:
      false;

    externalDeliveryAuthorized:
      false;

    liveProviderExecutionAuthorized:
      false;

    productionDatabaseAuthorized:
      false;

    productionMutationAuthorized:
      false;

    paymentExecutionAuthorized:
      false;

    financialCommitmentAuthorized:
      false;

    legalCommitmentAuthorized:
      false;

    autonomousDecisionAuthorized:
      false;

    productionReadinessAuthorized:
      false;

    publicLaunchAuthorized: false;
  }>;

  readonly reviewedAt: string;
  readonly decisionDigest: string;
}

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9._:-]{2,127}$/;

const SHA256_PATTERN =
  /^[0-9a-f]{64}$/;

function stableStringify(
  value: unknown,
): string {
  if (Array.isArray(value)) {
    return (
      "[" +
      value
        .map((entry) =>
          stableStringify(entry),
        )
        .join(",") +
      "]"
    );
  }

  if (
    value !== null &&
    typeof value === "object"
  ) {
    const record =
      value as Record<string, unknown>;

    return (
      "{" +
      Object.keys(record)
        .sort()
        .map(
          (key) =>
            `${JSON.stringify(key)}:${stableStringify(record[key])}`,
        )
        .join(",") +
      "}"
    );
  }

  return JSON.stringify(value);
}

function sha256(
  value: unknown,
): string {
  return createHash("sha256")
    .update(stableStringify(value))
    .digest("hex");
}

function deepFreeze<T>(
  value: T,
): T {
  if (
    value !== null &&
    typeof value === "object" &&
    !Object.isFrozen(value)
  ) {
    Object.freeze(value);

    for (
      const nestedValue of
      Object.values(
        value as Record<string, unknown>,
      )
    ) {
      deepFreeze(nestedValue);
    }
  }

  return value;
}

function requireIdentifier(
  label: string,
  value: string,
): void {
  if (!SAFE_IDENTIFIER_PATTERN.test(value)) {
    throw new Error(
      `${label} is invalid.`,
    );
  }
}

function requireTimestamp(
  label: string,
  value: string,
): void {
  if (
    Number.isNaN(Date.parse(value)) ||
    new Date(value).toISOString() !==
      value
  ) {
    throw new Error(
      `${label} must be an exact ISO timestamp.`,
    );
  }
}

function requireDigest(
  label: string,
  value: string,
): void {
  if (!SHA256_PATTERN.test(value)) {
    throw new Error(
      `${label} must be a SHA-256 digest.`,
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
      `${label} must remain unique.`,
    );
  }
}

export function validateAutonomousGlobalGrowthFormalQualificationReviewDecision(
  decision:
    AutonomousGlobalGrowthFormalQualificationReviewDecision,
): void {
  validateAutonomousGlobalGrowthFormalQualificationExecutionEvidence(
    AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE,
    AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_TEST_PLAN,
    AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_FIXTURE_PACK,
  );

  requireIdentifier(
    "Autonomous Global Growth formal qualification review decision ID",
    decision.decisionId,
  );

  requireIdentifier(
    "Autonomous Global Growth formal qualification review owner ID",
    decision.ownerId,
  );

  requireIdentifier(
    "Autonomous Global Growth formal qualification review evaluator ID",
    decision.evaluatorId,
  );

  requireTimestamp(
    "Autonomous Global Growth formal qualification review time",
    decision.reviewedAt,
  );

  requireDigest(
    "Autonomous Global Growth formal qualification review decision digest",
    decision.decisionDigest,
  );

  const approved =
    decision.outcome ===
      "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION";

  if (
    decision.version !==
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_REVIEW_DECISION_VERSION ||
    (
      decision.outcome !==
        "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION" &&
      decision.outcome !==
        "REJECT_AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION"
    ) ||
    decision.decisionState !==
      (
        approved
          ? "AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_ENGINE_ADMISSION_APPROVED"
          : "AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_REJECTED"
      ) ||
    decision.tenantId !==
      AUTONOMOUS_GLOBAL_GROWTH_INTERNAL_TENANT_ID ||
    decision.ownerId !==
      ENGINEERING_AI_WORKFORCE_OWNER_ID ||
    decision.evaluatorId !==
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE
        .evaluatorId ||
    decision.ownerId ===
      decision.evaluatorId ||
    decision.evidenceLedgerId !==
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE
        .ledgerId ||
    decision.evidenceLedgerDigest !==
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE
        .ledgerDigest ||
    decision.planningId !==
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_TEST_PLAN
        .planningId ||
    decision.planningDigest !==
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_TEST_PLAN
        .planningDigest ||
    decision.fixturePackId !==
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_FIXTURE_PACK
        .fixturePackId ||
    decision.fixturePackDigest !==
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_FIXTURE_PACK
        .fixturePackDigest ||
    decision.rationale.trim().length <
      40 ||
    decision.candidateReviewCount !==
      9 ||
    decision.candidateReviews.length !==
      9
  ) {
    throw new Error(
      "Autonomous Global Growth formal qualification review identity is invalid.",
    );
  }

  requireUnique(
    "Autonomous Global Growth reviewed employee IDs",
    decision.candidateReviews.map(
      (record) =>
        record.employeeId,
    ),
  );

  requireUnique(
    "Autonomous Global Growth candidate review digests",
    decision.candidateReviews.map(
      (record) =>
        record.candidateReviewDigest,
    ),
  );

  decision.candidateReviews.forEach(
    (
      record,
      index,
    ) => {
      const candidateEvidence =
        AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE
          .candidateEvidenceLedgers[
            index
          ];

      if (!candidateEvidence) {
        throw new Error(
          "Autonomous Global Growth candidate review evidence is missing.",
        );
      }

      requireDigest(
        "Autonomous Global Growth candidate review digest",
        record.candidateReviewDigest,
      );

      const {
        candidateReviewDigest,
        ...recordCore
      } = record;

      if (
        sha256(recordCore) !==
          candidateReviewDigest ||
        record.developmentSequence !==
          index + 1 ||
        record.employeeId !==
          candidateEvidence.employeeId ||
        record.employeeCode !==
          candidateEvidence.employeeCode ||
        record.publicName !==
          candidateEvidence.publicName ||
        record.officialRole !==
          candidateEvidence.officialRole ||
        record.templateId !==
          candidateEvidence.templateId ||
        record.templateDigest !==
          candidateEvidence.templateDigest ||
        record.candidatePlanId !==
          candidateEvidence.candidatePlanId ||
        record.candidatePlanDigest !==
          candidateEvidence.candidatePlanDigest ||
        record.candidateFixturePackId !==
          candidateEvidence.candidateFixturePackId ||
        record.candidateFixturePackDigest !==
          candidateEvidence.candidateFixturePackDigest ||
        record.candidateEvidenceLedgerId !==
          candidateEvidence.candidateLedgerId ||
        record.candidateEvidenceLedgerDigest !==
          candidateEvidence.candidateLedgerDigest ||
        record.qualificationCasesExecuted !==
          100 ||
        record.qualificationCasesPassed !==
          100 ||
        record.qualificationCasesFailed !==
          0 ||
        record.qualificationEvidenceCollected !==
          100 ||
        record.assertionsExecuted !==
          1300 ||
        record.assertionsPassed !==
          1300 ||
        record.assertionsFailed !==
          0 ||
        record.assertionDerivedEvidenceVerified !==
          true ||
        record.hardCodedPassingEvidenceAccepted !==
          false ||
        record.formalQualificationEngineInvocationAuthorized !==
          approved ||
        record.qualificationEngineInvoked !==
          false ||
        record.formalQualificationIssued !==
          false ||
        record.qualifiedManifestCreated !==
          false ||
        record.activationCandidateCreated !==
          false ||
        record.runtimeActivated !==
          false
      ) {
        throw new Error(
          "Autonomous Global Growth candidate formal qualification review record is invalid.",
        );
      }
    },
  );

  const summary =
    decision.evidenceSummary;

  if (
    summary.qualificationCasesExecuted !==
      900 ||
    summary.qualificationCasesPassed !==
      900 ||
    summary.qualificationCasesFailed !==
      0 ||
    summary.qualificationEvidenceCollected !==
      900 ||
    summary.assertionsExecuted !==
      11700 ||
    summary.assertionsPassed !==
      11700 ||
    summary.assertionsFailed !==
      0 ||
    summary.exactNineCandidatesReviewed !==
      true ||
    summary.independentEvaluatorEvidenceVerified !==
      true ||
    summary.assertionDerivedEvidenceVerified !==
      true ||
    summary.hardCodedPassingEvidenceAccepted !==
      false
  ) {
    throw new Error(
      "Autonomous Global Growth formal qualification review evidence summary is invalid.",
    );
  }

  const boundary =
    decision.authorityBoundary;

  if (
    boundary.executionEvidenceBound !==
      true ||
    boundary.formalPlanBound !==
      true ||
    boundary.formalFixturePackBound !==
      true ||
    boundary.exactNineCandidatesRequired !==
      true ||
    boundary.independentEvaluatorEvidenceVerified !==
      true ||
    boundary.ownerReviewRequired !==
      true ||
    boundary.ownerDecisionRecorded !==
      true ||
    boundary.ownerIdentityBound !==
      true ||
    boundary.approvalBypassAllowed !==
      false ||
    boundary.formalQualificationEngineInvocationAuthorized !==
      approved ||
    boundary.qualificationEngineInvoked !==
      false ||
    boundary.qualificationReportCreated !==
      false ||
    boundary.formalQualificationIssued !==
      false ||
    boundary.qualifiedManifestCreated !==
      false ||
    boundary.activationCandidateCreated !==
      false ||
    boundary.ownerActivationRecorded !==
      false ||
    boundary.runtimeActivated !==
      false ||
    boundary.controlledWorkAuthorized !==
      false ||
    boundary.repositoryReadAuthorized !==
      false ||
    boundary.repositoryWriteAuthorized !==
      false ||
    boundary.branchCreationAuthorized !==
      false ||
    boundary.pullRequestPreparationAuthorized !==
      false ||
    boundary.mergeAuthorized !==
      false ||
    boundary.productionDeploymentAuthorized !==
      false ||
    boundary.secretsAccessAuthorized !==
      false ||
    boundary.realCustomerDataAccessAuthorized !==
      false ||
    boundary.realCustomerContactAuthorized !==
      false ||
    boundary.externalDeliveryAuthorized !==
      false ||
    boundary.liveProviderExecutionAuthorized !==
      false ||
    boundary.productionDatabaseAuthorized !==
      false ||
    boundary.productionMutationAuthorized !==
      false ||
    boundary.paymentExecutionAuthorized !==
      false ||
    boundary.financialCommitmentAuthorized !==
      false ||
    boundary.legalCommitmentAuthorized !==
      false ||
    boundary.autonomousDecisionAuthorized !==
      false ||
    boundary.productionReadinessAuthorized !==
      false ||
    boundary.publicLaunchAuthorized !==
      false ||
    decision.nextStep !==
      (
        approved
          ? "INVOKE_OWNER_APPROVED_AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_ENGINE"
          : "RETURN_AUTONOMOUS_GLOBAL_GROWTH_WORKFORCE_TO_CONTROLLED_REQUALIFICATION"
      )
  ) {
    throw new Error(
      "Autonomous Global Growth formal qualification review authority boundary is invalid.",
    );
  }

  if (
    Date.parse(decision.reviewedAt) <
    Date.parse(
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE
        .executedAt,
    )
  ) {
    throw new Error(
      "Autonomous Global Growth formal qualification review cannot precede evidence execution.",
    );
  }

  const {
    decisionDigest,
    ...decisionCore
  } = decision;

  if (
    sha256(decisionCore) !==
      decisionDigest
  ) {
    throw new Error(
      "Autonomous Global Growth formal qualification review decision integrity is invalid.",
    );
  }

  if (
    !Object.isFrozen(decision) ||
    !Object.isFrozen(
      decision.candidateReviews,
    ) ||
    decision.candidateReviews.some(
      (record) =>
        !Object.isFrozen(record),
    ) ||
    !Object.isFrozen(
      decision.evidenceSummary,
    ) ||
    !Object.isFrozen(
      decision.authorityBoundary,
    )
  ) {
    throw new Error(
      "Autonomous Global Growth formal qualification review decision must remain immutable.",
    );
  }
}

export function createAutonomousGlobalGrowthFormalQualificationReviewDecision(
  input:
    CreateAutonomousGlobalGrowthFormalQualificationReviewDecisionInput,
): AutonomousGlobalGrowthFormalQualificationReviewDecision {
  if (
    input.evidenceLedger !==
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE
  ) {
    throw new Error(
      "Only canonical Autonomous Global Growth formal qualification execution evidence can be reviewed.",
    );
  }

  if (
    input.plan !==
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_TEST_PLAN
  ) {
    throw new Error(
      "Only the canonical Autonomous Global Growth formal qualification plan can be reviewed.",
    );
  }

  if (
    input.fixturePack !==
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_FIXTURE_PACK
  ) {
    throw new Error(
      "Only the canonical Autonomous Global Growth formal qualification fixture pack can be reviewed.",
    );
  }

  validateAutonomousGlobalGrowthFormalQualificationExecutionEvidence(
    input.evidenceLedger,
    input.plan,
    input.fixturePack,
  );

  requireIdentifier(
    "Autonomous Global Growth formal qualification review decision ID",
    input.decisionId,
  );

  requireTimestamp(
    "Autonomous Global Growth formal qualification review time",
    input.reviewedAt,
  );

  if (
    input.tenantId !==
      input.evidenceLedger.tenantId ||
    input.tenantId !==
      AUTONOMOUS_GLOBAL_GROWTH_INTERNAL_TENANT_ID
  ) {
    throw new Error(
      "Cross-tenant Autonomous Global Growth formal qualification review is blocked.",
    );
  }

  if (
    input.ownerId !==
      input.evidenceLedger.ownerId ||
    input.ownerId !==
      ENGINEERING_AI_WORKFORCE_OWNER_ID
  ) {
    throw new Error(
      "Only the evidence-bound verified NEXUS owner can record the Autonomous Global Growth formal qualification decision.",
    );
  }

  if (
    input.outcome !==
      "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION" &&
    input.outcome !==
      "REJECT_AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION"
  ) {
    throw new Error(
      "Autonomous Global Growth formal qualification review outcome is invalid.",
    );
  }

  const rationale =
    input.rationale.trim();

  if (rationale.length < 40) {
    throw new Error(
      "Autonomous Global Growth formal qualification review rationale is insufficient.",
    );
  }

  if (
    Date.parse(input.reviewedAt) <
    Date.parse(
      input.evidenceLedger.executedAt,
    )
  ) {
    throw new Error(
      "Autonomous Global Growth formal qualification review cannot precede evidence execution.",
    );
  }

  const approved =
    input.outcome ===
      "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION";

  const candidateReviews =
    input.evidenceLedger
      .candidateEvidenceLedgers
      .map(
        (
          candidateEvidence,
          index,
        ) => {
          const recordCore = {
            developmentSequence:
              index + 1,
            employeeId:
              candidateEvidence.employeeId,
            employeeCode:
              candidateEvidence.employeeCode,
            publicName:
              candidateEvidence.publicName,
            officialRole:
              candidateEvidence.officialRole,
            templateId:
              candidateEvidence.templateId,
            templateDigest:
              candidateEvidence.templateDigest,
            candidatePlanId:
              candidateEvidence.candidatePlanId,
            candidatePlanDigest:
              candidateEvidence.candidatePlanDigest,
            candidateFixturePackId:
              candidateEvidence.candidateFixturePackId,
            candidateFixturePackDigest:
              candidateEvidence.candidateFixturePackDigest,
            candidateEvidenceLedgerId:
              candidateEvidence.candidateLedgerId,
            candidateEvidenceLedgerDigest:
              candidateEvidence.candidateLedgerDigest,
            qualificationCasesExecuted:
              100 as const,
            qualificationCasesPassed:
              100 as const,
            qualificationCasesFailed:
              0 as const,
            qualificationEvidenceCollected:
              100 as const,
            assertionsExecuted:
              1300 as const,
            assertionsPassed:
              1300 as const,
            assertionsFailed:
              0 as const,
            assertionDerivedEvidenceVerified:
              true as const,
            hardCodedPassingEvidenceAccepted:
              false as const,
            formalQualificationEngineInvocationAuthorized:
              approved,
            qualificationEngineInvoked:
              false as const,
            formalQualificationIssued:
              false as const,
            qualifiedManifestCreated:
              false as const,
            activationCandidateCreated:
              false as const,
            runtimeActivated:
              false as const,
          };

          return deepFreeze({
            ...recordCore,
            candidateReviewDigest:
              sha256(recordCore),
          });
        },
      );

  const decisionCore = {
    version:
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_REVIEW_DECISION_VERSION,

    decisionId:
      input.decisionId,

    decisionState:
      approved
        ? "AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_ENGINE_ADMISSION_APPROVED" as const
        : "AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_REJECTED" as const,

    tenantId:
      input.tenantId,

    ownerId:
      input.ownerId,

    evaluatorId:
      input.evidenceLedger.evaluatorId,

    evidenceLedgerId:
      input.evidenceLedger.ledgerId,

    evidenceLedgerDigest:
      input.evidenceLedger.ledgerDigest,

    planningId:
      input.plan.planningId,

    planningDigest:
      input.plan.planningDigest,

    fixturePackId:
      input.fixturePack.fixturePackId,

    fixturePackDigest:
      input.fixturePack.fixturePackDigest,

    outcome:
      input.outcome,

    rationale,

    candidateReviewCount:
      9 as const,

    candidateReviews,

    evidenceSummary: {
      qualificationCasesExecuted:
        900 as const,

      qualificationCasesPassed:
        900 as const,

      qualificationCasesFailed:
        0 as const,

      qualificationEvidenceCollected:
        900 as const,

      assertionsExecuted:
        11700 as const,

      assertionsPassed:
        11700 as const,

      assertionsFailed:
        0 as const,

      exactNineCandidatesReviewed:
        true as const,

      independentEvaluatorEvidenceVerified:
        true as const,

      assertionDerivedEvidenceVerified:
        true as const,

      hardCodedPassingEvidenceAccepted:
        false as const,
    },

    nextStep:
      approved
        ? "INVOKE_OWNER_APPROVED_AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_ENGINE" as const
        : "RETURN_AUTONOMOUS_GLOBAL_GROWTH_WORKFORCE_TO_CONTROLLED_REQUALIFICATION" as const,

    authorityBoundary: {
      executionEvidenceBound:
        true as const,

      formalPlanBound:
        true as const,

      formalFixturePackBound:
        true as const,

      exactNineCandidatesRequired:
        true as const,

      independentEvaluatorEvidenceVerified:
        true as const,

      ownerReviewRequired:
        true as const,

      ownerDecisionRecorded:
        true as const,

      ownerIdentityBound:
        true as const,

      approvalBypassAllowed:
        false as const,

      formalQualificationEngineInvocationAuthorized:
        approved,

      qualificationEngineInvoked:
        false as const,

      qualificationReportCreated:
        false as const,

      formalQualificationIssued:
        false as const,

      qualifiedManifestCreated:
        false as const,

      activationCandidateCreated:
        false as const,

      ownerActivationRecorded:
        false as const,

      runtimeActivated:
        false as const,

      controlledWorkAuthorized:
        false as const,

      repositoryReadAuthorized:
        false as const,

      repositoryWriteAuthorized:
        false as const,

      branchCreationAuthorized:
        false as const,

      pullRequestPreparationAuthorized:
        false as const,

      mergeAuthorized:
        false as const,

      productionDeploymentAuthorized:
        false as const,

      secretsAccessAuthorized:
        false as const,

      realCustomerDataAccessAuthorized:
        false as const,

      realCustomerContactAuthorized:
        false as const,

      externalDeliveryAuthorized:
        false as const,

      liveProviderExecutionAuthorized:
        false as const,

      productionDatabaseAuthorized:
        false as const,

      productionMutationAuthorized:
        false as const,

      paymentExecutionAuthorized:
        false as const,

      financialCommitmentAuthorized:
        false as const,

      legalCommitmentAuthorized:
        false as const,

      autonomousDecisionAuthorized:
        false as const,

      productionReadinessAuthorized:
        false as const,

      publicLaunchAuthorized:
        false as const,
    },

    reviewedAt:
      input.reviewedAt,
  };

  const decision =
    deepFreeze({
      ...decisionCore,

      decisionDigest:
        sha256(decisionCore),
    }) as AutonomousGlobalGrowthFormalQualificationReviewDecision;

  validateAutonomousGlobalGrowthFormalQualificationReviewDecision(
    decision,
  );

  return decision;
}
