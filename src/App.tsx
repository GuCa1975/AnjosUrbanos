import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import ImageSelector from './components/ImageSelector';
import CameraCapture from './components/CameraCapture';
import Editor from './components/Editor';

type AppState = 'select' | 'camera' | 'edit';

interface ImageData {
  base64: string;
  mimeType: string;
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('select');
  const [imageData, setImageData] = useState<ImageData | null>(null);

  const handleImageSelected = (base64: string, mimeType: string) => {
    setImageData({ base64, mimeType });
    setAppState('edit');
  };

  const handleReset = () => {
    setImageData(null);
    setAppState('select');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A' }}>
      <Header />
      <main style={{ padding: '8px 0' }}>
        <AnimatePresence mode="wait">
          {appState === 'select' && (
            <ImageSelector
              key="selector"
              onImageSelected={handleImageSelected}
              onCameraOpen={() => setAppState('camera')}
            />
          )}
          {appState === 'camera' && (
            <CameraCapture
              key="camera"
              onCapture={handleImageSelected}
              onCancel={() => setAppState('select')}
            />
          )}
          {appState === 'edit' && imageData && (
            <Editor
              key="editor"
              imageBase64={imageData.base64}
              imageMimeType={imageData.mimeType}
              onReset={handleReset}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '16px',
        borderTop: '1px solid rgba(57, 255, 20, 0.1)',
        marginTop: '16px',
      }}>
        <p style={{ fontSize: '12px', color: '#888888', letterSpacing: '1px' }}>
          ✦ Anjos Urbanos Virtual · Powered by Google Gemini AI ✦
        </p>
      </footer>
    </div>
  );
};

export default App;
