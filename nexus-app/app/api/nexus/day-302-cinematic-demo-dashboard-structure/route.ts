import { NextResponse } from "next/server";
import {
  getNexusDay302CinematicDemoDashboardStructure,
  validateNexusDay302CinematicDemoDashboardStructure
} from "@/lib/nexus/day302CinematicDemoDashboardStructure";

export const dynamic = "force-static";

export async function GET() {
  const dashboard = getNexusDay302CinematicDemoDashboardStructure();
  const validation = validateNexusDay302CinematicDemoDashboardStructure();

  return NextResponse.json({
    ok: validation.ok,
    route: "day-302-cinematic-demo-dashboard-structure-preview-only",
    screen: dashboard.routePath,
    safety: {
      readOnly: true,
      previewOnly: true,
      cinematicDemoOnly: true,
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
    dashboard
  });
}
