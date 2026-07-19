import {
  createHash,
} from "node:crypto";

import type {
  MeeraLimitedInternalPilotQuotationProposalTwoExecution,
} from "./meeraLimitedInternalPilotQuotationProposalTwoExecution";

import type {
  MeeraLimitedInternalPilotQuotationProposalThreeExecution,
} from "./meeraLimitedInternalPilotQuotationProposalThreeExecution";

import type {
  MeeraOwnerLimitedInternalPilotQuotationProposalThreeReviewDecision,
} from "./meeraOwnerLimitedInternalPilotQuotationProposalThreeReviewDecision";

import type {
  SalesCoreLaunchPilotCompletionRecord,
} from "./salesCoreLaunchPilotCompletionRecord";

import type {
  SalesCoreLaunchReadinessDecision,
} from "./salesCoreLaunchReadinessDecision";

import type {
  SalesCoreLaunchActivationPlanningRecord,
} from "./salesCoreLaunchActivationPlanningRecord";

import type {
  SalesCoreLaunchActivationPlanDecision,
} from "./salesCoreLaunchActivationPlanDecision";

export const SALES_CORE_LAUNCH_EVIDENCE_DEFECT_CONTAINMENT_RECORD_VERSION =
  "sales-core-launch-evidence-defect-containment-record-v1" as const;

export interface CreateSalesCoreLaunchEvidenceDefectContainmentRecordInput {
  readonly containmentId: string;

  readonly meeraQuotationProposalTwoExecution:
    MeeraLimitedInternalPilotQuotationProposalTwoExecution;

  readonly meeraQuotationProposalThreeExecution:
    MeeraLimitedInternalPilotQuotationProposalThreeExecution;

  readonly meeraFinalReviewDecision:
    MeeraOwnerLimitedInternalPilotQuotationProposalThreeReviewDecision;

  readonly salesCoreLaunchPilotCompletion:
    SalesCoreLaunchPilotCompletionRecord;

  readonly salesCoreLaunchReadinessDecision:
    SalesCoreLaunchReadinessDecision;

  readonly salesCoreLaunchActivationPlanning:
    SalesCoreLaunchActivationPlanningRecord;

  readonly salesCoreLaunchActivationPlanDecision:
    SalesCoreLaunchActivationPlanDecision;

  readonly reason: string;
  readonly detectedAt: string;
}

export interface SalesCoreLaunchEvidenceDefectContainmentRecord {
  readonly version:
    typeof SALES_CORE_LAUNCH_EVIDENCE_DEFECT_CONTAINMENT_RECORD_VERSION;

  readonly containmentId: string;

  readonly containmentState:
    "SALES_CORE_LAUNCH_EVIDENCE_DEFECT_CONTAINED";

  readonly department:
    "SALES";

  readonly affectedEmployeeId:
    "employee-meera-quotation-proposal-specialist-v1";

  readonly affectedEmployeeCode:
    "nx-sales-005";

  readonly tenantId: string;
  readonly ownerId: string;

  readonly defectClassification:
    "COPY_ADAPTATION_COMMERCIAL_CONTRACT_REGRESSION";

  readonly sourceChain: Readonly<{
    meeraQuotationProposalTwoExecutionId: string;
    meeraQuotationProposalTwoExecutionDigest: string;

    meeraQuotationProposalThreeExecutionId: string;
    meeraQuotationProposalThreeExecutionDigest: string;

    meeraFinalReviewDecisionId: string;
    meeraFinalReviewDecisionDigest: string;

    salesCoreLaunchPilotCompletionId: string;
    salesCoreLaunchPilotCompletionDigest: string;

    salesCoreLaunchReadinessDecisionId: string;
    salesCoreLaunchReadinessDecisionDigest: string;

    salesCoreLaunchActivationPlanningId: string;
    salesCoreLaunchActivationPlanningDigest: string;

    salesCoreLaunchActivationPlanDecisionId: string;
    salesCoreLaunchActivationPlanDecisionDigest: string;

    sourceRegistryDigest: string;
  }>;

