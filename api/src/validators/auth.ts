import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "ユーザー名は3文字以上です")
    .max(32, "ユーザー名は32文字以下です")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "ユーザー名は英数字とアンダースコアのみ使用できます"
    ),
  display_name: z
    .string()
    .min(1, "表示名を入力してください")
    .max(50, "表示名は50文字以下です"),
  password: z
    .string()
    .min(8, "パスワードは8文字以上です")
    .max(72, "パスワードは72文字以下です"),
});

export const loginSchema = z.object({
  username: z.string().min(1, "ユーザー名を入力してください"),
  password: z.string().min(1, "パスワードを入力してください"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
