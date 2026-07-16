
import {
  describe,
  expect,
  it,
} from "vitest";

import {
  REQUIRED_EMPLOYEE_APPROVAL_ACTIONS,
  createAIEmployeeManifest,
  type AIEmployeeManifestInput,
} from "../aiEmployeeManifest";

import {
  CORE_WORKFORCE_SKILLS,
  CORE_WORKFORCE_TOOLS,
  createCoreSkillToolRegistry,
  createSkillToolRegistry,
  validateAIEmployeeManifestAgainstRegistry,
} from "../skillToolRegistry";

function validEmployeeInput(
  overrides:
    Partial<AIEmployeeManifestInput> = {},
): AIEmployeeManifestInput {
  return {
    employeeId:
      "employee-inquiry-intake-v1",
    templateId:
      "template-inquiry-intake-v1",
    displayName:
      "Inquiry Intake Executive",
    department:
      "SALES",
    roleTitle:
      "AI Inquiry Intake Executive",
    roleCharter:
      "Capture every authorized customer inquiry accurately, preserve tenant isolation, prepare structured work, and escalate uncertainty to the owner.",
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
          "kpi-inquiry-capture-accuracy",
        name:
          "Inquiry capture accuracy",
        measurement:
          "Percentage of approved inquiry fields captured without correction.",
        ownerVisible: true,
      },
    ],
    escalationPolicy: {
      maxAutonomousSteps: 5,
      ownerEscalationRequired:
        true,
      escalateOn: [
        "LOW_CONFIDENCE",
        "POLICY_CONFLICT",
        "TOOL_FAILURE",
        "OUT_OF_SCOPE_REQUEST",
      ],
    },
    auditPolicy: {
      everyToolCallLogged: true,
      everyStateTransitionLogged:
        true,
      evidenceDigestRequired: true,
    },
    evaluation: {
      status:
        "QUALIFIED",
      testCasesPassed: 100,
      testCasesRequired: 100,
      adversarialTestsPassed:
        true,
      tenantIsolationPassed:
        true,
      ownerControlPassed:
        true,
      emergencyPausePassed:
        true,
    },
    createdAt:
      "2026-07-14T21:00:00.000Z",
    ...overrides,
  };
}

