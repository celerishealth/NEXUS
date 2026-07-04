import { NextRequest, NextResponse } from "next/server";

import {
  orchestrateCustomerMemoryFullPipelinePreview,
  type CustomerMemoryFullPipelinePreviewOrchestratorInput,
} from "../../../../lib/nexus/customerMemoryFullPipelinePreviewOrchestrator";

export const dynamic = "force-dynamic";

const SAMPLE_INPUT: CustomerMemoryFullPipelinePreviewOrchestratorInput = {
  businessId: "demo-business",
  customerId: "demo-customer",
  conversationId: "demo-conversation",
  ownerId: "demo-owner",
  pipelineMode: "full-pipeline-preview-only",
  requestedAction: "preview-full-customer-memory-pipeline-only",
  riskLevel: "low",
  ownerApprovalRequired: false,
  recoveryFallbackValidationDecision: "passed",
  isRecoveryFallbackValid: true,
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
  hasPipelineExecutionIntent: false,
};

export async function GET() {
  return NextResponse.json({
    route: "/api/nexus/customer-memory-full-pipeline-preview-orchestrator",
    method: "GET",
    ...orchestrateCustomerMemoryFullPipelinePreview(SAMPLE_INPUT),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CustomerMemoryFullPipelinePreviewOrchestratorInput;

    return NextResponse.json({
      route: "/api/nexus/customer-memory-full-pipeline-preview-orchestrator",
      method: "POST",
      ...orchestrateCustomerMemoryFullPipelinePreview(body),
    });
  } catch {
    return NextResponse.json(
      {
        route: "/api/nexus/customer-memory-full-pipeline-preview-orchestrator",
        method: "POST",
        ...orchestrateCustomerMemoryFullPipelinePreview({
          businessId: "",
          customerId: "",
          conversationId: "",
          ownerId: "",
          pipelineMode: "full-pipeline-preview-only",
          requestedAction: "invalid-json-payload",
          riskLevel: "low",
          ownerApprovalRequired: false,
          recoveryFallbackValidationDecision: "blocked",
          isRecoveryFallbackValid: false,
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
          hasPipelineExecutionIntent: false,
          pipelineStages: [],
        }),
      },
      { status: 400 },
    );
  }
}
