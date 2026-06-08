import { useState } from "react";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const subscribe = trpc.newsletter.subscribe.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus("error");
      setMessage("Por favor, insira seu e-mail");
      return;
    }

    setStatus("loading");
    
    try {
      const result = await subscribe.mutateAsync({
        email,
        name: name || undefined,
      });

      if (result.success) {
        setStatus("success");
        setMessage(result.message);
        setEmail("");
        setName("");
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setStatus("idle");
          setMessage("");
        }, 3000);
      }
    } catch (error: any) {
      setStatus("error");
      setMessage(error.message || "Erro ao inscrever. Tente novamente.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="space-y-3">
        {/* Name Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Seu nome (opcional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[#0f2a4a]/50 border border-[#00d4ff]/30 text-white placeholder-gray-400 focus:outline-none focus:border-[#00d4ff] transition-colors"
            disabled={status === "loading"}
          />
        </div>

        {/* Email Input */}
        <div className="relative">
          <input
            type="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[#0f2a4a]/50 border border-[#00d4ff]/30 text-white placeholder-gray-400 focus:outline-none focus:border-[#00d4ff] transition-colors"
            disabled={status === "loading"}
            required
          />
          <Mail className="absolute right-4 top-3.5 w-5 h-5 text-[#00d4ff] pointer-events-none" />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className={`w-full px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
            status === "success"
              ? "bg-green-500/20 border border-green-500/50 text-green-300"
              : status === "error"
              ? "bg-red-500/20 border border-red-500/50 text-red-300"
              : "bg-gradient-to-r from-[#00d4ff] to-[#00b8cc] hover:from-[#00e5ff] hover:to-[#00d4ff] text-[#0a1e3a] hover:shadow-lg hover:shadow-[#00d4ff]/50"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {status === "loading" && (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Inscrevendo...
            </>
          )}
          {status === "success" && (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Inscrito com sucesso!
            </>
          )}
          {status === "error" && (
            <>
              <AlertCircle className="w-5 h-5" />
              Tentar novamente
            </>
          )}
          {status === "idle" && (
            <>
              <Mail className="w-5 h-5" />
              Receber Atualizações
            </>
          )}
        </button>

        {/* Message */}
        {message && (
          <div
            className={`text-sm text-center px-4 py-2 rounded-lg ${
              status === "success"
                ? "bg-green-500/10 text-green-300"
                : status === "error"
                ? "bg-red-500/10 text-red-300"
                : "bg-blue-500/10 text-blue-300"
            }`}
          >
            {message}
          </div>
        )}

        {/* Privacy Notice */}
        <p className="text-xs text-gray-400 text-center">
          Respeitamos sua privacidade. Você pode se desinscrever a qualquer momento.
        </p>
      </div>
    </form>
  );
}
