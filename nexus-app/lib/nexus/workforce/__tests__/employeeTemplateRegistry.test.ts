
import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createAIEmployeeRuntimeContract,
  type AIEmployeeManifestInput,
} from "../aiEmployeeManifest";

import {
  createCoreSkillToolRegistry,
} from "../skillToolRegistry";

import {
  ASHA_INQUIRY_INTAKE_TEMPLATE,
  createAIEmployeeTemplateRegistry,
  createCoreLaunchEmployeeTemplateRegistry,
  findAIEmployeeTemplate,
  type AIEmployeeTemplateDefinition,
} from "../employeeTemplateRegistry";

function templateWith(
  templateOverrides:
    Partial<AIEmployeeTemplateDefinition> = {},
  manifestOverrides:
    Partial<AIEmployeeManifestInput> = {},
): AIEmployeeTemplateDefinition {
  return {
    ...ASHA_INQUIRY_INTAKE_TEMPLATE,
    ...templateOverrides,
    manifestInput: {
      ...ASHA_INQUIRY_INTAKE_TEMPLATE
        .manifestInput,
      ...manifestOverrides,
    },
  };
}

function createRegistry(
  templates:
    readonly AIEmployeeTemplateDefinition[],
) {
  const createdAt =
    "2026-07-14T22:35:00.000Z";

  return createAIEmployeeTemplateRegistry({
    templates,
    skillToolRegistry:
      createCoreSkillToolRegistry(
        createdAt,
      ),
    createdAt,
  });
}

