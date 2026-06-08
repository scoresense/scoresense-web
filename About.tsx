import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { COMPANY_DATA } from "@/lib/company";

export default function Diagnostic() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(0); // 0-5 (0 = intro)
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    whatsapp: "",
    // Assessment questions
    segment: "", // 1: Varejo, Indústria, Serviços, Atacado/Distribuição, Outro
    monthlyVolume: "", // 2: 1-10, 11-50, 51-200, 200+
    mainPain: "", // 3: dinâmica por segmento
    automationNeed: "", // 4: Não preciso, Seria diferencial, É crítico
    priority: "", // 5: Reduzir risco, Aumentar vendas, Acelerar decisões, Organizar cobrança
  });

  const [score, setScore] = useState(0);

  const submitDiagnostic = trpc.diagnostic.submit.useMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name || !formData.company || !formData.position || !formData.whatsapp) {
        toast.error("Por favor, preencha todos os campos obrigatórios");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.segment || !formData.clientVolume || !formData.salesModel) {
        toast.error("Por favor, responda todas as perguntas");
        return;
      }
      setStep(3);
    }
  };

  const handleSubmit = async () => {
    if (!formData.mainPain) {
      toast.error("Por favor, selecione a principal dor");
      return;
    }

    setLoading(true);
    try {
      const result = await submitDiagnostic.mutateAsync({
        name: formData.name,
        company: formData.company,
        position: formData.position,
        whatsapp: formData.whatsapp,
        email: formData.email,
        segment: formData.segment as any,
        clientVolume: formData.clientVolume as any,
        salesModel: formData.salesModel as any,
        mainPain: formData.mainPain as any,
        currentSolution: formData.currentSolution,
      });

      navigate(`/diagnostic/results?leadId=${result.leadId}&score=${result.score}&riskLevel=${result.riskLevel}`);
    } catch (error: any) {
      toast.error(error.message || "Erro ao enviar diagnóstico");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0a1e3a] border-b border-cyan-500/20">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate("/")}>
            <img src={COMPANY_DATA.logo} alt={COMPANY_DATA.name} className="h-14 object-contain" />
          </div>
          <Button onClick={() => navigate("/")} className="btn-outline">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Voltar
          </Button>
        </div>
      </div>
      {/* Progress */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container py-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-[#1a3a52] hover:text-[#2d5a8c] transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
          <h1 className="text-3xl font-bold text-neutral-900">Diagnóstico de Risco de Crédito</h1>
          <p className="text-neutral-600 mt-2">Descubra o nível de risco do seu negócio em 5 minutos</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container py-4">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition ${
                    s <= step
                      ? "bg-[#1a3a52] text-white"
                      : "bg-neutral-200 text-neutral-600"
                  }`}
                >
                  {s}
                </div>
                {s < 3 && <div className={`h-1 w-12 transition ${s < step ? "bg-[#1a3a52]" : "bg-neutral-200"}`} />}
              </div>
            ))}
          </div>
          <p className="text-sm text-neutral-600 mt-4">
            Etapa {step} de 3
          </p>
        </div>
      </div>

      {/* Form Content */}
      <div className="container py-12">
        <div className="max-w-2xl mx-auto">
          {/* Step 1: Contact Info */}
          {step === 1 && (
            <Card className="card-elevated">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Informações de Contato</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Seu nome"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-2">
                    Empresa *
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Nome da empresa"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-2">
                    Cargo *
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    placeholder="Seu cargo"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-2">
                    WhatsApp *
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    placeholder="(47) 99999-9999"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="seu@email.com"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <Button
                  onClick={handleNext}
                  className="btn-primary"
                >
                  Próximo
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </Card>
          )}

          {/* Step 2: Business Info */}
          {step === 2 && (
            <Card className="card-elevated">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Informações do Negócio</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-3">
                    Segmento de Atuação *
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: "distribution", label: "Distribuição" },
                      { value: "wholesale", label: "Atacado" },
                      { value: "retail", label: "Varejo" },
                      { value: "other", label: "Outro" },
                    ].map(option => (
                      <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="segment"
                          value={option.value}
                          checked={formData.segment === option.value}
                          onChange={handleInputChange}
                          className="w-4 h-4"
                        />
                        <span className="text-neutral-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-3">
                    Volume de Clientes PJ *
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: "0-50", label: "0 a 50 clientes" },
                      { value: "51-200", label: "51 a 200 clientes" },
                      { value: "201-500", label: "201 a 500 clientes" },
                      { value: "500+", label: "Mais de 500 clientes" },
                    ].map(option => (
                      <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="clientVolume"
                          value={option.value}
                          checked={formData.clientVolume === option.value}
                          onChange={handleInputChange}
                          className="w-4 h-4"
                        />
                        <span className="text-neutral-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-3">
                    Modelo de Venda *
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: "cash", label: "À vista" },
                      { value: "credit", label: "A prazo" },
                      { value: "mixed", label: "Misto (à vista e a prazo)" },
                    ].map(option => (
                      <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="salesModel"
                          value={option.value}
                          checked={formData.salesModel === option.value}
                          onChange={handleInputChange}
                          className="w-4 h-4"
                        />
                        <span className="text-neutral-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between gap-4 mt-8">
                <Button
                  onClick={() => setStep(1)}
                  className="btn-outline"
                >
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Voltar
                </Button>
                <Button
                  onClick={handleNext}
                  className="btn-primary"
                >
                  Próximo
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </Card>
          )}

          {/* Step 3: Pain Points */}
          {step === 3 && (
            <Card className="card-elevated">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Principais Desafios</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-3">
                    Qual é sua principal dor? *
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: "fraud", label: "Fraude cadastral e validação de dados" },
                      { value: "creditDecision", label: "Decisão de crédito lenta e manual" },
                      { value: "default", label: "Inadimplência e atrasos de pagamento" },
                      { value: "collection", label: "Dificuldade em cobrança" },
                      { value: "multiple", label: "Múltiplos desafios" },
                    ].map(option => (
                      <label key={option.value} className="flex items-center gap-3 cursor-pointer p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition">
                        <input
                          type="radio"
                          name="mainPain"
                          value={option.value}
                          checked={formData.mainPain === option.value}
                          onChange={handleInputChange}
                          className="w-4 h-4"
                        />
                        <span className="text-neutral-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-2">
                    Qual é sua solução atual? (opcional)
                  </label>
                  <textarea
                    name="currentSolution"
                    value={formData.currentSolution}
                    onChange={handleInputChange}
                    placeholder="Descreva como você atualmente lida com esse desafio..."
                    rows={4}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="flex justify-between gap-4 mt-8">
                <Button
                  onClick={() => setStep(2)}
                  className="btn-outline"
                >
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Voltar
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      Ver Resultado
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
