
import {
  describe,
  expect,
  it,
} from "vitest";

import {
  assessAshaSpecialistInquiry,
  createAshaInquiryMessageDigest,
  type AshaSpecialistInquiryAssessmentInput,
} from "../ashaSpecialistInquiryAssessment";

function validInput(
  overrides:
    Partial<AshaSpecialistInquiryAssessmentInput> = {},
): AshaSpecialistInquiryAssessmentInput {
  return {
    evaluationMode:
      "ISOLATED_EVALUATION",
    tenantId:
      "tenant-ppa-industrial",
    inquiryId:
      "inquiry-asha-001",
    customerRef:
      "customer-asha-001",
    channel:
      "WEB",
    message:
      "Please prepare a quotation for industrial safety helmets.",
    idempotencyKey:
      "asha-intake-request-001",
    verifiedFacts: [
      {
        key:
          "product",
        value:
          "Industrial safety helmets",
        source:
          "CUSTOMER",
      },
      {
        key:
          "quantity",
        value:
          "100",
        source:
          "CUSTOMER",
      },
    ],
    priorContext:
      null,
    duplicateCandidates: [],
    ...overrides,
  };
}

describe(
  "Asha specialist inquiry assessment",
  () => {
    it(
      "executes all 12 super-specialist competency domains",
      () => {
        const result =
          assessAshaSpecialistInquiry(
            validInput(),
          );

        expect(
          result.competencyCoverage,
        ).toHaveLength(12);

        expect(
          result.competencyCoverage
            .every(
              (item) =>
                item.executed ===
                true,
            ),
        ).toBe(true);
      },
    );

    it(
      "classifies a complete quotation inquiry and routes it to sales",
      () => {
        const result =
          assessAshaSpecialistInquiry(
            validInput(),
          );

        expect(
          result.intent.primary,
        ).toBe("QUOTE");

        expect(
          result.requirementCompleteness
            .missingFields,
        ).toEqual([]);

        expect(
          result.routing.destination,
        ).toBe("SALES");

        expect(
          result.handoff.status,
        ).toBe(
          "READY_FOR_CONTROLLED_HANDOFF",
        );

        expect(
          result.leadQuality.level,
        ).toBe("HIGH");
      },
    );

    it(
      "asks only for missing verified information",
      () => {
        const result =
          assessAshaSpecialistInquiry(
            validInput({
              verifiedFacts: [
                {
                  key:
                    "product",
                  value:
                    "Industrial gloves",
                  source:
                    "CUSTOMER",
                },
              ],
            }),
          );

        expect(
          result.requirementCompleteness
            .missingFields,
        ).toEqual([
          "quantity",
        ]);

        expect(
          result.missingInformation
            .priorityQuestions,
        ).toEqual([
          "What quantity is required?",
        ]);

        expect(
          result.handoff.status,
        ).toBe(
          "CUSTOMER_CLARIFICATION_REQUIRED",
        );
      },
    );

    it(
      "uses prior verified context without asking the customer to repeat it",
      () => {
        const result =
          assessAshaSpecialistInquiry(
            validInput({
              verifiedFacts: [
                {
                  key:
                    "quantity",
                  value:
                    "250",
                  source:
                    "CUSTOMER",
                },
              ],
              priorContext: {
                tenantId:
                  "tenant-ppa-industrial",
                customerRef:
                  "customer-asha-001",
                facts: [
                  {
                    key:
                      "product",
                    value:
                      "Safety shoes",
                    source:
                      "OWNER",
                  },
                ],
              },
            }),
          );

        expect(
          result.continuity
            .priorContextUsed,
        ).toBe(true);

        expect(
          result.continuity
            .retainedFactKeys,
        ).toContain("product");

        expect(
          result.requirementCompleteness
            .missingFields,
        ).toEqual([]);
      },
    );

    it(
      "blocks cross-tenant prior customer context",
      () => {
        expect(() =>
          assessAshaSpecialistInquiry(
            validInput({
              priorContext: {
                tenantId:
                  "tenant-other",
                customerRef:
                  "customer-asha-001",
                facts: [],
              },
            }),
          ),
        ).toThrow(
          "cross-tenant prior context is blocked",
        );
      },
    );

    it(
      "blocks cross-customer prior context",
      () => {
        expect(() =>
          assessAshaSpecialistInquiry(
            validInput({
              priorContext: {
                tenantId:
                  "tenant-ppa-industrial",
                customerRef:
                  "customer-other",
                facts: [],
              },
            }),
          ),
        ).toThrow(
          "cross-customer prior context is blocked",
        );
      },
    );

    it(
      "detects conflicting verified customer context and requires owner review",
      () => {
        const result =
          assessAshaSpecialistInquiry(
            validInput({
              priorContext: {
                tenantId:
                  "tenant-ppa-industrial",
                customerRef:
                  "customer-asha-001",
                facts: [
                  {
                    key:
                      "product",
                    value:
                      "Safety helmets",
                    source:
                      "OWNER",
                  },
                ],
              },
              verifiedFacts: [
                {
                  key:
                    "product",
                  value:
                    "Safety gloves",
                  source:
                    "CUSTOMER",
                },
                {
                  key:
                    "quantity",
                  value:
                    "50",
                  source:
                    "CUSTOMER",
                },
              ],
            }),
          );

        expect(
          result.requirementCompleteness
            .conflictingFields,
        ).toContain("product");

        expect(
          result.risk.reasons,
        ).toContain(
          "CONFLICTING_VERIFIED_CONTEXT",
        );

        expect(
          result.routing.destination,
        ).toBe("OWNER_REVIEW");
      },
    );

    it(
      "detects an exact duplicate inquiry without creating another inquiry",
      () => {
        const input =
          validInput();

        const result =
          assessAshaSpecialistInquiry({
            ...input,
            duplicateCandidates: [
              {
                tenantId:
                  input.tenantId,
                customerRef:
                  input.customerRef,
                inquiryId:
                  "inquiry-existing-001",
                idempotencyKey:
                  input.idempotencyKey,
                messageDigest:
                  createAshaInquiryMessageDigest(
                    input.message,
                  ),
              },
            ],
          });

        expect(
          result.duplicateAssessment
            .status,
        ).toBe(
          "EXACT_DUPLICATE",
        );

        expect(
          result.handoff.status,
        ).toBe(
          "EXISTING_INQUIRY_REUSE",
        );

        expect(
          result.duplicateAssessment
            .existingInquiryId,
        ).toBe(
          "inquiry-existing-001",
        );
      },
    );

    it(
      "detects idempotency binding conflicts and escalates",
      () => {
        const input =
          validInput();

        const result =
          assessAshaSpecialistInquiry({
            ...input,
            duplicateCandidates: [
              {
                tenantId:
                  input.tenantId,
                customerRef:
                  input.customerRef,
                inquiryId:
                  "inquiry-existing-002",
                idempotencyKey:
                  input.idempotencyKey,
                messageDigest:
                  createAshaInquiryMessageDigest(
                    "Different customer request",
                  ),
              },
            ],
          });

        expect(
          result.duplicateAssessment
            .status,
        ).toBe(
          "BINDING_CONFLICT",
        );

        expect(
          result.risk.reasons,
        ).toContain(
          "IDEMPOTENCY_BINDING_CONFLICT",
        );

        expect(
          result.risk
            .escalationRequired,
        ).toBe(true);
      },
    );

    it(
      "blocks cross-tenant duplicate evidence",
      () => {
        const input =
          validInput();

        expect(() =>
          assessAshaSpecialistInquiry({
            ...input,
            duplicateCandidates: [
              {
                tenantId:
                  "tenant-other",
                customerRef:
                  input.customerRef,
                inquiryId:
                  "inquiry-other-001",
                idempotencyKey:
                  input.idempotencyKey,
                messageDigest:
                  createAshaInquiryMessageDigest(
                    input.message,
                  ),
              },
            ],
          }),
        ).toThrow(
          "cross-tenant duplicate candidate is blocked",
        );
      },
    );

    it(
      "detects critical safety urgency and fails closed to owner review",
      () => {
        const result =
          assessAshaSpecialistInquiry(
            validInput({
              message:
                "Emergency fire hazard reported. We need immediate support.",
              verifiedFacts: [
                {
                  key:
                    "issue",
                  value:
                    "Fire hazard",
                  source:
                    "CUSTOMER",
                },
                {
                  key:
                    "product_or_order_ref",
                  value:
                    "Safety equipment batch 21",
                  source:
                    "CUSTOMER",
                },
              ],
            }),
          );

        expect(
          result.urgency.level,
        ).toBe("CRITICAL");

        expect(
          result.risk.level,
        ).toBe("CRITICAL");

        expect(
          result.routing.destination,
        ).toBe("OWNER_REVIEW");

        expect(
          result.risk
            .escalationRequired,
        ).toBe(true);
      },
    );

    it(
      "routes complaints through controlled owner review",
      () => {
        const result =
          assessAshaSpecialistInquiry(
            validInput({
              message:
                "Complaint: damaged product received.",
              verifiedFacts: [
                {
                  key:
                    "issue",
                  value:
                    "Damaged product",
                  source:
                    "CUSTOMER",
                },
                {
                  key:
                    "product_or_order_ref",
                  value:
                    "Order PPA-101",
                  source:
                    "CUSTOMER",
                },
              ],
            }),
          );

        expect(
          result.intent.primary,
        ).toBe("COMPLAINT");

        expect(
          result.ownerBrief
            .ownerDecisionRequired,
        ).toBe(true);

        expect(
          result.routing.destination,
        ).toBe("OWNER_REVIEW");
      },
    );

    it(
      "does not invent unverified product or quantity facts",
      () => {
        const result =
          assessAshaSpecialistInquiry(
            validInput({
              message:
                "Please send a quotation.",
              verifiedFacts: [],
            }),
          );

        expect(
          result.requirementCompleteness
            .verifiedFacts,
        ).toEqual([]);

        expect(
          result.requirementCompleteness
            .missingFields,
        ).toEqual([
          "product",
          "quantity",
        ]);

        expect(
          result.requirementCompleteness
            .unsupportedAssumptionsBlocked,
        ).toBe(true);
      },
    );

    it(
      "creates deterministic immutable assessment evidence",
      () => {
        const first =
          assessAshaSpecialistInquiry(
            validInput(),
          );

        const second =
          assessAshaSpecialistInquiry(
            validInput(),
          );

        expect(
          first.assessmentDigest,
        ).toBe(
          second.assessmentDigest,
        );

        expect(
          first.assessmentDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.requirementCompleteness
              .verifiedFacts,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.competencyCoverage,
          ),
        ).toBe(true);
      },
    );

    it(
      "keeps every real side effect blocked",
      () => {
        const result =
          assessAshaSpecialistInquiry(
            validInput(),
          );

        expect(
          result.safetyBoundary
            .inquiryPersistencePerformed,
        ).toBe(false);

        expect(
          result.safetyBoundary
            .recommendationGenerated,
        ).toBe(false);

        expect(
          result.safetyBoundary
            .ownerDecisionPerformed,
        ).toBe(false);

        expect(
          result.safetyBoundary
            .externalMessageDeliveryPerformed,
        ).toBe(false);

        expect(
          result.safetyBoundary
            .liveProviderExecutionPerformed,
        ).toBe(false);

        expect(
          result.safetyBoundary
            .paymentExecutionPerformed,
        ).toBe(false);

        expect(
          result.safetyBoundary
            .productionDatabaseTouched,
        ).toBe(false);

        expect(
          result.safetyBoundary
            .publicLaunchAuthorized,
        ).toBe(false);
      },
    );

    it(
      "blocks any non-isolated execution mode",
      () => {
        expect(() =>
          assessAshaSpecialistInquiry({
            ...validInput(),
            evaluationMode:
              "PRODUCTION",
          } as unknown as
            AshaSpecialistInquiryAssessmentInput),
        ).toThrow(
          "isolated-evaluation only",
        );
      },
    );
  },
);
