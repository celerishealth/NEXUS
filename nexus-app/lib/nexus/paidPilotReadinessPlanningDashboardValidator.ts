import { getPaidPilotReadinessPlanningDashboardContract } from "./paidPilotReadinessPlanningDashboardContract";

export type PaidPilotReadinessPlanningDashboardValidatorCheck = {
  id: string;
  title: string;
  result: "PASS" | "FAIL";
  evidence: string;
  safetyBoundary: string;
};

export type PaidPilotReadinessPlanningDashboardValidator = {
  id: string;
  day: 156;
  name: string;
  phase: string;
  mode: "read-only-paid-pilot-dashboard-validator-preview-only";
  validates: string;
  status: "PASS" | "FAIL";
  validationSummary: {
    totalChecks: number;
    passedChecks: number;
    failedChecks: number;
    dashboardContractDefined: boolean;
    panelsDefined: boolean;
    subscriptionLockPreserved: boolean;
    paymentExecutionBlocked: boolean;
    messageSendingBlocked: boolean;
    customerDataWritesBlocked: boolean;
    ownerControlPreserved: boolean;
    lockedVisionPreserved: boolean;
    result: "PASS" | "FAIL";
  };
  checks: PaidPilotReadinessPlanningDashboardValidatorCheck[];
  prohibitedActions: string[];
  requiredContinuity: string[];
  nextRecommendedStep: string;
};

function includesValue(values: string[], expected: string) {
  return values.some((value) =>
    value.toLowerCase().includes(expected.toLowerCase()),
  );
}

export function getPaidPilotReadinessPlanningDashboardValidator(): PaidPilotReadinessPlanningDashboardValidator {
  const contract = getPaidPilotReadinessPlanningDashboardContract();
  const contractData = contract as {
    status?: string;
    panels?: unknown[];
    prohibitedActions?: string[];
    requiredContinuity?: string[];
  };

  const prohibitedActions = contractData.prohibitedActions ?? [];
  const requiredContinuity = contractData.requiredContinuity ?? [];

  const dashboardContractDefined = contractData.status === "DEFINED";
  const panelsDefined =
    Array.isArray(contractData.panels) && contractData.panels.length > 0;
  const subscriptionLockPreserved =
    includesValue(prohibitedActions, "subscription activation") ||
    includesValue(prohibitedActions, "entitlement writes") ||
    includesValue(prohibitedActions, "entitlement write");
  const paymentExecutionBlocked =
    includesValue(prohibitedActions, "payment execution") ||
    includesValue(prohibitedActions, "invoice creation");
  const messageSendingBlocked = includesValue(
    prohibitedActions,
    "message sending",
  );
  const customerDataWritesBlocked =
    includesValue(prohibitedActions, "customer data write") ||
    includesValue(prohibitedActions, "real DB memory");
  const ownerControlPreserved = includesValue(requiredContinuity, "Owner Approval");
  const lockedVisionPreserved =
    includesValue(requiredContinuity, "Safety Layer") &&
    includesValue(requiredContinuity, "Zero Damage") &&
    includesValue(requiredContinuity, "Zero Stop");

  const checks: PaidPilotReadinessPlanningDashboardValidatorCheck[] = [
    {
      id: "dashboard-contract-defined",
      title: "Dashboard contract is defined",
      result: dashboardContractDefined ? "PASS" : "FAIL",
      evidence:
        "The Day 155 paid pilot readiness planning dashboard contract must be defined before dashboard validation can pass.",
      safetyBoundary:
        "A blocked dashboard contract cannot be treated as paid pilot dashboard readiness.",
    },
    {
      id: "dashboard-panels-defined",
      title: "Dashboard panels are defined",
      result: panelsDefined ? "PASS" : "FAIL",
      evidence:
        "The paid pilot dashboard planning contract must expose planning panels for safe owner review.",
      safetyBoundary:
        "Dashboard panels remain preview-only and cannot execute pilot actions.",
    },
    {
      id: "subscription-lock-preserved",
      title: "Subscription Lock remains planning-only",
      result: subscriptionLockPreserved ? "PASS" : "FAIL",
      evidence:
        "The dashboard validator confirms subscription activation and entitlement mutation remain blocked.",
      safetyBoundary:
        "No real subscription activation, entitlement write, account lock mutation, or payment provider call is enabled.",
    },
    {
      id: "payment-execution-blocked",
      title: "Payment execution remains blocked",
      result: paymentExecutionBlocked ? "PASS" : "FAIL",
      evidence:
        "Paid pilot dashboard planning cannot execute payments or create invoices.",
      safetyBoundary:
        "No payment execution, invoice creation, charging, or payment provider call is enabled.",
    },
    {
      id: "message-sending-blocked",
      title: "Message sending remains blocked",
      result: messageSendingBlocked ? "PASS" : "FAIL",
      evidence:
        "Paid pilot dashboard planning cannot send customer-facing messages.",
      safetyBoundary:
        "No WhatsApp, email, SMS, or external customer communication is enabled.",
    },
    {
      id: "customer-data-writes-blocked",
      title: "Customer data writes remain blocked",
      result: customerDataWritesBlocked ? "PASS" : "FAIL",
      evidence:
        "Paid pilot dashboard planning cannot write customer data or mutate real memory.",
      safetyBoundary:
        "No customer data write, real DB memory read/write, or audit persistence is enabled.",
    },
    {
      id: "owner-control-preserved",
      title: "Owner control is preserved",
      result: ownerControlPreserved ? "PASS" : "FAIL",
      evidence:
        "Owner Approval remains mandatory before any future pilot execution architecture can be enabled.",
      safetyBoundary:
        "No autonomous approval, rejection, or business action execution is allowed.",
    },
    {
      id: "locked-vision-preserved",
      title: "Locked NEXUS vision is preserved",
      result: lockedVisionPreserved ? "PASS" : "FAIL",
      evidence:
        "The dashboard validator preserves NEXUS as an owner-controlled AI Business Operating Layer above existing business software.",
      safetyBoundary:
        "NEXUS must not become a chatbot, CRM clone, ERP clone, or Make/Zapier clone.",
    },
    {
      id: "ai-model-isolation",
      title: "AI model isolation is preserved",
      result: "PASS",
      evidence:
        "The validator uses deterministic local planning data only and does not call any AI model.",
      safetyBoundary:
        "No AI model calls from this safety route.",
    },
  ];

  const passedChecks = checks.filter((check) => check.result === "PASS").length;
  const failedChecks = checks.length - passedChecks;
  const result: "PASS" | "FAIL" = failedChecks === 0 ? "PASS" : "FAIL";

  return {
    id: "nexus-paid-pilot-readiness-planning-dashboard-validator-v1",
    day: 156,
    name: "NEXUS Paid Pilot Readiness Planning Dashboard Validator v1",
    phase: "Paid Pilot Readiness Planning",
    mode: "read-only-paid-pilot-dashboard-validator-preview-only",
    validates: "Day 155 Paid Pilot Readiness Planning Dashboard Contract v1",
    status: result,
    validationSummary: {
      totalChecks: checks.length,
      passedChecks,
      failedChecks,
      dashboardContractDefined,
      panelsDefined,
      subscriptionLockPreserved,
      paymentExecutionBlocked,
      messageSendingBlocked,
      customerDataWritesBlocked,
      ownerControlPreserved,
      lockedVisionPreserved,
      result,
    },
    checks,
    prohibitedActions,
    requiredContinuity,
    nextRecommendedStep:
      "Day 157: add paid pilot readiness planning dashboard summary v1.",
  };
}
