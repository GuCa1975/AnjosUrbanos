import React, { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface CameraCaptureProps {
  onCapture: (imageBase64: string, mimeType: string) => void;
  onCancel: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => setIsReady(true);
      }
      setStream(mediaStream);
    } catch {
      setError('Não foi possível aceder à câmera. Verifica as permissões do browser.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsReady(false);
    }
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    const base64 = dataUrl.split(',')[1];
    stopCamera();
    onCapture(base64, 'image/jpeg');
  }, [stopCamera, onCapture]);

  React.useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        padding: '20px',
      }}
    >
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '500px',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(57, 255, 20, 0.3)',
        background: '#111',
      }}>
        {error ? (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            color: '#888888',
          }}>
            <p style={{ fontSize: '40px', marginBottom: '16px' }}>📷</p>
            <p>{error}</p>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ width: '100%', display: 'block' }}
            />
            {/* Guia oval para o rosto */}
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}>
              <div style={{
                width: '180px',
                height: '240px',
                border: '2px dashed rgba(57, 255, 20, 0.5)',
                borderRadius: '50%',
              }} />
            </div>
          </>
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={capturePhoto}
          disabled={!isReady}
          className="btn-gold"
          style={{ opacity: isReady ? 1 : 0.5 }}
        >
          📸 Tirar Foto
        </button>
        <button onClick={() => { stopCamera(); onCancel(); }} className="btn-ghost">
          Cancelar
        </button>
      </div>

      <p style={{ fontSize: '12px', color: '#888888', textAlign: 'center' }}>
        Posiciona o teu rosto dentro do guia oval para melhores resultados
      </p>
    </motion.div>
  );
};

export default CameraCapture;
