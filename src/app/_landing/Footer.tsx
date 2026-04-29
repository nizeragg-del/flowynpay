const G = "#00e88a";
export default function Footer() {
  return (
    <footer style={{ background: "#0a0a0a", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "40px clamp(24px,5vw,64px)", textAlign: "center" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}>
        <div style={{ position: "relative", width: 8, height: 8 }}>
          <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: G, opacity: 0.2, transform: "scale(1.8)" }} />
          <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: G }} />
        </div>
        <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.04em", color: "rgba(255,255,255,0.7)" }}>Flowyn</span>
      </div>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.2)", fontWeight: 300 }}>
        © {new Date().getFullYear()} Flowyn. Todos os direitos reservados.
      </p>
    </footer>
  );
}
