import { z } from "zod";

export const ratingSchema = z.object({
  score: z
    .number()
    .int("スコアは整数で入力してください")
    .min(0, "スコアは0以上です")
    .max(10, "スコアは10以下です"),
});

export type RatingInput = z.infer<typeof ratingSchema>;
