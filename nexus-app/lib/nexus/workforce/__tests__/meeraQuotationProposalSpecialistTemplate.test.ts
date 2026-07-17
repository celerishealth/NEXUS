import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createMeeraQuotationProposalSpecialistTemplate,
  validateMeeraQuotationProposalSpecialistTemplate,
  type MeeraQuotationProposalSpecialistTemplate,
} from "../meeraQuotationProposalSpecialistTemplate";

const CREATED_AT =
  "2026-07-17T14:00:00.000Z";

describe(
  "Meera quotation and proposal specialist template",
  () => {
    it(
      "creates the exact Employee 3 identity and launch sequence",
      () => {
        const template =
          createMeeraQuotationProposalSpecialistTemplate(
            CREATED_AT,
          );

        expect(template).toMatchObject({
          employeeId:
            "employee-meera-quotation-proposal-specialist-v1",
          templateId:
            "template-meera-quotation-proposal-specialist-v1",
          employeeCode:
            "nx-sales-005",
          displayName:
            "Meera",
          officialRole:
            "AI Quotation & Proposal Specialist",
          department:
            "SALES",
          launchSequence:
            5,
        });
      },
    );

    it(
      "locks quotation and proposal drafting as the role charter",
      () => {
        const template =
          createMeeraQuotationProposalSpecialistTemplate(
            CREATED_AT,
          );

        expect(template.roleCharter).toContain(
          "quotation and proposal drafts",
        );

        expect(template.roleCharter).toContain(
          "owner for approval",
        );
      },
    );

    it(
      "grants only bounded quotation and proposal skills",
      () => {
        const template =
          createMeeraQuotationProposalSpecialistTemplate(
            CREATED_AT,
          );

        expect(
          template.skills.map(
            (skill) => skill.skillId,
          ),
        ).toEqual([
          "skill-quotation-proposal-drafting",
          "skill-pricing-assumption-analysis",
          "skill-owner-commercial-escalation",
        ]);
      },
    );

    it(
      "grants read-only and draft-only tools without external effects",
      () => {
        const template =
          createMeeraQuotationProposalSpecialistTemplate(
            CREATED_AT,
          );

        expect(
          template.toolGrants.map(
            (tool) => tool.toolId,
          ),
        ).toEqual([
          "tool-inquiry-read",
          "tool-recommendation-read",
          "tool-quotation-proposal-draft",
        ]);

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
          createMeeraQuotationProposalSpecialistTemplate(
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
          createMeeraQuotationProposalSpecialistTemplate(
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
          createMeeraQuotationProposalSpecialistTemplate(
            CREATED_AT,
          );

        const second =
          createMeeraQuotationProposalSpecialistTemplate(
            CREATED_AT,
          );

        expect(first).toEqual(second);
        expect(Object.isFrozen(first)).toBe(true);
        expect(Object.isFrozen(first.skills)).toBe(true);
        expect(Object.isFrozen(first.toolGrants)).toBe(true);

        expect(
          () =>
            validateMeeraQuotationProposalSpecialistTemplate(
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
            createMeeraQuotationProposalSpecialistTemplate(
              "not-a-date",
            ),
        ).toThrow(
          "exact ISO timestamp",
        );

        const valid =
          createMeeraQuotationProposalSpecialistTemplate(
            CREATED_AT,
          );

        const tampered = {
          ...valid,
          employeeCode:
            "nx-sales-999",
        } as unknown as MeeraQuotationProposalSpecialistTemplate;

        expect(
          () =>
            validateMeeraQuotationProposalSpecialistTemplate(
              tampered,
            ),
        ).toThrow(
          "identity is invalid",
        );
      },
    );
  },
);
