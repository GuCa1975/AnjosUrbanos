import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { transformHairStyle } from '../services/geminiService';
import Spinner from './Spinner';
import { useLang } from '../LangContext';
import { HAIR_STYLES_LIST, HAIR_COLORS_LIST } from '../i18n';

interface EditorProps {
  imageBase64: string;
  imageMimeType: string;
  onReset: () => void;
}

// Componente selector com lista scrollável (estilo da imagem de referência)
interface ListSelectorProps {
  items: { id: string; label: string; hex?: string }[];
  selectedId: string;
  onSelect: (id: string) => void;
  placeholder: string;
  showSwatch?: boolean;
}

const ListSelector: React.FC<ListSelectorProps> = ({ items, selectedId, onSelect, placeholder, showSwatch }) => {
  return (
    <div style={{
      position: 'relative',
      border: '1px solid rgba(57,255,20,0.25)',
      borderRadius: '10px',
      overflow: 'hidden',
      background: 'rgba(255,255,255,0.02)',
    }}>
      {/* Lista scrollável */}
      <div style={{
        maxHeight: '200px',
        overflowY: 'auto',
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(57,255,20,0.4) transparent',
      }}>
        {items.map((item, index) => {
          const isSelected = selectedId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              style={{
                width: '100%',
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: isSelected
                  ? 'rgba(57,255,20,0.15)'
                  : index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                border: 'none',
                borderBottom: index < items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                borderLeft: isSelected ? '3px solid #39FF14' : '3px solid transparent',
                color: isSelected ? '#39FF14' : '#cccccc',
                fontSize: '13px',
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s',
                touchAction: 'manipulation',
                minHeight: '40px',
              }}
            >
              {showSwatch && item.hex && (
                <span style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: item.hex,
                  border: isSelected ? '2px solid #39FF14' : '1px solid rgba(255,255,255,0.2)',
                  flexShrink: 0,
                  display: 'inline-block',
                }} />
              )}
              <span style={{ flex: 1 }}>{item.label}</span>
              {isSelected && (
                <span style={{ color: '#39FF14', fontSize: '14px', flexShrink: 0 }}>✓</span>
              )}
            </button>
          );
        })}
      </div>
      {/* Indicador de item seleccionado — barra fixa no fundo */}
      {selectedId && (
        <div style={{
          padding: '8px 12px',
          background: 'rgba(57,255,20,0.08)',
          borderTop: '1px solid rgba(57,255,20,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          {showSwatch && (() => {
            const item = items.find(i => i.id === selectedId);
            return item?.hex ? (
              <span style={{
                width: '14px', height: '14px', borderRadius: '50%',
                background: item.hex, border: '1px solid rgba(255,255,255,0.3)',
                flexShrink: 0, display: 'inline-block',
              }} />
            ) : null;
          })()}
          <span style={{ fontSize: '12px', color: '#39FF14', fontWeight: 600 }}>
            {items.find(i => i.id === selectedId)?.label || placeholder}
          </span>
        </div>
      )}
    </div>
  );
};

