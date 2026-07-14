
import { createHash } from "node:crypto";

import {
  REQUIRED_EMPLOYEE_APPROVAL_ACTIONS,
  createAIEmployeeManifest,
  type AIEmployeeDepartment,
  type AIEmployeeManifest,
  type AIEmployeeManifestInput,
} from "./aiEmployeeManifest";

import {
  createCoreSkillToolRegistry,
  validateAIEmployeeManifestAgainstRegistry,
  type SkillToolRegistry,
} from "./skillToolRegistry";

export const EMPLOYEE_TEMPLATE_REGISTRY_VERSION =
  "nexus-employee-template-registry-v1" as const;

export const OFFICIAL_LAUNCH_EMPLOYEE_CATALOG_VERSION =
  "nexus-official-launch-employee-catalog-v1" as const;

export type EmployeeTemplateStatus =
  | "REGISTERED_UNQUALIFIED"
  | "QUALIFIED";

export interface AIEmployeeTemplateDefinition {
  readonly templateId: string;
  readonly employeeId: string;
  readonly employeeCode: string;
  readonly publicName: string;
  readonly officialRole: string;
  readonly department:
    AIEmployeeDepartment;
  readonly managerRoleKey: string;
  readonly launchSequence: number;
  readonly manifestInput:
    AIEmployeeManifestInput;
}

export interface AIEmployeeTemplateRecord {
  readonly templateId: string;
  readonly employeeId: string;
  readonly employeeCode: string;
  readonly publicName: string;
  readonly officialRole: string;
  readonly department:
    AIEmployeeDepartment;
  readonly managerRoleKey: string;
  readonly launchSequence: number;
  readonly status:
    EmployeeTemplateStatus;
  readonly controlledActivationEligible:
    boolean;
  readonly manifest:
    AIEmployeeManifest;
  readonly skillToolValidationDigest:
    string;
  readonly safetyBoundary: Readonly<{
    ownerControlled: true;
    tenantIsolationRequired: true;
    unqualifiedActivationBlocked: true;
    externalDeliveryAuthorized: false;
    liveProviderExecutionAuthorized: false;
    paymentExecutionAuthorized: false;
    publicLaunchAuthorized: false;
  }>;
  readonly templateDigest: string;
}

export interface AIEmployeeTemplateRegistryInput {
  readonly templates:
    readonly AIEmployeeTemplateDefinition[];
  readonly skillToolRegistry:
    SkillToolRegistry;
  readonly createdAt: string;
}

export interface AIEmployeeTemplateRegistry {
  readonly version:
    typeof EMPLOYEE_TEMPLATE_REGISTRY_VERSION;
  readonly catalogVersion:
    typeof OFFICIAL_LAUNCH_EMPLOYEE_CATALOG_VERSION;
  readonly templates:
    readonly AIEmployeeTemplateRecord[];
  readonly registeredTemplateCount:
    number;
  readonly qualifiedTemplateCount:
    number;
  readonly activationEligibleTemplateCount:
    number;
  readonly skillToolRegistryDigest:
    string;
  readonly safetyBoundary: Readonly<{
    canonicalSkillValidationRequired: true;
    canonicalToolValidationRequired: true;
    duplicateEmployeeIdentityBlocked: true;
    duplicateLaunchSequenceBlocked: true;
    unqualifiedActivationBlocked: true;
    ownerControlRequired: true;
    tenantIsolationRequired: true;
  }>;
  readonly createdAt: string;
  readonly registryDigest: string;
}

