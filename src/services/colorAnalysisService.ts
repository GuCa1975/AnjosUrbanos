import { GoogleGenAI } from '@google/genai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: API_KEY || '' });

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

const SYSTEM_PROMPT = `Você é um especialista em colorimetria capilar e análise de cor pessoal, com profundo conhecimento do Método das 4 Estações (Primavera, Verão, Outono, Inverno). Analisa imagens de rostos humanos e fornece recomendações profissionais de cor de cabelo em português de Portugal. Responde SEMPRE em JSON válido, sem texto adicional fora do JSON.`;

const USER_PROMPT = `Analisa esta fotografia de rosto e realiza uma análise profissional completa de cor de cabelo usando o Método das 4 Estações.

Avalia:
1. SUBTOM DA PELE: Quente/dourado | Frio/rosado | Neutro com tendência quente | Neutro com tendência fria
2. PROFUNDIDADE: Clara | Média | Escura
3. INTENSIDADE: Viva e contrastante | Suave e harmónica
4. CONTRASTE: Alto | Médio | Baixo
5. BASE NATURAL DO CABELO: Loiro claro/escuro | Castanho claro/médio/escuro | Preto | Ruivo | Grisalho

Classifica numa das 4 estações:
- PRIMAVERA: pele quente clara/média, subtom dourado/pêssego, olhos claros/verdes/castanho-mel
- VERÃO: pele fria clara/média, subtom rosado/bege frio, olhos azuis/cinza/castanho frio
- OUTONO: pele quente média/escura, subtom dourado/cobre/terracota, olhos castanhos/verdes/âmbar
- INVERNO: pele fria média/escura, subtom azulado/olivado, olhos escuros ou azul intenso

Responde EXCLUSIVAMENTE com este JSON (sem markdown, sem texto extra):
{
  "subtom": "string curta",
  "profundidade": "string curta",
  "intensidade": "string curta",
  "contraste": "string curta",
  "baseNatural": "string curta",
  "classificacaoSazonal": "apenas o nome da estação ex: Outono",
  "explicacaoSazonal": "2-3 frases explicando a classificação",
  "resumoAnaliseTecnica": "2-3 frases descrevendo características visuais observadas",
  "coresRecomendadas": [
    {"name": "Nome da cor", "description": "Descrição técnica em 1 frase", "whyItWorks": "Porque valoriza em 1 frase", "hex": "#XXXXXX"}
  ],
  "tecnicasRecomendadas": [
    {"name": "Nome da técnica", "reason": "Porque é ideal em 1 frase"}
  ],
  "coresAEvitar": [
    {"name": "Nome da cor", "hex": "#XXXXXX", "reason": "Razão curta em 1 frase"}
  ],
  "formulaSalao": {
    "alturaIdeal": "string",
    "reflexoIdeal": "string",
    "temperatura": "string",
    "contraste": "string",
    "manutencao": "string",
    "retoque": "string"
  },
  "resultadoVisual": "2-3 frases sobre o resultado esperado",
  "paletaFinal": {
    "basePrincipal": "#XXXXXX",
    "reflexo": "#XXXXXX",
    "iluminacao": "#XXXXXX",
    "profundidade": "#XXXXXX"
  }
}

Inclui EXACTAMENTE 6 cores recomendadas, 3-5 técnicas, e 4-5 cores a evitar. Todos os textos em português de Portugal.`;

export async function analyzeHairColor(imageBase64: string, imageMimeType: string): Promise<ColorAnalysisResult> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: [
          { text: SYSTEM_PROMPT + '\n\n' + USER_PROMPT },
          { inlineData: { mimeType: imageMimeType, data: imageBase64 } },
        ],
      },
    ],
  });

  const rawText = response.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error('Sem resposta da IA');

  // Limpar possível markdown
  const cleaned = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  try {
    return JSON.parse(cleaned) as ColorAnalysisResult;
  } catch {
    throw new Error('Resposta da IA inválida. Tenta novamente.');
  }
}
