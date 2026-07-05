import {
  nexusDay303OwnerCommandCenterVisualStory,
  validateNexusDay303OwnerCommandCenterVisualStory
} from "./day303OwnerCommandCenterVisualStory";

export type NexusDay304SampleRequestLine = {
  label: string;
  value: string;
  safety: "sample-only" | "preview-only" | "blocked-execution";
};

export type NexusDay304SimulationStage = {
  stage: string;
  customerSignal: string;
  nexusPreview: string;
  ownerControl: string;
  executionState: "preview-only" | "owner-review-required" | "blocked";
};

export type NexusDay304SampleCustomerRequestSimulation = {
  day: 304;
  title: string;
  mode: "read-only-sample-customer-request-simulation-preview-only";
  sourceDay: 303;
  routePath: "/nexus-cinematic-demo";
  simulationStatus: "structured";
  sampleDataOnly: true;
  launchAuthorization: "not-authorized";
  realCustomerData: "blocked";
  realPaymentExecution: "blocked";
  subscriptionActivation: "blocked";
  invoiceCreation: "blocked";
  gstExecution: "blocked";
  ewayBillGeneration: "blocked";
  governmentApiMutation: "blocked";
  messageSending: "blocked";
  aiModelCalls: "blocked";
  thirdPartyMutation: "blocked";
  globalTradeExecution: "blocked";
  illegalMatter: "blocked";
  greyZoneExecution: "blocked";
  complianceShortcut: "blocked";
  sampleRequestTitle: string;
  sampleRequestLines: NexusDay304SampleRequestLine[];
  simulationStages: NexusDay304SimulationStage[];
  ownerSafeDecisionOptions: string[];
  blockedExecutionProof: string[];
  completionResult: "sample-customer-request-simulation-created-safely";
};

export const nexusDay304SampleCustomerRequestSimulation: NexusDay304SampleCustomerRequestSimulation = {
  day: 304,
  title: "NEXUS Day 304 Sample Customer Request Simulation v1",
  mode: "read-only-sample-customer-request-simulation-preview-only",
  sourceDay: 303,
  routePath: "/nexus-cinematic-demo",
  simulationStatus: "structured",
  sampleDataOnly: true,
  launchAuthorization: "not-authorized",
  realCustomerData: "blocked",
  realPaymentExecution: "blocked",
  subscriptionActivation: "blocked",
  invoiceCreation: "blocked",
  gstExecution: "blocked",
  ewayBillGeneration: "blocked",
  governmentApiMutation: "blocked",
  messageSending: "blocked",
  aiModelCalls: "blocked",
  thirdPartyMutation: "blocked",
  globalTradeExecution: "blocked",
  illegalMatter: "blocked",
  greyZoneExecution: "blocked",
  complianceShortcut: "blocked",
  sampleRequestTitle:
    "Sample customer asks for stock, price, delivery readiness, and payment terms.",
  sampleRequestLines: [
    {
      label: "Customer",
      value: "Sample Retail Buyer",
      safety: "sample-only"
    },
    {
      label: "Request",
      value: "Need 50 units, best price, delivery date, invoice, and payment option.",
      safety: "sample-only"
    },
    {
      label: "NEXUS Preview",
      value: "Detect stock, pricing, payment, invoice, delivery, and commitment risk before action.",
      safety: "preview-only"
    },
    {
      label: "Execution",
      value: "No reply sent. No invoice created. No payment link generated. No commitment executed.",
      safety: "blocked-execution"
    }
  ],
  simulationStages: [
    {
      stage: "1. Request enters demo layer",
      customerSignal:
        "Sample customer requests price, quantity, delivery readiness, invoice, and payment terms.",
      nexusPreview:
        "NEXUS shows the request as sample-only and prepares a non-executing risk preview.",
      ownerControl:
        "Owner sees the request without any customer message being sent.",
      executionState: "preview-only"
    },
    {
      stage: "2. Risk classification appears",
      customerSignal:
        "The request touches pricing, delivery promise, invoice, payment, and customer commitment.",
      nexusPreview:
        "NEXUS flags execution-sensitive areas before any action path is opened.",
      ownerControl:
        "Owner must review risk before any future real-world execution can be considered.",
      executionState: "owner-review-required"
    },
    {
      stage: "3. Safe response draft is previewed",
      customerSignal:
        "Customer expects a clear answer, but real sending is not authorized.",
      nexusPreview:
        "NEXUS can show a sample draft preview, but does not call AI models and does not send messages.",
      ownerControl:
        "Owner sees that draft generation and sending are blocked in this demo phase.",
      executionState: "blocked"
    },
    {
      stage: "4. Compliance and payment stay locked",
      customerSignal:
        "Customer asks about invoice, payment, and delivery.",
      nexusPreview:
        "NEXUS keeps invoice creation, payment execution, GST, e-way bill, delivery promise, and third-party mutation blocked.",
      ownerControl:
        "Owner sees legal-safe readiness requirements before any future pilot execution.",
      executionState: "blocked"
    }
  ],
  ownerSafeDecisionOptions: [
    "Review request risk.",
    "Keep as sample-only preview.",
    "Do not send customer message.",
    "Do not create invoice.",
    "Do not generate payment link.",
    "Do not activate subscription.",
    "Do not execute GST or e-way bill.",
    "Do not create customer/vendor commitment."
  ],
  blockedExecutionProof: [
    "No launch authorization.",
    "No real customer data.",
    "No real payment execution.",
    "No subscription activation.",
    "No invoice creation.",
    "No GST execution.",
    "No e-way bill generation.",
    "No government API mutation.",
    "No customer/vendor message sending.",
    "No AI model calls.",
    "No third-party mutation.",
    "No global trade execution.",
    "No illegal matter.",
    "No grey-zone execution.",
    "No compliance shortcuts."
  ],
  completionResult: "sample-customer-request-simulation-created-safely"
};

