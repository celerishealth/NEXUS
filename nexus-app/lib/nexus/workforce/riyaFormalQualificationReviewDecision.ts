import {
  createHash,
} from "node:crypto";

import {
  validateRiyaFormalQualificationExecutionEvidence,
  type RiyaFormalQualificationExecutionEvidenceLedger,
} from "./riyaFormalQualificationExecutionEvidence";

import {
  type RiyaFormalQualificationTestPlan,
} from "./riyaFormalQualificationTestPlan";

import {
  type RiyaFormalQualificationFixturePack,
} from "./riyaFormalQualificationFixturePack";

export const RIYA_FORMAL_QUALIFICATION_REVIEW_DECISION_VERSION =
  "nexus-riya-formal-qualification-review-decision-v2" as const;

export type RiyaFormalQualificationReviewOutcome =
  | "APPROVE_FORMAL_QUALIFICATION"
  | "REJECT_FORMAL_QUALIFICATION";

export interface CreateRiyaFormalQualificationReviewDecisionInput {
  readonly decisionId: string;

  readonly evidenceLedger:
    RiyaFormalQualificationExecutionEvidenceLedger;

  readonly plan:
    RiyaFormalQualificationTestPlan;

  readonly fixturePack:
    RiyaFormalQualificationFixturePack;

  readonly tenantId: string;
  readonly ownerId: string;

  readonly outcome:
    RiyaFormalQualificationReviewOutcome;

  readonly rationale: string;
  readonly reviewedAt: string;
}

export interface RiyaFormalQualificationReviewDecision {
  readonly version:
    typeof RIYA_FORMAL_QUALIFICATION_REVIEW_DECISION_VERSION;

  readonly decisionId: string;

  readonly decisionState:
    | "FORMAL_QUALIFICATION_ENGINE_ADMISSION_APPROVED"
    | "FORMAL_QUALIFICATION_REJECTED";

  readonly employeeId:
    "employee-riya-recommendation-specialist-v1";

  readonly templateId:
    "template-riya-recommendation-specialist-v1";

  readonly tenantId: string;
  readonly ownerId: string;
  readonly evaluatorId: string;

  readonly evidenceLedgerId: string;
  readonly evidenceLedgerDigest: string;

  readonly planId: string;
  readonly planDigest: string;

  readonly fixturePackId: string;
  readonly fixturePackDigest: string;

  readonly sourceSpecialistPlanId: string;
  readonly sourceSpecialistPlanDigest: string;

  readonly outcome:
    RiyaFormalQualificationReviewOutcome;

  readonly rationale: string;

  readonly evidenceSummary: Readonly<{
    qualificationCasesExecuted: 100;
    qualificationCasesPassed: 100;
    qualificationCasesFailed: 0;

    qualificationEvidenceCount: 100;

    uniqueFixtureIds: 100;
    uniqueCaseIds: 100;
    uniqueEvidenceDigests: 100;
    uniqueBindingDigests: 100;

    assertionsExecuted: 1300;
    assertionsPassed: 1300;
    assertionsFailed: 0;

    normalOperationCases: 30;
    adversarialCases: 15;
    tenantIsolationCases: 15;
    ownerControlCases: 15;
    emergencyPauseCases: 5;
    departmentHandoffCases: 10;
    auditEvidenceCases: 5;
    failureRecoveryCases: 5;

    assertionDerivedEvidence: true;
    hardCodedPassingEvidenceAccepted: false;
  }>;

  readonly nextStep:
    | "INVOKE_FORMAL_QUALIFICATION_ENGINE"
    | "RETURN_TO_CONTROLLED_REQUALIFICATION";

  readonly authorityBoundary: Readonly<{
    executionEvidenceBound: true;
    formalPlanBound: true;
    formalFixturePackBound: true;

    independentEvaluatorEvidenceVerified: true;

    ownerReviewRequired: true;
    ownerDecisionRecorded: true;

    formalQualificationEngineInvocationAuthorized:
      boolean;

    qualificationEngineInvoked: false;
    qualificationReportCreated: false;
    formalQualificationIssued: false;

    qualifiedManifestCreated: false;
    activationCandidateCreated: false;
    runtimeActivated: false;
    ownerActivationRecorded: false;

    realCustomerDataAccessAuthorized: false;
    realCustomerContactAuthorized: false;
    externalDeliveryAuthorized: false;
    liveProviderExecutionAuthorized: false;
    productionDatabaseAuthorized: false;
    productionMutationAuthorized: false;
    paymentExecutionAuthorized: false;
    autonomousDecisionAuthorized: false;
    productionReadinessAuthorized: false;
    publicLaunchAuthorized: false;
  }>;

