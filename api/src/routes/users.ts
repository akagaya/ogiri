import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import type { Env } from "../types/env.d.ts";
import { optionalAuth } from "../middleware/auth.ts";
import { UserService } from "../services/user.service.ts";
import { createPrismaClient } from "../lib/db.ts";

const users = new Hono<Env>();

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

users.get("/:userId", optionalAuth, async (c) => {
  const userId = c.req.param("userId");
  const db = createPrismaClient(c.env.DB);
  const service = new UserService(db);

  const profile = await service.getProfile(userId);
  return c.json({ data: profile });
});

users.get(
  "/:userId/topics",
  optionalAuth,
  zValidator("query", paginationSchema),
  async (c) => {
    const userId = c.req.param("userId");
    const { page, limit } = c.req.valid("query");
    const db = createPrismaClient(c.env.DB);
    const service = new UserService(db);

    const result = await service.getTopics(userId, page, limit);
    return c.json(result);
  }
);

users.get(
  "/:userId/answers",
  optionalAuth,
  zValidator("query", paginationSchema),
  async (c) => {
    const userId = c.req.param("userId");
    const { page, limit } = c.req.valid("query");
    const db = createPrismaClient(c.env.DB);
    const service = new UserService(db);

    const result = await service.getAnswers(userId, page, limit);
    return c.json(result);
  }
);

users.get(
  "/:userId/comments",
  optionalAuth,
  zValidator("query", paginationSchema),
  async (c) => {
    const userId = c.req.param("userId");
    const { page, limit } = c.req.valid("query");
    const db = createPrismaClient(c.env.DB);
    const service = new UserService(db);

    const result = await service.getComments(userId, page, limit);
    return c.json(result);
  }
);

export default users;
