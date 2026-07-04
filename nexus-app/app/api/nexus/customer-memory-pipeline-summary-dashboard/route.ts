import { NextRequest, NextResponse } from "next/server";

import {
  createCustomerMemoryPipelineSummaryDashboardPreview,
  type CustomerMemoryPipelineSummaryDashboardInput,
} from "../../../../lib/nexus/customerMemoryPipelineSummaryDashboard";

export const dynamic = "force-dynamic";

const SAMPLE_INPUT: CustomerMemoryPipelineSummaryDashboardInput = {
  businessId: "demo-business",
  customerId: "demo-customer",
  conversationId: "demo-conversation",
  ownerId: "demo-owner",
  dashboardMode: "pipeline-summary-dashboard-preview",
  requestedAction: "preview-customer-memory-pipeline-summary-dashboard-only",
  riskLevel: "low",
  ownerApprovalRequired: false,
  fullPipelineDecision: "pipeline-preview-safe",
  isPipelinePreviewSafe: true,
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
    route: "/api/nexus/customer-memory-pipeline-summary-dashboard",
    method: "GET",
    ...createCustomerMemoryPipelineSummaryDashboardPreview(SAMPLE_INPUT),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CustomerMemoryPipelineSummaryDashboardInput;

    return NextResponse.json({
      route: "/api/nexus/customer-memory-pipeline-summary-dashboard",
      method: "POST",
      ...createCustomerMemoryPipelineSummaryDashboardPreview(body),
    });
  } catch {
    return NextResponse.json(
      {
        route: "/api/nexus/customer-memory-pipeline-summary-dashboard",
        method: "POST",
        ...createCustomerMemoryPipelineSummaryDashboardPreview({
          businessId: "",
          customerId: "",
          conversationId: "",
          ownerId: "",
          dashboardMode: "pipeline-summary-dashboard-preview",
          requestedAction: "invalid-json-payload",
          riskLevel: "low",
          ownerApprovalRequired: false,
          fullPipelineDecision: "pipeline-preview-blocked",
          isPipelinePreviewSafe: false,
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
          stages: [],
        }),
      },
      { status: 400 },
    );
  }
}
