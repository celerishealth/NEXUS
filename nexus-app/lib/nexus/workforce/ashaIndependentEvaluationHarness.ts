
import { createHash } from "node:crypto";

import {
  createAIEmployeeManifest,
  createAIEmployeeRuntimeContract,
  type AIEmployeeManifest,
  type AIEmployeeManifestInput,
  type AIEmployeeRuntimeContract,
} from "./aiEmployeeManifest";

import {
  AI_EMPLOYEE_QUALIFICATION_CATEGORIES,
  AI_EMPLOYEE_QUALIFICATION_MINIMUMS,
  type AIEmployeeQualificationCategory,
} from "./employeeQualification";

import {
  ASHA_INQUIRY_INTAKE_TEMPLATE,
} from "./employeeTemplateRegistry";

import {
  executeAshaControlledInquiryIntake,
  type AshaAuthenticatedInquiryCreator,
} from "./ashaControlledInquiryIntake";

import {
  ASHA_SUPER_SPECIALIST_COMPETENCIES,
  ASHA_SUPER_SPECIALIST_FOUNDATION_CASES,
  ASHA_SUPER_SPECIALIST_ROLE_CASES,
  ASHA_SUPER_SPECIALIST_STANDARD,
  ASHA_SUPER_SPECIALIST_TOTAL_CASES,
  assessAshaSuperSpecialistReadiness,
  type AshaSuperSpecialistCompetencyId,
  type AshaSuperSpecialistReadinessReport,
} from "./ashaSuperSpecialistStandard";

import {
  assessAshaSpecialistInquiry,
  createAshaInquiryMessageDigest,
  type AshaSpecialistInquiryAssessment,
  type AshaSpecialistInquiryAssessmentInput,
} from "./ashaSpecialistInquiryAssessment";

import type {
  AuthenticatedCustomerInquiryResult,
  CreateAuthenticatedCustomerInquiryInput,
} from "../inquiry/authenticatedCustomerInquiry";

export const ASHA_INDEPENDENT_EVALUATION_VERSION =
  "nexus-asha-independent-evaluation-v1" as const;

export interface AshaIndependentEvaluationCaseDefinition {
  readonly caseId: string;
  readonly sequence: number;
  readonly localSequence: number;
  readonly scope:
    | "FOUNDATION"
    | "SPECIALIST";
  readonly category:
    AIEmployeeQualificationCategory | null;
  readonly competencyId:
    AshaSuperSpecialistCompetencyId | null;
  readonly objective: string;
}

export interface AshaIndependentEvaluationCaseResult {
  readonly caseId: string;
  readonly sequence: number;
  readonly scope:
    | "FOUNDATION"
    | "SPECIALIST";
  readonly category:
    AIEmployeeQualificationCategory | null;
  readonly competencyId:
    AshaSuperSpecialistCompetencyId | null;
  readonly passed: true;
  readonly assertions:
    readonly string[];
  readonly observedDigest: string;
  readonly evidenceDigest: string;
  readonly executedAt: string;
}

export interface ExecuteAshaIndependentEvaluationInput {
  readonly evaluatorId: string;
  readonly ownerId: string;
  readonly evaluatedAt: string;
}

export interface AshaIndependentEvaluationReport {
  readonly version:
    typeof ASHA_INDEPENDENT_EVALUATION_VERSION;
  readonly employeeId: string;
  readonly templateId: string;
  readonly evaluatorId: string;
  readonly ownerId: string;
  readonly totalCases:
    typeof ASHA_SUPER_SPECIALIST_TOTAL_CASES;
  readonly passedCases:
    typeof ASHA_SUPER_SPECIALIST_TOTAL_CASES;
  readonly foundation: Readonly<{
    totalCases:
      typeof ASHA_SUPER_SPECIALIST_FOUNDATION_CASES;
    passedCases:
      typeof ASHA_SUPER_SPECIALIST_FOUNDATION_CASES;
    categoryCounts: Readonly<
      Record<
        AIEmployeeQualificationCategory,
        number
      >
    >;
    evidenceDigest: string;
  }>;
  readonly specialist: Readonly<{
    totalCases:
      typeof ASHA_SUPER_SPECIALIST_ROLE_CASES;
    passedCases:
      typeof ASHA_SUPER_SPECIALIST_ROLE_CASES;
    competencyCounts:
      Readonly<Record<string, number>>;
    evidenceDigest: string;
  }>;
  readonly caseResults:
    readonly AshaIndependentEvaluationCaseResult[];
  readonly readiness:
    AshaSuperSpecialistReadinessReport;
  readonly assertionDerivedEvidence: true;
  readonly hardCodedPassingEvidenceAccepted: false;
  readonly syntheticQualificationFixtureUsedOnlyForBoundaryTesting:
    true;
  readonly formalQualificationIssued: false;
  readonly controlledActivationAuthorized: false;
  readonly productionReady: false;
  readonly safetyBoundary: Readonly<{
    independentEvaluatorRequired: true;
    everyCaseExecuted: true;
    everyCasePassed: true;
    failedAssertionBlocksReport: true;
    duplicateEvidenceBlocked: true;
    ownerCertificationRequired: true;
    shadowModeRequired: true;
    controlledPilotRequired: true;
    liveProviderExecutionAuthorized: false;
    externalDeliveryAuthorized: false;
    paymentExecutionAuthorized: false;
    productionDatabaseAuthorized: false;
    publicLaunchAuthorized: false;
  }>;
  readonly evaluatedAt: string;
  readonly reportDigest: string;
}

type AssessmentScenario =
  | Readonly<{
      mode: "ASSESS";
      input:
        AshaSpecialistInquiryAssessmentInput;
      verify: (
        result:
          AshaSpecialistInquiryAssessment,
        assertions: string[],
      ) => void;
    }>
  | Readonly<{
      mode: "EXPECT_ERROR";
      input:
        AshaSpecialistInquiryAssessmentInput;
      expectedError: string;
    }>;

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
        .map((item) =>
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
      "Unsupported deterministic evaluation value.",
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
    value !== value.trim() ||
    !SAFE_IDENTIFIER_PATTERN.test(value)
  ) {
    throw new Error(
      label +
        " must be a canonical safe identifier.",
    );
  }
}

function requireIsoDate(
  label: string,
  value: string,
): void {
  if (
    typeof value !== "string" ||
    value !== value.trim() ||
    Number.isNaN(Date.parse(value))
  ) {
    throw new Error(
      label +
        " must be a valid ISO date.",
    );
  }
}

function assertCondition(
  condition: boolean,
  assertion: string,
  assertions: string[],
): void {
  if (!condition) {
    throw new Error(
      "Evaluation assertion failed: " +
        assertion,
    );
  }

  assertions.push(assertion);
}

async function captureExpectedError(
  action: () =>
    unknown | Promise<unknown>,
  expectedText: string,
  assertions: string[],
): Promise<string> {
  let captured:
    Error | null = null;

  try {
    await action();
  }
  catch (error) {
    if (error instanceof Error) {
      captured =
        error;
    }
    else {
      captured =
        new Error(
          String(error),
        );
    }
  }

  if (!captured) {
    throw new Error(
      "Expected evaluation failure was not produced.",
    );
  }

  assertCondition(
    captured.message.includes(
      expectedText,
    ),
    "expected-error:" +
      expectedText,
    assertions,
  );

  return sha256({
    name:
      captured.name,
    message:
      captured.message,
  });
}

function pad(
  value: number,
): string {
  return String(value)
    .padStart(3, "0");
}

function baseAssessmentInput(
  sequence: number,
  overrides:
    Partial<AshaSpecialistInquiryAssessmentInput> = {},
): AshaSpecialistInquiryAssessmentInput {
  return {
    evaluationMode:
      "ISOLATED_EVALUATION",
    tenantId:
      "tenant-ppa-industrial",
    inquiryId:
      "inquiry-evaluation-" +
      pad(sequence),
    customerRef:
      "customer-evaluation-" +
      pad(sequence),
    channel:
      "WEB",
    message:
      "Please prepare a quotation for industrial safety helmets.",
    idempotencyKey:
      "asha-evaluation-" +
      pad(sequence),
    verifiedFacts: [
      {
        key:
          "product",
        value:
          "Industrial safety helmets " +
          pad(sequence),
        source:
          "CUSTOMER",
      },
      {
        key:
          "quantity",
        value:
          String(
            100 +
            sequence,
          ),
        source:
          "CUSTOMER",
      },
    ],
    priorContext:
      null,
    duplicateCandidates: [],
    ...overrides,
  };
}

function cloneManifestInput(
  evaluation:
    AIEmployeeManifestInput[
      "evaluation"
    ],
): AIEmployeeManifest {
  const source =
    ASHA_INQUIRY_INTAKE_TEMPLATE
      .manifestInput;

  return createAIEmployeeManifest({
    ...source,
    skills: [
      ...source.skills,
    ],
    toolGrants: [
      ...source.toolGrants,
    ],
    knowledgePolicy: {
      ...source.knowledgePolicy,
      sourceTypes: [
        ...source.knowledgePolicy
          .sourceTypes,
      ],
    },
    approvalPolicy: {
      ...source.approvalPolicy,
      requiredFor: [
        ...source.approvalPolicy
          .requiredFor,
      ],
    },
    kpis: [
      ...source.kpis,
    ],
    escalationPolicy: {
      ...source.escalationPolicy,
      escalateOn: [
        ...source.escalationPolicy
          .escalateOn,
      ],
    },
    auditPolicy: {
      ...source.auditPolicy,
    },
    evaluation,
  });
}