const Editor: React.FC<EditorProps> = ({ imageBase64, imageMimeType, onReset }) => {
  const { t } = useLang();

  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleTransform = async () => {
    if (!selectedStyle && !customPrompt) {
      setError(t.errorNoStyle);
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const selectedStyleLabel = HAIR_STYLES_LIST.find(s => s.id === selectedStyle)?.label || '';
      const selectedColorItem = HAIR_COLORS_LIST.find(c => c.id === selectedColor);
      const selectedColorLabel = selectedColorItem ? selectedColorItem.label : '';

      const result = await transformHairStyle({
        imageBase64,
        imageMimeType,
        style: selectedStyleLabel,
        color: selectedColorLabel,
        customPrompt: customPrompt || undefined,
      });
      setTransformedImage(result);
      // Reportar geração bem-sucedida ao servidor (só conta quando a IA gera imagem)
      try {
        const userEmail = localStorage.getItem('au_user_email');
        if (userEmail) {
          await fetch('https://anjurbanos-ffjzt76b.manus.space/api/simulation/record', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_RECORD_TOKEN || ''}`,
            },
            body: JSON.stringify({ email: userEmail }),
          });
        }
      } catch (e) {
        console.warn('[Record] Falha ao registar geração:', e);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errorTransform);
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

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    updateSliderPosition(e.clientX);
  }, [updateSliderPosition]);
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    updateSliderPosition(e.clientX);
  }, [updateSliderPosition]);
  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);
  const nudgeSlider = useCallback((direction: 'left' | 'right') => {
    setSliderPosition(prev => Math.min(Math.max(prev + (direction === 'right' ? 10 : -10), 0), 100));
  }, []);

  const downloadImage = async () => {
    if (!transformedImage) return;
    const dataUrl = `data:image/jpeg;base64,${transformedImage}`;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS && navigator.share) {
      try {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const file = new File([blob], 'anjos-urbanos-transformacao.jpg', { type: 'image/jpeg' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: 'Anjos Urbanos Virtual', text: 'A minha transformação de cabelo' });
          return;
        }
      } catch (_) { /* fallback */ }
    }
    if (isIOS) {
      const newTab = window.open();
      if (newTab) {
        newTab.document.write(`<html><head><title>Guardar Imagem</title><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{margin:0;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:sans-serif;color:#fff;gap:16px;padding:16px;box-sizing:border-box}img{max-width:100%;border-radius:12px}p{font-size:14px;text-align:center;color:#aaa}</style></head><body><img src="${dataUrl}" /><p>Pressiona e mantém a imagem para guardar na galeria</p></body></html>`);
        newTab.document.close();
      }
      return;
    }
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'anjos-urbanos-transformacao.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const BeforeAfterSlider = () => (
    <div>
      <div
        ref={sliderRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          position: 'relative', borderRadius: '8px', overflow: 'hidden',
          cursor: 'ew-resize', userSelect: 'none', touchAction: 'pan-y',
          WebkitUserSelect: 'none', WebkitTouchCallout: 'none',
        }}
      >
        <img src={`data:image/jpeg;base64,${transformedImage}`} alt="Depois" style={{ width: '100%', display: 'block' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, width: `${sliderPosition}%`, height: '100%', overflow: 'hidden' }}>
          <img src={`data:${imageMimeType};base64,${imageBase64}`} alt="Antes" style={{ width: `${100 / (sliderPosition / 100)}%`, maxWidth: 'none', display: 'block' }} />
        </div>
        <div style={{ position: 'absolute', top: 0, left: `${sliderPosition}%`, transform: 'translateX(-50%)', width: '3px', height: '100%', background: '#39FF14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#39FF14', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '22px', fontWeight: 'bold', boxShadow: '0 0 0 4px rgba(57,255,20,0.3), 0 2px 16px rgba(57,255,20,0.7)', border: '3px solid #fff', pointerEvents: 'none' }}>↔</div>
        </div>
        <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(0,0,0,0.75)', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', color: '#fff', letterSpacing: '1px' }}>{t.before}</div>
        <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(57,255,20,0.85)', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', color: '#000', letterSpacing: '1px', fontWeight: 'bold' }}>{t.after}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px' }}>
        <button onPointerDown={(e) => { e.preventDefault(); nudgeSlider('left'); }} style={{ minWidth: '52px', minHeight: '52px', padding: '0', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: '#fff', fontSize: '22px', cursor: 'pointer', touchAction: 'manipulation', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>◀</button>
        <div style={{ flex: 1, height: '20px', background: 'rgba(255,255,255,0.08)', borderRadius: '10px', position: 'relative', cursor: 'pointer', touchAction: 'manipulation' }}
          onPointerDown={(e) => { const rect = e.currentTarget.getBoundingClientRect(); const pos = ((e.clientX - rect.left) / rect.width) * 100; setSliderPosition(Math.min(Math.max(pos, 0), 100)); }}>
          <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${sliderPosition}%`, background: 'linear-gradient(90deg, rgba(57,255,20,0.3), rgba(57,255,20,0.6))', borderRadius: '10px' }} />
          <div style={{ position: 'absolute', top: '50%', left: `${sliderPosition}%`, transform: 'translate(-50%, -50%)', width: '24px', height: '24px', borderRadius: '50%', background: '#39FF14', border: '2px solid #fff', boxShadow: '0 0 8px rgba(57,255,20,0.6)' }} />
        </div>
        <button onPointerDown={(e) => { e.preventDefault(); nudgeSlider('right'); }} style={{ minWidth: '52px', minHeight: '52px', padding: '0', background: 'rgba(57,255,20,0.15)', border: '1px solid rgba(57,255,20,0.4)', borderRadius: '10px', color: '#39FF14', fontSize: '22px', cursor: 'pointer', touchAction: 'manipulation', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>▶</button>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        .editor-wrapper { max-width: 960px; margin: 0 auto; padding: 12px; }
        .editor-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
        @media (min-width: 768px) {
          .editor-wrapper { padding: 20px; }
          .editor-grid { grid-template-columns: 1fr 1fr; gap: 24px; }
          .result-desktop { display: block; }
          .result-mobile { display: none !important; }
          .preview-mobile { display: none !important; }
          .preview-desktop { display: block; }
        }
        @media (max-width: 767px) {
          .result-desktop { display: none !important; }
          .result-mobile { display: block; }
          .preview-mobile { display: grid; }
          .preview-desktop { display: none !important; }
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
        /* Scrollbar styling para webkit */
        .list-scroll::-webkit-scrollbar { width: 4px; }
        .list-scroll::-webkit-scrollbar-track { background: transparent; }
        .list-scroll::-webkit-scrollbar-thumb { background: rgba(57,255,20,0.4); border-radius: 2px; }
      `}</style>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="editor-wrapper">
        <div className="editor-grid">

          {/* COLUNA ESQUERDA: Controlos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

            {/* Foto original — desktop */}
            <div className="glass-inner preview-desktop">
              <p className="section-label">{t.originalPhoto}</p>
              <img src={`data:${imageMimeType};base64,${imageBase64}`} alt="Original" style={{ width: '100%', borderRadius: '8px', maxHeight: '200px', objectFit: 'cover' }} />
            </div>

            {/* Mobile: foto original + resultado em miniatura */}
            <div className="preview-mobile" style={{ gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div className="glass-inner">
                <p className="section-label">{t.original}</p>
                <img src={`data:${imageMimeType};base64,${imageBase64}`} alt="Original" style={{ width: '100%', borderRadius: '6px', maxHeight: '130px', objectFit: 'cover' }} />
              </div>
              <div className="glass-inner">
                <p className="section-label">{t.result}</p>
                {isLoading ? (
                  <div style={{ height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#39FF14', fontSize: '28px' }}>⟳</div>
                ) : transformedImage ? (
                  <img src={`data:image/jpeg;base64,${transformedImage}`} alt="Resultado" style={{ width: '100%', borderRadius: '6px', maxHeight: '130px', objectFit: 'cover' }} />
                ) : (
                  <div style={{ height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#39FF14', fontSize: '28px' }}>✦</div>
                )}
              </div>
            </div>

            {/* Selector de Corte — lista scrollável */}
            <div className="glass-inner">
              <p className="section-label">{t.chooseStyle}</p>
              <ListSelector
                items={HAIR_STYLES_LIST}
                selectedId={selectedStyle}
                onSelect={setSelectedStyle}
                placeholder={t.selectStyle}
                showSwatch={false}
              />
            </div>

            {/* Selector de Cor — lista scrollável com swatches */}
            <div className="glass-inner">
              <p className="section-label">{t.chooseColor}</p>
              <ListSelector
                items={HAIR_COLORS_LIST}
                selectedId={selectedColor}
                onSelect={setSelectedColor}
                placeholder={t.selectColor}
                showSwatch={true}
              />
            </div>

            {/* Descrição Personalizada */}
            <div className="glass-inner">
              <p className="section-label">{t.customDesc}</p>
              <textarea
                value={customPrompt}
                onChange={e => setCustomPrompt(e.target.value)}
                placeholder={t.customPlaceholder}
                style={{
                  width: '100%', minHeight: '72px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(57,255,20,0.15)',
                  borderRadius: '8px', color: '#F5F5F5',
                  padding: '10px', fontSize: '16px',
                  resize: 'vertical', fontFamily: 'Inter, sans-serif', outline: 'none',
                }}
              />
            </div>

            {error && (
              <div style={{ padding: '12px', background: 'rgba(255,100,100,0.1)', border: '1px solid rgba(255,100,100,0.3)', borderRadius: '8px', color: '#FF8080', fontSize: '13px' }}>
                ⚠ {error}
              </div>
            )}

            {/* Botões de acção */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleTransform} disabled={isLoading} className="btn-gold" style={{ flex: 1, opacity: isLoading ? 0.7 : 1 }}>
                {isLoading ? t.transforming : t.transform}
              </button>
              <button onClick={onReset} className="btn-ghost">{t.newPhoto}</button>
            </div>
          </div>

          {/* COLUNA DIREITA: Resultado — só no desktop */}
          <div className="result-desktop">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-inner" style={{ padding: '20px' }}>
                  <Spinner message={t.loadingMsg} />
                </motion.div>
              ) : transformedImage ? (
                <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-inner">
                  <p className="section-label">{t.beforeAfter}</p>
                  <BeforeAfterSlider />
                  <div style={{ marginTop: '14px', display: 'flex', gap: '10px' }}>
                    <button onClick={downloadImage} className="btn-gold" style={{ flex: 1 }}>{t.saveImage}</button>
                    <button onClick={() => setTransformedImage(null)} className="btn-ghost">{t.newResult}</button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-inner" style={{ padding: '60px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', textAlign: 'center', minHeight: '400px' }}>
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} style={{ fontSize: '48px' }}>✦</motion.div>
                  <p style={{ fontFamily: 'Barlow, sans-serif', fontSize: '20px', color: '#39FF14' }}>{t.transformAppear}</p>
                  <p style={{ fontSize: '13px', color: '#888888' }}>{t.selectStyleHint}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* RESULTADO COMPLETO NO MOBILE */}
        <div className="result-mobile">
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-inner" style={{ marginTop: '10px', padding: '20px' }}>
              <Spinner message={t.loadingMsg} />
            </motion.div>
          )}
          {!isLoading && transformedImage && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-inner" style={{ marginTop: '10px' }}>
              <p className="section-label">{t.beforeAfter}</p>
              <BeforeAfterSlider />
              <div style={{ marginTop: '14px', display: 'flex', gap: '10px' }}>
                <button onClick={downloadImage} className="btn-gold" style={{ flex: 1 }}>{t.saveImage}</button>
                <button onClick={() => setTransformedImage(null)} className="btn-ghost">{t.newResult}</button>
              </div>
            </motion.div>
          )}
        </div>

      </motion.div>
    </>
  );
};

export default Editor;
