const G = "#00e88a";
const stats = [
  { prefix: "R$", value: "2.4M", label: "processados em vendas" },
  { prefix: "", value: "4k+", label: "acessos criados automaticamente" },
  { prefix: "", value: "3min", label: "para integrar com qualquer SaaS" },
  { prefix: "", value: "0", label: "linhas de código necessárias" },
];
export default function Stats() {
  return (
    <section style={{ background: "#0a0a0a", padding: "80px clamp(24px,5vw,64px)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 32, textAlign: "center" }}>
        {stats.map(s => (
          <div key={s.label}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(36px,5vw,56px)", letterSpacing: "-0.04em", color: "#fff", marginBottom: 8 }}>
              <span style={{ color: G, fontSize: "0.55em", verticalAlign: "super" }}>{s.prefix}</span>{s.value}
            </div>
            <div style={{ fontSize: 14, fontWeight: 300, color: "rgba(255,255,255,0.4)", maxWidth: 160, margin: "0 auto", lineHeight: 1.5 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
