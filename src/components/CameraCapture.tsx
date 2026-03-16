import React, { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../LangContext';

interface CameraCaptureProps {
  onCapture: (imageBase64: string, mimeType: string) => void;
  onCancel: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onCancel }) => {
  const { t } = useLang();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'permission' | 'notfound' | 'other' | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const startCamera = useCallback(async (mode: 'user' | 'environment') => {
    // Parar stream anterior
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsReady(false);
    setError(null);
    setErrorType(null);

    // Tentar várias configurações por ordem — mais compatível com tablets
    const attempts = [
      { video: { facingMode: { ideal: mode }, width: { ideal: 1280 }, height: { ideal: 720 } } },
      { video: { facingMode: { ideal: mode } } },
      { video: { facingMode: mode } },
      { video: true }, // último recurso: qualquer câmara disponível
    ];

    let mediaStream: MediaStream | null = null;
    let lastError: DOMException | null = null;

    for (const constraints of attempts) {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        break; // sucesso — sair do loop
      } catch (err) {
        lastError = err as DOMException;
        // Se for recusa de permissão, não vale a pena tentar mais
        if (lastError?.name === 'NotAllowedError' || lastError?.name === 'PermissionDeniedError') {
          break;
        }
      }
    }

    if (!mediaStream) {
      if (lastError?.name === 'NotAllowedError' || lastError?.name === 'PermissionDeniedError') {
        setErrorType('permission');
        setError(t.cameraError);
      } else if (lastError?.name === 'NotFoundError' || lastError?.name === 'DevicesNotFoundError') {
        setErrorType('notfound');
        setError(t.cameraError);
      } else {
        setErrorType('other');
        setError(t.cameraError);
      }
      return;
    }

    streamRef.current = mediaStream;
    if (videoRef.current) {
      videoRef.current.srcObject = mediaStream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play().catch(() => {});
        setIsReady(true);
      };
    }
  }, [t]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsReady(false);
    }
  }, []);

  const switchCamera = useCallback(async () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);
    await startCamera(newMode);
  }, [facingMode, startCamera]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // Espelhar horizontalmente se for câmara frontal (para imagem não ficar invertida)
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    const base64 = dataUrl.split(',')[1];
    stopCamera();
    onCapture(base64, 'image/jpeg');
  }, [stopCamera, onCapture, facingMode]);

  React.useEffect(() => {
    startCamera('user');
    return () => stopCamera();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Mensagem de erro detalhada consoante o tipo
  const getErrorMessage = () => {
    if (errorType === 'permission') {
      return t.lang === 'en'
        ? 'Camera access was blocked. Please allow camera access in your browser settings and try again.'
        : 'O acesso à câmara foi bloqueado. Permite o acesso à câmara nas definições do browser e tenta novamente.';
    }
    if (errorType === 'notfound') {
      return t.lang === 'en'
        ? 'No camera found on this device.'
        : 'Nenhuma câmara encontrada neste dispositivo.';
    }
    return t.cameraError;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        padding: '16px',
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
        minHeight: error ? 'auto' : '300px',
      }}>
        {error ? (
          <div style={{
            padding: '40px 24px',
            textAlign: 'center',
            color: '#888888',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}>
            <p style={{ fontSize: '48px', margin: 0 }}>📷</p>
            <p style={{ color: '#FF8080', fontSize: '14px', lineHeight: '1.5', margin: 0 }}>
              {getErrorMessage()}
            </p>
            {/* Botão para tentar novamente */}
            {errorType !== 'notfound' && (
              <button
                onClick={() => startCamera(facingMode)}
                style={{
                  marginTop: '8px',
                  padding: '12px 24px',
                  background: 'rgba(57,255,20,0.12)',
                  border: '1px solid rgba(57,255,20,0.4)',
                  borderRadius: '8px',
                  color: '#39FF14',
                  fontSize: '14px',
                  cursor: 'pointer',
                  touchAction: 'manipulation',
                }}
              >
                🔄 {t.lang === 'en' ? 'Try Again' : 'Tentar Novamente'}
              </button>
            )}
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: '100%',
                display: 'block',
                // Espelhar visualmente a câmara frontal (preview)
                transform: facingMode === 'user' ? 'scaleX(-1)' : 'none',
              }}
            />

            {/* Indicador de câmara activa */}
            <div style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              background: 'rgba(0,0,0,0.72)',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '11px',
              color: '#39FF14',
              letterSpacing: '1px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              pointerEvents: 'none',
            }}>
              <span style={{ fontSize: '8px', color: '#39FF14' }}>●</span>
              {facingMode === 'user' ? t.frontCamera : t.backCamera}
            </div>

            {/* Botão de trocar câmara */}
            <button
              onClick={switchCamera}
              title={t.switchCamera}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(0,0,0,0.72)',
                border: '1px solid rgba(57,255,20,0.5)',
                borderRadius: '50%',
                width: '46px',
                height: '46px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                touchAction: 'manipulation',
                color: '#fff',
                zIndex: 10,
              }}
            >
              🔄
            </button>

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

      <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '500px' }}>
        <button
          onClick={capturePhoto}
          disabled={!isReady}
          className="btn-gold"
          style={{ opacity: isReady ? 1 : 0.5, flex: 1 }}
        >
          {t.takePhoto}
        </button>
        <button onClick={() => { stopCamera(); onCancel(); }} className="btn-ghost">
          {t.cancel}
        </button>
      </div>

      <p style={{ fontSize: '12px', color: '#888888', textAlign: 'center' }}>
        {t.faceGuide}
      </p>
    </motion.div>
  );
};

export default CameraCapture;
