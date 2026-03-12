import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../LangContext';

interface ImageSelectorProps {
  onImageSelected: (imageBase64: string, mimeType: string) => void;
  onCameraOpen: () => void;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ onImageSelected, onCameraOpen }) => {
  const { t } = useLang();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      onImageSelected(base64, file.type);
    };
    reader.readAsDataURL(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        padding: '24px 16px',
        maxWidth: '700px',
        margin: '0 auto',
      }}
    >
      {/* Hero Section */}
      <div style={{ textAlign: 'center' }}>
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          style={{ fontSize: 'clamp(40px, 10vw, 60px)', marginBottom: '16px' }}
        >
          ✦
        </motion.div>
        <h2 style={{
          fontFamily: 'Barlow, sans-serif',
          fontSize: 'clamp(24px, 7vw, 36px)',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #1DB800, #39FF14, #7FFF5A)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '12px',
        }}>
          {t.heroTitle}
        </h2>
        <p style={{
          color: '#888888',
          fontSize: 'clamp(14px, 3.5vw, 16px)',
          lineHeight: '1.6',
          maxWidth: '400px',
        }}>
          {t.heroSubtitle}
        </p>
      </div>

      {/* Upload Options */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        width: '100%',
        maxWidth: '500px',
      }}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => fileInputRef.current?.click()}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(57, 255, 20, 0.3)',
            borderRadius: '16px',
            padding: 'clamp(20px, 5vw, 32px) 16px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.3s ease',
            color: 'inherit',
            touchAction: 'manipulation',
            minHeight: '120px',
          }}
        >
          <span style={{ fontSize: 'clamp(28px, 7vw, 36px)' }}>🖼️</span>
          <span style={{
            fontFamily: 'Barlow, sans-serif',
            fontSize: 'clamp(14px, 3.5vw, 16px)',
            color: '#39FF14',
          }}>
            {t.uploadPhoto}
          </span>
          <span style={{ fontSize: '12px', color: '#888888' }}>
            {t.uploadFormats}
          </span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCameraOpen}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(57, 255, 20, 0.3)',
            borderRadius: '16px',
            padding: 'clamp(20px, 5vw, 32px) 16px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.3s ease',
            color: 'inherit',
            touchAction: 'manipulation',
            minHeight: '120px',
          }}
        >
          <span style={{ fontSize: 'clamp(28px, 7vw, 36px)' }}>📸</span>
          <span style={{
            fontFamily: 'Barlow, sans-serif',
            fontSize: 'clamp(14px, 3.5vw, 16px)',
            color: '#39FF14',
          }}>
            {t.takeSelfie}
          </span>
          <span style={{ fontSize: '12px', color: '#888888' }}>
            {t.cameraLive}
          </span>
        </motion.button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Divider */}
      <div className="divider-gold" style={{ width: '100%', maxWidth: '500px' }} />

      {/* Partner */}
      <div style={{ textAlign: 'center' }}>
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
  );
};

export default ImageSelector;
