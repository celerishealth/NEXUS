import { NextResponse } from "next/server";
import {
  getNexusDay303OwnerCommandCenterVisualStory,
  validateNexusDay303OwnerCommandCenterVisualStory
} from "@/lib/nexus/day303OwnerCommandCenterVisualStory";

export const dynamic = "force-static";

export async function GET() {
  const story = getNexusDay303OwnerCommandCenterVisualStory();
  const validation = validateNexusDay303OwnerCommandCenterVisualStory();

  return NextResponse.json({
    ok: validation.ok,
    route: "day-303-owner-command-center-visual-story-preview-only",
    screen: story.routePath,
    safety: {
      readOnly: true,
      previewOnly: true,
      sampleDataOnly: true,
      launchAuthorization: false,
      subscriptionActivation: false,
      paymentExecution: false,
      invoiceCreation: false,
      entitlementWrites: false,
      customerDataWrites: false,
      realDbMemoryReadWrite: false,
      auditPersistence: false,
      approveRejectExecution: false,
      ownerOverrideExecution: false,
      recoveryRollbackExecution: false,
      messageSending: false,
      thirdPartyMutation: false,
      aiModelCalls: false,
      globalTradeOrderPlacement: false,
      shipmentBooking: false,
      customerCommitmentExecution: false,
      vendorCustomerMessageSending: false,
      gstExecution: false,
      ewayBillGeneration: false,
      governmentApiMutation: false,
      complianceFiling: false,
      illegalMatter: false,
      greyZoneExecution: false,
      complianceShortcut: false
    },
    validation,
    story
  });
}
