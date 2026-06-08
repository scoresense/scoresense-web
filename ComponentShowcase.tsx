import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, Loader2, CheckCircle2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { COMPANY_DATA } from "@/lib/company";

export default function Appointment() {
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    position: "",
    whatsapp: "",
    email: "",
    preferredDate: "",
    preferredTime: "",
    notes: "",
  });

  const submitAppointment = trpc.appointment.submit.useMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.company || !formData.position || !formData.whatsapp) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);
    try {
      await submitAppointment.mutateAsync({
        name: formData.name,
        company: formData.company,
        position: formData.position,
        whatsapp: formData.whatsapp,
        email: formData.email,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        notes: formData.notes,
      });

      setSubmitted(true);
      toast.success("Agendamento solicitado com sucesso!");
      
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error: any) {
      toast.error(error.message || "Erro ao agendar reunião");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Card className="card-elevated max-w-md text-center">
          <div className="mb-6">
            <CheckCircle2 className="w-16 h-16 text-[#10b981] mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Agendamento Confirmado!</h2>
          <p className="text-neutral-600 mb-6">
            Obrigado, {formData.name}! Recebemos sua solicitação de agendamento. Nossa equipe entrará em contato em breve pelo WhatsApp.
          </p>
          <Button
            onClick={() => navigate("/")}
            className="btn-primary w-full"
          >
            Voltar à Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-neutral-200">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="rounded-lg bg-[#0E163B] px-4 py-2 flex items-center">
              <img src={COMPANY_DATA.logo} alt={COMPANY_DATA.name} className="h-9 object-contain" />
            </div>
          </div>
          <Button onClick={() => navigate("/")} className="btn-outline">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Voltar
          </Button>
        </div>
      </div>
      {/* Form Container */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container py-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-[#1a3a52] hover:text-[#2d5a8c] transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
          <h1 className="text-3xl font-bold text-neutral-900">Agendar Reunião Comercial</h1>
          <p className="text-neutral-600 mt-2">Converse com nossos especialistas sobre as melhores soluções para seu negócio</p>
        </div>
      </div>

      {/* Content */}
      <div className="container py-12">
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="card text-center">
              <Calendar className="w-8 h-8 text-[#1a3a52] mx-auto mb-3" />
              <h3 className="font-bold text-neutral-900 mb-2">Flexível</h3>
              <p className="text-sm text-neutral-600">Escolha a data e horário que melhor se adequa ao seu calendário</p>
            </Card>
            <Card className="card text-center">
              <Clock className="w-8 h-8 text-[#1a3a52] mx-auto mb-3" />
              <h3 className="font-bold text-neutral-900 mb-2">Rápido</h3>
              <p className="text-sm text-neutral-600">Reuniões de 30 minutos para entender suas necessidades</p>
            </Card>
            <Card className="card text-center">
              <CheckCircle2 className="w-8 h-8 text-[#1a3a52] mx-auto mb-3" />
              <h3 className="font-bold text-neutral-900 mb-2">Efetivo</h3>
              <p className="text-sm text-neutral-600">Recomendações personalizadas baseadas em sua situação</p>
            </Card>
          </div>

          <Card className="card-elevated">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Informações de Contato</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    required
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
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    required
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
                    required
                  />
                </div>
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

              <div className="border-t border-neutral-200 pt-6">
                <h3 className="text-lg font-bold text-neutral-900 mb-4">Preferências de Reunião</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-900 mb-2">
                      Data Preferida
                    </label>
                    <input
                      type="date"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-900 mb-2">
                      Horário Preferido
                    </label>
                    <input
                      type="time"
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-2">
                    Observações Adicionais
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Conte-nos um pouco mais sobre sua situação ou dúvidas específicas..."
                    rows={4}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  onClick={() => navigate("/")}
                  className="btn-outline flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      Agendando...
                    </>
                  ) : (
                    "Agendar Reunião"
                  )}
                </Button>
              </div>
            </form>
          </Card>

          {/* Info Box */}
          <Card className="card mt-8 bg-blue-50 border border-blue-200">
            <h3 className="font-bold text-neutral-900 mb-2">Informações Importantes</h3>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10b981] flex-shrink-0 mt-0.5" />
                <span>Nossa equipe confirmará seu agendamento via WhatsApp</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10b981] flex-shrink-0 mt-0.5" />
                <span>Reuniões podem ser por telefone, vídeo ou presencialmente</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10b981] flex-shrink-0 mt-0.5" />
                <span>Tempo médio de resposta: até 2 horas úteis</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