export const ASHA_INQUIRY_INTAKE_TEMPLATE =
  {
    templateId:
      "template-asha-inquiry-intake-v1",
    employeeId:
      "employee-asha-inquiry-intake-v1",
    employeeCode:
      "nx-sales-003",
    publicName:
      "Asha",
    officialRole:
      "AI Inquiry Intake Executive",
    department:
      "SALES",
    managerRoleKey:
      "founder-chief-of-staff",
    launchSequence:
      3,
    manifestInput: {
      employeeId:
        "employee-asha-inquiry-intake-v1",
      templateId:
        "template-asha-inquiry-intake-v1",
      displayName:
        "Asha",
      department:
        "SALES",
      roleTitle:
        "AI Inquiry Intake Executive",
      roleCharter:
        "Capture every authorized customer inquiry accurately, structure the requirement clearly, preserve tenant isolation, and escalate uncertainty or risk to the owner.",
      autonomyLevel:
        "DRAFTING_ASSISTANT",
      skills: [
        {
          skillId:
            "skill-inquiry-capture",
          name:
            "Inquiry capture",
          description:
            "Captures and structures approved customer inquiry information.",
        },
        {
          skillId:
            "skill-requirement-summary",
          name:
            "Requirement summary",
          description:
            "Produces a clear owner-reviewable summary of customer requirements.",
        },
        {
          skillId:
            "skill-owner-escalation",
          name:
            "Owner escalation",
          description:
            "Escalates uncertain, risky, or out-of-scope work with complete evidence.",
        },
      ],
      toolGrants: [
        {
          toolId:
            "tool-inquiry-read",
          capability:
            "Read tenant-scoped inquiry records",
          mode:
            "READ_ONLY",
          risk:
            "LOW",
        },
        {
          toolId:
            "tool-inquiry-draft",
          capability:
            "Draft a tenant-scoped inquiry record",
          mode:
            "DRAFT_ONLY",
          risk:
            "MEDIUM",
        },
        {
          toolId:
            "tool-customer-message",
          capability:
            "Prepare an external customer response",
          mode:
            "OWNER_APPROVAL_REQUIRED",
          risk:
            "HIGH",
        },
      ],
      knowledgePolicy: {
        sourceTypes: [
          "TENANT_DATA",
          "APPROVED_DOCUMENTS",
          "CUSTOMER_MEMORY",
        ],
        tenantScoped: true,
        crossTenantAccess: false,
        customerMemoryAccess:
          "READ_ONLY",
      },
      approvalPolicy: {
        requiredFor:
          REQUIRED_EMPLOYEE_APPROVAL_ACTIONS,
        bypassAllowed: false,
      },
      kpis: [
        {
          kpiId:
            "kpi-asha-inquiry-accuracy",
          name:
            "Inquiry capture accuracy",
          measurement:
            "Percentage of approved inquiry fields captured without owner correction.",
          ownerVisible: true,
        },
        {
          kpiId:
            "kpi-asha-response-readiness",
          name:
            "Response readiness",
          measurement:
            "Percentage of inquiry drafts that are complete and ready for owner review.",
          ownerVisible: true,
        },
        {
          kpiId:
            "kpi-asha-escalation-quality",
          name:
            "Escalation quality",
          measurement:
            "Percentage of escalations containing clear evidence, risk, and next action.",
          ownerVisible: true,
        },
      ],
      escalationPolicy: {
        maxAutonomousSteps: 5,
        ownerEscalationRequired: true,
        escalateOn: [
          "LOW_CONFIDENCE",
          "POLICY_CONFLICT",
          "CUSTOMER_COMPLAINT",
          "FINANCIAL_RISK",
          "LEGAL_OR_COMPLIANCE_RISK",
          "SECURITY_RISK",
          "TOOL_FAILURE",
          "REPEATED_FAILURE",
          "OUT_OF_SCOPE_REQUEST",
        ],
      },
      auditPolicy: {
        everyToolCallLogged: true,
        everyStateTransitionLogged: true,
        evidenceDigestRequired: true,
      },
      evaluation: {
        status:
          "UNQUALIFIED",
        testCasesPassed:
          0,
        testCasesRequired:
          100,
        adversarialTestsPassed:
          false,
        tenantIsolationPassed:
          false,
        ownerControlPassed:
          false,
        emergencyPausePassed:
          false,
      },
      createdAt:
        "2026-07-14T22:30:00.000Z",
    },
  } as const satisfies
    AIEmployeeTemplateDefinition;

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
      "Unsupported deterministic employee template value.",
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
): void {
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
}

function requireText(
  label: string,
  value: string,
  minimumLength: number,
  maximumLength: number,
): void {
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
}

function requireIsoDate(
  value: string,
): void {
  if (
    typeof value !== "string" ||
    value !== value.trim() ||
    Number.isNaN(Date.parse(value))
  ) {
    throw new Error(
      "Employee template registry createdAt must be a valid ISO date.",
    );
  }
}