  readonly defectEvidence: Readonly<{
    proposalTwoObservedProperty:
      "recommendationDraft";

    proposalTwoObservedOutcome:
      "CLARIFICATION_REQUIRED_BEFORE_RECOMMENDATION";

    proposalTwoCommercialQuotationContractSatisfied:
      false;

    proposalThreeObservedProperty:
      "quotationProposalDraft";

    proposalThreeObservedOutcome:
      "BOUNDED_OPTION_RECOMMENDED_WITH_EXPLICIT_TRADEOFFS";

    proposalThreePreferredOptionObserved:
      "OPTION_A_BOUNDED_SIMPLE_ROLLOUT";

    proposalThreeRecommendationShapeObserved:
      true;

    proposalThreeCommercialQuotationContractSatisfied:
      false;

    finalReviewCertifiedRecommendationShapeAsQuotationEvidence:
      true;

    substantiveCommercialEvidenceSufficient:
      false;
  }>;

  readonly containmentBoundary: Readonly<{
    historicalRecordsMutated:
      false;

    sourceDigestsPreserved:
      true;

    priorActivationPlanApprovalRetainedAsHistoricalEvidenceOnly:
      true;

    containmentOverridesPreparationEligibility:
      true;

    runtimeActivationPreparationEligible:
      false;

    runtimeActivationAuthorized:
      false;

    runtimeActivationExecuted:
      false;

    runtimeActivated:
      false;

    controlledWorkAuthorized:
      false;

    productionAuthorityGranted:
      false;

    realCustomerDataAccessAuthorized:
      false;

    realCustomerContactAuthorized:
      false;

    externalDeliveryAuthorized:
      false;

    liveProviderExecutionAuthorized:
      false;

    paymentExecutionAuthorized:
      false;

    autonomousExecutionAuthorized:
      false;

    publicLaunchAuthorized:
      false;

    remediationRequired:
      true;

    ownerReapprovalRequiredAfterRemediation:
      true;
  }>;

  readonly reason: string;

  readonly nextStep:
    "REMEDIATE_MEERA_COMMERCIAL_EVIDENCE_AND_REQUALIFY_SALES_CORE_LAUNCH";

  readonly detectedAt: string;
  readonly containmentDigest: string;
}

type DigestBoundRecord =
  Readonly<Record<string, unknown>>;

interface ProposalTwoExecutionContract
  extends DigestBoundRecord {
  readonly executionId: string;
  readonly executionDigest: string;
  readonly employeeId: string;
  readonly employeeCode: string;
  readonly tenantId: string;
  readonly ownerId: string;

  readonly recommendationDraft: Readonly<{
    recommendationStatus:
      "DRAFT_CREATED_AWAITING_OWNER_REVIEW";

    recommendationOutcome:
      "CLARIFICATION_REQUIRED_BEFORE_RECOMMENDATION";

    assumptionsMade:
      false;

    missingFactsExplicit:
      true;

    customerDeliveryPrepared:
      false;

    customerDeliveryExecuted:
      false;
  }>;
}

interface ProposalThreeExecutionContract
  extends DigestBoundRecord {
  readonly executionId: string;
  readonly executionDigest: string;
  readonly employeeId: string;
  readonly employeeCode: string;
  readonly tenantId: string;
  readonly ownerId: string;

  readonly sourceQuotationProposalTwoExecutionId:
    string;

  readonly sourceQuotationProposalTwoExecutionDigest:
    string;

  readonly quotationProposalDraft: Readonly<{
    quotationProposalStatus:
      "DRAFT_CREATED_AWAITING_OWNER_REVIEW";

    recommendationOutcome:
      "BOUNDED_OPTION_RECOMMENDED_WITH_EXPLICIT_TRADEOFFS";

    preferredOptionId:
      "OPTION_A_BOUNDED_SIMPLE_ROLLOUT";

    options:
      readonly unknown[];

    rationale:
      readonly string[];

    uncertainties:
      readonly string[];

    ownerDecisionMade:
      false;

    customerDeliveryPrepared:
      false;

    customerDeliveryExecuted:
      false;
  }>;
}

interface MeeraFinalReviewContract
  extends DigestBoundRecord {
  readonly decisionId: string;
  readonly decisionDigest: string;
  readonly employeeId: string;
  readonly employeeCode: string;
  readonly tenantId: string;
  readonly ownerId: string;

  readonly limitedInternalPilotQuotationProposalThreeExecutionId:
    string;

  readonly limitedInternalPilotQuotationProposalThreeExecutionDigest:
    string;

  readonly decision:
    "APPROVE_LIMITED_INTERNAL_PILOT_COMPLETION";

  readonly limitedInternalPilotCompleted:
    true;

  readonly reviewedEvidence: Readonly<{
    quotationProposalStatus:
      "DRAFT_CREATED_AWAITING_OWNER_REVIEW";

    recommendationOutcome:
      "BOUNDED_OPTION_RECOMMENDED_WITH_EXPLICIT_TRADEOFFS";

    preferredOptionId:
      "OPTION_A_BOUNDED_SIMPLE_ROLLOUT";

    optionIds:
      readonly unknown[];

    rationale:
      readonly string[];

    uncertainties:
      readonly string[];
  }>;

  readonly nextStep:
    "LIMITED_INTERNAL_PILOT_COMPLETE";
}

