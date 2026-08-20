import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { setCookie, deleteCookie } from "hono/cookie";
import type { Env } from "../types/env.d.ts";
import { requireAuth } from "../middleware/auth.ts";
import { AuthService } from "../services/auth.service.ts";
import { registerSchema, loginSchema } from "../validators/auth.ts";
import { createPrismaClient } from "../lib/db.ts";

const auth = new Hono<Env>();

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "Strict" as const,
  path: "/",
  maxAge: 86400, // 24h
};

auth.post("/register", zValidator("json", registerSchema), async (c) => {
  const input = c.req.valid("json");
  const db = createPrismaClient(c.env.DB);
  const service = new AuthService(db);

  const result = await service.register(input, c.env.JWT_SECRET);

  setCookie(c, "token", result.token, COOKIE_OPTIONS);
  return c.json({ data: result.user }, 201);
});

auth.post("/login", zValidator("json", loginSchema), async (c) => {
  const input = c.req.valid("json");
  const db = createPrismaClient(c.env.DB);
  const service = new AuthService(db);

  const result = await service.login(input, c.env.JWT_SECRET);

  setCookie(c, "token", result.token, COOKIE_OPTIONS);
  return c.json({ data: result.user });
});

auth.post("/logout", async (c) => {
  deleteCookie(c, "token", { path: "/" });
  return c.body(null, 204);
});

auth.get("/me", requireAuth, async (c) => {
  const userId = c.get("userId");
  const db = createPrismaClient(c.env.DB);
  const service = new AuthService(db);

  const user = await service.me(userId);
  return c.json({ data: user });
});

export default auth;