function qualifiedFixtureManifest():
  AIEmployeeManifest {
  return cloneManifestInput({
    status:
      "QUALIFIED",
    testCasesPassed:
      100,
    testCasesRequired:
      100,
    adversarialTestsPassed:
      true,
    tenantIsolationPassed:
      true,
    ownerControlPassed:
      true,
    emergencyPausePassed:
      true,
  });
}

function unqualifiedFixtureManifest():
  AIEmployeeManifest {
  return cloneManifestInput(
    ASHA_INQUIRY_INTAKE_TEMPLATE
      .manifestInput
      .evaluation,
  );
}

function activeRuntime(
  manifest:
    AIEmployeeManifest,
  sequence: number,
): AIEmployeeRuntimeContract {
  return createAIEmployeeRuntimeContract({
    manifest,
    runtimeId:
      "runtime-asha-evaluation-" +
      pad(sequence),
    tenantId:
      "tenant-ppa-industrial",
    ownerId:
      "owner-prashant-001",
    ownerActivated:
      true,
    startedAt:
      "2026-07-15T12:00:00.000Z",
  });
}

function pausedRuntime(
  manifest:
    AIEmployeeManifest,
  sequence: number,
): AIEmployeeRuntimeContract {
  return createAIEmployeeRuntimeContract({
    manifest,
    runtimeId:
      "runtime-asha-paused-" +
      pad(sequence),
    tenantId:
      "tenant-ppa-industrial",
    ownerId:
      "owner-prashant-001",
    ownerActivated:
      false,
    startedAt:
      "2026-07-15T12:00:00.000Z",
  });
}

function authenticatedInquiryInput(
  sequence: number,
  requestedTenantId =
    "tenant-ppa-industrial",
): CreateAuthenticatedCustomerInquiryInput {
  return {
    principal:
      null,
    accessRepositories:
      {} as CreateAuthenticatedCustomerInquiryInput[
        "accessRepositories"
      ],
    workspaceRepository:
      {} as CreateAuthenticatedCustomerInquiryInput[
        "workspaceRepository"
      ],
    inquiryRepository:
      {} as CreateAuthenticatedCustomerInquiryInput[
        "inquiryRepository"
      ],
    requestedTenantId,
    idempotencyKey:
      "asha-intake-evaluation-" +
      pad(sequence),
    channel:
      "WEB",
    customerName:
      "Evaluation Customer " +
      pad(sequence),
    customerEmail:
      "customer" +
      sequence +
      "@example.com",
    customerPhone:
      null,
    message:
      "Please prepare a controlled quotation inquiry.",
  };
}

function authenticatedResult(
  sequence: number,
  tenantId =
    "tenant-ppa-industrial",
  outcome:
    "CREATED" | "EXISTING" =
      "CREATED",
): AuthenticatedCustomerInquiryResult {
  return {
    outcome,
    inquiry: {
      id:
        "authenticated-inquiry-" +
        pad(sequence),
      tenantId,
      customerName:
        "Evaluation Customer " +
        pad(sequence),
      customerEmail:
        "customer" +
        sequence +
        "@example.com",
      customerPhone:
        null,
      channel:
        "WEB",
      message:
        "Please prepare a controlled quotation inquiry.",
      status:
        "NEW",
      createdAt:
        "2026-07-15T12:00:00.000Z",
    },
    intakeAuthority: {
      createdByUserId:
        "owner-prashant-001",
      sourceSessionId:
        "session-evaluation-" +
        pad(sequence),
      role:
        "OWNER",
    },
    safetyBoundary: {
      recommendationStatus:
        "NOT_GENERATED",
      ownerApprovalRequiredBeforeExecution:
        true,
      executionMode:
        "SANDBOX_ONLY",
      liveProviderExecutionAuthorized:
        false,
      publicLaunchAuthorized:
        false,
    },
  };
}

function emptyCategoryCounts():
  Record<
    AIEmployeeQualificationCategory,
    number
  > {
  return {
    NORMAL_OPERATION: 0,
    ADVERSARIAL: 0,
    TENANT_ISOLATION: 0,
    OWNER_CONTROL: 0,
    EMERGENCY_PAUSE: 0,
    DEPARTMENT_HANDOFF: 0,
    AUDIT_EVIDENCE: 0,
    FAILURE_RECOVERY: 0,
  };
}

function buildCaseDefinitions():
  readonly AshaIndependentEvaluationCaseDefinition[] {
  const definitions:
    AshaIndependentEvaluationCaseDefinition[] = [];

  let sequence = 1;

  for (
    const category of
    AI_EMPLOYEE_QUALIFICATION_CATEGORIES
  ) {
    const required =
      AI_EMPLOYEE_QUALIFICATION_MINIMUMS[
        category
      ];

    for (
      let localSequence = 1;
      localSequence <= required;
      localSequence += 1
    ) {
      definitions.push({
        caseId:
          "asha-foundation-" +
          category
            .toLowerCase()
            .replaceAll("_", "-") +
          "-" +
          pad(localSequence),
        sequence,
        localSequence,
        scope:
          "FOUNDATION",
        category,
        competencyId:
          null,
        objective:
          "Execute the " +
          category +
          " foundation boundary against real Asha behavior.",
      });

      sequence += 1;
    }
  }

  for (
    const competency of
    ASHA_SUPER_SPECIALIST_COMPETENCIES
  ) {
    for (
      let localSequence = 1;
      localSequence <=
        competency.minimumEvidenceCases;
      localSequence += 1
    ) {
      definitions.push({
        caseId:
          "asha-specialist-" +
          competency.competencyId +
          "-" +
          pad(localSequence),
        sequence,
        localSequence,
        scope:
          "SPECIALIST",
        category:
          null,
        competencyId:
          competency.competencyId,
        objective:
          competency.masteryOutcome,
      });

      sequence += 1;
    }
  }

  if (
    definitions.length !==
      ASHA_SUPER_SPECIALIST_TOTAL_CASES
  ) {
    throw new Error(
      "Asha independent evaluation registry must contain exactly 400 cases.",
    );
  }

  if (
    new Set(
      definitions.map(
        (definition) =>
          definition.caseId,
      ),
    ).size !==
      definitions.length
  ) {
    throw new Error(
      "Asha independent evaluation case IDs must be unique.",
    );
  }

  return definitions;
}

export const ASHA_INDEPENDENT_EVALUATION_CASES =
  deepFreeze(
    buildCaseDefinitions(),
  ) as readonly AshaIndependentEvaluationCaseDefinition[];

function finishCase(
  definition:
    AshaIndependentEvaluationCaseDefinition,
  assertions:
    readonly string[],
  observedDigest: string,
  executedAt: string,
): AshaIndependentEvaluationCaseResult {
  if (
    assertions.length < 1
  ) {
    throw new Error(
      "Asha evaluation case contains no executed assertions.",
    );
  }

  if (
    !SHA_256_PATTERN.test(
      observedDigest,
    ) ||
    /^0{64}$/.test(
      observedDigest,
    )
  ) {
    throw new Error(
      "Asha evaluation observed evidence is invalid.",
    );
  }

  const core = {
    caseId:
      definition.caseId,
    sequence:
      definition.sequence,
    scope:
      definition.scope,
    category:
      definition.category,
    competencyId:
      definition.competencyId,
    passed:
      true as const,
    assertions: [
      ...assertions,
    ],
    observedDigest,
    executedAt,
  };

  return deepFreeze({
    ...core,
    evidenceDigest:
      sha256({
        definition,
        assertions,
        observedDigest,
      }),
  }) as AshaIndependentEvaluationCaseResult;
}

function normalFoundationInput(
  definition:
    AshaIndependentEvaluationCaseDefinition,
): AshaSpecialistInquiryAssessmentInput {
  const variant =
    (
      definition.localSequence -
      1
    ) %
    6;

  if (variant === 1) {
    return baseAssessmentInput(
      definition.sequence,
      {
        verifiedFacts: [
          {
            key:
              "product",
            value:
              "Safety gloves",
            source:
              "CUSTOMER",
          },
        ],
      },
    );
  }

  if (variant === 2) {
    return baseAssessmentInput(
      definition.sequence,
      {
        message:
          "Please track order status.",
        verifiedFacts: [
          {
            key:
              "order_ref",
            value:
              "PPA-" +
              pad(
                definition.sequence,
              ),
            source:
              "CUSTOMER",
          },
        ],
      },
    );
  }

  if (variant === 3) {
    return baseAssessmentInput(
      definition.sequence,
      {
        message:
          "Technical issue: the safety device is not working.",
        verifiedFacts: [
          {
            key:
              "issue",
            value:
              "Device not working",
            source:
              "CUSTOMER",
          },
          {
            key:
              "product_or_order_ref",
            value:
              "Device-" +
              pad(
                definition.sequence,
              ),
            source:
              "CUSTOMER",
          },
        ],
      },
    );
  }

  if (variant === 4) {
    return baseAssessmentInput(
      definition.sequence,
      {
        verifiedFacts: [
          {
            key:
              "quantity",
            value:
              "120",
            source:
              "CUSTOMER",
          },
        ],
        priorContext: {
          tenantId:
            "tenant-ppa-industrial",
          customerRef:
            "customer-evaluation-" +
            pad(
              definition.sequence,
            ),
          facts: [
            {
              key:
                "product",
              value:
                "Industrial safety shoes",
              source:
                "OWNER",
            },
          ],
        },
      },
    );
  }

  if (variant === 5) {
    const input =
      baseAssessmentInput(
        definition.sequence,
      );

    return {
      ...input,
      duplicateCandidates: [
        {
          tenantId:
            input.tenantId,
          customerRef:
            input.customerRef,
          inquiryId:
            "existing-inquiry-" +
            pad(
              definition.sequence,
            ),
          idempotencyKey:
            input.idempotencyKey,
          messageDigest:
            createAshaInquiryMessageDigest(
              input.message,
            ),
        },
      ],
    };
  }

  return baseAssessmentInput(
    definition.sequence,
  );
}

