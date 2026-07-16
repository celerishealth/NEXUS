import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createRiyaRecommendationSpecialistTemplate,
  validateRiyaRecommendationSpecialistTemplate,
  type RiyaRecommendationSpecialistTemplate,
} from "../riyaRecommendationSpecialistTemplate";

const CREATED_AT =
  "2026-07-16T14:00:00.000Z";

describe(
  "Riya recommendation specialist template",
  () => {
    it(
      "creates the exact Employee 2 identity and launch sequence",
      () => {
        const template =
          createRiyaRecommendationSpecialistTemplate(
            CREATED_AT,
          );

        expect(template).toMatchObject({
          employeeId:
            "employee-riya-recommendation-specialist-v1",
          templateId:
            "template-riya-recommendation-specialist-v1",
          employeeCode:
            "nx-sales-004",
          displayName:
            "Riya",
          officialRole:
            "AI Recommendation Specialist",
          department:
            "SALES",
          launchSequence:
            4,
        });
      },
    );

    it(
      "locks recommendation drafting as the role charter",
      () => {
        const template =
          createRiyaRecommendationSpecialistTemplate(
            CREATED_AT,
          );

        expect(template.roleCharter).toContain(
          "recommendation drafts",
        );

        expect(template.roleCharter).toContain(
          "owner for approval",
        );
      },
    );

    it(
      "grants only bounded recommendation skills",
      () => {
        const template =
          createRiyaRecommendationSpecialistTemplate(
            CREATED_AT,
          );

        expect(
          template.skills.map(
            (skill) => skill.skillId,
          ),
        ).toEqual([
          "skill-recommendation-analysis",
          "skill-risk-aware-recommendation",
          "skill-owner-recommendation-escalation",
        ]);
      },
    );

    it(
      "grants read-only and draft-only tools without external effects",
      () => {
        const template =
          createRiyaRecommendationSpecialistTemplate(
            CREATED_AT,
          );

        expect(
          template.toolGrants.every(
            (tool) =>
              tool.externalEffect === false,
          ),
        ).toBe(true);

        expect(
          template.toolGrants.map(
            (tool) => tool.mode,
          ),
        ).toEqual([
          "READ_ONLY",
          "READ_ONLY",
          "DRAFT_ONLY",
        ]);
      },
    );

    it(
      "keeps owner approval mandatory",
      () => {
        const template =
          createRiyaRecommendationSpecialistTemplate(
            CREATED_AT,
          );

        expect(template.approvalPolicy).toEqual({
          ownerApprovalRequiredBeforeCustomerDelivery:
            true,
          ownerApprovalRequiredBeforeExecution:
            true,
          autonomousExternalActionAllowed:
            false,
        });
      },
    );

    it(
      "blocks real customer production payment and public launch authority",
      () => {
        const boundary =
          createRiyaRecommendationSpecialistTemplate(
            CREATED_AT,
          ).safetyBoundary;

        expect(boundary).toMatchObject({
          tenantScoped:
            true,
          crossTenantAccessAuthorized:
            false,
          sandboxOnly:
            true,
          realCustomerContactAuthorized:
            false,
          liveProviderExecutionAuthorized:
            false,
          productionDatabaseMutationAuthorized:
            false,
          paymentExecutionAuthorized:
            false,
          publicLaunchAuthorized:
            false,
        });
      },
    );

    it(
      "is deterministic deeply frozen and integrity valid",
      () => {
        const first =
          createRiyaRecommendationSpecialistTemplate(
            CREATED_AT,
          );

        const second =
          createRiyaRecommendationSpecialistTemplate(
            CREATED_AT,
          );

        expect(first).toEqual(second);
        expect(Object.isFrozen(first)).toBe(true);
        expect(Object.isFrozen(first.skills)).toBe(true);
        expect(Object.isFrozen(first.toolGrants)).toBe(true);

        expect(
          () =>
            validateRiyaRecommendationSpecialistTemplate(
              first,
            ),
        ).not.toThrow();
      },
    );

    it(
      "rejects invalid timestamps and tampered identity",
      () => {
        expect(
          () =>
            createRiyaRecommendationSpecialistTemplate(
              "not-a-date",
            ),
        ).toThrow(
          "exact ISO timestamp",
        );

        const valid =
          createRiyaRecommendationSpecialistTemplate(
            CREATED_AT,
          );

        const tampered = {
          ...valid,
          employeeCode:
            "nx-sales-999",
        } as unknown as RiyaRecommendationSpecialistTemplate;

        expect(
          () =>
            validateRiyaRecommendationSpecialistTemplate(
              tampered,
            ),
        ).toThrow(
          "identity is invalid",
        );
      },
    );
  },
);