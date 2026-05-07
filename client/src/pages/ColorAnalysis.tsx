import { useRef, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useLocation } from "wouter";
import {
  Upload, Camera, Loader2, ArrowLeft,
  Sparkles, Leaf, Palette, AlertTriangle, Scissors, Eye
} from "lucide-react";

// ─── Local types (mirror server/routers/colorAnalysis.ts) ────────────────────
interface HairColor {
  name: string;
  description: string;
  whyItWorks: string;
  hex: string;
}

interface AvoidColor {
  name: string;
  hex: string;
  reason: string;
}

interface Technique {
  name: string;
  reason: string;
}

interface FinalPalette {
  basePrincipal: string;
  reflexo: string;
  iluminacao: string;
  profundidade: string;
}

interface SalonFormula {
  alturaIdeal: string;
  reflexoIdeal: string;
  temperatura: string;
  contraste: string;
  manutencao: string;
  retoque: string;
}

interface ColorAnalysisResult {
  subtom: string;
  profundidade: string;
  intensidade: string;
  contraste: string;
  baseNatural: string;
  classificacaoSazonal: string;
  explicacaoSazonal: string;
  coresRecomendadas: HairColor[];
  tecnicasRecomendadas: Technique[];
  coresAEvitar: AvoidColor[];
  formulaSalao: SalonFormula;
  resultadoVisual: string;
  paletaFinal: FinalPalette;
}

// ─── Upload helper ────────────────────────────────────────────────────────────
async function uploadImageToStorage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/upload-temp", { method: "POST", body: formData });
  if (!res.ok) throw new Error("Erro ao carregar imagem");
  const data = await res.json() as { url: string };
  return data.url;
}