describe(
  "workforce skill and tool registry",
  () => {
    it(
      "creates an immutable core registry",
      () => {
        const registry =
          createCoreSkillToolRegistry(
            "2026-07-14T21:05:00.000Z",
          );

        expect(
          registry.skills,
        ).toHaveLength(6);

        expect(
          registry.tools,
        ).toHaveLength(5);

        expect(
          registry.registryDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          Object.isFrozen(registry),
        ).toBe(true);

        expect(
          Object.isFrozen(
            registry.tools,
          ),
        ).toBe(true);
      },
    );

    it(
      "produces deterministic registry evidence",
      () => {
        const first =
          createSkillToolRegistry({
            skills:
              CORE_WORKFORCE_SKILLS,
            tools:
              CORE_WORKFORCE_TOOLS,
            createdAt:
              "2026-07-14T21:05:00.000Z",
          });

        const second =
          createSkillToolRegistry({
            skills: [
              ...CORE_WORKFORCE_SKILLS,
            ].reverse(),
            tools: [
              ...CORE_WORKFORCE_TOOLS,
            ].reverse(),
            createdAt:
              "2026-07-14T21:05:00.000Z",
          });

        expect(
          first.registryDigest,
        ).toBe(
          second.registryDigest,
        );
      },
    );

    it(
      "blocks duplicate skill and tool IDs",
      () => {
        expect(() =>
          createSkillToolRegistry({
            skills: [
              CORE_WORKFORCE_SKILLS[0],
              CORE_WORKFORCE_SKILLS[0],
            ],
            tools:
              CORE_WORKFORCE_TOOLS,
            createdAt:
              "2026-07-14T21:05:00.000Z",
          }),
        ).toThrow(
          "Skill registry must not contain duplicates",
        );

        expect(() =>
          createSkillToolRegistry({
            skills:
              CORE_WORKFORCE_SKILLS,
            tools: [
              CORE_WORKFORCE_TOOLS[0],
              CORE_WORKFORCE_TOOLS[0],
            ],
            createdAt:
              "2026-07-14T21:05:00.000Z",
          }),
        ).toThrow(
          "Tool registry must not contain duplicates",
        );
      },
    );

    it(
      "blocks unsafe high-risk tool configuration",
      () => {
        expect(() =>
          createSkillToolRegistry({
            skills:
              CORE_WORKFORCE_SKILLS,
            tools: [
              {
                ...CORE_WORKFORCE_TOOLS[2],
                allowedModes: [
                  "DRAFT_ONLY",
                ],
                ownerApprovalRequired:
                  false,
              },
            ],
            createdAt:
              "2026-07-14T21:05:00.000Z",
          }),
        ).toThrow(
          "HIGH and CRITICAL tools must allow only owner-approved operation",
        );
      },
    );

    it(
      "blocks external-effect tools without owner approval",
      () => {
        expect(() =>
          createSkillToolRegistry({
            skills:
              CORE_WORKFORCE_SKILLS,
            tools: [
              {
                ...CORE_WORKFORCE_TOOLS[1],
                externalEffect:
                  true,
              },
            ],
            createdAt:
              "2026-07-14T21:05:00.000Z",
          }),
        ).toThrow(
          "External-effect tools must require owner approval",
        );
      },
    );

    it(
      "validates a qualified employee against canonical registries",
      () => {
        const registry =
          createCoreSkillToolRegistry(
            "2026-07-14T21:05:00.000Z",
          );

        const employee =
          createAIEmployeeManifest(
            validEmployeeInput(),
          );

        const report =
          validateAIEmployeeManifestAgainstRegistry(
            employee,
            registry,
          );

        expect(
          report.registryValidated,
        ).toBe(true);

        expect(
          report.validatedSkillCount,
        ).toBe(2);

        expect(
          report.validatedToolGrantCount,
        ).toBe(3);

        expect(
          report.validationDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          Object.isFrozen(report),
        ).toBe(true);
      },
    );

    it(
      "blocks unknown employee skills",
      () => {
        const registry =
          createCoreSkillToolRegistry(
            "2026-07-14T21:05:00.000Z",
          );

        const employee =
          createAIEmployeeManifest(
            validEmployeeInput({
              skills: [
                {
                  skillId:
                    "skill-unknown-work",
                  name:
                    "Unknown work",
                  description:
                    "Attempts to use an unregistered employee skill.",
                },
              ],
            }),
          );

        expect(() =>
          validateAIEmployeeManifestAgainstRegistry(
            employee,
            registry,
          ),
        ).toThrow(
          "Unknown or inactive employee skill is blocked",
        );
      },
    );

    it(
      "blocks unknown employee tools",
      () => {
        const registry =
          createCoreSkillToolRegistry(
            "2026-07-14T21:05:00.000Z",
          );

        const employee =
          createAIEmployeeManifest(
            validEmployeeInput({
              toolGrants: [
                {
                  toolId:
                    "tool-unknown-action",
                  capability:
                    "Attempt an unknown action",
                  mode:
                    "READ_ONLY",
                  risk:
                    "LOW",
                },
              ],
            }),
          );

        expect(() =>
          validateAIEmployeeManifestAgainstRegistry(
            employee,
            registry,
          ),
        ).toThrow(
          "Unknown or inactive employee tool is blocked",
        );
      },
    );

    it(
      "blocks capability escalation",
      () => {
        const registry =
          createCoreSkillToolRegistry(
            "2026-07-14T21:05:00.000Z",
          );

        const employee =
          createAIEmployeeManifest(
            validEmployeeInput({
              toolGrants: [
                {
                  toolId:
                    "tool-inquiry-read",
                  capability:
                    "Delete every inquiry record",
                  mode:
                    "READ_ONLY",
                  risk:
                    "LOW",
                },
              ],
            }),
          );

        expect(() =>
          validateAIEmployeeManifestAgainstRegistry(
            employee,
            registry,
          ),
        ).toThrow(
          "capability escalation is blocked",
        );
      },
    );

    it(
      "blocks permission escalation",
      () => {
        const registry =
          createCoreSkillToolRegistry(
            "2026-07-14T21:05:00.000Z",
          );

        const employee =
          createAIEmployeeManifest(
            validEmployeeInput({
              toolGrants: [
                {
                  toolId:
                    "tool-inquiry-read",
                  capability:
                    "Read tenant-scoped inquiry records",
                  mode:
                    "DRAFT_ONLY",
                  risk:
                    "LOW",
                },
              ],
            }),
          );

        expect(() =>
          validateAIEmployeeManifestAgainstRegistry(
            employee,
            registry,
          ),
        ).toThrow(
          "permission escalation is blocked",
        );
      },
    );

    it(
      "blocks tool risk mismatch",
      () => {
        const registry =
          createCoreSkillToolRegistry(
            "2026-07-14T21:05:00.000Z",
          );

        const employee =
          createAIEmployeeManifest(
            validEmployeeInput({
              toolGrants: [
                {
                  toolId:
                    "tool-inquiry-read",
                  capability:
                    "Read tenant-scoped inquiry records",
                  mode:
                    "READ_ONLY",
                  risk:
                    "MEDIUM",
                },
              ],
            }),
          );

        expect(() =>
          validateAIEmployeeManifestAgainstRegistry(
            employee,
            registry,
          ),
        ).toThrow(
          "risk mismatch is blocked",
        );
      },
    );
  },
);
