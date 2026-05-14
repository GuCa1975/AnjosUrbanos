import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../LangContext';
import type { Lang } from '../i18n';

const LANG_OPTIONS: { code: Lang; label: string; flag: string }[] = [
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'it', label: 'Italiano',  flag: '🇮🇹' },
  { code: 'es', label: 'Español',   flag: '🇪🇸' },
  { code: 'bs', label: 'Bosanski',  flag: '🇧🇦' },
  { code: 'en', label: 'English',   flag: '🇬🇧' },
];

const Header: React.FC = () => {
  const { lang, t, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const current = LANG_OPTIONS.find(o => o.code === lang) ?? LANG_OPTIONS[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        background: 'linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(10,10,10,0.9) 100%)',
        borderBottom: '1px solid rgba(57, 255, 20, 0.2)',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1DB800, #39FF14)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          flexShrink: 0,
        }}>
          ✦
        </div>
        <div>
          <h1 style={{
            fontFamily: 'Barlow, sans-serif',
            fontSize: 'clamp(16px, 4vw, 22px)',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #1DB800, #39FF14, #7FFF5A)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '2px',
          }}>
            Anjos Urbanos
            <sup style={{
              fontSize: '0.5em',
              lineHeight: 1,
              marginTop: '3px',
              WebkitTextFillColor: '#39FF14',
              color: '#39FF14',
              fontWeight: '400',
            }}>®</sup>
          </h1>
          <p style={{
            fontSize: 'clamp(9px, 2vw, 11px)',
            color: '#888888',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginTop: '2px',
          }}>
            {t.studioVirtual}
          </p>
        </div>
      </div>

      {/* Direita: Powered by + Dropdown de idioma */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            fontSize: 'clamp(9px, 2vw, 11px)',
            color: '#888888',
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}>
            {t.poweredBy}
          </span>
          <span style={{
            fontSize: 'clamp(10px, 2.5vw, 12px)',
            color: '#39FF14',
            fontWeight: '600',
            letterSpacing: '1px',
          }}>
            Gemini AI
          </span>
        </div>

        {/* Dropdown de idioma */}
        <div ref={dropdownRef} style={{ position: 'relative', flexShrink: 0 }}>
          {/* Botão principal */}
          <button
            onClick={() => setOpen(prev => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              background: open ? 'rgba(57,255,20,0.1)' : 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(57,255,20,0.35)',
              borderRadius: '20px',
              cursor: 'pointer',
              color: '#39FF14',
              fontFamily: 'Barlow, sans-serif',
              fontSize: '11px',
              fontWeight: '700',
              letterSpacing: '0.5px',
              touchAction: 'manipulation',
              transition: 'background 0.2s',
              minWidth: '80px',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontSize: '14px' }}>{current.flag}</span>
              <span style={{ textTransform: 'uppercase' }}>{current.code.toUpperCase()}</span>
            </span>
            <span style={{
              fontSize: '8px',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
              display: 'inline-block',
              marginLeft: '2px',
            }}>▼</span>
          </button>

          {/* Menu dropdown */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  right: 0,
                  background: '#111111',
                  border: '1px solid rgba(57,255,20,0.3)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  minWidth: '155px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.7), 0 0 16px rgba(57,255,20,0.08)',
                  zIndex: 200,
                }}
              >
                {LANG_OPTIONS.map((opt, idx) => (
                  <button
                    key={opt.code}
                    onClick={() => { setLang(opt.code); setOpen(false); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      width: '100%',
                      padding: '11px 16px',
                      background: lang === opt.code ? 'rgba(57,255,20,0.12)' : 'transparent',
                      border: 'none',
                      borderBottom: idx < LANG_OPTIONS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                      cursor: 'pointer',
                      color: lang === opt.code ? '#39FF14' : '#cccccc',
                      fontFamily: 'Barlow, sans-serif',
                      fontSize: '13px',
                      fontWeight: lang === opt.code ? '700' : '400',
                      textAlign: 'left',
                      touchAction: 'manipulation',
                      transition: 'background 0.15s',
                      boxSizing: 'border-box',
                    }}
                  >
                    <span style={{ fontSize: '16px', lineHeight: 1 }}>{opt.flag}</span>
                    <span style={{ flex: 1 }}>{opt.label}</span>
                    {lang === opt.code && (
                      <span style={{ color: '#39FF14', fontSize: '11px' }}>✓</span>
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