// ─── Season badge colors ──────────────────────────────────────────────────────
function getSeasonStyle(season: string): { bg: string; text: string } {
  const s = season.toLowerCase();
  if (s.includes("primavera")) return { bg: "#f9e4b7", text: "#7a4f1e" };
  if (s.includes("ver")) return { bg: "#d4eaf7", text: "#1a4f6e" };
  if (s.includes("outono")) return { bg: "#f0d9c0", text: "#6b3a1f" };
  if (s.includes("inverno")) return { bg: "#dde4f0", text: "#1e2d5a" };
  return { bg: "#f0ece6", text: "#3d2b1f" };
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ColorAnalysis() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<ColorAnalysisResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const analyzeMutation = trpc.colorAnalysis.analyze.useMutation({
    onSuccess: (data) => {
      setResult(data as ColorAnalysisResult);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    },
    onError: (err) => {
      toast.error("Erro na análise: " + err.message);
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#00ff41]" />
      </div>
    );
  }

  if (!user) {
    setLocation("/");
    return null;
  }

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor seleciona uma imagem.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Imagem demasiado grande. Máximo 10MB.");
      return;
    }
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setResult(null);
    setIsUploading(true);
    try {
      const url = await uploadImageToStorage(file);
      setUploadedUrl(url);
      toast.success("Foto carregada com sucesso!");
    } catch {
      toast.error("Erro ao carregar a foto. Tenta novamente.");
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAnalyze = () => {
    if (!uploadedUrl) {
      toast.error("Carrega uma foto primeiro.");
      return;
    }
    analyzeMutation.mutate({ imageUrl: uploadedUrl });
  };

  const seasonStyle = result ? getSeasonStyle(result.classificacaoSazonal) : null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-4 py-4 flex items-center gap-4">
        <button
          onClick={() => setLocation("/dashboard")}
          className="text-white/60 hover:text-white transition-colors flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-[#00ff41]" />
          <span className="font-semibold text-sm tracking-wide">A COR IDEAL PARA SI</span>
        </div>
        <span className="ml-auto text-xs text-white/40">Método Sazonal · 12 Estações</span>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">

        {/* Upload section */}
        <Card className="bg-[#111] border-white/10">
          <CardContent className="p-6 space-y-5">
            <div className="text-center space-y-1">
              <h1 className="text-xl font-bold tracking-tight">Análise de Cor de Cabelo</h1>
              <p className="text-white/50 text-sm">Carrega uma foto do rosto do cliente para obter a análise sazonal completa</p>
            </div>

            {/* Drop zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center cursor-pointer hover:border-[#00ff41]/50 hover:bg-white/5 transition-all group"
            >
              {previewUrl ? (
                <div className="flex flex-col items-center gap-3">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-40 h-40 object-cover rounded-xl border border-white/20 shadow-lg"
                  />
                  {isUploading ? (
                    <div className="flex items-center gap-2 text-white/50 text-sm">
                      <Loader2 className="w-4 h-4 animate-spin" /> A carregar...
                    </div>
                  ) : (
                    <span className="text-xs text-white/40 group-hover:text-white/60">Clica para trocar a foto</span>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 py-4">
                  <div className="w-14 h-14 rounded-full bg-[#00ff41]/10 flex items-center justify-center group-hover:bg-[#00ff41]/20 transition-colors">
                    <Upload className="w-6 h-6 text-[#00ff41]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Carregar foto do cliente</p>
                    <p className="text-xs text-white/40 mt-1">JPG, PNG, WEBP · Máx. 10MB</p>
                  </div>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="user"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            />

            {/* Camera / Gallery buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="border-white/20 text-white/70 hover:text-white hover:border-white/40 bg-transparent"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.removeAttribute("capture");
                    fileInputRef.current.click();
                    setTimeout(() => fileInputRef.current?.setAttribute("capture", "user"), 500);
                  }
                }}
              >
                <Upload className="w-4 h-4 mr-2" /> Galeria
              </Button>
              <Button
                variant="outline"
                className="border-white/20 text-white/70 hover:text-white hover:border-white/40 bg-transparent"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="w-4 h-4 mr-2" /> Câmara
              </Button>
            </div>

            <Button
              className="w-full bg-[#00ff41] hover:bg-[#00cc33] text-black font-bold py-3 text-sm tracking-wide"
              disabled={!uploadedUrl || isUploading || analyzeMutation.isPending}
              onClick={handleAnalyze}
            >
              {analyzeMutation.isPending ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> A analisar...</>
              ) : (
                <><Sparkles className="w-4 h-4 mr-2" /> ANALISAR COR IDEAL</>
              )}
            </Button>

            {analyzeMutation.isPending && (
              <p className="text-center text-xs text-white/40 animate-pulse">
                A IA está a analisar o subtom, contraste e base natural... pode demorar alguns segundos.
              </p>
            )}
          </CardContent>
        </Card>

        {/* ─── RESULT ─────────────────────────────────────────────────────── */}
        {result && (
          <div ref={resultRef} className="space-y-5">

            {/* TOP CARD — foto + classificação */}
            <Card className="bg-[#111] border-white/10 overflow-hidden">
              <CardContent className="p-0">
                {/* Header cream strip */}
                <div className="px-6 pt-6 pb-4 text-center" style={{ background: seasonStyle?.bg ?? "#f0ece6" }}>
                  <h2 className="text-lg font-bold tracking-widest uppercase" style={{ color: seasonStyle?.text ?? "#3d2b1f", fontFamily: "Georgia, serif" }}>
                    A COR DE CABELO IDEAL PARA SI
                  </h2>
                </div>

                <div className="p-6 grid grid-cols-2 gap-6">
                  {/* Foto */}
                  {previewUrl && (
                    <div className="flex flex-col items-center gap-3">
                      <img
                        src={previewUrl}
                        alt="Cliente"
                        className="w-full max-w-[160px] aspect-square object-cover rounded-xl border-2 shadow-lg"
                        style={{ borderColor: seasonStyle?.bg ?? "#f0ece6" }}
                      />
                      <div className="text-center">
                        <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Classificação Sazonal</p>
                        <div
                          className="px-3 py-1.5 rounded-full text-sm font-bold"
                          style={{ background: seasonStyle?.bg, color: seasonStyle?.text }}
                        >
                          {result.classificacaoSazonal}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Dados técnicos */}
                  <div className="space-y-2.5">
                    {[
                      { label: "Subtom", value: result.subtom },
                      { label: "Contraste", value: result.contraste },
                      { label: "Base natural", value: result.baseNatural },
                      { label: "Intensidade", value: result.intensidade },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-start gap-2">
                        <Leaf className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: seasonStyle?.bg ?? "#c8a96e" }} />
                        <div>
                          <p className="text-xs text-white/40 leading-none">{label}</p>
                          <p className="text-sm font-medium leading-tight">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Explicação sazonal */}
                <div className="mx-6 mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-1">Resumo da Análise Técnica</p>
                  <p className="text-sm text-white/80 leading-relaxed">{result.explicacaoSazonal}</p>
                </div>
              </CardContent>
            </Card>

            {/* CORES RECOMENDADAS */}
            <Card className="bg-[#111] border-white/10">
              <CardContent className="p-6">
                <h3 className="text-sm font-bold tracking-widest uppercase text-white/60 mb-4 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[#00ff41]" />
                  Cores de Cabelo que Mais Valorizam
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {result.coresRecomendadas.map((cor: HairColor, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex flex-col items-center gap-1 flex-shrink-0">
                        <div
                          className="w-10 h-10 rounded-full border-2 border-white/20 shadow"
                          style={{ backgroundColor: cor.hex }}
                        />
                        <span className="text-[10px] text-white/30 font-mono">{cor.hex}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-bold text-white/30">{i + 1}</span>
                          <p className="text-sm font-semibold">{cor.name}</p>
                        </div>
                        <p className="text-xs text-white/50 leading-snug">{cor.description}</p>
                        <p className="text-xs text-[#00ff41]/70 leading-snug mt-1">{cor.whyItWorks}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* TÉCNICAS RECOMENDADAS */}
            <Card className="bg-[#111] border-white/10">
              <CardContent className="p-6">
                <h3 className="text-sm font-bold tracking-widest uppercase text-white/60 mb-4 flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-[#00ff41]" />
                  Técnicas Recomendadas
                </h3>
                <div className="space-y-2">
                  {result.tecnicasRecomendadas.map((t: Technique, i: number) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="w-6 h-6 rounded-full bg-[#00ff41]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Scissors className="w-3 h-3 text-[#00ff41]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{t.name}</p>
                        <p className="text-xs text-white/50 leading-snug">{t.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* CORES A EVITAR */}
            <Card className="bg-[#111] border-white/10">
              <CardContent className="p-6">
                <h3 className="text-sm font-bold tracking-widest uppercase text-white/60 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Cores a Evitar
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {result.coresAEvitar.map((cor: AvoidColor, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                      <div
                        className="w-8 h-8 rounded-full border-2 border-white/20 flex-shrink-0"
                        style={{ backgroundColor: cor.hex }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">{cor.name}</p>
                        <p className="text-xs text-white/40 font-mono">{cor.hex}</p>
                      </div>
                      <p className="text-xs text-amber-400/80 text-right max-w-[40%] leading-snug">{cor.reason}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* MELHOR RESULTADO NO SALÃO */}
            <Card className="bg-[#111] border-white/10">
              <CardContent className="p-6">
                <h3 className="text-sm font-bold tracking-widest uppercase text-white/60 mb-4 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#00ff41]" />
                  Melhor Resultado no Salão
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Altura ideal", value: result.formulaSalao.alturaIdeal },
                    { label: "Reflexo ideal", value: result.formulaSalao.reflexoIdeal },
                    { label: "Temperatura", value: result.formulaSalao.temperatura },
                    { label: "Contraste", value: result.formulaSalao.contraste },
                    { label: "Manutenção", value: result.formulaSalao.manutencao },
                    { label: "Retoque", value: result.formulaSalao.retoque },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-xs text-white/40 mb-0.5">{label}</p>
                      <p className="text-sm font-medium leading-snug">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Resultado visual esperado */}
                <div className="mt-4 p-4 rounded-xl bg-[#00ff41]/5 border border-[#00ff41]/20">
                  <p className="text-xs font-semibold text-[#00ff41]/60 uppercase tracking-widest mb-1">Resultado Visual Esperado</p>
                  <p className="text-sm text-white/80 leading-relaxed">{result.resultadoVisual}</p>
                </div>
              </CardContent>
            </Card>

            {/* PALETA FINAL */}
            <Card className="bg-[#111] border-white/10">
              <CardContent className="p-6">
                <h3 className="text-sm font-bold tracking-widest uppercase text-white/60 mb-4 text-center">
                  Paleta Final para Cabelo
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: "Base Principal", hex: result.paletaFinal.basePrincipal },
                    { label: "Reflexo", hex: result.paletaFinal.reflexo },
                    { label: "Iluminação", hex: result.paletaFinal.iluminacao },
                    { label: "Profundidade", hex: result.paletaFinal.profundidade },
                  ].map(({ label, hex }) => (
                    <div key={label} className="flex flex-col items-center gap-2">
                      <div
                        className="w-full aspect-square rounded-xl border border-white/20 shadow-md"
                        style={{ backgroundColor: hex }}
                      />
                      <p className="text-[10px] text-white/50 text-center leading-tight">{label}</p>
                      <p className="text-[10px] text-white/30 font-mono">{hex}</p>
                    </div>
                  ))}
                </div>
                <p className="text-center text-xs text-white/30 mt-4">
                  Combinação perfeita para uma cor de cabelo harmoniosa
                </p>
              </CardContent>
            </Card>

            {/* NOTA FINAL */}
            <p className="text-center text-xs text-white/25 pb-4 leading-relaxed px-4">
              Análise gerada com base nas características visuais da imagem. Para um diagnóstico técnico completo, consulte um profissional de coloração capilar.
            </p>

            {/* Nova análise */}
            <Button
              variant="outline"
              className="w-full border-white/20 text-white/70 hover:text-white bg-transparent"
              onClick={() => {
                setResult(null);
                setPreviewUrl(null);
                setUploadedUrl(null);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <Sparkles className="w-4 h-4 mr-2" /> Nova Análise
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
