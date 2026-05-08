// A chamada à API Gemini é feita no servidor via Netlify Function
// A chave API nunca é exposta no frontend

export interface HairColor {
  name: string;
  description: string;
  whyItWorks: string;
  hex: string;
}

export interface AvoidColor {
  name: string;
  hex: string;
  reason: string;
}

export interface Technique {
  name: string;
  reason: string;
}

export interface FinalPalette {
  basePrincipal: string;
  reflexo: string;
  iluminacao: string;
  profundidade: string;
}

export interface SalonFormula {
  alturaIdeal: string;
  reflexoIdeal: string;
  temperatura: string;
  contraste: string;
  manutencao: string;
  retoque: string;
}

export interface ColorAnalysisResult {
  subtom: string;
  profundidade: string;
  intensidade: string;
  contraste: string;
  baseNatural: string;
  classificacaoSazonal: string;
  explicacaoSazonal: string;
  resumoAnaliseTecnica: string;
  coresRecomendadas: HairColor[];
  tecnicasRecomendadas: Technique[];
  coresAEvitar: AvoidColor[];
  formulaSalao: SalonFormula;
  resultadoVisual: string;
  paletaFinal: FinalPalette;
}

export async function analyzeHairColor(imageBase64: string, imageMimeType: string): Promise<ColorAnalysisResult> {
  const response = await fetch('/.netlify/functions/analyze-color', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, imageMimeType }),
  });

  if (!response.ok) {
    let errorMsg = 'Erro ao analisar imagem. Tenta novamente.';
    try {
      const errData = await response.json();
      if (errData?.error) errorMsg = errData.error;
    } catch { /* ignorar */ }
    throw new Error(errorMsg);
  }

  const result = await response.json();
  return result as ColorAnalysisResult;
}
