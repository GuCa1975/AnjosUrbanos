// A chamada à API Gemini é feita no servidor via Netlify Function
// A chave API nunca é exposta no frontend

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
  const response = await fetch('/.netlify/functions/transform-hair', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    let errorMsg = 'Erro ao transformar imagem. Tenta novamente.';
    try {
      const errData = await response.json();
      if (errData?.error) errorMsg = errData.error;
    } catch { /* ignorar */ }
    throw new Error(errorMsg);
  }

  const result = await response.json();
  if (!result?.imageBase64) {
    throw new Error('A IA não retornou uma imagem. Tenta novamente.');
  }
  return result.imageBase64 as string;
}
