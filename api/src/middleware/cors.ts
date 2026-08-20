import { cors } from "hono/cors";
import type { Env } from "../types/env.d.ts";
import type { MiddlewareHandler } from "hono";

export const corsMiddleware = (): MiddlewareHandler<Env> => {
  return async (c, next) => {
    const allowed = c.env.ALLOWED_ORIGIN;
    // 本番環境（同一オリジン）では CORS 不要
    if (!allowed) {
      return next();
    }
    // ローカル開発時のみ CORS を適用
    return cors({
      origin: (origin) => (origin === allowed ? origin : ""),
      credentials: true,
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type"],
      maxAge: 86400,
    })(c, next);
  };
};
