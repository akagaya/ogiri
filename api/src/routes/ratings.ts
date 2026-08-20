import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import type { Env } from "../types/env.d.ts";
import { requireAuth, optionalAuth } from "../middleware/auth.ts";
import { RatingService } from "../services/rating.service.ts";
import { ratingSchema } from "../validators/rating.ts";
import { createPrismaClient } from "../lib/db.ts";

const ratings = new Hono<Env>();

ratings.put(
  "/answers/:answerId/rating",
  requireAuth,
  zValidator("json", ratingSchema),
  async (c) => {
    const answerId = c.req.param("answerId");
    const input = c.req.valid("json");
    const userId = c.get("userId");
    const db = createPrismaClient(c.env.DB);
    const service = new RatingService(db);

    const { rating, isNew } = await service.upsert(answerId, input, userId);
    return c.json(
      {
        data: {
          id: rating.id,
          score: rating.score,
          user: rating.user,
          created_at: rating.created_at,
        },
      },
      isNew ? 201 : 200
    );
  }
);

ratings.get("/answers/:answerId/ratings", optionalAuth, async (c) => {
  const answerId = c.req.param("answerId");
  const db = createPrismaClient(c.env.DB);
  const service = new RatingService(db);

  const data = await service.listByAnswer(answerId);
  return c.json({ data });
});

ratings.delete("/answers/:answerId/rating", requireAuth, async (c) => {
  const answerId = c.req.param("answerId");
  const userId = c.get("userId");
  const db = createPrismaClient(c.env.DB);
  const service = new RatingService(db);

  await service.delete(answerId, userId);
  return c.body(null, 204);
});

export default ratings;
