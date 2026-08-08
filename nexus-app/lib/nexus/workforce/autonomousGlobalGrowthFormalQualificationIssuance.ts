import {
  createHash,
} from "node:crypto";

import {
  createAIEmployeeQualificationReport,
  type AIEmployeeQualificationReport,
} from "./employeeQualification";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "./engineeringAIWorkforceDevelopmentPlanDecision";

import {
  AUTONOMOUS_GLOBAL_GROWTH_INTERNAL_TENANT_ID,
} from "./autonomousGlobalGrowthFormalQualificationTestPlan";

import {
  AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_REGISTRY,
} from "./autonomousGlobalGrowthAIEmployeeTemplateCreationExecution";

import {
  AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_TEST_PLAN,
} from "./autonomousGlobalGrowthFormalQualificationTestPlan";

import {
  AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_FIXTURE_PACK,
} from "./autonomousGlobalGrowthFormalQualificationFixturePack";

import {
  AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE,
  validateAutonomousGlobalGrowthFormalQualificationExecutionEvidence,
} from "./autonomousGlobalGrowthFormalQualificationExecutionEvidence";

import {
  validateAutonomousGlobalGrowthFormalQualificationReviewDecision,
} from "./autonomousGlobalGrowthFormalQualificationReviewDecision";

import {
  AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_REVIEW_APPROVAL_RECORD,
} from "./autonomousGlobalGrowthFormalQualificationReviewApprovalRecord";

export const AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_ISSUANCE_VERSION =
  "nexus-autonomous-global-growth-formal-qualification-issuance-v1" as const;

export interface IssueAutonomousGlobalGrowthFormalQualificationInput {
  readonly issuanceId: string;

  readonly templateRegistry:
    typeof AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_REGISTRY;

  readonly executionEvidence:
    typeof AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE;

  readonly approvalDecision:
    typeof AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_REVIEW_APPROVAL_RECORD;

  readonly tenantId:
    typeof AUTONOMOUS_GLOBAL_GROWTH_INTERNAL_TENANT_ID;

  readonly ownerId:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;

  readonly qualifiedAt: string;
}

export interface AutonomousGlobalGrowthCandidateFormalQualificationIssuance {
  readonly developmentSequence:
    number;

  readonly issuanceState:
    "AUTONOMOUS_GLOBAL_GROWTH_CANDIDATE_FORMAL_QUALIFICATION_ISSUED";

  readonly employeeId: string;
  readonly employeeCode: string;
  readonly publicName: string;
  readonly officialRole: string;

  readonly templateId: string;
  readonly templateDigest: string;

  readonly candidateEvidenceLedgerId:
    string;

  readonly candidateEvidenceLedgerDigest:
    string;

  readonly candidateReviewDigest:
    string;

  readonly qualificationReport:
    AIEmployeeQualificationReport;

  readonly qualificationDigest:
    string;

  readonly reportSummary: Readonly<{
    totalTestCases: 100;
    passedTestCases: 100;
    failedTestCases: 0;

    qualificationEvidenceCount:
      100;

    assertionsExecuted:
      1300;

    assertionsPassed:
      1300;

    assertionsFailed:
      0;

    mandatoryCategoryCoveragePassed:
      true;

    everyTestCasePassed:
      true;

    ownerApprovalRecorded:
      true;

    qualificationPassed:
      true;

    normalOperationCases:
      30;

    adversarialCases:
      15;

    tenantIsolationCases:
      15;

    ownerControlCases:
      15;

    emergencyPauseCases:
      5;

    departmentHandoffCases:
      10;

    auditEvidenceCases:
      5;

    failureRecoveryCases:
      5;
  }>;

  readonly authorityBoundary: Readonly<{
    ownerApprovalBound:
      true;

    executionEvidenceBound:
      true;

    exactTemplateBound:
      true;

    qualificationEngineInvoked:
      true;

    qualificationReportCreated:
      true;

    formalQualificationIssued:
      true;

    qualifiedManifestCreated:
      false;

    activationCandidateCreated:
      false;

    ownerActivationRecorded:
      false;

    runtimeActivated:
      false;

    controlledWorkAuthorized:
      false;

    repositoryReadAuthorized:
      false;

    repositoryWriteAuthorized:
      false;

    productionDeploymentAuthorized:
      false;

    externalDeliveryAuthorized:
      false;

    liveProviderExecutionAuthorized:
      false;

    paymentExecutionAuthorized:
      false;

    autonomousDecisionAuthorized:
      false;

    publicLaunchAuthorized:
      false;
  }>;

