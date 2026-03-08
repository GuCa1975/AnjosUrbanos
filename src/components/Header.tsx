import React from 'react';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        background: 'linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(10,10,10,0.9) 100%)',
        borderBottom: '1px solid rgba(57, 255, 20, 0.2)',
        padding: '20px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1DB800, #39FF14)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
        }}>
          ✦
        </div>
        <div>
          <h1 style={{
            fontFamily: 'Barlow, sans-serif',
            fontSize: '22px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #1DB800, #39FF14, #7FFF5A)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '1px',
          }}>
            Anjos Urbanos
          </h1>
          <p style={{
            fontSize: '11px',
            color: '#888888',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            marginTop: '2px',
          }}>
            Estúdio Virtual
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{
          fontSize: '11px',
          color: '#888888',
          letterSpacing: '2px',
          textTransform: 'uppercase',
        }}>
          Powered by
        </div>
        <div style={{
          fontSize: '12px',
          color: '#39FF14',
          fontWeight: '600',
          letterSpacing: '1px',
        }}>
          Gemini AI
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
