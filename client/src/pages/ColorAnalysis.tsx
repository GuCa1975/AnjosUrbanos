import { useRef, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { Camera, Loader2, ArrowLeft } from "lucide-react";

interface HairColor { name: string; description: string; whyItWorks: string; hex: string; }
interface AvoidColor { name: string; hex: string; reason: string; }
interface Technique { name: string; reason: string; }
interface FinalPalette { basePrincipal: string; reflexo: string; iluminacao: string; profundidade: string; }
interface SalonFormula { alturaIdeal: string; reflexoIdeal: string; temperatura: string; contraste: string; manutencao: string; retoque: string; }
interface ColorAnalysisResult {
  subtom: string; profundidade: string; intensidade: string; contraste: string; baseNatural: string;
  classificacaoSazonal: string; explicacaoSazonal: string; resumoAnaliseTecnica: string;
  coresRecomendadas: HairColor[]; tecnicasRecomendadas: Technique[]; coresAEvitar: AvoidColor[];
  formulaSalao: SalonFormula; resultadoVisual: string; paletaFinal: FinalPalette;
}

const SEASON_BADGE: Record<string, { bg: string; text: string; icon: string }> = {
  Primavera: { bg: "#C47A2B", text: "#fff", icon: "🌸" },
  "Verão":   { bg: "#4A6FA5", text: "#fff", icon: "☀️" },
  Outono:    { bg: "#8B4513", text: "#fff", icon: "🍂" },
  Inverno:   { bg: "#2C3E6B", text: "#fff", icon: "❄️" },
};

const TECH_ICONS = ["✂️","🎨","💧","✨","🌿"];

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
    onError: (err) => { toast.error("Erro na análise: " + err.message); },
  });

  if (loading) return (
    <div className="min-h-screen bg-[#F9F5F0] flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-[#C47A2B]" />
    </div>
  );
  if (!user) { setLocation("/"); return null; }

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) { toast.error("Por favor selecciona uma imagem."); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error("Imagem demasiado grande. Máximo 10MB."); return; }
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload-temp", { method: "POST", body: formData, credentials: "include" });
      if (!res.ok) throw new Error();
      const data = await res.json() as { url: string };
      setUploadedUrl(data.url);
      toast.success("Foto carregada!");
    } catch { toast.error("Erro ao carregar a foto."); setPreviewUrl(null); }
    finally { setIsUploading(false); }
  };

  const season = result?.classificacaoSazonal ?? "Outono";
  const sb = SEASON_BADGE[season] ?? SEASON_BADGE["Outono"];

  return (
    <div className="min-h-screen bg-[#F9F5F0]" style={{ fontFamily: "'Georgia', serif", color: "#2C1A0E" }}>
      {/* Header */}
      <header className="bg-white border-b border-[#E8DDD4] sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/dashboard")} className="text-[#8B6347] hover:text-[#2C1A0E]" style={{fontFamily:"sans-serif"}}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
          </Button>
          <span className="font-bold text-sm uppercase tracking-widest text-[#2C1A0E]" style={{fontFamily:"sans-serif"}}>Análise de Cor de Cabelo</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Upload card — só visível antes do resultado */}
        {!result && (
          <div className="bg-white rounded-2xl border border-[#E8DDD4] shadow-sm p-8 mb-6">
            <h1 className="text-2xl font-black text-center uppercase tracking-tight mb-2">A Cor de Cabelo Ideal Para Si</h1>
            <p className="text-center text-[#8B6347] text-sm mb-8" style={{fontFamily:"sans-serif"}}>
              Carregue uma foto do rosto do cliente · Método das 4 Estações
            </p>
            <div
              className="border-2 border-dashed border-[#D4B896] rounded-xl p-10 flex flex-col items-center gap-4 cursor-pointer hover:bg-[#FDF8F3] transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-44 h-44 object-cover rounded-xl border-2 border-[#D4B896]" />
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-[#F4E8D8] flex items-center justify-center">
                    <Camera className="h-8 w-8 text-[#C47A2B]" />
                  </div>
                  <p className="text-[#8B6347] text-sm text-center" style={{fontFamily:"sans-serif"}}>
                    Clique para seleccionar uma foto<br/>
                    <span className="text-xs text-[#B8967A]">JPG, PNG ou WEBP · máx. 10MB</span>
                  </p>
                </>
              )}
              {isUploading && <Loader2 className="h-5 w-5 animate-spin text-[#C47A2B]" />}
            </div>
            <input
              ref={fileInputRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            />
            <div className="flex gap-3 mt-6 justify-center">
              {previewUrl && !isUploading && (
                <Button variant="outline" onClick={() => { setPreviewUrl(null); setUploadedUrl(null); if(fileInputRef.current) fileInputRef.current.value=""; }} className="border-[#D4B896] text-[#8B6347]" style={{fontFamily:"sans-serif"}}>
                  Trocar foto
                </Button>
              )}
              <Button
                onClick={() => { if(!uploadedUrl){ toast.error("Carregue uma foto primeiro."); return; } analyzeMutation.mutate({imageUrl:uploadedUrl}); }}
                disabled={!uploadedUrl || isUploading || analyzeMutation.isPending}
                className="bg-[#C47A2B] hover:bg-[#A8621E] text-white font-bold uppercase tracking-wider px-8"
                style={{fontFamily:"sans-serif"}}
              >
                {analyzeMutation.isPending
                  ? <><Loader2 className="h-4 w-4 animate-spin mr-2"/>A analisar...</>
                  : "Analisar Cor"}
              </Button>
            </div>
            {analyzeMutation.isPending && (
              <p className="text-center text-xs text-[#8B6347] mt-4 animate-pulse" style={{fontFamily:"sans-serif"}}>
                A IA está a analisar as características da imagem... pode demorar até 30 segundos.
              </p>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            RELATÓRIO VISUAL — layout fiel à imagem de referência
        ═══════════════════════════════════════════════════════════════ */}
        {result && (
          <div ref={resultRef} className="bg-white rounded-2xl border border-[#E8DDD4] shadow-sm overflow-hidden">

            {/* Título com folhas */}
            <div className="bg-[#F9F5F0] border-b border-[#E8DDD4] px-8 py-5 text-center relative">
              <span className="absolute left-4 top-3 text-3xl opacity-50 select-none">🍂</span>
              <span className="absolute right-4 top-3 text-3xl opacity-50 select-none" style={{transform:"scaleX(-1)"}}>🍂</span>
              <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight">A Cor de Cabelo Ideal Para Si</h1>
            </div>

            <div className="p-6 md:p-8">

              {/* ── Bloco topo: foto + análise técnica ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                {/* Coluna esquerda: foto + classificação */}
                <div>
                  {previewUrl && (
                    <div className="rounded-xl overflow-hidden border-2 border-[#D4B896] mb-4">
                      <img src={previewUrl} alt="Cliente" className="w-full object-cover max-h-64"/>
                    </div>
                  )}
                  <div className="text-center">
                    <p className="text-xs uppercase tracking-widest text-[#8B6347] mb-2 font-semibold" style={{fontFamily:"sans-serif"}}>Classificação Sazonal</p>
                    <div className="inline-block px-6 py-2 rounded-lg font-black text-xl uppercase tracking-wide" style={{backgroundColor: sb.bg, color: sb.text}}>
                      {sb.icon} {season}
                    </div>
                    <p className="text-sm text-[#5C3A1E] mt-3 leading-relaxed" style={{fontFamily:"sans-serif"}}>{result.explicacaoSazonal}</p>
                  </div>
                </div>

                {/* Coluna direita: características + resumo */}
                <div className="flex flex-col gap-4">
                  <div className="rounded-xl border border-[#E8DDD4] bg-[#FDF8F3] p-4">
                    {[
                      {icon:"🍂", label:"Classificação sazonal", value: season},
                      {icon:"🌡️", label:"Subtom", value: result.subtom},
                      {icon:"⚡", label:"Contraste", value: result.contraste},
                      {icon:"💇", label:"Base natural", value: result.baseNatural},
                      {icon:"✨", label:"Intensidade", value: result.intensidade},
                    ].map(item => (
                      <div key={item.label} className="flex items-start gap-2 py-1.5 border-b border-[#EDE3D8] last:border-0">
                        <span className="text-sm">{item.icon}</span>
                        <span className="text-xs text-[#8B6347] font-semibold min-w-[130px]" style={{fontFamily:"sans-serif"}}>{item.label}:</span>
                        <span className="text-xs text-[#2C1A0E]" style={{fontFamily:"sans-serif"}}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl border border-[#E8DDD4] bg-white p-4">
                    <p className="text-xs uppercase tracking-widest text-[#8B6347] font-bold mb-2" style={{fontFamily:"sans-serif"}}>Resumo da Análise Técnica</p>
                    <p className="text-sm text-[#2C1A0E] leading-relaxed" style={{fontFamily:"sans-serif"}}>{result.resumoAnaliseTecnica}</p>
                  </div>
                </div>
              </div>

              {/* ── Cores recomendadas (6 swatches) ── */}
              <div className="mb-6">
                <h2 className="text-center text-xs font-black uppercase tracking-widest mb-4 pb-2 border-b border-[#E8DDD4]" style={{fontFamily:"sans-serif"}}>
                  Cores de Cabelo que Mais Valorizam
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {result.coresRecomendadas.slice(0,6).map((cor, i) => (
                    <div key={i} className="rounded-xl border border-[#E8DDD4] overflow-hidden bg-[#FDF8F3]">
                      <div className="relative">
                        <div className="w-full h-20" style={{backgroundColor: cor.hex}}/>
                        <span className="absolute top-2 left-2 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center text-xs font-black text-[#2C1A0E]">{i+1}</span>
                      </div>
                      <div className="p-3">
                        <p className="font-black text-xs text-[#2C1A0E] mb-1" style={{fontFamily:"sans-serif"}}>{cor.name}</p>
                        <p className="text-[10px] text-[#8B6347] mb-1 leading-snug" style={{fontFamily:"sans-serif"}}>{cor.description}</p>
                        <p className="text-[10px] text-[#5C3A1E] leading-snug italic" style={{fontFamily:"sans-serif"}}>{cor.whyItWorks}</p>
                        <p className="text-[9px] font-mono text-[#B8967A] mt-1">{cor.hex}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Técnicas + Cores a evitar ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h2 className="text-xs font-black uppercase tracking-widest mb-3 pb-2 border-b border-[#E8DDD4]" style={{fontFamily:"sans-serif"}}>Técnicas Recomendadas</h2>
                  <div className="space-y-2">
                    {result.tecnicasRecomendadas.map((t, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-base mt-0.5">{TECH_ICONS[i] ?? TECH_ICONS[0]}</span>
                        <div>
                          <span className="text-xs font-bold text-[#2C1A0E]" style={{fontFamily:"sans-serif"}}>{t.name}</span>
                          <span className="text-xs text-[#8B6347]" style={{fontFamily:"sans-serif"}}> — {t.reason}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className="text-xs font-black uppercase tracking-widest mb-3 pb-2 border-b border-[#E8DDD4]" style={{fontFamily:"sans-serif"}}>Cores a Evitar</h2>
                  <div className="space-y-2">
                    {result.coresAEvitar.map((c, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg border border-[#E8DDD4] shrink-0" style={{backgroundColor: c.hex}}/>
                        <div>
                          <p className="text-xs font-bold text-[#2C1A0E]" style={{fontFamily:"sans-serif"}}>{c.name}</p>
                          <p className="text-[9px] font-mono text-[#B8967A]">{c.hex}</p>
                          <p className="text-[10px] text-[#8B6347]" style={{fontFamily:"sans-serif"}}>{c.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Fórmula salão + Resultado visual ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="rounded-xl border border-[#E8DDD4] bg-[#FDF8F3] p-4">
                  <h2 className="text-xs font-black uppercase tracking-widest mb-3" style={{fontFamily:"sans-serif"}}>Melhor Resultado no Salão</h2>
                  <ul className="space-y-1.5">
                    {[
                      {label:"Altura ideal", value: result.formulaSalao.alturaIdeal},
                      {label:"Reflexo ideal", value: result.formulaSalao.reflexoIdeal},
                      {label:"Temperatura", value: result.formulaSalao.temperatura},
                      {label:"Contraste", value: result.formulaSalao.contraste},
                      {label:"Manutenção", value: result.formulaSalao.manutencao},
                      {label:"Retoque", value: result.formulaSalao.retoque},
                    ].map(item => (
                      <li key={item.label} className="flex gap-1.5 text-xs" style={{fontFamily:"sans-serif"}}>
                        <span className="text-[#C47A2B]">•</span>
                        <span className="font-semibold text-[#2C1A0E]">{item.label}:</span>
                        <span className="text-[#5C3A1E]">{item.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-[#E8DDD4] bg-white p-4">
                  <h2 className="text-xs font-black uppercase tracking-widest mb-3" style={{fontFamily:"sans-serif"}}>Resultado Visual Esperado</h2>
                  <p className="text-sm text-[#2C1A0E] leading-relaxed" style={{fontFamily:"sans-serif"}}>{result.resultadoVisual}</p>
                </div>
              </div>

              {/* ── Paleta final ── */}
              <div className="rounded-xl border border-[#E8DDD4] overflow-hidden mb-6">
                <div className="bg-[#F9F5F0] px-4 py-2 text-center border-b border-[#E8DDD4]">
                  <h2 className="text-xs font-black uppercase tracking-widest" style={{fontFamily:"sans-serif"}}>Paleta Final para Cabelo</h2>
                </div>
                <div className="grid grid-cols-4">
                  {[
                    {label:"Base principal", hex: result.paletaFinal.basePrincipal},
                    {label:"Reflexo", hex: result.paletaFinal.reflexo},
                    {label:"Iluminação", hex: result.paletaFinal.iluminacao},
                    {label:"Profundidade", hex: result.paletaFinal.profundidade},
                  ].map(p => (
                    <div key={p.label} className="flex flex-col items-center">
                      <div className="w-full h-14" style={{backgroundColor: p.hex}}/>
                      <div className="bg-white w-full text-center py-2 border-t border-[#E8DDD4]">
                        <p className="text-[10px] text-[#8B6347]" style={{fontFamily:"sans-serif"}}>{p.label}</p>
                        <p className="text-[9px] font-mono font-bold text-[#2C1A0E]">{p.hex}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-[#F9F5F0] px-4 py-2 text-center border-t border-[#E8DDD4]">
                  <p className="text-[10px] text-[#8B6347]" style={{fontFamily:"sans-serif"}}>Combinação perfeita para uma cor de cabelo harmoniosa</p>
                </div>
              </div>

              {/* Rodapé */}
              <p className="text-[10px] text-center text-[#B8967A] leading-relaxed mb-6" style={{fontFamily:"sans-serif"}}>
                Análise gerada com base nas características visuais da imagem. Para um diagnóstico técnico completo, consulte um profissional de coloração capilar.
              </p>

              {/* Botões */}
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => { setResult(null); setPreviewUrl(null); setUploadedUrl(null); }} className="border-[#D4B896] text-[#8B6347] hover:bg-[#FDF8F3]" style={{fontFamily:"sans-serif"}}>
                  Nova Análise
                </Button>
                <Button onClick={() => window.print()} className="bg-[#C47A2B] hover:bg-[#A8621E] text-white font-bold uppercase tracking-wider" style={{fontFamily:"sans-serif"}}>
                  Imprimir / Guardar PDF
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
