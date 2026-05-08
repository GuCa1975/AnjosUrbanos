import type { Handler } from "@netlify/functions";
import { GoogleGenAI, Modality } from "@google/genai";

export const handler: Handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Método não permitido" }) };
  }

  const apiKey = process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error("[transform-hair] VITE_GEMINI_API_KEY não está definida no servidor");
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Serviço temporariamente indisponível" }),
    };
  }

  let body: {
    imageBase64?: string;
    imageMimeType?: string;
    referenceImageBase64?: string;
    referenceImageMimeType?: string;
    style?: string;
    color?: string;
    customPrompt?: string;
  };

  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Body inválido" }) };
  }

  const { imageBase64, imageMimeType, referenceImageBase64, referenceImageMimeType, style, color, customPrompt } = body;

  if (!imageBase64 || !imageMimeType) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "imageBase64 e imageMimeType são obrigatórios" }) };
  }

  const hasReference = !!referenceImageBase64;

  let prompt: string;
  if (hasReference) {
    prompt = `You are a world-class photorealistic hair transformation specialist.

You have TWO images:
- IMAGE 1: CLIENT — the person to transform
- IMAGE 2: REFERENCE — the desired hairstyle

Your task: Realistically place the hairstyle from IMAGE 2 onto the person in IMAGE 1.

CRITICAL RULES:
1. FACE PRESERVATION: Keep the client's face 100% identical — same skin tone, facial features, expression, age, gender
2. HAIR TRANSFER: Extract the hair style, cut, shape, length, texture and colour from the reference image
3. NATURAL ADAPTATION: Adapt the hair to fit the client's head shape, face shape and proportions naturally — do NOT just paste hair on top
4. PHOTOREALISM: The result must look like a real professional salon photo — seamless blending, correct shadows, natural hairline
5. BACKGROUND: Keep the original background and lighting from IMAGE 1
6. GENDER RESPECT: If the client is male, adapt the reference style to look masculine and natural on a man
7. NO ARTIFACTS: Avoid floating hair, unnatural edges, or visible compositing seams

Return ONLY the final transformed image, no text.`;
  } else {
    const styleDescription = customPrompt || `${style || ""}${color ? ` with colour ${color}` : ""}`;
    prompt = `You are a photorealistic hair transformation expert working at a premium salon.

Analyse this photo and apply the following hair transformation: ${styleDescription}

IMPORTANT RULES:
- COMPLETELY preserve the person's facial identity (face, eyes, nose, mouth, skin tone)
- ONLY modify the hair as requested
- The result must be photorealistic, as if it were a real photo taken after the salon visit
- Maintain the original lighting and background
- The transformation must look natural and professional — use modern 2025 salon techniques
- If a colour number is mentioned (e.g. 6.44, 7.3), apply that exact professional hair colour tone
- Avoid outdated or retro styles — aim for a contemporary, editorial look

Apply the transformation and return ONLY the transformed image, no additional text.`;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const parts: object[] = [];

    parts.push({ inlineData: { mimeType: imageMimeType, data: imageBase64 } });

    if (hasReference && referenceImageBase64 && referenceImageMimeType) {
      parts.push({ inlineData: { mimeType: referenceImageMimeType, data: referenceImageBase64 } });
    }

    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-image-preview",
      contents: [{ role: "user", parts }],
      config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
    });

    const responseParts = response.candidates?.[0]?.content?.parts;
    if (!responseParts) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: "Sem resposta da IA" }) };
    }

    for (const part of responseParts) {
      const p = part as { inlineData?: { data?: string } };
      if (p.inlineData?.data) {
        return { statusCode: 200, headers, body: JSON.stringify({ imageBase64: p.inlineData.data }) };
      }
    }

    return { statusCode: 500, headers, body: JSON.stringify({ error: "A IA não retornou uma imagem. Tenta novamente." }) };
  } catch (err) {
    console.error("[transform-hair] Erro:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Erro ao transformar imagem. Tenta novamente." }),
    };
  }
};
