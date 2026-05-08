import type { Handler } from "@netlify/functions";
import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `Você é um especialista em colorimetria capilar e análise de cor pessoal, com profundo conhecimento do Método das 4 Estações (Primavera, Verão, Outono, Inverno). Analisa imagens de rostos humanos e fornece recomendações profissionais de cor de cabelo em português de Portugal. Responde SEMPRE em JSON válido, sem texto adicional fora do JSON.`;

const USER_PROMPT = `Analisa esta fotografia de rosto e realiza uma análise profissional completa de cor de cabelo usando o Método das 4 Estações.

Avalia as seguintes dimensões:
1. SUBTOM DA PELE: Quente/dourado/amarelado | Frio/rosado/azulado | Neutro, com tendência quente | Neutro, com tendência fria
2. PROFUNDIDADE: Clara | Média | Escura
3. INTENSIDADE: Viva e contrastante | Suave e harmónica
4. CONTRASTE: Alto | Médio | Baixo
5. BASE NATURAL DO CABELO: Loiro claro | Loiro escuro | Castanho claro | Castanho médio | Castanho escuro | Preto | Ruivo natural | Grisalho | Base artificial ou indefinida

Classifica numa das 4 estações:
- PRIMAVERA: pele quente, clara a média, subtom dourado/pêssego, olhos claros ou verdes/castanho-mel, cabelo loiro ou castanho dourado
- VERÃO: pele fria, clara a média, subtom rosado/bege frio, olhos azuis/cinza/castanho frio, cabelo loiro cinza ou castanho acinzentado
- OUTONO: pele quente, média a escura, subtom dourado/cobre/terracota, olhos castanhos/verdes/âmbar, cabelo castanho quente ou ruivo
- INVERNO: pele fria, média a escura, subtom azulado/olivado/bege frio, olhos escuros ou azul intenso, cabelo preto ou castanho escuro frio

Responde EXCLUSIVAMENTE com este JSON (sem markdown, sem texto extra):
{
  "subtom": "string curta ex: Neutro, com tendência quente",
  "profundidade": "string curta ex: Média",
  "intensidade": "string curta ex: Suave e harmónica",
  "contraste": "string curta ex: Médio",
  "baseNatural": "string curta ex: Castanho escuro",
  "classificacaoSazonal": "string — apenas o nome da estação ex: Outono",
  "explicacaoSazonal": "2-3 frases explicando a classificação e porque esta estação valoriza esta cliente",
  "resumoAnaliseTecnica": "2-3 frases descrevendo as características visuais observadas na imagem (pele, olhos, contraste, profundidade)",
  "coresRecomendadas": [
    {
      "name": "Nome da cor em português ex: Castanho chocolate quente",
      "description": "Descrição técnica de salão em 1 frase",
      "whyItWorks": "Porque valoriza esta cliente em 1 frase",
      "hex": "#XXXXXX"
    }
  ],
  "tecnicasRecomendadas": [
    {
      "name": "Nome da técnica ex: Morena iluminada suave",
      "reason": "Porque é ideal para esta cliente em 1 frase"
    }
  ],
  "coresAEvitar": [
    {
      "name": "Nome da cor ex: Loiro platinado frio",
      "hex": "#XXXXXX",
      "reason": "Razão curta em 1 frase"
    }
  ],
  "formulaSalao": {
    "alturaIdeal": "string ex: 4 a 6, com pontos de luz até 7",
    "reflexoIdeal": "string ex: Dourado suave, bege quente, caramelo ou avelã",
    "temperatura": "string ex: Quente equilibrada",
    "contraste": "string ex: Médio e natural",
    "manutencao": "string ex: Gloss a cada 6 a 8 semanas",
    "retoque": "string ex: Raiz ou tonalização conforme o crescimento"
  },
  "resultadoVisual": "2-3 frases descrevendo o resultado visual esperado após a coloração",
  "paletaFinal": {
    "basePrincipal": "#XXXXXX",
    "reflexo": "#XXXXXX",
    "iluminacao": "#XXXXXX",
    "profundidade": "#XXXXXX"
  }
}

Inclui EXACTAMENTE 6 cores recomendadas, 3 a 5 técnicas, e 4 a 5 cores a evitar. Todos os textos em português de Portugal.`;

export const handler: Handler = async (event) => {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  // Handle preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Método não permitido" }) };
  }

  const apiKey = process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error("[analyze-color] VITE_GEMINI_API_KEY não está definida no servidor");
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Serviço temporariamente indisponível" }),
    };
  }

  let body: { imageBase64?: string; imageMimeType?: string };
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Body inválido" }) };
  }

  const { imageBase64, imageMimeType } = body;
  if (!imageBase64 || !imageMimeType) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "imageBase64 e imageMimeType são obrigatórios" }) };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: SYSTEM_PROMPT + "\n\n" + USER_PROMPT },
            { inlineData: { mimeType: imageMimeType, data: imageBase64 } },
          ],
        },
      ],
    });

    const rawText = response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: "Sem resposta da IA" }) };
    }

    // Limpar possível markdown
    const cleaned = rawText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    try {
      const result = JSON.parse(cleaned);
      return { statusCode: 200, headers, body: JSON.stringify(result) };
    } catch {
      return { statusCode: 500, headers, body: JSON.stringify({ error: "Resposta da IA inválida. Tenta novamente." }) };
    }
  } catch (err) {
    console.error("[analyze-color] Erro:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Erro ao analisar imagem. Tenta novamente." }),
    };
  }
};