function requireUnique<T>(
  label: string,
  values: readonly T[],
  identity: (value: T) => string | number,
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

function validateTemplateMetadata(
  template:
    AIEmployeeTemplateDefinition,
): void {
  requireSafeIdentifier(
    "templateId",
    template.templateId,
  );

  requireSafeIdentifier(
    "employeeId",
    template.employeeId,
  );

  requireSafeIdentifier(
    "employeeCode",
    template.employeeCode,
  );

  requireSafeIdentifier(
    "managerRoleKey",
    template.managerRoleKey,
  );

  requireText(
    "publicName",
    template.publicName,
    2,
    40,
  );

  requireText(
    "officialRole",
    template.officialRole,
    5,
    100,
  );

  if (
    !Number.isInteger(
      template.launchSequence,
    ) ||
    template.launchSequence < 1 ||
    template.launchSequence > 500
  ) {
    throw new Error(
      "Employee launch sequence must be an integer between 1 and 500.",
    );
  }

  if (
    template.templateId !==
      template.manifestInput
        .templateId ||
    template.employeeId !==
      template.manifestInput
        .employeeId ||
    template.publicName !==
      template.manifestInput
        .displayName ||
    template.officialRole !==
      template.manifestInput
        .roleTitle ||
    template.department !==
      template.manifestInput
        .department
  ) {
    throw new Error(
      "Employee template metadata must exactly match its manifest input.",
    );
  }
}

export function createAIEmployeeTemplateRegistry(
  input:
    AIEmployeeTemplateRegistryInput,
): AIEmployeeTemplateRegistry {
  requireIsoDate(input.createdAt);

  if (
    input.templates.length < 1 ||
    input.templates.length > 500
  ) {
    throw new Error(
      "Employee template registry must contain between 1 and 500 templates.",
    );
  }

  requireUnique(
    "Employee template IDs",
    input.templates,
    (template) =>
      template.templateId,
  );

  requireUnique(
    "Employee IDs",
    input.templates,
    (template) =>
      template.employeeId,
  );

  requireUnique(
    "Employee codes",
    input.templates,
    (template) =>
      template.employeeCode,
  );

  requireUnique(
    "Employee launch sequences",
    input.templates,
    (template) =>
      template.launchSequence,
  );

  const records =
    input.templates.map(
      (template) => {
        validateTemplateMetadata(
          template,
        );

        const manifest =
          createAIEmployeeManifest(
            template.manifestInput,
          );

        const validation =
          validateAIEmployeeManifestAgainstRegistry(
            manifest,
            input.skillToolRegistry,
          );

        const status:
          EmployeeTemplateStatus =
            manifest.evaluation
              .status ===
            "QUALIFIED"
              ? "QUALIFIED"
              : "REGISTERED_UNQUALIFIED";

        const recordCore = {
          templateId:
            template.templateId,
          employeeId:
            template.employeeId,
          employeeCode:
            template.employeeCode,
          publicName:
            template.publicName,
          officialRole:
            template.officialRole,
          department:
            template.department,
          managerRoleKey:
            template.managerRoleKey,
          launchSequence:
            template.launchSequence,
          status,
          controlledActivationEligible:
            status === "QUALIFIED",
          manifest,
          skillToolValidationDigest:
            validation.validationDigest,
          safetyBoundary: {
            ownerControlled: true,
            tenantIsolationRequired:
              true,
            unqualifiedActivationBlocked:
              true,
            externalDeliveryAuthorized:
              false,
            liveProviderExecutionAuthorized:
              false,
            paymentExecutionAuthorized:
              false,
            publicLaunchAuthorized:
              false,
          } as const,
        };

        const record:
          AIEmployeeTemplateRecord = {
            ...recordCore,
            templateDigest:
              sha256(recordCore),
          };

        return record;
      },
    )
      .sort(
        (left, right) =>
          left.launchSequence -
            right.launchSequence ||
          left.templateId.localeCompare(
            right.templateId,
          ),
      );

  const qualifiedTemplateCount =
    records.filter(
      (record) =>
        record.status ===
        "QUALIFIED",
    ).length;

  const activationEligibleTemplateCount =
    records.filter(
      (record) =>
        record
          .controlledActivationEligible,
    ).length;

  const registryCore = {
    version:
      EMPLOYEE_TEMPLATE_REGISTRY_VERSION,
    catalogVersion:
      OFFICIAL_LAUNCH_EMPLOYEE_CATALOG_VERSION,
    templates:
      records,
    registeredTemplateCount:
      records.length,
    qualifiedTemplateCount,
    activationEligibleTemplateCount,
    skillToolRegistryDigest:
      input.skillToolRegistry
        .registryDigest,
    safetyBoundary: {
      canonicalSkillValidationRequired:
        true,
      canonicalToolValidationRequired:
        true,
      duplicateEmployeeIdentityBlocked:
        true,
      duplicateLaunchSequenceBlocked:
        true,
      unqualifiedActivationBlocked:
        true,
      ownerControlRequired:
        true,
      tenantIsolationRequired:
        true,
    } as const,
    createdAt:
      input.createdAt,
  };

  const registry:
    AIEmployeeTemplateRegistry = {
      ...registryCore,
      registryDigest:
        sha256(registryCore),
    };

  return deepFreeze(
    registry,
  ) as AIEmployeeTemplateRegistry;
}

export function createCoreLaunchEmployeeTemplateRegistry(
  createdAt: string,
): AIEmployeeTemplateRegistry {
  const skillToolRegistry =
    createCoreSkillToolRegistry(
      createdAt,
    );

  return createAIEmployeeTemplateRegistry({
    templates: [
      ASHA_INQUIRY_INTAKE_TEMPLATE,
    ],
    skillToolRegistry,
    createdAt,
  });
}

export function findAIEmployeeTemplate(
  registry:
    AIEmployeeTemplateRegistry,
  query: string,
): AIEmployeeTemplateRecord | undefined {
  const normalizedQuery =
    query.trim().toLowerCase();

  if (
    normalizedQuery.length === 0
  ) {
    throw new Error(
      "Employee template search query cannot be empty.",
    );
  }

  return registry.templates.find(
    (template) =>
      [
        template.templateId,
        template.employeeId,
        template.employeeCode,
        template.publicName,
        template.officialRole,
      ].some(
        (candidate) =>
          candidate.toLowerCase() ===
          normalizedQuery,
      ),
  );
}