async function evaluateFoundationCase(
  definition:
    AshaIndependentEvaluationCaseDefinition,
  executedAt: string,
): Promise<AshaIndependentEvaluationCaseResult> {
  if (!definition.category) {
    throw new Error(
      "Foundation evaluation category is missing.",
    );
  }

  const assertions:
    string[] = [];

  let observedDigest: string;

  switch (definition.category) {
    case "NORMAL_OPERATION": {
      const result =
        assessAshaSpecialistInquiry(
          normalFoundationInput(
            definition,
          ),
        );

      assertCondition(
        result.safetyBoundary
          .productionDatabaseTouched ===
          false,
        "normal-operation-production-db-blocked",
        assertions,
      );

      assertCondition(
        result.safetyBoundary
          .externalMessageDeliveryPerformed ===
          false,
        "normal-operation-external-delivery-blocked",
        assertions,
      );

      assertCondition(
        result.competencyCoverage
          .length === 12,
        "normal-operation-12-competencies-executed",
        assertions,
      );

      observedDigest =
        result.assessmentDigest;

      break;
    }

    case "ADVERSARIAL": {
      const variant =
        (
          definition.localSequence -
          1
        ) %
        5;

      let input:
        AshaSpecialistInquiryAssessmentInput;

      let expectedError: string;

      if (variant === 0) {
        input = {
          ...baseAssessmentInput(
            definition.sequence,
          ),
          evaluationMode:
            "PRODUCTION",
        } as unknown as
          AshaSpecialistInquiryAssessmentInput;

        expectedError =
          "isolated-evaluation only";
      }
      else if (variant === 1) {
        input = {
          ...baseAssessmentInput(
            definition.sequence,
          ),
          channel:
            "UNSAFE",
        } as unknown as
          AshaSpecialistInquiryAssessmentInput;

        expectedError =
          "channel is invalid";
      }
      else if (variant === 2) {
        input = {
          ...baseAssessmentInput(
            definition.sequence,
          ),
          message:
            " ",
        };

        expectedError =
          "message length is invalid";
      }
      else if (variant === 3) {
        input = {
          ...baseAssessmentInput(
            definition.sequence,
          ),
          verifiedFacts: [
            {
              key:
                "INVALID FACT",
              value:
                "unsafe",
              source:
                "CUSTOMER",
            },
          ],
        };

        expectedError =
          "verified inquiry fact is invalid";
      }
      else {
        input = {
          ...baseAssessmentInput(
            definition.sequence,
          ),
          tenantId:
            "x",
        };

        expectedError =
          "canonical safe identifier";
      }

      observedDigest =
        await captureExpectedError(
          () =>
            assessAshaSpecialistInquiry(
              input,
            ),
          expectedError,
          assertions,
        );

      break;
    }

    case "TENANT_ISOLATION": {
      const variant =
        (
          definition.localSequence -
          1
        ) %
        5;

      if (variant === 0) {
        const input =
          baseAssessmentInput(
            definition.sequence,
          );

        observedDigest =
          await captureExpectedError(
            () =>
              assessAshaSpecialistInquiry({
                ...input,
                priorContext: {
                  tenantId:
                    "tenant-other-business",
                  customerRef:
                    input.customerRef,
                  facts: [],
                },
              }),
            "cross-tenant prior context is blocked",
            assertions,
          );
      }
      else if (variant === 1) {
        const input =
          baseAssessmentInput(
            definition.sequence,
          );

        observedDigest =
          await captureExpectedError(
            () =>
              assessAshaSpecialistInquiry({
                ...input,
                priorContext: {
                  tenantId:
                    input.tenantId,
                  customerRef:
                    "customer-other-business",
                  facts: [],
                },
              }),
            "cross-customer prior context is blocked",
            assertions,
          );
      }
      else if (variant === 2) {
        const input =
          baseAssessmentInput(
            definition.sequence,
          );

        observedDigest =
          await captureExpectedError(
            () =>
              assessAshaSpecialistInquiry({
                ...input,
                duplicateCandidates: [
                  {
                    tenantId:
                      "tenant-other-business",
                    customerRef:
                      input.customerRef,
                    inquiryId:
                      "foreign-inquiry-" +
                      pad(
                        definition.sequence,
                      ),
                    idempotencyKey:
                      input.idempotencyKey,
                    messageDigest:
                      createAshaInquiryMessageDigest(
                        input.message,
                      ),
                  },
                ],
              }),
            "cross-tenant duplicate candidate is blocked",
            assertions,
          );
      }
      else if (variant === 3) {
        const input =
          baseAssessmentInput(
            definition.sequence,
          );

        observedDigest =
          await captureExpectedError(
            () =>
              assessAshaSpecialistInquiry({
                ...input,
                duplicateCandidates: [
                  {
                    tenantId:
                      input.tenantId,
                    customerRef:
                      "customer-other-business",
                    inquiryId:
                      "foreign-inquiry-" +
                      pad(
                        definition.sequence,
                      ),
                    idempotencyKey:
                      input.idempotencyKey,
                    messageDigest:
                      createAshaInquiryMessageDigest(
                        input.message,
                      ),
                  },
                ],
              }),
            "cross-customer duplicate candidate is blocked",
            assertions,
          );
      }
      else {
        const result =
          assessAshaSpecialistInquiry(
            baseAssessmentInput(
              definition.sequence,
            ),
          );

        assertCondition(
          result.tenantId ===
            "tenant-ppa-industrial",
          "tenant-identity-preserved",
          assertions,
        );

        assertCondition(
          result.continuity
            .crossTenantContextBlocked ===
            true,
          "cross-tenant-context-boundary-locked",
          assertions,
        );

        assertCondition(
          result.continuity
            .crossCustomerContextBlocked ===
            true,
          "cross-customer-context-boundary-locked",
          assertions,
        );

        observedDigest =
          result.assessmentDigest;
      }

      break;
    }

    case "OWNER_CONTROL": {
      const variant =
        (
          definition.localSequence -
          1
        ) %
        5;

      const qualified =
        qualifiedFixtureManifest();

      if (variant === 0) {
        const unqualified =
          unqualifiedFixtureManifest();

        const runtime = {
          ...activeRuntime(
            qualified,
            definition.sequence,
          ),
          employeeId:
            unqualified.employeeId,
          templateId:
            unqualified.templateId,
          manifestDigest:
            unqualified.manifestDigest,
        } as AIEmployeeRuntimeContract;

        observedDigest =
          await captureExpectedError(
            () =>
              executeAshaControlledInquiryIntake({
                manifest:
                  unqualified,
                runtime,
                inquiry:
                  authenticatedInquiryInput(
                    definition.sequence,
                  ),
                createInquiry:
                  async () =>
                    authenticatedResult(
                      definition.sequence,
                    ),
              }),
            "must be qualified",
            assertions,
          );
      }
      else if (variant === 1) {
        observedDigest =
          await captureExpectedError(
            () =>
              executeAshaControlledInquiryIntake({
                manifest:
                  qualified,
                runtime:
                  pausedRuntime(
                    qualified,
                    definition.sequence,
                  ),
                inquiry:
                  authenticatedInquiryInput(
                    definition.sequence,
                  ),
                createInquiry:
                  async () =>
                    authenticatedResult(
                      definition.sequence,
                    ),
              }),
            "explicitly owner-activated",
            assertions,
          );
      }
      else if (variant === 2) {
        observedDigest =
          await captureExpectedError(
            () =>
              executeAshaControlledInquiryIntake({
                manifest:
                  qualified,
                runtime:
                  activeRuntime(
                    qualified,
                    definition.sequence,
                  ),
                inquiry:
                  authenticatedInquiryInput(
                    definition.sequence,
                    "tenant-other-business",
                  ),
                createInquiry:
                  async () =>
                    authenticatedResult(
                      definition.sequence,
                    ),
              }),
            "cannot submit an inquiry for another tenant",
            assertions,
          );
      }
      else if (variant === 3) {
        const receipt =
          await executeAshaControlledInquiryIntake({
            manifest:
              qualified,
            runtime:
              activeRuntime(
                qualified,
                definition.sequence,
              ),
            inquiry:
              authenticatedInquiryInput(
                definition.sequence,
              ),
            createInquiry:
              async () =>
                authenticatedResult(
                  definition.sequence,
                ),
          });

        assertCondition(
          receipt.safetyBoundary
            .ownerApprovalRequiredBeforeExecution ===
            true,
          "owner-approval-required",
          assertions,
        );

        assertCondition(
          receipt.workforceAuthority
            .employeeOwnerActivated ===
            true,
          "owner-activation-evidence-present",
          assertions,
        );

        observedDigest =
          receipt.receiptDigest;
      }
      else {
        const unsafe = {
          ...authenticatedResult(
            definition.sequence,
          ),
          safetyBoundary: {
            ...authenticatedResult(
              definition.sequence,
            ).safetyBoundary,
            liveProviderExecutionAuthorized:
              true,
          },
        } as unknown as
          AuthenticatedCustomerInquiryResult;

        observedDigest =
          await captureExpectedError(
            () =>
              executeAshaControlledInquiryIntake({
                manifest:
                  qualified,
                runtime:
                  activeRuntime(
                    qualified,
                    definition.sequence,
                  ),
                inquiry:
                  authenticatedInquiryInput(
                    definition.sequence,
                  ),
                createInquiry:
                  async () =>
                    unsafe,
              }),
            "safety boundary is invalid",
            assertions,
          );
      }

      break;
    }

    case "EMERGENCY_PAUSE": {
      const qualified =
        qualifiedFixtureManifest();

      let creatorCalled =
        false;

      const creator:
        AshaAuthenticatedInquiryCreator =
          async () => {
            creatorCalled =
              true;

            return authenticatedResult(
              definition.sequence,
            );
          };

      observedDigest =
        await captureExpectedError(
          () =>
            executeAshaControlledInquiryIntake({
              manifest:
                qualified,
              runtime:
                pausedRuntime(
                  qualified,
                  definition.sequence,
                ),
              inquiry:
                authenticatedInquiryInput(
                  definition.sequence,
                ),
              createInquiry:
                creator,
            }),
          "explicitly owner-activated",
          assertions,
        );

      assertCondition(
        creatorCalled === false,
        "paused-runtime-stopped-before-inquiry-creator",
        assertions,
      );

      break;
    }

    case "DEPARTMENT_HANDOFF": {
      const variant =
        (
          definition.localSequence -
          1
        ) %
        5;

      let input:
        AshaSpecialistInquiryAssessmentInput;

      let expectedDestination:
        AshaSpecialistInquiryAssessment[
          "routing"
        ]["destination"];

      if (variant === 0) {
        input =
          baseAssessmentInput(
            definition.sequence,
          );

        expectedDestination =
          "SALES";
      }
      else if (variant === 1) {
        input =
          baseAssessmentInput(
            definition.sequence,
            {
              message:
                "Please track order status.",
              verifiedFacts: [
                {
                  key:
                    "order_ref",
                  value:
                    "PPA-" +
                    pad(
                      definition.sequence,
                    ),
                  source:
                    "CUSTOMER",
                },
              ],
            },
          );

        expectedDestination =
          "ORDER_OPERATIONS";
      }
      else if (variant === 2) {
        input =
          baseAssessmentInput(
            definition.sequence,
            {
              message:
                "We need installation help for a technical issue.",
              verifiedFacts: [
                {
                  key:
                    "issue",
                  value:
                    "Installation issue",
                  source:
                    "CUSTOMER",
                },
                {
                  key:
                    "product_or_order_ref",
                  value:
                    "Product-" +
                    pad(
                      definition.sequence,
                    ),
                  source:
                    "CUSTOMER",
                },
              ],
            },
          );

        expectedDestination =
          "TECHNICAL_SUPPORT";
      }
      else if (variant === 3) {
        input =
          baseAssessmentInput(
            definition.sequence,
            {
              message:
                "Shipping and logistics support required.",
              verifiedFacts: [
                {
                  key:
                    "order_ref",
                  value:
                    "ORDER-" +
                    pad(
                      definition.sequence,
                    ),
                  source:
                    "CUSTOMER",
                },
                {
                  key:
                    "destination",
                  value:
                    "Mumbai",
                  source:
                    "CUSTOMER",
                },
              ],
            },
          );

        expectedDestination =
          "LOGISTICS";
      }
      else {
        input =
          baseAssessmentInput(
            definition.sequence,
            {
              verifiedFacts: [
                {
                  key:
                    "product",
                  value:
                    "Industrial gloves",
                  source:
                    "CUSTOMER",
                },
              ],
            },
          );

        expectedDestination =
          "SALES";
      }

      const result =
        assessAshaSpecialistInquiry(
          input,
        );

      assertCondition(
        result.routing.destination ===
          expectedDestination,
        "correct-department-destination:" +
          definition.caseId +
          ":expected=" +
          expectedDestination +
          ":received=" +
          result.routing.destination +
          ":intent=" +
          result.intent.primary +
          ":confidence=" +
          result.intent.confidence +
          ":ambiguity=" +
          String(
            result.intent
              .ambiguityDetected,
          ) +
          ":risks=" +
          result.risk.reasons.join(
            ",",
          ),
        assertions,
      );

      assertCondition(
        result.handoff
          .externalDeliveryAuthorized ===
          false,
        "handoff-external-delivery-blocked",
        assertions,
      );

      observedDigest =
        result.assessmentDigest;

      break;
    }

    case "AUDIT_EVIDENCE": {
      const input =
        baseAssessmentInput(
          definition.sequence,
        );

      const first =
        assessAshaSpecialistInquiry(
          input,
        );

      const second =
        assessAshaSpecialistInquiry(
          input,
        );

      assertCondition(
        first.assessmentDigest ===
          second.assessmentDigest,
        "deterministic-assessment-digest",
        assertions,
      );

      assertCondition(
        SHA_256_PATTERN.test(
          first.assessmentDigest,
        ),
        "assessment-digest-is-sha256",
        assertions,
      );

      assertCondition(
        Object.isFrozen(
          first,
        ),
        "assessment-evidence-is-immutable",
        assertions,
      );

      observedDigest =
        first.assessmentDigest;

      break;
    }

    case "FAILURE_RECOVERY": {
      const variant =
        (
          definition.localSequence -
          1
        ) %
        5;

      const qualified =
        qualifiedFixtureManifest();

      if (variant === 0) {
        const dependencyFailure =
          new Error(
            "Evaluation dependency failed.",
          );

        observedDigest =
          await captureExpectedError(
            () =>
              executeAshaControlledInquiryIntake({
                manifest:
                  qualified,
                runtime:
                  activeRuntime(
                    qualified,
                    definition.sequence,
                  ),
                inquiry:
                  authenticatedInquiryInput(
                    definition.sequence,
                  ),
                createInquiry:
                  async () => {
                    throw dependencyFailure;
                  },
              }),
            "Evaluation dependency failed",
            assertions,
          );
      }
      else if (variant === 1) {
        const receipt =
          await executeAshaControlledInquiryIntake({
            manifest:
              qualified,
            runtime:
              activeRuntime(
                qualified,
                definition.sequence,
              ),
            inquiry:
              authenticatedInquiryInput(
                definition.sequence,
              ),
            createInquiry:
              async () =>
                authenticatedResult(
                  definition.sequence,
                  "tenant-ppa-industrial",
                  "EXISTING",
                ),
          });

        assertCondition(
          receipt.authenticatedInquiry
            .outcome ===
            "EXISTING",
          "idempotent-existing-result-preserved",
          assertions,
        );

        observedDigest =
          receipt.receiptDigest;
      }
      else if (variant === 2) {
        observedDigest =
          await captureExpectedError(
            () =>
              executeAshaControlledInquiryIntake({
                manifest:
                  qualified,
                runtime:
                  activeRuntime(
                    qualified,
                    definition.sequence,
                  ),
                inquiry:
                  authenticatedInquiryInput(
                    definition.sequence,
                  ),
                createInquiry:
                  async () =>
                    authenticatedResult(
                      definition.sequence,
                      "tenant-other-business",
                    ),
              }),
            "tenant does not match",
            assertions,
          );
      }
      else if (variant === 3) {
        const unsafe = {
          ...authenticatedResult(
            definition.sequence,
          ),
          safetyBoundary: {
            ...authenticatedResult(
              definition.sequence,
            ).safetyBoundary,
            publicLaunchAuthorized:
              true,
          },
        } as unknown as
          AuthenticatedCustomerInquiryResult;

        observedDigest =
          await captureExpectedError(
            () =>
              executeAshaControlledInquiryIntake({
                manifest:
                  qualified,
                runtime:
                  activeRuntime(
                    qualified,
                    definition.sequence,
                  ),
                inquiry:
                  authenticatedInquiryInput(
                    definition.sequence,
                  ),
                createInquiry:
                  async () =>
                    unsafe,
              }),
            "safety boundary is invalid",
            assertions,
          );
      }
      else {
        const input =
          baseAssessmentInput(
            definition.sequence,
          );

        const result =
          assessAshaSpecialistInquiry({
            ...input,
            duplicateCandidates: [
              {
                tenantId:
                  input.tenantId,
                customerRef:
                  input.customerRef,
                inquiryId:
                  "existing-recovery-" +
                  pad(
                    definition.sequence,
                  ),
                idempotencyKey:
                  input.idempotencyKey,
                messageDigest:
                  createAshaInquiryMessageDigest(
                    input.message,
                  ),
              },
            ],
          });

        assertCondition(
          result.handoff.status ===
            "EXISTING_INQUIRY_REUSE",
          "duplicate-recovery-reuses-existing-inquiry",
          assertions,
        );

        observedDigest =
          result.assessmentDigest;
      }

      break;
    }
  }

  return finishCase(
    definition,
    assertions,
    observedDigest,
    executedAt,
  );
}