export function getNexusDay304SampleCustomerRequestSimulation() {
  return nexusDay304SampleCustomerRequestSimulation;
}

export function validateNexusDay304SampleCustomerRequestSimulation() {
  const day303Validation = validateNexusDay303OwnerCommandCenterVisualStory();
  const day303 = nexusDay303OwnerCommandCenterVisualStory;
  const simulation = nexusDay304SampleCustomerRequestSimulation;

  const simulationText = [
    simulation.sampleRequestTitle,
    ...simulation.sampleRequestLines.map(
      (line) => `${line.label} ${line.value} ${line.safety}`
    ),
    ...simulation.simulationStages.map(
      (stage) =>
        `${stage.stage} ${stage.customerSignal} ${stage.nexusPreview} ${stage.ownerControl} ${stage.executionState}`
    ),
    ...simulation.ownerSafeDecisionOptions,
    ...simulation.blockedExecutionProof
  ].join(" ");

  const requiredLocks = [
    day303Validation.ok,
    day303.storyStatus === "structured",
    day303.routePath === "/nexus-cinematic-demo",
    day303.launchAuthorization === "not-authorized",
    simulation.simulationStatus === "structured",
    simulation.routePath === "/nexus-cinematic-demo",
    simulation.sampleDataOnly === true,
    simulation.launchAuthorization === "not-authorized",
    simulation.realCustomerData === "blocked",
    simulation.realPaymentExecution === "blocked",
    simulation.subscriptionActivation === "blocked",
    simulation.invoiceCreation === "blocked",
    simulation.gstExecution === "blocked",
    simulation.ewayBillGeneration === "blocked",
    simulation.governmentApiMutation === "blocked",
    simulation.messageSending === "blocked",
    simulation.aiModelCalls === "blocked",
    simulation.thirdPartyMutation === "blocked",
    simulation.globalTradeExecution === "blocked",
    simulation.illegalMatter === "blocked",
    simulation.greyZoneExecution === "blocked",
    simulation.complianceShortcut === "blocked",
    simulationText.includes("Sample customer"),
    simulationText.includes("sample-only"),
    simulationText.includes("No reply sent"),
    simulationText.includes("No invoice created"),
    simulationText.includes("No payment link generated"),
    simulationText.includes("No commitment executed"),
    simulationText.includes("pricing, delivery promise, invoice, payment, and customer commitment"),
    simulationText.includes("does not call AI models"),
    simulationText.includes("does not send messages"),
    simulationText.includes("invoice creation, payment execution, GST, e-way bill"),
    simulationText.includes("No launch authorization"),
    simulationText.includes("No real customer data"),
    simulationText.includes("No real payment execution"),
    simulationText.includes("No subscription activation"),
    simulationText.includes("No invoice creation"),
    simulationText.includes("No GST execution"),
    simulationText.includes("No e-way bill generation"),
    simulationText.includes("No government API mutation"),
    simulationText.includes("No customer/vendor message sending"),
    simulationText.includes("No AI model calls"),
    simulationText.includes("No third-party mutation"),
    simulationText.includes("No global trade execution"),
    simulationText.includes("No illegal matter"),
    simulationText.includes("No grey-zone execution"),
    simulationText.includes("No compliance shortcuts")
  ];

  return {
    ok: requiredLocks.every(Boolean),
    day: simulation.day,
    sourceDay: simulation.sourceDay,
    title: simulation.title,
    mode: simulation.mode,
    routePath: simulation.routePath,
    simulationStatus: simulation.simulationStatus,
    day303Validation,
    requiredLocksPassed: requiredLocks.every(Boolean),
    sampleDataOnly: simulation.sampleDataOnly,
    launchAuthorization: simulation.launchAuthorization,
    realCustomerData: simulation.realCustomerData,
    realPaymentExecution: simulation.realPaymentExecution,
    subscriptionActivation: simulation.subscriptionActivation,
    invoiceCreation: simulation.invoiceCreation,
    gstExecution: simulation.gstExecution,
    ewayBillGeneration: simulation.ewayBillGeneration,
    governmentApiMutation: simulation.governmentApiMutation,
    messageSending: simulation.messageSending,
    aiModelCalls: simulation.aiModelCalls,
    thirdPartyMutation: simulation.thirdPartyMutation,
    globalTradeExecution: simulation.globalTradeExecution,
    illegalMatter: simulation.illegalMatter,
    greyZoneExecution: simulation.greyZoneExecution,
    complianceShortcut: simulation.complianceShortcut,
    completionResult: simulation.completionResult
  };
}
