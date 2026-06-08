import { Card } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, TrendingUp, AlertTriangle, BarChart3, Users, Zap, MapPin, Phone, Mail, Linkedin, Instagram, Shield, Cpu, Lightbulb, Lock } from "lucide-react";
import { useLocation, Link } from "wouter";
import { COMPANY_DATA, getPhoneLink, getEmailLink, getGoogleMapsLink } from "@/lib/company";
import NewsletterForm from "@/components/NewsletterForm";

function Button({ onClick, className, children }: { onClick?: () => void; className?: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${className}`}
    >
      {children}
    </button>
  );
}

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663713649261/2s2DSoWp9LTztrQtUtQF67/hero-credit-tech-anoszzfD7SmF82eAk27G2y.webp";

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-[#0a1e3a] text-white overflow-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#0a1e3a]/95 backdrop-blur-md border-b border-[#00d4ff]/20">
        <div className="container flex items-center justify-between py-4">
          <button onClick={() => navigate("/")} className="flex items-center hover:opacity-80 transition-opacity">
            <img src={COMPANY_DATA.logo} alt={COMPANY_DATA.name} className="h-14 object-contain" />
          </button>
          <div className="flex gap-6">
            <button onClick={() => navigate("/")} className="text-gray-300 hover:text-[#00d4ff] transition">
              Home
            </button>
            <button onClick={() => navigate("/about")} className="text-gray-300 hover:text-[#00d4ff] transition">
              Quem Somos
            </button>
            <button onClick={() => navigate("/products")} className="text-gray-300 hover:text-[#00d4ff] transition">
              Produtos
            </button>
            <button onClick={() => navigate("/diagnostic")} className="text-gray-300 hover:text-[#00d4ff] transition">
              Diagnóstico
            </button>
            <button onClick={() => navigate("/admin")} className="text-gray-300 hover:text-[#00d4ff] transition">
              Admin
            </button>
          </div>
        </div>
      </nav>

      {/* ===================== HERO — Foto de fundo full-width ===================== */}
      <section className="relative min-h-[640px] md:min-h-[760px] flex items-center overflow-hidden">
        {/* Background image */}
        <img
          src={HERO_IMAGE}
          alt="Centro de inteligência de crédito ScoreSense"
          className="absolute inset-0 w-full h-full object-cover object-right"
        />
        {/* Overlay para legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1e3a] via-[#0a1e3a]/90 to-[#0a1e3a]/30"></div>
        <div className="absolute inset-0 bg-[#0a1e3a]/40"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00d4ff]/10 rounded-full blur-3xl animate-pulse"></div>

        <div className="container relative z-10">
          <div className="max-w-2xl">
            <div className="inline-block mb-8 px-4 py-2 bg-[#00d4ff]/10 border border-[#00d4ff]/40 rounded-full">
              <span className="text-[#00d4ff] text-sm font-semibold">Tecnologia de Análise de Crédito</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight text-white drop-shadow-lg">
              Decisões de Crédito Inteligentes
            </h1>
            <p className="text-xl text-gray-200 mb-10 leading-relaxed drop-shadow">
              Tecnologia avançada de análise de crédito para empresas de todos os tamanhos. Reduza riscos, previna fraudes e tome decisões mais rápidas com inteligência artificial e dados em tempo real.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => navigate("/diagnostic")}
                className="btn-primary text-lg bg-gradient-to-r from-[#00d4ff] to-[#00b8cc] hover:from-[#00e5ff] hover:to-[#00d4ff] text-[#0a1e3a] shadow-lg hover:shadow-2xl font-bold"
              >
                Fazer Diagnóstico Gratuito
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                onClick={() => navigate("/appointment")}
                className="btn-secondary text-lg bg-transparent border-2 border-[#00d4ff] hover:bg-[#00d4ff]/10 text-white"
              >
                Agendar Reunião
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 bg-[#0f2a4a]/50 border-y border-[#00d4ff]/20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { label: "Empresas Atendidas", value: "500+", icon: Users },
              { label: "Taxa de Precisão", value: "98%", icon: CheckCircle2 },
              { label: "Tempo de Resposta", value: "24h", icon: Zap },
              { label: "Redução de Risco", value: "85%", icon: Shield },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="text-center p-6 rounded-xl bg-[#0a1e3a]/50 border border-[#00d4ff]/20 hover:border-[#00d4ff]/50 transition">
                  <Icon className="w-8 h-8 text-[#00d4ff] mx-auto mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="relative py-32">
        <div className="container">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Desafios que Resolvemos
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Empresas enfrentam riscos crescentes. Nós oferecemos as soluções que você precisa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: AlertTriangle,
                title: "Prevenção a Fraude",
                description: "Detecte fraudes cadastrais e comportamentais em tempo real com IA avançada.",
                color: "#ff1493"
              },
              {
                icon: BarChart3,
                title: "Análise de Risco",
                description: "Avalie o risco de crédito com precisão usando dados estruturados e histórico.",
                color: "#00d4ff"
              },
              {
                icon: Lightbulb,
                title: "Decisão Rápida",
                description: "Tome decisões de crédito em minutos, não em dias, com automação inteligente.",
                color: "#00d4ff"
              },
            ].map((problem, i) => {
              const Icon = problem.icon;
              return (
                <div key={i} className="group p-8 rounded-xl bg-[#0f2a4a]/50 border border-[#00d4ff]/20 hover:border-[#00d4ff]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#00d4ff]/20">
                  <Icon className="w-12 h-12 mb-6" style={{ color: problem.color }} />
                  <h3 className="text-2xl font-bold text-white mb-4">{problem.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{problem.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="relative py-32 bg-[#0f2a4a]/30 border-y border-[#00d4ff]/20">
        <div className="container">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Soluções Serasa
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Plataformas e serviços especializados para cada segmento de negócio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Análise de Crédito",
                description: "Consulta de dados de crédito, score e histórico de pagamentos em tempo real.",
                features: ["Score de Crédito", "Histórico de Pagamentos", "Análise de Risco"]
              },
              {
                title: "Prevenção de Fraude",
                description: "Detecção de fraudes cadastrais, documentais e comportamentais com IA.",
                features: ["Validação de Documentos", "Análise Comportamental", "Alertas em Tempo Real"]
              },
              {
                title: "Cobrança",
                description: "Gestão eficiente de cobranças com dados atualizados e contatos precisos.",
                features: ["Localização de Devedores", "Dados de Contato", "Histórico de Pagamentos"]
              },
              {
                title: "Monitoramento",
                description: "Acompanhamento contínuo de clientes e devedores com alertas automáticos.",
                features: ["Alertas de Mudanças", "Monitoramento 24/7", "Relatórios Personalizados"]
              },
            ].map((solution, i) => (
              <div key={i} className="p-8 rounded-xl bg-[#0a1e3a]/50 border border-[#00d4ff]/20 hover:border-[#ff1493]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#ff1493]/20">
                <h3 className="text-2xl font-bold text-white mb-4">{solution.title}</h3>
                <p className="text-gray-400 mb-6">{solution.description}</p>
                <ul className="space-y-3">
                  {solution.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-gray-300">
                      <CheckCircle2 className="w-5 h-5 text-[#00d4ff]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Segmentos Section */}
      <section className="relative py-32">
        <div className="container">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Soluções para Todos os Segmentos
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Independente do tamanho ou segmento, temos soluções adaptadas para seu negócio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { name: "Varejo", description: "Gestão de crédito para lojas e e-commerce" },
              { name: "Distribuição", description: "Análise de risco para distribuidoras" },
              { name: "Serviços", description: "Soluções para empresas de serviços B2B" },
              { name: "Indústria", description: "Crédito para fornecedores industriais" },
            ].map((segment, i) => (
              <div key={i} className="p-6 rounded-xl bg-gradient-to-br from-[#0f2a4a] to-[#0a1e3a] border border-[#00d4ff]/20 hover:border-[#ff1493]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#ff1493]/20 text-center">
                <h3 className="text-xl font-bold text-white mb-2">{segment.name}</h3>
                <p className="text-gray-400 text-sm">{segment.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 bg-gradient-to-r from-[#0f2a4a] to-[#0a1e3a] border-y border-[#00d4ff]/20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
              Pronto para Reduzir Riscos?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Faça um diagnóstico gratuito e descubra como Serasa pode ajudar seu negócio a crescer com segurança.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center flex-wrap mb-16">
            <Button
              onClick={() => navigate("/diagnostic")}
              className="text-lg bg-gradient-to-r from-[#00d4ff] to-[#00b8cc] hover:from-[#00e5ff] hover:to-[#00d4ff] text-[#0a1e3a] shadow-lg hover:shadow-2xl font-bold"
            >
              Fazer Diagnóstico Gratuito
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              onClick={() => navigate("/appointment")}
              className="text-lg bg-transparent border-2 border-[#00d4ff] hover:bg-[#00d4ff]/10 text-white"
            >
              Agendar Reunião
            </Button>
          </div>

          {/* Newsletter Section */}
          <div className="max-w-2xl mx-auto p-8 rounded-xl bg-[#0f2a4a]/50 border border-[#00d4ff]/20">
            <h3 className="text-2xl font-bold text-white mb-3">Receba Atualizações Exclusivas</h3>
            <p className="text-gray-400 mb-6">Fique por dentro das últimas novidades sobre análise de crédito e prevenção de fraude.</p>
            <NewsletterForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a1e3a] border-t border-[#00d4ff]/20 py-12">
        <div className="container">
          <div className="mb-10 pb-8 border-b border-[#00d4ff]/10">
            <img src={COMPANY_DATA.logo} alt={COMPANY_DATA.name} className="h-14 object-contain mb-4" />
            <p className="text-sm text-gray-400 max-w-md">{COMPANY_DATA.tagline} — Inteligência de dados para decisões de crédito mais seguras e estratégicas.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-white mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => navigate("/about")} className="hover:text-[#00d4ff] transition">Quem Somos</button></li>
                <li><button onClick={() => navigate("/products")} className="hover:text-[#00d4ff] transition">Produtos</button></li>
                <li><a href="#" className="hover:text-[#00d4ff] transition">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Recursos</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => navigate("/diagnostic")} className="hover:text-[#00d4ff] transition">Diagnóstico</button></li>
                <li><a href="#" className="hover:text-[#00d4ff] transition">Documentação</a></li>
                <li><a href="#" className="hover:text-[#00d4ff] transition">Suporte</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Contato</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href={getPhoneLink(COMPANY_DATA.phone)} className="hover:text-[#00d4ff] transition flex items-center gap-2"><Phone className="w-4 h-4" /> {COMPANY_DATA.phone}</a></li>
                <li><a href={getEmailLink(COMPANY_DATA.email)} className="hover:text-[#00d4ff] transition flex items-center gap-2"><Mail className="w-4 h-4" /> {COMPANY_DATA.email}</a></li>
                <li><a href={getGoogleMapsLink(COMPANY_DATA.address.fullAddress)} target="_blank" rel="noopener noreferrer" className="hover:text-[#00d4ff] transition flex items-center gap-2"><MapPin className="w-4 h-4" /> {COMPANY_DATA.address.city}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Redes Sociais</h4>
              <div className="flex gap-4">
                <a href={COMPANY_DATA.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#00d4ff] transition">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href={COMPANY_DATA.social.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#00d4ff] transition">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-[#00d4ff]/20 pt-8 text-center text-sm text-gray-500">
            <p>&copy; 2026 {COMPANY_DATA.name}. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
