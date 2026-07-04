import { getPaidPilotReadinessPlanningDashboardValidator } from "./paidPilotReadinessPlanningDashboardValidator";

export type PaidPilotReadinessPlanningDashboardSummarySection = {
  id: string;
  title: string;
  status: "COMPLETE" | "LOCKED" | "BLOCKED";
  summary: string;
  safetyMeaning: string;
};

export type PaidPilotReadinessPlanningDashboardSummary = {
  id: string;
  day: 157;
  name: string;
  phase: string;
  mode: "read-only-paid-pilot-dashboard-summary-preview-only";
  summarizes: string[];
  status: "CLEARED" | "BLOCKED";
  dashboardSummary: {
    dashboardContractDefined: boolean;
    dashboardValidatorPassed: boolean;
    panelsDefined: boolean;
    subscriptionLockPreserved: boolean;
    paymentExecutionBlocked: boolean;
    messageSendingBlocked: boolean;
    customerDataWritesBlocked: boolean;
    ownerControlPreserved: boolean;
    lockedVisionPreserved: boolean;
    safeForDashboardCheckpoint: boolean;
    result: "PAID_PILOT_DASHBOARD_SUMMARY_CLEARED" | "BLOCKED";
  };
  sections: PaidPilotReadinessPlanningDashboardSummarySection[];
  prohibitedActions: string[];
  requiredContinuity: string[];
  nextRecommendedStep: string;
};

export function getPaidPilotReadinessPlanningDashboardSummary(): PaidPilotReadinessPlanningDashboardSummary {
  const validator = getPaidPilotReadinessPlanningDashboardValidator();

  const cleared =
    validator.status === "PASS" &&
    validator.validationSummary.failedChecks === 0 &&
    validator.validationSummary.dashboardContractDefined &&
    validator.validationSummary.panelsDefined &&
    validator.validationSummary.subscriptionLockPreserved &&
    validator.validationSummary.paymentExecutionBlocked &&
    validator.validationSummary.messageSendingBlocked &&
    validator.validationSummary.customerDataWritesBlocked &&
    validator.validationSummary.ownerControlPreserved &&
    validator.validationSummary.lockedVisionPreserved;

  return {
    id: "nexus-paid-pilot-readiness-planning-dashboard-summary-v1",
    day: 157,
    name: "NEXUS Paid Pilot Readiness Planning Dashboard Summary v1",
    phase: "Paid Pilot Readiness Planning",
    mode: "read-only-paid-pilot-dashboard-summary-preview-only",
    summarizes: [
      "Day 155 Paid Pilot Readiness Planning Dashboard Contract v1",
      "Day 156 Paid Pilot Readiness Planning Dashboard Validator v1",
    ],
    status: cleared ? "CLEARED" : "BLOCKED",
    dashboardSummary: {
      dashboardContractDefined:
        validator.validationSummary.dashboardContractDefined,
      dashboardValidatorPassed: validator.status === "PASS",
      panelsDefined: validator.validationSummary.panelsDefined,
      subscriptionLockPreserved:
        validator.validationSummary.subscriptionLockPreserved,
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
      safeForDashboardCheckpoint: cleared,
      result: cleared ? "PAID_PILOT_DASHBOARD_SUMMARY_CLEARED" : "BLOCKED",
    },
    sections: [
      {
        id: "dashboard-contract-summary",
        title: "Paid pilot dashboard contract is validated",
        status: validator.validationSummary.dashboardContractDefined
          ? "COMPLETE"
          : "BLOCKED",
        summary:
          "The paid pilot readiness planning dashboard contract is represented and validated as a safe preview-only planning surface.",
        safetyMeaning:
          "The dashboard cannot activate paid access, collect payment, create invoices, mutate entitlements, or provision real accounts.",
      },
      {
        id: "dashboard-panel-summary",
        title: "Dashboard panels are planning-only",
        status: validator.validationSummary.panelsDefined
          ? "COMPLETE"
          : "BLOCKED",
        summary:
          "The dashboard panels are available for owner review and paid pilot planning visibility.",
        safetyMeaning:
          "Dashboard panels remain read-only and cannot execute pilot actions or mutate business systems.",
      },
      {
        id: "subscription-lock-summary",
        title: "Subscription Lock remains protected",
        status: validator.validationSummary.subscriptionLockPreserved
          ? "LOCKED"
          : "BLOCKED",
        summary:
          "Subscription Lock remains a future access-control planning layer only.",
        safetyMeaning:
          "No real subscription activation, entitlement write, account lock mutation, or payment provider call is enabled.",
      },
      {
        id: "payment-message-summary",
        title: "Payment and message execution remain blocked",
        status:
          validator.validationSummary.paymentExecutionBlocked &&
          validator.validationSummary.messageSendingBlocked
            ? "LOCKED"
            : "BLOCKED",
        summary:
          "The paid pilot dashboard summary keeps payments, invoice creation, charging, and customer-facing message sending disabled.",
        safetyMeaning:
          "No payment execution, WhatsApp, email, SMS, or external customer communication is enabled.",
      },
      {
        id: "customer-data-summary",
        title: "Customer data writes remain blocked",
        status: validator.validationSummary.customerDataWritesBlocked
          ? "LOCKED"
          : "BLOCKED",
        summary:
          "The paid pilot dashboard summary does not write customer data, mutate real memory, or persist audit events.",
        safetyMeaning:
          "No customer data write, real DB memory read/write, or audit persistence is enabled.",
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
      "Day 158: add paid pilot readiness planning dashboard checkpoint v1.",
  };
}
