import { getRealPilotExecutionArchitecturePlanningContractV1 } from "./realPilotExecutionArchitecturePlanningContract";

export type RealPilotExecutionArchitecturePlanningValidatorV1 = {
  day: 132;
  name: "NEXUS Real Pilot Execution Architecture Planning Validator v1";
  phase: "Real Pilot Execution Architecture Planning";
  validatesDay: 131;
  mode: "planning-validator-only";
  readonly: true;
  executable: false;
  previewOnly: true;
  realPilotAllowedNow: false;
  executionArchitectureApprovedNow: false;
  valid: boolean;
  checks: {
    contractExists: boolean;
    contractValid: boolean;
    dependsOnClosedBoundaryPhase: boolean;
    planningContractOnly: boolean;
    readonlyOnly: boolean;
    nonExecutable: boolean;
    previewOnly: boolean;
    realPilotStillBlocked: boolean;
    executionArchitectureStillNotApproved: boolean;
    identityLocked: boolean;
    plannedLayersExist: boolean;
    plannedLayersArePlanningOnly: boolean;
    plannedLayersNotImplementedNow: boolean;
    plannedLayersNotExecutableNow: boolean;
    readOnlyObservationGatewayPlanned: boolean;
    ownerApprovalGatePlanned: boolean;
    safetyDecisionFirewallPlanned: boolean;
    executionAdapterBoundaryPlanned: boolean;
    subscriptionLockGatePlanned: boolean;
    noApproveRejectExecution: boolean;
    noPaymentExecution: boolean;
    noMessageSending: boolean;
    noCustomerDataWrite: boolean;
    noRealDbMemoryReadWrite: boolean;
    noAuditPersistence: boolean;
    noRecoveryExecution: boolean;
    noAiModelCalls: boolean;
    noThirdPartyMutation: boolean;
  };
  nextSafeStep: "Real Pilot Execution Architecture Planning Summary v1";
  summary: string;
};

export function getRealPilotExecutionArchitecturePlanningValidatorV1(): RealPilotExecutionArchitecturePlanningValidatorV1 {
  const contract = getRealPilotExecutionArchitecturePlanningContractV1();
  const layerIds = contract.plannedArchitectureLayers.map((layer) => layer.id);

  const checks = {
    contractExists: Boolean(contract),
    contractValid: contract.valid === true,
    dependsOnClosedBoundaryPhase: contract.dependsOnDay === 130 && contract.boundaryGate.previousBoundaryPhaseClosed === true,
    planningContractOnly: contract.mode === "planning-contract-only",
    readonlyOnly: contract.readonly === true,
    nonExecutable: contract.executable === false,
    previewOnly: contract.previewOnly === true,
    realPilotStillBlocked:
      contract.realPilotAllowedNow === false &&
      contract.boundaryGate.realPilotStillBlocked === true,
    executionArchitectureStillNotApproved:
      contract.executionArchitectureApprovedNow === false &&
      contract.boundaryGate.executionArchitectureStillNotApproved === true,
    identityLocked: Object.values(contract.identityLock).every(Boolean),
    plannedLayersExist: contract.plannedArchitectureLayers.length === 5,
    plannedLayersArePlanningOnly: contract.plannedArchitectureLayers.every((layer) => layer.planningOnly === true),
    plannedLayersNotImplementedNow: contract.plannedArchitectureLayers.every((layer) => layer.implementedNow === false),
    plannedLayersNotExecutableNow: contract.plannedArchitectureLayers.every((layer) => layer.executableNow === false),
    readOnlyObservationGatewayPlanned: layerIds.includes("read-only-observation-gateway"),
    ownerApprovalGatePlanned: layerIds.includes("owner-approval-gate"),
    safetyDecisionFirewallPlanned: layerIds.includes("safety-decision-firewall"),
    executionAdapterBoundaryPlanned: layerIds.includes("execution-adapter-boundary"),
    subscriptionLockGatePlanned: layerIds.includes("subscription-lock-gate"),
    noApproveRejectExecution: contract.hardBlocks.noApproveRejectExecution === true,
    noPaymentExecution: contract.hardBlocks.noPaymentExecution === true,
    noMessageSending: contract.hardBlocks.noMessageSending === true,
    noCustomerDataWrite: contract.hardBlocks.noCustomerDataWrite === true,
    noRealDbMemoryReadWrite: contract.hardBlocks.noRealDbMemoryReadWrite === true,
    noAuditPersistence: contract.hardBlocks.noAuditPersistence === true,
    noRecoveryExecution: contract.hardBlocks.noRecoveryExecution === true,
    noAiModelCalls: contract.hardBlocks.noAiModelCalls === true,
    noThirdPartyMutation: contract.hardBlocks.noThirdPartyMutation === true,
  };

  const valid = Object.values(checks).every(Boolean);

  return {
    day: 132,
    name: "NEXUS Real Pilot Execution Architecture Planning Validator v1",
    phase: "Real Pilot Execution Architecture Planning",
    validatesDay: 131,
    mode: "planning-validator-only",
    readonly: true,
    executable: false,
    previewOnly: true,
    realPilotAllowedNow: false,
    executionArchitectureApprovedNow: false,
    valid,
    checks,
    nextSafeStep: "Real Pilot Execution Architecture Planning Summary v1",
    summary:
      "Day 132 validates that the Day 131 real pilot execution architecture planning contract remains planning-only, read-only, preview-only, non-executable, and fully blocked from real pilot execution.",
  };
}
