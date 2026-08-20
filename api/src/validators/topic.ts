import { z } from "zod";

export const createTopicSchema = z.object({
  body: z
    .string()
    .min(1, "お題を入力してください")
    .max(500, "お題は500文字以下です"),
});

export const topicQuerySchema = z.object({
  sort: z.enum(["latest", "popular"]).default("latest"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type CreateTopicInput = z.infer<typeof createTopicSchema>;
export type TopicQuery = z.infer<typeof topicQuerySchema>;
