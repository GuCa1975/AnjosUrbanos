import { GoogleGenAI, Modality } from '@google/genai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error('VITE_GEMINI_API_KEY não está definida.');
}

const ai = new GoogleGenAI({ apiKey: API_KEY || '' });

export interface TransformationRequest {
  imageBase64: string;
  imageMimeType: string;
  referenceImageBase64?: string;
  referenceImageMimeType?: string;
  style: string;
  color?: string;
  customPrompt?: string;
}

export async function transformHairStyle(request: TransformationRequest): Promise<string> {
  const { imageBase64, imageMimeType, referenceImageBase64, referenceImageMimeType, style, color, customPrompt } = request;

  const hasReference = !!referenceImageBase64;

  let prompt: string;

  if (hasReference) {
    // Modo referência: aplicar o cabelo da foto de referência no rosto da cliente
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
    // Modo selectores: aplicar estilo/cor escolhidos
    const styleDescription = customPrompt || `${style}${color ? ` with colour ${color}` : ''}`;
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
    const parts: object[] = [];

    // Primeira imagem: sempre a foto da cliente
    parts.push({
      inlineData: {
        mimeType: imageMimeType,
        data: imageBase64,
      },
    });

    // Segunda imagem: foto de referência (se existir)
    if (hasReference && referenceImageBase64 && referenceImageMimeType) {
      parts.push({
        inlineData: {
          mimeType: referenceImageMimeType,
          data: referenceImageBase64,
        },
      });
    }

    // Prompt de texto
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: [
        {
          role: 'user',
          parts,
        },
      ],
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    const responseParts = response.candidates?.[0]?.content?.parts;
    if (!responseParts) throw new Error('Sem resposta da IA');

    for (const part of responseParts) {
      if ((part as { inlineData?: { data?: string } }).inlineData?.data) {
        return (part as { inlineData: { data: string } }).inlineData.data;
      }
    }

    throw new Error('A IA não retornou uma imagem. Tenta novamente.');
  } catch (error) {
    console.error('Erro ao chamar a API Gemini:', error);
    throw error;
  }
}
