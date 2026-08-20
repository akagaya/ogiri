import type { PrismaClient } from "@prisma/client";

export type Env = {
  Bindings: {
    DB: D1Database;
    JWT_SECRET: string;
    ALLOWED_ORIGIN: string;
  };
  Variables: {
    db: PrismaClient;
    userId: string;
  };
};
