
import {
  describe,
  expect,
  it,
} from "vitest";

import {
  REQUIRED_EMPLOYEE_APPROVAL_ACTIONS,
  createAIEmployeeManifest,
  createAIEmployeeRuntimeContract,
  type AIEmployeeManifestInput,
} from "../aiEmployeeManifest";

function validInput(
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
      {
        kpiId:
          "kpi-owner-escalation-quality",
        name:
          "Owner escalation quality",
        measurement:
          "Percentage of escalations containing complete evidence and clear next actions.",
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
        "TOOL_FAILURE",
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
      "2026-07-14T17:00:00.000Z",
    ...overrides,
  };
}

describe(
  "universal AI employee manifest",
  () => {
    it(
      "creates an immutable qualified employee manifest",
      () => {
        const manifest =
          createAIEmployeeManifest(
            validInput(),
          );

        expect(manifest.version).toBe(
          "nexus-ai-employee-manifest-v1",
        );

        expect(
          manifest.employeeId,
        ).toBe(
          "employee-inquiry-intake-v1",
        );

        expect(
          manifest.evaluation.status,
        ).toBe("QUALIFIED");

        expect(
          manifest.safetyBoundary
            .ownerControlled,
        ).toBe(true);

        expect(
          manifest.safetyBoundary
            .crossTenantAccessAuthorized,
        ).toBe(false);

        expect(
          manifest.safetyBoundary
            .liveProviderExecutionAuthorized,
        ).toBe(false);

        expect(
          manifest.safetyBoundary
            .externalDeliveryAuthorized,
        ).toBe(false);

        expect(
          manifest.safetyBoundary
            .paymentExecutionAuthorized,
        ).toBe(false);

        expect(
          Object.isFrozen(manifest),
        ).toBe(true);

        expect(
          Object.isFrozen(
            manifest.skills,
          ),
        ).toBe(true);

        expect(
          manifest.manifestDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );
      },
    );

    it(
      "produces a deterministic manifest digest",
      () => {
        const first =
          createAIEmployeeManifest(
            validInput(),
          );

        const second =
          createAIEmployeeManifest(
            validInput(),
          );

        expect(
          first.manifestDigest,
        ).toBe(
          second.manifestDigest,
        );

        expect(first).toEqual(second);
      },
    );

    it(
      "rejects duplicate skills, tools, and KPIs",
      () => {
        const input =
          validInput();

        expect(() =>
          createAIEmployeeManifest({
            ...input,
            skills: [
              input.skills[0],
              input.skills[0],
            ],
          }),
        ).toThrow(
          "skills must not contain duplicates",
        );

        expect(() =>
          createAIEmployeeManifest({
            ...input,
            toolGrants: [
              input.toolGrants[0],
              input.toolGrants[0],
            ],
          }),
        ).toThrow(
          "tool grants must not contain duplicates",
        );

        expect(() =>
          createAIEmployeeManifest({
            ...input,
            kpis: [
              input.kpis[0],
              input.kpis[0],
            ],
          }),
        ).toThrow(
          "KPIs must not contain duplicates",
        );
      },
    );

    it(
      "rejects credential-bearing employee identifiers",
      () => {
        expect(() =>
          createAIEmployeeManifest(
            validInput({
              employeeId:
                "employee-secret-token",
            }),
          ),
        ).toThrow(
          "credential-bearing term",
        );
      },
    );

    it(
      "requires owner approval for high-risk tools",
      () => {
        const input =
          validInput();

        expect(() =>
          createAIEmployeeManifest({
            ...input,
            toolGrants: [
              {
                toolId:
                  "tool-live-send",
                capability:
                  "Send a customer message",
                mode:
                  "DRAFT_ONLY",
                risk:
                  "HIGH",
              },
            ],
          }),
        ).toThrow(
          "must require owner approval",
        );
      },
    );

    it(
      "requires every locked owner-approval action",
      () => {
        const input =
          validInput();

        expect(() =>
          createAIEmployeeManifest({
            ...input,
            approvalPolicy: {
              requiredFor: [
                "EXTERNAL_COMMUNICATION",
              ],
              bypassAllowed:
                false,
            },
          }),
        ).toThrow(
          "every required owner-controlled action",
        );
      },
    );

    it(
      "rejects cross-tenant knowledge access",
      () => {
        const input =
          validInput();

        expect(() =>
          createAIEmployeeManifest({
            ...input,
            knowledgePolicy: {
              ...input.knowledgePolicy,
              crossTenantAccess:
                true as false,
            },
          }),
        ).toThrow(
          "cross-tenant access blocked",
        );
      },
    );

    it(
      "does not qualify an employee without complete safety evaluation",
      () => {
        const input =
          validInput();

        expect(() =>
          createAIEmployeeManifest({
            ...input,
            evaluation: {
              ...input.evaluation,
              testCasesPassed: 99,
            },
          }),
        ).toThrow(
          "must pass at least 100 tests",
        );
      },
    );

    it(
      "keeps the runtime paused until the owner activates a qualified employee",
      () => {
        const manifest =
          createAIEmployeeManifest(
            validInput(),
          );

        const runtime =
          createAIEmployeeRuntimeContract({
            manifest,
            runtimeId:
              "runtime-inquiry-intake-001",
            tenantId:
              "tenant-ppa-industrial",
            ownerId:
              "owner-prashant-001",
            ownerActivated:
              false,
            startedAt:
              "2026-07-14T17:05:00.000Z",
          });

        expect(
          runtime.runtimeState,
        ).toBe(
          "PAUSED_AWAITING_OWNER",
        );

        expect(
          runtime
            .controlledWorkAuthorized,
        ).toBe(false);

        expect(
          runtime.authority
            .crossTenantDelegationAllowed,
        ).toBe(false);

        expect(
          runtime.safetyBoundary
            .externalDeliveryAuthorized,
        ).toBe(false);
      },
    );

    it(
      "allows only controlled work after explicit owner activation",
      () => {
        const manifest =
          createAIEmployeeManifest(
            validInput(),
          );

        const runtime =
          createAIEmployeeRuntimeContract({
            manifest,
            runtimeId:
              "runtime-inquiry-intake-002",
            tenantId:
              "tenant-ppa-industrial",
            ownerId:
              "owner-prashant-001",
            ownerActivated:
              true,
            startedAt:
              "2026-07-14T17:10:00.000Z",
          });

        expect(
          runtime.runtimeState,
        ).toBe(
          "READY_FOR_CONTROLLED_WORK",
        );

        expect(
          runtime
            .controlledWorkAuthorized,
        ).toBe(true);

        expect(
          runtime.safetyBoundary
            .liveProviderExecutionAuthorized,
        ).toBe(false);

        expect(
          runtime.safetyBoundary
            .paymentExecutionAuthorized,
        ).toBe(false);

        expect(
          runtime.safetyBoundary
            .publicLaunchAuthorized,
        ).toBe(false);

        expect(
          Object.isFrozen(runtime),
        ).toBe(true);

        expect(
          runtime.runtimeDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );
      },
    );

    it(
      "blocks activation of an unqualified employee",
      () => {
        const manifest =
          createAIEmployeeManifest(
            validInput({
              evaluation: {
                status:
                  "UNQUALIFIED",
                testCasesPassed: 0,
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
            }),
          );

        expect(() =>
          createAIEmployeeRuntimeContract({
            manifest,
            runtimeId:
              "runtime-unqualified-001",
            tenantId:
              "tenant-ppa-industrial",
            ownerId:
              "owner-prashant-001",
            ownerActivated:
              true,
            startedAt:
              "2026-07-14T17:15:00.000Z",
          }),
        ).toThrow(
          "unqualified AI employee cannot be activated",
        );
      },
    );
  },
);
