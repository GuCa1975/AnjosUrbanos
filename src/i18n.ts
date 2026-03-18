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
  // Selector labels
  selectStyle: string;
  selectColor: string;
  // Footer
  footer: string;
  // Idioma actual (para uso interno)
  lang: string;
}

// Cortes modernos — lista partilhada (nomes profissionais universais)
export const HAIR_STYLES_LIST = [
  // Curtos
  { id: 'buzz_cut', label: 'Buzz Cut' },
  { id: 'pixie_cut', label: 'Pixie Cut' },
  { id: 'pixie_textured', label: 'Pixie Texturizado' },
  { id: 'undercut', label: 'Undercut' },
  { id: 'wolf_cut_short', label: 'Wolf Cut Curto' },
  { id: 'french_crop', label: 'French Crop' },
  { id: 'bixie', label: 'Bixie Cut' },
  // Médios
  { id: 'bob_classic', label: 'Bob Clássico' },
  { id: 'bob_textured', label: 'Bob Texturizado' },
  { id: 'bob_asymmetric', label: 'Bob Assimétrico' },
  { id: 'lob', label: 'Lob (Long Bob)' },
  { id: 'shag', label: 'Shag Cut' },
  { id: 'wolf_cut', label: 'Wolf Cut' },
  { id: 'curtain_bangs', label: 'Curtain Bangs' },
  { id: 'butterfly_cut', label: 'Butterfly Cut' },
  { id: 'layers_medium', label: 'Camadas Médias' },
  // Compridos
  { id: 'long_layers', label: 'Comprido em Camadas' },
  { id: 'long_straight', label: 'Comprido Liso' },
  { id: 'long_waves', label: 'Comprido Ondulado' },
  { id: 'long_curls', label: 'Comprido Encaracolado' },
  { id: 'mermaid', label: 'Mermaid Cut' },
  { id: 'u_cut', label: 'U-Cut' },
  { id: 'v_cut', label: 'V-Cut' },
  // Texturas
  { id: 'soft_waves', label: 'Ondas Suaves' },
  { id: 'beach_waves', label: 'Beach Waves' },
  { id: 'tight_curls', label: 'Caracóis Definidos' },
  { id: 'afro', label: 'Afro Natural' },
  { id: 'blowout', label: 'Blowout Volumoso' },
  { id: 'sleek_straight', label: 'Liso Sedoso' },
  // Tendências 2025/26
  { id: 'octopus_cut', label: 'Octopus Cut' },
  { id: 'jellyfish_cut', label: 'Jellyfish Cut' },
  { id: 'mullet_modern', label: 'Mullet Moderno' },
  { id: 'rachel_cut', label: 'Rachel Cut' },
  { id: 'italian_bob', label: 'Italian Bob' },
  { id: 'blunt_bob', label: 'Blunt Bob' },
  { id: 'micro_fringe', label: 'Micro Fringe' },
  { id: 'side_swept_bangs', label: 'Franja Lateral' },
];

