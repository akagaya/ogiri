# API 仕様書

ベースURL: `https://<domain>/api/v1`

共通仕様:
- レスポンス形式: JSON
- 認証: Cookie ベース JWT（`HttpOnly`, `Secure`, `SameSite=Strict`）
- 日時: ISO8601 形式（UTC）
- ID: ULID (26文字の文字列)
- ページネーション: オフセット方式（`?page=1&limit=20`）

---

## 共通レスポンス

### 成功レスポンス

```json
{
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 123
  }
}
```

- 単一リソース取得時は `meta` なし
- 一覧取得時は `meta` でページネーション情報を返す

### エラーレスポンス

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "リクエストが不正です",
    "details": [
      { "field": "body", "message": "1文字以上入力してください" }
    ]
  }
}
```

### エラーコード一覧

| HTTP | code | 説明 |
|---|---|---|
| 400 | `VALIDATION_ERROR` | リクエストバリデーション失敗 |
| 401 | `UNAUTHORIZED` | 未認証 |
| 403 | `FORBIDDEN` | 権限なし |
| 404 | `NOT_FOUND` | リソースが存在しない |
| 409 | `CONFLICT` | 一意制約違反（ユーザー名重複等） |
| 500 | `INTERNAL_ERROR` | サーバー内部エラー |

---

## 認証 (Auth)

### POST `/auth/register`

ユーザー新規登録。

**リクエスト:**
```json
{
  "username": "sasaki",
  "display_name": "ささき",
  "password": "MyP@ssw0rd"
}
```

**バリデーション:**

| フィールド | ルール |
|---|---|
| `username` | 必須。英数字+アンダースコア。3〜32文字。一意 |
| `display_name` | 必須。1〜50文字 |
| `password` | 必須。8〜72文字 |

**レスポンス:** `201 Created`
```json
{
  "data": {
    "id": "01H5K6...",
    "username": "sasaki",
    "display_name": "ささき",
    "created_at": "2026-08-12T12:00:00Z"
  }
}
```

- Set-Cookie ヘッダーで JWT を返却

**エラー:**
- `409 CONFLICT`: username が既に使用されている

---

### POST `/auth/login`

ログイン。JWT を Cookie にセット。

**リクエスト:**
```json
{
  "username": "sasaki",
  "password": "MyP@ssw0rd"
}
```

**レスポンス:** `200 OK`
```json
{
  "data": {
    "id": "01H5K6...",
    "username": "sasaki",
    "display_name": "ささき"
  }
}
```

- Set-Cookie ヘッダーで JWT を返却

**エラー:**
- `401 UNAUTHORIZED`: username または password が不正

---

### POST `/auth/logout`

ログアウト。Cookie を削除。

**レスポンス:** `204 No Content`

- Set-Cookie でトークンを空にし、`Max-Age=0` を設定

---

### GET `/auth/me`

現在認証中のユーザー情報を取得。

**認証:** 必要

**レスポンス:** `200 OK`
```json
{
  "data": {
    "id": "01H5K6...",
    "username": "sasaki",
    "display_name": "ささき",
    "created_at": "2026-08-12T12:00:00Z"
  }
}
```

**エラー:**
- `401 UNAUTHORIZED`: Cookie に有効なトークンがない

---

## お題 (Topics)

### GET `/topics`

お題一覧を取得。

**クエリパラメータ:**

| パラメータ | 型 | デフォルト | 説明 |
|---|---|---|---|
| `sort` | string | `latest` | `latest`（新着順）\| `popular`（回答数順） |
| `page` | integer | `1` | ページ番号 |
| `limit` | integer | `20` | 1ページあたりの件数（最大50） |

**レスポンス:** `200 OK`
```json
{
  "data": [
    {
      "id": "01H5K6...",
      "body": "こんな寿司屋は嫌だ。どんなの？",
      "user": {
        "id": "01H5K5...",
        "display_name": "ささき"
      },
      "answer_count": 12,
      "avg_score": 7.2,
      "created_at": "2026-08-12T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 45
  }
}
```

> [!NOTE]
> `popular` ソートは、回答数が多い順に並べる。回答数が同じ場合は新着順。
> `avg_score` はお題に紐づく全回答の平均評価スコア。回答がない場合は `null`。

---

### POST `/topics`

お題を投稿。

**認証:** 必要

**リクエスト:**
```json
{
  "body": "こんな寿司屋は嫌だ。どんなの？"
}
```

**バリデーション:**

| フィールド | ルール |
|---|---|
| `body` | 必須。1〜500文字 |

**レスポンス:** `201 Created`
```json
{
  "data": {
    "id": "01H5K6...",
    "body": "こんな寿司屋は嫌だ。どんなの？",
    "user": {
      "id": "01H5K5...",
      "display_name": "ささき"
    },
    "answer_count": 0,
    "avg_score": null,
    "created_at": "2026-08-12T12:00:00Z"
  }
}
```

---

### GET `/topics/:topicId`

お題詳細を取得。

**レスポンス:** `200 OK`
```json
{
  "data": {
    "id": "01H5K6...",
    "body": "こんな寿司屋は嫌だ。どんなの？",
    "user": {
      "id": "01H5K5...",
      "display_name": "ささき"
    },
    "answer_count": 12,
    "avg_score": 7.2,
    "created_at": "2026-08-12T10:00:00Z"
  }
}
```

**エラー:**
- `404 NOT_FOUND`: お題が存在しないか論理削除済み

---

### DELETE `/topics/:topicId`

お題を論理削除。

**認証:** 必要（投稿者本人のみ）

**レスポンス:** `204 No Content`

**エラー:**
- `403 FORBIDDEN`: 投稿者本人でない
- `404 NOT_FOUND`: お題が存在しない

---

## 回答 (Answers)

### GET `/topics/:topicId/answers`

お題に対する回答一覧を取得。

**クエリパラメータ:**

| パラメータ | 型 | デフォルト | 説明 |
|---|---|---|---|
| `sort` | string | `latest` | `latest`（新着順）\| `top_rated`（平均評価順） |
| `page` | integer | `1` | ページ番号 |
| `limit` | integer | `20` | 1ページあたりの件数（最大50） |

**レスポンス:** `200 OK`
```json
{
  "data": [
    {
      "id": "01H5K7...",
      "body": "ネタが全部ガリ",
      "user": {
        "id": "01H5K5...",
        "display_name": "佐々木"
      },
      "avg_score": 8.5,
      "rating_count": 5,
      "comment_count": 3,
      "my_rating": null,
      "created_at": "2026-08-12T10:30:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 12
  }
}
```

> [!NOTE]
> `my_rating` は認証中ユーザーがこの回答に付けた評価スコア。未認証または未評価の場合は `null`。
> これにより、クライアント側で「既に評価済みか」を判定できる。

---

### POST `/topics/:topicId/answers`

回答を投稿。

**認証:** 必要

**リクエスト:**
```json
{
  "body": "ネタが全部ガリ"
}
```

**バリデーション:**

| フィールド | ルール |
|---|---|
| `body` | 必須。1〜500文字 |

**レスポンス:** `201 Created`
```json
{
  "data": {
    "id": "01H5K7...",
    "body": "ネタが全部ガリ",
    "user": {
      "id": "01H5K5...",
      "display_name": "佐々木"
    },
    "avg_score": null,
    "rating_count": 0,
    "comment_count": 0,
    "created_at": "2026-08-12T12:00:00Z"
  }
}
```

**エラー:**
- `404 NOT_FOUND`: 対象のお題が存在しないか論理削除済み

---

### GET `/answers/:answerId`

回答詳細を取得。

**レスポンス:** `200 OK`
```json
{
  "data": {
    "id": "01H5K7...",
    "body": "ネタが全部ガリ",
    "topic": {
      "id": "01H5K6...",
      "body": "こんな寿司屋は嫌だ。どんなの？"
    },
    "user": {
      "id": "01H5K5...",
      "display_name": "佐々木"
    },
    "avg_score": 8.5,
    "rating_count": 5,
    "comment_count": 3,
    "my_rating": 9,
    "created_at": "2026-08-12T10:30:00Z"
  }
}
```

---

### DELETE `/answers/:answerId`

回答を論理削除。

**認証:** 必要（投稿者本人のみ）

**レスポンス:** `204 No Content`

**エラー:**
- `403 FORBIDDEN`: 投稿者本人でない
- `404 NOT_FOUND`: 回答が存在しない

---

## 評価 (Ratings)

### PUT `/answers/:answerId/rating`

回答を評価（UPSERT）。既に評価済みの場合はスコアを更新する。

**認証:** 必要

**リクエスト:**
```json
{
  "score": 9
}
```

**バリデーション:**

| フィールド | ルール |
|---|---|
| `score` | 必須。0〜10 の整数 |

**レスポンス:**
- 新規評価: `201 Created`
- 更新: `200 OK`

```json
{
  "data": {
    "id": "01H5K8...",
    "score": 9,
    "user": {
      "id": "01H5K5...",
      "display_name": "田中太郎"
    },
    "created_at": "2026-08-12T12:00:00Z"
  }
}
```

**エラー:**
- `404 NOT_FOUND`: 対象の回答が存在しない

> [!NOTE]
> 自己評価も許可する。`answer.user_id === authenticated_user.id` でも拒否しない。

---

### GET `/answers/:answerId/ratings`

回答に対する評価一覧を取得。評価者情報を含む。

**レスポンス:** `200 OK`
```json
{
  "data": [
    {
      "id": "01H5K8...",
      "score": 9,
      "user": {
        "id": "01H5K5...",
        "display_name": "田中太郎"
      },
      "created_at": "2026-08-12T12:00:00Z"
    },
    {
      "id": "01H5K9...",
      "score": 8,
      "user": {
        "id": "01H5K6...",
        "display_name": "山田花子"
      },
      "created_at": "2026-08-12T12:05:00Z"
    }
  ]
}
```

> [!NOTE]
> 評価一覧はページネーションなし。1回答あたりの評価数は限定的であるため。

---

### DELETE `/answers/:answerId/rating`

自分の評価を取り消す（物理削除）。

**認証:** 必要

**レスポンス:** `204 No Content`

**エラー:**
- `404 NOT_FOUND`: 自分の評価が存在しない

---

## コメント (Comments)

### GET `/answers/:answerId/comments`

回答に対するコメント一覧を取得。

**クエリパラメータ:**

| パラメータ | 型 | デフォルト | 説明 |
|---|---|---|---|
| `page` | integer | `1` | ページ番号 |
| `limit` | integer | `20` | 1ページあたりの件数（最大50） |

**レスポンス:** `200 OK`
```json
{
  "data": [
    {
      "id": "01H5KA...",
      "body": "ネタが全部ガリってんたい！",
      "user": {
        "id": "01H5K5...",
        "display_name": "田中太郎"
      },
      "created_at": "2026-08-12T12:10:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 3
  }
}
```

---

### POST `/answers/:answerId/comments`

コメントを投稿。

**認証:** 必要

**リクエスト:**
```json
{
  "body": "ネタが全部ガリってんたい！"
}
```

**バリデーション:**

| フィールド | ルール |
|---|---|
| `body` | 必須。1〜500文字 |

**レスポンス:** `201 Created`
```json
{
  "data": {
    "id": "01H5KA...",
    "body": "ネタが全部ガリってんたい！",
    "user": {
      "id": "01H5K5...",
      "display_name": "田中太郎"
    },
    "created_at": "2026-08-12T12:10:00Z"
  }
}
```

---

### DELETE `/answers/:answerId/comments/:commentId`

コメントを論理削除。

**認証:** 必要（投稿者本人のみ）

**レスポンス:** `204 No Content`

**エラー:**
- `403 FORBIDDEN`: 投稿者本人でない
- `404 NOT_FOUND`: コメントが存在しない

---

## ユーザー (Users)

### GET `/users/:userId`

ユーザープロフィールを取得。

**レスポンス:** `200 OK`
```json
{
  "data": {
    "id": "01H5K5...",
    "username": "sasaki",
    "display_name": "ささき",
    "topic_count": 5,
    "answer_count": 23,
    "created_at": "2026-08-12T12:00:00Z"
  }
}
```

**エラー:**
- `404 NOT_FOUND`: ユーザーが存在しないか論理削除済み

---

### GET `/users/:userId/topics`

ユーザーが投稿したお題一覧を取得。

**クエリパラメータ:**

| パラメータ | 型 | デフォルト | 説明 |
|---|---|---|---|
| `page` | integer | `1` | ページ番号 |
| `limit` | integer | `20` | 1ページあたりの件数 |

**レスポンス:** `200 OK`（`GET /topics` と同じ形式）

---

### GET `/users/:userId/answers`

ユーザーが投稿した回答一覧を取得。

**クエリパラメータ:**

| パラメータ | 型 | デフォルト | 説明 |
|---|---|---|---|
| `page` | integer | `1` | ページ番号 |
| `limit` | integer | `20` | 1ページあたりの件数 |

**レスポンス:** `200 OK`
```json
{
  "data": [
    {
      "id": "01H5K7...",
      "body": "ネタが全部ガリ",
      "topic": {
        "id": "01H5K6...",
        "body": "こんな寿司屋は嫌だ。どんなの？"
      },
      "avg_score": 8.5,
      "rating_count": 5,
      "comment_count": 3,
      "created_at": "2026-08-12T10:30:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 23
  }
}
```
