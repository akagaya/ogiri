import type { PrismaClient } from "@prisma/client";
import { generateId } from "../lib/ulid.ts";
import { AppError } from "../lib/errors.ts";
import type { CreateTopicInput, TopicQuery } from "../validators/topic.ts";

export class TopicService {
  constructor(private db: PrismaClient) {}

  async list(query: TopicQuery) {
    const { sort, page, limit } = query;
    const skip = (page - 1) * limit;

    const where = { deleted_at: null };

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
        orderBy:
          sort === "popular"
            ? { answers: { _count: "desc" } }
            : { created_at: "desc" },
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
                  (allScores.reduce((s, v) => s + v, 0) / allScores.length) * 10
                ) / 10
              : null,
          created_at: t.created_at,
        };
      }),
      meta: { page, limit, total },
    };
  }

  async getById(topicId: string) {
    const topic = await this.db.topic.findUnique({
      where: { id: topicId },
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
    });

    if (!topic || topic.deleted_at) {
      throw AppError.notFound("お題が見つかりません");
    }

    const allScores = topic.answers.flatMap((a) =>
      a.ratings.map((r) => r.score)
    );

    return {
      id: topic.id,
      body: topic.body,
      user: topic.user,
      answer_count: topic.answers.length,
      avg_score:
        allScores.length > 0
          ? Math.round(
              (allScores.reduce((s, v) => s + v, 0) / allScores.length) * 10
            ) / 10
          : null,
      created_at: topic.created_at,
    };
  }

  async create(input: CreateTopicInput, userId: string) {
    const topic = await this.db.topic.create({
      data: {
        id: generateId(),
        body: input.body,
        user_id: userId,
      },
      include: {
        user: { select: { id: true, display_name: true } },
      },
    });

    return {
      id: topic.id,
      body: topic.body,
      user: topic.user,
      answer_count: 0,
      avg_score: null,
      created_at: topic.created_at,
    };
  }

  async delete(topicId: string, userId: string) {
    const topic = await this.db.topic.findUnique({
      where: { id: topicId },
    });

    if (!topic || topic.deleted_at) {
      throw AppError.notFound("お題が見つかりません");
    }

    if (topic.user_id !== userId) {
      throw AppError.forbidden("自分のお題のみ削除できます");
    }

    await this.db.topic.update({
      where: { id: topicId },
      data: { deleted_at: new Date() },
    });
  }
}
