import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import CameraCapture from './components/CameraCapture';
import Editor from './components/Editor';
import ColorAnalysisScreen from './components/ColorAnalysisScreen';
import { useLang } from './LangContext';

type AppState = 'select' | 'camera-client' | 'edit' | 'color-analysis';

interface ImageData {
  base64: string;
  mimeType: string;
}

const App: React.FC = () => {
  const { t } = useLang();
  const [appState, setAppState] = useState<AppState>('select');
  const [clientImage, setClientImage] = useState<ImageData | null>(null);
  const [referenceImage, setReferenceImage] = useState<ImageData | null>(null);

  const refInputRef = React.useRef<HTMLInputElement>(null);
  const clientInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (d: ImageData) => void,
    next?: () => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      const base64 = result.split(',')[1];
      setter({ base64, mimeType: file.type });
      if (next) next();
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleClientCaptured = (base64: string, mimeType: string) => {
    setClientImage({ base64, mimeType });
    setAppState('edit');
  };

  const handleReset = () => {
    setClientImage(null);
    setReferenceImage(null);
    setAppState('select');
  };

  const goToEdit = (clientData: ImageData) => {
    setClientImage(clientData);
    setAppState('edit');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A' }}>
      <Header />
      <main style={{ padding: '8px 0' }}>
        <AnimatePresence mode="wait">

          {appState === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ maxWidth: '480px', margin: '0 auto', padding: '16px' }}
            >
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>✦</div>
                <h2 style={{ color: '#F5F5F5', fontSize: '22px', fontWeight: 700, letterSpacing: '1px', margin: '0 0 8px' }}>
                  {t.heroTitle.toUpperCase()}
                </h2>
                <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>
                  {t.heroSubtitle}
                </p>
              </div>

              {/* PASSO 1: Foto de referência (opcional) */}
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: referenceImage ? '1px solid rgba(57,255,20,0.5)' : '1px solid rgba(57,255,20,0.15)',
                borderRadius: '14px',
                padding: '16px',
                marginBottom: '12px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: referenceImage ? '#39FF14' : 'rgba(57,255,20,0.15)',
                    border: '2px solid rgba(57,255,20,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: referenceImage ? '#000' : '#39FF14', fontSize: '13px', fontWeight: 700, flexShrink: 0,
                  }}>1</div>
                  <div>
                    <p style={{ color: '#F5F5F5', fontSize: '14px', fontWeight: 600, margin: 0 }}>
                      {t.refPhotoTitle} <span style={{ color: '#888', fontWeight: 400, fontSize: '12px' }}>({t.refPhotoOptional})</span>
                    </p>
                    <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>
                      {t.refPhotoSubtitle}
                    </p>
                  </div>
                </div>

                {referenceImage ? (
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <img
                      src={`data:${referenceImage.mimeType};base64,${referenceImage.base64}`}
                      alt="Reference"
                      style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #39FF14' }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{ color: '#39FF14', fontSize: '13px', margin: '0 0 8px' }}>{t.refLoaded}</p>
                      <button
                        onClick={() => refInputRef.current?.click()}
                        style={{
                          background: 'transparent', border: '1px solid rgba(57,255,20,0.3)',
                          borderRadius: '8px', color: '#888', fontSize: '12px',
                          padding: '6px 12px', cursor: 'pointer',
                        }}
                      >{t.refChange}</button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => refInputRef.current?.click()}
                    style={{
                      width: '100%', padding: '14px',
                      background: 'rgba(57,255,20,0.05)',
                      border: '1px dashed rgba(57,255,20,0.3)',
                      borderRadius: '10px', color: '#39FF14',
                      fontSize: '14px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>🖼️</span>
                    {t.refUploadBtn}
                  </button>
                )}
                <input
                  ref={refInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileSelect(e, setReferenceImage)}
                />
              </div>

              {/* PASSO 2: Foto da cliente */}
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(57,255,20,0.15)',
                borderRadius: '14px',
                padding: '16px',
                marginBottom: '20px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'rgba(57,255,20,0.15)',
                    border: '2px solid rgba(57,255,20,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#39FF14', fontSize: '13px', fontWeight: 700, flexShrink: 0,
                  }}>2</div>
                  <div>
                    <p style={{ color: '#F5F5F5', fontSize: '14px', fontWeight: 600, margin: 0 }}>
                      {t.clientPhotoTitle}
                    </p>
                    <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>
                      {t.clientPhotoSubtitle}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    onClick={() => setAppState('camera-client')}
                    style={{
                      padding: '16px 10px',
                      background: 'rgba(57,255,20,0.08)',
                      border: '1px solid rgba(57,255,20,0.3)',
                      borderRadius: '10px', color: '#39FF14',
                      fontSize: '13px', cursor: 'pointer',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                      fontWeight: 600,
                    }}
                  >
                    <span style={{ fontSize: '26px' }}>📸</span>
                    {t.takeSelfie}
                    <span style={{ fontSize: '11px', color: '#888', fontWeight: 400 }}>{t.cameraLive}</span>
                  </button>

                  <button
                    onClick={() => clientInputRef.current?.click()}
                    style={{
                      padding: '16px 10px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px', color: '#ccc',
                      fontSize: '13px', cursor: 'pointer',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                      fontWeight: 600,
                    }}
                  >
                    <span style={{ fontSize: '26px' }}>🖼️</span>
                    {t.uploadPhoto}
                    <span style={{ fontSize: '11px', color: '#888', fontWeight: 400 }}>{t.uploadFormats}</span>
                  </button>
                </div>
                <input
                  ref={clientInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileSelect(e, (d) => goToEdit(d))}
                />
              </div>

              {/* Análise de Cor de Cabelo */}
              <div style={{
                background: 'rgba(196,122,43,0.06)',
                border: '1px solid rgba(196,122,43,0.25)',
                borderRadius: '14px',
                padding: '16px',
                marginBottom: '12px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'rgba(196,122,43,0.15)',
                    border: '2px solid rgba(196,122,43,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '14px', flexShrink: 0,
                  }}>🎨</div>
                  <div>
                    <p style={{ color: '#F5F5F5', fontSize: '14px', fontWeight: 600, margin: 0 }}>
                      {t.colorAnalysisTitle}
                    </p>
                    <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>
                      {t.colorAnalysisSubtitle}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setAppState('color-analysis')}
                  style={{
                    width: '100%', padding: '12px',
                    background: 'rgba(196,122,43,0.12)',
                    border: '1px solid rgba(196,122,43,0.4)',
                    borderRadius: '10px', color: '#C47A2B',
                    fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                    textTransform: 'uppercase', letterSpacing: '0.5px',
                  }}
                >
                  {t.colorAnalysisBtn}
                </button>
              </div>

              {/* Parceiro Oficial */}
              <div style={{ textAlign: 'center', marginTop: '8px' }}>
                <p style={{ fontSize: '11px', color: '#888888', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
                  {t.officialPartner}
                </p>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 24px',
                  border: '1px solid rgba(57, 255, 20, 0.2)',
                  borderRadius: '8px',
                  background: 'rgba(57, 255, 20, 0.05)',
                }}>
                  <span style={{ fontSize: '16px' }}>💎</span>
                  <span style={{ color: '#39FF14', fontSize: '14px', fontWeight: '600', letterSpacing: '1px' }}>
                    Alfaparf Milano
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {appState === 'camera-client' && (
            <CameraCapture
              key="camera"
              onCapture={handleClientCaptured}
              onCancel={() => setAppState('select')}
            />
          )}

          {appState === 'edit' && clientImage && (
            <Editor
              key="editor"
              imageBase64={clientImage.base64}
              imageMimeType={clientImage.mimeType}
              onReset={handleReset}
            />
          )}

          {appState === 'color-analysis' && (
            <ColorAnalysisScreen
              key="color-analysis"
              onBack={() => setAppState('select')}
            />
          )}

        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
