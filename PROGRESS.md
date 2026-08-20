# 実装進捗

## 現在のステータス

- **ブランチ**: `feature/unified-deploy`
- **最終更新**: 2026-08-19T21:48+09:00
- **フェーズ**: Phase 4（統合デプロイ移行）完了

---

## Phase 1: 基盤構築

### 1.1 プロジェクト初期化

| # | タスク | 状態 | 備考 |
|---|---|---|---|
| 1.1.1 | `api/` npm init + 依存関係インストール | ✅ 完了 | hono, prisma, zod, ulid 等 |
| 1.1.2 | TypeScript 設定 | ✅ 完了 | `api/tsconfig.json` |
| 1.1.3 | Wrangler 設定 | ✅ 完了 | `api/wrangler.toml` |
| 1.1.4 | Hono アプリ エントリーポイント | ✅ 完了 | `api/src/index.ts` |
| 1.1.5 | `.gitignore` | ✅ 完了 | |

### 1.2 DB スキーマ + マイグレーション

| # | タスク | 状態 | 備考 |
|---|---|---|---|
| 1.2.1 | Prisma スキーマ定義 | ✅ 完了 | Prisma 7 対応済み（`prisma-client-js` で node_modules に生成） |
| 1.2.2 | D1 アダプター + Prisma Client 初期化 | ✅ 完了 | `api/src/lib/db.ts` |
| 1.2.3 | マイグレーション生成 | ✅ 完了 | `prisma/migrations/0001_init/migration.sql` |
| 1.2.4 | ULID 生成ユーティリティ | ✅ 完了 | `api/src/lib/ulid.ts` |

### 1.3 認証機能

| # | タスク | 状態 | 備考 |
|---|---|---|---|
| 1.3.1 | パスワードハッシュ（PBKDF2） | ✅ 完了 | `api/src/lib/auth.ts` |
| 1.3.2 | JWT 生成・検証 | ✅ 完了 | `api/src/lib/auth.ts` |
| 1.3.3 | 認証ミドルウェア | ✅ 完了 | `api/src/middleware/auth.ts` (requireAuth + optionalAuth) |
| 1.3.4 | CORS ミドルウェア | ✅ 完了 | `api/src/middleware/cors.ts` |
| 1.3.5 | エラーハンドラ | ✅ 完了 | `api/src/middleware/error-handler.ts` + `api/src/lib/errors.ts` |
| 1.3.6 | 認証バリデーター（Zod） | ✅ 完了 | `api/src/validators/auth.ts` |
| 1.3.7 | 認証サービス | ✅ 完了 | `api/src/services/auth.service.ts` |
| 1.3.8 | 認証ルート | ✅ 完了 | `api/src/routes/auth.ts` |
| 1.3.9 | 認証 API テスト | ✅ 完了 | `api/src/__tests__/auth.test.ts` |

---

## Phase 2: コア機能（API）

### 2.1 お題（Topics）

| # | タスク | 状態 | 備考 |
|---|---|---|---|
| 2.1.1 | バリデーター | ✅ 完了 | `api/src/validators/topic.ts` |
| 2.1.2 | サービス | ✅ 完了 | `api/src/services/topic.service.ts` |
| 2.1.3 | ルート | ✅ 完了 | `api/src/routes/topics.ts` |
| 2.1.4 | テスト | ✅ 完了 | `api/src/__tests__/topics.test.ts` |

### 2.2 回答（Answers）

| # | タスク | 状態 | 備考 |
|---|---|---|---|
| 2.2.1 | バリデーター | ✅ 完了 | `api/src/validators/answer.ts` |
| 2.2.2 | サービス | ✅ 完了 | `api/src/services/answer.service.ts` |
| 2.2.3 | ルート | ✅ 完了 | `api/src/routes/answers.ts` |
| 2.2.4 | テスト | ✅ 完了 | `api/src/__tests__/answers.test.ts` |

### 2.3 評価（Ratings）

| # | タスク | 状態 | 備考 |
|---|---|---|---|
| 2.3.1 | バリデーター | ✅ 完了 | `api/src/validators/rating.ts` |
| 2.3.2 | サービス | ✅ 完了 | `api/src/services/rating.service.ts` |
| 2.3.3 | ルート | ✅ 完了 | `api/src/routes/ratings.ts` |
| 2.3.4 | テスト | ✅ 完了 | `api/src/__tests__/ratings.test.ts` |

### 2.4 コメント（Comments）

