import type { PrismaClient } from "@prisma/client";
import { generateId } from "../lib/ulid.ts";
import { AppError } from "../lib/errors.ts";
import type {
  CreateCommentInput,
  CommentQuery,
} from "../validators/comment.ts";

export class CommentService {
  constructor(private db: PrismaClient) {}

  async listByAnswer(answerId: string, query: CommentQuery) {
    const answer = await this.db.answer.findUnique({
      where: { id: answerId },
    });
    if (!answer || answer.deleted_at) {
      throw AppError.notFound("回答が見つかりません");
    }

    const { page, limit } = query;
    const skip = (page - 1) * limit;
    const where = { answer_id: answerId, deleted_at: null };

    const [comments, total] = await Promise.all([
      this.db.comment.findMany({
        where,
        include: {
          user: { select: { id: true, display_name: true } },
        },
        orderBy: { created_at: "asc" },
        skip,
        take: limit,
      }),
      this.db.comment.count({ where }),
    ]);

    return {
      data: comments.map((c) => ({
        id: c.id,
        body: c.body,
        user: c.user,
        created_at: c.created_at,
      })),
      meta: { page, limit, total },
    };
  }

  async create(
    answerId: string,
    input: CreateCommentInput,
    userId: string
  ) {
    const answer = await this.db.answer.findUnique({
      where: { id: answerId },
    });
    if (!answer || answer.deleted_at) {
      throw AppError.notFound("回答が見つかりません");
    }

    const comment = await this.db.comment.create({
      data: {
        id: generateId(),
        body: input.body,
        answer_id: answerId,
        user_id: userId,
      },
      include: {
        user: { select: { id: true, display_name: true } },
      },
    });

    return {
      id: comment.id,
      body: comment.body,
      user: comment.user,
      created_at: comment.created_at,
    };
  }

  async delete(commentId: string, userId: string) {
    const comment = await this.db.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment || comment.deleted_at) {
      throw AppError.notFound("コメントが見つかりません");
    }

    if (comment.user_id !== userId) {
      throw AppError.forbidden("自分のコメントのみ削除できます");
    }

    await this.db.comment.update({
      where: { id: commentId },
      data: { deleted_at: new Date() },
    });
  }
}
