import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // D1 接続はアプリケーション側で adapter 経由で行うため、
    // ここではマイグレーション生成用のダミーURLを指定
    url: "file:./dev.db",
  },
});
