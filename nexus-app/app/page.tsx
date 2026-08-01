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
import {
  NexusRootBuildLogPanel,
  NexusRootRecentActivityPanel,
  NexusRootSafetyLayerPanel,
} from "@/components/nexus/NexusRootOperationalPanels";
import { useState } from "react";

export default function Home() {
  const [isLaunched, setIsLaunched] = useState(false);
  if (!isLaunched) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #020617 0%, #0f172a 50%, #111827 100%)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <section
          style={{
            maxWidth: "900px",
            width: "100%",
            border: "1px solid #1d4ed8",
            borderRadius: "24px",
            padding: "48px",
            background: "rgba(15, 23, 42, 0.9)",
            boxShadow: "0 0 40px rgba(37, 99, 235, 0.35)",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "56px", marginBottom: "16px" }}>NEXUS</h1>

          <p
            style={{
              color: "#cbd5e1",
              fontSize: "20px",
              lineHeight: "1.6",
              marginBottom: "32px",
            }}
          >
            AI Business Operating System for sales, support, customer replies,
            follow-ups, orders, complaints, and business advice.
          </p>

          <button
            onClick={() => setIsLaunched(true)}
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "14px",
              padding: "16px 28px",
              fontSize: "18px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Launch NEXUS
          </button>
        </section>
      
</main>
    );
  }

  return (
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
  );
}
