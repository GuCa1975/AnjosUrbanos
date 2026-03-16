import React from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../LangContext';

const Header: React.FC = () => {
  const { lang, t, setLang } = useLang();

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

      {/* Direita: Powered by + Selector de idioma */}
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

        {/* Selector PT / EN */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(57,255,20,0.25)',
          borderRadius: '20px',
          overflow: 'hidden',
          flexShrink: 0,
        }}>
          {(['pt', 'en'] as const).map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              style={{
                padding: '5px 10px',
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '1px',
                cursor: 'pointer',
                border: 'none',
                background: lang === l ? 'rgba(57,255,20,0.2)' : 'transparent',
                color: lang === l ? '#39FF14' : '#666',
                transition: 'all 0.2s',
                touchAction: 'manipulation',
                textTransform: 'uppercase',
                fontFamily: 'Barlow, sans-serif',
              }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