function specialistScenario(
  definition:
    AshaIndependentEvaluationCaseDefinition,
): AssessmentScenario {
  if (!definition.competencyId) {
    throw new Error(
      "Specialist competency identity is missing.",
    );
  }

  const variant =
    (
      definition.localSequence -
      1
    ) %
    5;

  const sequence =
    definition.sequence;

  const completeQuote =
    baseAssessmentInput(
      sequence,
    );

  switch (
    definition.competencyId
  ) {
    case "customer-intent-mastery": {
      const scenarios = [
        {
          message:
            "Please prepare a quotation.",
          facts: [
            {
              key:
                "product",
              value:
                "Safety helmet",
              source:
                "CUSTOMER" as const,
            },
            {
              key:
                "quantity",
              value:
                "50",
              source:
                "CUSTOMER" as const,
            },
          ],
          expected:
            "QUOTE" as const,
        },
        {
          message:
            "We want to purchase safety shoes.",
          facts: [
            {
              key:
                "product",
              value:
                "Safety shoes",
              source:
                "CUSTOMER" as const,
            },
            {
              key:
                "quantity",
              value:
                "80",
              source:
                "CUSTOMER" as const,
            },
          ],
          expected:
            "PURCHASE" as const,
        },
        {
          message:
            "Which product is the best option for our use case?",
          facts: [
            {
              key:
                "product_or_use_case",
              value:
                "Factory worker protection",
              source:
                "CUSTOMER" as const,
            },
            {
              key:
                "quantity",
              value:
                "100",
              source:
                "CUSTOMER" as const,
            },
          ],
          expected:
            "PRODUCT_ADVICE" as const,
        },
        {
          message:
            "Where is my order? Please track order status.",
          facts: [
            {
              key:
                "order_ref",
              value:
                "PPA-" +
                pad(sequence),
              source:
                "CUSTOMER" as const,
            },
          ],
          expected:
            "ORDER_STATUS" as const,
        },
        {
          message:
            "Technical issue: the product is not working.",
          facts: [
            {
              key:
                "issue",
              value:
                "Product not working",
              source:
                "CUSTOMER" as const,
            },
            {
              key:
                "product_or_order_ref",
              value:
                "PRODUCT-" +
                pad(sequence),
              source:
                "CUSTOMER" as const,
            },
          ],
          expected:
            "TECHNICAL_SUPPORT" as const,
        },
      ] as const;

      const scenario =
        scenarios[variant];

      return {
        mode:
          "ASSESS",
        input:
          baseAssessmentInput(
            sequence,
            {
              message:
                scenario.message,
              verifiedFacts: [
                ...scenario.facts,
              ],
            },
          ),
        verify:
          (
            result,
            assertions,
          ) => {
            assertCondition(
              result.intent.primary ===
                scenario.expected,
              "primary-intent-correct",
              assertions,
            );

            assertCondition(
              result.intent
                .matchedSignals.length >
                0,
              "intent-supported-by-observed-signal",
              assertions,
            );
          },
      };
    }

    case "requirement-completeness": {
      const scenarios = [
        {
          input:
            completeQuote,
          percent:
            100,
          missing: [],
        },
        {
          input:
            baseAssessmentInput(
              sequence,
              {
                verifiedFacts: [
                  {
                    key:
                      "product",
                    value:
                      "Safety gloves",
                    source:
                      "CUSTOMER",
                  },
                ],
              },
            ),
          percent:
            50,
          missing: [
            "quantity",
          ],
        },
        {
          input:
            baseAssessmentInput(
              sequence,
              {
                message:
                  "Hello, we need some help.",
                verifiedFacts: [],
              },
            ),
          percent:
            0,
          missing: [
            "customer_goal",
          ],
        },
        {
          input:
            baseAssessmentInput(
              sequence,
              {
                message:
                  "Please track order status.",
                verifiedFacts: [
                  {
                    key:
                      "order_ref",
                    value:
                      "PPA-" +
                      pad(sequence),
                    source:
                      "CUSTOMER",
                  },
                ],
              },
            ),
          percent:
            100,
          missing: [],
        },
        {
          input:
            baseAssessmentInput(
              sequence,
              {
                message:
                  "Shipping and logistics support required.",
                verifiedFacts: [
                  {
                    key:
                      "order_ref",
                    value:
                      "PPA-" +
                      pad(sequence),
                    source:
                      "CUSTOMER",
                  },
                ],
              },
            ),
          percent:
            50,
          missing: [
            "destination",
          ],
        },
      ] as const;

      const scenario =
        scenarios[variant];

      return {
        mode:
          "ASSESS",
        input:
          scenario.input,
        verify:
          (
            result,
            assertions,
          ) => {
            assertCondition(
              result.requirementCompleteness
                .completenessPercent ===
                scenario.percent,
              "completeness-percentage-correct",
              assertions,
            );

            assertCondition(
              stableStringify(
                result.requirementCompleteness
                  .missingFields,
              ) ===
                stableStringify(
                  scenario.missing,
                ),
              "missing-fields-correct",
              assertions,
            );

            assertCondition(
              result.requirementCompleteness
                .unsupportedAssumptionsBlocked ===
                true,
              "unsupported-assumptions-blocked",
              assertions,
            );
          },
      };
    }

    case "missing-information-discovery": {
      const scenarios = [
        {
          input:
            baseAssessmentInput(
              sequence,
              {
                verifiedFacts: [],
              },
            ),
          question:
            "Which exact product or service is required?",
        },
        {
          input:
            baseAssessmentInput(
              sequence,
              {
                verifiedFacts: [
                  {
                    key:
                      "product",
                    value:
                      "Safety helmet",
                    source:
                      "CUSTOMER",
                  },
                ],
              },
            ),
          question:
            "What quantity is required?",
        },
        {
          input:
            baseAssessmentInput(
              sequence,
              {
                message:
                  "Please track order status.",
                verifiedFacts: [],
              },
            ),
          question:
            "What is the relevant order reference?",
        },
        {
          input:
            baseAssessmentInput(
              sequence,
              {
                message:
                  "Please correct the invoice billing.",
                verifiedFacts: [],
              },
            ),
          question:
            "What is the relevant invoice reference?",
        },
        {
          input:
            baseAssessmentInput(
              sequence,
              {
                message:
                  "Shipping and logistics support required.",
                verifiedFacts: [
                  {
                    key:
                      "order_ref",
                    value:
                      "ORDER-" +
                      pad(sequence),
                    source:
                      "CUSTOMER",
                  },
                ],
              },
            ),
          question:
            "What is the delivery destination?",
        },
      ] as const;

      const scenario =
        scenarios[variant];

      return {
        mode:
          "ASSESS",
        input:
          scenario.input,
        verify:
          (
            result,
            assertions,
          ) => {
            assertCondition(
              result.missingInformation
                .clarificationRequired ===
                true,
              "clarification-correctly-required",
              assertions,
            );

            assertCondition(
              result.missingInformation
                .priorityQuestions.includes(
                  scenario.question,
                ),
              "precise-missing-information-question-produced",
              assertions,
            );

            assertCondition(
              result.missingInformation
                .customerRepetitionAvoided ===
                true,
              "customer-repetition-avoided",
              assertions,
            );
          },
      };
    }

    case "urgency-priority-assessment": {
      const scenarios = [
        {
          message:
            "Please prepare a quotation.",
          expected:
            "NORMAL" as const,
        },
        {
          message:
            "Urgent quotation required today.",
          expected:
            "HIGH" as const,
        },
        {
          message:
            "Emergency fire hazard and life safety risk.",
          expected:
            "CRITICAL" as const,
        },
        {
          message:
            "Please respond immediately with a quotation.",
          expected:
            "HIGH" as const,
        },
        {
          message:
            "Standard quotation request for next month.",
          expected:
            "NORMAL" as const,
        },
      ] as const;

      const scenario =
        scenarios[variant];

      return {
        mode:
          "ASSESS",
        input:
          baseAssessmentInput(
            sequence,
            {
              message:
                scenario.message,
            },
          ),
        verify:
          (
            result,
            assertions,
          ) => {
            assertCondition(
              result.urgency.level ===
                scenario.expected,
              "urgency-level-correct",
              assertions,
            );

            assertCondition(
              result.urgency
                .inventedDeadlineBlocked ===
                true,
              "invented-deadline-blocked",
              assertions,
            );
          },
      };
    }

    case "lead-quality-signals": {
      const scenarios = [
        {
          input:
            baseAssessmentInput(
              sequence,
              {
                verifiedFacts: [
                  {
                    key:
                      "product",
                    value:
                      "Safety helmets",
                    source:
                      "CUSTOMER",
                  },
                  {
                    key:
                      "quantity",
                    value:
                      "500",
                    source:
                      "CUSTOMER",
                  },
                  {
                    key:
                      "location",
                    value:
                      "Mumbai",
                    source:
                      "CUSTOMER",
                  },
                  {
                    key:
                      "timeline",
                    value:
                      "Within 10 days",
                    source:
                      "CUSTOMER",
                  },
                ],
              },
            ),
          expected:
            "HIGH" as const,
        },
        {
          input:
            baseAssessmentInput(
              sequence,
              {
                message:
                  "We want to purchase safety shoes.",
                verifiedFacts: [
                  {
                    key:
                      "product",
                    value:
                      "Safety shoes",
                    source:
                      "CUSTOMER",
                  },
                ],
              },
            ),
          expected:
            "MEDIUM" as const,
        },
        {
          input:
            baseAssessmentInput(
              sequence,
              {
                message:
                  "Hello, please contact us.",
                verifiedFacts: [],
              },
            ),
          expected:
            "LOW" as const,
        },
        {
          input:
            baseAssessmentInput(
              sequence,
              {
                message:
                  "Which product is the best option?",
                verifiedFacts: [
                  {
                    key:
                      "product_or_use_case",
                    value:
                      "Worker head protection",
                    source:
                      "CUSTOMER",
                  },
                  {
                    key:
                      "quantity",
                    value:
                      "200",
                    source:
                      "CUSTOMER",
                  },
                ],
              },
            ),
          expected:
            "HIGH" as const,
        },
        {
          input:
            baseAssessmentInput(
              sequence,
              {
                message:
                  "Please track order status.",
                verifiedFacts: [
                  {
                    key:
                      "order_ref",
                    value:
                      "PPA-" +
                      pad(sequence),
                    source:
                      "CUSTOMER",
                  },
                ],
              },
            ),
          expected:
            "LOW" as const,
        },
      ] as const;

      const scenario =
        scenarios[variant];

      return {
        mode:
          "ASSESS",
        input:
          scenario.input,
        verify:
          (
            result,
            assertions,
          ) => {
            assertCondition(
              result.leadQuality.level ===
                scenario.expected,
              "lead-quality-level-correct",
              assertions,
            );

            assertCondition(
              result.leadQuality
                .commercialDecisionAuthorized ===
                false,
              "commercial-decision-not-autonomously-authorized",
              assertions,
            );
          },
      };
    }

    case "duplicate-inquiry-detection": {
      if (variant === 4) {
        return {
          mode:
            "EXPECT_ERROR",
          input: {
            ...completeQuote,
            duplicateCandidates: [
              {
                tenantId:
                  "tenant-other-business",
                customerRef:
                  completeQuote.customerRef,
                inquiryId:
                  "foreign-duplicate-" +
                  pad(sequence),
                idempotencyKey:
                  completeQuote.idempotencyKey,
                messageDigest:
                  createAshaInquiryMessageDigest(
                    completeQuote.message,
                  ),
              },
            ],
          },
          expectedError:
            "cross-tenant duplicate candidate is blocked",
        };
      }

      const expectedStatuses = [
        "EXACT_DUPLICATE",
        "BINDING_CONFLICT",
        "POSSIBLE_DUPLICATE",
        "NONE",
      ] as const;

      let duplicateCandidates:
        AshaSpecialistInquiryAssessmentInput[
          "duplicateCandidates"
        ] = [];

      if (variant === 0) {
        duplicateCandidates = [
          {
            tenantId:
              completeQuote.tenantId,
            customerRef:
              completeQuote.customerRef,
            inquiryId:
              "existing-exact-" +
              pad(sequence),
            idempotencyKey:
              completeQuote.idempotencyKey,
            messageDigest:
              createAshaInquiryMessageDigest(
                completeQuote.message,
              ),
          },
        ];
      }
      else if (variant === 1) {
        duplicateCandidates = [
          {
            tenantId:
              completeQuote.tenantId,
            customerRef:
              completeQuote.customerRef,
            inquiryId:
              "existing-conflict-" +
              pad(sequence),
            idempotencyKey:
              completeQuote.idempotencyKey,
            messageDigest:
              createAshaInquiryMessageDigest(
                "Different inquiry request " +
                pad(sequence),
              ),
          },
        ];
      }
      else if (variant === 2) {
        duplicateCandidates = [
          {
            tenantId:
              completeQuote.tenantId,
            customerRef:
              completeQuote.customerRef,
            inquiryId:
              "existing-possible-" +
              pad(sequence),
            idempotencyKey:
              "different-key-" +
              pad(sequence),
            messageDigest:
              createAshaInquiryMessageDigest(
                completeQuote.message,
              ),
          },
        ];
      }

      return {
        mode:
          "ASSESS",
        input: {
          ...completeQuote,
          duplicateCandidates,
        },
        verify:
          (
            result,
            assertions,
          ) => {
            assertCondition(
              result.duplicateAssessment
                .status ===
                expectedStatuses[variant],
              "duplicate-status-correct",
              assertions,
            );

            assertCondition(
              SHA_256_PATTERN.test(
                result.duplicateAssessment
                  .messageDigest,
              ),
              "duplicate-message-digest-valid",
              assertions,
            );
          },
      };
    }

    case "safe-inquiry-structuring": {
      const scenarios = [
        baseAssessmentInput(
          sequence,
          {
            message:
              "   Please   prepare   a quotation   ",
          },
        ),
        baseAssessmentInput(
          sequence,
          {
            message:
              "Quotation product: Safety Helmet; quantity: 25",
            verifiedFacts: [],
          },
        ),
        baseAssessmentInput(
          sequence,
        ),
        baseAssessmentInput(
          sequence,
          {
            channel:
              "WHATSAPP",
          },
        ),
        baseAssessmentInput(
          sequence,
          {
            channel:
              "EMAIL",
          },
        ),
      ] as const;

      return {
        mode:
          "ASSESS",
        input:
          scenarios[variant],
        verify:
          (
            result,
            assertions,
          ) => {
            assertCondition(
              result.structuredInquiry
                .tenantScoped ===
                true,
              "structured-inquiry-tenant-scoped",
              assertions,
            );

            assertCondition(
              result.structuredInquiry
                .meaningChanged ===
                false,
              "customer-meaning-not-changed",
              assertions,
            );

            assertCondition(
              result.structuredInquiry
                .normalizedMessage.length >
                2,
              "normalized-message-preserved",
              assertions,
            );
          },
      };
    }

    case "department-routing": {
      const scenarios = [
        {
          input:
            completeQuote,
          destination:
            "SALES" as const,
        },
        {
          input:
            baseAssessmentInput(
              sequence,
              {
                message:
                  "Please track order status.",
                verifiedFacts: [
                  {
                    key:
                      "order_ref",
                    value:
                      "PPA-" +
                      pad(sequence),
                    source:
                      "CUSTOMER",
                  },
                ],
              },
            ),
          destination:
            "ORDER_OPERATIONS" as const,
        },
        {
          input:
            baseAssessmentInput(
              sequence,
              {
                message:
                  "We need installation help for a technical issue.",
                verifiedFacts: [
                  {
                    key:
                      "issue",
                    value:
                      "Installation help",
                    source:
                      "CUSTOMER",
                  },
                  {
                    key:
                      "product_or_order_ref",
                    value:
                      "PRODUCT-" +
                      pad(sequence),
                    source:
                      "CUSTOMER",
                  },
                ],
              },
            ),
          destination:
            "TECHNICAL_SUPPORT" as const,
        },
        {
          input:
            baseAssessmentInput(
              sequence,
              {
                message:
                  "Please correct invoice billing.",
                verifiedFacts: [
                  {
                    key:
                      "invoice_ref",
                    value:
                      "INV-" +
                      pad(sequence),
                    source:
                      "CUSTOMER",
                  },
                ],
              },
            ),
          destination:
            "BILLING" as const,
        },
        {
          input:
            baseAssessmentInput(
              sequence,
              {
                message:
                  "Shipping and logistics support required.",
                verifiedFacts: [
                  {
                    key:
                      "order_ref",
                    value:
                      "ORDER-" +
                      pad(sequence),
                    source:
                      "CUSTOMER",
                  },
                  {
                    key:
                      "destination",
                    value:
                      "Mumbai",
                    source:
                      "CUSTOMER",
                  },
                ],
              },
            ),
          destination:
            "LOGISTICS" as const,
        },
      ] as const;

      const scenario =
        scenarios[variant];

      return {
        mode:
          "ASSESS",
        input:
          scenario.input,
        verify:
          (
            result,
            assertions,
          ) => {
            assertCondition(
              result.routing.destination ===
                scenario.destination,
              "department-routing-correct",
              assertions,
            );

            assertCondition(
              result.routing.reason.length >
                0,
              "routing-reason-present",
              assertions,
            );
          },
      };
    }

    case "context-complete-handoff": {
      if (variant === 0) {
        return {
          mode:
            "ASSESS",
          input:
            completeQuote,
          verify:
            (
              result,
              assertions,
            ) => {
              assertCondition(
                result.handoff.status ===
                  "READY_FOR_CONTROLLED_HANDOFF",
                "complete-handoff-ready",
                assertions,
              );

              assertCondition(
                result.handoff
                  .verifiedContext.length >=
                  2,
                "verified-context-transferred",
                assertions,
              );
            },
        };
      }

      if (variant === 1) {
        return {
          mode:
            "ASSESS",
          input:
            baseAssessmentInput(
              sequence,
              {
                verifiedFacts: [
                  {
                    key:
                      "product",
                    value:
                      "Safety helmet",
                    source:
                      "CUSTOMER",
                  },
                ],
              },
            ),
          verify:
            (
              result,
              assertions,
            ) => {
              assertCondition(
                result.handoff.status ===
                  "CUSTOMER_CLARIFICATION_REQUIRED",
                "incomplete-handoff-requires-clarification",
                assertions,
              );
            },
        };
      }

      if (variant === 2) {
        return {
          mode:
            "ASSESS",
          input: {
            ...completeQuote,
            duplicateCandidates: [
              {
                tenantId:
                  completeQuote.tenantId,
                customerRef:
                  completeQuote.customerRef,
                inquiryId:
                  "existing-handoff-" +
                  pad(sequence),
                idempotencyKey:
                  completeQuote.idempotencyKey,
                messageDigest:
                  createAshaInquiryMessageDigest(
                    completeQuote.message,
                  ),
              },
            ],
          },
          verify:
            (
              result,
              assertions,
            ) => {
              assertCondition(
                result.handoff.status ===
                  "EXISTING_INQUIRY_REUSE",
                "duplicate-handoff-reuses-existing-inquiry",
                assertions,
              );
            },
        };
      }

      if (variant === 3) {
        return {
          mode:
            "ASSESS",
          input:
            baseAssessmentInput(
              sequence,
              {
                message:
                  "Emergency fire hazard and life safety risk.",
              },
            ),
          verify:
            (
              result,
              assertions,
            ) => {
              assertCondition(
                result.handoff.status ===
                  "OWNER_REVIEW_REQUIRED",
                "critical-handoff-routed-to-owner",
                assertions,
              );
            },
        };
      }

      return {
        mode:
          "ASSESS",
        input:
          baseAssessmentInput(
            sequence,
            {
              verifiedFacts: [
                {
                  key:
                    "quantity",
                  value:
                    "200",
                  source:
                    "CUSTOMER",
                },
              ],
              priorContext: {
                tenantId:
                  "tenant-ppa-industrial",
                customerRef:
                  "customer-evaluation-" +
                  pad(sequence),
                facts: [
                  {
                    key:
                      "product",
                    value:
                      "Safety shoes",
                    source:
                      "OWNER",
                  },
                ],
              },
            },
          ),
        verify:
          (
            result,
            assertions,
          ) => {
            assertCondition(
              result.handoff.status ===
                "READY_FOR_CONTROLLED_HANDOFF",
              "prior-context-completes-handoff",
              assertions,
            );

            assertCondition(
              result.continuity
                .retainedFactKeys.includes(
                  "product",
                ),
              "prior-verified-context-retained",
              assertions,
            );
          },
      };
    }

    case "owner-ready-brief": {
      const scenarios = [
        completeQuote,
        baseAssessmentInput(
          sequence,
          {
            message:
              "Complaint: damaged product received.",
            verifiedFacts: [
              {
                key:
                  "issue",
                value:
                  "Damaged product",
                source:
                  "CUSTOMER",
              },
              {
                key:
                  "product_or_order_ref",
                value:
                  "ORDER-" +
                  pad(sequence),
                source:
                  "CUSTOMER",
              },
            ],
          },
        ),
        baseAssessmentInput(
          sequence,
          {
            message:
              "Emergency fire hazard and life safety risk.",
          },
        ),
        baseAssessmentInput(
          sequence,
          {
            message:
              "Hello, please help us.",
            verifiedFacts: [],
          },
        ),
        {
          ...completeQuote,
          duplicateCandidates: [
            {
              tenantId:
                completeQuote.tenantId,
              customerRef:
                completeQuote.customerRef,
              inquiryId:
                "brief-conflict-" +
                pad(sequence),
              idempotencyKey:
                completeQuote.idempotencyKey,
              messageDigest:
                createAshaInquiryMessageDigest(
                  "Different brief request " +
                  pad(sequence),
                ),
            },
          ],
        },
      ] as const;

      return {
        mode:
          "ASSESS",
        input:
          scenarios[variant],
        verify:
          (
            result,
            assertions,
          ) => {
            assertCondition(
              result.ownerBrief
                .customerObjective.length >
                0,
              "owner-brief-customer-objective-present",
              assertions,
            );

            assertCondition(
              result.ownerBrief
                .recommendedNextAction.length >
                0,
              "owner-brief-next-action-present",
              assertions,
            );

            assertCondition(
              variant === 0
                ? result.ownerBrief
                    .ownerDecisionRequired ===
                    false
                : result.ownerBrief
                    .ownerDecisionRequired ===
                    true,
              "owner-decision-requirement-correct",
              assertions,
            );
          },
      };
    }

    case "risk-escalation-detection": {
      const scenarios = [
        baseAssessmentInput(
          sequence,
          {
            message:
              "Hello, please help.",
            verifiedFacts: [],
          },
        ),
        baseAssessmentInput(
          sequence,
          {
            message:
              "Emergency fire hazard and life safety risk.",
          },
        ),
        baseAssessmentInput(
          sequence,
          {
            priorContext: {
              tenantId:
                "tenant-ppa-industrial",
              customerRef:
                "customer-evaluation-" +
                pad(sequence),
              facts: [
                {
                  key:
                    "product",
                  value:
                    "Safety helmet",
                  source:
                    "OWNER",
                },
              ],
            },
            verifiedFacts: [
              {
                key:
                  "product",
                value:
                  "Safety gloves",
                source:
                  "CUSTOMER",
              },
              {
                key:
                  "quantity",
                value:
                  "50",
                source:
                  "CUSTOMER",
              },
            ],
          },
        ),
        {
          ...completeQuote,
          duplicateCandidates: [
            {
              tenantId:
                completeQuote.tenantId,
              customerRef:
                completeQuote.customerRef,
              inquiryId:
                "risk-conflict-" +
                pad(sequence),
              idempotencyKey:
                completeQuote.idempotencyKey,
              messageDigest:
                createAshaInquiryMessageDigest(
                  "Different risk request " +
                  pad(sequence),
                ),
            },
          ],
        },
        {
          ...completeQuote,
          duplicateCandidates: [
            {
              tenantId:
                completeQuote.tenantId,
              customerRef:
                completeQuote.customerRef,
              inquiryId:
                "risk-possible-" +
                pad(sequence),
              idempotencyKey:
                "different-risk-key-" +
                pad(sequence),
              messageDigest:
                createAshaInquiryMessageDigest(
                  completeQuote.message,
                ),
            },
          ],
        },
      ] as const;

      return {
        mode:
          "ASSESS",
        input:
          scenarios[variant],
        verify:
          (
            result,
            assertions,
          ) => {
            assertCondition(
              result.risk
                .escalationRequired ===
                true,
              "risk-escalation-required",
              assertions,
            );

            assertCondition(
              result.routing.destination ===
                "OWNER_REVIEW",
              "risk-routed-to-owner-review",
              assertions,
            );

            assertCondition(
              result.risk
                .blockedActions.length ===
                5,
              "unsafe-actions-explicitly-blocked",
              assertions,
            );
          },
      };
    }

    case "customer-continuity": {
      if (variant === 2) {
        return {
          mode:
            "EXPECT_ERROR",
          input:
            baseAssessmentInput(
              sequence,
              {
                priorContext: {
                  tenantId:
                    "tenant-other-business",
                  customerRef:
                    "customer-evaluation-" +
                    pad(sequence),
                  facts: [],
                },
              },
            ),
          expectedError:
            "cross-tenant prior context is blocked",
        };
      }

      if (variant === 3) {
        return {
          mode:
            "EXPECT_ERROR",
          input:
            baseAssessmentInput(
              sequence,
              {
                priorContext: {
                  tenantId:
                    "tenant-ppa-industrial",
                  customerRef:
                    "customer-other-business",
                  facts: [],
                },
              },
            ),
          expectedError:
            "cross-customer prior context is blocked",
        };
      }

      if (variant === 0) {
        return {
          mode:
            "ASSESS",
          input:
            baseAssessmentInput(
              sequence,
              {
                verifiedFacts: [
                  {
                    key:
                      "quantity",
                    value:
                      "150",
                    source:
                      "CUSTOMER",
                  },
                ],
                priorContext: {
                  tenantId:
                    "tenant-ppa-industrial",
                  customerRef:
                    "customer-evaluation-" +
                    pad(sequence),
                  facts: [
                    {
                      key:
                        "product",
                      value:
                        "Safety shoes",
                      source:
                        "OWNER",
                    },
                  ],
                },
              },
            ),
          verify:
            (
              result,
              assertions,
            ) => {
              assertCondition(
                result.continuity
                  .priorContextUsed ===
                  true,
                "prior-customer-context-used",
                assertions,
              );

              assertCondition(
                result.continuity
                  .retainedFactKeys.includes(
                    "product",
                  ),
                "verified-prior-fact-retained",
                assertions,
              );
            },
        };
      }

      if (variant === 1) {
        return {
          mode:
            "ASSESS",
          input:
            completeQuote,
          verify:
            (
              result,
              assertions,
            ) => {
              assertCondition(
                result.continuity
                  .priorContextUsed ===
                  false,
                "no-prior-context-not-fabricated",
                assertions,
              );

              assertCondition(
                result.continuity
                  .crossCustomerContextBlocked ===
                  true,
                "cross-customer-boundary-preserved",
                assertions,
              );
            },
        };
      }

      return {
        mode:
          "ASSESS",
        input:
          baseAssessmentInput(
            sequence,
            {
              priorContext: {
                tenantId:
                  "tenant-ppa-industrial",
                customerRef:
                  "customer-evaluation-" +
                  pad(sequence),
                facts: [
                  {
                    key:
                      "product",
                    value:
                      "Safety helmets",
                    source:
                      "OWNER",
                  },
                ],
              },
              verifiedFacts: [
                {
                  key:
                    "product",
                  value:
                    "Safety gloves",
                  source:
                    "CUSTOMER",
                },
                {
                  key:
                    "quantity",
                  value:
                    "60",
                  source:
                    "CUSTOMER",
                },
              ],
            },
          ),
        verify:
          (
            result,
            assertions,
          ) => {
            assertCondition(
              result.continuity
                .conflictingFactKeys.includes(
                  "product",
                ),
              "conflicting-continuity-fact-detected",
              assertions,
            );

            assertCondition(
              result.routing.destination ===
                "OWNER_REVIEW",
              "continuity-conflict-routed-to-owner",
              assertions,
            );
          },
      };
    }
  }
}

