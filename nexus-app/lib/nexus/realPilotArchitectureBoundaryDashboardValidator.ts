import { getRealPilotArchitectureBoundaryDashboardContractV1 } from "./realPilotArchitectureBoundaryDashboardContract";

export type RealPilotArchitectureBoundaryDashboardValidatorV1 = {
  day: 126;
  name: "NEXUS Real Pilot Architecture Boundary Dashboard Validator v1";
  phase: "Real Pilot Architecture Boundary Planning";
  validatesDay: 125;
  mode: "dashboard-validator-only";
  readonly: true;
  executable: false;
  previewOnly: true;
  valid: boolean;
  checks: {
    contractExists: boolean;
    dashboardContractOnly: boolean;
    previewOnly: boolean;
    readonlyOnly: boolean;
    nonExecutable: boolean;
    sourceDaysComplete: boolean;
    validContract: boolean;
    cardsAllSafe: boolean;
    architectureBoundaryCardExists: boolean;
    executionBlockCardExists: boolean;
    identityLockCardExists: boolean;
    safetyLockCardExists: boolean;
    nextSafeStepCardExists: boolean;
    noRealPilotStartButton: boolean;
    noApproveRejectAction: boolean;
    noPaymentAction: boolean;
    noMessageSendAction: boolean;
    noCustomerDataMutation: boolean;
    noRealDbMemoryReadWrite: boolean;
    noAuditPersistence: boolean;
    noRecoveryExecution: boolean;
    noAiModelCalls: boolean;
    noThirdPartyMutation: boolean;
  };
  summary: string;
};

export function getRealPilotArchitectureBoundaryDashboardValidatorV1(): RealPilotArchitectureBoundaryDashboardValidatorV1 {
  const dashboardContract = getRealPilotArchitectureBoundaryDashboardContractV1();
  const cardIds = dashboardContract.cards.map((card) => card.id);

  const checks = {
    contractExists: Boolean(dashboardContract),
    dashboardContractOnly: dashboardContract.mode === "dashboard-contract-only",
    previewOnly: dashboardContract.previewOnly === true,
    readonlyOnly: dashboardContract.readonly === true,
    nonExecutable: dashboardContract.executable === false,
    sourceDaysComplete:
      dashboardContract.sourceDays[0] === 121 &&
      dashboardContract.sourceDays[1] === 122 &&
      dashboardContract.sourceDays[2] === 123 &&
      dashboardContract.sourceDays[3] === 124,
    validContract: dashboardContract.valid === true,
    cardsAllSafe: dashboardContract.cards.every((card) => card.safe === true),
    architectureBoundaryCardExists: cardIds.includes("architecture-boundary"),
    executionBlockCardExists: cardIds.includes("execution-architecture"),
    identityLockCardExists: cardIds.includes("identity-lock"),
    safetyLockCardExists: cardIds.includes("safety-lock"),
    nextSafeStepCardExists: cardIds.includes("next-safe-step"),
    noRealPilotStartButton: dashboardContract.forbiddenDashboardBehavior.noRealPilotStartButton === true,
    noApproveRejectAction: dashboardContract.forbiddenDashboardBehavior.noApproveRejectAction === true,
    noPaymentAction: dashboardContract.forbiddenDashboardBehavior.noPaymentAction === true,
    noMessageSendAction: dashboardContract.forbiddenDashboardBehavior.noMessageSendAction === true,
    noCustomerDataMutation: dashboardContract.forbiddenDashboardBehavior.noCustomerDataMutation === true,
    noRealDbMemoryReadWrite: dashboardContract.forbiddenDashboardBehavior.noRealDbMemoryReadWrite === true,
    noAuditPersistence: dashboardContract.forbiddenDashboardBehavior.noAuditPersistence === true,
    noRecoveryExecution: dashboardContract.forbiddenDashboardBehavior.noRecoveryExecution === true,
    noAiModelCalls: dashboardContract.forbiddenDashboardBehavior.noAiModelCalls === true,
    noThirdPartyMutation: dashboardContract.forbiddenDashboardBehavior.noThirdPartyMutation === true,
  };

  const valid = Object.values(checks).every(Boolean);

  return {
    day: 126,
    name: "NEXUS Real Pilot Architecture Boundary Dashboard Validator v1",
    phase: "Real Pilot Architecture Boundary Planning",
    validatesDay: 125,
    mode: "dashboard-validator-only",
    readonly: true,
    executable: false,
    previewOnly: true,
    valid,
    checks,
    summary:
      "Day 126 validates that the Day 125 real pilot architecture boundary dashboard contract remains preview-only, read-only, non-executable, fully safe, and blocked from every real pilot execution behavior.",
  };
}
