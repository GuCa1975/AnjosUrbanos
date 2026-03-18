import { GoogleGenAI, Modality } from '@google/genai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error('VITE_GEMINI_API_KEY não está definida. Por favor, adiciona a chave de API no ficheiro .env ou nos Secrets do Replit.');
}

const ai = new GoogleGenAI({ apiKey: API_KEY || '' });

export interface TransformationRequest {
  imageBase64: string;
  imageMimeType: string;
  style: string;
  color?: string;
  customPrompt?: string;
}

export async function transformHairStyle(request: TransformationRequest): Promise<string> {
  const { imageBase64, imageMimeType, style, color, customPrompt } = request;

  const styleDescription = customPrompt || 
    `${style}${color ? ` com cor ${color}` : ''}`;

  const prompt = `You are a photorealistic hair transformation expert working at a premium salon.
  
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

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: imageMimeType,
                data: imageBase64,
              },
            },
            { text: prompt },
          ],
        },
      ],
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts) throw new Error('Sem resposta da IA');

    for (const part of parts) {
      if (part.inlineData?.data) {
        return part.inlineData.data;
      }
    }

    throw new Error('A IA não retornou uma imagem. Tenta novamente.');
  } catch (error) {
    console.error('Erro ao chamar a API Gemini:', error);
    throw error;
  }
}