  readonly candidateIssuanceDigest:
    string;
}

export interface AutonomousGlobalGrowthFormalQualificationIssuance {
  readonly version:
    typeof AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_ISSUANCE_VERSION;

  readonly issuanceId: string;

  readonly issuanceState:
    "AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_ISSUED";

  readonly tenantId:
    typeof AUTONOMOUS_GLOBAL_GROWTH_INTERNAL_TENANT_ID;

  readonly ownerId:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;

  readonly evaluatorId: string;

  readonly sourceTemplateRegistryDigest:
    string;

  readonly sourcePlanningId:
    string;

  readonly sourcePlanningDigest:
    string;

  readonly sourceFixturePackId:
    string;

  readonly sourceFixturePackDigest:
    string;

  readonly sourceEvidenceLedgerId:
    string;

  readonly sourceEvidenceLedgerDigest:
    string;

  readonly sourceApprovalDecisionId:
    string;

  readonly sourceApprovalDecisionDigest:
    string;

  readonly candidateIssuanceCount:
    9;

  readonly candidateIssuances:
    readonly AutonomousGlobalGrowthCandidateFormalQualificationIssuance[];

  readonly aggregateSummary: Readonly<{
    formallyQualifiedCandidateCount:
      9;

    qualificationReportsCreated:
      9;

    qualificationCasesExecuted:
      900;

    qualificationCasesPassed:
      900;

    qualificationCasesFailed:
      0;

    qualificationEvidenceCount:
      900;

    assertionsExecuted:
      11700;

    assertionsPassed:
      11700;

    assertionsFailed:
      0;

    uniqueQualificationDigests:
      9;

    exactNineCandidatesQualified:
      true;

    everyQualificationPassed:
      true;

    independentEvaluatorEvidenceVerified:
      true;

    ownerApprovalRecorded:
      true;
  }>;

  readonly nextStep:
    "PREPARE_AUTONOMOUS_GLOBAL_GROWTH_QUALIFIED_EMPLOYEE_MANIFESTS";

  readonly authorityBoundary: Readonly<{
    canonicalTemplateRegistryBound:
      true;

    canonicalExecutionEvidenceBound:
      true;

    canonicalOwnerApprovalBound:
      true;

    exactNineCandidatesRequired:
      true;

    qualificationEngineInvocationAuthorized:
      true;

    qualificationEngineInvoked:
      true;

    qualificationReportCreated:
      true;

    formalQualificationIssued:
      true;

    qualifiedManifestCreated:
      false;

    activationCandidateCreated:
      false;

    ownerActivationRecorded:
      false;

    runtimeActivated:
      false;

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

    mergeAuthorized:
      false;

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

    publicLaunchAuthorized:
      false;
  }>;

  readonly qualifiedAt: string;
  readonly issuanceDigest: string;
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

  const primitive =
    JSON.stringify(value);

  if (primitive === undefined) {
    throw new Error(
      "Unsupported deterministic Autonomous Global Growth qualification issuance value.",
    );
  }

  return primitive;
}

