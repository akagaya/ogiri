import { z } from "zod";

export const createAnswerSchema = z.object({
  body: z
    .string()
    .min(1, "回答を入力してください")
    .max(500, "回答は500文字以下です"),
});

export const answerQuerySchema = z.object({
  sort: z.enum(["latest", "top_rated"]).default("latest"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type CreateAnswerInput = z.infer<typeof createAnswerSchema>;
export type AnswerQuery = z.infer<typeof answerQuerySchema>;
