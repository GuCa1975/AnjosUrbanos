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

  const prompt = `Você é um especialista em transformações de cabelo fotorrealistas. 
  
  Analise esta foto e aplique a seguinte transformação de cabelo: ${styleDescription}
  
  REGRAS IMPORTANTES:
  - Preserve COMPLETAMENTE a identidade facial da pessoa (rosto, olhos, nariz, boca, pele)
  - Apenas modifique o cabelo conforme solicitado
  - O resultado deve ser fotorrealista, como se fosse uma foto real
  - Mantenha a iluminação e o fundo originais
  - A transformação deve parecer natural e profissional
  - Use técnicas de coloração e corte de nível de salão premium
  
  Aplique a transformação e retorne APENAS a imagem transformada, sem texto adicional.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-preview-image-generation',
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
