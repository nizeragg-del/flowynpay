import Nav from "./_landing/Nav";
import Hero from "./_landing/Hero";
import LogoWall from "./_landing/LogoWall";
import Pain from "./_landing/Pain";
import HowItWorks from "./_landing/HowItWorks";
import Benefits from "./_landing/Benefits";
import Integrations from "./_landing/Integrations";
import Testimonials from "./_landing/Testimonials";
import Stats from "./_landing/Stats";
import FinalCTA from "./_landing/FinalCTA";
import Footer from "./_landing/Footer";

export const metadata = {
  title: "Flowyn — Seu SaaS vendendo sozinho, 24 horas por dia.",
  description: "Checkout, split financeiro e acesso automático para o seu cliente. Plataforma de vendas para SaaS com afiliados integrados. Comece grátis.",
};

export default function Home() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", overflowX: "hidden" }}>
      <Nav />
      <main>
        <Hero />
        <LogoWall />
        <Pain />
        <HowItWorks />
        <Benefits />
        <Integrations />
        <Testimonials />
        <Stats />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
