export type Lang = 'pt' | 'it' | 'es' | 'bs' | 'en';

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
  // App.tsx — passos
  refPhotoTitle: string;
  refPhotoOptional: string;
  refPhotoSubtitle: string;
  refLoaded: string;
  refChange: string;
  refUploadBtn: string;
  clientPhotoTitle: string;
  clientPhotoSubtitle: string;
  colorAnalysisTitle: string;
  colorAnalysisSubtitle: string;
  colorAnalysisBtn: string;
  // ColorAnalysisScreen
  colorScreenTitle: string;
  colorScreenSubtitle: string;
  colorTakeSelfie: string;
  colorUploadPhoto: string;
  colorFileHint: string;
  colorPhotoReady: string;
  colorPhotoConfirm: string;
  colorAnalyzeBtn: string;
  colorBackBtn: string;
  colorAnalyzing: string;
  colorAnalyzingSubtitle: string;
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
    refPhotoTitle: 'Foto de Referência',
    refPhotoOptional: 'opcional',
    refPhotoSubtitle: 'O estilo/cabelo que a cliente quer',
    refLoaded: '✓ Referência carregada',
    refChange: 'Trocar foto',
    refUploadBtn: 'Carregar foto de referência',
    clientPhotoTitle: 'Foto da Cliente',
    clientPhotoSubtitle: 'Tira foto ou carrega da galeria',
    colorAnalysisTitle: 'Análise de Cor de Cabelo',
    colorAnalysisSubtitle: 'Método das 4 Estações · IA por Gemini',
    colorAnalysisBtn: '🍂 Descobrir a Cor Ideal',
    colorScreenTitle: 'ANÁLISE DE COR DE CABELO',
    colorScreenSubtitle: 'Descobre a cor ideal com o Método das 4 Estações',
    colorTakeSelfie: 'Tirar Selfie',
    colorUploadPhoto: 'Carregar Foto',
    colorFileHint: 'JPG, PNG ou WEBP · máx. 10MB',
    colorPhotoReady: 'FOTO PRONTA',
    colorPhotoConfirm: 'Confirma a foto e clica em Analisar',
    colorAnalyzeBtn: '🎨 Analisar Cor Ideal',
    colorBackBtn: '← Tirar outra foto',
    colorAnalyzing: 'A analisar a cor ideal...',
    colorAnalyzingSubtitle: 'A IA está a estudar as características da imagem.\nPode demorar até 30 segundos.',
  },

  bs: {
    studioVirtual: 'Virtualni Studio',
    poweredBy: 'Pokrenuto od',
    heroTitle: 'Tvoj Novi Izgled',
    heroSubtitle: 'Isprobaj frizure i boje kose s umjetnom inteligencijom prije odlaska u salon',
    uploadPhoto: 'Učitaj Fotografiju',
    uploadFormats: 'JPG, PNG, WEBP',
    takeSelfie: 'Uslikaj Selfie',
    cameraLive: 'Kamera uživo',
    officialPartner: 'Službeni Partner',
    cameraError: 'Nije moguće pristupiti kameri. Provjeri dozvole preglednika.',
    faceGuide: 'Postavi lice unutar ovalnog vodiča za najbolje rezultate',
    takePhoto: '📸 Uslikaj',
    cancel: 'Otkaži',
    switchCamera: 'Promijeni Kameru',
    frontCamera: 'Prednja Kamera',
    backCamera: 'Stražnja Kamera',
    originalPhoto: 'Originalna Fotografija',
    original: 'Original',
    result: 'Rezultat',
    chooseStyle: 'Odaberi Stil',
    chooseColor: 'Odaberi Boju',
    customDesc: 'Prilagođeni Opis (opcionalno)',
    customPlaceholder: 'Npr.: Slojevito šišanje s bočnom šiškicom, bakreno smeđa boja...',
    beforeAfter: 'Prije / Poslije — Povuci za usporedbu',
    transformAppear: 'Tvoja transformacija će se pojaviti ovdje',
    selectStyleHint: 'Odaberi stil i klikni Transformiraj',
    before: 'PRIJE',
    after: 'POSLIJE',
    transforming: '⟳ Transformiranje...',
    transform: '✦ Transformiraj',
    newPhoto: 'Nova Fotografija',
    saveImage: '⬇ Spremi Sliku',
    newResult: 'Novo',
    errorNoStyle: 'Molimo odaberi stil ili napiši prilagođeni opis.',
    errorTransform: 'Greška pri transformaciji. Pokušaj ponovo.',
    loadingMsg: 'Kreiranje tvoje transformacije...',
    selectStyle: 'Odaberi stil...',
    selectColor: 'Odaberi boju...',
    footer: '✦ Anjos Urbanos Virtual · Pokrenuto od Google Gemini AI ✦',
    lang: 'bs',
    refPhotoTitle: 'Referentna Fotografija',
    refPhotoOptional: 'opcionalno',
    refPhotoSubtitle: 'Stil/kosa koji klijent želi',
    refLoaded: '✓ Referenca učitana',
    refChange: 'Promijeni fotografiju',
    refUploadBtn: 'Učitaj referentnu fotografiju',
    clientPhotoTitle: 'Fotografija Klijenta',
    clientPhotoSubtitle: 'Uslikaj ili učitaj iz galerije',
    colorAnalysisTitle: 'Analiza Boje Kose',
    colorAnalysisSubtitle: 'Metoda 4 Godišnja Doba · AI od Gemini',
    colorAnalysisBtn: '🍂 Otkrij Idealnu Boju',
    colorScreenTitle: 'ANALIZA BOJE KOSE',
    colorScreenSubtitle: 'Otkrij idealnu boju Metodom 4 Godišnja Doba',
    colorTakeSelfie: 'Uslikaj Selfie',
    colorUploadPhoto: 'Učitaj Fotografiju',
    colorFileHint: 'JPG, PNG ili WEBP · maks. 10MB',
    colorPhotoReady: 'FOTOGRAFIJA SPREMNA',
    colorPhotoConfirm: 'Potvrdi fotografiju i klikni Analiziraj',
    colorAnalyzeBtn: '🎨 Analiziraj Idealnu Boju',
    colorBackBtn: '← Uslikaj drugu fotografiju',
    colorAnalyzing: 'Analiza idealne boje...',
    colorAnalyzingSubtitle: 'AI analizira karakteristike slike.\nMože potrajati do 30 sekundi.',
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
    refPhotoTitle: 'Reference Photo',
    refPhotoOptional: 'optional',
    refPhotoSubtitle: 'The style/hair the client wants',
    refLoaded: '✓ Reference loaded',
    refChange: 'Change photo',
    refUploadBtn: 'Upload reference photo',
    clientPhotoTitle: 'Client Photo',
    clientPhotoSubtitle: 'Take photo or upload from gallery',
    colorAnalysisTitle: 'Hair Colour Analysis',
    colorAnalysisSubtitle: '4 Seasons Method · AI by Gemini',
    colorAnalysisBtn: '🍂 Discover Ideal Colour',
    colorScreenTitle: 'HAIR COLOUR ANALYSIS',
    colorScreenSubtitle: 'Discover your ideal colour with the 4 Seasons Method',
    colorTakeSelfie: 'Take Selfie',
    colorUploadPhoto: 'Upload Photo',
    colorFileHint: 'JPG, PNG or WEBP · max. 10MB',
    colorPhotoReady: 'PHOTO READY',
    colorPhotoConfirm: 'Confirm the photo and click Analyse',
    colorAnalyzeBtn: '🎨 Analyse Ideal Colour',
    colorBackBtn: '← Take another photo',
    colorAnalyzing: 'Analysing ideal colour...',
    colorAnalyzingSubtitle: 'AI is studying the image characteristics.\nThis may take up to 30 seconds.',
  },
  it: {
    studioVirtual: 'Studio Virtuale',
    poweredBy: 'Powered by',
    heroTitle: 'Il Tuo Nuovo Look',
    heroSubtitle: 'Prova tagli e colori di capelli con intelligenza artificiale prima di andare dal parrucchiere',
    uploadPhoto: 'Carica Foto',
    uploadFormats: 'JPG, PNG, WEBP',
    takeSelfie: 'Scatta Selfie',
    cameraLive: 'Fotocamera live',
    officialPartner: 'Partner Ufficiale',
    cameraError: 'Impossibile accedere alla fotocamera. Controlla i permessi del browser.',
    faceGuide: 'Posiziona il viso nella guida ovale per risultati migliori',
    takePhoto: '📸 Scatta Foto',
    cancel: 'Annulla',
    switchCamera: 'Cambia Fotocamera',
    frontCamera: 'Fotocamera Frontale',
    backCamera: 'Fotocamera Posteriore',
    originalPhoto: 'Foto Originale',
    original: 'Originale',
    result: 'Risultato',
    chooseStyle: 'Scegli il Taglio',
    chooseColor: 'Scegli il Colore',
    customDesc: 'Descrizione Personalizzata (opzionale)',
    customPlaceholder: 'Es: Taglio scalato con frangia laterale, colore castano ramato...',
    beforeAfter: 'Prima / Dopo — Trascina per confrontare',
    transformAppear: 'La tua trasformazione apparirà qui',
    selectStyleHint: 'Seleziona uno stile e clicca Trasforma',
    before: 'PRIMA',
    after: 'DOPO',
    transforming: '⟳ Trasformazione...',
    transform: '✦ Trasforma',
    newPhoto: 'Nuova Foto',
    saveImage: '⬇ Salva Immagine',
    newResult: 'Nuovo',
    errorNoStyle: 'Seleziona uno stile o scrivi una descrizione personalizzata.',
    errorTransform: 'Errore nella trasformazione. Riprova.',
    loadingMsg: 'Creazione della tua trasformazione...',
    selectStyle: 'Seleziona un taglio...',
    selectColor: 'Seleziona un colore...',
    footer: '✦ Anjos Urbanos Virtual · Powered by Google Gemini AI ✦',
    lang: 'it',
    refPhotoTitle: 'Foto di Riferimento',
    refPhotoOptional: 'opzionale',
    refPhotoSubtitle: 'Lo stile/capelli che il cliente vuole',
    refLoaded: '✓ Riferimento caricato',
    refChange: 'Cambia foto',
    refUploadBtn: 'Carica foto di riferimento',
    clientPhotoTitle: 'Foto del Cliente',
    clientPhotoSubtitle: 'Scatta foto o carica dalla galleria',
    colorAnalysisTitle: 'Analisi del Colore dei Capelli',
    colorAnalysisSubtitle: 'Metodo delle 4 Stagioni · IA by Gemini',
    colorAnalysisBtn: '🍂 Scopri il Colore Ideale',
    colorScreenTitle: 'ANALISI DEL COLORE DEI CAPELLI',
    colorScreenSubtitle: 'Scopri il colore ideale con il Metodo delle 4 Stagioni',
    colorTakeSelfie: 'Scatta Selfie',
    colorUploadPhoto: 'Carica Foto',
    colorFileHint: 'JPG, PNG o WEBP · max. 10MB',
    colorPhotoReady: 'FOTO PRONTA',
    colorPhotoConfirm: 'Conferma la foto e clicca Analizza',
    colorAnalyzeBtn: '🎨 Analizza Colore Ideale',
    colorBackBtn: '← Scatta un\'altra foto',
    colorAnalyzing: 'Analisi del colore ideale...',
    colorAnalyzingSubtitle: 'L\'IA sta studiando le caratteristiche dell\'immagine.\nPotrebbe richiedere fino a 30 secondi.',
  },
  es: {
    studioVirtual: 'Estudio Virtual',
    poweredBy: 'Powered by',
    heroTitle: 'Tu Nuevo Look',
    heroSubtitle: 'Prueba cortes y colores de cabello con inteligencia artificial antes de ir al salón',
    uploadPhoto: 'Subir Foto',
    uploadFormats: 'JPG, PNG, WEBP',
    takeSelfie: 'Tomar Selfie',
    cameraLive: 'Cámara en vivo',
    officialPartner: 'Socio Oficial',
    cameraError: 'No se pudo acceder a la cámara. Comprueba los permisos del navegador.',
    faceGuide: 'Coloca tu rostro dentro de la guía oval para mejores resultados',
    takePhoto: '📸 Tomar Foto',
    cancel: 'Cancelar',
    switchCamera: 'Cambiar Cámara',
    frontCamera: 'Cámara Frontal',
    backCamera: 'Cámara Trasera',
    originalPhoto: 'Foto Original',
    original: 'Original',
    result: 'Resultado',
    chooseStyle: 'Elige el Corte',
    chooseColor: 'Elige el Color',
    customDesc: 'Descripción Personalizada (opcional)',
    customPlaceholder: 'Ej: Corte en capas con flequillo lateral, color castaño cobrizo...',
    beforeAfter: 'Antes / Después — Arrastra para comparar',
    transformAppear: 'Tu transformación aparecerá aquí',
    selectStyleHint: 'Selecciona un estilo y haz clic en Transformar',
    before: 'ANTES',
    after: 'DESPUÉS',
    transforming: '⟳ Transformando...',
    transform: '✦ Transformar',
    newPhoto: 'Nueva Foto',
    saveImage: '⬇ Guardar Imagen',
    newResult: 'Nueva',
    errorNoStyle: 'Por favor, selecciona un estilo o escribe una descripción personalizada.',
    errorTransform: 'Error al transformar. Inténtalo de nuevo.',
    loadingMsg: 'Creando tu transformación...',
    selectStyle: 'Selecciona un corte...',
    selectColor: 'Selecciona un color...',
    footer: '✦ Anjos Urbanos Virtual · Powered by Google Gemini AI ✦',
    lang: 'es',
    refPhotoTitle: 'Foto de Referencia',
    refPhotoOptional: 'opcional',
    refPhotoSubtitle: 'El estilo/cabello que el cliente quiere',
    refLoaded: '✓ Referencia cargada',
    refChange: 'Cambiar foto',
    refUploadBtn: 'Subir foto de referencia',
    clientPhotoTitle: 'Foto del Cliente',
    clientPhotoSubtitle: 'Toma foto o sube desde la galería',
    colorAnalysisTitle: 'Análisis de Color de Cabello',
    colorAnalysisSubtitle: 'Método de las 4 Estaciones · IA por Gemini',
    colorAnalysisBtn: '🍂 Descubrir el Color Ideal',
    colorScreenTitle: 'ANÁLISIS DE COLOR DE CABELLO',
    colorScreenSubtitle: 'Descubre el color ideal con el Método de las 4 Estaciones',
    colorTakeSelfie: 'Tomar Selfie',
    colorUploadPhoto: 'Subir Foto',
    colorFileHint: 'JPG, PNG o WEBP · máx. 10MB',
    colorPhotoReady: 'FOTO LISTA',
    colorPhotoConfirm: 'Confirma la foto y haz clic en Analizar',
    colorAnalyzeBtn: '🎨 Analizar Color Ideal',
    colorBackBtn: '← Tomar otra foto',
    colorAnalyzing: 'Analizando el color ideal...',
    colorAnalyzingSubtitle: 'La IA está estudiando las características de la imagen.\nPuede tardar hasta 30 segundos.',
  },
};
