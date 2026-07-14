
import { createHash } from "node:crypto";

import type {
  AIEmployeeManifest,
  EmployeeToolMode,
  EmployeeToolRisk,
} from "./aiEmployeeManifest";

export const SKILL_TOOL_REGISTRY_VERSION =
  "nexus-skill-tool-registry-v1" as const;

export const EMPLOYEE_REGISTRY_VALIDATION_VERSION =
  "nexus-employee-registry-validation-v1" as const;

const EMPLOYEE_TOOL_MODES = [
  "READ_ONLY",
  "DRAFT_ONLY",
  "OWNER_APPROVAL_REQUIRED",
] as const satisfies readonly EmployeeToolMode[];

const EMPLOYEE_TOOL_RISKS = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
] as const satisfies readonly EmployeeToolRisk[];

export type WorkforceSkillDefinition =
  Readonly<{
    skillId: string;
    name: string;
    description: string;
    category: string;
    version: number;
    active: boolean;
  }>;

export type WorkforceToolDefinition =
  Readonly<{
    toolId: string;
    name: string;
    capability: string;
    risk: EmployeeToolRisk;
    allowedModes:
      readonly EmployeeToolMode[];
    ownerApprovalRequired: boolean;
    externalEffect: boolean;
    tenantScoped: true;
    auditRequired: true;
    active: boolean;
  }>;

export interface SkillToolRegistryInput {
  readonly skills:
    readonly WorkforceSkillDefinition[];
  readonly tools:
    readonly WorkforceToolDefinition[];
  readonly createdAt: string;
}

export interface SkillToolRegistry {
  readonly version:
    typeof SKILL_TOOL_REGISTRY_VERSION;
  readonly skills:
    readonly WorkforceSkillDefinition[];
  readonly tools:
    readonly WorkforceToolDefinition[];
  readonly safetyBoundary: Readonly<{
    tenantScopedToolsRequired: true;
    completeAuditRequired: true;
    highRiskOwnerApprovalRequired: true;
    externalEffectOwnerApprovalRequired: true;
    unknownSkillsBlocked: true;
    unknownToolsBlocked: true;
  }>;
  readonly createdAt: string;
  readonly registryDigest: string;
}

export interface EmployeeRegistryValidationReport {
  readonly version:
    typeof EMPLOYEE_REGISTRY_VALIDATION_VERSION;
  readonly employeeId: string;
  readonly manifestDigest: string;
  readonly registryDigest: string;
  readonly validatedSkillCount: number;
  readonly validatedToolGrantCount: number;
  readonly registryValidated: true;
  readonly safetyBoundary: Readonly<{
    unknownSkillsBlocked: true;
    unknownToolsBlocked: true;
    capabilityEscalationBlocked: true;
    permissionEscalationBlocked: true;
    riskMismatchBlocked: true;
  }>;
  readonly validationDigest: string;
}

export const CORE_WORKFORCE_SKILLS =
  [
    {
      skillId:
        "skill-inquiry-capture",
      name:
        "Inquiry capture",
      description:
        "Captures and structures approved customer inquiry information.",
      category:
        "sales-intake",
      version: 1,
      active: true,
    },
    {
      skillId:
        "skill-requirement-summary",
      name:
        "Requirement summary",
      description:
        "Produces a clear owner-reviewable summary of customer requirements.",
      category:
        "sales-intake",
      version: 1,
      active: true,
    },
    {
      skillId:
        "skill-owner-escalation",
      name:
        "Owner escalation",
      description:
        "Escalates uncertain, risky, or out-of-scope work with complete evidence.",
      category:
        "owner-control",
      version: 1,
      active: true,
    },
  ] as const satisfies
    readonly WorkforceSkillDefinition[];

