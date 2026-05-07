import React from 'react';
import type { ColorAnalysisResult } from '../services/colorAnalysisService';

const SEASON_STYLE: Record<string, { bg: string; text: string; icon: string }> = {
  Primavera: { bg: '#C47A2B', text: '#fff', icon: '🌸' },
  'Verão':   { bg: '#4A6FA5', text: '#fff', icon: '☀️' },
  Outono:    { bg: '#8B4513', text: '#fff', icon: '🍂' },
  Inverno:   { bg: '#2C3E6B', text: '#fff', icon: '❄️' },
};

const TECH_ICONS = ['✂️', '🎨', '💧', '✨', '🌿'];

interface Props {
  result: ColorAnalysisResult;
  photoBase64: string;
  photoMimeType: string;
  onBack: () => void;
}

const ColorAnalysisResultView: React.FC<Props> = ({ result, photoBase64, photoMimeType, onBack }) => {
  const season = result.classificacaoSazonal ?? 'Outono';
  const sb = SEASON_STYLE[season] ?? SEASON_STYLE['Outono'];

  const handlePrint = () => window.print();

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '16px', fontFamily: 'Georgia, serif', color: '#2C1A0E' }}>

      {/* Botão voltar */}
      <button
        onClick={onBack}
        style={{
          background: 'transparent',
          border: '1px solid rgba(57,255,20,0.3)',
          borderRadius: '8px',
          color: '#39FF14',
          fontSize: '13px',
          padding: '8px 16px',
          cursor: 'pointer',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        ← Voltar
      </button>

      {/* Relatório */}
      <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E8DDD4' }}>

        {/* Título */}
        <div style={{ background: '#F9F5F0', borderBottom: '1px solid #E8DDD4', padding: '20px 24px', textAlign: 'center', position: 'relative' }}>
          <span style={{ position: 'absolute', left: '12px', top: '10px', fontSize: '28px', opacity: 0.5 }}>🍂</span>
          <span style={{ position: 'absolute', right: '12px', top: '10px', fontSize: '28px', opacity: 0.5, transform: 'scaleX(-1)' }}>🍂</span>
          <h1 style={{ fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', margin: 0, color: '#2C1A0E' }}>
            A Cor de Cabelo Ideal Para Si
          </h1>
        </div>

        <div style={{ padding: '20px 24px' }}>

          {/* Foto + classificação */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <div style={{ borderRadius: '12px', overflow: 'hidden', border: '2px solid #D4B896', marginBottom: '12px' }}>
                <img
                  src={`data:${photoMimeType};base64,${photoBase64}`}
                  alt="Cliente"
                  style={{ width: '100%', objectFit: 'cover', maxHeight: '200px', display: 'block' }}
                />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#8B6347', marginBottom: '8px', fontFamily: 'sans-serif', fontWeight: 600 }}>
                  Classificação Sazonal
                </p>
                <div style={{
                  display: 'inline-block',
                  padding: '8px 20px',
                  borderRadius: '8px',
                  background: sb.bg,
                  color: sb.text,
                  fontWeight: 900,
                  fontSize: '16px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}>
                  {sb.icon} {season}
                </div>
                <p style={{ fontSize: '12px', color: '#5C3A1E', marginTop: '10px', lineHeight: 1.5, fontFamily: 'sans-serif' }}>
                  {result.explicacaoSazonal}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Características */}
              <div style={{ background: '#FDF8F3', borderRadius: '10px', border: '1px solid #E8DDD4', padding: '12px' }}>
                {[
                  { icon: '🍂', label: 'Classificação', value: season },
                  { icon: '🌡️', label: 'Subtom', value: result.subtom },
                  { icon: '⚡', label: 'Contraste', value: result.contraste },
                  { icon: '💇', label: 'Base natural', value: result.baseNatural },
                  { icon: '✨', label: 'Intensidade', value: result.intensidade },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', gap: '6px', padding: '5px 0', borderBottom: '1px solid #EDE3D8' }}>
                    <span style={{ fontSize: '12px' }}>{item.icon}</span>
                    <span style={{ fontSize: '10px', color: '#8B6347', fontFamily: 'sans-serif', fontWeight: 600, minWidth: '90px' }}>{item.label}:</span>
                    <span style={{ fontSize: '10px', color: '#2C1A0E', fontFamily: 'sans-serif' }}>{item.value}</span>
                  </div>
                ))}
              </div>
              {/* Resumo técnico */}
              <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #E8DDD4', padding: '12px' }}>
                <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: '#8B6347', fontFamily: 'sans-serif', fontWeight: 700, marginBottom: '6px' }}>
                  Resumo da Análise Técnica
                </p>
                <p style={{ fontSize: '11px', color: '#2C1A0E', lineHeight: 1.5, fontFamily: 'sans-serif', margin: 0 }}>
                  {result.resumoAnaliseTecnica}
                </p>
              </div>
            </div>
          </div>

          {/* Cores recomendadas */}
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ textAlign: 'center', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '1px solid #E8DDD4', paddingBottom: '8px', marginBottom: '12px', fontFamily: 'sans-serif', color: '#2C1A0E' }}>
              Cores de Cabelo que Mais Valorizam
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {result.coresRecomendadas.slice(0, 6).map((cor, i) => (
                <div key={i} style={{ borderRadius: '10px', border: '1px solid #E8DDD4', overflow: 'hidden', background: '#FDF8F3' }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{ width: '100%', height: '60px', background: cor.hex }} />
                    <span style={{
                      position: 'absolute', top: '6px', left: '6px',
                      width: '20px', height: '20px', borderRadius: '50%',
                      background: 'rgba(255,255,255,0.9)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '10px', fontWeight: 900, color: '#2C1A0E',
                    }}>{i + 1}</span>
                  </div>
                  <div style={{ padding: '8px' }}>
                    <p style={{ fontSize: '10px', fontWeight: 900, color: '#2C1A0E', margin: '0 0 3px', fontFamily: 'sans-serif' }}>{cor.name}</p>
                    <p style={{ fontSize: '9px', color: '#8B6347', margin: '0 0 2px', lineHeight: 1.3, fontFamily: 'sans-serif' }}>{cor.description}</p>
                    <p style={{ fontSize: '9px', color: '#5C3A1E', margin: '0 0 2px', lineHeight: 1.3, fontStyle: 'italic', fontFamily: 'sans-serif' }}>{cor.whyItWorks}</p>
                    <p style={{ fontSize: '8px', fontFamily: 'monospace', color: '#B8967A', margin: 0 }}>{cor.hex}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Técnicas + Cores a evitar */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #E8DDD4', paddingBottom: '6px', marginBottom: '10px', fontFamily: 'sans-serif', color: '#2C1A0E' }}>
                Técnicas Recomendadas
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {result.tecnicasRecomendadas.map((t, i) => (
                  <div key={i} style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '14px', marginTop: '1px' }}>{TECH_ICONS[i] ?? TECH_ICONS[0]}</span>
                    <div>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: '#2C1A0E', fontFamily: 'sans-serif' }}>{t.name}</span>
                      <span style={{ fontSize: '10px', color: '#8B6347', fontFamily: 'sans-serif' }}> — {t.reason}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #E8DDD4', paddingBottom: '6px', marginBottom: '10px', fontFamily: 'sans-serif', color: '#2C1A0E' }}>
                Cores a Evitar
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {result.coresAEvitar.map((c, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid #E8DDD4', flexShrink: 0, background: c.hex }} />
                    <div>
                      <p style={{ fontSize: '10px', fontWeight: 700, color: '#2C1A0E', margin: 0, fontFamily: 'sans-serif' }}>{c.name}</p>
                      <p style={{ fontSize: '8px', fontFamily: 'monospace', color: '#B8967A', margin: 0 }}>{c.hex}</p>
                      <p style={{ fontSize: '9px', color: '#8B6347', margin: 0, fontFamily: 'sans-serif' }}>{c.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Fórmula salão + Resultado visual */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div style={{ background: '#FDF8F3', borderRadius: '10px', border: '1px solid #E8DDD4', padding: '12px' }}>
              <h2 style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', fontFamily: 'sans-serif', color: '#2C1A0E' }}>
                Melhor Resultado no Salão
              </h2>
              {[
                { label: 'Altura ideal', value: result.formulaSalao.alturaIdeal },
                { label: 'Reflexo ideal', value: result.formulaSalao.reflexoIdeal },
                { label: 'Temperatura', value: result.formulaSalao.temperatura },
                { label: 'Contraste', value: result.formulaSalao.contraste },
                { label: 'Manutenção', value: result.formulaSalao.manutencao },
                { label: 'Retoque', value: result.formulaSalao.retoque },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', gap: '4px', fontSize: '10px', marginBottom: '4px', fontFamily: 'sans-serif' }}>
                  <span style={{ color: '#C47A2B' }}>•</span>
                  <span style={{ fontWeight: 600, color: '#2C1A0E' }}>{item.label}:</span>
                  <span style={{ color: '#5C3A1E' }}>{item.value}</span>
                </div>
              ))}
            </div>
            <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #E8DDD4', padding: '12px' }}>
              <h2 style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', fontFamily: 'sans-serif', color: '#2C1A0E' }}>
                Resultado Visual Esperado
              </h2>
              <p style={{ fontSize: '11px', color: '#2C1A0E', lineHeight: 1.5, fontFamily: 'sans-serif', margin: 0 }}>
                {result.resultadoVisual}
              </p>
            </div>
          </div>

          {/* Paleta final */}
          <div style={{ borderRadius: '10px', border: '1px solid #E8DDD4', overflow: 'hidden', marginBottom: '16px' }}>
            <div style={{ background: '#F9F5F0', padding: '8px', textAlign: 'center', borderBottom: '1px solid #E8DDD4' }}>
              <h2 style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', margin: 0, fontFamily: 'sans-serif', color: '#2C1A0E' }}>
                Paleta Final para Cabelo
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
              {[
                { label: 'Base principal', hex: result.paletaFinal.basePrincipal },
                { label: 'Reflexo', hex: result.paletaFinal.reflexo },
                { label: 'Iluminação', hex: result.paletaFinal.iluminacao },
                { label: 'Profundidade', hex: result.paletaFinal.profundidade },
              ].map(p => (
                <div key={p.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '100%', height: '48px', background: p.hex }} />
                  <div style={{ background: '#fff', width: '100%', textAlign: 'center', padding: '6px 4px', borderTop: '1px solid #E8DDD4' }}>
                    <p style={{ fontSize: '9px', color: '#8B6347', fontFamily: 'sans-serif', margin: 0 }}>{p.label}</p>
                    <p style={{ fontSize: '8px', fontFamily: 'monospace', fontWeight: 700, color: '#2C1A0E', margin: 0 }}>{p.hex}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: '#F9F5F0', padding: '6px', textAlign: 'center', borderTop: '1px solid #E8DDD4' }}>
              <p style={{ fontSize: '9px', color: '#8B6347', fontFamily: 'sans-serif', margin: 0 }}>Combinação perfeita para uma cor de cabelo harmoniosa</p>
            </div>
          </div>

          {/* Rodapé */}
          <p style={{ fontSize: '9px', textAlign: 'center', color: '#B8967A', lineHeight: 1.5, fontFamily: 'sans-serif', marginBottom: '16px' }}>
            Análise gerada com base nas características visuais da imagem. Para um diagnóstico técnico completo, consulte um profissional de coloração capilar.
          </p>

          {/* Botões */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              onClick={onBack}
              style={{
                padding: '10px 20px',
                background: 'transparent',
                border: '1px solid rgba(57,255,20,0.3)',
                borderRadius: '8px',
                color: '#39FF14',
                fontSize: '13px',
                cursor: 'pointer',
                fontFamily: 'sans-serif',
              }}
            >
              Nova Análise
            </button>
            <button
              onClick={handlePrint}
              style={{
                padding: '10px 20px',
                background: '#C47A2B',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'sans-serif',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Imprimir / PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorAnalysisResultView;
