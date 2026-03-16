export type Lang = 'pt' | 'en';

export interface Translations {
  // Header
  studioVirtual: string;
  poweredBy: string;
  // ImageSelector
  heroTitle: string;
  heroSubtitle: string;
  uploadPhoto: string;
  uploadFormats: string;
  takeSelfie: string;
  cameraLive: string;
  officialPartner: string;
  // CameraCapture
  cameraError: string;
  faceGuide: string;
  takePhoto: string;
  cancel: string;
  switchCamera: string;
  frontCamera: string;
  backCamera: string;
  // Editor — section labels
  originalPhoto: string;
  original: string;
  result: string;
  chooseStyle: string;
  chooseColor: string;
  customDesc: string;
  customPlaceholder: string;
  beforeAfter: string;
  transformAppear: string;
  selectStyleHint: string;
  before: string;
  after: string;
  // Editor — buttons & messages
  transforming: string;
  transform: string;
  newPhoto: string;
  saveImage: string;
  newResult: string;
  errorNoStyle: string;
  errorTransform: string;
  loadingMsg: string;
  // Hair styles
  styles: {
    pixie: string;
    bob: string;
    waves: string;
    straight: string;
    curls: string;
    long: string;
  };
  // Hair colors
  colors: {
    platinum: string;
    golden: string;
    auburn: string;
    brunette: string;
    black: string;
    rose: string;
    violet: string;
    silver: string;
  };
  // Footer
  footer: string;
  // Idioma actual (para uso interno)
  lang: string;
}

export const translations: Record<Lang, Translations> = {
  pt: {
    studioVirtual: 'Estúdio Virtual',
    poweredBy: 'Powered by',
    heroTitle: 'O Teu Novo Visual',
    heroSubtitle: 'Experimenta cortes e cores de cabelo com inteligência artificial antes de os fazer no salão',
    uploadPhoto: 'Carregar Foto',
    uploadFormats: 'JPG, PNG, WEBP',
    takeSelfie: 'Tirar Selfie',
    cameraLive: 'Câmera ao vivo',
    officialPartner: 'Parceiro Oficial',
    cameraError: 'Não foi possível aceder à câmera. Verifica as permissões do browser.',
    faceGuide: 'Posiciona o teu rosto dentro do guia oval para melhores resultados',
    takePhoto: '📸 Tirar Foto',
    cancel: 'Cancelar',
    switchCamera: 'Trocar Câmera',
    frontCamera: 'Câmera Frontal',
    backCamera: 'Câmera Traseira',
    originalPhoto: 'Foto Original',
    original: 'Original',
    result: 'Resultado',
    chooseStyle: 'Escolhe o Corte',
    chooseColor: 'Escolhe a Cor',
    customDesc: 'Descrição Personalizada (opcional)',
    customPlaceholder: 'Ex: Corte em camadas com franja lateral, cor castanho acobreado...',
    beforeAfter: 'Antes / Depois — Arrasta para comparar',
    transformAppear: 'A tua transformação aparecerá aqui',
    selectStyleHint: 'Seleciona um estilo e clica em Transformar',
    before: 'ANTES',
    after: 'DEPOIS',
    transforming: '⟳ A transformar...',
    transform: '✦ Transformar',
    newPhoto: 'Nova Foto',
    saveImage: '⬇ Guardar Imagem',
    newResult: 'Nova',
    errorNoStyle: 'Por favor, seleciona um estilo ou escreve uma descrição personalizada.',
    errorTransform: 'Erro ao transformar. Tenta novamente.',
    loadingMsg: 'A criar a tua transformação...',
    styles: {
      pixie: 'Pixie Cut',
      bob: 'Bob Clássico',
      waves: 'Ondas Suaves',
      straight: 'Liso Sedoso',
      curls: 'Caracóis',
      long: 'Comprido',
    },
    colors: {
      platinum: 'Loiro Platinado',
      golden: 'Loiro Dourado',
      auburn: 'Ruivo Cobre',
      brunette: 'Castanho',
      black: 'Preto Intenso',
      rose: 'Rosa Pastel',
      violet: 'Violeta',
      silver: 'Prata',
    },
    footer: '✦ Anjos Urbanos Virtual · Powered by Google Gemini AI ✦',
    lang: 'pt',
  },

  en: {
    studioVirtual: 'Virtual Studio',
    poweredBy: 'Powered by',
    heroTitle: 'Your New Look',
    heroSubtitle: 'Try hairstyles and hair colours with artificial intelligence before going to the salon',
    uploadPhoto: 'Upload Photo',
    uploadFormats: 'JPG, PNG, WEBP',
    takeSelfie: 'Take Selfie',
    cameraLive: 'Live camera',
    officialPartner: 'Official Partner',
    cameraError: 'Could not access the camera. Please check your browser permissions.',
    faceGuide: 'Position your face inside the oval guide for best results',
    takePhoto: '📸 Take Photo',
    cancel: 'Cancel',
    switchCamera: 'Switch Camera',
    frontCamera: 'Front Camera',
    backCamera: 'Back Camera',
    originalPhoto: 'Original Photo',
    original: 'Original',
    result: 'Result',
    chooseStyle: 'Choose Style',
    chooseColor: 'Choose Colour',
    customDesc: 'Custom Description (optional)',
    customPlaceholder: 'E.g.: Layered cut with side fringe, copper brown colour...',
    beforeAfter: 'Before / After — Drag to compare',
    transformAppear: 'Your transformation will appear here',
    selectStyleHint: 'Select a style and click Transform',
    before: 'BEFORE',
    after: 'AFTER',
    transforming: '⟳ Transforming...',
    transform: '✦ Transform',
    newPhoto: 'New Photo',
    saveImage: '⬇ Save Image',
    newResult: 'New',
    errorNoStyle: 'Please select a style or write a custom description.',
    errorTransform: 'Error transforming. Please try again.',
    loadingMsg: 'Creating your transformation...',
    styles: {
      pixie: 'Pixie Cut',
      bob: 'Classic Bob',
      waves: 'Soft Waves',
      straight: 'Silky Straight',
      curls: 'Curls',
      long: 'Long',
    },
    colors: {
      platinum: 'Platinum Blonde',
      golden: 'Golden Blonde',
      auburn: 'Copper Auburn',
      brunette: 'Brunette',
      black: 'Intense Black',
      rose: 'Pastel Pink',
      violet: 'Violet',
      silver: 'Silver',
    },
    footer: '✦ Anjos Urbanos Virtual · Powered by Google Gemini AI ✦',
    lang: 'en',
  },
};
