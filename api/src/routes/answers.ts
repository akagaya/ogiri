import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import type { Env } from "../types/env.d.ts";
import { requireAuth, optionalAuth } from "../middleware/auth.ts";
import { AnswerService } from "../services/answer.service.ts";
import { createAnswerSchema, answerQuerySchema } from "../validators/answer.ts";
import { createPrismaClient } from "../lib/db.ts";

const answers = new Hono<Env>();

// お題に紐づく回答一覧（topics ルートからマウントされる想定だが、単独でも使用可能）
answers.get(
  "/topics/:topicId/answers",
  optionalAuth,
  zValidator("query", answerQuerySchema),
  async (c) => {
    const topicId = c.req.param("topicId");
    const query = c.req.valid("query");
    const currentUserId = c.get("userId");
    const db = createPrismaClient(c.env.DB);
    const service = new AnswerService(db);

    const result = await service.listByTopic(topicId, query, currentUserId);
    return c.json(result);
  }
);

answers.post(
  "/topics/:topicId/answers",
  requireAuth,
  zValidator("json", createAnswerSchema),
  async (c) => {
    const topicId = c.req.param("topicId");
    const input = c.req.valid("json");
    const userId = c.get("userId");
    const db = createPrismaClient(c.env.DB);
    const service = new AnswerService(db);

    const answer = await service.create(topicId, input, userId);
    return c.json({ data: answer }, 201);
  }
);

answers.get("/answers/:answerId", optionalAuth, async (c) => {
  const answerId = c.req.param("answerId");
  const currentUserId = c.get("userId");
  const db = createPrismaClient(c.env.DB);
  const service = new AnswerService(db);

  const answer = await service.getById(answerId, currentUserId);
  return c.json({ data: answer });
});

answers.delete("/answers/:answerId", requireAuth, async (c) => {
  const answerId = c.req.param("answerId");
  const userId = c.get("userId");
  const db = createPrismaClient(c.env.DB);
  const service = new AnswerService(db);

  await service.delete(answerId, userId);
  return c.body(null, 204);
});

export default answers;
