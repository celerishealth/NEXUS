import {
  createHash,
} from "node:crypto";

import {
  ASHA_OWNER_QUALIFICATION_REVIEW_DECISION_VERSION,
  type AshaOwnerQualificationReviewDecision,
} from "./ashaOwnerQualificationReviewDecision";

import {
  AI_EMPLOYEE_QUALIFICATION_CATEGORIES,
  AI_EMPLOYEE_QUALIFICATION_MINIMUMS,
  type AIEmployeeQualificationCategory,
} from "./employeeQualification";

export const ASHA_QUALIFICATION_TESTING_ADMISSION_VERSION =
  "nexus-asha-qualification-testing-admission-v1" as const;

export interface CreateAshaQualificationTestingAdmissionInput {
  readonly admissionId: string;
  readonly decision:
    AshaOwnerQualificationReviewDecision;
  readonly employeeId: string;
  readonly templateId: string;
  readonly tenantId: string;
  readonly ownerId: string;
  readonly preparedAt: string;
}

export interface AshaQualificationCategoryRequirement {
  readonly category:
    AIEmployeeQualificationCategory;
  readonly minimumPassingCases: number;
}

export interface AshaQualificationTestingAdmission {
  readonly version:
    typeof ASHA_QUALIFICATION_TESTING_ADMISSION_VERSION;
  readonly admissionId: string;
  readonly admissionState:
    "ADMITTED_FOR_CONTROLLED_QUALIFICATION_TEST_PREPARATION";
  readonly employeeId: string;
  readonly templateId: string;
  readonly tenantId: string;
  readonly ownerId: string;
  readonly evaluatorId: string;
  readonly decisionId: string;
  readonly decisionDigest: string;
  readonly readinessId: string;
  readonly readinessDigest: string;
  readonly categoryRequirements:
    readonly AshaQualificationCategoryRequirement[];
  readonly testingPolicy: Readonly<{
    baselineMinimumTestCases: 100;
    maximumTestCases: 1000;
    templateEvaluationMinimumMustAlsoBeSatisfied: true;
    everyTestCaseMustPass: true;
    uniqueCaseIdsRequired: true;
    uniqueEvidenceDigestsRequired: true;
    executedEvidenceRequired: true;
    mandatoryCategoryCoverageRequired: true;
    failedTestCaseFailsQualification: true;
  }>;
  readonly nextStep:
    "BIND_REGISTERED_UNQUALIFIED_TEMPLATE_AND_PREPARE_QUALIFICATION_CASES";
  readonly authorityBoundary: Readonly<{
    ownerApprovalBound: true;
    readinessEvidenceBound: true;
    qualificationTestingAdmissionAuthorized: true;
    qualificationTestPreparationAuthorized: true;
    templateRecordBindingStillRequired: true;
    qualificationCasesStillRequired: true;
    qualificationTestingExecuted: false;
    qualificationEngineInvoked: false;
    qualificationReportCreated: false;
    formalQualificationIssued: false;
    qualifiedManifestCreated: false;
    activationCandidateCreated: false;
    runtimeActivated: false;
    shadowEvidenceAcceptedAsQualificationEvidence: false;
    customerDataAccessAuthorized: false;
    customerContactAuthorized: false;
    externalDeliveryAuthorized: false;
    liveProviderExecutionAuthorized: false;
    productionMutationAuthorized: false;
    paymentExecutionAuthorized: false;
    autonomousDecisionAuthorized: false;
    productionReadinessAuthorized: false;
    publicLaunchAuthorized: false;
  }>;
  readonly preparedAt: string;
  readonly admissionDigest: string;
}

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9:_-]{2,95}$/;

const SHA_256_PATTERN =
  /^[0-9a-f]{64}$/;

