export type ErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: ErrorCode,
    message: string,
    public readonly details?: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.name = "AppError";
  }

  static badRequest(
    message: string,
    details?: Array<{ field: string; message: string }>
  ) {
    return new AppError(400, "VALIDATION_ERROR", message, details);
  }

  static unauthorized(message: string = "認証が必要です") {
    return new AppError(401, "UNAUTHORIZED", message);
  }

  static forbidden(message: string = "権限がありません") {
    return new AppError(403, "FORBIDDEN", message);
  }

  static notFound(message: string = "リソースが見つかりません") {
    return new AppError(404, "NOT_FOUND", message);
  }

  static conflict(message: string) {
    return new AppError(409, "CONFLICT", message);
  }
}