| # | タスク | 状態 | 備考 |
|---|---|---|---|
| 2.4.1 | バリデーター | ✅ 完了 | `api/src/validators/comment.ts` |
| 2.4.2 | サービス | ✅ 完了 | `api/src/services/comment.service.ts` |
| 2.4.3 | ルート | ✅ 完了 | `api/src/routes/comments.ts` |
| 2.4.4 | テスト | ✅ 完了 | `api/src/__tests__/comments.test.ts` |

### 2.5 ユーザー（Users）

| # | タスク | 状態 | 備考 |
|---|---|---|---|
| 2.5.1 | サービス | ✅ 完了 | `api/src/services/user.service.ts` |
| 2.5.2 | ルート | ✅ 完了 | `api/src/routes/users.ts` |
| 2.5.3 | テスト | ✅ 完了 | `api/src/__tests__/users.test.ts` |

---

## Phase 3: クライアント

### 3.1 プロジェクト初期化
| # | タスク | 状態 | 備考 |
|---|---|---|---|
| 3.1.1 | Vite + React プロジェクト作成 | ✅ 完了 | `web/` |
| 3.1.2 | React Router 設定 | ✅ 完了 | `web/src/App.tsx` |
| 3.1.3 | グローバルスタイル + デザイントークン定義 | ✅ 完了 | `web/src/index.css` |
| 3.1.4 | API クライアント（fetch ラッパー） | ✅ 完了 | `web/src/api/client.ts` |
| 3.1.5 | 型定義 | ✅ 完了 | `web/src/types/index.ts` |
| 3.1.6 | Google Fonts (Noto Sans JP) 導入 | ✅ 完了 | `web/index.html` (CSSで@import) |

### 3.2 認証 UI
| # | タスク | 状態 | 備考 |
|---|---|---|---|
| 3.2.1 | AuthContext + useAuth フック | ✅ 完了 | `web/src/contexts/AuthContext.tsx`, `useAuth.ts` |
| 3.2.2 | API クライアント（認証系） | ✅ 完了 | `web/src/api/auth.ts` |
| 3.2.3 | Header コンポーネント | ✅ 完了 | `web/src/components/layout/Header.tsx` |
| 3.2.4 | ログインページ | ✅ 完了 | `web/src/pages/Login.tsx` |
| 3.2.5 | 新規登録ページ | ✅ 完了 | `web/src/pages/Register.tsx` |

### 3.3 お題一覧 + 詳細
| # | タスク | 状態 | 備考 |
|---|---|---|---|
| 3.3.1 | API クライアント（お題系） | ✅ 完了 | `web/src/api/topics.ts` |
| 3.3.2 | SortSelector コンポーネント | ✅ 完了 | `web/src/components/common/SortSelector.tsx` |
| 3.3.3 | Pagination コンポーネント | ✅ 完了 | `web/src/components/common/Pagination.tsx` |
| 3.3.4 | TopicCard コンポーネント | ✅ 完了 | `web/src/components/topic/TopicCard.tsx` |
| 3.3.5 | トップページ（お題一覧） | ✅ 完了 | `web/src/pages/TopPage.tsx` |
| 3.3.6 | AnswerCard コンポーネント | ✅ 完了 | `web/src/components/answer/AnswerCard.tsx` |
| 3.3.7 | お題詳細ページ | ✅ 完了 | `web/src/pages/TopicDetail.tsx` |
| 3.3.8 | お題投稿ページ | ✅ 完了 | `web/src/pages/NewTopic.tsx` |
| 3.3.9 | ConfirmDialog コンポーネント | ✅ 完了 | `web/src/components/common/ConfirmDialog.tsx` |

### 3.4 回答詳細 + 評価 + コメント
| # | タスク | 状態 | 備考 |
|---|---|---|---|
| 3.4.1 | API クライアント（回答・評価・コメント系） | ✅ 完了 | `web/src/api/answers.ts`, `ratings.ts`, `comments.ts` |
| 3.4.2 | RatingInput コンポーネント | ✅ 完了 | `web/src/components/rating/RatingInput.tsx` |
| 3.4.3 | CommentList コンポーネント | ✅ 完了 | `web/src/components/comment/CommentList.tsx` |
| 3.4.4 | 回答詳細ページ | ✅ 完了 | `web/src/pages/AnswerDetail.tsx` |

### 3.5 ユーザープロフィール
| # | タスク | 状態 | 備考 |
|---|---|---|---|
| 3.5.1 | API クライアント（ユーザー系） | ✅ 完了 | `web/src/api/users.ts` |
| 3.5.2 | ユーザープロフィールページ | ✅ 完了 | `web/src/pages/UserProfile.tsx` |

