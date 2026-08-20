import type { PrismaClient } from "@prisma/client";
import { AppError } from "../lib/errors.ts";

export class UserService {
  constructor(private db: PrismaClient) {}

  async getProfile(userId: string) {
    const user = await this.db.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            topics: { where: { deleted_at: null } },
            answers: { where: { deleted_at: null } },
          },
        },
      },
    });

    if (!user || user.deleted_at) {
      throw AppError.notFound("ユーザーが見つかりません");
    }

    return {
      id: user.id,
      username: user.username,
      display_name: user.display_name,
      topic_count: user._count.topics,
      answer_count: user._count.answers,
      created_at: user.created_at,
    };
  }

  async getTopics(userId: string, page: number, limit: number) {
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if (!user || user.deleted_at) {
      throw AppError.notFound("ユーザーが見つかりません");
    }

    const skip = (page - 1) * limit;
    const where = { user_id: userId, deleted_at: null };

    const [topics, total] = await Promise.all([
      this.db.topic.findMany({
        where,
        include: {
          user: { select: { id: true, display_name: true } },
          answers: {
            where: { deleted_at: null },
            select: {
              id: true,
              ratings: { select: { score: true } },
            },
          },
        },
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
      }),
      this.db.topic.count({ where }),
    ]);

    return {
      data: topics.map((t) => {
        const allScores = t.answers.flatMap((a) =>
          a.ratings.map((r) => r.score)
        );
        return {
          id: t.id,
          body: t.body,
          user: t.user,
          answer_count: t.answers.length,
          avg_score:
            allScores.length > 0
              ? Math.round(
                  (allScores.reduce((s, v) => s + v, 0) / allScores.length) *
                    10
                ) / 10
              : null,
          created_at: t.created_at,
        };
      }),
      meta: { page, limit, total },
    };
  }

  async getAnswers(userId: string, page: number, limit: number) {
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if (!user || user.deleted_at) {
      throw AppError.notFound("ユーザーが見つかりません");
    }

    const skip = (page - 1) * limit;
    const where = { user_id: userId, deleted_at: null };

    const [answers, total] = await Promise.all([
      this.db.answer.findMany({
        where,
        include: {
          topic: { select: { id: true, body: true } },
          ratings: { select: { score: true } },
          _count: { select: { comments: { where: { deleted_at: null } } } },
        },
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
      }),
      this.db.answer.count({ where }),
    ]);

    return {
      data: answers.map((a) => {
        const scores = a.ratings.map((r) => r.score);
        return {
          id: a.id,
          body: a.body,
          topic: a.topic,
          user: { id: user.id, display_name: user.display_name },
          user_id: user.id,
          avg_score:
            scores.length > 0
              ? Math.round(
                  (scores.reduce((s, v) => s + v, 0) / scores.length) * 10
                ) / 10
              : null,
          rating_count: a.ratings.length,
          comment_count: a._count.comments,
          created_at: a.created_at,
        };
      }),
      meta: { page, limit, total },
    };
  }

  async getComments(userId: string, page: number, limit: number) {
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if (!user || user.deleted_at) {
      throw AppError.notFound("ユーザーが見つかりません");
    }

    const skip = (page - 1) * limit;
    const where = { user_id: userId, deleted_at: null };

    const [comments, total] = await Promise.all([
      this.db.comment.findMany({
        where,
        include: {
          answer: { 
            select: { 
              id: true, 
              body: true,
              topic: { select: { id: true, body: true } }
            } 
          },
        },
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
      }),
      this.db.comment.count({ where }),
    ]);

    return {
      data: comments.map(c => ({
        id: c.id,
        body: c.body,
        user: { id: user.id, display_name: user.display_name },
        answer_id: c.answer_id,
        answer: c.answer,
        created_at: c.created_at,
      })),
      meta: { page, limit, total },
    };
  }
}