function sha256(
  value: unknown,
): string {
  return createHash("sha256")
    .update(
      stableStringify(value),
      "utf8",
    )
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

export function validateAutonomousGlobalGrowthFormalQualificationIssuance(
  issuance:
    AutonomousGlobalGrowthFormalQualificationIssuance,
): void {
  validateAutonomousGlobalGrowthFormalQualificationExecutionEvidence(
    AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE,
    AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_TEST_PLAN,
    AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_FIXTURE_PACK,
  );

  validateAutonomousGlobalGrowthFormalQualificationReviewDecision(
    AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_REVIEW_APPROVAL_RECORD,
  );

  requireIdentifier(
    "Autonomous Global Growth formal qualification issuance ID",
    issuance.issuanceId,
  );

  requireIdentifier(
    "Autonomous Global Growth formal qualification owner ID",
    issuance.ownerId,
  );

  requireIdentifier(
    "Autonomous Global Growth formal qualification evaluator ID",
    issuance.evaluatorId,
  );

  requireTimestamp(
    "Autonomous Global Growth formal qualification issuance time",
    issuance.qualifiedAt,
  );

  requireDigest(
    "Autonomous Global Growth formal qualification issuance digest",
    issuance.issuanceDigest,
  );

  if (
    issuance.version !==
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_ISSUANCE_VERSION ||
    issuance.issuanceState !==
      "AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_ISSUED" ||
    issuance.tenantId !==
      AUTONOMOUS_GLOBAL_GROWTH_INTERNAL_TENANT_ID ||
    issuance.ownerId !==
      ENGINEERING_AI_WORKFORCE_OWNER_ID ||
    issuance.evaluatorId !==
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE
        .evaluatorId ||
    issuance.ownerId ===
      issuance.evaluatorId ||
    issuance.sourceTemplateRegistryDigest !==
      AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_REGISTRY
        .registryDigest ||
    issuance.sourcePlanningId !==
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_TEST_PLAN
        .planningId ||
    issuance.sourcePlanningDigest !==
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_TEST_PLAN
        .planningDigest ||
    issuance.sourceFixturePackId !==
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_FIXTURE_PACK
        .fixturePackId ||
    issuance.sourceFixturePackDigest !==
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_FIXTURE_PACK
        .fixturePackDigest ||
    issuance.sourceEvidenceLedgerId !==
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE
        .ledgerId ||
    issuance.sourceEvidenceLedgerDigest !==
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE
        .ledgerDigest ||
    issuance.sourceApprovalDecisionId !==
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_REVIEW_APPROVAL_RECORD
        .decisionId ||
    issuance.sourceApprovalDecisionDigest !==
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_REVIEW_APPROVAL_RECORD
        .decisionDigest ||
    issuance.candidateIssuanceCount !==
      9 ||
    issuance.candidateIssuances.length !==
      9
  ) {
    throw new Error(
      "Autonomous Global Growth formal qualification issuance identity is invalid.",
    );
  }

  requireUnique(
    "Engineering formally qualified employee IDs",
    issuance.candidateIssuances.map(
      (record) =>
        record.employeeId,
    ),
  );

  requireUnique(
    "Autonomous Global Growth qualification digests",
    issuance.candidateIssuances.map(
      (record) =>
        record.qualificationDigest,
    ),
  );

  requireUnique(
    "Autonomous Global Growth candidate issuance digests",
    issuance.candidateIssuances.map(
      (record) =>
        record.candidateIssuanceDigest,
    ),
  );

  issuance.candidateIssuances.forEach(
    (
      record,
      index,
    ) => {
      const template =
        AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_REGISTRY
          .templates[index];

      const evidence =
        AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE
          .candidateEvidenceLedgers[index];

      const review =
        AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_REVIEW_APPROVAL_RECORD
          .candidateReviews[index];

      if (
        !template ||
        !evidence ||
        !review
      ) {
        throw new Error(
          "Autonomous Global Growth candidate formal qualification source binding is missing.",
        );
      }

      requireDigest(
        "Autonomous Global Growth candidate issuance digest",
        record.candidateIssuanceDigest,
      );

      requireDigest(
        "Autonomous Global Growth candidate qualification digest",
        record.qualificationDigest,
      );

      const {
        candidateIssuanceDigest,
        ...recordCore
      } = record;

      const report =
        record.qualificationReport;

      const summary =
        record.reportSummary;

      const boundary =
        record.authorityBoundary;

      if (
        sha256(recordCore) !==
          candidateIssuanceDigest ||
        record.developmentSequence !==
          index + 1 ||
        record.issuanceState !==
          "AUTONOMOUS_GLOBAL_GROWTH_CANDIDATE_FORMAL_QUALIFICATION_ISSUED" ||
        record.employeeId !==
          template.employeeId ||
        record.employeeId !==
          evidence.employeeId ||
        record.employeeId !==
          review.employeeId ||
        record.employeeCode !==
          template.employeeCode ||
        record.employeeCode !==
          evidence.employeeCode ||
        record.employeeCode !==
          review.employeeCode ||
        record.publicName !==
          template.publicName ||
        record.publicName !==
          evidence.publicName ||
        record.publicName !==
          review.publicName ||
        record.officialRole !==
          template.officialRole ||
        record.officialRole !==
          evidence.officialRole ||
        record.officialRole !==
          review.officialRole ||
        record.templateId !==
          template.templateId ||
        record.templateId !==
          evidence.templateId ||
        record.templateId !==
          review.templateId ||
        record.templateDigest !==
          template.templateDigest ||
        record.templateDigest !==
          evidence.templateDigest ||
        record.templateDigest !==
          review.templateDigest ||
        record.candidateEvidenceLedgerId !==
          evidence.candidateLedgerId ||
        record.candidateEvidenceLedgerDigest !==
          evidence.candidateLedgerDigest ||
        record.candidateReviewDigest !==
          review.candidateReviewDigest ||
        record.qualificationDigest !==
          report.qualificationDigest ||
        report.employeeId !==
          template.employeeId ||
        report.templateId !==
          template.templateId ||
        report.templateDigest !==
          template.templateDigest ||
        report.sourceManifestDigest !==
          template.manifest.manifestDigest ||
        report.totalTestCases !==
          100 ||
        report.passedTestCases !==
          100 ||
        report.mandatoryCategoryCoveragePassed !==
          true ||
        report.everyTestCasePassed !==
          true ||
        report.ownerApproval.ownerId !==
          ENGINEERING_AI_WORKFORCE_OWNER_ID ||
        report.ownerApproval.approved !==
          true ||
        report.ownerApproval.approvedAt !==
          AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_REVIEW_APPROVAL_RECORD
            .reviewedAt ||
        report.qualificationPassed !==
          true ||
        report.qualifiedAt !==
          issuance.qualifiedAt ||
        report.categoryCounts.NORMAL_OPERATION !==
          30 ||
        report.categoryCounts.ADVERSARIAL !==
          15 ||
        report.categoryCounts.TENANT_ISOLATION !==
          15 ||
        report.categoryCounts.OWNER_CONTROL !==
          15 ||
        report.categoryCounts.EMERGENCY_PAUSE !==
          5 ||
        report.categoryCounts.DEPARTMENT_HANDOFF !==
          10 ||
        report.categoryCounts.AUDIT_EVIDENCE !==
          5 ||
        report.categoryCounts.FAILURE_RECOVERY !==
          5 ||
        report.safetyBoundary.syntheticQualificationBlocked !==
          true ||
        report.safetyBoundary.incompleteEvidenceBlocked !==
          true ||
        report.safetyBoundary.failedEvaluationBlocked !==
          true ||
        report.safetyBoundary.ownerApprovalRequired !==
          true ||
        report.safetyBoundary.tenantIsolationRequired !==
          true ||
        report.safetyBoundary.emergencyPauseRequired !==
          true ||
        report.safetyBoundary.externalDeliveryAuthorized !==
          false ||
        report.safetyBoundary.liveProviderExecutionAuthorized !==
          false ||
        report.safetyBoundary.paymentExecutionAuthorized !==
          false ||
        report.safetyBoundary.publicLaunchAuthorized !==
          false
      ) {
        throw new Error(
          "Autonomous Global Growth candidate formal qualification report is invalid.",
        );
      }

      if (
        summary.totalTestCases !==
          100 ||
        summary.passedTestCases !==
          100 ||
        summary.failedTestCases !==
          0 ||
        summary.qualificationEvidenceCount !==
          100 ||
        summary.assertionsExecuted !==
          1300 ||
        summary.assertionsPassed !==
          1300 ||
        summary.assertionsFailed !==
          0 ||
        summary.mandatoryCategoryCoveragePassed !==
          true ||
        summary.everyTestCasePassed !==
          true ||
        summary.ownerApprovalRecorded !==
          true ||
        summary.qualificationPassed !==
          true ||
        summary.normalOperationCases !==
          30 ||
        summary.adversarialCases !==
          15 ||
        summary.tenantIsolationCases !==
          15 ||
        summary.ownerControlCases !==
          15 ||
        summary.emergencyPauseCases !==
          5 ||
        summary.departmentHandoffCases !==
          10 ||
        summary.auditEvidenceCases !==
          5 ||
        summary.failureRecoveryCases !==
          5
      ) {
        throw new Error(
          "Autonomous Global Growth candidate formal qualification summary is invalid.",
        );
      }

      if (
        boundary.ownerApprovalBound !==
          true ||
        boundary.executionEvidenceBound !==
          true ||
        boundary.exactTemplateBound !==
          true ||
        boundary.qualificationEngineInvoked !==
          true ||
        boundary.qualificationReportCreated !==
          true ||
        boundary.formalQualificationIssued !==
          true ||
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
        boundary.productionDeploymentAuthorized !==
          false ||
        boundary.externalDeliveryAuthorized !==
          false ||
        boundary.liveProviderExecutionAuthorized !==
          false ||
        boundary.paymentExecutionAuthorized !==
          false ||
        boundary.autonomousDecisionAuthorized !==
          false ||
        boundary.publicLaunchAuthorized !==
          false
      ) {
        throw new Error(
          "Autonomous Global Growth candidate qualification authority boundary is invalid.",
        );
      }
    },
  );

  const summary =
    issuance.aggregateSummary;

  if (
    summary.formallyQualifiedCandidateCount !==
      9 ||
    summary.qualificationReportsCreated !==
      9 ||
    summary.qualificationCasesExecuted !==
      900 ||
    summary.qualificationCasesPassed !==
      900 ||
    summary.qualificationCasesFailed !==
      0 ||
    summary.qualificationEvidenceCount !==
      900 ||
    summary.assertionsExecuted !==
      11700 ||
    summary.assertionsPassed !==
      11700 ||
    summary.assertionsFailed !==
      0 ||
    summary.uniqueQualificationDigests !==
      9 ||
    summary.exactNineCandidatesQualified !==
      true ||
    summary.everyQualificationPassed !==
      true ||
    summary.independentEvaluatorEvidenceVerified !==
      true ||
    summary.ownerApprovalRecorded !==
      true
  ) {
    throw new Error(
      "Autonomous Global Growth formal qualification aggregate summary is invalid.",
    );
  }

  const boundary =
    issuance.authorityBoundary;

  if (
    boundary.canonicalTemplateRegistryBound !==
      true ||
    boundary.canonicalExecutionEvidenceBound !==
      true ||
    boundary.canonicalOwnerApprovalBound !==
      true ||
    boundary.exactNineCandidatesRequired !==
      true ||
    boundary.qualificationEngineInvocationAuthorized !==
      true ||
    boundary.qualificationEngineInvoked !==
      true ||
    boundary.qualificationReportCreated !==
      true ||
    boundary.formalQualificationIssued !==
      true ||
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
    issuance.nextStep !==
      "PREPARE_AUTONOMOUS_GLOBAL_GROWTH_QUALIFIED_EMPLOYEE_MANIFESTS"
  ) {
    throw new Error(
      "Autonomous Global Growth formal qualification issuance authority boundary is invalid.",
    );
  }

  if (
    Date.parse(issuance.qualifiedAt) <
    Date.parse(
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_REVIEW_APPROVAL_RECORD
        .reviewedAt,
    ) ||
    Date.parse(issuance.qualifiedAt) <
    Date.parse(
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE
        .executedAt,
    )
  ) {
    throw new Error(
      "Autonomous Global Growth formal qualification issuance cannot precede evidence or owner approval.",
    );
  }

  const {
    issuanceDigest,
    ...issuanceCore
  } = issuance;

  if (
    sha256(issuanceCore) !==
      issuanceDigest
  ) {
    throw new Error(
      "Autonomous Global Growth formal qualification issuance integrity is invalid.",
    );
  }

  if (
    !Object.isFrozen(issuance) ||
    !Object.isFrozen(
      issuance.candidateIssuances,
    ) ||
    issuance.candidateIssuances.some(
      (record) =>
        !Object.isFrozen(record) ||
        !Object.isFrozen(
          record.qualificationReport,
        ) ||
        !Object.isFrozen(
          record.reportSummary,
        ) ||
        !Object.isFrozen(
          record.authorityBoundary,
        ),
    ) ||
    !Object.isFrozen(
      issuance.aggregateSummary,
    ) ||
    !Object.isFrozen(
      issuance.authorityBoundary,
    )
  ) {
    throw new Error(
      "Autonomous Global Growth formal qualification issuance must remain immutable.",
    );
  }
}

export function issueAutonomousGlobalGrowthFormalQualification(
  input:
    IssueAutonomousGlobalGrowthFormalQualificationInput,
): AutonomousGlobalGrowthFormalQualificationIssuance {
  if (
    input.templateRegistry !==
      AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_REGISTRY
  ) {
    throw new Error(
      "Only the canonical Autonomous Global Growth template registry can be formally qualified.",
    );
  }

  if (
    input.executionEvidence !==
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE
  ) {
    throw new Error(
      "Only canonical Autonomous Global Growth formal qualification execution evidence can be issued.",
    );
  }

  if (
    input.approvalDecision !==
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_REVIEW_APPROVAL_RECORD
  ) {
    throw new Error(
      "Only the canonical Autonomous Global Growth owner approval decision can authorize formal qualification issuance.",
    );
  }

  validateAutonomousGlobalGrowthFormalQualificationExecutionEvidence(
    input.executionEvidence,
    AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_TEST_PLAN,
    AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_FIXTURE_PACK,
  );

  validateAutonomousGlobalGrowthFormalQualificationReviewDecision(
    input.approvalDecision,
  );

  requireIdentifier(
    "Autonomous Global Growth formal qualification issuance ID",
    input.issuanceId,
  );

  requireTimestamp(
    "Autonomous Global Growth formal qualification issuance time",
    input.qualifiedAt,
  );

  if (
    input.tenantId !==
      AUTONOMOUS_GLOBAL_GROWTH_INTERNAL_TENANT_ID ||
    input.tenantId !==
      input.executionEvidence.tenantId ||
    input.tenantId !==
      input.approvalDecision.tenantId
  ) {
    throw new Error(
      "Cross-tenant Autonomous Global Growth formal qualification issuance is blocked.",
    );
  }

  if (
    input.ownerId !==
      ENGINEERING_AI_WORKFORCE_OWNER_ID ||
    input.ownerId !==
      input.executionEvidence.ownerId ||
    input.ownerId !==
      input.approvalDecision.ownerId
  ) {
    throw new Error(
      "Only the verified evidence-bound NEXUS owner can issue Autonomous Global Growth formal qualifications.",
    );
  }

  if (
    input.approvalDecision.outcome !==
      "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION" ||
    input.approvalDecision
      .authorityBoundary
      .formalQualificationEngineInvocationAuthorized !==
        true ||
    input.approvalDecision
      .authorityBoundary
      .qualificationEngineInvoked !==
        false ||
    input.approvalDecision.nextStep !==
      "INVOKE_OWNER_APPROVED_AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_ENGINE"
  ) {
    throw new Error(
      "Autonomous Global Growth formal qualification issuance requires an approved unconsumed owner decision.",
    );
  }

  if (
    input.templateRegistry.templates.length !==
      9 ||
    input.executionEvidence
      .candidateEvidenceLedgers.length !==
        9 ||
    input.approvalDecision
      .candidateReviews.length !==
        9
  ) {
    throw new Error(
      "Autonomous Global Growth formal qualification issuance requires exactly eight bound candidates.",
    );
  }

  if (
    Date.parse(input.qualifiedAt) <
      Date.parse(
        input.approvalDecision.reviewedAt,
      ) ||
    Date.parse(input.qualifiedAt) <
      Date.parse(
        input.executionEvidence.executedAt,
      )
  ) {
    throw new Error(
      "Autonomous Global Growth formal qualification issuance cannot precede evidence or owner approval.",
    );
  }

  const candidateIssuances =
    input.templateRegistry.templates.map(
      (
        template,
        index,
      ) => {
        const evidence =
          input.executionEvidence
            .candidateEvidenceLedgers[index];

        const review =
          input.approvalDecision
            .candidateReviews[index];

        if (
          !evidence ||
          !review ||
          template.status !==
            "REGISTERED_UNQUALIFIED" ||
          template.controlledActivationEligible !==
            false ||
          template.employeeId !==
            evidence.employeeId ||
          template.employeeId !==
            review.employeeId ||
          template.employeeCode !==
            evidence.employeeCode ||
          template.employeeCode !==
            review.employeeCode ||
          template.publicName !==
            evidence.publicName ||
          template.publicName !==
            review.publicName ||
          template.officialRole !==
            evidence.officialRole ||
          template.officialRole !==
            review.officialRole ||
          template.templateId !==
            evidence.templateId ||
          template.templateId !==
            review.templateId ||
          template.templateDigest !==
            evidence.templateDigest ||
          template.templateDigest !==
            review.templateDigest ||
          evidence.summary
            .qualificationCasesExecuted !==
              100 ||
          evidence.summary
            .qualificationCasesPassed !==
              100 ||
          evidence.summary
            .qualificationCasesFailed !==
              0 ||
          evidence.summary
            .assertionsExecuted !==
              1300 ||
          evidence.summary
            .assertionsPassed !==
              1300 ||
          evidence.summary
            .assertionsFailed !==
              0 ||
          review.formalQualificationEngineInvocationAuthorized !==
            true ||
          review.qualificationEngineInvoked !==
            false ||
          review.formalQualificationIssued !==
            false
        ) {
          throw new Error(
            "Autonomous Global Growth candidate formal qualification source evidence is invalid.",
          );
        }

        const qualificationReport =
          createAIEmployeeQualificationReport({
            template,

            testCases:
              evidence.qualificationCases,

            ownerApproval: {
              ownerId:
                input.ownerId,

              approved:
                true,

              approvedAt:
                input.approvalDecision
                  .reviewedAt,
            },

            qualifiedAt:
              input.qualifiedAt,
          });

        const recordCore = {
          developmentSequence:
            index + 1,

          issuanceState:
            "AUTONOMOUS_GLOBAL_GROWTH_CANDIDATE_FORMAL_QUALIFICATION_ISSUED" as const,

          employeeId:
            template.employeeId,

          employeeCode:
            template.employeeCode,

          publicName:
            template.publicName,

          officialRole:
            template.officialRole,

          templateId:
            template.templateId,

          templateDigest:
            template.templateDigest,

          candidateEvidenceLedgerId:
            evidence.candidateLedgerId,

          candidateEvidenceLedgerDigest:
            evidence.candidateLedgerDigest,

          candidateReviewDigest:
            review.candidateReviewDigest,

          qualificationReport,

          qualificationDigest:
            qualificationReport
              .qualificationDigest,

          reportSummary: {
            totalTestCases:
              100 as const,

            passedTestCases:
              100 as const,

            failedTestCases:
              0 as const,

            qualificationEvidenceCount:
              100 as const,

            assertionsExecuted:
              1300 as const,

            assertionsPassed:
              1300 as const,

            assertionsFailed:
              0 as const,

            mandatoryCategoryCoveragePassed:
              true as const,

            everyTestCasePassed:
              true as const,

            ownerApprovalRecorded:
              true as const,

            qualificationPassed:
              true as const,

            normalOperationCases:
              30 as const,

            adversarialCases:
              15 as const,

            tenantIsolationCases:
              15 as const,

            ownerControlCases:
              15 as const,

            emergencyPauseCases:
              5 as const,

            departmentHandoffCases:
              10 as const,

            auditEvidenceCases:
              5 as const,

            failureRecoveryCases:
              5 as const,
          },

          authorityBoundary: {
            ownerApprovalBound:
              true as const,

            executionEvidenceBound:
              true as const,

            exactTemplateBound:
              true as const,

            qualificationEngineInvoked:
              true as const,

            qualificationReportCreated:
              true as const,

            formalQualificationIssued:
              true as const,

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

            productionDeploymentAuthorized:
              false as const,

            externalDeliveryAuthorized:
              false as const,

            liveProviderExecutionAuthorized:
              false as const,

            paymentExecutionAuthorized:
              false as const,

            autonomousDecisionAuthorized:
              false as const,

            publicLaunchAuthorized:
              false as const,
          },
        };

        return deepFreeze({
          ...recordCore,

          candidateIssuanceDigest:
            sha256(recordCore),
        });
      },
    );

  const issuanceCore = {
    version:
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_ISSUANCE_VERSION,

    issuanceId:
      input.issuanceId,

    issuanceState:
      "AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_ISSUED" as const,

    tenantId:
      input.tenantId,

    ownerId:
      input.ownerId,

    evaluatorId:
      input.executionEvidence.evaluatorId,

    sourceTemplateRegistryDigest:
      input.templateRegistry.registryDigest,

    sourcePlanningId:
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_TEST_PLAN
        .planningId,

    sourcePlanningDigest:
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_TEST_PLAN
        .planningDigest,

    sourceFixturePackId:
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_FIXTURE_PACK
        .fixturePackId,

    sourceFixturePackDigest:
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_FIXTURE_PACK
        .fixturePackDigest,

    sourceEvidenceLedgerId:
      input.executionEvidence.ledgerId,

    sourceEvidenceLedgerDigest:
      input.executionEvidence.ledgerDigest,

    sourceApprovalDecisionId:
      input.approvalDecision.decisionId,

    sourceApprovalDecisionDigest:
      input.approvalDecision.decisionDigest,

    candidateIssuanceCount:
      9 as const,

    candidateIssuances,

    aggregateSummary: {
      formallyQualifiedCandidateCount:
        9 as const,

      qualificationReportsCreated:
        9 as const,

      qualificationCasesExecuted:
        900 as const,

      qualificationCasesPassed:
        900 as const,

      qualificationCasesFailed:
        0 as const,

      qualificationEvidenceCount:
        900 as const,

      assertionsExecuted:
        11700 as const,

      assertionsPassed:
        11700 as const,

      assertionsFailed:
        0 as const,

      uniqueQualificationDigests:
        9 as const,

      exactNineCandidatesQualified:
        true as const,

      everyQualificationPassed:
        true as const,

      independentEvaluatorEvidenceVerified:
        true as const,

      ownerApprovalRecorded:
        true as const,
    },

    nextStep:
      "PREPARE_AUTONOMOUS_GLOBAL_GROWTH_QUALIFIED_EMPLOYEE_MANIFESTS" as const,

    authorityBoundary: {
      canonicalTemplateRegistryBound:
        true as const,

      canonicalExecutionEvidenceBound:
        true as const,

      canonicalOwnerApprovalBound:
        true as const,

      exactNineCandidatesRequired:
        true as const,

      qualificationEngineInvocationAuthorized:
        true as const,

      qualificationEngineInvoked:
        true as const,

      qualificationReportCreated:
        true as const,

      formalQualificationIssued:
        true as const,

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

    qualifiedAt:
      input.qualifiedAt,
  };

  const issuance =
    deepFreeze({
      ...issuanceCore,

      issuanceDigest:
        sha256(issuanceCore),
    }) as AutonomousGlobalGrowthFormalQualificationIssuance;

  validateAutonomousGlobalGrowthFormalQualificationIssuance(
    issuance,
  );

  return issuance;
}

export const AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_ISSUANCE =
  issueAutonomousGlobalGrowthFormalQualification({
    issuanceId:
      "autonomous-global-growth-formal-qualification-issuance-001",

    templateRegistry:
      AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_REGISTRY,

    executionEvidence:
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE,

    approvalDecision:
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_REVIEW_APPROVAL_RECORD,

    tenantId:
      AUTONOMOUS_GLOBAL_GROWTH_INTERNAL_TENANT_ID,

    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,

    qualifiedAt:
      "2026-08-08T05:04:28.081Z",
  });
