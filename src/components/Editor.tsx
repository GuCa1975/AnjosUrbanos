import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { transformHairStyle } from '../services/geminiService';
import Spinner from './Spinner';

interface EditorProps {
  imageBase64: string;
  imageMimeType: string;
  onReset: () => void;
}

const HAIR_STYLES = [
  { id: 'pixie', label: 'Pixie Cut', icon: '✂️' },
  { id: 'bob', label: 'Bob Clássico', icon: '💇' },
  { id: 'waves', label: 'Ondas Suaves', icon: '🌊' },
  { id: 'straight', label: 'Liso Sedoso', icon: '✨' },
  { id: 'curls', label: 'Caracóis', icon: '🌀' },
  { id: 'long', label: 'Comprido', icon: '💫' },
];

const HAIR_COLORS = [
  { id: 'platinum', label: 'Loiro Platinado', color: '#F5F0DC' },
  { id: 'golden', label: 'Loiro Dourado', color: '#D4A843' },
  { id: 'auburn', label: 'Ruivo Cobre', color: '#8B3A1A' },
  { id: 'brunette', label: 'Castanho', color: '#4A2C0A' },
  { id: 'black', label: 'Preto Intenso', color: '#1A1A1A' },
  { id: 'rose', label: 'Rosa Pastel', color: '#E8A0B4' },
  { id: 'violet', label: 'Violeta', color: '#6B3FA0' },
  { id: 'silver', label: 'Prata', color: '#A8A8A8' },
];

