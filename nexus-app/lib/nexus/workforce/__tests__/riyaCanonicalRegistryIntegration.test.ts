import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createCoreLaunchEmployeeTemplateRegistry,
  findAIEmployeeTemplate,
} from "../employeeTemplateRegistry";

import {
  createRiyaRecommendationSpecialistTemplate,
} from "../riyaRecommendationSpecialistTemplate";

import {
  createCoreSkillToolRegistry,
} from "../skillToolRegistry";

const CREATED_AT =
  "2026-07-16T14:30:00.000Z";

describe(
  "Riya canonical registry integration",
  () => {
    it(
      "registers Riya as launch sequence four",
      () => {
        const registry =
          createCoreLaunchEmployeeTemplateRegistry(
            CREATED_AT,
          );

        const riya =
          findAIEmployeeTemplate(
            registry,
            "employee-riya-recommendation-specialist-v1",
          );

        expect(riya).toBeDefined();

        expect(riya).toMatchObject({
          templateId:
            "template-riya-recommendation-specialist-v1",
          employeeId:
            "employee-riya-recommendation-specialist-v1",
          employeeCode:
            "nx-sales-004",
          publicName:
            "Riya",
          officialRole:
            "AI Recommendation Specialist",
          department:
            "SALES",
          launchSequence:
            4,
          status:
            "REGISTERED_UNQUALIFIED",
        });
      },
    );

    it(
      "registers every Riya skill and bounded tool",
      () => {
        const registry =
          createCoreSkillToolRegistry(
            CREATED_AT,
          );

        const skillIds =
          registry.skills.map(
            (skill) => skill.skillId,
          );

        expect(skillIds).toEqual(
          expect.arrayContaining([
            "skill-recommendation-analysis",
            "skill-risk-aware-recommendation",
            "skill-owner-recommendation-escalation",
          ]),
        );

        const customerMemoryTool =
          registry.tools.find(
            (tool) =>
              tool.toolId ===
              "tool-customer-memory-read",
          );

        const recommendationDraftTool =
          registry.tools.find(
            (tool) =>
              tool.toolId ===
              "tool-recommendation-draft",
          );

        expect(customerMemoryTool).toMatchObject({
          allowedModes: [
            "READ_ONLY",
          ],
          externalEffect:
            false,
          tenantScoped:
            true,
          auditRequired:
            true,
        });

        expect(recommendationDraftTool).toMatchObject({
          allowedModes: [
            "DRAFT_ONLY",
          ],
          externalEffect:
            false,
          tenantScoped:
            true,
          auditRequired:
            true,
        });
      },
    );

    it(
      "keeps standalone and canonical Riya identities aligned",
      () => {
        const standalone =
          createRiyaRecommendationSpecialistTemplate(
            CREATED_AT,
          );

        const canonical =
          findAIEmployeeTemplate(
            createCoreLaunchEmployeeTemplateRegistry(
              CREATED_AT,
            ),
            standalone.employeeId,
          );

        expect(canonical).toMatchObject({
          templateId:
            standalone.templateId,
          employeeId:
            standalone.employeeId,
          employeeCode:
            standalone.employeeCode,
          publicName:
            standalone.displayName,
          officialRole:
            standalone.officialRole,
          department:
            standalone.department,
          launchSequence:
            standalone.launchSequence,
        });
      },
    );

    it(
      "keeps Riya unqualified and without external authority",
      () => {
        const riya =
          findAIEmployeeTemplate(
            createCoreLaunchEmployeeTemplateRegistry(
              CREATED_AT,
            ),
            "Riya",
          );

        expect(riya?.status).toBe(
          "REGISTERED_UNQUALIFIED",
        );

        expect(
          riya?.manifest.safetyBoundary,
        ).toMatchObject({
          ownerControlled:
            true,
          emergencyPauseRequired:
            true,
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
        });
      },
    );
  },
);