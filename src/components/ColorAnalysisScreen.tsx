import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { analyzeHairColor, type ColorAnalysisResult } from "../services/colorAnalysisService";
import ColorAnalysisResultView from "./ColorAnalysisResult";
import CameraCapture from "./CameraCapture";

interface Props {
  onBack: () => void;
}

type ScreenState = "select" | "camera" | "preview" | "analyzing";

const ColorAnalysisScreen: React.FC<Props> = ({ onBack }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [screenState, setScreenState] = useState<ScreenState>("select");
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [photoMimeType, setPhotoMimeType] = useState<string>("image/jpeg");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ColorAnalysisResult | null>(null);

  const handleCameraCapture = (base64: string, mimeType: string) => {
    setPhotoBase64(base64);
    setPhotoMimeType(mimeType);
    setPreviewUrl(`data:${mimeType};base64,${base64}`);
    setError(null);
    setResult(null);
    setScreenState("preview");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      const base64 = dataUrl.split(",")[1];
      setPhotoBase64(base64);
      setPhotoMimeType(file.type);
      setPreviewUrl(dataUrl);
      setScreenState("preview");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleAnalyze = async () => {
    setScreenState("analyzing");
    setError(null);
    try {
      const res = await analyzeHairColor(photoBase64, photoMimeType);
      setResult(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao analisar. Tenta novamente.");
      setScreenState("preview");
    }
  };

  const handleReset = () => {
    setPhotoBase64(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setScreenState("select");
  };

  if (result && photoBase64) {
    return (
      <motion.div key="color-result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
        <ColorAnalysisResultView result={result} photoBase64={photoBase64} photoMimeType={photoMimeType} onBack={handleReset} />
      </motion.div>
    );
  }

  if (screenState === "camera") {
    return (
      <motion.div key="color-camera" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ maxWidth: "500px", margin: "0 auto", padding: "16px" }}>
        <button onClick={() => setScreenState("select")} style={{ background: "transparent", border: "1px solid rgba(57,255,20,0.3)", borderRadius: "8px", color: "#39FF14", fontSize: "13px", padding: "8px 16px", cursor: "pointer", marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
          ← Voltar
        </button>
        <CameraCapture onCapture={handleCameraCapture} onCancel={() => setScreenState("select")} />
      </motion.div>
    );
  }

  if (screenState === "analyzing") {
    return (
      <motion.div key="color-analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ maxWidth: "480px", margin: "0 auto", padding: "40px 16px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
        {previewUrl && (
          <img src={previewUrl} alt="A analisar" style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "50%", border: "3px solid #C47A2B", opacity: 0.8 }} />
        )}
        <div style={{ width: "48px", height: "48px", border: "3px solid rgba(196,122,43,0.3)", borderTopColor: "#C47A2B", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <div>
          <p style={{ color: "#F5F5F5", fontSize: "16px", fontWeight: 700, margin: "0 0 8px" }}>A analisar a cor ideal...</p>
          <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>A IA está a estudar as características da imagem.<br />Pode demorar até 30 segundos.</p>
        </div>
      </motion.div>
    );
  }

  if (screenState === "preview" && previewUrl) {
    return (
      <motion.div key="color-preview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ maxWidth: "480px", margin: "0 auto", padding: "16px" }}>
        <button onClick={() => setScreenState("select")} style={{ background: "transparent", border: "1px solid rgba(57,255,20,0.3)", borderRadius: "8px", color: "#39FF14", fontSize: "13px", padding: "8px 16px", cursor: "pointer", marginBottom: "20px", display: "flex", alignItems: "center", gap: "6px" }}>
          ← Tirar outra foto
        </button>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h2 style={{ color: "#F5F5F5", fontSize: "18px", fontWeight: 700, letterSpacing: "1px", margin: "0 0 6px" }}>FOTO PRONTA</h2>
          <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>Confirma a foto e clica em Analisar</p>
        </div>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img src={previewUrl} alt="Preview" style={{ width: "200px", height: "200px", objectFit: "cover", borderRadius: "14px", border: "2px solid #39FF14" }} />
        </div>
        {error && (
          <div style={{ background: "rgba(255,50,50,0.1)", border: "1px solid rgba(255,50,50,0.3)", borderRadius: "8px", padding: "10px 14px", color: "#ff6b6b", fontSize: "13px", marginBottom: "12px", textAlign: "center" }}>
            {error}
          </div>
        )}
        <button onClick={handleAnalyze} style={{ width: "100%", padding: "14px", background: "#C47A2B", border: "none", borderRadius: "10px", color: "#fff", fontSize: "15px", fontWeight: 700, cursor: "pointer", textTransform: "uppercase", letterSpacing: "1px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "background 0.2s" }}>
          🎨 Analisar Cor Ideal
        </button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div key="color-select" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ maxWidth: "480px", margin: "0 auto", padding: "16px" }}>
        <button onClick={onBack} style={{ background: "transparent", border: "1px solid rgba(57,255,20,0.3)", borderRadius: "8px", color: "#39FF14", fontSize: "13px", padding: "8px 16px", cursor: "pointer", marginBottom: "20px", display: "flex", alignItems: "center", gap: "6px" }}>
          ← Voltar
        </button>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "40px", marginBottom: "10px" }}>🎨</div>
          <h2 style={{ color: "#F5F5F5", fontSize: "20px", fontWeight: 700, letterSpacing: "1px", margin: "0 0 8px" }}>ANÁLISE DE COR DE CABELO</h2>
          <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>Descobre a cor ideal com o Método das 4 Estações</p>
        </div>
        <button onClick={() => setScreenState("camera")} style={{ width: "100%", padding: "20px", background: "rgba(57,255,20,0.06)", border: "1px solid rgba(57,255,20,0.4)", borderRadius: "14px", color: "#F5F5F5", fontSize: "16px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "12px", transition: "background 0.2s" }}>
          <span style={{ fontSize: "28px" }}>📸</span>
          <span>Tirar Selfie</span>
        </button>
        <button onClick={() => fileInputRef.current?.click()} style={{ width: "100%", padding: "20px", background: "rgba(196,122,43,0.06)", border: "1px solid rgba(196,122,43,0.4)", borderRadius: "14px", color: "#F5F5F5", fontSize: "16px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", transition: "background 0.2s" }}>
          <span style={{ fontSize: "28px" }}>🖼️</span>
          <span>Carregar Foto</span>
        </button>
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: "none" }} onChange={handleFileSelect} />
        <p style={{ color: "#555", fontSize: "12px", textAlign: "center", marginTop: "20px" }}>JPG, PNG ou WEBP · máx. 10MB</p>
      </motion.div>
    </AnimatePresence>
  );
};

export default ColorAnalysisScreen;
