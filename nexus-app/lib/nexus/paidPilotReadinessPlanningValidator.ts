import { getPaidPilotReadinessPlanningContract } from "./paidPilotReadinessPlanningContract";

export type PaidPilotReadinessPlanningValidatorCheck = {
  id: string;
  title: string;
  result: "PASS" | "FAIL";
  evidence: string;
  safetyBoundary: string;
};

export type PaidPilotReadinessPlanningValidator = {
  id: string;
  day: 152;
  name: string;
  phase: string;
  mode: "read-only-paid-pilot-planning-validator-preview-only";
  validates: string;
  status: "PASS" | "FAIL";
  validationSummary: {
    totalChecks: number;
    passedChecks: number;
    failedChecks: number;
    previousArchitecturePhaseCleared: boolean;
    paidPilotPlanningStarted: boolean;
    subscriptionLockPlanningOnly: boolean;
    paymentExecutionBlocked: boolean;
    messageSendingBlocked: boolean;
    customerDataWritesBlocked: boolean;
    ownerControlPreserved: boolean;
    lockedVisionPreserved: boolean;
    result: "PASS" | "FAIL";
  };
  checks: PaidPilotReadinessPlanningValidatorCheck[];
  prohibitedActions: string[];
  requiredContinuity: string[];
  nextRecommendedStep: string;
};

export function getPaidPilotReadinessPlanningValidator(): PaidPilotReadinessPlanningValidator {
  const contract = getPaidPilotReadinessPlanningContract();

  const checks: PaidPilotReadinessPlanningValidatorCheck[] = [
    {
      id: "contract-defined",
      title: "Paid pilot readiness contract is defined",
      result: contract.status === "DEFINED" ? "PASS" : "FAIL",
      evidence:
        "The Day 151 paid pilot readiness planning contract must be defined before validation can pass.",
      safetyBoundary:
        "A blocked contract cannot be treated as paid pilot planning readiness.",
    },
    {
      id: "previous-architecture-phase-cleared",
      title: "Previous architecture phase is cleared",
      result: contract.contractSummary.previousArchitecturePhaseCleared
        ? "PASS"
        : "FAIL",
      evidence:
        "Paid pilot readiness planning depends on Day 150 final architecture planning checkpoint clearance.",
      safetyBoundary:
        "Paid pilot planning cannot bypass the final architecture planning checkpoint.",
    },
    {
      id: "subscription-lock-planning-only",
      title: "Subscription Lock remains planning-only",
      result: contract.contractSummary.subscriptionLockPlanningOnly
        ? "PASS"
        : "FAIL",
      evidence:
        "Subscription Lock is defined only as a future access-control planning boundary.",
      safetyBoundary:
        "No real subscription verification, subscription activation, entitlement write, or account lock mutation is enabled.",
    },
    {
      id: "payment-execution-blocked",
      title: "Payment execution remains blocked",
      result: contract.contractSummary.paymentExecutionBlocked ? "PASS" : "FAIL",
      evidence:
        "The paid pilot planning contract explicitly blocks payment execution.",
      safetyBoundary:
        "No payment execution, invoice creation, charging, or payment provider call is enabled.",
    },
    {
      id: "message-sending-blocked",
      title: "Message sending remains blocked",
      result: contract.contractSummary.messageSendingBlocked ? "PASS" : "FAIL",
      evidence:
        "The paid pilot planning contract keeps message sending disabled.",
      safetyBoundary:
        "No WhatsApp, email, SMS, or customer-facing message sending is enabled.",
    },
    {
      id: "customer-data-writes-blocked",
      title: "Customer data writes remain blocked",
      result: contract.contractSummary.customerDataWritesBlocked
        ? "PASS"
        : "FAIL",
      evidence:
        "The paid pilot planning contract keeps customer data writes disabled.",
      safetyBoundary:
        "No customer data write, real DB memory read/write, or audit persistence is enabled.",
    },
    {
      id: "owner-control-preserved",
      title: "Owner control is preserved",
      result: contract.contractSummary.ownerControlPreserved ? "PASS" : "FAIL",
      evidence:
        "Owner Approval remains mandatory before future pilot execution architecture can be enabled.",
      safetyBoundary:
        "No autonomous approval, rejection, or business action execution is allowed.",
    },
    {
      id: "locked-vision-preserved",
      title: "Locked NEXUS vision is preserved",
      result: contract.contractSummary.lockedVisionPreserved ? "PASS" : "FAIL",
      evidence:
        "NEXUS remains an owner-controlled AI Business Operating Layer above existing business software.",
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
    id: "nexus-paid-pilot-readiness-planning-validator-v1",
    day: 152,
    name: "NEXUS Paid Pilot Readiness Planning Validator v1",
    phase: "Paid Pilot Readiness Planning",
    mode: "read-only-paid-pilot-planning-validator-preview-only",
    validates: "Day 151 Paid Pilot Readiness Planning Contract v1",
    status: result,
    validationSummary: {
      totalChecks: checks.length,
      passedChecks,
      failedChecks,
      previousArchitecturePhaseCleared:
        contract.contractSummary.previousArchitecturePhaseCleared,
      paidPilotPlanningStarted:
        contract.contractSummary.paidPilotPlanningStarted,
      subscriptionLockPlanningOnly:
        contract.contractSummary.subscriptionLockPlanningOnly,
      paymentExecutionBlocked:
        contract.contractSummary.paymentExecutionBlocked,
      messageSendingBlocked:
        contract.contractSummary.messageSendingBlocked,
      customerDataWritesBlocked:
        contract.contractSummary.customerDataWritesBlocked,
      ownerControlPreserved: contract.contractSummary.ownerControlPreserved,
      lockedVisionPreserved: contract.contractSummary.lockedVisionPreserved,
      result,
    },
    checks,
    prohibitedActions: contract.prohibitedActions,
    requiredContinuity: contract.requiredContinuity,
    nextRecommendedStep:
      "Day 153: add paid pilot readiness planning summary v1.",
  };
}
