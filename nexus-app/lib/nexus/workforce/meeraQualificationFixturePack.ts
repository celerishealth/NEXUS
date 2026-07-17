import {
  createHash,
} from "node:crypto";

import {
  MEERA_QUOTATION_PROPOSAL_SPECIALIST_QUALIFICATION_CASES,
} from "./meeraQuotationProposalSpecialistQualificationStandard";

import {
  validateMeeraQualificationTestPlan,
  type MeeraQualificationTestPlan,
} from "./meeraQualificationTestPlan";

export const MEERA_QUALIFICATION_FIXTURE_PACK_VERSION =
  "nexus-meera-qualification-fixture-pack-v1" as const;

export type MeeraQualificationExpectedControl =
  | "ALLOW_SAFE_QUOTATION_PROPOSAL_DRAFT"
  | "BLOCK_AND_ESCALATE_TO_OWNER";

export interface CreateMeeraQualificationFixturePackInput {
  readonly fixturePackId: string;

  readonly plan:
    MeeraQualificationTestPlan;

  readonly tenantId: string;
  readonly ownerId: string;

  readonly preparedAt: string;
}

export interface MeeraQualificationCaseFixture {
  readonly sequence: number;

  readonly fixtureId: string;
  readonly caseId: string;
  readonly competencyId: string;

  readonly scenario: string;
  readonly expectedEvidence: string;

  readonly expectedControl:
    MeeraQualificationExpectedControl;

  readonly executionMode:
    "SANDBOX_ONLY";

  readonly syntheticOnly:
    true;

  readonly realCustomerDataIncluded:
    false;

  readonly externalEffectAllowed:
    false;

  readonly evidenceRequired:
    true;
}

export interface MeeraQualificationFixturePack {
  readonly version:
    typeof MEERA_QUALIFICATION_FIXTURE_PACK_VERSION;

  readonly fixturePackId: string;

  readonly fixturePackState:
    "QUALIFICATION_FIXTURE_PACK_PREPARED";

  readonly employeeId:
    "employee-meera-quotation-proposal-specialist-v1";

  readonly templateId:
    "template-meera-quotation-proposal-specialist-v1";

  readonly tenantId: string;
  readonly ownerId: string;

  readonly planId: string;
  readonly planDigest: string;

  readonly admissionId: string;
  readonly admissionDigest: string;

  readonly decisionId: string;
  readonly decisionDigest: string;

  readonly readinessAssessmentId: string;
  readonly readinessDigest: string;

  readonly fixtures:
    readonly MeeraQualificationCaseFixture[];

  readonly totalFixtures:
    12;

  readonly preparedAt: string;

  readonly fixturePolicy: Readonly<{
    canonicalCaseBindingRequired: true;
    sandboxOnly: true;
    syntheticDataOnly: true;
    realCustomerDataBlocked: true;
    everyFixtureMustExecute: true;
    everyFixtureMustPass: true;
    uniqueEvidenceDigestPerFixtureRequired: true;
    deterministicExecutionRequired: true;
    ownerReviewAfterExecutionRequired: true;
  }>;

  readonly executionBoundary: Readonly<{
    testPlanPrepared: true;
    fixturePackPrepared: true;
    qualificationTestingExecuted: false;
    formalQualificationIssued: false;
    automaticQualificationBlocked: true;
    productionReady: false;
  }>;

  readonly authorityBoundary: Readonly<{
    realCustomerContactAuthorized: false;
    externalDeliveryAuthorized: false;
    liveProviderExecutionAuthorized: false;
    productionMutationAuthorized: false;
    paymentExecutionAuthorized: false;
    autonomousDecisionAuthorized: false;
    publicLaunchAuthorized: false;
  }>;

  readonly fixturePackDigest: string;
}

const SAFE_IDENTIFIER =
  /^[a-z0-9][a-z0-9:_-]{2,127}$/;

const SHA256 =
  /^[a-f0-9]{64}$/;

const FORBIDDEN_SECRET_TEXT =
  /(secret|token|password|authorization|bearer|cookie|private[-_ ]?key)/i;

const BLOCK_AND_ESCALATE_CASES =
  new Set([
    "meera-case-010",
    "meera-case-011",
    "meera-case-012",
  ]);

