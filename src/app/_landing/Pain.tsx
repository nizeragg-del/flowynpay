"use client";
const G = "#00e88a";
const features = [
  { icon: "⚡", title: "No-Code em 3 Minutos", sub: "Integração nativa com Make.com — sem escrever código" },
  { icon: "🛡", title: "Split Financeiro Nativo", sub: "Afiliado e produtor recebem separado na raiz" },
  { icon: "🔄", title: "Acesso Automático", sub: "Cliente paga → acesso criado em segundos" },
];
const steps = [
  { label: "Venda Aprovada (Flowyn)", pulse: true },
  { label: "Rotear Pagamento", pulse: false },
  { label: "Criar Acesso no Supabase", pulse: false, highlight: true },
];
export default function Pain() {
  return (
    <section style={{ background: "#0a0a0a", color: "#fff", padding: "100px clamp(24px,5vw,64px)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 64, alignItems: "center" }}>
        <div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(30px,4vw,52px)", letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: 20 }}>
            Integrações quebradas<br />custam <span style={{ color: G }}>vendas reais.</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 17, fontWeight: 300, lineHeight: 1.7, marginBottom: 36 }}>
            Chega de noites configurando webhooks e cruzando os dedos. A Flowyn tira o &quot;tecniquês&quot; da jogada.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {features.map(f => (
              <div key={f.title} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{f.title}</div>
                  <div style={{ color: "rgba(255,255,255,0.38)", fontSize: 14, fontWeight: 300 }}>{f.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 24, padding: 28, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, background: "radial-gradient(circle, rgba(0,232,138,0.13), transparent 70%)", pointerEvents: "none" }} />
          {steps.map((s, i) => (
            <div key={i}>
              <div style={{
                background: s.highlight ? "rgba(0,232,138,0.06)" : "#0d0d0d",
                border: `1px solid ${s.highlight ? "rgba(0,232,138,0.25)" : "rgba(255,255,255,0.06)"}`,
                borderRadius: 14, padding: "14px 18px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                boxShadow: s.highlight ? "0 0 20px rgba(0,232,138,0.08)" : "none",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {s.pulse && <span className="dot-pulse" style={{ width: 8, height: 8, borderRadius: "50%", background: G, flexShrink: 0 }} />}
                  {!s.pulse && <span style={{ width: 8, height: 8 }} />}
                  <span style={{ fontFamily: "monospace", fontSize: 13, color: "rgba(255,255,255,0.72)" }}>{s.label}</span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, background: "rgba(0,232,138,0.15)", color: G, padding: "3px 10px", borderRadius: 6 }}>✓ OK</span>
              </div>
              {i < steps.length - 1 && <div style={{ width: 2, height: 18, background: "rgba(255,255,255,0.06)", margin: "0 auto" }} />}
            </div>
          ))}
          <div style={{ marginTop: 16, background: "rgba(0,232,138,0.05)", border: "1px solid rgba(0,232,138,0.12)", borderRadius: 12, padding: "12px 16px", textAlign: "center", fontSize: 13, color: G, fontWeight: 500 }}>
            ✓ Acesso criado automaticamente — há 2 min
          </div>
        </div>
      </div>
    </section>
  );
}