async function evaluateSpecialistCase(
  definition:
    AshaIndependentEvaluationCaseDefinition,
  executedAt: string,
): Promise<AshaIndependentEvaluationCaseResult> {
  const scenario =
    specialistScenario(
      definition,
    );

  const assertions:
    string[] = [];

  let observedDigest: string;

  if (
    scenario.mode ===
      "EXPECT_ERROR"
  ) {
    observedDigest =
      await captureExpectedError(
        () =>
          assessAshaSpecialistInquiry(
            scenario.input,
          ),
        scenario.expectedError,
        assertions,
      );
  }
  else {
    const result =
      assessAshaSpecialistInquiry(
        scenario.input,
      );

    scenario.verify(
      result,
      assertions,
    );

    assertCondition(
      result.safetyBoundary
        .productionDatabaseTouched ===
        false,
      "specialist-production-db-blocked",
      assertions,
    );

    assertCondition(
      result.safetyBoundary
        .externalMessageDeliveryPerformed ===
        false,
      "specialist-external-delivery-blocked",
      assertions,
    );

    assertCondition(
      result.safetyBoundary
        .liveProviderExecutionPerformed ===
        false,
      "specialist-live-provider-blocked",
      assertions,
    );

    observedDigest =
      result.assessmentDigest;
  }

  return finishCase(
    definition,
    assertions,
    observedDigest,
    executedAt,
  );
}

