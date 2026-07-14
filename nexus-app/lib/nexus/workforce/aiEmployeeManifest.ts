
import { createHash } from "node:crypto";

export const AI_EMPLOYEE_MANIFEST_VERSION =
  "nexus-ai-employee-manifest-v1" as const;

export const AI_EMPLOYEE_DEPARTMENTS = [
  "EXECUTIVE",
  "SALES",
  "MARKETING",
  "CUSTOMER_SUCCESS",
  "FINANCE",
  "PEOPLE_OPERATIONS",
  "LEGAL_COMPLIANCE",
  "OPERATIONS",
  "PROCUREMENT",
  "INVENTORY_LOGISTICS",
  "PRODUCT_RESEARCH",
  "ENGINEERING_DATA_SECURITY",
  "ECOMMERCE_RETAIL",
  "INDUSTRY_SPECIALIST",
] as const;

export const AI_EMPLOYEE_AUTONOMY_LEVELS = [
  "OBSERVER",
  "DRAFTING_ASSISTANT",
  "CONTROLLED_OPERATOR",
  "AUTONOMOUS_SPECIALIST",
  "DEPARTMENT_MANAGER",
] as const;

export const REQUIRED_EMPLOYEE_APPROVAL_ACTIONS = [
  "EXTERNAL_COMMUNICATION",
  "CUSTOMER_DATA_MUTATION",
  "PRICING_OR_DISCOUNT_CHANGE",
  "FINANCIAL_COMMITMENT",
  "LEGAL_COMMITMENT",
  "PRODUCTION_EXECUTION",
] as const;

export const EMPLOYEE_ESCALATION_CONDITIONS = [
  "LOW_CONFIDENCE",
  "POLICY_CONFLICT",
  "CUSTOMER_COMPLAINT",
  "FINANCIAL_RISK",
  "LEGAL_OR_COMPLIANCE_RISK",
  "SECURITY_RISK",
  "TOOL_FAILURE",
  "REPEATED_FAILURE",
  "OUT_OF_SCOPE_REQUEST",
] as const;

export type AIEmployeeDepartment =
  (typeof AI_EMPLOYEE_DEPARTMENTS)[number];

export type AIEmployeeAutonomyLevel =
  (typeof AI_EMPLOYEE_AUTONOMY_LEVELS)[number];

export type EmployeeApprovalAction =
  (typeof REQUIRED_EMPLOYEE_APPROVAL_ACTIONS)[number];

export type EmployeeEscalationCondition =
  (typeof EMPLOYEE_ESCALATION_CONDITIONS)[number];

export type EmployeeToolMode =
  | "READ_ONLY"
  | "DRAFT_ONLY"
  | "OWNER_APPROVAL_REQUIRED";

export type EmployeeToolRisk =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export type CustomerMemoryAccess =
  | "NONE"
  | "READ_ONLY"
  | "WRITE_WITH_OWNER_APPROVAL";

export type EmployeeEvaluationStatus =
  | "UNQUALIFIED"
  | "QUALIFIED";

export type AIEmployeeSkill =
  Readonly<{
    skillId: string;
    name: string;
    description: string;
  }>;

export type AIEmployeeToolGrant =
  Readonly<{
    toolId: string;
    capability: string;
    mode: EmployeeToolMode;
    risk: EmployeeToolRisk;
  }>;

export type AIEmployeeKpi =
  Readonly<{
    kpiId: string;
    name: string;
    measurement: string;
    ownerVisible: true;
  }>;

