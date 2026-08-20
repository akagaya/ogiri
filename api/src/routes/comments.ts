import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import type { Env } from "../types/env.d.ts";
import { requireAuth, optionalAuth } from "../middleware/auth.ts";
import { CommentService } from "../services/comment.service.ts";
import {
  createCommentSchema,
  commentQuerySchema,
} from "../validators/comment.ts";
import { createPrismaClient } from "../lib/db.ts";

const comments = new Hono<Env>();

comments.get(
  "/answers/:answerId/comments",
  optionalAuth,
  zValidator("query", commentQuerySchema),
  async (c) => {
    const answerId = c.req.param("answerId");
    const query = c.req.valid("query");
    const db = createPrismaClient(c.env.DB);
    const service = new CommentService(db);

    const result = await service.listByAnswer(answerId, query);
    return c.json(result);
  }
);

comments.post(
  "/answers/:answerId/comments",
  requireAuth,
  zValidator("json", createCommentSchema),
  async (c) => {
    const answerId = c.req.param("answerId");
    const input = c.req.valid("json");
    const userId = c.get("userId");
    const db = createPrismaClient(c.env.DB);
    const service = new CommentService(db);

    const comment = await service.create(answerId, input, userId);
    return c.json({ data: comment }, 201);
  }
);

comments.delete(
  "/answers/:answerId/comments/:commentId",
  requireAuth,
  async (c) => {
    const commentId = c.req.param("commentId");
    const userId = c.get("userId");
    const db = createPrismaClient(c.env.DB);
    const service = new CommentService(db);

    await service.delete(commentId, userId);
    return c.body(null, 204);
  }
);

export default comments;
