import type { PrismaClient } from "@prisma/client";
import { generateId } from "../lib/ulid.ts";
import { AppError } from "../lib/errors.ts";
import type { CreateAnswerInput, AnswerQuery } from "../validators/answer.ts";

export class AnswerService {
  constructor(private db: PrismaClient) {}

  async listByTopic(
    topicId: string,
    query: AnswerQuery,
    currentUserId?: string
  ) {
    // お題の存在確認
    const topic = await this.db.topic.findUnique({
      where: { id: topicId },
    });
    if (!topic || topic.deleted_at) {
      throw AppError.notFound("お題が見つかりません");
    }

    const { sort, page, limit } = query;
    const skip = (page - 1) * limit;
    const where = { topic_id: topicId, deleted_at: null };

    const [answers, total] = await Promise.all([
      this.db.answer.findMany({
        where,
        include: {
          user: { select: { id: true, display_name: true } },
          ratings: { select: { score: true, user_id: true } },
          _count: { select: { comments: { where: { deleted_at: null } } } },
        },
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
      }),
      this.db.answer.count({ where }),
    ]);

    let result = answers.map((a) => {
      const scores = a.ratings.map((r) => r.score);
      const myRating = currentUserId
        ? a.ratings.find((r) => r.user_id === currentUserId)?.score ?? null
        : null;

      return {
        id: a.id,
        body: a.body,
        user: a.user,
        avg_score:
          scores.length > 0
            ? Math.round(
                (scores.reduce((s, v) => s + v, 0) / scores.length) * 10
              ) / 10
            : null,
        rating_count: a.ratings.length,
        comment_count: a._count.comments,
        my_rating: myRating,
        created_at: a.created_at,
      };
    });

    // top_rated ソートはアプリケーション層で行う（Prisma で集計ソートが困難）
    if (sort === "top_rated") {
      result.sort((a, b) => (b.avg_score ?? -1) - (a.avg_score ?? -1));
    }

    return {
      data: result,
      meta: { page, limit, total },
    };
  }

  async getById(answerId: string, currentUserId?: string) {
    const answer = await this.db.answer.findUnique({
      where: { id: answerId },
      include: {
        topic: { select: { id: true, body: true } },
        user: { select: { id: true, display_name: true } },
        ratings: { select: { score: true, user_id: true } },
        _count: { select: { comments: { where: { deleted_at: null } } } },
      },
    });

    if (!answer || answer.deleted_at) {
      throw AppError.notFound("回答が見つかりません");
    }

    const scores = answer.ratings.map((r) => r.score);
    const myRating = currentUserId
      ? answer.ratings.find((r) => r.user_id === currentUserId)?.score ?? null
      : null;

    return {
      id: answer.id,
      body: answer.body,
      topic: answer.topic,
      user: answer.user,
      avg_score:
        scores.length > 0
          ? Math.round(
              (scores.reduce((s, v) => s + v, 0) / scores.length) * 10
            ) / 10
          : null,
      rating_count: answer.ratings.length,
      comment_count: answer._count.comments,
      my_rating: myRating,
      created_at: answer.created_at,
    };
  }

  async create(topicId: string, input: CreateAnswerInput, userId: string) {
    const topic = await this.db.topic.findUnique({
      where: { id: topicId },
    });
    if (!topic || topic.deleted_at) {
      throw AppError.notFound("お題が見つかりません");
    }

    const answer = await this.db.answer.create({
      data: {
        id: generateId(),
        body: input.body,
        topic_id: topicId,
        user_id: userId,
      },
      include: {
        user: { select: { id: true, display_name: true } },
      },
    });

    return {
      id: answer.id,
      body: answer.body,
      user: answer.user,
      avg_score: null,
      rating_count: 0,
      comment_count: 0,
      created_at: answer.created_at,
    };
  }

  async delete(answerId: string, userId: string) {
    const answer = await this.db.answer.findUnique({
      where: { id: answerId },
    });

    if (!answer || answer.deleted_at) {
      throw AppError.notFound("回答が見つかりません");
    }

    if (answer.user_id !== userId) {
      throw AppError.forbidden("自分の回答のみ削除できます");
    }

    await this.db.answer.update({
      where: { id: answerId },
      data: { deleted_at: new Date() },
    });
  }
}
