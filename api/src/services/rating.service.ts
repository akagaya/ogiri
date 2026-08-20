import type { PrismaClient } from "@prisma/client";
import { generateId } from "../lib/ulid.ts";
import { AppError } from "../lib/errors.ts";
import type { RatingInput } from "../validators/rating.ts";

export class RatingService {
  constructor(private db: PrismaClient) {}

  async upsert(answerId: string, input: RatingInput, userId: string) {
    // 回答の存在確認
    const answer = await this.db.answer.findUnique({
      where: { id: answerId },
    });
    if (!answer || answer.deleted_at) {
      throw AppError.notFound("回答が見つかりません");
    }

    // 既存の評価を検索
    const existing = await this.db.rating.findUnique({
      where: { answer_id_user_id: { answer_id: answerId, user_id: userId } },
    });

    if (existing) {
      // 更新
      const updated = await this.db.rating.update({
        where: { id: existing.id },
        data: { score: input.score },
        include: {
          user: { select: { id: true, display_name: true } },
        },
      });
      return { rating: updated, isNew: false };
    } else {
      // 新規作成
      const created = await this.db.rating.create({
        data: {
          id: generateId(),
          score: input.score,
          answer_id: answerId,
          user_id: userId,
        },
        include: {
          user: { select: { id: true, display_name: true } },
        },
      });
      return { rating: created, isNew: true };
    }
  }

  async listByAnswer(answerId: string) {
    const answer = await this.db.answer.findUnique({
      where: { id: answerId },
    });
    if (!answer || answer.deleted_at) {
      throw AppError.notFound("回答が見つかりません");
    }

    const ratings = await this.db.rating.findMany({
      where: { answer_id: answerId },
      include: {
        user: { select: { id: true, display_name: true } },
      },
      orderBy: { created_at: "desc" },
    });

    return ratings.map((r) => ({
      id: r.id,
      score: r.score,
      user: r.user,
      created_at: r.created_at,
    }));
  }

  async delete(answerId: string, userId: string) {
    const rating = await this.db.rating.findUnique({
      where: { answer_id_user_id: { answer_id: answerId, user_id: userId } },
    });

    if (!rating) {
      throw AppError.notFound("評価が見つかりません");
    }

    await this.db.rating.delete({
      where: { id: rating.id },
    });
  }
}