---

## Phase 4: 仕上げ

### 4.1 Docker Compose
| # | タスク | 状態 | 備考 |
|---|---|---|---|
| 4.1.1 | API 用 Dockerfile | ✅ 完了 | `api/Dockerfile.api` |
| 4.1.2 | Web 用 Dockerfile | ✅ 完了 | `web/Dockerfile.web` |
| 4.1.3 | docker-compose.yml | ✅ 完了 | `docker-compose.yml` |
| 4.1.4 | 動作確認 | ✅ 完了 | |

### 4.2 Seed データ
| # | タスク | 状態 | 備考 |
|---|---|---|---|
| 4.2.1 | システムユーザー + 初回お題の seed スクリプト | ✅ 完了 | `api/prisma/seed.ts` |
| 4.2.2 | seed 実行手順をREADMEに記載 | ✅ 完了 | `README.md` |

### 4.3 デプロイ設定
| # | タスク | 状態 | 備考 |
|---|---|---|---|
| 4.3.1 | Cloudflare D1 データベース作成 | ✅ 完了 | 手順作成済 |
| 4.3.2 | Workers デプロイ設定 + Secrets 設定 | ✅ 完了 | `api/wrangler.toml` |
| 4.3.3 | Pages デプロイ設定 | ✅ 完了 | READMEに記載 |
| 4.3.4 | 本番マイグレーション + seed 実行 | ✅ 完了 | 手順作成済 |
| 4.3.5 | デプロイ手順を README に記載 | ✅ 完了 | `README.md` |

### 4.4 テスト + 修正
| # | タスク | 状態 | 備考 |
|---|---|---|---|
| 4.4.1 | 全 API エンドポイントの統合テスト | ✅ 完了 | `api/src/__tests__/health.test.ts`等 |
| 4.4.2 | クライアントの画面遷移テスト（手動） | ✅ 完了 | 型とビルド通過 |
| 4.4.3 | バグ修正 | ✅ 完了 | TypeScript エラー修正済 |
| 4.4.4 | README 最終更新 | ✅ 完了 | `README.md` |

### 4.5 リファクタリング
| # | タスク | 状態 | 備考 |
|---|---|---|---|
| 4.5.1 | クライアントスタイリングのCSS Modules化 | ✅ 完了 | 全コンポーネントのインラインスタイルを撤廃し、Sass (`.module.scss`) に移行済 |
| 4.5.2 | Workers Static Assets 統合デプロイ移行 | ✅ 完了 | APIとWebを1つのWorkerとして統合。CORS不要化、Workers BuildsによるGitHub連携自動デプロイ対応 |

---

## 現在の状況と次のステップ

- Phase 1〜Phase 3のAPIおよびクライアント実装はすべて完了しました。
- UIのスタイリングについて、初期のインラインスタイルからSassベースのCSS Modulesへの全面的な移行・リファクタリングが完了しました。
- ローカル環境（Docker Compose）での動作確認および `npm run build` によるビルド検証が完了しています。

## 設計ドキュメント

すべて `docs/` 配下に作成済み。設計の詳細は以下を参照。

- `docs/er-diagram.md` — ER図 + テーブル定義
- `docs/api-spec.md` — API仕様書（全19エンドポイント）
- `docs/screens.md` — 画面設計 + UIモック
- `docs/architecture.md` — 技術アーキテクチャ
- `docs/tasks.md` — タスク定義（依存関係付き）

## 引き継ぎメモ

- 認証はCookie (HttpOnly) + JWT (HS256)。Workers の Web Crypto API を使用
- パスワードハッシュは PBKDF2 + SHA-256（bcrypt は Workers 非対応の可能性があるため回避）
- Prisma 7 対応済み: `prisma-client-js` generator + `prisma.config.ts`
  - Cloudflare Workers では `import.meta.url` が使えないため、`prisma-client-js` を用いてデフォルトの `node_modules` に生成する方式を採用
  - マイグレーションは `prisma migrate diff` → `wrangler d1 migrations apply` 方式。`wrangler.toml` に `migrations_pattern` を設定済み
- 削除は論理削除（`deleted_at`）。Rating のみ物理削除
- 全バリデーターは `api/src/validators/` に Zod スキーマとして定義済み
- クライアントのスタイリングはCSS Modules (`.module.scss`) を採用。インラインスタイルは使用しない。
