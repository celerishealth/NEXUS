import { NextResponse } from "next/server";
import {
  getNexusDay313CinematicDemoSharingSafetyPack,
  validateNexusDay313CinematicDemoSharingSafetyPack
} from "@/lib/nexus/day313CinematicDemoSharingSafetyPack";

export const dynamic = "force-static";

export async function GET() {
  const sharing = getNexusDay313CinematicDemoSharingSafetyPack();
  const validation = validateNexusDay313CinematicDemoSharingSafetyPack();

  return NextResponse.json({
    ok: validation.ok,
    route: "day-313-cinematic-demo-sharing-safety-pack-preview-only",
    screen: sharing.routePath,
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
    sharing
  });
}