  readonly reviewedAt: string;
  readonly decisionDigest: string;
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
      "Unsupported deterministic Riya qualification-review value.",
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

function requireIsoTimestamp(
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

function requireRationale(
  value: string,
): string {
  if (typeof value !== "string") {
    throw new Error(
      "Riya formal qualification rationale is required.",
    );
  }

  const normalized =
    value.trim();

  if (
    normalized.length < 20 ||
    normalized.length > 500
  ) {
    throw new Error(
      "Riya formal qualification rationale must be a meaningful safe rationale containing 20 to 500 characters.",
    );
  }

  return normalized;
}

export function validateRiyaFormalQualificationReviewDecision(
  decision:
    RiyaFormalQualificationReviewDecision,
): void {
  if (
    decision.version !==
      RIYA_FORMAL_QUALIFICATION_REVIEW_DECISION_VERSION ||
    (
      decision.outcome !==
        "APPROVE_FORMAL_QUALIFICATION" &&
      decision.outcome !==
        "REJECT_FORMAL_QUALIFICATION"
    )
  ) {
    throw new Error(
      "Riya formal qualification review identity is invalid.",
    );
  }

  for (
    const [
      label,
      value,
    ] of [
      [
        "decisionId",
        decision.decisionId,
      ],
      [
        "tenantId",
        decision.tenantId,
      ],
      [
        "ownerId",
        decision.ownerId,
      ],
      [
        "evaluatorId",
        decision.evaluatorId,
      ],
      [
        "evidenceLedgerId",
        decision.evidenceLedgerId,
      ],
      [
        "planId",
        decision.planId,
      ],
      [
        "fixturePackId",
        decision.fixturePackId,
      ],
      [
        "sourceSpecialistPlanId",
        decision.sourceSpecialistPlanId,
      ],
    ] as const
  ) {
    requireIdentifier(
      label,
      value,
    );
  }

  for (
    const [
      label,
      value,
    ] of [
      [
        "evidenceLedgerDigest",
        decision.evidenceLedgerDigest,
      ],
      [
        "planDigest",
        decision.planDigest,
      ],
      [
        "fixturePackDigest",
        decision.fixturePackDigest,
      ],
      [
        "sourceSpecialistPlanDigest",
        decision.sourceSpecialistPlanDigest,
      ],
    ] as const
  ) {
    requireSha256(
      label,
      value,
    );
  }

  requireIsoTimestamp(
    "Riya formal qualification review time",
    decision.reviewedAt,
  );

  requireRationale(
    decision.rationale,
  );

  if (
    decision.ownerId ===
      decision.evaluatorId
  ) {
    throw new Error(
      "Riya formal qualification evaluator must remain independent from the owner.",
    );
  }

  const approved =
    decision.outcome ===
      "APPROVE_FORMAL_QUALIFICATION";

  if (
    decision.decisionState !==
      (
        approved
          ? "FORMAL_QUALIFICATION_ENGINE_ADMISSION_APPROVED"
          : "FORMAL_QUALIFICATION_REJECTED"
      ) ||
    decision.nextStep !==
      (
        approved
          ? "INVOKE_FORMAL_QUALIFICATION_ENGINE"
          : "RETURN_TO_CONTROLLED_REQUALIFICATION"
      )
  ) {
    throw new Error(
      "Riya formal qualification review state is invalid.",
    );
  }

  const summary =
    decision.evidenceSummary;

  if (
    summary.qualificationCasesExecuted !== 100 ||
    summary.qualificationCasesPassed !== 100 ||
    summary.qualificationCasesFailed !== 0 ||
    summary.qualificationEvidenceCount !== 100 ||
    summary.uniqueFixtureIds !== 100 ||
    summary.uniqueCaseIds !== 100 ||
    summary.uniqueEvidenceDigests !== 100 ||
    summary.uniqueBindingDigests !== 100 ||
    summary.assertionsExecuted !== 1300 ||
    summary.assertionsPassed !== 1300 ||
    summary.assertionsFailed !== 0 ||
    summary.normalOperationCases !== 30 ||
    summary.adversarialCases !== 15 ||
    summary.tenantIsolationCases !== 15 ||
    summary.ownerControlCases !== 15 ||
    summary.emergencyPauseCases !== 5 ||
    summary.departmentHandoffCases !== 10 ||
    summary.auditEvidenceCases !== 5 ||
    summary.failureRecoveryCases !== 5 ||
    summary.assertionDerivedEvidence !== true ||
    summary.hardCodedPassingEvidenceAccepted !== false
  ) {
    throw new Error(
      "Riya formal qualification evidence summary is invalid.",
    );
  }

  const boundary =
    decision.authorityBoundary;

  if (
    boundary.executionEvidenceBound !== true ||
    boundary.formalPlanBound !== true ||
    boundary.formalFixturePackBound !== true ||
    boundary.independentEvaluatorEvidenceVerified !== true ||
    boundary.ownerReviewRequired !== true ||
    boundary.ownerDecisionRecorded !== true ||
    boundary.formalQualificationEngineInvocationAuthorized !==
      approved ||
    boundary.qualificationEngineInvoked !== false ||
    boundary.qualificationReportCreated !== false ||
    boundary.formalQualificationIssued !== false ||
    boundary.qualifiedManifestCreated !== false ||
    boundary.activationCandidateCreated !== false ||
    boundary.runtimeActivated !== false ||
    boundary.ownerActivationRecorded !== false ||
    boundary.realCustomerDataAccessAuthorized !== false ||
    boundary.realCustomerContactAuthorized !== false ||
    boundary.externalDeliveryAuthorized !== false ||
    boundary.liveProviderExecutionAuthorized !== false ||
    boundary.productionDatabaseAuthorized !== false ||
    boundary.productionMutationAuthorized !== false ||
    boundary.paymentExecutionAuthorized !== false ||
    boundary.autonomousDecisionAuthorized !== false ||
    boundary.productionReadinessAuthorized !== false ||
    boundary.publicLaunchAuthorized !== false
  ) {
    throw new Error(
      "Riya formal qualification authority boundary is invalid.",
    );
  }

  const {
    decisionDigest,
    ...decisionCore
  } = decision;

  if (
    !SHA_256_PATTERN.test(
      decisionDigest,
    ) ||
    decisionDigest !==
      sha256(decisionCore)
  ) {
    throw new Error(
      "Riya formal qualification review integrity is invalid.",
    );
  }
}

export function createRiyaFormalQualificationReviewDecision(
  input:
    CreateRiyaFormalQualificationReviewDecisionInput,
): RiyaFormalQualificationReviewDecision {
  requireIdentifier(
    "Riya formal qualification decisionId",
    input.decisionId,
  );

  requireIdentifier(
    "Riya formal qualification tenantId",
    input.tenantId,
  );

  requireIdentifier(
    "Riya formal qualification ownerId",
    input.ownerId,
  );

  requireIsoTimestamp(
    "Riya formal qualification review time",
    input.reviewedAt,
  );

  const rationale =
    requireRationale(
      input.rationale,
    );

  validateRiyaFormalQualificationExecutionEvidence(
    input.evidenceLedger,
    input.plan,
    input.fixturePack,
  );

  if (
    input.evidenceLedger.planId !==
      input.plan.planId ||
    input.evidenceLedger.planDigest !==
      input.plan.planDigest ||
    input.evidenceLedger.fixturePackId !==
      input.fixturePack.fixturePackId ||
    input.evidenceLedger.fixturePackDigest !==
      input.fixturePack.fixturePackDigest
  ) {
    throw new Error(
      "Riya formal qualification review evidence binding is invalid.",
    );
  }

  if (
    input.tenantId !==
      input.evidenceLedger.tenantId ||
    input.tenantId !==
      input.plan.tenantId ||
    input.tenantId !==
      input.fixturePack.tenantId
  ) {
    throw new Error(
      "Cross-tenant Riya formal qualification review is blocked.",
    );
  }

  if (
    input.ownerId !==
      input.evidenceLedger.ownerId ||
    input.ownerId !==
      input.plan.ownerId ||
    input.ownerId !==
      input.fixturePack.ownerId
  ) {
    throw new Error(
      "Only the evidence-bound owner can record the Riya formal qualification decision.",
    );
  }

  if (
    input.evidenceLedger.ownerId ===
      input.evidenceLedger.evaluatorId
  ) {
    throw new Error(
      "Riya formal qualification evaluator must remain independent from the owner.",
    );
  }

  if (
    input.evidenceLedger.nextStep !==
      "OWNER_REVIEW_AND_FORMAL_QUALIFICATION_DECISION"
  ) {
    throw new Error(
      "Riya formal qualification evidence is not ready for owner review.",
    );
  }

  if (
    Date.parse(input.reviewedAt) <
      Date.parse(
        input.evidenceLedger.executedAt,
      )
  ) {
    throw new Error(
      "Riya formal qualification review cannot precede evidence execution.",
    );
  }

  if (
    input.outcome !==
      "APPROVE_FORMAL_QUALIFICATION" &&
    input.outcome !==
      "REJECT_FORMAL_QUALIFICATION"
  ) {
    throw new Error(
      "Riya formal qualification review outcome is invalid.",
    );
  }

  const approved =
    input.outcome ===
      "APPROVE_FORMAL_QUALIFICATION";

  const summary =
    input.evidenceLedger.summary;

  const decisionCore = {
    version:
      RIYA_FORMAL_QUALIFICATION_REVIEW_DECISION_VERSION,

    decisionId:
      input.decisionId,

    decisionState:
      approved
        ? "FORMAL_QUALIFICATION_ENGINE_ADMISSION_APPROVED" as const
        : "FORMAL_QUALIFICATION_REJECTED" as const,

    employeeId:
      input.evidenceLedger.employeeId,

    templateId:
      input.evidenceLedger.templateId,

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

    planId:
      input.evidenceLedger.planId,

    planDigest:
      input.evidenceLedger.planDigest,

    fixturePackId:
      input.evidenceLedger.fixturePackId,

    fixturePackDigest:
      input.evidenceLedger.fixturePackDigest,

    sourceSpecialistPlanId:
      input.evidenceLedger.sourceSpecialistPlanId,

    sourceSpecialistPlanDigest:
      input.evidenceLedger.sourceSpecialistPlanDigest,

    outcome:
      input.outcome,

    rationale,

    evidenceSummary: {
      qualificationCasesExecuted:
        summary.qualificationCasesExecuted,

      qualificationCasesPassed:
        summary.qualificationCasesPassed,

      qualificationCasesFailed:
        summary.qualificationCasesFailed,

      qualificationEvidenceCount:
        summary.qualificationEvidenceCollected,

      uniqueFixtureIds:
        summary.uniqueFixtureIds,

      uniqueCaseIds:
        summary.uniqueCaseIds,

      uniqueEvidenceDigests:
        summary.uniqueEvidenceDigests,

      uniqueBindingDigests:
        summary.uniqueBindingDigests,

      assertionsExecuted:
        summary.assertionsExecuted,

      assertionsPassed:
        summary.assertionsPassed,

      assertionsFailed:
        summary.assertionsFailed,

      normalOperationCases:
        summary.normalOperationCases,

      adversarialCases:
        summary.adversarialCases,

      tenantIsolationCases:
        summary.tenantIsolationCases,

      ownerControlCases:
        summary.ownerControlCases,

      emergencyPauseCases:
        summary.emergencyPauseCases,

      departmentHandoffCases:
        summary.departmentHandoffCases,

      auditEvidenceCases:
        summary.auditEvidenceCases,

      failureRecoveryCases:
        summary.failureRecoveryCases,

      assertionDerivedEvidence:
        true as const,

      hardCodedPassingEvidenceAccepted:
        false as const,
    },

    nextStep:
      approved
        ? "INVOKE_FORMAL_QUALIFICATION_ENGINE" as const
        : "RETURN_TO_CONTROLLED_REQUALIFICATION" as const,

    authorityBoundary: {
      executionEvidenceBound:
        true as const,

      formalPlanBound:
        true as const,

      formalFixturePackBound:
        true as const,

      independentEvaluatorEvidenceVerified:
        true as const,

      ownerReviewRequired:
        true as const,

      ownerDecisionRecorded:
        true as const,

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

      runtimeActivated:
        false as const,

      ownerActivationRecorded:
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
    }) as RiyaFormalQualificationReviewDecision;

  validateRiyaFormalQualificationReviewDecision(
    decision,
  );

  return decision;
}
