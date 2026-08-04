import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_ONE_EXECUTION,
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecution,
} from "./engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecution";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_ONE_EXECUTION_OWNER_REVIEW_DECISION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-founder-routine-execution-reduction-evidence-sequence-one-execution-owner-review-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_ONE_OWNER_REVIEW_DECISIONS =
  [
    "APPROVE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_ONE_EXECUTION",
    "REJECT_AND_RETAIN_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_ONE_EXECUTION",
  ] as const;

export type EngineeringAIWorkforceFounderRoutineExecutionReductionEvidenceSequenceOneOwnerReviewDecisionType =
  (typeof ENGINEERING_AI_WORKFORCE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_ONE_OWNER_REVIEW_DECISIONS)[number];

export interface CreateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecutionOwnerReviewDecisionInput {
  readonly decisionId: string;
  readonly sourceExecution:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_ONE_EXECUTION;
  readonly ownerId: string;
  readonly decision:
    EngineeringAIWorkforceFounderRoutineExecutionReductionEvidenceSequenceOneOwnerReviewDecisionType;
  readonly reason: string;
  readonly decidedAt: string;
}

const ID=/^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DIGEST=/^[0-9a-f]{64}$/;

function normalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalize);
  if (value !== null && typeof value === "object") {
    const record=value as Record<string,unknown>;
    return Object.fromEntries(Object.keys(record).sort().map((key)=>[key,normalize(record[key])]));
  }
  return value;
}

function sha256(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(normalize(value)),"utf8").digest("hex");
}

