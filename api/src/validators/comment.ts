import { z } from "zod";

export const createCommentSchema = z.object({
  body: z
    .string()
    .min(1, "コメントを入力してください")
    .max(500, "コメントは500文字以下です"),
});

export const commentQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type CommentQuery = z.infer<typeof commentQuerySchema>;
