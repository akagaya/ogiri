import { Hono } from "hono";
import type { Env } from "./types/env.d.ts";
import { corsMiddleware } from "./middleware/cors.ts";
import { errorHandler } from "./middleware/error-handler.ts";
import authRoutes from "./routes/auth.ts";
import topicRoutes from "./routes/topics.ts";
import answerRoutes from "./routes/answers.ts";
import ratingRoutes from "./routes/ratings.ts";
import commentRoutes from "./routes/comments.ts";
import userRoutes from "./routes/users.ts";

const app = new Hono<Env>();

// グローバルミドルウェア
app.use("*", corsMiddleware());
app.onError(errorHandler);

// ヘルスチェック
app.get("/api/v1/health", (c) => c.json({ status: "ok" }));

// ルートマウント
app.route("/api/v1/auth", authRoutes);
app.route("/api/v1/topics", topicRoutes);
app.route("/api/v1", answerRoutes);
app.route("/api/v1", ratingRoutes);
app.route("/api/v1", commentRoutes);
app.route("/api/v1/users", userRoutes);

export default app;