function deepFreeze<T>(value:T):T {
  if(value!==null && typeof value==="object" && !Object.isFrozen(value)){
    Object.values(value as Record<string,unknown>).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}

function requireIdentifier(label:string,value:string):void {
  if(value.trim()!==value || !ID.test(value)) throw new Error(`${label} is invalid.`);
}

function requireTimestamp(label:string,value:string):void {
  if(value.trim()!==value || !value.endsWith("Z") || Number.isNaN(Date.parse(value)) || new Date(value).toISOString()!==value){
    throw new Error(`${label} is invalid.`);
  }
}

function requireReason(value:string):string {
  if(value.trim()!==value || value.length<120) throw new Error("Owner-review reason is invalid.");
  return value;
}

const execution=
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_ONE_EXECUTION;

function validateCanonicalExecution():void {
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecution(execution);
  if(
    execution.executionState!=="ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_ONE_EXECUTED_AWAITING_OWNER_REVIEW" ||
    execution.workstreamSequence!==4 ||
    execution.controlId!=="ROUTINE_ENGINEERING_WORK_COVERAGE_BASELINE" ||
    execution.evidence.executedEvidenceItemCount!==1 ||
    execution.evidence.blockedEvidenceItemCount!==7 ||
    execution.evidence.actualRoutineTaskExecuted!==false ||
    execution.evidence.founderRoutineExecutionReductionClaimed!==false ||
    execution.authorityBoundary.nextEvidenceExecutionAuthorized!==false ||
    execution.authorityBoundary.repositoryReadAuthorized!==false ||
    execution.authorityBoundary.productionDeploymentAuthorized!==false ||
    execution.authorityBoundary.founderLiberationAchieved!==false
  ){
    throw new Error("Canonical founder routine execution reduction sequence-one execution is invalid.");
  }
}

function buildDecision(
  decisionId:string,
  ownerId:string,
  decision:EngineeringAIWorkforceFounderRoutineExecutionReductionEvidenceSequenceOneOwnerReviewDecisionType,
  reason:string,
  decidedAt:string,
){
  const approved=decision==="APPROVE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_ONE_EXECUTION";
  const core={
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_ONE_EXECUTION_OWNER_REVIEW_DECISION_VERSION,
    decisionId,
    decisionState:
      "OWNER_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_ONE_EXECUTION_REVIEW_RECORDED" as const,
    tenantId:execution.tenantId,
    ownerId,
    sourceExecutionId:execution.executionId,
    sourceExecutionDigest:execution.executionDigest,
    sourceDecisionId:execution.sourceDecisionId,
    sourceDecisionDigest:execution.sourceDecisionDigest,
    sourceCandidateDecisionDigest:execution.sourceCandidateDecisionDigest,
    workstreamSequence:4 as const,
    workstreamId:"founder-routine-execution-reduction-evidence" as const,
    evidenceSequence:1 as const,
    controlId:"ROUTINE_ENGINEERING_WORK_COVERAGE_BASELINE" as const,
    decision,
    approved,
    reason,
    reviewedEvidence:{
      routineCategoryCount:execution.evidence.routineCategoryCount,
      repeatableRoutineCategoryCount:execution.evidence.repeatableRoutineCategoryCount,
      syntheticallyCoveredRepeatableCategoryCount:
        execution.evidence.syntheticallyCoveredRepeatableCategoryCount,
      syntheticRepeatableCoveragePercent:
        execution.evidence.syntheticRepeatableCoveragePercent,
      executedEvidenceItemCount:execution.evidence.executedEvidenceItemCount,
      blockedEvidenceItemCount:execution.evidence.blockedEvidenceItemCount,
      actualRoutineTaskExecuted:execution.evidence.actualRoutineTaskExecuted,
      founderTimeReductionMeasured:execution.evidence.founderTimeReductionMeasured,
      founderRoutineExecutionReductionClaimed:
        execution.evidence.founderRoutineExecutionReductionClaimed,
      deterministicCoverageVerified:execution.evidence.deterministicCoverageVerified,
    },
    authorityBoundary:{
      canonicalExecutionBound:true as const,
      executionIntegrityVerified:true as const,
      sequenceOneOwnerReviewed:true as const,
      sequenceTwoSyntheticEvidenceAuthorized:approved,
      nextEvidenceExecutionAuthorized:approved,
      actualRoutineTaskExecutionAuthorized:false as const,
      founderRoutineExecutionReductionClaimAuthorized:false as const,
      founderRoutineExecutionReductionClaimed:false as const,
      repositoryReadAuthorized:false as const,
      repositoryWriteAuthorized:false as const,
      filesystemMutationAuthorized:false as const,
      commandExecutionAuthorized:false as const,
      packageExecutionAuthorized:false as const,
      networkAccessAuthorized:false as const,
      productionDeploymentAuthorized:false as const,
      paymentExecutionAuthorized:false as const,
      publicLaunchAuthorized:false as const,
      levelThreeAuthorityGranted:false as const,
      founderLiberationAssessmentAuthorized:false as const,
      founderLiberationAchieved:false as const,
      founderReleasedFromRoutineExecution:false as const,
      ownerFinalAuthorityPreserved:true as const,
    },
    nextStep:(
      approved
        ?"EXECUTE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO"
        :"RETAIN_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_ONE_AWAITING_OWNER_REVIEW"
    ) as
      |"EXECUTE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO"
      |"RETAIN_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_ONE_AWAITING_OWNER_REVIEW",
    decidedAt,
  };
  return deepFreeze({...core,decisionDigest:sha256(core)});
}

export type EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecutionOwnerReviewDecision =
  ReturnType<typeof buildDecision>;

export function validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecutionOwnerReviewDecision(
  record:EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecutionOwnerReviewDecision,
):void {
  validateCanonicalExecution();
  requireIdentifier("Owner-review decision ID",record.decisionId);
  requireTimestamp("Owner-review decision time",record.decidedAt);
  requireReason(record.reason);
  const expected=buildDecision(record.decisionId,record.ownerId,record.decision,record.reason,record.decidedAt);
  if(
    !DIGEST.test(record.decisionDigest) ||
    record.decisionDigest!==expected.decisionDigest ||
    sha256(record)!==sha256(expected) ||
    record.ownerId!==execution.ownerId ||
    record.sourceExecutionDigest!==execution.executionDigest ||
    Date.parse(record.decidedAt)<Date.parse(execution.executedAt) ||
    record.authorityBoundary.actualRoutineTaskExecutionAuthorized!==false ||
    record.authorityBoundary.repositoryReadAuthorized!==false ||
    record.authorityBoundary.productionDeploymentAuthorized!==false ||
    record.authorityBoundary.founderLiberationAchieved!==false ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.reviewedEvidence) ||
    !Object.isFrozen(record.authorityBoundary)
  ){
    throw new Error("Founder routine execution reduction sequence-one owner-review decision is invalid.");
  }
}

export function createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecutionOwnerReviewDecision(
  input:CreateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecutionOwnerReviewDecisionInput,
):EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecutionOwnerReviewDecision {
  if(input.sourceExecution!==execution) throw new Error("Only the canonical sequence-one execution can receive owner review.");
  validateCanonicalExecution();
  requireIdentifier("Owner-review decision ID",input.decisionId);
  requireTimestamp("Owner-review decision time",input.decidedAt);
  requireReason(input.reason);
  if(input.ownerId!==execution.ownerId) throw new Error("Owner identity is invalid.");
  if(!ENGINEERING_AI_WORKFORCE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_ONE_OWNER_REVIEW_DECISIONS.includes(input.decision)){
    throw new Error("Owner-review decision is invalid.");
  }
  if(Date.parse(input.decidedAt)<Date.parse(execution.executedAt)){
    throw new Error("Owner review cannot precede sequence-one execution.");
  }
  const record=buildDecision(input.decisionId,input.ownerId,input.decision,input.reason,input.decidedAt);
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecutionOwnerReviewDecision(record);
  return record;
}