interface CompletionRecordContract
  extends DigestBoundRecord {
  readonly completionId: string;
  readonly completionDigest: string;
  readonly tenantId: string;
  readonly ownerId: string;
  readonly registryDigest: string;

  readonly completedEmployees:
    readonly Readonly<{
      employeeId: string;
      employeeCode: string;
      launchSequence: number;
      sourceDecisionId: string;
      sourceDecisionDigest: string;
    }>[];

  readonly allLimitedInternalPilotsCompleted:
    true;

  readonly nextStep:
    "AWAIT_OWNER_SALES_CORE_LAUNCH_READINESS_DECISION";
}

interface ReadinessDecisionContract
  extends DigestBoundRecord {
  readonly decisionId: string;
  readonly decisionDigest: string;
  readonly tenantId: string;
  readonly ownerId: string;

  readonly sourceCompletionId: string;
  readonly sourceCompletionDigest: string;
  readonly sourceRegistryDigest: string;

  readonly decision:
    "APPROVE_SALES_CORE_LAUNCH_READINESS";

  readonly salesCoreLaunchReadinessApproved:
    true;

  readonly nextStep:
    "AWAIT_OWNER_SALES_CORE_LAUNCH_ACTIVATION_PLANNING";
}

interface ActivationPlanningContract
  extends DigestBoundRecord {
  readonly planningId: string;
  readonly planningDigest: string;
  readonly tenantId: string;
  readonly ownerId: string;

  readonly sourceReadinessDecisionId: string;
  readonly sourceReadinessDecisionDigest: string;
  readonly sourceCompletionId: string;
  readonly sourceCompletionDigest: string;
  readonly sourceRegistryDigest: string;

  readonly nextStep:
    "AWAIT_OWNER_SALES_CORE_LAUNCH_ACTIVATION_PLAN_DECISION";
}

interface ActivationPlanDecisionContract
  extends DigestBoundRecord {
  readonly decisionId: string;
  readonly decisionDigest: string;
  readonly tenantId: string;
  readonly ownerId: string;

  readonly sourcePlanningId: string;
  readonly sourcePlanningDigest: string;
  readonly sourceReadinessDecisionId: string;
  readonly sourceReadinessDecisionDigest: string;
  readonly sourceCompletionId: string;
  readonly sourceCompletionDigest: string;
  readonly sourceRegistryDigest: string;

  readonly decision:
    "APPROVE_SALES_CORE_LAUNCH_ACTIVATION_PLAN";

  readonly activationPlanApproved:
    true;

  readonly runtimeActivationPreparationEligible:
    true;

  readonly authorityBoundary: Readonly<{
    runtimeActivationAuthorized: false;
    runtimeActivationExecuted: false;
    runtimeActivated: false;
    controlledWorkAuthorized: false;
    productionAuthorityGranted: false;
    realCustomerDataAccessAuthorized: false;
    realCustomerContactAuthorized: false;
    externalDeliveryAuthorized: false;
    liveProviderExecutionAuthorized: false;
    paymentExecutionAuthorized: false;
    autonomousExecutionAuthorized: false;
    publicLaunchAuthorized: false;
  }>;

  readonly nextStep:
    "PREPARE_SALES_CORE_LAUNCH_OWNER_ACTIVATED_RUNTIMES";
}

