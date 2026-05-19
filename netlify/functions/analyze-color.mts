import type { Handler } from "@netlify/functions";
import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `És um especialista certificado em colorimetria capilar e análise de cor pessoal, com 20 anos de experiência no Método das 4 Estações (Primavera, Verão, Outono, Inverno). A tua missão é analisar fotografias de rostos humanos com máxima precisão científica e devolver recomendações profissionais de cor de cabelo em português de Portugal.

REGRAS ABSOLUTAS:
1. Analisa OBJECTIVAMENTE o que vês na imagem — nunca assumas nem inventes características.
2. A classificação sazonal DEVE ser determinada pela combinação real de subtom + profundidade + contraste observados.
3. As 4 estações têm probabilidade IGUAL de ocorrência — não há estação padrão nem preferida.
4. Responde SEMPRE em JSON válido, sem texto adicional fora do JSON.`;

const USER_PROMPT = `Analisa esta fotografia de rosto com máxima precisão e realiza uma análise profissional completa de cor de cabelo usando o Método das 4 Estações.

PASSO 1 — OBSERVAÇÃO OBJECTIVA (analisa cada dimensão independentemente):

A) SUBTOM DA PELE: Observa o tom geral da pele, a forma como reage à luz, e as veias visíveis.
   - Quente: amarelado, dourado, pêssego, terracota, cobre
   - Frio: rosado, bege frio, azulado, olivado frio
   - Neutro-quente: misto com tendência quente
   - Neutro-frio: misto com tendência fria

B) PROFUNDIDADE: Avalia a luminosidade geral do rosto.
   - Clara: pele muito clara, cabelo loiro ou castanho claro
   - Média: pele média, cabelo castanho médio
   - Escura: pele morena/escura, cabelo castanho escuro ou preto

C) CONTRASTE: Compara a diferença entre a cor da pele, olhos e cabelo.
   - Alto: diferença marcada (ex: pele clara + cabelo/olhos muito escuros)
   - Médio: diferença moderada e harmónica
   - Baixo: pouca diferença, tons próximos entre si

D) COR DOS OLHOS:
   - Azul, cinza, verde-azulado = tendência fria
   - Verde, castanho-mel, âmbar = pode ser quente ou neutro
   - Castanho médio/escuro, preto = neutro a frio

E) BASE NATURAL DO CABELO: Tom mais natural visível.

PASSO 2 — CLASSIFICAÇÃO SAZONAL (usa esta tabela com rigor absoluto):

| Estação   | Subtom pele      | Profundidade     | Contraste     | Características distintivas |
|-----------|------------------|------------------|---------------|------------------------------|
| PRIMAVERA | Quente           | Clara a média    | Baixo a médio | Pele pêssego/dourado clara, olhos claros/verdes/mel, cabelo loiro dourado ou castanho claro quente |
| VERÃO     | Frio             | Clara a média    | Baixo a médio | Pele rosada/bege fria, olhos azuis/cinza/castanho frio, cabelo loiro acinzentado ou castanho frio |
| OUTONO    | Quente           | Média a escura   | Médio         | Pele dourada/cobre/terracota MÉDIA A ESCURA, olhos castanhos/verdes/âmbar intensos, cabelo castanho quente/ruivo |
| INVERNO   | Frio             | Média a escura   | Alto          | Pele olivada/bege fria/escura, olhos escuros ou azul intenso, cabelo preto ou castanho escuro frio |

ATENÇÃO CRÍTICA:
- Pele CLARA com subtom FRIO → VERÃO (NUNCA Outono)
- Pele CLARA com subtom QUENTE → PRIMAVERA (NUNCA Outono)
- OUTONO requer obrigatoriamente pele MÉDIA A ESCURA com subtom quente
- INVERNO requer obrigatoriamente contraste ALTO com subtom frio

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
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.2,
      },
      contents: [
        {
          role: "user",
          parts: [
            { text: USER_PROMPT },
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
