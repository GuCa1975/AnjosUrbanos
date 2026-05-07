import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "geral@anjosurbanosvirtual.com";
const FROM_NAME = "Carlos Almeida | Anjos Urbanos Virtual";

// Imagens da app no CDN
const COLOR_ANALYSIS_EXAMPLE = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030627064/xBIPOPtePQjCVUYE.png";
const APP_IMAGE_HORIZONTAL = "https://d2xsxph8kpxj0f.cloudfront.net/310419663030627064/fFjzT76BdEK7cS957mMQeL/press_mobile_horizontal_c206bb6f.webp";
const APP_IMAGE_LAPTOP = "https://d2xsxph8kpxj0f.cloudfront.net/310419663030627064/fFjzT76BdEK7cS957mMQeL/press_image_anjos_urbanos_1b7f9fa5.webp";
const APP_IMAGE_VERTICAL = "https://d2xsxph8kpxj0f.cloudfront.net/310419663030627064/fFjzT76BdEK7cS957mMQeL/press_mobile_vertical_e1c4ce35.webp";

function emailShell(bodyContent: string): string {
  return `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Anjos Urbanos Virtual</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#111111;border-radius:12px;overflow:hidden;border:1px solid #1f1f1f;">

          <!-- Header / Logo -->
          <tr>
            <td style="background:linear-gradient(135deg,#0a0a0a 0%,#0d1a0d 100%);padding:32px 40px 24px 40px;text-align:center;border-bottom:1px solid #1a2e1a;">
              <div style="margin-bottom:12px;">
                <span style="display:inline-block;width:36px;height:36px;background-color:#22c55e;border-radius:50%;line-height:36px;text-align:center;vertical-align:middle;">
                  <span style="color:#0a0a0a;font-size:18px;font-weight:900;">✦</span>
                </span>
                &nbsp;
                <span style="color:#ffffff;font-size:18px;font-weight:900;letter-spacing:2px;text-transform:uppercase;vertical-align:middle;">ANJOS URBANOS</span>
                <span style="color:#22c55e;font-size:18px;font-weight:300;letter-spacing:1px;vertical-align:middle;"> Virtual</span>
              </div>
              <p style="color:#6b7280;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0;">Estúdio Virtual · Powered by Gemini AI</p>
            </td>
          </tr>

          ${bodyContent}

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;text-align:center;border-top:1px solid #1f1f1f;">
              <p style="color:#374151;font-size:11px;margin:0 0 6px 0;">Carlos Almeida · Anjos Urbanos Virtual</p>
              <p style="color:#374151;font-size:11px;margin:0;">
                <a href="https://anjosurbanosvirtual.com" style="color:#22c55e;text-decoration:none;">anjosurbanosvirtual.com</a>
                &nbsp;·&nbsp;
                <a href="mailto:geral@anjosurbanosvirtual.com" style="color:#374151;text-decoration:none;">geral@anjosurbanosvirtual.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function benefitsStrip(): string {
  return `
  <tr>
    <td style="background-color:#0d1a0d;padding:20px 40px;border-top:1px solid #1a2e1a;border-bottom:1px solid #1a2e1a;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="text-align:center;padding:0 8px;">
            <p style="color:#22c55e;font-size:16px;margin:0 0 4px 0;">✦</p>
            <p style="color:#ffffff;font-size:11px;font-weight:700;margin:0 0 2px 0;text-transform:uppercase;letter-spacing:1px;">5 Simulações</p>
            <p style="color:#6b7280;font-size:10px;margin:0;">gratuitas para começar</p>
          </td>
          <td style="text-align:center;padding:0 8px;border-left:1px solid #1f1f1f;">
            <p style="color:#22c55e;font-size:16px;margin:0 0 4px 0;">✦</p>
            <p style="color:#ffffff;font-size:11px;font-weight:700;margin:0 0 2px 0;text-transform:uppercase;letter-spacing:1px;">Qualquer Dispositivo</p>
            <p style="color:#6b7280;font-size:10px;margin:0;">telemóvel, tablet ou PC</p>
          </td>
          <td style="text-align:center;padding:0 8px;border-left:1px solid #1f1f1f;">
            <p style="color:#22c55e;font-size:16px;margin:0 0 4px 0;">✦</p>
            <p style="color:#ffffff;font-size:11px;font-weight:700;margin:0 0 2px 0;text-transform:uppercase;letter-spacing:1px;">Parceiro Oficial</p>
            <p style="color:#6b7280;font-size:10px;margin:0;">Alfaparf Milano</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;
}

