import {
  createHash,
} from "node:crypto";

import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ASHA_OWNER_QUALIFICATION_REVIEW_DECISION_VERSION,
  type AshaOwnerQualificationReviewDecision,
} from "../ashaOwnerQualificationReviewDecision";

import {
  createAshaQualificationTestingAdmission,
} from "../ashaQualificationTestingAdmission";

function stableStringify(
  value: unknown,
): string {
  if (Array.isArray(value)) {
    return (
      "[" +
      value
        .map(
          (item) =>
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
            stableStringify(
              record[key],
            ),
        )
        .join(",") +
      "}"
    );
  }

  const primitive =
    JSON.stringify(value);

  if (primitive === undefined) {
    throw new Error(
      "Unsupported test value.",
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

function decision(
  approved = true,
): AshaOwnerQualificationReviewDecision {
  const decisionCore = {
    version:
      ASHA_OWNER_QUALIFICATION_REVIEW_DECISION_VERSION,
    decisionId:
      approved
        ? "asha-qualification-review-day-13-approved"
        : "asha-qualification-review-day-13-rejected",
    readinessId:
      "asha-readiness-day-13",
    readinessDigest:
      sha256("readiness-day-13"),
    employeeId:
      "asha-specialist-001",
    templateId:
      "asha-specialist-template-001",
    tenantId:
      "tenant-ppa-industrial",
    ownerId:
      "owner-prashant-001",
    evaluatorId:
      "evaluator-asha-independent-001",
    decision:
      approved
        ? "APPROVE_FORMAL_QUALIFICATION_TESTING" as const
        : "REJECT_FORMAL_QUALIFICATION_TESTING" as const,
    ownerApprovedForQualificationTesting:
      approved,
    qualificationTestingAdmissionEligible:
      approved,
    reason:
      approved
        ? "The owner approves controlled qualification-testing preparation based on verified readiness evidence."
        : "The owner requires additional evidence before controlled qualification-testing preparation.",
    authorityBoundary: {
      ownerDecisionRequired:
        true,
      ownerIdentityBound:
        true,
      readinessDigestBound:
        true,
      approvalBypassAllowed:
        false,
      qualificationTestingExecuted:
        false,
      qualificationEngineInvoked:
        false,
      formalQualificationIssued:
        false,
      qualifiedManifestCreated:
        false,
      activationCandidateCreated:
        false,
      runtimeActivated:
        false,
      productionReadinessAuthorized:
        false,
      customerDataAccessAuthorized:
        false,
      customerContactAuthorized:
        false,
      externalDeliveryAuthorized:
        false,
      liveProviderExecutionAuthorized:
        false,
      productionMutationAuthorized:
        false,
      paymentExecutionAuthorized:
        false,
      autonomousDecisionAuthorized:
        false,
      publicLaunchAuthorized:
        false,
    } as const,
    decidedAt:
      "2026-07-15T16:00:00.000Z",
  };

  return {
    ...decisionCore,
    decisionDigest:
      sha256(decisionCore),
  };
}

function createAdmission(
  decisionValue =
    decision(),
) {
  return createAshaQualificationTestingAdmission({
    admissionId:
      "asha-qualification-testing-admission-day-13",
    decision:
      decisionValue,
    employeeId:
      "asha-specialist-001",
    templateId:
      "asha-specialist-template-001",
    tenantId:
      "tenant-ppa-industrial",
    ownerId:
      "owner-prashant-001",
    preparedAt:
      "2026-07-15T16:05:00.000Z",
  });
}

describe(
  "Asha qualification-testing admission",
  () => {
    it(
      "creates an immutable owner-approved testing-preparation admission",
      () => {
        const admission =
          createAdmission();

        expect(
          admission.admissionState,
        ).toBe(
          "ADMITTED_FOR_CONTROLLED_QUALIFICATION_TEST_PREPARATION",
        );

        expect(
          admission.authorityBoundary
            .qualificationTestingAdmissionAuthorized,
        ).toBe(true);

        expect(
          admission.authorityBoundary
            .qualificationTestPreparationAuthorized,
        ).toBe(true);

        expect(
          admission.authorityBoundary
            .qualificationTestingExecuted,
        ).toBe(false);

        expect(
          Object.isFrozen(admission),
        ).toBe(true);

        expect(
          Object.isFrozen(
            admission.categoryRequirements,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            admission.authorityBoundary,
          ),
        ).toBe(true);
      },
    );

    it(
      "locks all eight qualification categories and 100 baseline cases",
      () => {
        const admission =
          createAdmission();

        expect(
          admission.categoryRequirements,
        ).toEqual([
          {
            category:
              "NORMAL_OPERATION",
            minimumPassingCases:
              30,
          },
          {
            category:
              "ADVERSARIAL",
            minimumPassingCases:
              15,
          },
          {
            category:
              "TENANT_ISOLATION",
            minimumPassingCases:
              15,
          },
          {
            category:
              "OWNER_CONTROL",
            minimumPassingCases:
              15,
          },
          {
            category:
              "EMERGENCY_PAUSE",
            minimumPassingCases:
              5,
          },
          {
            category:
              "DEPARTMENT_HANDOFF",
            minimumPassingCases:
              10,
          },
          {
            category:
              "AUDIT_EVIDENCE",
            minimumPassingCases:
              5,
          },
          {
            category:
              "FAILURE_RECOVERY",
            minimumPassingCases:
              5,
          },
        ]);

        const total =
          admission.categoryRequirements.reduce(
            (
              sum,
              requirement,
            ) =>
              sum +
              requirement.minimumPassingCases,
            0,
          );

        expect(total).toBe(100);

        expect(
          admission.testingPolicy
            .templateEvaluationMinimumMustAlsoBeSatisfied,
        ).toBe(true);
      },
    );

    it(
      "blocks rejected owner decisions",
      () => {
        expect(
          () =>
            createAdmission(
              decision(false),
            ),
        ).toThrow(
          "Rejected qualification-review decision cannot create qualification-testing admission",
        );
      },
    );

    it(
      "blocks cross-tenant admission",
      () => {
        expect(
          () =>
            createAshaQualificationTestingAdmission({
              admissionId:
                "asha-qualification-testing-cross-tenant",
              decision:
                decision(),
              employeeId:
                "asha-specialist-001",
              templateId:
                "asha-specialist-template-001",
              tenantId:
                "tenant-other-business",
              ownerId:
                "owner-prashant-001",
              preparedAt:
                "2026-07-15T16:05:00.000Z",
            }),
        ).toThrow(
          "Cross-tenant qualification-testing admission is blocked",
        );
      },
    );

    it(
      "blocks cross-owner admission",
      () => {
        expect(
          () =>
            createAshaQualificationTestingAdmission({
              admissionId:
                "asha-qualification-testing-cross-owner",
              decision:
                decision(),
              employeeId:
                "asha-specialist-001",
              templateId:
                "asha-specialist-template-001",
              tenantId:
                "tenant-ppa-industrial",
              ownerId:
                "owner-other-001",
              preparedAt:
                "2026-07-15T16:05:00.000Z",
            }),
        ).toThrow(
          "Only the decision-bound owner",
        );
      },
    );

    it(
      "blocks employee or template identity mismatch",
      () => {
        expect(
          () =>
            createAshaQualificationTestingAdmission({
              admissionId:
                "asha-qualification-testing-wrong-template",
              decision:
                decision(),
              employeeId:
                "asha-specialist-001",
              templateId:
                "wrong-template-001",
              tenantId:
                "tenant-ppa-industrial",
              ownerId:
                "owner-prashant-001",
              preparedAt:
                "2026-07-15T16:05:00.000Z",
            }),
        ).toThrow(
          "employee or template identity does not match",
        );
      },
    );

    it(
      "blocks tampered owner-decision digest",
      () => {
        const validDecision =
          decision();

        const tampered = {
          ...validDecision,
          decisionDigest:
            sha256("tampered-decision"),
        } as AshaOwnerQualificationReviewDecision;

        expect(
          () =>
            createAdmission(
              tampered,
            ),
        ).toThrow(
          "Qualification-review decision digest is invalid",
        );
      },
    );

    it(
      "blocks admission before owner approval",
      () => {
        expect(
          () =>
            createAshaQualificationTestingAdmission({
              admissionId:
                "asha-qualification-testing-early",
              decision:
                decision(),
              employeeId:
                "asha-specialist-001",
              templateId:
                "asha-specialist-template-001",
              tenantId:
                "tenant-ppa-industrial",
              ownerId:
                "owner-prashant-001",
              preparedAt:
                "2026-07-15T15:59:00.000Z",
            }),
        ).toThrow(
          "cannot precede owner approval",
        );
      },
    );

    it(
      "creates a deterministic admission digest",
      () => {
        const first =
          createAdmission();

        const second =
          createAdmission();

        expect(
          first.admissionDigest,
        ).toBe(
          second.admissionDigest,
        );
      },
    );

    it(
      "does not treat shadow evidence as qualification evidence",
      () => {
        const admission =
          createAdmission();

        expect(
          admission.authorityBoundary
            .shadowEvidenceAcceptedAsQualificationEvidence,
        ).toBe(false);

        expect(
          admission.authorityBoundary
            .qualificationCasesStillRequired,
        ).toBe(true);

        expect(
          admission.authorityBoundary
            .templateRecordBindingStillRequired,
        ).toBe(true);
      },
    );

    it(
      "never executes qualification or grants runtime authority",
      () => {
        const admission =
          createAdmission();

        expect(
          admission.authorityBoundary,
        ).toMatchObject({
          qualificationTestingExecuted:
            false,
          qualificationEngineInvoked:
            false,
          qualificationReportCreated:
            false,
          formalQualificationIssued:
            false,
          qualifiedManifestCreated:
            false,
          activationCandidateCreated:
            false,
          runtimeActivated:
            false,
          customerDataAccessAuthorized:
            false,
          customerContactAuthorized:
            false,
          externalDeliveryAuthorized:
            false,
          liveProviderExecutionAuthorized:
            false,
          productionMutationAuthorized:
            false,
          paymentExecutionAuthorized:
            false,
          autonomousDecisionAuthorized:
            false,
          productionReadinessAuthorized:
            false,
          publicLaunchAuthorized:
            false,
        });
      },
    );
  },
);