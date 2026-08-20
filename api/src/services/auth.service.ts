import type { PrismaClient } from "@prisma/client";
import { generateId } from "../lib/ulid.ts";
import { hashPassword, verifyPassword, generateJwt } from "../lib/auth.ts";
import { AppError } from "../lib/errors.ts";
import type { RegisterInput, LoginInput } from "../validators/auth.ts";

export class AuthService {
  constructor(private db: PrismaClient) {}

  async register(input: RegisterInput, jwtSecret: string) {
    // ユーザー名の重複チェック
    const existing = await this.db.user.findUnique({
      where: { username: input.username },
    });
    if (existing) {
      throw AppError.conflict("このユーザー名は既に使用されています");
    }

    const id = generateId();
    const password_hash = await hashPassword(input.password);

    const user = await this.db.user.create({
      data: {
        id,
        username: input.username,
        display_name: input.display_name,
        password_hash,
      },
    });

    const token = await generateJwt(
      { sub: user.id, username: user.username },
      jwtSecret
    );

    return {
      user: {
        id: user.id,
        username: user.username,
        display_name: user.display_name,
        created_at: user.created_at,
      },
      token,
    };
  }

  async login(input: LoginInput, jwtSecret: string) {
    const user = await this.db.user.findUnique({
      where: { username: input.username },
    });

    if (!user || user.deleted_at) {
      throw AppError.unauthorized("ユーザー名またはパスワードが正しくありません");
    }

    const valid = await verifyPassword(input.password, user.password_hash);
    if (!valid) {
      throw AppError.unauthorized("ユーザー名またはパスワードが正しくありません");
    }

    const token = await generateJwt(
      { sub: user.id, username: user.username },
      jwtSecret
    );

    return {
      user: {
        id: user.id,
        username: user.username,
        display_name: user.display_name,
      },
      token,
    };
  }

  async me(userId: string) {
    const user = await this.db.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.deleted_at) {
      throw AppError.unauthorized();
    }

    return {
      id: user.id,
      username: user.username,
      display_name: user.display_name,
      created_at: user.created_at,
    };
  }
}