const Editor: React.FC<EditorProps> = ({ imageBase64, imageMimeType, onReset }) => {
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleTransform = async () => {
    if (!selectedStyle && !customPrompt) {
      setError('Por favor, seleciona um estilo ou escreve uma descrição personalizada.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const selectedStyleLabel = HAIR_STYLES.find(s => s.id === selectedStyle)?.label || '';
      const selectedColorLabel = HAIR_COLORS.find(c => c.id === selectedColor)?.label || '';
      const result = await transformHairStyle({
        imageBase64,
        imageMimeType,
        style: selectedStyleLabel,
        color: selectedColorLabel,
        customPrompt: customPrompt || undefined,
      });
      setTransformedImage(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao transformar. Tenta novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSliderPosition = useCallback((clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const pos = ((clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(pos, 0), 100));
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (e.buttons === 1) updateSliderPosition(e.clientX);
  }, [updateSliderPosition]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    updateSliderPosition(e.touches[0].clientX);
  }, [updateSliderPosition]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    updateSliderPosition(e.touches[0].clientX);
  }, [updateSliderPosition]);

  const downloadImage = async () => {
    if (!transformedImage) return;
    const dataUrl = `data:image/jpeg;base64,${transformedImage}`;

    // iOS Safari: usar Web Share API se disponível (melhor experiência)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS && navigator.share) {
      try {
        // Converter base64 para Blob para partilhar
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const file = new File([blob], 'anjos-urbanos-transformacao.jpg', { type: 'image/jpeg' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'Anjos Urbanos Virtual',
            text: 'A minha transformação de cabelo',
          });
          return;
        }
      } catch (err) {
        // Se falhar, continuar para o fallback
      }
    }

    // iOS Safari fallback: abrir imagem numa nova aba (utilizador guarda manualmente)
    if (isIOS) {
      const newTab = window.open();
      if (newTab) {
        newTab.document.write(`
          <html><head><title>Guardar Imagem</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>body{margin:0;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:sans-serif;color:#fff;gap:16px;padding:16px;box-sizing:border-box}
          img{max-width:100%;border-radius:12px} p{font-size:14px;text-align:center;color:#aaa}</style></head>
          <body><img src="${dataUrl}" />
          <p>Pressiona e mantém a imagem para guardar na galeria</p></body></html>
        `);
        newTab.document.close();
      }
      return;
    }

    // Android e Desktop: método padrão com link
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'anjos-urbanos-transformacao.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const BeforeAfterSlider = () => (
    <div
      ref={sliderRef}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      style={{
        position: 'relative',
        borderRadius: '8px',
        overflow: 'hidden',
        cursor: 'ew-resize',
        userSelect: 'none',
        touchAction: 'none',
      }}
    >
      <img
        src={`data:image/jpeg;base64,${transformedImage}`}
        alt="Depois"
        style={{ width: '100%', display: 'block' }}
      />
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: `${sliderPosition}%`,
        height: '100%',
        overflow: 'hidden',
      }}>
        <img
          src={`data:${imageMimeType};base64,${imageBase64}`}
          alt="Antes"
          style={{ width: `${100 / (sliderPosition / 100)}%`, maxWidth: 'none', display: 'block' }}
        />
      </div>
      <div style={{
        position: 'absolute',
        top: 0,
        left: `${sliderPosition}%`,
        transform: 'translateX(-50%)',
        width: '3px',
        height: '100%',
        background: '#39FF14',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: '#39FF14',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#000',
          fontSize: '16px',
          fontWeight: 'bold',
          boxShadow: '0 2px 12px rgba(57,255,20,0.5)',
        }}>↔</div>
      </div>
      <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(0,0,0,0.75)', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', color: '#fff', letterSpacing: '1px' }}>
        ANTES
      </div>
      <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(57,255,20,0.85)', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', color: '#000', letterSpacing: '1px', fontWeight: 'bold' }}>
        DEPOIS
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        .editor-wrapper {
          max-width: 960px;
          margin: 0 auto;
          padding: 12px;
        }
        .editor-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        @media (min-width: 768px) {
          .editor-wrapper {
            padding: 20px;
          }
          .editor-grid {
            grid-template-columns: 1fr 1fr;
            gap: 24px;
          }
          .result-desktop {
            display: block;
          }
          .result-mobile {
            display: none !important;
          }
          .preview-mobile {
            display: none !important;
          }
          .preview-desktop {
            display: block;
          }
        }
        @media (max-width: 767px) {
          .result-desktop {
            display: none !important;
          }
          .result-mobile {
            display: block;
          }
          .preview-mobile {
            display: grid;
          }
          .preview-desktop {
            display: none !important;
          }
        }
        .style-btn {
          padding: 12px 8px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
          touch-action: manipulation;
          min-height: 48px;
          font-family: Inter, sans-serif;
          width: 100%;
        }
        .color-btn {
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s;
          touch-action: manipulation;
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          border: 2px solid rgba(255,255,255,0.15);
        }
        @media (min-width: 768px) {
          .color-btn {
            width: 36px;
            height: 36px;
          }
        }
        .glass-inner {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(57, 255, 20, 0.15);
          border-radius: 12px;
          padding: 14px;
        }
        .section-label {
          font-size: 10px;
          color: #888888;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="editor-wrapper"
      >
        <div className="editor-grid">

          {/* COLUNA ESQUERDA: Controlos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

            {/* Foto original — desktop */}
            <div className="glass-inner preview-desktop">
              <p className="section-label">Foto Original</p>
              <img
                src={`data:${imageMimeType};base64,${imageBase64}`}
                alt="Original"
                style={{ width: '100%', borderRadius: '8px', maxHeight: '200px', objectFit: 'cover' }}
              />
            </div>

            {/* Mobile: foto original + resultado em miniatura */}
            <div className="preview-mobile" style={{ gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div className="glass-inner">
                <p className="section-label">Original</p>
                <img
                  src={`data:${imageMimeType};base64,${imageBase64}`}
                  alt="Original"
                  style={{ width: '100%', borderRadius: '6px', maxHeight: '130px', objectFit: 'cover' }}
                />
              </div>
              <div className="glass-inner">
                <p className="section-label">Resultado</p>
                {isLoading ? (
                  <div style={{ height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#39FF14', fontSize: '28px' }}>
                    ⟳
                  </div>
                ) : transformedImage ? (
                  <img
                    src={`data:image/jpeg;base64,${transformedImage}`}
                    alt="Resultado"
                    style={{ width: '100%', borderRadius: '6px', maxHeight: '130px', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#39FF14', fontSize: '28px' }}>
                    ✦
                  </div>
                )}
              </div>
            </div>

            {/* Escolhe o Corte */}
            <div className="glass-inner">
              <p className="section-label">Escolhe o Corte</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                {HAIR_STYLES.map(style => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className="style-btn"
                    style={{
                      border: selectedStyle === style.id ? '1px solid #39FF14' : '1px solid rgba(57,255,20,0.15)',
                      background: selectedStyle === style.id ? 'rgba(57,255,20,0.12)' : 'transparent',
                      color: selectedStyle === style.id ? '#39FF14' : '#888888',
                    }}
                  >
                    {style.icon} {style.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Escolhe a Cor */}
            <div className="glass-inner">
              <p className="section-label">Escolhe a Cor</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {HAIR_COLORS.map(colorOption => (
                  <button
                    key={colorOption.id}
                    onClick={() => setSelectedColor(colorOption.id)}
                    title={colorOption.label}
                    className="color-btn"
                    style={{
                      background: colorOption.color,
                      border: selectedColor === colorOption.id ? '3px solid #39FF14' : '2px solid rgba(255,255,255,0.15)',
                      transform: selectedColor === colorOption.id ? 'scale(1.15)' : 'scale(1)',
                    }}
                  />
                ))}
              </div>
              {selectedColor && (
                <p style={{ fontSize: '12px', color: '#39FF14', marginTop: '8px' }}>
                  ✓ {HAIR_COLORS.find(c => c.id === selectedColor)?.label}
                </p>
              )}
            </div>

            {/* Descrição Personalizada */}
            <div className="glass-inner">
              <p className="section-label">Descrição Personalizada (opcional)</p>
              <textarea
                value={customPrompt}
                onChange={e => setCustomPrompt(e.target.value)}
                placeholder="Ex: Corte em camadas com franja lateral, cor castanho acobreado..."
                style={{
                  width: '100%',
                  minHeight: '72px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(57,255,20,0.15)',
                  borderRadius: '8px',
                  color: '#F5F5F5',
                  padding: '10px',
                  fontSize: '16px',
                  resize: 'vertical',
                  fontFamily: 'Inter, sans-serif',
                  outline: 'none',
                }}
              />
            </div>

            {error && (
              <div style={{
                padding: '12px',
                background: 'rgba(255,100,100,0.1)',
                border: '1px solid rgba(255,100,100,0.3)',
                borderRadius: '8px',
                color: '#FF8080',
                fontSize: '13px',
              }}>
                ⚠ {error}
              </div>
            )}

            {/* Botões de acção */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleTransform}
                disabled={isLoading}
                className="btn-gold"
                style={{ flex: 1, opacity: isLoading ? 0.7 : 1 }}
              >
                {isLoading ? '⟳ A transformar...' : '✦ Transformar'}
              </button>
              <button onClick={onReset} className="btn-ghost">
                Nova Foto
              </button>
            </div>
          </div>

          {/* COLUNA DIREITA: Resultado — só no desktop */}
          <div className="result-desktop">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-inner"
                  style={{ padding: '20px' }}
                >
                  <Spinner message="A criar a tua transformação..." />
                </motion.div>
              ) : transformedImage ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-inner"
                >
                  <p className="section-label">Antes / Depois — Arrasta para comparar</p>
                  <BeforeAfterSlider />
                  <div style={{ marginTop: '14px', display: 'flex', gap: '10px' }}>
                    <button onClick={downloadImage} className="btn-gold" style={{ flex: 1 }}>
                      ⬇ Guardar Imagem
                    </button>
                    <button onClick={() => setTransformedImage(null)} className="btn-ghost">
                      Nova
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-inner"
                  style={{
                    padding: '60px 40px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '16px',
                    textAlign: 'center',
                    minHeight: '400px',
                  }}
                >
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ fontSize: '48px' }}
                  >
                    ✦
                  </motion.div>
                  <p style={{ fontFamily: 'Barlow, sans-serif', fontSize: '20px', color: '#39FF14' }}>
                    A tua transformação aparecerá aqui
                  </p>
                  <p style={{ fontSize: '13px', color: '#888888' }}>
                    Seleciona um estilo e clica em Transformar
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* RESULTADO COMPLETO NO MOBILE — aparece abaixo dos controlos */}
        <div className="result-mobile">
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-inner"
              style={{ marginTop: '10px', padding: '20px' }}
            >
              <Spinner message="A criar a tua transformação..." />
            </motion.div>
          )}
          {!isLoading && transformedImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-inner"
              style={{ marginTop: '10px' }}
            >
              <p className="section-label">Antes / Depois — Arrasta para comparar</p>
              <BeforeAfterSlider />
              <div style={{ marginTop: '14px', display: 'flex', gap: '10px' }}>
                <button onClick={downloadImage} className="btn-gold" style={{ flex: 1 }}>
                  ⬇ Guardar Imagem
                </button>
                <button onClick={() => setTransformedImage(null)} className="btn-ghost">
                  Nova
                </button>
              </div>
            </motion.div>
          )}
        </div>

      </motion.div>
    </>
  );
};

export default Editor;