function canonicalize(
  value: unknown,
): string {
  if (
    value === null ||
    typeof value !== "object"
  ) {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value
      .map((item) => canonicalize(item))
      .join(",")}]`;
  }

  const objectValue =
    value as Record<string, unknown>;

  return `{${Object.keys(objectValue)
    .sort()
    .map(
      (key) =>
        `${JSON.stringify(key)}:${canonicalize(
          objectValue[key],
        )}`,
    )
    .join(",")}}`;
}

function digestObject(
  value: unknown,
): string {
  return createHash("sha256")
    .update(canonicalize(value))
    .digest("hex");
}

function requireSafeIdentifier(
  label: string,
  value: string,
): void {
  if (
    typeof value !== "string" ||
    value.length < 3 ||
    value.length > 180 ||
    !/^[A-Za-z0-9][A-Za-z0-9._:-]*$/.test(
      value,
    )
  ) {
    throw new Error(
      `${label} is invalid.`,
    );
  }
}

function requireDigest(
  label: string,
  value: string,
): void {
  if (
    typeof value !== "string" ||
    !/^[a-f0-9]{64}$/.test(value)
  ) {
    throw new Error(
      `${label} is invalid.`,
    );
  }
}

function requireReason(
  value: string,
): void {
  if (
    typeof value !== "string" ||
    value.trim().length < 20 ||
    value.trim().length > 1000
  ) {
    throw new Error(
      "Containment reason is invalid.",
    );
  }
}

function requireIsoTimestamp(
  label: string,
  value: string,
): void {
  if (
    typeof value !== "string" ||
    !Number.isFinite(Date.parse(value)) ||
    new Date(value).toISOString() !== value
  ) {
    throw new Error(
      `${label} is invalid.`,
    );
  }
}

function verifyDigestBoundObject(
  label: string,
  value: DigestBoundRecord,
  digestField: string,
): void {
  const digest =
    value[digestField];

  if (typeof digest !== "string") {
    throw new Error(
      `${label} digest is missing.`,
    );
  }

  requireDigest(
    `${label} digest`,
    digest,
  );

  const unsigned:
    Record<string, unknown> = {
      ...value,
    };

  delete unsigned[digestField];

  if (
    digestObject(unsigned) !==
    digest
  ) {
    throw new Error(
      `${label} digest verification failed.`,
    );
  }
}

function validateSourceChain(
  input:
    CreateSalesCoreLaunchEvidenceDefectContainmentRecordInput,
): {
  proposalTwo:
    ProposalTwoExecutionContract;

  proposalThree:
    ProposalThreeExecutionContract;

  meeraFinal:
    MeeraFinalReviewContract;

  completion:
    CompletionRecordContract;

  readiness:
    ReadinessDecisionContract;

  planning:
    ActivationPlanningContract;

  activationDecision:
    ActivationPlanDecisionContract;
} {
  const proposalTwo =
    input.meeraQuotationProposalTwoExecution as unknown as
      ProposalTwoExecutionContract;

  const proposalThree =
    input.meeraQuotationProposalThreeExecution as unknown as
      ProposalThreeExecutionContract;

  const meeraFinal =
    input.meeraFinalReviewDecision as unknown as
      MeeraFinalReviewContract;

  const completion =
    input.salesCoreLaunchPilotCompletion as unknown as
      CompletionRecordContract;

  const readiness =
    input.salesCoreLaunchReadinessDecision as unknown as
      ReadinessDecisionContract;

  const planning =
    input.salesCoreLaunchActivationPlanning as unknown as
      ActivationPlanningContract;

  const activationDecision =
    input.salesCoreLaunchActivationPlanDecision as unknown as
      ActivationPlanDecisionContract;

  verifyDigestBoundObject(
    "Meera quotation proposal two execution",
    proposalTwo,
    "executionDigest",
  );

  verifyDigestBoundObject(
    "Meera quotation proposal three execution",
    proposalThree,
    "executionDigest",
  );

  verifyDigestBoundObject(
    "Meera final review decision",
    meeraFinal,
    "decisionDigest",
  );

  verifyDigestBoundObject(
    "Sales core launch pilot completion",
    completion,
    "completionDigest",
  );

  verifyDigestBoundObject(
    "Sales core launch readiness decision",
    readiness,
    "decisionDigest",
  );

  verifyDigestBoundObject(
    "Sales core launch activation planning",
    planning,
    "planningDigest",
  );

  verifyDigestBoundObject(
    "Sales core launch activation-plan decision",
    activationDecision,
    "decisionDigest",
  );

  if (
    proposalTwo.employeeId !==
      "employee-meera-quotation-proposal-specialist-v1" ||
    proposalTwo.employeeCode !==
      "nx-sales-005" ||
    proposalThree.employeeId !==
      "employee-meera-quotation-proposal-specialist-v1" ||
    proposalThree.employeeCode !==
      "nx-sales-005" ||
    meeraFinal.employeeId !==
      "employee-meera-quotation-proposal-specialist-v1" ||
    meeraFinal.employeeCode !==
      "nx-sales-005"
  ) {
    throw new Error(
      "Meera employee binding is invalid.",
    );
  }

  if (
    proposalTwo.recommendationDraft
      .recommendationStatus !==
      "DRAFT_CREATED_AWAITING_OWNER_REVIEW" ||
    proposalTwo.recommendationDraft
      .recommendationOutcome !==
      "CLARIFICATION_REQUIRED_BEFORE_RECOMMENDATION" ||
    proposalTwo.recommendationDraft
      .assumptionsMade !==
      false ||
    proposalTwo.recommendationDraft
      .missingFactsExplicit !==
      true ||
    proposalTwo.recommendationDraft
      .customerDeliveryPrepared !==
      false ||
    proposalTwo.recommendationDraft
      .customerDeliveryExecuted !==
      false
  ) {
    throw new Error(
      "Meera proposal-two defect signature is not verified.",
    );
  }

  if (
    proposalThree.quotationProposalDraft
      .quotationProposalStatus !==
      "DRAFT_CREATED_AWAITING_OWNER_REVIEW" ||
    proposalThree.quotationProposalDraft
      .recommendationOutcome !==
      "BOUNDED_OPTION_RECOMMENDED_WITH_EXPLICIT_TRADEOFFS" ||
    proposalThree.quotationProposalDraft
      .preferredOptionId !==
      "OPTION_A_BOUNDED_SIMPLE_ROLLOUT" ||
    !Array.isArray(
      proposalThree.quotationProposalDraft.options,
    ) ||
    proposalThree.quotationProposalDraft.options.length !==
      2 ||
    !Array.isArray(
      proposalThree.quotationProposalDraft.rationale,
    ) ||
    !Array.isArray(
      proposalThree.quotationProposalDraft.uncertainties,
    ) ||
    proposalThree.quotationProposalDraft
      .ownerDecisionMade !==
      false ||
    proposalThree.quotationProposalDraft
      .customerDeliveryPrepared !==
      false ||
    proposalThree.quotationProposalDraft
      .customerDeliveryExecuted !==
      false
  ) {
    throw new Error(
      "Meera proposal-three defect signature is not verified.",
    );
  }

  if (
    meeraFinal.decision !==
      "APPROVE_LIMITED_INTERNAL_PILOT_COMPLETION" ||
    meeraFinal.limitedInternalPilotCompleted !==
      true ||
    meeraFinal.nextStep !==
      "LIMITED_INTERNAL_PILOT_COMPLETE" ||
    meeraFinal.reviewedEvidence
      .quotationProposalStatus !==
      proposalThree.quotationProposalDraft
        .quotationProposalStatus ||
    meeraFinal.reviewedEvidence
      .recommendationOutcome !==
      proposalThree.quotationProposalDraft
        .recommendationOutcome ||
    meeraFinal.reviewedEvidence
      .preferredOptionId !==
      proposalThree.quotationProposalDraft
        .preferredOptionId
  ) {
    throw new Error(
      "Meera final review defect propagation is invalid.",
    );
  }

  if (
    proposalThree
      .sourceQuotationProposalTwoExecutionId !==
      proposalTwo.executionId ||
    proposalThree
      .sourceQuotationProposalTwoExecutionDigest !==
      proposalTwo.executionDigest ||
    meeraFinal
      .limitedInternalPilotQuotationProposalThreeExecutionId !==
      proposalThree.executionId ||
    meeraFinal
      .limitedInternalPilotQuotationProposalThreeExecutionDigest !==
      proposalThree.executionDigest
  ) {
    throw new Error(
      "Meera defective evidence chain is not intact.",
    );
  }

  const meeraCompletion =
    completion.completedEmployees.find(
      (employee) =>
        employee.employeeId ===
        "employee-meera-quotation-proposal-specialist-v1",
    );

  if (
    !meeraCompletion ||
    meeraCompletion.employeeCode !==
      "nx-sales-005" ||
    meeraCompletion.launchSequence !==
      5 ||
    meeraCompletion.sourceDecisionId !==
      meeraFinal.decisionId ||
    meeraCompletion.sourceDecisionDigest !==
      meeraFinal.decisionDigest ||
    completion.allLimitedInternalPilotsCompleted !==
      true ||
    completion.nextStep !==
      "AWAIT_OWNER_SALES_CORE_LAUNCH_READINESS_DECISION"
  ) {
    throw new Error(
      "Sales completion does not bind the affected Meera decision.",
    );
  }

  if (
    readiness.sourceCompletionId !==
      completion.completionId ||
    readiness.sourceCompletionDigest !==
      completion.completionDigest ||
    readiness.sourceRegistryDigest !==
      completion.registryDigest ||
    readiness.decision !==
      "APPROVE_SALES_CORE_LAUNCH_READINESS" ||
    readiness.salesCoreLaunchReadinessApproved !==
      true ||
    readiness.nextStep !==
      "AWAIT_OWNER_SALES_CORE_LAUNCH_ACTIVATION_PLANNING"
  ) {
    throw new Error(
      "Sales readiness source chain is invalid.",
    );
  }

  if (
    planning.sourceReadinessDecisionId !==
      readiness.decisionId ||
    planning.sourceReadinessDecisionDigest !==
      readiness.decisionDigest ||
    planning.sourceCompletionId !==
      completion.completionId ||
    planning.sourceCompletionDigest !==
      completion.completionDigest ||
    planning.sourceRegistryDigest !==
      completion.registryDigest ||
    planning.nextStep !==
      "AWAIT_OWNER_SALES_CORE_LAUNCH_ACTIVATION_PLAN_DECISION"
  ) {
    throw new Error(
      "Sales activation planning source chain is invalid.",
    );
  }

  const boundary =
    activationDecision.authorityBoundary;

  if (
    activationDecision.sourcePlanningId !==
      planning.planningId ||
    activationDecision.sourcePlanningDigest !==
      planning.planningDigest ||
    activationDecision.sourceReadinessDecisionId !==
      readiness.decisionId ||
    activationDecision.sourceReadinessDecisionDigest !==
      readiness.decisionDigest ||
    activationDecision.sourceCompletionId !==
      completion.completionId ||
    activationDecision.sourceCompletionDigest !==
      completion.completionDigest ||
    activationDecision.sourceRegistryDigest !==
      completion.registryDigest ||
    activationDecision.decision !==
      "APPROVE_SALES_CORE_LAUNCH_ACTIVATION_PLAN" ||
    activationDecision.activationPlanApproved !==
      true ||
    activationDecision
      .runtimeActivationPreparationEligible !==
      true ||
    activationDecision.nextStep !==
      "PREPARE_SALES_CORE_LAUNCH_OWNER_ACTIVATED_RUNTIMES" ||
    boundary.runtimeActivationAuthorized !==
      false ||
    boundary.runtimeActivationExecuted !==
      false ||
    boundary.runtimeActivated !==
      false ||
    boundary.controlledWorkAuthorized !==
      false ||
    boundary.productionAuthorityGranted !==
      false ||
    boundary.realCustomerDataAccessAuthorized !==
      false ||
    boundary.realCustomerContactAuthorized !==
      false ||
    boundary.externalDeliveryAuthorized !==
      false ||
    boundary.liveProviderExecutionAuthorized !==
      false ||
    boundary.paymentExecutionAuthorized !==
      false ||
    boundary.autonomousExecutionAuthorized !==
      false ||
    boundary.publicLaunchAuthorized !==
      false
  ) {
    throw new Error(
      "Sales activation-plan decision is not safely containable.",
    );
  }

  const tenantIds = [
    proposalTwo.tenantId,
    proposalThree.tenantId,
    meeraFinal.tenantId,
    completion.tenantId,
    readiness.tenantId,
    planning.tenantId,
    activationDecision.tenantId,
  ];

  const ownerIds = [
    proposalTwo.ownerId,
    proposalThree.ownerId,
    meeraFinal.ownerId,
    completion.ownerId,
    readiness.ownerId,
    planning.ownerId,
    activationDecision.ownerId,
  ];

  if (
    tenantIds.some(
      (tenantId) =>
        tenantId !== tenantIds[0],
    ) ||
    ownerIds.some(
      (ownerId) =>
        ownerId !== ownerIds[0],
    )
  ) {
    throw new Error(
      "Containment source chain crosses tenant or owner identity.",
    );
  }

  return {
    proposalTwo,
    proposalThree,
    meeraFinal,
    completion,
    readiness,
    planning,
    activationDecision,
  };
}

export function validateSalesCoreLaunchEvidenceDefectContainmentRecord(
  record:
    SalesCoreLaunchEvidenceDefectContainmentRecord,
): void {
  verifyDigestBoundObject(
    "Sales core launch evidence-defect containment record",
    record as unknown as DigestBoundRecord,
    "containmentDigest",
  );

  requireSafeIdentifier(
    "Containment ID",
    record.containmentId,
  );

  requireSafeIdentifier(
    "Containment tenant ID",
    record.tenantId,
  );

  requireSafeIdentifier(
    "Containment owner ID",
    record.ownerId,
  );

  requireReason(record.reason);

  requireIsoTimestamp(
    "Containment detected time",
    record.detectedAt,
  );

  Object.entries(record.sourceChain)
    .forEach(([key, value]) => {
      if (key.endsWith("Digest")) {
        requireDigest(key, value);
      } else {
        requireSafeIdentifier(key, value);
      }
    });

  const evidence =
    record.defectEvidence;

  const boundary =
    record.containmentBoundary;

  if (
    record.version !==
      SALES_CORE_LAUNCH_EVIDENCE_DEFECT_CONTAINMENT_RECORD_VERSION ||
    record.containmentState !==
      "SALES_CORE_LAUNCH_EVIDENCE_DEFECT_CONTAINED" ||
    record.department !==
      "SALES" ||
    record.affectedEmployeeId !==
      "employee-meera-quotation-proposal-specialist-v1" ||
    record.affectedEmployeeCode !==
      "nx-sales-005" ||
    record.defectClassification !==
      "COPY_ADAPTATION_COMMERCIAL_CONTRACT_REGRESSION" ||
    evidence.proposalTwoObservedProperty !==
      "recommendationDraft" ||
    evidence.proposalTwoObservedOutcome !==
      "CLARIFICATION_REQUIRED_BEFORE_RECOMMENDATION" ||
    evidence.proposalTwoCommercialQuotationContractSatisfied !==
      false ||
    evidence.proposalThreeObservedProperty !==
      "quotationProposalDraft" ||
    evidence.proposalThreeObservedOutcome !==
      "BOUNDED_OPTION_RECOMMENDED_WITH_EXPLICIT_TRADEOFFS" ||
    evidence.proposalThreePreferredOptionObserved !==
      "OPTION_A_BOUNDED_SIMPLE_ROLLOUT" ||
    evidence.proposalThreeRecommendationShapeObserved !==
      true ||
    evidence.proposalThreeCommercialQuotationContractSatisfied !==
      false ||
    evidence.finalReviewCertifiedRecommendationShapeAsQuotationEvidence !==
      true ||
    evidence.substantiveCommercialEvidenceSufficient !==
      false ||
    boundary.historicalRecordsMutated !==
      false ||
    boundary.sourceDigestsPreserved !==
      true ||
    boundary.priorActivationPlanApprovalRetainedAsHistoricalEvidenceOnly !==
      true ||
    boundary.containmentOverridesPreparationEligibility !==
      true ||
    boundary.runtimeActivationPreparationEligible !==
      false ||
    boundary.runtimeActivationAuthorized !==
      false ||
    boundary.runtimeActivationExecuted !==
      false ||
    boundary.runtimeActivated !==
      false ||
    boundary.controlledWorkAuthorized !==
      false ||
    boundary.productionAuthorityGranted !==
      false ||
    boundary.realCustomerDataAccessAuthorized !==
      false ||
    boundary.realCustomerContactAuthorized !==
      false ||
    boundary.externalDeliveryAuthorized !==
      false ||
    boundary.liveProviderExecutionAuthorized !==
      false ||
    boundary.paymentExecutionAuthorized !==
      false ||
    boundary.autonomousExecutionAuthorized !==
      false ||
    boundary.publicLaunchAuthorized !==
      false ||
    boundary.remediationRequired !==
      true ||
    boundary.ownerReapprovalRequiredAfterRemediation !==
      true ||
    record.nextStep !==
      "REMEDIATE_MEERA_COMMERCIAL_EVIDENCE_AND_REQUALIFY_SALES_CORE_LAUNCH"
  ) {
    throw new Error(
      "Sales core launch evidence-defect containment record is invalid.",
    );
  }
}

export function createSalesCoreLaunchEvidenceDefectContainmentRecord(
  input:
    CreateSalesCoreLaunchEvidenceDefectContainmentRecordInput,
): SalesCoreLaunchEvidenceDefectContainmentRecord {
  requireSafeIdentifier(
    "Containment ID",
    input.containmentId,
  );

  requireReason(input.reason);

  requireIsoTimestamp(
    "Containment detected time",
    input.detectedAt,
  );

  const {
    proposalTwo,
    proposalThree,
    meeraFinal,
    completion,
    readiness,
    planning,
    activationDecision,
  } = validateSourceChain(input);

  const containmentCore = {
    version:
      SALES_CORE_LAUNCH_EVIDENCE_DEFECT_CONTAINMENT_RECORD_VERSION,

    containmentId:
      input.containmentId,

    containmentState:
      "SALES_CORE_LAUNCH_EVIDENCE_DEFECT_CONTAINED" as const,

    department:
      "SALES" as const,

    affectedEmployeeId:
      "employee-meera-quotation-proposal-specialist-v1" as const,

    affectedEmployeeCode:
      "nx-sales-005" as const,

    tenantId:
      proposalTwo.tenantId,

    ownerId:
      proposalTwo.ownerId,

    defectClassification:
      "COPY_ADAPTATION_COMMERCIAL_CONTRACT_REGRESSION" as const,

    sourceChain: {
      meeraQuotationProposalTwoExecutionId:
        proposalTwo.executionId,

      meeraQuotationProposalTwoExecutionDigest:
        proposalTwo.executionDigest,

      meeraQuotationProposalThreeExecutionId:
        proposalThree.executionId,

      meeraQuotationProposalThreeExecutionDigest:
        proposalThree.executionDigest,

      meeraFinalReviewDecisionId:
        meeraFinal.decisionId,

      meeraFinalReviewDecisionDigest:
        meeraFinal.decisionDigest,

      salesCoreLaunchPilotCompletionId:
        completion.completionId,

      salesCoreLaunchPilotCompletionDigest:
        completion.completionDigest,

      salesCoreLaunchReadinessDecisionId:
        readiness.decisionId,

      salesCoreLaunchReadinessDecisionDigest:
        readiness.decisionDigest,

      salesCoreLaunchActivationPlanningId:
        planning.planningId,

      salesCoreLaunchActivationPlanningDigest:
        planning.planningDigest,

      salesCoreLaunchActivationPlanDecisionId:
        activationDecision.decisionId,

      salesCoreLaunchActivationPlanDecisionDigest:
        activationDecision.decisionDigest,

      sourceRegistryDigest:
        completion.registryDigest,
    },

    defectEvidence: {
      proposalTwoObservedProperty:
        "recommendationDraft" as const,

      proposalTwoObservedOutcome:
        "CLARIFICATION_REQUIRED_BEFORE_RECOMMENDATION" as const,

      proposalTwoCommercialQuotationContractSatisfied:
        false as const,

      proposalThreeObservedProperty:
        "quotationProposalDraft" as const,

      proposalThreeObservedOutcome:
        "BOUNDED_OPTION_RECOMMENDED_WITH_EXPLICIT_TRADEOFFS" as const,

      proposalThreePreferredOptionObserved:
        "OPTION_A_BOUNDED_SIMPLE_ROLLOUT" as const,

      proposalThreeRecommendationShapeObserved:
        true as const,

      proposalThreeCommercialQuotationContractSatisfied:
        false as const,

      finalReviewCertifiedRecommendationShapeAsQuotationEvidence:
        true as const,

      substantiveCommercialEvidenceSufficient:
        false as const,
    },

    containmentBoundary: {
      historicalRecordsMutated:
        false as const,

      sourceDigestsPreserved:
        true as const,

      priorActivationPlanApprovalRetainedAsHistoricalEvidenceOnly:
        true as const,

      containmentOverridesPreparationEligibility:
        true as const,

      runtimeActivationPreparationEligible:
        false as const,

      runtimeActivationAuthorized:
        false as const,

      runtimeActivationExecuted:
        false as const,

      runtimeActivated:
        false as const,

      controlledWorkAuthorized:
        false as const,

      productionAuthorityGranted:
        false as const,

      realCustomerDataAccessAuthorized:
        false as const,

      realCustomerContactAuthorized:
        false as const,

      externalDeliveryAuthorized:
        false as const,

      liveProviderExecutionAuthorized:
        false as const,

      paymentExecutionAuthorized:
        false as const,

      autonomousExecutionAuthorized:
        false as const,

      publicLaunchAuthorized:
        false as const,

      remediationRequired:
        true as const,

      ownerReapprovalRequiredAfterRemediation:
        true as const,
    },

    reason:
      input.reason.trim(),

    nextStep:
      "REMEDIATE_MEERA_COMMERCIAL_EVIDENCE_AND_REQUALIFY_SALES_CORE_LAUNCH" as const,

    detectedAt:
      input.detectedAt,
  };

  const record:
    SalesCoreLaunchEvidenceDefectContainmentRecord = {
      ...containmentCore,

      containmentDigest:
        digestObject(containmentCore),
    };

  validateSalesCoreLaunchEvidenceDefectContainmentRecord(
    record,
  );

  return record;
}
