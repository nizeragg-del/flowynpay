export default function LogoWall() {
  const logos = ["DevMetrics", "FormAI", "Claritask", "NovaSaaS", "LoopCRM"];
  return (
    <section style={{ padding: "32px clamp(24px,5vw,64px)", borderTop: "1px solid #f0f0f0", borderBottom: "1px solid #f0f0f0" }}>
      <p style={{ textAlign: "center", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: "#bbb", textTransform: "uppercase", marginBottom: 20 }}>
        Empresas que confiam no Flowyn
      </p>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "clamp(28px, 5vw, 60px)", flexWrap: "wrap", opacity: 0.32, filter: "grayscale(1)" }}>
        {logos.map(n => (
          <span key={n} style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 17, letterSpacing: "-0.03em", color: "#0a0a0a", whiteSpace: "nowrap" }}>
            {n}
          </span>
        ))}
      </div>
    </section>
  );
}
