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
  // Seasonal classification
  classificacaoSazonal: z.string(),
  explicacaoSazonal: z.string(),
  // Recommendations
  coresRecomendadas: z.array(HairColorSchema).min(6).max(8),
  tecnicasRecomendadas: z.array(TechniqueSchema).min(3).max(5),
  coresAEvitar: z.array(AvoidColorSchema).min(4).max(6),
  // Salon formula
  formulaSalao: SalonFormulaSchema,
  // Visual result
  resultadoVisual: z.string(),
  // Final palette
  paletaFinal: FinalPaletteSchema,
});

export type ColorAnalysisResult = z.infer<typeof ColorAnalysisResultSchema>;

const SYSTEM_PROMPT = `Você é um especialista em colorimetria capilar e análise de cor pessoal, com profundo conhecimento do Método Sazonal Expandido de 12 estações. Analisa imagens de rostos humanos e fornece recomendações profissionais de cor de cabelo em português de Portugal. Responde SEMPRE em JSON válido, sem texto adicional fora do JSON.`;

const buildUserPrompt = () => `Analisa esta fotografia de rosto e realiza uma análise profissional completa de cor de cabelo usando o Método Sazonal Expandido (12 estações).

Avalia as seguintes dimensões:
1. SUBTOM DA PELE: Quente/dourado/amarelado | Frio/rosado/azulado | Neutro/misto
2. PROFUNDIDADE: Clara | Média | Escura
3. INTENSIDADE: Viva e contrastante | Suave e harmónica
4. CONTRASTE: Alto contraste | Médio contraste | Baixo contraste
5. BASE NATURAL DO CABELO: Loiro claro | Loiro escuro | Castanho claro | Castanho médio | Castanho escuro | Preto | Ruivo natural | Grisalho | Base artificial ou indefinida

Classifica numa das 12 estações sazonais:
- Primavera Clara, Primavera Quente, Primavera Brilhante
- Verão Claro, Verão Suave, Verão Frio
- Outono Suave, Outono Quente, Outono Escuro
- Inverno Frio, Inverno Escuro, Inverno Brilhante

Responde EXCLUSIVAMENTE com este JSON (sem markdown, sem texto extra):
{
  "subtom": "string",
  "profundidade": "string",
  "intensidade": "string",
  "contraste": "string",
  "baseNatural": "string",
  "classificacaoSazonal": "string",
  "explicacaoSazonal": "string (2-3 frases explicando a classificação)",
  "coresRecomendadas": [
    {
      "name": "Nome da cor em português",
      "description": "Descrição técnica profissional de salão",
      "whyItWorks": "Porque valoriza esta cliente específica",
      "hex": "#XXXXXX"
    }
  ],
  "tecnicasRecomendadas": [
    {
      "name": "Nome da técnica",
      "reason": "Porque é ideal para esta cliente"
    }
  ],
  "coresAEvitar": [
    {
      "name": "Nome da cor",
      "hex": "#XXXXXX",
      "reason": "Razão curta em português"
    }
  ],
  "formulaSalao": {
    "alturaIdeal": "string",
    "reflexoIdeal": "string",
    "temperatura": "string",
    "contraste": "string",
    "manutencao": "string",
    "retoque": "string"
  },
  "resultadoVisual": "string (2-3 frases descrevendo o resultado visual esperado)",
  "paletaFinal": {
    "basePrincipal": "#XXXXXX",
    "reflexo": "#XXXXXX",
    "iluminacao": "#XXXXXX",
    "profundidade": "#XXXXXX"
  }
}

Inclui 6 a 8 cores recomendadas, 3 a 5 técnicas, e 4 a 6 cores a evitar. Todos os textos em português de Portugal.`;

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
          parsed = JSON.parse(content);;
        } catch {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Resposta da IA inválida" });
        }

        const validated = ColorAnalysisResultSchema.safeParse(parsed);
        if (!validated.success) {
          console.error("[ColorAnalysis] Validation error:", validated.error.issues);
          // Return raw parsed if validation fails partially — still useful
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
