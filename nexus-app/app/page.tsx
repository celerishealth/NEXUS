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
          overflowX: "hidden",
        }}
      >
        <NexusRootSidebar />

        <section
          style={{
            flex: 1,
            minWidth: 0,
            padding: "32px",
            overflowX: "hidden",
            overflowY: "auto",
          }}
        >
          <NexusRootHeaderStatusPanels />

          <NexusRootAiBrain>
            <section
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(100%, 420px), 1fr))",
                gap: "20px",
                marginTop: "28px",
                minWidth: 0,
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

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr)",
              gap: "20px",
              marginTop: "20px",
              minWidth: 0,
              width: "100%",
            }}
          >
            <NexusRootStaticEvidencePanels />
            <NexusRootPaidPilotReadinessPanels />
            <NexusFounderEmergencyControl />
            <NexusControlledPaidPilotRegistry />
          </section>
        </section>
      </main>
    </NexusRootLaunchGate>
  );
}