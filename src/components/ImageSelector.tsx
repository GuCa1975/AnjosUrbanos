import React, { useRef } from 'react';
import { motion } from 'framer-motion';

interface ImageSelectorProps {
  onImageSelected: (imageBase64: string, mimeType: string) => void;
  onCameraOpen: () => void;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ onImageSelected, onCameraOpen }) => {
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
        gap: '40px',
        padding: '40px 20px',
        maxWidth: '700px',
        margin: '0 auto',
      }}
    >
      {/* Hero Section */}
      <div style={{ textAlign: 'center' }}>
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          style={{ fontSize: '60px', marginBottom: '20px' }}
        >
          ✦
        </motion.div>
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '36px',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #8B6914, #C9A84C, #E8C97A)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '12px',
        }}>
          O Teu Novo Visual
        </h2>
        <p style={{
          color: '#A89880',
          fontSize: '16px',
          lineHeight: '1.6',
          maxWidth: '400px',
        }}>
          Experimenta cortes e cores de cabelo com inteligência artificial antes de os fazer no salão
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
            border: '1px solid rgba(201, 168, 76, 0.3)',
            borderRadius: '16px',
            padding: '32px 20px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            transition: 'all 0.3s ease',
            color: 'inherit',
          }}
        >
          <span style={{ fontSize: '36px' }}>🖼️</span>
          <span style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '16px',
            color: '#C9A84C',
          }}>
            Carregar Foto
          </span>
          <span style={{ fontSize: '12px', color: '#A89880' }}>
            JPG, PNG, WEBP
          </span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCameraOpen}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(201, 168, 76, 0.3)',
            borderRadius: '16px',
            padding: '32px 20px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            transition: 'all 0.3s ease',
            color: 'inherit',
          }}
        >
          <span style={{ fontSize: '36px' }}>📸</span>
          <span style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '16px',
            color: '#C9A84C',
          }}>
            Tirar Selfie
          </span>
          <span style={{ fontSize: '12px', color: '#A89880' }}>
            Câmera ao vivo
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
        <p style={{ fontSize: '11px', color: '#A89880', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
          Parceiro Oficial
        </p>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 24px',
          border: '1px solid rgba(201, 168, 76, 0.2)',
          borderRadius: '8px',
          background: 'rgba(201, 168, 76, 0.05)',
        }}>
          <span style={{ fontSize: '16px' }}>💎</span>
          <span style={{ color: '#C9A84C', fontSize: '14px', fontWeight: '600', letterSpacing: '1px' }}>
            Alfaparf Milano
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ImageSelector;
