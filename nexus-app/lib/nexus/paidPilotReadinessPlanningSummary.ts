import { getPaidPilotReadinessPlanningValidator } from "./paidPilotReadinessPlanningValidator";

export type PaidPilotReadinessPlanningSummarySection = {
  id: string;
  title: string;
  status: "COMPLETE" | "LOCKED" | "BLOCKED";
  summary: string;
  safetyMeaning: string;
};

export type PaidPilotReadinessPlanningSummary = {
  id: string;
  day: 153;
  name: string;
  phase: string;
  mode: "read-only-paid-pilot-planning-summary-preview-only";
  summarizes: string[];
  status: "CLEARED" | "BLOCKED";
  planningSummary: {
    contractDefined: boolean;
    validatorPassed: boolean;
    paidPilotPlanningStarted: boolean;
    subscriptionLockPlanningOnly: boolean;
    paymentExecutionBlocked: boolean;
    messageSendingBlocked: boolean;
    customerDataWritesBlocked: boolean;
    ownerControlPreserved: boolean;
    lockedVisionPreserved: boolean;
    safeForCheckpoint: boolean;
    result: "PAID_PILOT_PLANNING_SUMMARY_CLEARED" | "BLOCKED";
  };
  sections: PaidPilotReadinessPlanningSummarySection[];
  prohibitedActions: string[];
  requiredContinuity: string[];
  nextRecommendedStep: string;
};

export function getPaidPilotReadinessPlanningSummary(): PaidPilotReadinessPlanningSummary {
  const validator = getPaidPilotReadinessPlanningValidator();

  const cleared =
    validator.status === "PASS" &&
    validator.validationSummary.failedChecks === 0 &&
    validator.validationSummary.paidPilotPlanningStarted &&
    validator.validationSummary.subscriptionLockPlanningOnly &&
    validator.validationSummary.paymentExecutionBlocked &&
    validator.validationSummary.messageSendingBlocked &&
    validator.validationSummary.customerDataWritesBlocked &&
    validator.validationSummary.ownerControlPreserved &&
    validator.validationSummary.lockedVisionPreserved;

  return {
    id: "nexus-paid-pilot-readiness-planning-summary-v1",
    day: 153,
    name: "NEXUS Paid Pilot Readiness Planning Summary v1",
    phase: "Paid Pilot Readiness Planning",
    mode: "read-only-paid-pilot-planning-summary-preview-only",
    summarizes: [
      "Day 151 Paid Pilot Readiness Planning Contract v1",
      "Day 152 Paid Pilot Readiness Planning Validator v1",
    ],
    status: cleared ? "CLEARED" : "BLOCKED",
    planningSummary: {
      contractDefined: true,
      validatorPassed: validator.status === "PASS",
      paidPilotPlanningStarted:
        validator.validationSummary.paidPilotPlanningStarted,
      subscriptionLockPlanningOnly:
        validator.validationSummary.subscriptionLockPlanningOnly,
      paymentExecutionBlocked:
        validator.validationSummary.paymentExecutionBlocked,
      messageSendingBlocked:
        validator.validationSummary.messageSendingBlocked,
      customerDataWritesBlocked:
        validator.validationSummary.customerDataWritesBlocked,
      ownerControlPreserved:
        validator.validationSummary.ownerControlPreserved,
      lockedVisionPreserved:
        validator.validationSummary.lockedVisionPreserved,
      safeForCheckpoint: cleared,
      result: cleared ? "PAID_PILOT_PLANNING_SUMMARY_CLEARED" : "BLOCKED",
    },
    sections: [
      {
        id: "paid-pilot-contract-summary",
        title: "Paid pilot planning contract is defined",
        status: validator.status === "PASS" ? "COMPLETE" : "BLOCKED",
        summary:
          "The paid pilot readiness planning contract defines the safe boundary for moving from architecture planning into paid pilot planning.",
        safetyMeaning:
          "Paid pilot planning readiness does not activate payment, subscriptions, entitlements, or customer-facing execution.",
      },
      {
        id: "subscription-lock-summary",
        title: "Subscription Lock remains planning-only",
        status: validator.validationSummary.subscriptionLockPlanningOnly
          ? "LOCKED"
          : "BLOCKED",
        summary:
          "Subscription Lock is represented only as a future access-control planning layer.",
        safetyMeaning:
          "No real subscription verification, subscription activation, entitlement write, or account lock mutation is enabled.",
      },
      {
        id: "payment-message-block-summary",
        title: "Payment and message execution remain blocked",
        status:
          validator.validationSummary.paymentExecutionBlocked &&
          validator.validationSummary.messageSendingBlocked
            ? "LOCKED"
            : "BLOCKED",
        summary:
          "Payments, invoice creation, charging, payment provider calls, and customer-facing message sending remain disabled.",
        safetyMeaning:
          "No payment execution, invoice creation, WhatsApp message, email, SMS, or external customer communication is enabled.",
      },
      {
        id: "customer-data-block-summary",
        title: "Customer data writes remain blocked",
        status: validator.validationSummary.customerDataWritesBlocked
          ? "LOCKED"
          : "BLOCKED",
        summary:
          "Paid pilot planning does not write customer data, read/write real DB memory, or persist audit events.",
        safetyMeaning:
          "Planning artifacts stay deterministic and preview-only until safe data gates are explicitly designed later.",
      },
      {
        id: "owner-control-summary",
        title: "Owner control is preserved",
        status: validator.validationSummary.ownerControlPreserved
          ? "LOCKED"
          : "BLOCKED",
        summary:
          "Owner Approval remains mandatory before any future pilot execution architecture can be enabled.",
        safetyMeaning:
          "NEXUS cannot act as an autonomous business executor without owner-controlled safety gates.",
      },
      {
        id: "locked-identity-summary",
        title: "Locked NEXUS identity is preserved",
        status: validator.validationSummary.lockedVisionPreserved
          ? "COMPLETE"
          : "BLOCKED",
        summary:
          "NEXUS remains an owner-controlled AI Business Operating Layer above existing business software.",
        safetyMeaning:
          "NEXUS must not become a chatbot, CRM clone, ERP clone, or Make/Zapier clone.",
      },
    ],
    prohibitedActions: validator.prohibitedActions,
    requiredContinuity: validator.requiredContinuity,
    nextRecommendedStep:
      "Day 154: add paid pilot readiness planning checkpoint v1.",
  };
}
