import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, CheckCircle2, Zap, Cpu, Shield } from "lucide-react";
import { COMPANY_DATA } from "@/lib/company";

export default function DiagnosticResults() {
  const [location, navigate] = useLocation();

  // Extrair parâmetros da URL
  const params = new URLSearchParams(location.split("?")[1] || "");
  const name = params.get("name") || "Cliente";
  const email = params.get("email") || "";
  const company = params.get("company") || "";
  const segment = params.get("segment") || "";
  const volume = params.get("volume") || "";
  const recommendation = params.get("recommendation") || "basico";

  // Dados de recomendação
  const recommendations: Record<string, any> = {
    basico: {
      title: "Relatório Básico PJ",
      subtitle: "Para empresas que estão iniciando",
      description:
        "Comece com análise fundamentada de crédito. Score, histórico de pagamentos e avaliação básica de risco.",
      icon: CheckCircle2,
      color: "from-[#00d4ff] to-[#00b8cc]",
      features: [
        "Score de Crédito Serasa",
        "Histórico de Pagamentos",
        "Análise de Risco Básica",
        "Consultas Ilimitadas",
        "Suporte via Email",
      ],
      benefits: [
        "Reduz riscos em novas vendas",
        "Decisões mais fundamentadas",
        "Simples e objetiva",
      ],
    },
    avancado: {
      title: "Relatório Avançado PJ",
      subtitle: "Para empresas que crescem",
      description:
        "Análise completa com inteligência de dados. Inclui score, histórico, análise comportamental e inteligência competitiva.",
      icon: Zap,
      color: "from-[#ff1493] to-[#ff69b4]",
      features: [
        "Score de Crédito Avançado",
        "Histórico Completo de Pagamentos",
        "Análise Comportamental",
        "Inteligência de Mercado",
        "Análise de Fornecedores",
        "Suporte Prioritário",
      ],
      benefits: [
        "Decisões mais estratégicas",
        "Visão 360° do cliente",
        "Identificar oportunidades",
      ],
    },
    motor: {
      title: "Motor de Decisão Automático + Relatório Avançado",
      subtitle: "Para empresas que escalam",
      description:
        "Automação inteligente que avalia risco, define limite e recomenda decisão em tempo real. Inclui acesso ao Relatório Avançado para análises complementares.",
      icon: Cpu,
      color: "from-[#00d4ff] to-[#ff1493]",
      features: [
        "Avaliação Automática de Risco",
        "Recomendação de Limite de Crédito",
        "Análise em Tempo Real",
        "Redução de 90% em Tempo de Decisão",
        "Integração com Seus Sistemas",
        "Governança de Crédito Automatizada",
        "Relatório Avançado PJ Integrado",
        "Suporte Técnico 24/7",
      ],
      benefits: [
        "Velocidade de decisão (segundos)",
        "Consistência nas políticas",
        "Escalabilidade sem limite",
        "Redução de análise manual",
        "Dados para decisão estratégica",
      ],
    },
  };

  const selected = recommendations[recommendation] || recommendations.basico;
  const SelectedIcon = selected.icon;

  const handleSchedule = () => {
    // Redirecionar para agendar reunião com dados pré-preenchidos
    navigate(
      `/appointment?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&company=${encodeURIComponent(company)}&source=diagnostic&recommendation=${recommendation}`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1e3a] to-[#0f2a4a]">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0a1e3a]/95 backdrop-blur-md border-b border-[#00d4ff]/20">
        <div className="container flex items-center justify-between py-4">
          <div
            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate("/")}
          >
            <img src={COMPANY_DATA.logo} alt={COMPANY_DATA.name} className="h-14 object-contain" />
          </div>
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="border-[#00d4ff]/50 text-[#00d4ff] hover:bg-[#00d4ff]/10"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Voltar
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Pronto, {name}! 🎯
            </h1>
            <p className="text-xl text-gray-400 mb-2">
              Com base no seu perfil, aqui está nossa recomendação:
            </p>
          </div>

          {/* Recommendation Card */}
          <div className="mb-12">
            <Card className="bg-[#0f2a4a]/50 border-[#00d4ff]/20 overflow-hidden">
              {/* Top accent bar */}
              <div className={`h-1 bg-gradient-to-r ${selected.color}`}></div>

              <div className="p-8 md:p-12">
                <div className="flex items-start gap-6 mb-8">
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${selected.color} text-[#0a1e3a] flex-shrink-0`}>
                    <SelectedIcon className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-4xl font-bold text-white mb-2">{selected.title}</h2>
                    <p className="text-xl text-[#00d4ff] font-semibold">{selected.subtitle}</p>
                  </div>
                </div>

                <p className="text-gray-300 text-lg mb-8 leading-relaxed">{selected.description}</p>

                {/* Features and Benefits Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  {/* Features */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#00d4ff]" />
                      O que inclui:
                    </h3>
                    <ul className="space-y-3">
                      {selected.features.map((feature: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-gray-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] mt-2 flex-shrink-0"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-[#00d4ff]" />
                      Seus benefícios:
                    </h3>
                    <ul className="space-y-3">
                      {selected.benefits.map((benefit: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-gray-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] mt-2 flex-shrink-0"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Motor-specific explanation */}
                {recommendation === "motor" && (
                  <div className="bg-[#00d4ff]/10 border border-[#00d4ff]/30 rounded-lg p-6 mb-8">
                    <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-[#00d4ff]" />
                      Como o Motor de Decisão Automático funciona:
                    </h4>
                    <div className="space-y-3 text-gray-300">
                      <p>
                        <strong>1. Análise em Tempo Real:</strong> Integrado ao seu sistema, analisa dados do cliente
                        instantaneamente.
                      </p>
                      <p>
                        <strong>2. Avaliação de Risco:</strong> Utiliza modelos de IA que avaliam histórico, dados
                        comportamentais e mercado.
                      </p>
                      <p>
                        <strong>3. Recomendação de Crédito:</strong> Define automaticamente se aprova, nega ou aprova
                        com limite reduzido.
                      </p>
                      <p>
                        <strong>4. Governança:</strong> Mantém consistência nas políticas de crédito da empresa.
                      </p>
                      <p>
                        <strong>5. Relatório Avançado Integrado:</strong> Você também recebe acesso ao Relatório Avançado PJ para análises complementares e acompanhamento de carteira.
                      </p>
                      <p>
                        <strong>Resultado:</strong> Sua equipe não gasta mais tempo em análise manual. Decisões seguras
                        em segundos, com dados para estratégia.
                      </p>
                    </div>
                  </div>
                )}

                {/* CTA Section */}
                <div className="border-t border-[#00d4ff]/20 pt-8">
                  <p className="text-gray-400 mb-6">
                    Pronto para começar? Agende uma reunião de diagnóstico consultivo. Vamos conversar sobre como
                    implementar isso na sua empresa.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={handleSchedule}
                      className="flex-1 bg-gradient-to-r from-[#00d4ff] to-[#00b8cc] hover:from-[#00e5ff] hover:to-[#00d4ff] text-[#0a1e3a] font-bold text-lg py-6"
                    >
                      Agendar Reunião
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                    <Button
                      onClick={() => navigate("/")}
                      variant="outline"
                      className="flex-1 border-[#00d4ff]/50 text-[#00d4ff] hover:bg-[#00d4ff]/10 text-lg py-6"
                    >
                      Voltar ao Início
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Other options section */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Outras opções</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(recommendations)
                .filter(([key]) => key !== recommendation)
                .map(([key, option]) => {
                  const Icon = option.icon;
                  return (
                    <Card
                      key={key}
                      className="bg-[#0f2a4a]/50 border-[#00d4ff]/20 p-6 hover:border-[#00d4ff]/50 transition cursor-pointer"
                      onClick={() =>
                        navigate(
                          `/diagnostic/results?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&company=${encodeURIComponent(company)}&segment=${segment}&volume=${volume}&recommendation=${key}`
                        )
                      }
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${option.color} text-[#0a1e3a]`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-white">{option.title}</h4>
                          <p className="text-sm text-gray-400">{option.subtitle}</p>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm line-clamp-2 mb-4">{option.description}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#00d4ff]/50 text-[#00d4ff] hover:bg-[#00d4ff]/10 w-full"
                      >
                        Ver Detalhes
                      </Button>
                    </Card>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