// ─── Template de Campanha de Conversão ───────────────────────────────────────

export function buildConversionEmailHtml(message: string): string {
  const paragraphs = message
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => `<p style="margin:0 0 16px 0;line-height:1.7;color:#d1d5db;">${line}</p>`)
    .join("");

  const body = `
  <!-- Hero image da app -->
  <tr>
    <td style="padding:0;">
      <img src="${APP_IMAGE_HORIZONTAL}"
           alt="Anjos Urbanos Virtual — app em uso num salão"
           width="600"
           style="display:block;width:100%;max-width:600px;height:auto;border:0;" />
    </td>
  </tr>

  <!-- Headline -->
  <tr>
    <td style="background:linear-gradient(180deg,#0d1a0d 0%,#111111 100%);padding:28px 40px 24px 40px;text-align:center;border-bottom:1px solid #1f1f1f;">
      <p style="color:#22c55e;font-size:11px;letter-spacing:4px;text-transform:uppercase;margin:0 0 10px 0;">O teu salão. A tua ferramenta.</p>
      <h1 style="color:#ffffff;font-size:26px;font-weight:900;letter-spacing:-0.5px;margin:0 0 8px 0;line-height:1.2;">O cliente vê o resultado<br/>antes de tu começares.</h1>
      <p style="color:#6b7280;font-size:13px;margin:0;">Cortes, cores e estilos simulados em segundos com IA.</p>
    </td>
  </tr>

  <!-- Message body -->
  <tr>
    <td style="padding:36px 40px 28px 40px;">
      ${paragraphs}
    </td>
  </tr>

  <!-- CTA -->
  <tr>
    <td style="padding:0 40px 36px 40px;text-align:center;">
      <a href="https://anjosurbanosvirtual.com"
         style="display:inline-block;background-color:#22c55e;color:#0a0a0a;font-size:14px;font-weight:900;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:16px 40px;border-radius:6px;">
        Começar Agora →
      </a>
      <p style="color:#4b5563;font-size:12px;margin:14px 0 0 0;">anjosurbanosvirtual.com</p>
    </td>
  </tr>

  ${benefitsStrip()}`;

  return emailShell(body);
}

// ─── Template de Boas-Vindas ─────────────────────────────────────────────────

