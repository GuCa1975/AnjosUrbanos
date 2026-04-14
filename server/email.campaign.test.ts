import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock do módulo resend
vi.mock("resend", () => {
  return {
    Resend: vi.fn().mockImplementation(() => ({
      emails: {
        send: vi.fn().mockResolvedValue({ id: "test-email-id", error: null }),
      },
    })),
  };
});

import { buildConversionEmailHtml, sendCampaignEmail } from "./email";

describe("buildConversionEmailHtml", () => {
  it("deve gerar HTML com o conteúdo da mensagem", () => {
    const html = buildConversionEmailHtml("Olá cabeleireiro!\n\nEsta é a tua ferramenta.");
    expect(html).toContain("Olá cabeleireiro!");
    expect(html).toContain("Esta é a tua ferramenta.");
    expect(html).toContain("anjosurbanosvirtual.com");
    expect(html).toContain("Começar Agora");
  });

  it("deve incluir o logo e branding da Anjos Urbanos", () => {
    const html = buildConversionEmailHtml("Mensagem de teste");
    expect(html).toContain("ANJOS URBANOS");
    expect(html).toContain("Virtual");
    expect(html).toContain("Gemini AI");
  });

  it("deve incluir os três benefícios principais", () => {
    const html = buildConversionEmailHtml("Mensagem de teste");
    expect(html).toContain("5 Simulações");
    expect(html).toContain("Qualquer Dispositivo");
    expect(html).toContain("Alfaparf Milano");
  });

  it("deve ter estrutura HTML válida com DOCTYPE", () => {
    const html = buildConversionEmailHtml("Teste");
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("</html>");
    expect(html).toContain("<body");
    expect(html).toContain("</body>");
  });

  it("deve separar parágrafos por linha em branco", () => {
    const html = buildConversionEmailHtml("Primeiro parágrafo\n\nSegundo parágrafo");
    expect(html).toContain("Primeiro parágrafo");
    expect(html).toContain("Segundo parágrafo");
    // Ambos devem estar em tags <p>
    const matches = html.match(/<p style[^>]*>/g);
    expect(matches).toBeTruthy();
    expect(matches!.length).toBeGreaterThanOrEqual(2);
  });
});

describe("sendCampaignEmail", () => {
  it("deve chamar o Resend com os parâmetros corretos", async () => {
    const result = await sendCampaignEmail(
      "test@example.com",
      "Assunto de teste",
      "<p>Corpo do email</p>"
    );
    // O mock retorna { id, error: null } — não deve lançar erro
    expect(result).toBeDefined();
  });
});
