export default function Home() {
  return (
    <main
      style={{
        background: "#0b1120",
        color: "white",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial",
      }}
    >
      <h1 style={{ fontSize: "60px", margin: 0 }}>
        NEXUS
      </h1>

      <p style={{ fontSize: "22px", color: "#94a3b8" }}>
        AI Business Operating System
      </p>

      <button
        style={{
          marginTop: "30px",
          padding: "15px 40px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "10px",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        Launch NEXUS
      </button>
    </main>
  );
}