export function buildWelcomeEmailHtml(name: string): string {
  const firstName = name?.split(" ")[0] || "Cabeleireiro";

  const body = `
  <!-- Hero image da app com portátil -->
  <tr>
    <td style="padding:0;">
      <img src="${APP_IMAGE_LAPTOP}"
           alt="Anjos Urbanos Virtual — interface da app"
           width="600"
           style="display:block;width:100%;max-width:600px;height:auto;border:0;" />
    </td>
  </tr>

  <!-- Headline de boas-vindas -->
  <tr>
    <td style="background:linear-gradient(180deg,#0d1a0d 0%,#111111 100%);padding:28px 40px 24px 40px;text-align:center;border-bottom:1px solid #1f1f1f;">
      <p style="color:#22c55e;font-size:11px;letter-spacing:4px;text-transform:uppercase;margin:0 0 10px 0;">Bem-vindo ao futuro do teu salão</p>
      <h1 style="color:#ffffff;font-size:26px;font-weight:900;letter-spacing:-0.5px;margin:0 0 8px 0;line-height:1.2;">Olá, ${firstName}!<br/>Estamos muito contentes por estares aqui.</h1>
    </td>
  </tr>

  <!-- Corpo da mensagem -->
  <tr>
    <td style="padding:36px 40px 28px 40px;">
      <p style="margin:0 0 16px 0;line-height:1.7;color:#d1d5db;">Sou o Carlos. Criei a Anjos Urbanos Virtual porque, depois de mais de duas décadas como cabeleireiro, sabia que havia uma forma melhor de trabalhar com os clientes.</p>
      <p style="margin:0 0 16px 0;line-height:1.7;color:#d1d5db;">A partir de hoje, tens acesso a <strong style="color:#22c55e;">5 simulações gratuitas</strong> — experimenta com os teus próprios clientes e vê a diferença que faz mostrar o resultado antes de começar.</p>
      <p style="margin:0 0 16px 0;line-height:1.7;color:#d1d5db;">Tira uma foto ao cliente, carrega para a plataforma, descreve o estilo que pretendes, e em segundos tens uma simulação realista para aprovarem juntos. Sem surpresas. Sem hesitações.</p>
      <p style="margin:0 0 0 0;line-height:1.7;color:#d1d5db;">Qualquer dúvida, responde diretamente a este email. Estou do outro lado.</p>
    </td>
  </tr>

  <!-- Passos rápidos -->
  <tr>
    <td style="padding:0 40px 32px 40px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #1a2e1a;border-radius:8px;overflow:hidden;">
        <tr>
          <td style="background-color:#0d1a0d;padding:16px 20px;border-bottom:1px solid #1a2e1a;">
            <p style="color:#22c55e;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0;font-weight:700;">Como começar em 3 passos</p>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 20px;border-bottom:1px solid #1f1f1f;">
            <p style="margin:0;color:#d1d5db;font-size:13px;"><span style="color:#22c55e;font-weight:900;">1.</span> Entra em <a href="https://anjosurbanosvirtual.com" style="color:#22c55e;text-decoration:none;">anjosurbanosvirtual.com</a> e abre o Estúdio Virtual</p>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 20px;border-bottom:1px solid #1f1f1f;">
            <p style="margin:0;color:#d1d5db;font-size:13px;"><span style="color:#22c55e;font-weight:900;">2.</span> Carrega a foto do cliente e descreve o estilo pretendido</p>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 20px;">
            <p style="margin:0;color:#d1d5db;font-size:13px;"><span style="color:#22c55e;font-weight:900;">3.</span> Mostra a simulação ao cliente e trabalha com confiança total</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- CTA -->
  <tr>
    <td style="padding:0 40px 36px 40px;text-align:center;">
      <a href="https://anjosurbanosvirtual.com/dashboard"
         style="display:inline-block;background-color:#22c55e;color:#0a0a0a;font-size:14px;font-weight:900;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:16px 40px;border-radius:6px;">
        Abrir o Estúdio Virtual →
      </a>
    </td>
  </tr>

  ${benefitsStrip()}`;

  return emailShell(body);
}

// ─── Template de Campanha: Nova Funcionalidade Análise de Cor ────────────────