export interface AIEmployeeManifestInput {
  readonly employeeId: string;
  readonly templateId: string;
  readonly displayName: string;
  readonly department: AIEmployeeDepartment;
  readonly roleTitle: string;
  readonly roleCharter: string;
  readonly autonomyLevel:
    AIEmployeeAutonomyLevel;
  readonly skills:
    readonly AIEmployeeSkill[];
  readonly toolGrants:
    readonly AIEmployeeToolGrant[];
  readonly knowledgePolicy: Readonly<{
    sourceTypes:
      readonly (
        | "TENANT_DATA"
        | "APPROVED_DOCUMENTS"
        | "CUSTOMER_MEMORY"
        | "PUBLIC_KNOWLEDGE"
      )[];
    tenantScoped: true;
    crossTenantAccess: false;
    customerMemoryAccess:
      CustomerMemoryAccess;
  }>;
  readonly approvalPolicy: Readonly<{
    requiredFor:
      readonly EmployeeApprovalAction[];
    bypassAllowed: false;
  }>;
  readonly kpis:
    readonly AIEmployeeKpi[];
  readonly escalationPolicy: Readonly<{
    maxAutonomousSteps: number;
    ownerEscalationRequired: true;
    escalateOn:
      readonly EmployeeEscalationCondition[];
  }>;
  readonly auditPolicy: Readonly<{
    everyToolCallLogged: true;
    everyStateTransitionLogged: true;
    evidenceDigestRequired: true;
  }>;
  readonly evaluation: Readonly<{
    status: EmployeeEvaluationStatus;
    testCasesPassed: number;
    testCasesRequired: number;
    adversarialTestsPassed: boolean;
    tenantIsolationPassed: boolean;
    ownerControlPassed: boolean;
    emergencyPausePassed: boolean;
  }>;
  readonly createdAt: string;
}

export interface AIEmployeeManifest
  extends AIEmployeeManifestInput {
  readonly version:
    typeof AI_EMPLOYEE_MANIFEST_VERSION;
  readonly safetyBoundary: Readonly<{
    ownerControlled: true;
    emergencyPauseRequired: true;
    crossTenantAccessAuthorized: false;
    liveProviderExecutionAuthorized: false;
    externalDeliveryAuthorized: false;
    paymentExecutionAuthorized: false;
    publicLaunchAuthorized: false;
  }>;
  readonly manifestDigest: string;
}

export interface AIEmployeeRuntimeInput {
  readonly manifest: AIEmployeeManifest;
  readonly runtimeId: string;
  readonly tenantId: string;
  readonly ownerId: string;
  readonly ownerActivated: boolean;
  readonly startedAt: string;
}

export type AIEmployeeRuntimeState =
  | "PAUSED_AWAITING_OWNER"
  | "READY_FOR_CONTROLLED_WORK";

export interface AIEmployeeRuntimeContract {
  readonly version:
    "nexus-ai-employee-runtime-v1";
  readonly runtimeId: string;
  readonly employeeId: string;
  readonly templateId: string;
  readonly manifestDigest: string;
  readonly tenantId: string;
  readonly ownerId: string;
  readonly ownerActivated: boolean;
  readonly runtimeState:
    AIEmployeeRuntimeState;
  readonly controlledWorkAuthorized:
    boolean;
  readonly authority: Readonly<{
    ownerApprovalRequired: true;
    approvalBypassAllowed: false;
    tenantScoped: true;
    crossTenantDelegationAllowed: false;
  }>;
  readonly safetyBoundary: Readonly<{
    emergencyPauseAvailable: true;
    liveProviderExecutionAuthorized: false;
    externalDeliveryAuthorized: false;
    paymentExecutionAuthorized: false;
    publicLaunchAuthorized: false;
  }>;
  readonly startedAt: string;
  readonly runtimeDigest: string;
}

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9:_-]{2,63}$/;