function canonicalize(
  value: unknown,
): string {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value
      .map(canonicalize)
      .join(",")}]`;
  }

  if (typeof value === "object") {
    const record =
      value as Record<string, unknown>;

    return `{${Object.keys(record)
      .sort()
      .map(
        (key) =>
          `${JSON.stringify(key)}:${canonicalize(record[key])}`,
      )
      .join(",")}}`;
  }

  throw new Error(
    "Unsupported deterministic Meera fixture-pack value.",
  );
}

function sha256(
  value: unknown,
): string {
  return createHash("sha256")
    .update(canonicalize(value))
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
      const nestedValue of Object.values(
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
  if (
    typeof value !== "string" ||
    !SAFE_IDENTIFIER.test(value) ||
    FORBIDDEN_SECRET_TEXT.test(value)
  ) {
    throw new Error(
      `${label} is invalid.`,
    );
  }
}

function requireIsoTimestamp(
  value: string,
): void {
  if (
    typeof value !== "string" ||
    Number.isNaN(Date.parse(value)) ||
    new Date(value).toISOString() !== value
  ) {
    throw new Error(
      "Meera fixture-pack preparation time must be an exact ISO timestamp.",
    );
  }
}

function expectedControlForCase(
  caseId: string,
): MeeraQualificationExpectedControl {
  return BLOCK_AND_ESCALATE_CASES.has(
    caseId,
  )
    ? "BLOCK_AND_ESCALATE_TO_OWNER"
    : "ALLOW_SAFE_QUOTATION_PROPOSAL_DRAFT";
}

export function createMeeraQualificationFixturePack(
  input:
    CreateMeeraQualificationFixturePackInput,
): MeeraQualificationFixturePack {
  requireIdentifier(
    "Meera fixturePackId",
    input.fixturePackId,
  );

  requireIdentifier(
    "Meera fixture tenantId",
    input.tenantId,
  );

  requireIdentifier(
    "Meera fixture ownerId",
    input.ownerId,
  );

  requireIsoTimestamp(
    input.preparedAt,
  );

  validateMeeraQualificationTestPlan(
    input.plan,
  );

  if (
    input.plan.employeeId !==
      "employee-meera-quotation-proposal-specialist-v1" ||
    input.plan.templateId !==
      "template-meera-quotation-proposal-specialist-v1"
  ) {
    throw new Error(
      "Meera fixture-pack identity is invalid.",
    );
  }

  if (
    input.plan.tenantId !==
      input.tenantId
  ) {
    throw new Error(
      "Cross-tenant Meera fixture preparation is blocked.",
    );
  }

  if (
    input.plan.ownerId !==
      input.ownerId
  ) {
    throw new Error(
      "Only the plan-bound owner can prepare the Meera fixture pack.",
    );
  }

  if (
    input.plan.planState !==
      "QUALIFICATION_TEST_PLAN_PREPARED" ||
    input.plan.executionBoundary
      .testPlanPrepared !==
      true ||
    input.plan.executionBoundary
      .fixturePackPrepared !==
      false ||
    input.plan.executionBoundary
      .qualificationTestingExecuted !==
      false
  ) {
    throw new Error(
      "Meera qualification plan is not eligible for fixture preparation.",
    );
  }

  const fixtures =
    MEERA_QUOTATION_PROPOSAL_SPECIALIST_QUALIFICATION_CASES.map(
      (
        qualificationCase,
        index,
      ): MeeraQualificationCaseFixture => ({
        sequence:
          index + 1,

        fixtureId:
          `meera-fixture-${String(
            index + 1,
          ).padStart(3, "0")}`,

        caseId:
          qualificationCase.caseId,

        competencyId:
          qualificationCase.competencyId,

        scenario:
          qualificationCase.title,

        expectedEvidence:
          qualificationCase.passCondition,

        expectedControl:
          expectedControlForCase(
            qualificationCase.caseId,
          ),

        executionMode:
          "SANDBOX_ONLY",

        syntheticOnly:
          true,

        realCustomerDataIncluded:
          false,

        externalEffectAllowed:
          false,

        evidenceRequired:
          true,
      }),
    );

  if (
    fixtures.length !==
      12 ||
    new Set(
      fixtures.map(
        (fixture) =>
          fixture.fixtureId,
      ),
    ).size !==
      12 ||
    new Set(
      fixtures.map(
        (fixture) =>
          fixture.caseId,
      ),
    ).size !==
      12
  ) {
    throw new Error(
      "Meera fixture pack must contain exactly 12 unique canonical fixtures.",
    );
  }

  const fixturePackCore = {
    version:
      MEERA_QUALIFICATION_FIXTURE_PACK_VERSION,

    fixturePackId:
      input.fixturePackId,

    fixturePackState:
      "QUALIFICATION_FIXTURE_PACK_PREPARED" as const,

    employeeId:
      "employee-meera-quotation-proposal-specialist-v1" as const,

    templateId:
      "template-meera-quotation-proposal-specialist-v1" as const,

    tenantId:
      input.tenantId,

    ownerId:
      input.ownerId,

    planId:
      input.plan.planId,

    planDigest:
      input.plan.planDigest,

    admissionId:
      input.plan.admissionId,

    admissionDigest:
      input.plan.admissionDigest,

    decisionId:
      input.plan.decisionId,

    decisionDigest:
      input.plan.decisionDigest,

    readinessAssessmentId:
      input.plan.readinessAssessmentId,

    readinessDigest:
      input.plan.readinessDigest,

    fixtures,

    totalFixtures:
      12 as const,

    preparedAt:
      input.preparedAt,

    fixturePolicy: {
      canonicalCaseBindingRequired:
        true as const,

      sandboxOnly:
        true as const,

      syntheticDataOnly:
        true as const,

      realCustomerDataBlocked:
        true as const,

      everyFixtureMustExecute:
        true as const,

      everyFixtureMustPass:
        true as const,

      uniqueEvidenceDigestPerFixtureRequired:
        true as const,

      deterministicExecutionRequired:
        true as const,

      ownerReviewAfterExecutionRequired:
        true as const,
    },

    executionBoundary: {
      testPlanPrepared:
        true as const,

      fixturePackPrepared:
        true as const,

      qualificationTestingExecuted:
        false as const,

      formalQualificationIssued:
        false as const,

      automaticQualificationBlocked:
        true as const,

      productionReady:
        false as const,
    },

    authorityBoundary: {
      realCustomerContactAuthorized:
        false as const,

      externalDeliveryAuthorized:
        false as const,

      liveProviderExecutionAuthorized:
        false as const,

      productionMutationAuthorized:
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
    ...fixturePackCore,

    fixturePackDigest:
      sha256(fixturePackCore),
  });
}

export function validateMeeraQualificationFixturePack(
  fixturePack:
    MeeraQualificationFixturePack,
): void {
  if (
    fixturePack.version !==
      MEERA_QUALIFICATION_FIXTURE_PACK_VERSION ||
    fixturePack.fixturePackState !==
      "QUALIFICATION_FIXTURE_PACK_PREPARED" ||
    fixturePack.employeeId !==
      "employee-meera-quotation-proposal-specialist-v1" ||
    fixturePack.templateId !==
      "template-meera-quotation-proposal-specialist-v1" ||
    fixturePack.totalFixtures !==
      12 ||
    fixturePack.fixtures.length !==
      12
  ) {
    throw new Error(
      "Meera qualification fixture-pack identity is invalid.",
    );
  }

  const expectedCaseIds =
    MEERA_QUOTATION_PROPOSAL_SPECIALIST_QUALIFICATION_CASES.map(
      (qualificationCase) =>
        qualificationCase.caseId,
    );

  if (
    fixturePack.fixtures.some(
      (
        fixture,
        index,
      ) =>
        fixture.sequence !==
          index + 1 ||
        fixture.fixtureId !==
          `meera-fixture-${String(
            index + 1,
          ).padStart(3, "0")}` ||
        fixture.caseId !==
          expectedCaseIds[index] ||
        fixture.expectedControl !==
          expectedControlForCase(
            fixture.caseId,
          ) ||
        fixture.executionMode !==
          "SANDBOX_ONLY" ||
        fixture.syntheticOnly !==
          true ||
        fixture.realCustomerDataIncluded !==
          false ||
        fixture.externalEffectAllowed !==
          false ||
        fixture.evidenceRequired !==
          true,
    )
  ) {
    throw new Error(
      "Meera qualification fixture boundary is invalid.",
    );
  }

  if (
    new Set(
      fixturePack.fixtures.map(
        (fixture) =>
          fixture.fixtureId,
      ),
    ).size !==
      12 ||
    new Set(
      fixturePack.fixtures.map(
        (fixture) =>
          fixture.caseId,
      ),
    ).size !==
      12
  ) {
    throw new Error(
      "Meera qualification fixture identities are invalid.",
    );
  }

  if (
    !SHA256.test(
      fixturePack.planDigest,
    ) ||
    !SHA256.test(
      fixturePack.admissionDigest,
    ) ||
    !SHA256.test(
      fixturePack.decisionDigest,
    ) ||
    !SHA256.test(
      fixturePack.readinessDigest,
    )
  ) {
    throw new Error(
      "Meera fixture-pack source evidence is invalid.",
    );
  }

  if (
    Object.values(
      fixturePack.authorityBoundary,
    ).some(
      (authorized) =>
        authorized !== false,
    )
  ) {
    throw new Error(
      "Meera fixture-pack authority boundary is invalid.",
    );
  }

  const {
    fixturePackDigest,
    ...fixturePackCore
  } = fixturePack;

  if (
    !SHA256.test(
      fixturePackDigest,
    ) ||
    fixturePackDigest !==
      sha256(fixturePackCore)
  ) {
    throw new Error(
      "Meera qualification fixture-pack integrity is invalid.",
    );
  }
}
