import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { analyzeHairColor, type ColorAnalysisResult } from '../services/colorAnalysisService';
import ColorAnalysisResultView from './ColorAnalysisResult';

interface Props {
  onBack: () => void;
}

const ColorAnalysisScreen: React.FC<Props> = ({ onBack }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [photoMimeType, setPhotoMimeType] = useState<string>('image/jpeg');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ColorAnalysisResult | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      const base64 = dataUrl.split(',')[1];
      setPhotoBase64(base64);
      setPhotoMimeType(file.type);
      setPreviewUrl(dataUrl);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAnalyze = async () => {
    if (!photoBase64) return;
    setLoading(true);
    setError(null);
    try {
      const res = await analyzeHairColor(photoBase64, photoMimeType);
      setResult(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao analisar. Tenta novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPhotoBase64(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  };

  if (result && photoBase64) {
    return (
      <motion.div
        key="color-result"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <ColorAnalysisResultView
          result={result}
          photoBase64={photoBase64}
          photoMimeType={photoMimeType}
          onBack={handleReset}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      key="color-upload"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{ maxWidth: '480px', margin: '0 auto', padding: '16px' }}
    >
      {/* Botão voltar */}
      <button
        onClick={onBack}
        style={{
          background: 'transparent',
          border: '1px solid rgba(57,255,20,0.3)',
          borderRadius: '8px',
          color: '#39FF14',
          fontSize: '13px',
          padding: '8px 16px',
          cursor: 'pointer',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        ← Voltar
      </button>

      {/* Título */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎨</div>
        <h2 style={{ color: '#F5F5F5', fontSize: '20px', fontWeight: 700, letterSpacing: '1px', margin: '0 0 8px' }}>
          ANÁLISE DE COR DE CABELO
        </h2>
        <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>
          Descobre a cor ideal com o Método das 4 Estações
        </p>
      </div>

      {/* Zona de upload */}
      <div
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: photoBase64 ? '1px solid rgba(57,255,20,0.5)' : '1px dashed rgba(57,255,20,0.3)',
          borderRadius: '14px',
          padding: '24px',
          textAlign: 'center',
          cursor: 'pointer',
          marginBottom: '16px',
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        {previewUrl ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <img
              src={previewUrl}
              alt="Preview"
              style={{ width: '140px', height: '140px', objectFit: 'cover', borderRadius: '10px', border: '2px solid #39FF14' }}
            />
            <p style={{ color: '#39FF14', fontSize: '12px', margin: 0 }}>✓ Foto carregada — clica para trocar</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'rgba(57,255,20,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '28px',
            }}>📷</div>
            <div>
              <p style={{ color: '#F5F5F5', fontSize: '14px', margin: '0 0 4px', fontWeight: 600 }}>
                Carregar foto do cliente
              </p>
              <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>JPG, PNG ou WEBP · máx. 10MB</p>
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      {/* Erro */}
      {error && (
        <div style={{
          background: 'rgba(255,50,50,0.1)',
          border: '1px solid rgba(255,50,50,0.3)',
          borderRadius: '8px',
          padding: '10px 14px',
          color: '#ff6b6b',
          fontSize: '13px',
          marginBottom: '12px',
          textAlign: 'center',
        }}>
          {error}
        </div>
      )}

      {/* Botão analisar */}
      <button
        onClick={handleAnalyze}
        disabled={!photoBase64 || loading}
        style={{
          width: '100%',
          padding: '14px',
          background: photoBase64 && !loading ? '#C47A2B' : 'rgba(196,122,43,0.3)',
          border: 'none',
          borderRadius: '10px',
          color: '#fff',
          fontSize: '15px',
          fontWeight: 700,
          cursor: photoBase64 && !loading ? 'pointer' : 'not-allowed',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          transition: 'background 0.2s',
        }}
      >
        {loading ? (
          <>
            <span style={{display:'inline-block',width:'16px',height:'16px',border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 0.8s linear infinite'}} />
            A analisar...
          </>
        ) : (
          '🎨 Analisar Cor Ideal'
        )}
      </button>

      {loading && (
        <p style={{ textAlign: 'center', color: '#888', fontSize: '12px', marginTop: '12px' }}>
          A IA está a analisar as características da imagem... pode demorar até 30 segundos.
        </p>
      )}
    </motion.div>
  );
};

export default ColorAnalysisScreen;