export function buildColorAnalysisEmailHtml(message: string): string {
  const paragraphs = message
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => `<p style="margin:0 0 16px 0;line-height:1.7;color:#d1d5db;">${line}</p>`)
    .join("");

  const body = `
  <!-- Headline de nova funcionalidade -->
  <tr>
    <td style="background:linear-gradient(180deg,#1a0d00 0%,#111111 100%);padding:28px 40px 24px 40px;text-align:center;border-bottom:1px solid #2e1a00;">
      <p style="color:#d97706;font-size:11px;letter-spacing:4px;text-transform:uppercase;margin:0 0 10px 0;">✨ Nova Funcionalidade Exclusiva</p>
      <h1 style="color:#ffffff;font-size:26px;font-weight:900;letter-spacing:-0.5px;margin:0 0 8px 0;line-height:1.2;">Descobre a Cor de Cabelo<br/>Ideal para cada cliente.</h1>
      <p style="color:#9ca3af;font-size:13px;margin:0;">Análise profissional das 4 Estações com IA — disponível agora na subscrição.</p>
    </td>
  </tr>

  <!-- Exemplo de relatório -->
  <tr>
    <td style="padding:24px 40px 8px 40px;text-align:center;">
      <p style="color:#d97706;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 12px 0;font-weight:700;">Exemplo de relatório gerado pela IA</p>
      <img src="${COLOR_ANALYSIS_EXAMPLE}"
           alt="Exemplo de análise de cor de cabelo — Método das 4 Estações"
           width="520"
           style="display:block;width:100%;max-width:520px;height:auto;border:0;border-radius:8px;margin:0 auto;border:2px solid #2e1a00;" />
    </td>
  </tr>

  <!-- Message body -->
  <tr>
    <td style="padding:28px 40px 20px 40px;">
      ${paragraphs}
    </td>
  </tr>

  <!-- O que inclui a subscrição -->
  <tr>
    <td style="padding:0 40px 28px 40px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #2e1a00;border-radius:8px;overflow:hidden;">
        <tr>
          <td style="background-color:#1a0d00;padding:14px 20px;border-bottom:1px solid #2e1a00;">
            <p style="color:#d97706;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0;font-weight:700;">O que inclui a subscrição</p>
          </td>
        </tr>
        <tr>
          <td style="padding:14px 20px;border-bottom:1px solid #1f1f1f;">
            <p style="margin:0;color:#d1d5db;font-size:13px;"><span style="color:#d97706;font-weight:900;">🍂</span> <strong style="color:#ffffff;">Análise de Cor de Cabelo</strong> — classificação sazonal, paleta personalizada e fórmula de salão</p>
          </td>
        </tr>
        <tr>
          <td style="padding:14px 20px;border-bottom:1px solid #1f1f1f;">
            <p style="margin:0;color:#d1d5db;font-size:13px;"><span style="color:#22c55e;font-weight:900;">✦</span> <strong style="color:#ffffff;">Simulações de Penteado Ilimitadas</strong> — mostra o resultado antes de começar</p>
          </td>
        </tr>
        <tr>
          <td style="padding:14px 20px;">
            <p style="margin:0;color:#d1d5db;font-size:13px;"><span style="color:#22c55e;font-weight:900;">✦</span> <strong style="color:#ffffff;">Assistente de Penteados</strong> — sugestões personalizadas por tipo de rosto</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- CTA -->
  <tr>
    <td style="padding:0 40px 36px 40px;text-align:center;">
      <a href="https://anjosurbanosvirtual.com"
         style="display:inline-block;background-color:#d97706;color:#ffffff;font-size:14px;font-weight:900;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:16px 40px;border-radius:6px;">
        Ver Planos e Subscrever →
      </a>
      <p style="color:#4b5563;font-size:12px;margin:14px 0 0 0;">anjosurbanosvirtual.com</p>
    </td>
  </tr>

  <!-- Benefits strip -->
  <tr>
    <td style="background-color:#0d1a0d;padding:20px 40px;border-top:1px solid #1a2e1a;border-bottom:1px solid #1a2e1a;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="text-align:center;padding:0 8px;">
            <p style="color:#22c55e;font-size:16px;margin:0 0 4px 0;">✦</p>
            <p style="color:#ffffff;font-size:11px;font-weight:700;margin:0 0 2px 0;text-transform:uppercase;letter-spacing:1px;">Método 4 Estações</p>
            <p style="color:#6b7280;font-size:10px;margin:0;">análise profissional</p>
          </td>
          <td style="text-align:center;padding:0 8px;border-left:1px solid #1f1f1f;">
            <p style="color:#22c55e;font-size:16px;margin:0 0 4px 0;">✦</p>
            <p style="color:#ffffff;font-size:11px;font-weight:700;margin:0 0 2px 0;text-transform:uppercase;letter-spacing:1px;">Fórmula de Salão</p>
            <p style="color:#6b7280;font-size:10px;margin:0;">pronta para aplicar</p>
          </td>
          <td style="text-align:center;padding:0 8px;border-left:1px solid #1f1f1f;">
            <p style="color:#22c55e;font-size:16px;margin:0 0 4px 0;">✦</p>
            <p style="color:#ffffff;font-size:11px;font-weight:700;margin:0 0 2px 0;text-transform:uppercase;letter-spacing:1px;">Parceiro Oficial</p>
            <p style="color:#6b7280;font-size:10px;margin:0;">Alfaparf Milano</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;

  return emailShell(body);
}

// ─── Funções de envio ─────────────────────────────────────────────────────────

export async function sendCampaignEmail(to: string, subject: string, htmlBody: string) {
  return resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to,
    subject,
    html: htmlBody,
  });
}

export async function sendWelcomeEmail(to: string, name: string) {
  const html = buildWelcomeEmailHtml(name);
  return resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to,
    subject: "Bem-vindo à Anjos Urbanos Virtual — as tuas 5 simulações gratuitas estão prontas",
    html,
  });
}
