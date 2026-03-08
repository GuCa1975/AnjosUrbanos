import React from 'react';
import { motion } from 'framer-motion';

interface SpinnerProps {
  message?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ message = 'A transformar...' }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 40px',
        gap: '24px',
      }}
    >
      <div style={{ position: 'relative', width: '80px', height: '80px' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '2px solid transparent',
            borderTopColor: '#39FF14',
            borderRightColor: '#39FF14',
          }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: '10px',
            borderRadius: '50%',
            border: '2px solid transparent',
            borderBottomColor: '#1DB800',
            borderLeftColor: '#1DB800',
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
        }}>
          ✦
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <p style={{
          fontFamily: 'Barlow, sans-serif',
          fontSize: '18px',
          color: '#39FF14',
          marginBottom: '8px',
        }}>
          {message}
        </p>
        <p style={{
          fontSize: '13px',
          color: '#888888',
          letterSpacing: '1px',
        }}>
          A IA está a criar a tua transformação...
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#39FF14',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default Spinner;
