# 大喜利ひろば (Ogiri Web Service)

Cloudflare Workers (Hono + D1) と React (Vite) で構築された大喜利プラットフォーム。

## プロジェクト構成

- `api/` : バックエンド (Cloudflare Workers, Hono, Prisma D1 Adapter)
- `web/` : フロントエンド (React, Vite)
- `docs/` : 設計ドキュメント類

## ローカル開発環境の立ち上げ

1. API（バックエンド）の起動
   ```bash
   cd api
   npm install
   npm run dev
   ```

2. Web（フロントエンド）の起動
   ```bash
   cd web
   npm install
   npm run dev
   ```
   フロントエンドは `http://localhost:5173` で起動します。

## データベースの設定と Seed

このプロジェクトは Cloudflare D1 (SQLite) を使用しています。
ローカル開発時は `wrangler dev` が `.wrangler/state/v3/d1/.../db.sqlite` を生成します。

### マイグレーションの実行
```bash
cd api
npm run db:migrate
```

### Seed（初期データ投入）
システムユーザーと初期のお題をデータベースに投入します。
※ Prisma D1 Adapter の制約により、ローカル環境での SQLite への直接接続が難しい場合は D1 の SQL コンソールを利用するか、`wrangler d1 execute` を使用して `seed.sql` 相当を流し込んでください。

```bash
cd api
npx prisma db seed
# または
npx tsx prisma/seed.ts
```

## 本番デプロイ

本プロジェクトは **Cloudflare Workers Static Assets** を利用し、API と Web フロントエンドを1つの Worker として統合デプロイします。

### 1. D1 データベースの作成
```bash
npx wrangler d1 create ogiri-db
```
作成後に出力される `database_name` と `database_id` を `api/wrangler.toml` に反映してください。

### 2. 本番マイグレーションと Seed 投入
```bash
cd api
npm run db:migrate:prod
```
Seed データを本番 DB に流し込みます。

### 3. Secrets の設定
```bash
cd api
npx wrangler secret put JWT_SECRET
```

### 4. 統合デプロイ（手動）
Web のビルドと API のデプロイを一括で実行します。
```bash
cd api
npm run deploy:all
```

### 5. 自動デプロイ（GitHub 連携 / Workers Builds）
Cloudflare ダッシュボードから Workers Builds を設定することで、GitHub へのプッシュ時に自動デプロイが可能です。

1. Cloudflare ダッシュボードの「Workers & Pages」から該当 Worker を選択
2. 「Settings」→「Builds」→「Connect」で GitHub リポジトリを接続
3. ビルド設定:
   - **ルートディレクトリ**: `/api`
   - **ビルドコマンド**: `npm run build:all`
   - **デプロイコマンド**: `npx wrangler deploy`
4. 環境変数・Secrets は Cloudflare ダッシュボードの Worker 設定から登録

