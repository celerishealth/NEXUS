import { NextRequest, NextResponse } from "next/server";

import {
  validateCustomerMemoryRecoveryFallbackPreview,
  type CustomerMemoryRecoveryFallbackValidationInput,
} from "../../../../lib/nexus/customerMemoryRecoveryFallbackValidator";

export const dynamic = "force-dynamic";

const SAMPLE_INPUT: CustomerMemoryRecoveryFallbackValidationInput = {
  businessId: "demo-business",
  customerId: "demo-customer",
  conversationId: "demo-conversation",
  ownerId: "demo-owner",
  recoveryMode: "safe-fallback-preview",
  fallbackReason: "Safe fallback preview required after customer memory safety pipeline review.",
  failedStage: "recovery-fallback-contract",
  requestedAction: "validate-recovery-fallback-preview-only",
  riskLevel: "low",
  safetyDecision: "fallback-preview",
  ownerApprovalRequired: false,
  recoveryFallbackContractDecision: "contract-ready",
  isRecoveryFallbackContractReady: true,
  auditEventPreviewId:
    "audit-preview-demo-business-demo-customer-demo-conversation-final-response-safety-preview",
  proposedFinalResponsePreview:
    "Thank you for the update. We will review the request and share the next safe business step after owner approval if required.",
  fallbackPreviewMessage:
    "Safe fallback preview only. No action is executed. Manual owner review may be required.",
  hasRealDatabaseAccess: false,
  hasAuditWriteIntent: false,
  hasAuditPersistenceIntent: false,
  hasRecoveryWriteIntent: false,
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
      subjectId: "demo-fallback-validation-subject-1",
      subjectType: "customer-memory-recovery-validation-preview",
      label: "Validated recovery fallback preview subject",
      source: "recovery-fallback-contract-preview",
      failedStage: "recovery-fallback-contract",
      decision: "fallback-preview",
      riskLevel: "low",
      confidence: 0.92,
      validatedByContract: true,
      fallbackAllowed: true,
      containsSensitiveData: false,
      requiresOwnerApproval: false,
    },
  ],
};

export async function GET() {
  return NextResponse.json({
    route: "/api/nexus/customer-memory-recovery-fallback-validator",
    method: "GET",
    ...validateCustomerMemoryRecoveryFallbackPreview(SAMPLE_INPUT),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CustomerMemoryRecoveryFallbackValidationInput;

    return NextResponse.json({
      route: "/api/nexus/customer-memory-recovery-fallback-validator",
      method: "POST",
      ...validateCustomerMemoryRecoveryFallbackPreview(body),
    });
  } catch {
    return NextResponse.json(
      {
        route: "/api/nexus/customer-memory-recovery-fallback-validator",
        method: "POST",
        ...validateCustomerMemoryRecoveryFallbackPreview({
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
          recoveryFallbackContractDecision: "blocked",
          isRecoveryFallbackContractReady: false,
          auditEventPreviewId: "",
          proposedFinalResponsePreview: "",
          fallbackPreviewMessage: "",
          hasRealDatabaseAccess: false,
          hasAuditWriteIntent: false,
          hasAuditPersistenceIntent: false,
          hasRecoveryWriteIntent: false,
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
