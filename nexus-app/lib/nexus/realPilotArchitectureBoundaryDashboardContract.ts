import { getRealPilotArchitectureBoundaryCheckpointV1 } from "./realPilotArchitectureBoundaryCheckpoint";
import { getRealPilotArchitectureBoundarySummaryV1 } from "./realPilotArchitectureBoundarySummary";

export type RealPilotArchitectureBoundaryDashboardCardV1 = {
  id: string;
  title: string;
  status: "locked" | "blocked" | "ready-for-preview";
  evidence: string;
  safe: boolean;
};

export type RealPilotArchitectureBoundaryDashboardContractV1 = {
  day: 125;
  name: "NEXUS Real Pilot Architecture Boundary Dashboard Contract v1";
  phase: "Real Pilot Architecture Boundary Planning";
  mode: "dashboard-contract-only";
  readonly: true;
  executable: false;
  previewOnly: true;
  valid: boolean;
  sourceDays: [121, 122, 123, 124];
  dashboardPurpose: {
    showArchitectureBoundary: boolean;
    showExecutionBlocks: boolean;
    showIdentityLock: boolean;
    showSafetyLock: boolean;
    showNextSafePlanningStep: boolean;
  };
  forbiddenDashboardBehavior: {
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
  cards: RealPilotArchitectureBoundaryDashboardCardV1[];
  nextSafeStep: "Real Pilot Architecture Boundary Dashboard Validator v1";
  summary: string;
};

export function getRealPilotArchitectureBoundaryDashboardContractV1(): RealPilotArchitectureBoundaryDashboardContractV1 {
  const checkpoint = getRealPilotArchitectureBoundaryCheckpointV1();
  const boundarySummary = getRealPilotArchitectureBoundarySummaryV1();

  const dashboardPurpose = {
    showArchitectureBoundary: true,
    showExecutionBlocks: true,
    showIdentityLock: true,
    showSafetyLock: true,
    showNextSafePlanningStep: true,
  };

  const forbiddenDashboardBehavior = {
    noRealPilotStartButton: true,
    noApproveRejectAction: true,
    noPaymentAction: true,
    noMessageSendAction: true,
    noCustomerDataMutation: true,
    noRealDbMemoryReadWrite: true,
    noAuditPersistence: true,
    noRecoveryExecution: true,
    noAiModelCalls: true,
    noThirdPartyMutation: true,
  };

  const cards: RealPilotArchitectureBoundaryDashboardCardV1[] = [
    {
      id: "architecture-boundary",
      title: "Real Pilot Architecture Boundary",
      status: "ready-for-preview",
      evidence: "Real pilot remains blocked while planning-only boundary is visible.",
      safe: checkpoint.checkpointStatus.realPilotStillBlocked === true,
    },
    {
      id: "execution-architecture",
      title: "Execution Architecture",
      status: "blocked",
      evidence: "Execution architecture is not approved.",
      safe: checkpoint.checkpointStatus.executionArchitectureStillNotApproved === true,
    },
    {
      id: "identity-lock",
      title: "NEXUS Identity Lock",
      status: "locked",
      evidence: "NEXUS remains an owner-controlled AI Business Operating Layer, not a chatbot, CRM clone, ERP clone, or automation clone.",
      safe: Object.values(checkpoint.identityStatus).every(Boolean),
    },
    {
      id: "safety-lock",
      title: "Safety Lock",
      status: "locked",
      evidence: "No approve/reject execution, payment execution, message sending, customer data write, DB memory read/write, audit persistence, recovery execution, AI calls, or third-party mutation.",
      safe: Object.values(checkpoint.safetyStatus).every(Boolean),
    },
    {
      id: "next-safe-step",
      title: "Next Safe Planning Step",
      status: "ready-for-preview",
      evidence: "Only dashboard validation is allowed next. No execution path is created.",
      safe: checkpoint.valid === true && boundarySummary.valid === true,
    },
  ];

  const valid =
    checkpoint.valid === true &&
    boundarySummary.valid === true &&
    Object.values(dashboardPurpose).every(Boolean) &&
    Object.values(forbiddenDashboardBehavior).every(Boolean) &&
    cards.every((card) => card.safe === true);

  return {
    day: 125,
    name: "NEXUS Real Pilot Architecture Boundary Dashboard Contract v1",
    phase: "Real Pilot Architecture Boundary Planning",
    mode: "dashboard-contract-only",
    readonly: true,
    executable: false,
    previewOnly: true,
    valid,
    sourceDays: [121, 122, 123, 124],
    dashboardPurpose,
    forbiddenDashboardBehavior,
    cards,
    nextSafeStep: "Real Pilot Architecture Boundary Dashboard Validator v1",
    summary:
      "Day 125 defines a preview-only dashboard contract for the real pilot architecture boundary. It shows the boundary, blocked execution, identity lock, safety lock, and next safe planning step without creating any real pilot execution behavior.",
  };
}
