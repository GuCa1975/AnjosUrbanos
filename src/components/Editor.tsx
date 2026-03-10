import React, { useState, useRef, useCallback, useEffect } from 'react';
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

// Hook para detectar se é mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
}

const Editor: React.FC<EditorProps> = ({ imageBase64, imageMimeType, onReset }) => {
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const handleTransform = async () => {
    if (!selectedStyle && !customPrompt) {
      setError('Por favor, seleciona um estilo ou escreve uma descrição personalizada.');
      return;
    }
    setError(null);
    setIsLoading(true);
    // Scroll para o resultado no mobile
    if (isMobile) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
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
    if (e.buttons === 1 || isDragging) {
      updateSliderPosition(e.clientX);
    }
  }, [isDragging, updateSliderPosition]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    updateSliderPosition(e.touches[0].clientX);
  }, [updateSliderPosition]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    updateSliderPosition(e.touches[0].clientX);
  }, [updateSliderPosition]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const downloadImage = () => {
    if (!transformedImage) return;
    const link = document.createElement('a');
    link.href = `data:image/jpeg;base64,${transformedImage}`;
    link.download = 'anjos-urbanos-transformacao.jpg';
    link.click();
  };

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(57, 255, 20, 0.15)',
    borderRadius: '12px',
    padding: '14px',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '10px',
    color: '#888888',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    marginBottom: '10px',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ maxWidth: '960px', margin: '0 auto', padding: isMobile ? '12px' : '20px' }}
    >
      {/* Layout: coluna única no mobile, 2 colunas no desktop */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? '12px' : '24px',
      }}>

        {/* Coluna Esquerda: Controlos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '10px' : '16px' }}>

          {/* Foto Original — só mostra no desktop */}
          {!isMobile && (
            <div style={cardStyle}>
              <p style={labelStyle}>Foto Original</p>
              <img
                src={`data:${imageMimeType};base64,${imageBase64}`}
                alt="Original"
                style={{ width: '100%', borderRadius: '8px', maxHeight: '200px', objectFit: 'cover' }}
              />
            </div>
          )}

          {/* No mobile: mostra foto original pequena + resultado lado a lado */}
          {isMobile && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div style={cardStyle}>
                <p style={labelStyle}>Original</p>
                <img
                  src={`data:${imageMimeType};base64,${imageBase64}`}
                  alt="Original"
                  style={{ width: '100%', borderRadius: '6px', maxHeight: '120px', objectFit: 'cover' }}
                />
              </div>
              <div style={cardStyle}>
                <p style={labelStyle}>Resultado</p>
                {isLoading ? (
                  <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: '24px', animation: 'spin 1s linear infinite' }}>⟳</div>
                  </div>
                ) : transformedImage ? (
                  <img
                    src={`data:image/jpeg;base64,${transformedImage}`}
                    alt="Resultado"
                    style={{ width: '100%', borderRadius: '6px', maxHeight: '120px', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#39FF14', fontSize: '24px' }}>
                    ✦
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Escolhe o Corte */}
          <div style={cardStyle}>
            <p style={labelStyle}>Escolhe o Corte</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {HAIR_STYLES.map(style => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  style={{
                    padding: isMobile ? '12px 8px' : '10px',
                    borderRadius: '8px',
                    border: selectedStyle === style.id ? '1px solid #39FF14' : '1px solid rgba(57,255,20,0.15)',
                    background: selectedStyle === style.id ? 'rgba(57,255,20,0.12)' : 'transparent',
                    color: selectedStyle === style.id ? '#39FF14' : '#888888',
                    cursor: 'pointer',
                    fontSize: isMobile ? '13px' : '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s',
                    touchAction: 'manipulation',
                    minHeight: '44px',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {style.icon} {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Escolhe a Cor */}
          <div style={cardStyle}>
            <p style={labelStyle}>Escolhe a Cor</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {HAIR_COLORS.map(colorOption => (
                <button
                  key={colorOption.id}
                  onClick={() => setSelectedColor(colorOption.id)}
                  title={colorOption.label}
                  style={{
                    width: isMobile ? '44px' : '36px',
                    height: isMobile ? '44px' : '36px',
                    borderRadius: '50%',
                    background: colorOption.color,
                    border: selectedColor === colorOption.id ? '3px solid #39FF14' : '2px solid rgba(255,255,255,0.15)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    transform: selectedColor === colorOption.id ? 'scale(1.15)' : 'scale(1)',
                    touchAction: 'manipulation',
                    flexShrink: 0,
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
          <div style={cardStyle}>
            <p style={labelStyle}>Descrição Personalizada (opcional)</p>
            <textarea
              value={customPrompt}
              onChange={e => setCustomPrompt(e.target.value)}
              placeholder="Ex: Corte em camadas com franja lateral, cor castanho acobreado..."
              style={{
                width: '100%',
                minHeight: isMobile ? '72px' : '80px',
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

        {/* Coluna Direita: Resultado (só no desktop) */}
        {!isMobile && (
          <div>
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ ...cardStyle, padding: '20px' }}
                >
                  <Spinner message="A criar a tua transformação..." />
                </motion.div>
              ) : transformedImage ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={cardStyle}
                >
                  <p style={labelStyle}>Antes / Depois — Arrasta para comparar</p>

                  {/* Before/After Slider */}
                  <div
                    ref={sliderRef}
                    onMouseMove={handleMouseMove}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
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
                    {/* Linha do slider */}
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
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: '#39FF14',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#000',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 12px rgba(57,255,20,0.5)',
                      }}>
                        ↔
                      </div>
                    </div>
                    <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(0,0,0,0.75)', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', color: '#fff', letterSpacing: '1px' }}>
                      ANTES
                    </div>
                    <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(57,255,20,0.85)', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', color: '#000', letterSpacing: '1px', fontWeight: 'bold' }}>
                      DEPOIS
                    </div>
                  </div>

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
                  style={{
                    ...cardStyle,
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
        )}

        {/* No mobile: resultado completo abaixo dos controlos */}
        {isMobile && transformedImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={cardStyle}
          >
            <p style={labelStyle}>Antes / Depois — Arrasta para comparar</p>

            {/* Before/After Slider mobile */}
            <div
              ref={sliderRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseMove={handleMouseMove}
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
              {/* Linha do slider */}
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
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: '#39FF14',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#000',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 12px rgba(57,255,20,0.5)',
                }}>
                  ↔
                </div>
              </div>
              <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(0,0,0,0.75)', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', color: '#fff', letterSpacing: '1px' }}>
                ANTES
              </div>
              <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(57,255,20,0.85)', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', color: '#000', letterSpacing: '1px', fontWeight: 'bold' }}>
                DEPOIS
              </div>
            </div>

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

        {/* No mobile: spinner durante loading */}
        {isMobile && isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ ...cardStyle, padding: '20px' }}
          >
            <Spinner message="A criar a tua transformação..." />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Editor;
