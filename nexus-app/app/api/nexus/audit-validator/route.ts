import { NextResponse } from "next/server";
import {
  auditEventValidator,
  validateAuditEventPreview,
} from "../../../../lib/nexus/auditEventValidator";

export const dynamic = "force-dynamic";

export async function GET() {
  const sampleAuditEvent = {
    eventId: "preview-event-001",
    tenantId: "preview-tenant",
    customerRequest: "Customer asks for refund and urgent delivery.",
    aiDraft: "Draft response prepared for owner review.",
    riskLevel: "high",
    ownerDecision: "pending-owner-review",
    guardrailResult: "owner-approval-required",
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json({
    ok: true,
    service: "NEXUS Audit Event Validator",
    version: "v1",
    generatedAt: new Date().toISOString(),
    validator: auditEventValidator,
    sampleValidation: validateAuditEventPreview(sampleAuditEvent),
  });
}