describe(
  "official AI employee template registry",
  () => {
    it(
      "registers Asha as the first official launch employee foundation",
      () => {
        const registry =
          createCoreLaunchEmployeeTemplateRegistry(
            "2026-07-14T22:35:00.000Z",
          );

        expect(
          registry.registeredTemplateCount,
        ).toBe(2);

        const asha =
          registry.templates[0];

        expect(
          asha.publicName,
        ).toBe("Asha");

        expect(
          asha.officialRole,
        ).toBe(
          "AI Inquiry Intake Executive",
        );

        expect(
          asha.department,
        ).toBe("SALES");

        expect(
          asha.employeeCode,
        ).toBe("nx-sales-003");

        expect(
          asha.launchSequence,
        ).toBe(3);
      },
    );

    it(
      "keeps Asha unqualified and activation-ineligible until evaluation passes",
      () => {
        const registry =
          createCoreLaunchEmployeeTemplateRegistry(
            "2026-07-14T22:35:00.000Z",
          );

        const asha =
          registry.templates[0];

        expect(
          asha.status,
        ).toBe(
          "REGISTERED_UNQUALIFIED",
        );

        expect(
          asha
            .controlledActivationEligible,
        ).toBe(false);

        expect(
          registry.qualifiedTemplateCount,
        ).toBe(0);

        expect(
          registry
            .activationEligibleTemplateCount,
        ).toBe(0);

        expect(() =>
          createAIEmployeeRuntimeContract({
            manifest:
              asha.manifest,
            runtimeId:
              "runtime-asha-001",
            tenantId:
              "tenant-ppa-industrial",
            ownerId:
              "owner-prashant-001",
            ownerActivated:
              true,
            startedAt:
              "2026-07-14T22:40:00.000Z",
          }),
        ).toThrow(
          "unqualified AI employee cannot be activated",
        );
      },
    );

    it(
      "produces deterministic employee registry evidence",
      () => {
        const first =
          createCoreLaunchEmployeeTemplateRegistry(
            "2026-07-14T22:35:00.000Z",
          );

        const second =
          createCoreLaunchEmployeeTemplateRegistry(
            "2026-07-14T22:35:00.000Z",
          );

        expect(
          first.registryDigest,
        ).toBe(
          second.registryDigest,
        );

        expect(first).toEqual(second);
      },
    );

    it(
      "creates immutable template and manifest records",
      () => {
        const registry =
          createCoreLaunchEmployeeTemplateRegistry(
            "2026-07-14T22:35:00.000Z",
          );

        expect(
          Object.isFrozen(registry),
        ).toBe(true);

        expect(
          Object.isFrozen(
            registry.templates,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            registry.templates[0],
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            registry.templates[0]
              .manifest,
          ),
        ).toBe(true);

        expect(
          registry.registryDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          registry.templates[0]
            .templateDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );
      },
    );

    it(
      "blocks duplicate template identities",
      () => {
        const duplicate =
          templateWith(
            {
              employeeId:
                "employee-asha-copy-v1",
              employeeCode:
                "nx-sales-004",
              publicName:
                "Asha Copy",
              launchSequence:
                4,
            },
            {
              employeeId:
                "employee-asha-copy-v1",
              displayName:
                "Asha Copy",
            },
          );

        expect(() =>
          createRegistry([
            ASHA_INQUIRY_INTAKE_TEMPLATE,
            duplicate,
          ]),
        ).toThrow(
          "Employee template IDs must not contain duplicates",
        );
      },
    );

    it(
      "blocks duplicate employee launch sequences",
      () => {
        const second =
          templateWith(
            {
              templateId:
                "template-asha-two-v1",
              employeeId:
                "employee-asha-two-v1",
              employeeCode:
                "nx-sales-004",
              publicName:
                "Asha Two",
              launchSequence:
                3,
            },
            {
              templateId:
                "template-asha-two-v1",
              employeeId:
                "employee-asha-two-v1",
              displayName:
                "Asha Two",
            },
          );

        expect(() =>
          createRegistry([
            ASHA_INQUIRY_INTAKE_TEMPLATE,
            second,
          ]),
        ).toThrow(
          "Employee launch sequences must not contain duplicates",
        );
      },
    );

    it(
      "blocks employee metadata and manifest mismatch",
      () => {
        const mismatched =
          templateWith({
            publicName:
              "Wrong Name",
          });

        expect(() =>
          createRegistry([
            mismatched,
          ]),
        ).toThrow(
          "metadata must exactly match its manifest input",
        );
      },
    );

    it(
      "blocks unregistered employee skills",
      () => {
        const unsafe =
          templateWith(
            {},
            {
              skills: [
                {
                  skillId:
                    "skill-unregistered-work",
                  name:
                    "Unregistered work",
                  description:
                    "Attempts to use a skill that is not present in the canonical registry.",
                },
              ],
            },
          );

        expect(() =>
          createRegistry([
            unsafe,
          ]),
        ).toThrow(
          "Unknown or inactive employee skill is blocked",
        );
      },
    );

    it(
      "blocks employee tool capability escalation",
      () => {
        const unsafe =
          templateWith(
            {},
            {
              toolGrants: [
                {
                  toolId:
                    "tool-inquiry-read",
                  capability:
                    "Delete every customer inquiry",
                  mode:
                    "READ_ONLY",
                  risk:
                    "LOW",
                },
              ],
            },
          );

        expect(() =>
          createRegistry([
            unsafe,
          ]),
        ).toThrow(
          "capability escalation is blocked",
        );
      },
    );

    it(
      "finds the official employee by name, role, code, and identity",
      () => {
        const registry =
          createCoreLaunchEmployeeTemplateRegistry(
            "2026-07-14T22:35:00.000Z",
          );

        expect(
          findAIEmployeeTemplate(
            registry,
            "Asha",
          )?.employeeCode,
        ).toBe("nx-sales-003");

        expect(
          findAIEmployeeTemplate(
            registry,
            "AI Inquiry Intake Executive",
          )?.publicName,
        ).toBe("Asha");

        expect(
          findAIEmployeeTemplate(
            registry,
            "nx-sales-003",
          )?.publicName,
        ).toBe("Asha");

        expect(
          findAIEmployeeTemplate(
            registry,
            "employee-asha-inquiry-intake-v1",
          )?.publicName,
        ).toBe("Asha");
      },
    );

    it(
      "returns no employee for an unknown identity and blocks an empty search",
      () => {
        const registry =
          createCoreLaunchEmployeeTemplateRegistry(
            "2026-07-14T22:35:00.000Z",
          );

        expect(
          findAIEmployeeTemplate(
            registry,
            "unknown employee",
          ),
        ).toBeUndefined();

        expect(() =>
          findAIEmployeeTemplate(
            registry,
            "   ",
          ),
        ).toThrow(
          "search query cannot be empty",
        );
      },
    );
  },
);
