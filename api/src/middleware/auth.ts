import { createMiddleware } from "hono/factory";
import type { Env } from "../types/env.d.ts";
import { verifyJwt } from "../lib/auth.ts";
import { AppError } from "../lib/errors.ts";
import { getCookie } from "hono/cookie";

/**
 * 認証必須ミドルウェア
 * Cookie から JWT を検証し、userId を context にセット
 */
export const requireAuth = createMiddleware<Env>(async (c, next) => {
  const token = getCookie(c, "token");
  if (!token) {
    throw AppError.unauthorized();
  }

  const payload = await verifyJwt(token, c.env.JWT_SECRET);
  if (!payload) {
    throw AppError.unauthorized("トークンが無効または期限切れです");
  }

  c.set("userId", payload.sub);
  await next();
});

/**
 * 認証任意ミドルウェア
 * Cookie に JWT があれば検証し userId をセット。なくてもエラーにしない
 */
export const optionalAuth = createMiddleware<Env>(async (c, next) => {
  const token = getCookie(c, "token");
  if (token) {
    const payload = await verifyJwt(token, c.env.JWT_SECRET);
    if (payload) {
      c.set("userId", payload.sub);
    }
  }
  await next();
});