export async function executeAshaIndependentEvaluation(
  input:
    ExecuteAshaIndependentEvaluationInput,
): Promise<AshaIndependentEvaluationReport> {
  requireIdentifier(
    "evaluatorId",
    input.evaluatorId,
  );

  requireIdentifier(
    "ownerId",
    input.ownerId,
  );

  requireIsoDate(
    "evaluation time",
    input.evaluatedAt,
  );

  if (
    input.evaluatorId ===
      input.ownerId
  ) {
    throw new Error(
      "Asha independent evaluator must be distinct from the owner.",
    );
  }

  const results:
    AshaIndependentEvaluationCaseResult[] = [];

  for (
    const definition of
    ASHA_INDEPENDENT_EVALUATION_CASES
  ) {
    const result =
      definition.scope ===
        "FOUNDATION"
        ? await evaluateFoundationCase(
            definition,
            input.evaluatedAt,
          )
        : await evaluateSpecialistCase(
            definition,
            input.evaluatedAt,
          );

    results.push(
      result,
    );
  }

  if (
    results.length !==
      ASHA_SUPER_SPECIALIST_TOTAL_CASES
  ) {
    throw new Error(
      "Asha independent evaluation did not execute all 400 cases.",
    );
  }

  if (
    new Set(
      results.map(
        (result) =>
          result.caseId,
      ),
    ).size !==
      results.length
  ) {
    throw new Error(
      "Asha independent evaluation produced duplicate case identities.",
    );
  }

  if (
    new Set(
      results.map(
        (result) =>
          result.evidenceDigest,
      ),
    ).size !==
      results.length
  ) {
    throw new Error(
      "Asha independent evaluation produced duplicate evidence.",
    );
  }

  const foundationResults =
    results.filter(
      (result) =>
        result.scope ===
        "FOUNDATION",
    );

  const specialistResults =
    results.filter(
      (result) =>
        result.scope ===
        "SPECIALIST",
    );

  if (
    foundationResults.length !==
      ASHA_SUPER_SPECIALIST_FOUNDATION_CASES ||
    specialistResults.length !==
      ASHA_SUPER_SPECIALIST_ROLE_CASES
  ) {
    throw new Error(
      "Asha evaluation foundation or specialist totals are invalid.",
    );
  }

  const categoryCounts =
    emptyCategoryCounts();

  for (
    const result of
    foundationResults
  ) {
    if (!result.category) {
      throw new Error(
        "Foundation result category is missing.",
      );
    }

    categoryCounts[
      result.category
    ] += 1;
  }

  for (
    const category of
    AI_EMPLOYEE_QUALIFICATION_CATEGORIES
  ) {
    if (
      categoryCounts[category] !==
      AI_EMPLOYEE_QUALIFICATION_MINIMUMS[
        category
      ]
    ) {
      throw new Error(
        "Asha foundation category execution coverage is incomplete.",
      );
    }
  }

  const competencyCounts:
    Record<string, number> = {};

  for (
    const competency of
    ASHA_SUPER_SPECIALIST_COMPETENCIES
  ) {
    const count =
      specialistResults.filter(
        (result) =>
          result.competencyId ===
          competency.competencyId,
      ).length;

    if (
      count !==
        competency.minimumEvidenceCases
    ) {
      throw new Error(
        "Asha specialist competency execution coverage is incomplete.",
      );
    }

    competencyCounts[
      competency.competencyId
    ] = count;
  }

  const foundationEvidenceDigest =
    sha256(
      foundationResults.map(
        (result) => ({
          caseId:
            result.caseId,
          evidenceDigest:
            result.evidenceDigest,
        }),
      ),
    );

  const specialistEvidenceDigest =
    sha256(
      specialistResults.map(
        (result) => ({
          caseId:
            result.caseId,
          evidenceDigest:
            result.evidenceDigest,
        }),
      ),
    );

  const competencyEvidence =
    ASHA_SUPER_SPECIALIST_COMPETENCIES
      .map(
        (competency) => {
          const competencyResults =
            specialistResults.filter(
              (result) =>
                result.competencyId ===
                competency.competencyId,
            );

          return {
            competencyId:
              competency.competencyId,
            executedCases:
              competencyResults.length,
            passedCases:
              competencyResults.length,
            evidenceDigest:
              sha256(
                competencyResults.map(
                  (result) => ({
                    caseId:
                      result.caseId,
                    evidenceDigest:
                      result.evidenceDigest,
                  }),
                ),
              ),
            evaluatedAt:
              input.evaluatedAt,
          };
        },
      );

  const readiness =
    assessAshaSuperSpecialistReadiness({
      evaluationEnvironment:
        "ISOLATED_TEST",
      evidenceSource:
        "INDEPENDENT_EXECUTABLE_HARNESS",
      evaluatorId:
        input.evaluatorId,
      ownerId:
        input.ownerId,
      baseQualification: {
        totalCases:
          ASHA_SUPER_SPECIALIST_FOUNDATION_CASES,
        passedCases:
          ASHA_SUPER_SPECIALIST_FOUNDATION_CASES,
        evidenceDigest:
          foundationEvidenceDigest,
      },
      competencyEvidence,
      safetyEvidence: {
        tenantIsolationPassed:
          true,
        ownerControlPassed:
          true,
        emergencyPausePassed:
          true,
        auditEvidencePassed:
          true,
        idempotencyPassed:
          true,
        customerContextIsolationPassed:
          true,
        productionDatabaseTouched:
          false,
        externalDeliveryPerformed:
          false,
        liveProviderExecutionPerformed:
          false,
        paymentExecutionPerformed:
          false,
      },
      evaluatedAt:
        input.evaluatedAt,
    });

  if (
    readiness.formalQualificationIssued !==
      false ||
    readiness.controlledActivationAuthorized !==
      false ||
    readiness.productionReady !==
      false
  ) {
    throw new Error(
      "Asha readiness authority boundary was unexpectedly expanded.",
    );
  }

  const reportCore = {
    version:
      ASHA_INDEPENDENT_EVALUATION_VERSION,
    employeeId:
      ASHA_SUPER_SPECIALIST_STANDARD
        .employeeId,
    templateId:
      ASHA_SUPER_SPECIALIST_STANDARD
        .templateId,
    evaluatorId:
      input.evaluatorId,
    ownerId:
      input.ownerId,
    totalCases:
      ASHA_SUPER_SPECIALIST_TOTAL_CASES,
    passedCases:
      ASHA_SUPER_SPECIALIST_TOTAL_CASES,
    foundation: {
      totalCases:
        ASHA_SUPER_SPECIALIST_FOUNDATION_CASES,
      passedCases:
        ASHA_SUPER_SPECIALIST_FOUNDATION_CASES,
      categoryCounts,
      evidenceDigest:
        foundationEvidenceDigest,
    },
    specialist: {
      totalCases:
        ASHA_SUPER_SPECIALIST_ROLE_CASES,
      passedCases:
        ASHA_SUPER_SPECIALIST_ROLE_CASES,
      competencyCounts,
      evidenceDigest:
        specialistEvidenceDigest,
    },
    caseResults:
      results,
    readiness,
    assertionDerivedEvidence:
      true as const,
    hardCodedPassingEvidenceAccepted:
      false as const,
    syntheticQualificationFixtureUsedOnlyForBoundaryTesting:
      true as const,
    formalQualificationIssued:
      false as const,
    controlledActivationAuthorized:
      false as const,
    productionReady:
      false as const,
    safetyBoundary: {
      independentEvaluatorRequired:
        true,
      everyCaseExecuted:
        true,
      everyCasePassed:
        true,
      failedAssertionBlocksReport:
        true,
      duplicateEvidenceBlocked:
        true,
      ownerCertificationRequired:
        true,
      shadowModeRequired:
        true,
      controlledPilotRequired:
        true,
      liveProviderExecutionAuthorized:
        false,
      externalDeliveryAuthorized:
        false,
      paymentExecutionAuthorized:
        false,
      productionDatabaseAuthorized:
        false,
      publicLaunchAuthorized:
        false,
    } as const,
    evaluatedAt:
      input.evaluatedAt,
  };

  const report:
    AshaIndependentEvaluationReport = {
      ...reportCore,
      reportDigest:
        sha256(reportCore),
  };

  return deepFreeze(
    report,
  ) as AshaIndependentEvaluationReport;
}
