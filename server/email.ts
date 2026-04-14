import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "geral@anjosurbanosvirtual.com";
const FROM_NAME = "Carlos Almeida | Anjos Urbanos Virtual";

export interface EmailCampaign {
  subject: string;
  message: string;
  recipients: string[];
}

export async function sendCampaignEmail(to: string, subject: string, htmlBody: string) {
  return resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to,
    subject,
    html: htmlBody,
  });
}

export function buildConversionEmailHtml(message: string): string {
  // Escape newlines to HTML paragraphs
  const paragraphs = message
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => `<p style="margin:0 0 16px 0;line-height:1.7;color:#d1d5db;">${line}</p>`)
    .join("");

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

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0a0a0a 0%,#0d1a0d 100%);padding:40px 40px 32px 40px;text-align:center;border-bottom:1px solid #1a2e1a;">
              <div style="display:inline-flex;align-items:center;gap:10px;margin-bottom:16px;">
                <div style="width:36px;height:36px;background-color:#22c55e;border-radius:50%;display:inline-block;line-height:36px;text-align:center;">
                  <span style="color:#0a0a0a;font-size:18px;font-weight:900;">✦</span>
                </div>
                <span style="color:#ffffff;font-size:18px;font-weight:900;letter-spacing:2px;text-transform:uppercase;">ANJOS URBANOS</span>
                <span style="color:#22c55e;font-size:18px;font-weight:300;letter-spacing:1px;">Virtual</span>
              </div>
              <p style="color:#6b7280;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0;">Estúdio Virtual · Powered by Gemini AI</p>
            </td>
          </tr>

          <!-- Hero image area -->
          <tr>
            <td style="padding:0;">
              <div style="background:linear-gradient(180deg,#0d1a0d 0%,#111111 100%);padding:32px 40px;text-align:center;border-bottom:1px solid #1f1f1f;">
                <p style="color:#22c55e;font-size:11px;letter-spacing:4px;text-transform:uppercase;margin:0 0 12px 0;">Simulação de Imagem com IA</p>
                <h1 style="color:#ffffff;font-size:28px;font-weight:900;letter-spacing:-0.5px;margin:0 0 8px 0;line-height:1.2;">O teu cliente vê o resultado<br/>antes de tu começares.</h1>
                <p style="color:#6b7280;font-size:14px;margin:0;">Cortes, cores e estilos simulados em segundos.</p>
              </div>
            </td>
          </tr>

          <!-- Message body -->
          <tr>
            <td style="padding:40px 40px 32px 40px;">
              ${paragraphs}
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding:0 40px 40px 40px;text-align:center;">
              <a href="https://anjosurbanosvirtual.com"
                 style="display:inline-block;background-color:#22c55e;color:#0a0a0a;font-size:14px;font-weight:900;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:16px 40px;border-radius:6px;">
                Começar Agora →
              </a>
              <p style="color:#4b5563;font-size:12px;margin:16px 0 0 0;">anjosurbanosvirtual.com</p>
            </td>
          </tr>

          <!-- Benefits strip -->
          <tr>
            <td style="background-color:#0d1a0d;padding:24px 40px;border-top:1px solid #1a2e1a;border-bottom:1px solid #1a2e1a;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align:center;padding:0 8px;">
                    <p style="color:#22c55e;font-size:18px;margin:0 0 4px 0;">✦</p>
                    <p style="color:#ffffff;font-size:12px;font-weight:700;margin:0 0 2px 0;text-transform:uppercase;letter-spacing:1px;">5 Simulações</p>
                    <p style="color:#6b7280;font-size:11px;margin:0;">gratuitas para começar</p>
                  </td>
                  <td style="text-align:center;padding:0 8px;border-left:1px solid #1f1f1f;">
                    <p style="color:#22c55e;font-size:18px;margin:0 0 4px 0;">✦</p>
                    <p style="color:#ffffff;font-size:12px;font-weight:700;margin:0 0 2px 0;text-transform:uppercase;letter-spacing:1px;">Qualquer Dispositivo</p>
                    <p style="color:#6b7280;font-size:11px;margin:0;">telemóvel, tablet ou PC</p>
                  </td>
                  <td style="text-align:center;padding:0 8px;border-left:1px solid #1f1f1f;">
                    <p style="color:#22c55e;font-size:18px;margin:0 0 4px 0;">✦</p>
                    <p style="color:#ffffff;font-size:12px;font-weight:700;margin:0 0 2px 0;text-transform:uppercase;letter-spacing:1px;">Parceiro Oficial</p>
                    <p style="color:#6b7280;font-size:11px;margin:0;">Alfaparf Milano</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;text-align:center;">
              <p style="color:#374151;font-size:11px;margin:0 0 8px 0;">Carlos Almeida · Anjos Urbanos Virtual</p>
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
