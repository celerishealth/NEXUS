"use client";


import NexusFounderEmergencyControl from "@/components/nexus/NexusFounderEmergencyControl";
import NexusControlledPaidPilotRegistry from "@/components/nexus/NexusControlledPaidPilotRegistry";
import NexusRootStaticEvidencePanels from "@/components/nexus/NexusRootStaticEvidencePanels";
import NexusRootPaidPilotReadinessPanels from "@/components/nexus/NexusRootPaidPilotReadinessPanels";
import NexusRootArchitectureEvidencePanels from "@/components/nexus/NexusRootArchitectureEvidencePanels";
import NexusRootMvpReadinessPanel from "@/components/nexus/NexusRootMvpReadinessPanel";
import NexusRootCinematicDemoPanels from "@/components/nexus/NexusRootCinematicDemoPanels";
import NexusRootHeaderStatusPanels from "@/components/nexus/NexusRootHeaderStatusPanels";
import NexusRootSidebar from "@/components/nexus/NexusRootSidebar";
import NexusRootAiBrain from "@/components/nexus/NexusRootAiBrain";
import NexusRootLaunchGate from "@/components/nexus/NexusRootLaunchGate";
import {
  NexusRootBuildLogPanel,
  NexusRootRecentActivityPanel,
  NexusRootSafetyLayerPanel,
} from "@/components/nexus/NexusRootOperationalPanels";

export default function Home() {
  return (
    <NexusRootLaunchGate>
      <main
        style={{
          minHeight: "100vh",
          background: "#020617",
          color: "white",
          display: "flex",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <NexusRootSidebar />

        <section style={{ flex: 1, padding: "32px", overflow: "auto" }}>
          <NexusRootHeaderStatusPanels />

          <NexusRootAiBrain>

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginTop: "28px",
            }}
          >
            <NexusRootRecentActivityPanel />

        <NexusRootCinematicDemoPanels />

            <NexusRootBuildLogPanel />

        <NexusRootArchitectureEvidencePanels />
        <NexusRootSafetyLayerPanel />

          </section>

          <NexusRootMvpReadinessPanel />

          </NexusRootAiBrain>
        </section>

          <NexusRootStaticEvidencePanels />

          <NexusRootPaidPilotReadinessPanels />













  <NexusFounderEmergencyControl />
  <NexusControlledPaidPilotRegistry />
  </main>
    </NexusRootLaunchGate>
  );
}