// Numeração profissional de cores — sistema universal de colorimetria
export const HAIR_COLORS_LIST = [
  // Pretos e Castanhos Escuros
  { id: '1.0', label: '1.0 — Preto Natural', hex: '#0a0a0a' },
  { id: '1.1', label: '1.1 — Preto Azulado', hex: '#0d0d1a' },
  { id: '2.0', label: '2.0 — Castanho Muito Escuro', hex: '#1a0a00' },
  { id: '2.1', label: '2.1 — Castanho Escuro Acinzentado', hex: '#1a1a1a' },
  // Castanhos Médios
  { id: '3.0', label: '3.0 — Castanho Escuro', hex: '#2e1503' },
  { id: '3.4', label: '3.4 — Castanho Escuro Cobre', hex: '#3d1a00' },
  { id: '4.0', label: '4.0 — Castanho Médio', hex: '#4a2c0a' },
  { id: '4.3', label: '4.3 — Castanho Dourado', hex: '#5c3510' },
  { id: '4.4', label: '4.4 — Castanho Cobre', hex: '#6b2d00' },
  { id: '4.5', label: '4.5 — Castanho Mogno', hex: '#5c1a1a' },
  { id: '4.6', label: '4.6 — Castanho Vermelho', hex: '#6b1a1a' },
  { id: '4.8', label: '4.8 — Castanho Chocolate', hex: '#3d1f0d' },
  // Castanhos Claros
  { id: '5.0', label: '5.0 — Castanho Claro', hex: '#6b3d1a' },
  { id: '5.1', label: '5.1 — Castanho Claro Acinzentado', hex: '#5c4a3d' },
  { id: '5.3', label: '5.3 — Castanho Claro Dourado', hex: '#7a4a1a' },
  { id: '5.4', label: '5.4 — Castanho Claro Cobre', hex: '#8b3a0a' },
  { id: '5.5', label: '5.5 — Castanho Claro Mogno', hex: '#7a2020' },
  { id: '5.6', label: '5.6 — Castanho Claro Vermelho', hex: '#8b2020' },
  // Loiros Escuros
  { id: '6.0', label: '6.0 — Loiro Escuro', hex: '#8b6914' },
  { id: '6.1', label: '6.1 — Loiro Escuro Acinzentado', hex: '#7a6a5a' },
  { id: '6.3', label: '6.3 — Loiro Escuro Dourado', hex: '#9a7520' },
  { id: '6.4', label: '6.4 — Loiro Escuro Cobre', hex: '#a05010' },
  { id: '6.44', label: '6.44 — Loiro Escuro Cobre Intenso', hex: '#b54000' },
  { id: '6.5', label: '6.5 — Loiro Escuro Mogno', hex: '#8b3030' },
  { id: '6.6', label: '6.6 — Loiro Escuro Vermelho', hex: '#9a2020' },
  // Loiros Médios
  { id: '7.0', label: '7.0 — Loiro Médio', hex: '#b08a30' },
  { id: '7.1', label: '7.1 — Loiro Médio Acinzentado', hex: '#9a8a7a' },
  { id: '7.3', label: '7.3 — Loiro Dourado', hex: '#c09a30' },
  { id: '7.4', label: '7.4 — Loiro Cobre', hex: '#c07020' },
  { id: '7.43', label: '7.43 — Loiro Cobre Dourado', hex: '#c07820' },
  { id: '7.5', label: '7.5 — Loiro Mogno', hex: '#a04040' },
  { id: '7.6', label: '7.6 — Loiro Vermelho', hex: '#b03030' },
  // Loiros Claros
  { id: '8.0', label: '8.0 — Loiro Claro', hex: '#c8a840' },
  { id: '8.1', label: '8.1 — Loiro Claro Acinzentado', hex: '#b0a090' },
  { id: '8.3', label: '8.3 — Loiro Claro Dourado', hex: '#d4a843' },
  { id: '8.4', label: '8.4 — Loiro Claro Cobre', hex: '#d08030' },
  { id: '8.43', label: '8.43 — Loiro Claro Cobre Dourado', hex: '#d49030' },
  // Loiros Muito Claros
  { id: '9.0', label: '9.0 — Loiro Muito Claro', hex: '#e0c060' },
  { id: '9.1', label: '9.1 — Loiro Muito Claro Acinzentado', hex: '#d0c0b0' },
  { id: '9.3', label: '9.3 — Loiro Muito Claro Dourado', hex: '#e8c840' },
  // Loiro Platinado
  { id: '10.0', label: '10.0 — Loiro Platinado', hex: '#f0e0b0' },
  { id: '10.1', label: '10.1 — Loiro Platinado Acinzentado', hex: '#e8e0d0' },
  { id: '10.2', label: '10.2 — Loiro Platinado Irisado', hex: '#f0e8e0' },
  // Especiais
  { id: 'silver', label: 'Cinzento / Prata', hex: '#a8a8a8' },
  { id: 'white', label: 'Branco Natural', hex: '#f5f0e8' },
  { id: 'rose_gold', label: 'Rose Gold', hex: '#e8a0a0' },
  { id: 'violet', label: 'Violeta / Roxo', hex: '#6b3fa0' },
  { id: 'blue', label: 'Azul Intenso', hex: '#1a3a8b' },
  { id: 'red_intense', label: 'Vermelho Intenso', hex: '#cc1a1a' },
];

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
    selectStyle: 'Seleciona um corte...',
    selectColor: 'Seleciona uma cor...',
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
    selectStyle: 'Select a style...',
    selectColor: 'Select a colour...',
    footer: '✦ Anjos Urbanos Virtual · Powered by Google Gemini AI ✦',
    lang: 'en',
  },
};