export const CORE_WORKFORCE_TOOLS =
  [
    {
      toolId:
        "tool-inquiry-read",
      name:
        "Inquiry reader",
      capability:
        "Read tenant-scoped inquiry records",
      risk:
        "LOW",
      allowedModes: [
        "READ_ONLY",
      ],
      ownerApprovalRequired:
        false,
      externalEffect:
        false,
      tenantScoped:
        true,
      auditRequired:
        true,
      active:
        true,
    },
    {
      toolId:
        "tool-inquiry-draft",
      name:
        "Inquiry draft creator",
      capability:
        "Draft a tenant-scoped inquiry record",
      risk:
        "MEDIUM",
      allowedModes: [
        "DRAFT_ONLY",
      ],
      ownerApprovalRequired:
        false,
      externalEffect:
        false,
      tenantScoped:
        true,
      auditRequired:
        true,
      active:
        true,
    },
    {
      toolId:
        "tool-customer-message",
      name:
        "Customer message preparation",
      capability:
        "Prepare an external customer response",
      risk:
        "HIGH",
      allowedModes: [
        "OWNER_APPROVAL_REQUIRED",
      ],
      ownerApprovalRequired:
        true,
      externalEffect:
        true,
      tenantScoped:
        true,
      auditRequired:
        true,
      active:
        true,
    },
  ] as const satisfies
    readonly WorkforceToolDefinition[];

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
      "Unsupported deterministic registry value.",
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
      "createdAt must be a valid ISO date.",
    );
  }
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

function requireAllowedMode(
  mode: EmployeeToolMode,
): void {
  if (
    !EMPLOYEE_TOOL_MODES.includes(mode)
  ) {
    throw new Error(
      "Tool registry contains an invalid mode.",
    );
  }
}

function requireAllowedRisk(
  risk: EmployeeToolRisk,
): void {
  if (
    !EMPLOYEE_TOOL_RISKS.includes(risk)
  ) {
    throw new Error(
      "Tool registry contains an invalid risk.",
    );
  }
}

