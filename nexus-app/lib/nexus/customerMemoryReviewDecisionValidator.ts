import {
  customerMemoryReviewDecisionPolicy,
  type CustomerMemoryReviewDecision,
} from "./customerMemoryReviewDecisionPolicy";

export const allowedCustomerMemoryReviewDecisions: CustomerMemoryReviewDecision[] = [
  "pending-review",
  "eligible-for-future-write",
  "blocked-sensitive",
  "blocked-not-useful",
  "blocked-scope-mismatch",
  "expired-before-review",
];

export const customerMemoryReviewDecisionValidator = {
  identity: "NEXUS Backend Customer Memory Review Decision Validator",
  version: "Customer Memory Review Decision Validator v1",
  mode: "read-only-review-decision-validation",
  sourcePolicy: customerMemoryReviewDecisionPolicy.version,
  validationRules: [
    {
      rule: "Allowed Decision Check",
      purpose: "Future memory review decision must match locked policy decisions.",
      lock: "No unknown decision.",
    },
    {
      rule: "Future Write Eligibility Check",
      purpose: "Future-write eligible decision requires scope, sanitization, retention, and usefulness proof.",
      lock: "No unsafe memory write.",
    },
    {
      rule: "Blocked Decision Check",
      purpose: "Blocked decisions must remain blocked and must not trigger writes.",
      lock: "No blocked memory execution.",
    },
    {
      rule: "Reviewer Trace Check",
      purpose: "Decision preview must carry reviewer trace for future audit readiness.",
      lock: "No invisible reviewer.",
    },
    {
      rule: "Timeline Check",
      purpose: "Decision preview must carry timestamp for investigation and recovery.",
      lock: "No missing timeline.",
    },
  ],
  allowedDecisions: allowedCustomerMemoryReviewDecisions,
  forbiddenActions: [
    "This validator must not create queue items.",
    "This validator must not write customer memory.",
    "This validator must not update customer memory.",
    "This validator must not delete customer memory.",
    "This validator must not write customer data.",
    "This validator must not approve a request.",
    "This validator must not reject a request.",
    "This validator must not send a customer message.",
    "This validator must not change payment state.",
    "This validator must not execute risky business action.",
  ],
} as const;

type CustomerMemoryReviewDecisionValidationInput = {
  queueItemId?: string;
  tenantId?: string;
  customerId?: string;
  decision?: CustomerMemoryReviewDecision | string;
  reason?: string;
  reviewer?: string;
  createdAt?: string;
  scopeSafe?: boolean;
  sanitized?: boolean;
  retentionAllowed?: boolean;
  useful?: boolean;
};

export function validateCustomerMemoryReviewDecisionPreview(
  input: CustomerMemoryReviewDecisionValidationInput
) {
  const requiredFields: (keyof CustomerMemoryReviewDecisionValidationInput)[] = [
    "queueItemId",
    "tenantId",
    "customerId",
    "decision",
    "reason",
    "reviewer",
    "createdAt",
  ];

  const missingFields = requiredFields.filter((field) => !input[field]);

  const decisionAllowed = allowedCustomerMemoryReviewDecisions.includes(
    input.decision as CustomerMemoryReviewDecision
  );

  const futureWriteEligible =
    input.decision === "eligible-for-future-write" &&
    input.scopeSafe === true &&
    input.sanitized === true &&
    input.retentionAllowed === true &&
    input.useful === true;

  const eligibleDecisionConsistent =
    input.decision !== "eligible-for-future-write" || futureWriteEligible;

  const blockedDecision =
    input.decision === "blocked-sensitive" ||
    input.decision === "blocked-not-useful" ||
    input.decision === "blocked-scope-mismatch" ||
    input.decision === "expired-before-review";

  const validDecisionShape =
    missingFields.length === 0 && decisionAllowed && eligibleDecisionConsistent;

  return {
    safe: true,
    action: "review-decision-validation-preview-only",
    validDecisionShape,
    missingFields,
    decisionAllowed,
    eligibleDecisionConsistent,
    futureWriteEligible,
    blockedDecision,
    writeAllowedNow: false,
    decision: validDecisionShape
      ? "future-review-decision-valid"
      : "future-review-decision-blocked",
    message:
      "Customer memory review decision validation preview completed. No queue item, memory, or customer data was written.",
  };
}
