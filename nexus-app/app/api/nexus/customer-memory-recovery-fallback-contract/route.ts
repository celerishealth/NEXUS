import { NextRequest, NextResponse } from "next/server";

import {
  createCustomerMemoryRecoveryFallbackContract,
  type CustomerMemoryRecoveryFallbackContractInput,
} from "../../../../lib/nexus/customerMemoryRecoveryFallbackContract";

export const dynamic = "force-dynamic";

const SAMPLE_INPUT: CustomerMemoryRecoveryFallbackContractInput = {
  businessId: "demo-business",
  customerId: "demo-customer",
  conversationId: "demo-conversation",
  ownerId: "demo-owner",
  recoveryMode: "safe-fallback-preview",
  fallbackReason: "Safe fallback preview required after customer memory safety pipeline review.",
  failedStage: "audit-event-validation",
  requestedAction: "preview-recovery-fallback-contract-only",
  riskLevel: "low",
  safetyDecision: "safe-preview",
  ownerApprovalRequired: false,
  auditEventValidationDecision: "passed",
  isAuditEventValid: true,
  auditEventPreviewId:
    "audit-preview-demo-business-demo-customer-demo-conversation-final-response-safety-preview",
  proposedFinalResponsePreview:
    "Thank you for the update. We will review the request and share the next safe business step after owner approval if required.",
  fallbackPreviewMessage:
    "Safe fallback preview only. No action is executed. Manual owner review may be required.",
  hasRealDatabaseAccess: false,
  hasAuditWriteIntent: false,
  hasAuditPersistenceIntent: false,
  hasWriteIntent: false,
  hasCustomerDataWriteIntent: false,
  hasMemoryWriteIntent: false,
  hasMessageSendingIntent: false,
  hasPaymentIntent: false,
  hasApprovalExecutionIntent: false,
  hasRejectExecutionIntent: false,
  hasOwnerDecisionExecutionIntent: false,
  hasPromptExecutionIntent: false,
  hasAiModelExecutionIntent: false,
  hasResponseGenerationIntent: false,
  hasResponseSendIntent: false,
  hasRecoveryExecutionIntent: false,
  fallbackSubjects: [
    {
      subjectId: "demo-fallback-subject-1",
      subjectType: "customer-memory-recovery-preview",
      label: "Safe recovery fallback preview subject",
      source: "audit-event-validation-preview",
      failedStage: "audit-event-validation",
      decision: "fallback-preview",
      riskLevel: "low",
      confidence: 0.92,
      fallbackAllowed: true,
      containsSensitiveData: false,
      requiresOwnerApproval: false,
    },
  ],
};

export async function GET() {
  return NextResponse.json({
    route: "/api/nexus/customer-memory-recovery-fallback-contract",
    method: "GET",
    ...createCustomerMemoryRecoveryFallbackContract(SAMPLE_INPUT),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CustomerMemoryRecoveryFallbackContractInput;

    return NextResponse.json({
      route: "/api/nexus/customer-memory-recovery-fallback-contract",
      method: "POST",
      ...createCustomerMemoryRecoveryFallbackContract(body),
    });
  } catch {
    return NextResponse.json(
      {
        route: "/api/nexus/customer-memory-recovery-fallback-contract",
        method: "POST",
        ...createCustomerMemoryRecoveryFallbackContract({
          businessId: "",
          customerId: "",
          conversationId: "",
          ownerId: "",
          recoveryMode: "safe-fallback-preview",
          fallbackReason: "Invalid JSON payload blocked.",
          failedStage: "customer-memory-pipeline-preview",
          requestedAction: "invalid-json-payload",
          riskLevel: "low",
          safetyDecision: "blocked",
          ownerApprovalRequired: false,
          auditEventValidationDecision: "blocked",
          isAuditEventValid: false,
          auditEventPreviewId: "",
          proposedFinalResponsePreview: "",
          fallbackPreviewMessage: "",
          hasRealDatabaseAccess: false,
          hasAuditWriteIntent: false,
          hasAuditPersistenceIntent: false,
          hasWriteIntent: false,
          hasCustomerDataWriteIntent: false,
          hasMemoryWriteIntent: false,
          hasMessageSendingIntent: false,
          hasPaymentIntent: false,
          hasApprovalExecutionIntent: false,
          hasRejectExecutionIntent: false,
          hasOwnerDecisionExecutionIntent: false,
          hasPromptExecutionIntent: false,
          hasAiModelExecutionIntent: false,
          hasResponseGenerationIntent: false,
          hasResponseSendIntent: false,
          hasRecoveryExecutionIntent: false,
          fallbackSubjects: [],
        }),
      },
      { status: 400 },
    );
  }
}