const FORBIDDEN_IDENTIFIER_PATTERN =
  /(secret|token|password|session|cookie|csrf|authorization|bearer)/i;

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
            stableStringify(record[key]),
        )
        .join(",") +
      "}"
    );
  }

  const primitive =
    JSON.stringify(value);

  if (primitive === undefined) {
    throw new Error(
      "Unsupported value in deterministic AI employee contract.",
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

function requireSafeIdentifier(
  label: string,
  value: string,
): string {
  if (
    typeof value !== "string" ||
    value !== value.trim() ||
    !SAFE_IDENTIFIER_PATTERN.test(value)
  ) {
    throw new Error(
      label +
        " must be a canonical lowercase safe identifier.",
    );
  }

  if (
    FORBIDDEN_IDENTIFIER_PATTERN.test(
      value,
    )
  ) {
    throw new Error(
      label +
        " contains a credential-bearing term.",
    );
  }

  return value;
}

function requireText(
  label: string,
  value: string,
  minimumLength: number,
  maximumLength: number,
): string {
  if (
    typeof value !== "string" ||
    value !== value.trim() ||
    value.length < minimumLength ||
    value.length > maximumLength
  ) {
    throw new Error(
      label +
        " must be normalized text between " +
        minimumLength +
        " and " +
        maximumLength +
        " characters.",
    );
  }

  return value;
}

function requireIsoDate(
  label: string,
  value: string,
): string {
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

  return value;
}

function requireUnique<T>(
  label: string,
  values: readonly T[],
  identity: (value: T) => string,
): void {
  const identities =
    values.map(identity);

  if (
    new Set(identities).size !==
    identities.length
  ) {
    throw new Error(
      label +
        " must not contain duplicates.",
    );
  }
}

function assertExactApprovalActions(
  actions:
    readonly EmployeeApprovalAction[],
): void {
  const actual =
    [...actions].sort();

  const expected =
    [
      ...REQUIRED_EMPLOYEE_APPROVAL_ACTIONS,
    ].sort();

  if (
    actual.length !== expected.length ||
    actual.some(
      (action, index) =>
        action !== expected[index],
    )
  ) {
    throw new Error(
      "Employee approval policy must contain every required owner-controlled action.",
    );
  }
}

function assertQualifiedEvaluation(
  input: AIEmployeeManifestInput,
): void {
  const evaluation =
    input.evaluation;

  if (
    evaluation.status ===
    "UNQUALIFIED"
  ) {
    return;
  }

  if (
    evaluation.testCasesRequired < 100 ||
    evaluation.testCasesPassed !==
      evaluation.testCasesRequired ||
    !evaluation.adversarialTestsPassed ||
    !evaluation.tenantIsolationPassed ||
    !evaluation.ownerControlPassed ||
    !evaluation.emergencyPausePassed
  ) {
    throw new Error(
      "A QUALIFIED AI employee must pass at least 100 tests and every mandatory safety evaluation.",
    );
  }
}

export function createAIEmployeeManifest(
  input: AIEmployeeManifestInput,
): AIEmployeeManifest {
  requireSafeIdentifier(
    "employeeId",
    input.employeeId,
  );

  requireSafeIdentifier(
    "templateId",
    input.templateId,
  );

  requireText(
    "displayName",
    input.displayName,
    3,
    80,
  );

  requireText(
    "roleTitle",
    input.roleTitle,
    3,
    100,
  );

  requireText(
    "roleCharter",
    input.roleCharter,
    30,
    1000,
  );

  requireIsoDate(
    "createdAt",
    input.createdAt,
  );

  if (
    !AI_EMPLOYEE_DEPARTMENTS.includes(
      input.department,
    )
  ) {
    throw new Error(
      "AI employee department is invalid.",
    );
  }

  if (
    !AI_EMPLOYEE_AUTONOMY_LEVELS.includes(
      input.autonomyLevel,
    )
  ) {
    throw new Error(
      "AI employee autonomy level is invalid.",
    );
  }

  if (
    input.skills.length < 1 ||
    input.skills.length > 50
  ) {
    throw new Error(
      "AI employee must contain between 1 and 50 skills.",
    );
  }

  if (
    input.toolGrants.length > 50
  ) {
    throw new Error(
      "AI employee cannot contain more than 50 tool grants.",
    );
  }

  if (
    input.kpis.length < 1 ||
    input.kpis.length > 20
  ) {
    throw new Error(
      "AI employee must contain between 1 and 20 KPIs.",
    );
  }

  requireUnique(
    "AI employee skills",
    input.skills,
    (skill) => skill.skillId,
  );

  requireUnique(
    "AI employee tool grants",
    input.toolGrants,
    (grant) => grant.toolId,
  );

  requireUnique(
    "AI employee KPIs",
    input.kpis,
    (kpi) => kpi.kpiId,
  );

  requireUnique(
    "AI employee knowledge sources",
    input.knowledgePolicy
      .sourceTypes,
    (source) => source,
  );

  requireUnique(
    "AI employee escalation conditions",
    input.escalationPolicy
      .escalateOn,
    (condition) => condition,
  );

  for (
    const skill of
    input.skills
  ) {
    requireSafeIdentifier(
      "skillId",
      skill.skillId,
    );

    requireText(
      "skill name",
      skill.name,
      3,
      80,
    );

    requireText(
      "skill description",
      skill.description,
      10,
      300,
    );
  }

  for (
    const grant of
    input.toolGrants
  ) {
    requireSafeIdentifier(
      "toolId",
      grant.toolId,
    );

    requireText(
      "tool capability",
      grant.capability,
      3,
      120,
    );

    if (
      (
        grant.risk === "HIGH" ||
        grant.risk === "CRITICAL"
      ) &&
      grant.mode !==
        "OWNER_APPROVAL_REQUIRED"
    ) {
      throw new Error(
        "HIGH and CRITICAL tool grants must require owner approval.",
      );
    }
  }

  for (
    const kpi of
    input.kpis
  ) {
    requireSafeIdentifier(
      "kpiId",
      kpi.kpiId,
    );

    requireText(
      "KPI name",
      kpi.name,
      3,
      100,
    );

    requireText(
      "KPI measurement",
      kpi.measurement,
      5,
      300,
    );

    if (
      kpi.ownerVisible !== true
    ) {
      throw new Error(
        "Every AI employee KPI must be owner-visible.",
      );
    }
  }

  if (
    input.knowledgePolicy
      .tenantScoped !== true ||
    input.knowledgePolicy
      .crossTenantAccess !== false
  ) {
    throw new Error(
      "AI employee knowledge must remain tenant-scoped with cross-tenant access blocked.",
    );
  }

  if (
    input.knowledgePolicy
      .customerMemoryAccess !==
      "NONE" &&
    !input.knowledgePolicy
      .sourceTypes.includes(
        "CUSTOMER_MEMORY",
      )
  ) {
    throw new Error(
      "Customer memory access requires CUSTOMER_MEMORY in approved knowledge sources.",
    );
  }

  assertExactApprovalActions(
    input.approvalPolicy
      .requiredFor,
  );

  if (
    input.approvalPolicy
      .bypassAllowed !== false
  ) {
    throw new Error(
      "Owner approval bypass must remain blocked.",
    );
  }

  if (
    !Number.isInteger(
      input.escalationPolicy
        .maxAutonomousSteps,
    ) ||
    input.escalationPolicy
      .maxAutonomousSteps < 1 ||
    input.escalationPolicy
      .maxAutonomousSteps > 20
  ) {
    throw new Error(
      "maxAutonomousSteps must be an integer between 1 and 20.",
    );
  }

  if (
    input.escalationPolicy
      .ownerEscalationRequired !== true
  ) {
    throw new Error(
      "Owner escalation must remain required.",
    );
  }

  if (
    input.auditPolicy
      .everyToolCallLogged !== true ||
    input.auditPolicy
      .everyStateTransitionLogged !==
      true ||
    input.auditPolicy
      .evidenceDigestRequired !== true
  ) {
    throw new Error(
      "Complete employee audit evidence is required.",
    );
  }

  assertQualifiedEvaluation(input);

  const manifestCore = {
    version:
      AI_EMPLOYEE_MANIFEST_VERSION,
    employeeId:
      input.employeeId,
    templateId:
      input.templateId,
    displayName:
      input.displayName,
    department:
      input.department,
    roleTitle:
      input.roleTitle,
    roleCharter:
      input.roleCharter,
    autonomyLevel:
      input.autonomyLevel,
    skills:
      input.skills.map(
        (skill) => ({
          ...skill,
        }),
      ),
    toolGrants:
      input.toolGrants.map(
        (grant) => ({
          ...grant,
        }),
      ),
    knowledgePolicy: {
      ...input.knowledgePolicy,
      sourceTypes: [
        ...input.knowledgePolicy
          .sourceTypes,
      ],
    },
    approvalPolicy: {
      ...input.approvalPolicy,
      requiredFor: [
        ...input.approvalPolicy
          .requiredFor,
      ],
    },
    kpis:
      input.kpis.map(
        (kpi) => ({
          ...kpi,
        }),
      ),
    escalationPolicy: {
      ...input.escalationPolicy,
      escalateOn: [
        ...input.escalationPolicy
          .escalateOn,
      ],
    },
    auditPolicy: {
      ...input.auditPolicy,
    },
    evaluation: {
      ...input.evaluation,
    },
    createdAt:
      input.createdAt,
    safetyBoundary: {
      ownerControlled: true,
      emergencyPauseRequired: true,
      crossTenantAccessAuthorized:
        false,
      liveProviderExecutionAuthorized:
        false,
      externalDeliveryAuthorized:
        false,
      paymentExecutionAuthorized:
        false,
      publicLaunchAuthorized:
        false,
    } as const,
  };

  const manifest:
    AIEmployeeManifest = {
      ...manifestCore,
      manifestDigest:
        sha256(manifestCore),
    };

  return deepFreeze(
    manifest,
  ) as AIEmployeeManifest;
}

export function createAIEmployeeRuntimeContract(
  input: AIEmployeeRuntimeInput,
): AIEmployeeRuntimeContract {
  requireSafeIdentifier(
    "runtimeId",
    input.runtimeId,
  );

  requireSafeIdentifier(
    "tenantId",
    input.tenantId,
  );

  requireSafeIdentifier(
    "ownerId",
    input.ownerId,
  );

  requireIsoDate(
    "startedAt",
    input.startedAt,
  );

  if (
    input.ownerActivated &&
    input.manifest.evaluation.status !==
      "QUALIFIED"
  ) {
    throw new Error(
      "An unqualified AI employee cannot be activated.",
    );
  }

  const controlledWorkAuthorized =
    input.ownerActivated &&
    input.manifest.evaluation.status ===
      "QUALIFIED";

  const runtimeCore = {
    version:
      "nexus-ai-employee-runtime-v1" as const,
    runtimeId:
      input.runtimeId,
    employeeId:
      input.manifest.employeeId,
    templateId:
      input.manifest.templateId,
    manifestDigest:
      input.manifest.manifestDigest,
    tenantId:
      input.tenantId,
    ownerId:
      input.ownerId,
    ownerActivated:
      input.ownerActivated,
    runtimeState:
      controlledWorkAuthorized
        ? "READY_FOR_CONTROLLED_WORK" as const
        : "PAUSED_AWAITING_OWNER" as const,
    controlledWorkAuthorized,
    authority: {
      ownerApprovalRequired: true,
      approvalBypassAllowed: false,
      tenantScoped: true,
      crossTenantDelegationAllowed:
        false,
    } as const,
    safetyBoundary: {
      emergencyPauseAvailable: true,
      liveProviderExecutionAuthorized:
        false,
      externalDeliveryAuthorized:
        false,
      paymentExecutionAuthorized:
        false,
      publicLaunchAuthorized:
        false,
    } as const,
    startedAt:
      input.startedAt,
  };

  const runtime:
    AIEmployeeRuntimeContract = {
      ...runtimeCore,
      runtimeDigest:
        sha256(runtimeCore),
    };

  return deepFreeze(
    runtime,
  ) as AIEmployeeRuntimeContract;
}
