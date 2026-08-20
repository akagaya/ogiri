import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import type { Env } from "../types/env.d.ts";
import { requireAuth, optionalAuth } from "../middleware/auth.ts";
import { TopicService } from "../services/topic.service.ts";
import { createTopicSchema, topicQuerySchema } from "../validators/topic.ts";
import { createPrismaClient } from "../lib/db.ts";

const topics = new Hono<Env>();

topics.get("/", optionalAuth, zValidator("query", topicQuerySchema), async (c) => {
  const query = c.req.valid("query");
  const db = createPrismaClient(c.env.DB);
  const service = new TopicService(db);

  const result = await service.list(query);
  return c.json(result);
});

topics.post("/", requireAuth, zValidator("json", createTopicSchema), async (c) => {
  const input = c.req.valid("json");
  const userId = c.get("userId");
  const db = createPrismaClient(c.env.DB);
  const service = new TopicService(db);

  const topic = await service.create(input, userId);
  return c.json({ data: topic }, 201);
});

topics.get("/:topicId", optionalAuth, async (c) => {
  const topicId = c.req.param("topicId");
  const db = createPrismaClient(c.env.DB);
  const service = new TopicService(db);

  const topic = await service.getById(topicId);
  return c.json({ data: topic });
});

topics.delete("/:topicId", requireAuth, async (c) => {
  const topicId = c.req.param("topicId");
  const userId = c.get("userId");
  const db = createPrismaClient(c.env.DB);
  const service = new TopicService(db);

  await service.delete(topicId, userId);
  return c.body(null, 204);
});

export default topics;
