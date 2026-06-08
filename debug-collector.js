import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Calendar, User, Share2, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { COMPANY_DATA } from "@/lib/company";

export default function BlogPost() {
  const [location, navigate] = useLocation();
  const slug = location.split("/blog/")[1];

  const { data: post, isLoading, error } = trpc.blog.getBySlug.useQuery({ slug: slug || "" }, { enabled: !!slug });

  useEffect(() => {
    if (error) {
      toast.error("Artigo não encontrado");
      navigate("/blog");
    }
  }, [error, navigate]);

  const formatDate = (date: Date | string | null) => {
    if (!date) return "";
    const d = new Date(date);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(d);
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      credito: "Crédito",
      serasa: "Serasa",
      cobranca: "Cobrança",
      fraude: "Fraude",
      tendencias: "Tendências",
      educacao: "Educação",
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      credito: "from-[#00d4ff] to-[#00b8cc]",
      serasa: "from-[#ff1493] to-[#ff69b4]",
      cobranca: "from-[#ffd700] to-[#ffed4e]",
      fraude: "from-[#ff6347] to-[#ff8c00]",
      tendencias: "from-[#9370db] to-[#ba55d3]",
      educacao: "from-[#20b2aa] to-[#3cb371]",
    };
    return colors[category] || "from-[#00d4ff] to-[#00b8cc]";
  };

  const handleShare = () => {
    if (navigator.share && post) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copiado para clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1e3a] to-[#0f2a4a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#00d4ff]/30 border-t-[#00d4ff] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando artigo...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

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
            onClick={() => navigate("/blog")}
            variant="outline"
            className="border-[#00d4ff]/50 text-[#00d4ff] hover:bg-[#00d4ff]/10"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Voltar ao Blog
          </Button>
        </div>
      </div>

      {/* Hero Image */}
      {post.imageUrl && (
        <div className="w-full h-96 bg-gradient-to-br from-[#00d4ff]/20 to-[#ff1493]/20 overflow-hidden">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="container py-12">
        <article className="max-w-3xl mx-auto">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className={`text-sm font-bold px-3 py-1 rounded-full bg-gradient-to-r ${getCategoryColor(post.category)} text-white`}>
              {getCategoryLabel(post.category)}
            </span>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Calendar className="w-4 h-4" />
              {formatDate(post.publishedAt)}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <User className="w-4 h-4" />
              {post.author}
            </div>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#00d4ff] transition"
            >
              <Share2 className="w-4 h-4" />
              Compartilhar
            </button>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">{post.excerpt}</p>

          {/* Divider */}
          <div className="h-1 w-20 bg-gradient-to-r from-[#00d4ff] to-transparent mb-8"></div>

          {/* Article Content */}
          <Card className="bg-[#0f2a4a]/50 border-[#00d4ff]/20 p-8 md:p-12 mb-12">
            <div
              className="prose prose-invert max-w-none text-gray-300"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </Card>

          {/* Author Card */}
          <Card className="bg-gradient-to-r from-[#00d4ff]/10 to-[#ff1493]/10 border border-[#00d4ff]/20 p-6 mb-12">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#ff1493] flex items-center justify-center text-2xl font-bold text-[#0a1e3a]">
                {post.author.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{post.author}</h3>
                <p className="text-gray-400 text-sm">
                  Especialista em crédito, dados e soluções Serasa na ScoreSense.
                </p>
              </div>
            </div>
          </Card>

          {/* CTA */}
          <div className="bg-gradient-to-r from-[#00d4ff]/10 to-[#ff1493]/10 border border-[#00d4ff]/20 rounded-lg p-8 text-center mb-12">
            <h3 className="text-2xl font-bold text-white mb-4">
              Gostou deste artigo?
            </h3>
            <p className="text-gray-400 mb-6">
              Quer conhecer como a ScoreSense pode ajudar seu negócio a crescer com mais segurança?
            </p>
            <Button
              onClick={() => navigate("/diagnostic")}
              className="bg-gradient-to-r from-[#00d4ff] to-[#00b8cc] hover:from-[#00e5ff] hover:to-[#00d4ff] text-[#0a1e3a] font-bold px-8 py-6"
            >
              Fazer Diagnóstico Gratuito
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </article>
      </div>
    </div>
  );
}
