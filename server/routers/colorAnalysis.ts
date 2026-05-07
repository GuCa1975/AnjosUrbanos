import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { invokeLLM, type Message } from "../_core/llm";
import { TRPCError } from "@trpc/server";

const HairColorSchema = z.object({
  name: z.string(),
  description: z.string(),
  whyItWorks: z.string(),
  hex: z.string(),
});

const AvoidColorSchema = z.object({
  name: z.string(),
  hex: z.string(),
  reason: z.string(),
});

const TechniqueSchema = z.object({
  name: z.string(),
  reason: z.string(),
});

const FinalPaletteSchema = z.object({
  basePrincipal: z.string(),
  reflexo: z.string(),
  iluminacao: z.string(),
  profundidade: z.string(),
});

const SalonFormulaSchema = z.object({
  alturaIdeal: z.string(),
  reflexoIdeal: z.string(),
  temperatura: z.string(),
  contraste: z.string(),
  manutencao: z.string(),
  retoque: z.string(),
});

export const ColorAnalysisResultSchema = z.object({
  // Technical analysis
  subtom: z.string(),
  profundidade: z.string(),
  intensidade: z.string(),
  contraste: z.string(),
  baseNatural: z.string(),
  // Seasonal classification (4 seasons)
  classificacaoSazonal: z.string(),
  explicacaoSazonal: z.string(),
  resumoAnaliseTecnica: z.string(),
  // Recommendations
  coresRecomendadas: z.array(HairColorSchema).min(6).max(6),
  tecnicasRecomendadas: z.array(TechniqueSchema).min(3).max(5),
  coresAEvitar: z.array(AvoidColorSchema).min(4).max(5),
  // Salon formula
  formulaSalao: SalonFormulaSchema,
  // Visual result
  resultadoVisual: z.string(),
  // Final palette
  paletaFinal: FinalPaletteSchema,
});

export type ColorAnalysisResult = z.infer<typeof ColorAnalysisResultSchema>;

const SYSTEM_PROMPT = `Você é um especialista em colorimetria capilar e análise de cor pessoal, com profundo conhecimento do Método das 4 Estações (Primavera, Verão, Outono, Inverno). Analisa imagens de rostos humanos e fornece recomendações profissionais de cor de cabelo em português de Portugal. Responde SEMPRE em JSON válido, sem texto adicional fora do JSON.`;

const buildUserPrompt = () => `Analisa esta fotografia de rosto e realiza uma análise profissional completa de cor de cabelo usando o Método das 4 Estações.

Avalia as seguintes dimensões:
1. SUBTOM DA PELE: Quente/dourado/amarelado | Frio/rosado/azulado | Neutro, com tendência quente | Neutro, com tendência fria
2. PROFUNDIDADE: Clara | Média | Escura
3. INTENSIDADE: Viva e contrastante | Suave e harmónica
4. CONTRASTE: Alto | Médio | Baixo
5. BASE NATURAL DO CABELO: Loiro claro | Loiro escuro | Castanho claro | Castanho médio | Castanho escuro | Preto | Ruivo natural | Grisalho | Base artificial ou indefinida

Classifica numa das 4 estações:
- PRIMAVERA: pele quente, clara a média, subtom dourado/pêssego, olhos claros ou verdes/castanho-mel, cabelo loiro ou castanho dourado
- VERÃO: pele fria, clara a média, subtom rosado/bege frio, olhos azuis/cinza/castanho frio, cabelo loiro cinza ou castanho acinzentado
- OUTONO: pele quente, média a escura, subtom dourado/cobre/terracota, olhos castanhos/verdes/âmbar, cabelo castanho quente ou ruivo
- INVERNO: pele fria, média a escura, subtom azulado/olivado/bege frio, olhos escuros ou azul intenso, cabelo preto ou castanho escuro frio

Responde EXCLUSIVAMENTE com este JSON (sem markdown, sem texto extra):
{
  "subtom": "string curta ex: Neutro, com tendência quente",
  "profundidade": "string curta ex: Média",
  "intensidade": "string curta ex: Suave e harmónica",
  "contraste": "string curta ex: Médio",
  "baseNatural": "string curta ex: Castanho escuro",
  "classificacaoSazonal": "string — apenas o nome da estação ex: Outono",
  "explicacaoSazonal": "2-3 frases explicando a classificação e porque esta estação valoriza esta cliente",
  "resumoAnaliseTecnica": "2-3 frases descrevendo as características visuais observadas na imagem (pele, olhos, contraste, profundidade)",
  "coresRecomendadas": [
    {
      "name": "Nome da cor em português ex: Castanho chocolate quente",
      "description": "Descrição técnica de salão em 1 frase",
      "whyItWorks": "Porque valoriza esta cliente em 1 frase",
      "hex": "#XXXXXX"
    }
  ],
  "tecnicasRecomendadas": [
    {
      "name": "Nome da técnica ex: Morena iluminada suave",
      "reason": "Porque é ideal para esta cliente em 1 frase"
    }
  ],
  "coresAEvitar": [
    {
      "name": "Nome da cor ex: Loiro platinado frio",
      "hex": "#XXXXXX",
      "reason": "Razão curta em 1 frase"
    }
  ],
  "formulaSalao": {
    "alturaIdeal": "string ex: 4 a 6, com pontos de luz até 7",
    "reflexoIdeal": "string ex: Dourado suave, bege quente, caramelo ou avelã",
    "temperatura": "string ex: Quente equilibrada",
    "contraste": "string ex: Médio e natural",
    "manutencao": "string ex: Gloss a cada 6 a 8 semanas",
    "retoque": "string ex: Raiz ou tonalização conforme o crescimento"
  },
  "resultadoVisual": "2-3 frases descrevendo o resultado visual esperado após a coloração",
  "paletaFinal": {
    "basePrincipal": "#XXXXXX",
    "reflexo": "#XXXXXX",
    "iluminacao": "#XXXXXX",
    "profundidade": "#XXXXXX"
  }
}

Inclui EXACTAMENTE 6 cores recomendadas, 3 a 5 técnicas, e 4 a 5 cores a evitar. Todos os textos em português de Portugal.`;

export const colorAnalysisRouter = router({
  analyze: protectedProcedure
    .input(z.object({
      imageUrl: z.string().url("URL da imagem inválido"),
    }))
    .mutation(async ({ input }) => {
      try {
        const userMessage: Message = {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: input.imageUrl, detail: "high" },
            },
            { type: "text", text: buildUserPrompt() },
          ],
        };
        const response = await invokeLLM({
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            userMessage,
          ],
          response_format: { type: "json_object" },
        });

        const rawContent = response.choices?.[0]?.message?.content;
        if (!rawContent) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Sem resposta da IA" });
        }
        const content = typeof rawContent === "string" ? rawContent : JSON.stringify(rawContent);
        let parsed: unknown;
        try {
          parsed = JSON.parse(content);
        } catch {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Resposta da IA inválida" });
        }

        const validated = ColorAnalysisResultSchema.safeParse(parsed);
        if (!validated.success) {
          console.error("[ColorAnalysis] Validation error:", validated.error.issues);
          return parsed as ColorAnalysisResult;
        }

        return validated.data;
      } catch (err) {
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao analisar imagem. Tente novamente.",
        });
      }
    }),
});