export function createSkillToolRegistry(
  input: SkillToolRegistryInput,
): SkillToolRegistry {
  requireIsoDate(input.createdAt);

  if (
    input.skills.length < 1 ||
    input.skills.length > 1000
  ) {
    throw new Error(
      "Skill registry must contain between 1 and 1000 skills.",
    );
  }

  if (
    input.tools.length < 1 ||
    input.tools.length > 1000
  ) {
    throw new Error(
      "Tool registry must contain between 1 and 1000 tools.",
    );
  }

  requireUnique(
    "Skill registry",
    input.skills,
    (skill) => skill.skillId,
  );

  requireUnique(
    "Tool registry",
    input.tools,
    (tool) => tool.toolId,
  );

  for (const skill of input.skills) {
    requireSafeIdentifier(
      "skillId",
      skill.skillId,
    );

    requireSafeIdentifier(
      "skill category",
      skill.category,
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

    if (
      !Number.isInteger(skill.version) ||
      skill.version < 1
    ) {
      throw new Error(
        "Skill version must be a positive integer.",
      );
    }

    if (
      typeof skill.active !== "boolean"
    ) {
      throw new Error(
        "Skill active status must be boolean.",
      );
    }
  }

  for (const tool of input.tools) {
    requireSafeIdentifier(
      "toolId",
      tool.toolId,
    );

    requireText(
      "tool name",
      tool.name,
      3,
      100,
    );

    requireText(
      "tool capability",
      tool.capability,
      3,
      160,
    );

    requireAllowedRisk(tool.risk);

    if (
      tool.allowedModes.length < 1
    ) {
      throw new Error(
        "Every tool must define at least one allowed mode.",
      );
    }

    requireUnique(
      "Tool allowed modes",
      tool.allowedModes,
      (mode) => mode,
    );

    for (
      const mode of
      tool.allowedModes
    ) {
      requireAllowedMode(mode);
    }

    if (
      tool.tenantScoped !== true ||
      tool.auditRequired !== true
    ) {
      throw new Error(
        "Every workforce tool must be tenant-scoped and audited.",
      );
    }

    if (
      (
        tool.risk === "HIGH" ||
        tool.risk === "CRITICAL"
      ) &&
      (
        tool.ownerApprovalRequired !==
          true ||
        tool.allowedModes.some(
          (mode) =>
            mode !==
            "OWNER_APPROVAL_REQUIRED",
        )
      )
    ) {
      throw new Error(
        "HIGH and CRITICAL tools must allow only owner-approved operation.",
      );
    }

    if (
      tool.externalEffect &&
      (
        tool.ownerApprovalRequired !==
          true ||
        !tool.allowedModes.includes(
          "OWNER_APPROVAL_REQUIRED",
        )
      )
    ) {
      throw new Error(
        "External-effect tools must require owner approval.",
      );
    }
  }

  const registryCore = {
    version:
      SKILL_TOOL_REGISTRY_VERSION,
    skills:
      [...input.skills]
        .sort((left, right) =>
          left.skillId.localeCompare(
            right.skillId,
          ),
        )
        .map((skill) => ({
          ...skill,
        })),
    tools:
      [...input.tools]
        .sort((left, right) =>
          left.toolId.localeCompare(
            right.toolId,
          ),
        )
        .map((tool) => ({
          ...tool,
          allowedModes: [
            ...tool.allowedModes,
          ].sort(),
        })),
    safetyBoundary: {
      tenantScopedToolsRequired: true,
      completeAuditRequired: true,
      highRiskOwnerApprovalRequired:
        true,
      externalEffectOwnerApprovalRequired:
        true,
      unknownSkillsBlocked: true,
      unknownToolsBlocked: true,
    } as const,
    createdAt:
      input.createdAt,
  };

  const registry:
    SkillToolRegistry = {
      ...registryCore,
      registryDigest:
        sha256(registryCore),
  };

  return deepFreeze(
    registry,
  ) as SkillToolRegistry;
}

export function createCoreSkillToolRegistry(
  createdAt: string,
): SkillToolRegistry {
  return createSkillToolRegistry({
    skills:
      CORE_WORKFORCE_SKILLS,
    tools:
      CORE_WORKFORCE_TOOLS,
    createdAt,
  });
}

export function validateAIEmployeeManifestAgainstRegistry(
  manifest: AIEmployeeManifest,
  registry: SkillToolRegistry,
): EmployeeRegistryValidationReport {
  const skillById =
    new Map(
      registry.skills.map(
        (skill) => [
          skill.skillId,
          skill,
        ],
      ),
    );

  const toolById =
    new Map(
      registry.tools.map(
        (tool) => [
          tool.toolId,
          tool,
        ],
      ),
    );

  for (
    const employeeSkill of
    manifest.skills
  ) {
    const registeredSkill =
      skillById.get(
        employeeSkill.skillId,
      );

    if (
      !registeredSkill ||
      !registeredSkill.active
    ) {
      throw new Error(
        "Unknown or inactive employee skill is blocked: " +
          employeeSkill.skillId,
      );
    }

    if (
      employeeSkill.name !==
        registeredSkill.name ||
      employeeSkill.description !==
        registeredSkill.description
    ) {
      throw new Error(
        "Employee skill definition does not match the canonical registry.",
      );
    }
  }

  for (
    const employeeGrant of
    manifest.toolGrants
  ) {
    const registeredTool =
      toolById.get(
        employeeGrant.toolId,
      );

    if (
      !registeredTool ||
      !registeredTool.active
    ) {
      throw new Error(
        "Unknown or inactive employee tool is blocked: " +
          employeeGrant.toolId,
      );
    }

    if (
      employeeGrant.capability !==
        registeredTool.capability
    ) {
      throw new Error(
        "Employee tool capability escalation is blocked.",
      );
    }

    if (
      employeeGrant.risk !==
        registeredTool.risk
    ) {
      throw new Error(
        "Employee tool risk mismatch is blocked.",
      );
    }

    if (
      !registeredTool.allowedModes.includes(
        employeeGrant.mode,
      )
    ) {
      throw new Error(
        "Employee tool permission escalation is blocked.",
      );
    }

    if (
      registeredTool.ownerApprovalRequired &&
      employeeGrant.mode !==
        "OWNER_APPROVAL_REQUIRED"
    ) {
      throw new Error(
        "Owner-approved tool operation cannot be downgraded.",
      );
    }
  }

  const validationCore = {
    version:
      EMPLOYEE_REGISTRY_VALIDATION_VERSION,
    employeeId:
      manifest.employeeId,
    manifestDigest:
      manifest.manifestDigest,
    registryDigest:
      registry.registryDigest,
    validatedSkillCount:
      manifest.skills.length,
    validatedToolGrantCount:
      manifest.toolGrants.length,
    registryValidated:
      true as const,
    safetyBoundary: {
      unknownSkillsBlocked: true,
      unknownToolsBlocked: true,
      capabilityEscalationBlocked:
        true,
      permissionEscalationBlocked:
        true,
      riskMismatchBlocked:
        true,
    } as const,
  };

  const report:
    EmployeeRegistryValidationReport = {
      ...validationCore,
      validationDigest:
        sha256(validationCore),
  };

  return deepFreeze(
    report,
  ) as EmployeeRegistryValidationReport;
}
