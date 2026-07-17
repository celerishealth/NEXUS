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
  createMeeraQuotationProposalSpecialistTemplate,
} from "../meeraQuotationProposalSpecialistTemplate";

import {
  createCoreSkillToolRegistry,
} from "../skillToolRegistry";

const CREATED_AT =
  "2026-07-17T15:00:00.000Z";

describe(
  "Meera canonical registry integration",
  () => {
    it(
      "registers Meera as launch sequence five",
      () => {
        const registry =
          createCoreLaunchEmployeeTemplateRegistry(
            CREATED_AT,
          );

        const meera =
          findAIEmployeeTemplate(
            registry,
            "employee-meera-quotation-proposal-specialist-v1",
          );

        expect(meera).toBeDefined();

        expect(meera).toMatchObject({
          templateId:
            "template-meera-quotation-proposal-specialist-v1",
          employeeId:
            "employee-meera-quotation-proposal-specialist-v1",
          employeeCode:
            "nx-sales-005",
          publicName:
            "Meera",
          officialRole:
            "AI Quotation & Proposal Specialist",
          department:
            "SALES",
          launchSequence:
            5,
          status:
            "REGISTERED_UNQUALIFIED",
        });
      },
    );

    it(
      "registers every Meera skill and bounded tool",
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
            "skill-quotation-proposal-drafting",
            "skill-pricing-assumption-analysis",
            "skill-owner-commercial-escalation",
          ]),
        );

        const recommendationReadTool =
          registry.tools.find(
            (tool) =>
              tool.toolId ===
              "tool-recommendation-read",
          );

        const quotationProposalDraftTool =
          registry.tools.find(
            (tool) =>
              tool.toolId ===
              "tool-quotation-proposal-draft",
          );

        expect(recommendationReadTool).toMatchObject({
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
        });

        expect(quotationProposalDraftTool).toMatchObject({
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
        });
      },
    );

    it(
      "keeps standalone and canonical Meera identities aligned",
      () => {
        const standalone =
          createMeeraQuotationProposalSpecialistTemplate(
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
      "keeps Meera unqualified and without external authority",
      () => {
        const meera =
          findAIEmployeeTemplate(
            createCoreLaunchEmployeeTemplateRegistry(
              CREATED_AT,
            ),
            "Meera",
          );

        expect(meera?.status).toBe(
          "REGISTERED_UNQUALIFIED",
        );

        expect(
          meera?.controlledActivationEligible,
        ).toBe(false);

        expect(
          meera?.manifest.safetyBoundary,
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