function stableStringify(
  value: unknown,
): string {
  if (Array.isArray(value)) {
    return (
      "[" +
      value
        .map(
          (item) =>
            stableStringify(item),
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
            JSON.stringify(key) +
            ":" +
            stableStringify(
              record[key],
            ),
        )
        .join(",") +
      "}"
    );
  }

  const primitive =
    JSON.stringify(value);

  if (primitive === undefined) {
    throw new Error(
      "Unsupported deterministic qualification-testing admission value.",
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
): Readonly<T> {
  if (
    value !== null &&
    typeof value === "object" &&
    !Object.isFrozen(value)
  ) {
    for (
      const propertyName of
      Object.getOwnPropertyNames(value)
    ) {
      const child =
        (
          value as unknown as
            Record<string, unknown>
        )[propertyName];

      if (
        child !== null &&
        typeof child === "object"
      ) {
        deepFreeze(child);
      }
    }

    Object.freeze(value);
  }

  return value as Readonly<T>;
}

function requireIdentifier(
  label: string,
  value: string,
): void {
  if (
    typeof value !== "string" ||
    !SAFE_IDENTIFIER_PATTERN.test(value)
  ) {
    throw new Error(
      label +
        " must be a safe identifier.",
    );
  }
}

function requireSha256(
  label: string,
  value: string,
): void {
  if (
    typeof value !== "string" ||
    !SHA_256_PATTERN.test(value)
  ) {
    throw new Error(
      label +
        " must be a SHA-256 digest.",
    );
  }
}

function requireIsoDate(
  label: string,
  value: string,
): void {
  if (
    typeof value !== "string" ||
    Number.isNaN(Date.parse(value))
  ) {
    throw new Error(
      label +
        " must be a valid ISO timestamp.",
    );
  }
}

function requireText(
  label: string,
  value: string,
): void {
  if (
    typeof value !== "string" ||
    value.trim().length < 12 ||
    value.trim().length > 1000
  ) {
    throw new Error(
      label +
        " must contain between 12 and 1000 characters.",
    );
  }
}

function validateOwnerDecision(
  decision:
    AshaOwnerQualificationReviewDecision,
): void {
  if (
    decision.version !==
      ASHA_OWNER_QUALIFICATION_REVIEW_DECISION_VERSION
  ) {
    throw new Error(
      "Qualification-review decision version is invalid.",
    );
  }

  requireIdentifier(
    "decisionId",
    decision.decisionId,
  );

  requireIdentifier(
    "readinessId",
    decision.readinessId,
  );

  requireIdentifier(
    "employeeId",
    decision.employeeId,
  );

  requireIdentifier(
    "templateId",
    decision.templateId,
  );

  requireIdentifier(
    "tenantId",
    decision.tenantId,
  );

  requireIdentifier(
    "ownerId",
    decision.ownerId,
  );

  requireIdentifier(
    "evaluatorId",
    decision.evaluatorId,
  );

  requireSha256(
    "readiness digest",
    decision.readinessDigest,
  );

  requireSha256(
    "decision digest",
    decision.decisionDigest,
  );

  requireIsoDate(
    "qualification-review decision time",
    decision.decidedAt,
  );

  requireText(
    "qualification-review decision reason",
    decision.reason,
  );

  if (
    decision.decision !==
      "APPROVE_FORMAL_QUALIFICATION_TESTING" &&
    decision.decision !==
      "REJECT_FORMAL_QUALIFICATION_TESTING"
  ) {
    throw new Error(
      "Qualification-review decision value is invalid.",
    );
  }

  const approved =
    decision.decision ===
    "APPROVE_FORMAL_QUALIFICATION_TESTING";

  if (
    decision.ownerApprovedForQualificationTesting !==
      approved ||
    decision.qualificationTestingAdmissionEligible !==
      approved
  ) {
    throw new Error(
      "Qualification-review decision approval state is inconsistent.",
    );
  }

  if (
    decision.authorityBoundary
      .ownerDecisionRequired !== true ||
    decision.authorityBoundary
      .ownerIdentityBound !== true ||
    decision.authorityBoundary
      .readinessDigestBound !== true ||
    decision.authorityBoundary
      .approvalBypassAllowed !== false ||
    decision.authorityBoundary
      .qualificationTestingExecuted !== false ||
    decision.authorityBoundary
      .qualificationEngineInvoked !== false ||
    decision.authorityBoundary
      .formalQualificationIssued !== false ||
    decision.authorityBoundary
      .qualifiedManifestCreated !== false ||
    decision.authorityBoundary
      .activationCandidateCreated !== false ||
    decision.authorityBoundary
      .runtimeActivated !== false ||
    decision.authorityBoundary
      .productionReadinessAuthorized !== false ||
    decision.authorityBoundary
      .customerDataAccessAuthorized !== false ||
    decision.authorityBoundary
      .customerContactAuthorized !== false ||
    decision.authorityBoundary
      .externalDeliveryAuthorized !== false ||
    decision.authorityBoundary
      .liveProviderExecutionAuthorized !== false ||
    decision.authorityBoundary
      .productionMutationAuthorized !== false ||
    decision.authorityBoundary
      .paymentExecutionAuthorized !== false ||
    decision.authorityBoundary
      .autonomousDecisionAuthorized !== false ||
    decision.authorityBoundary
      .publicLaunchAuthorized !== false
  ) {
    throw new Error(
      "Qualification-review decision exceeds its authority boundary.",
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
      "Qualification-review decision digest is invalid.",
    );
  }
}

export function createAshaQualificationTestingAdmission(
  input:
    CreateAshaQualificationTestingAdmissionInput,
): AshaQualificationTestingAdmission {
  validateOwnerDecision(
    input.decision,
  );

  requireIdentifier(
    "qualification-testing admissionId",
    input.admissionId,
  );

  requireIdentifier(
    "qualification-testing employeeId",
    input.employeeId,
  );

  requireIdentifier(
    "qualification-testing templateId",
    input.templateId,
  );

  requireIdentifier(
    "qualification-testing tenantId",
    input.tenantId,
  );

  requireIdentifier(
    "qualification-testing ownerId",
    input.ownerId,
  );

  requireIsoDate(
    "qualification-testing preparation time",
    input.preparedAt,
  );

  if (
    input.decision.employeeId !==
      input.employeeId ||
    input.decision.templateId !==
      input.templateId
  ) {
    throw new Error(
      "Qualification-testing employee or template identity does not match the owner decision.",
    );
  }

  if (
    input.decision.tenantId !==
      input.tenantId
  ) {
    throw new Error(
      "Cross-tenant qualification-testing admission is blocked.",
    );
  }

  if (
    input.decision.ownerId !==
      input.ownerId
  ) {
    throw new Error(
      "Only the decision-bound owner can create qualification-testing admission.",
    );
  }

  if (
    input.decision.decision !==
      "APPROVE_FORMAL_QUALIFICATION_TESTING" ||
    input.decision
      .ownerApprovedForQualificationTesting !== true ||
    input.decision
      .qualificationTestingAdmissionEligible !== true
  ) {
    throw new Error(
      "Rejected qualification-review decision cannot create qualification-testing admission.",
    );
  }

  if (
    Date.parse(input.preparedAt) <
    Date.parse(input.decision.decidedAt)
  ) {
    throw new Error(
      "Qualification-testing admission cannot precede owner approval.",
    );
  }

  const categoryRequirements =
    AI_EMPLOYEE_QUALIFICATION_CATEGORIES.map(
      (
        category,
      ): AshaQualificationCategoryRequirement => ({
        category,
        minimumPassingCases:
          AI_EMPLOYEE_QUALIFICATION_MINIMUMS[
            category
          ],
      }),
    );

  const categoryMinimumTotal =
    categoryRequirements.reduce(
      (
        total,
        requirement,
      ) =>
        total +
        requirement.minimumPassingCases,
      0,
    );

  if (
    categoryRequirements.length !== 8 ||
    categoryMinimumTotal !== 100
  ) {
    throw new Error(
      "Qualification category baseline must contain eight categories and 100 passing cases.",
    );
  }

  const admissionCore = {
    version:
      ASHA_QUALIFICATION_TESTING_ADMISSION_VERSION,
    admissionId:
      input.admissionId,
    admissionState:
      "ADMITTED_FOR_CONTROLLED_QUALIFICATION_TEST_PREPARATION" as const,
    employeeId:
      input.employeeId,
    templateId:
      input.templateId,
    tenantId:
      input.tenantId,
    ownerId:
      input.ownerId,
    evaluatorId:
      input.decision.evaluatorId,
    decisionId:
      input.decision.decisionId,
    decisionDigest:
      input.decision.decisionDigest,
    readinessId:
      input.decision.readinessId,
    readinessDigest:
      input.decision.readinessDigest,
    categoryRequirements,
    testingPolicy: {
      baselineMinimumTestCases:
        100 as const,
      maximumTestCases:
        1000 as const,
      templateEvaluationMinimumMustAlsoBeSatisfied:
        true,
      everyTestCaseMustPass:
        true,
      uniqueCaseIdsRequired:
        true,
      uniqueEvidenceDigestsRequired:
        true,
      executedEvidenceRequired:
        true,
      mandatoryCategoryCoverageRequired:
        true,
      failedTestCaseFailsQualification:
        true,
    } as const,
    nextStep:
      "BIND_REGISTERED_UNQUALIFIED_TEMPLATE_AND_PREPARE_QUALIFICATION_CASES" as const,
    authorityBoundary: {
      ownerApprovalBound:
        true,
      readinessEvidenceBound:
        true,
      qualificationTestingAdmissionAuthorized:
        true,
      qualificationTestPreparationAuthorized:
        true,
      templateRecordBindingStillRequired:
        true,
      qualificationCasesStillRequired:
        true,
      qualificationTestingExecuted:
        false,
      qualificationEngineInvoked:
        false,
      qualificationReportCreated:
        false,
      formalQualificationIssued:
        false,
      qualifiedManifestCreated:
        false,
      activationCandidateCreated:
        false,
      runtimeActivated:
        false,
      shadowEvidenceAcceptedAsQualificationEvidence:
        false,
      customerDataAccessAuthorized:
        false,
      customerContactAuthorized:
        false,
      externalDeliveryAuthorized:
        false,
      liveProviderExecutionAuthorized:
        false,
      productionMutationAuthorized:
        false,
      paymentExecutionAuthorized:
        false,
      autonomousDecisionAuthorized:
        false,
      productionReadinessAuthorized:
        false,
      publicLaunchAuthorized:
        false,
    } as const,
    preparedAt:
      input.preparedAt,
  };

  const admission:
    AshaQualificationTestingAdmission = {
      ...admissionCore,
      admissionDigest:
        sha256(admissionCore),
  };

  return deepFreeze(
    admission,
  ) as AshaQualificationTestingAdmission;
}