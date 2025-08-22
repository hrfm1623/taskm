# API ドキュメント

## 概要

タスク管理アプリのバックエンドAPIは、RESTfulな設計に従ってCloudflare Workers上で動作します。HonoフレームワークとDrizzle ORMを使用して実装されています。

## ベースURL

```
https://your-workers-domain.workers.dev
```

## 認証

現在のバージョンでは認証機能は実装されていませんが、将来のバージョンでJWT tokenベースの認証を実装予定です。

## エラーレスポンス

すべてのAPIエンドポイントは、エラー時に以下の形式でレスポンスを返します：

```json
{
  "error": "Error message description",
  "status": 400
}
```

## HTTPステータスコード

- `200` - 正常処理完了
- `201` - リソース作成完了
- `400` - リクエストエラー
- `404` - リソースが見つからない
- `500` - サーバー内部エラー

## エンドポイント

### タスク関連API

#### GET /api/tasks

全てのタスクを取得します。

**リクエスト:**
```
GET /api/tasks
```

**レスポンス:**
```json
{
  "tasks": [
    {
      "id": "uuid",
      "title": "サンプルタスク",
      "description": "タスクの説明",
      "statusId": "status-uuid",
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z",
      "tags": ["tag-uuid-1", "tag-uuid-2"]
    }
  ]
}
```

#### POST /api/tasks

新しいタスクを作成します。

**リクエスト:**
```json
{
  "title": "新しいタスク",
  "description": "タスクの詳細説明",
  "statusId": "status-uuid"
}
```

**レスポンス:**
```json
{
  "task": {
    "id": "new-uuid",
    "title": "新しいタスク",
    "description": "タスクの詳細説明",
    "statusId": "status-uuid",
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z",
    "tags": []
  }
}
```

#### GET /api/tasks/:id

特定のタスクを取得します。

**リクエスト:**
```
GET /api/tasks/task-uuid
```

**レスポンス:**
```json
{
  "task": {
    "id": "task-uuid",
    "title": "タスクタイトル",
    "description": "タスクの説明",
    "statusId": "status-uuid",
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z",
    "tags": ["tag-uuid-1"]
  }
}
```

#### PUT /api/tasks/:id

既存のタスクを更新します。

**リクエスト:**
```json
{
  "title": "更新されたタスク",
  "description": "新しい説明",
  "statusId": "new-status-uuid"
}
```

**レスポンス:**
```json
{
  "task": {
    "id": "task-uuid",
    "title": "更新されたタスク",
    "description": "新しい説明",
    "statusId": "new-status-uuid",
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-02T00:00:00Z",
    "tags": []
  }
}
```

#### DELETE /api/tasks/:id

タスクを削除します。

**リクエスト:**
```
DELETE /api/tasks/task-uuid
```

**レスポンス:**
```json
{
  "message": "Task deleted successfully"
}
```

### タグ関連API

#### GET /api/tags

全てのタグを取得します。

**リクエスト:**
```
GET /api/tags
```

**レスポンス:**
```json
{
  "tags": [
    {
      "id": "tag-uuid",
      "name": "重要",
      "color": "#ff6b6b",
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    }
  ]
}
```

#### POST /api/tags

新しいタグを作成します。

**リクエスト:**
```json
{
  "name": "新しいタグ",
  "color": "#4ecdc4"
}
```

**レスポンス:**
```json
{
  "tag": {
    "id": "new-tag-uuid",
    "name": "新しいタグ",
    "color": "#4ecdc4",
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

### ステータス関連API

#### GET /api/task-status

全てのタスクステータスを取得します。

**リクエスト:**
```
GET /api/task-status
```

**レスポンス:**
```json
{
  "statuses": [
    {
      "id": "status-uuid",
      "name": "未着手",
      "order": 1,
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    },
    {
      "id": "status-uuid-2",
      "name": "進行中",
      "order": 2,
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    }
  ]
}
```

#### POST /api/task-status

新しいタスクステータスを作成します。

**リクエスト:**
```json
{
  "name": "レビュー中",
  "order": 3
}
```

**レスポンス:**
```json
{
  "status": {
    "id": "new-status-uuid",
    "name": "レビュー中",
    "order": 3,
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

## データモデル

### Task

| フィールド | 型 | 説明 | 必須 |
|-----------|---|------|------|
| id | string | タスクの一意識別子 | ○ |
| title | string | タスクのタイトル | ○ |
| description | string \| null | タスクの説明 |  |
| statusId | string | ステータスID | ○ |
| createdAt | string | 作成日時 (ISO 8601) | ○ |
| updatedAt | string | 更新日時 (ISO 8601) | ○ |
| tags | string[] | タグIDの配列 | ○ |

### Tag

| フィールド | 型 | 説明 | 必須 |
|-----------|---|------|------|
| id | string | タグの一意識別子 | ○ |
| name | string | タグ名 | ○ |
| color | string | 表示色（HEXカラー） | ○ |
| createdAt | string | 作成日時 (ISO 8601) | ○ |
| updatedAt | string | 更新日時 (ISO 8601) | ○ |

### TaskStatus

| フィールド | 型 | 説明 | 必須 |
|-----------|---|------|------|
| id | string | ステータスの一意識別子 | ○ |
| name | string | ステータス名 | ○ |
| order | number | 表示順序 | ○ |
| createdAt | string | 作成日時 (ISO 8601) | ○ |
| updatedAt | string | 更新日時 (ISO 8601) | ○ |

## バリデーション

すべてのリクエストデータはZodスキーマを使用してバリデーションされます。

### タスク作成時のバリデーション

```typescript
{
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  statusId: z.string().uuid()
}
```

### タグ作成時のバリデーション

```typescript
{
  name: z.string().min(1).max(50),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
}
```

### ステータス作成時のバリデーション

```typescript
{
  name: z.string().min(1).max(50),
  order: z.number().int().positive()
}
```

## レート制限

現在、レート制限は実装されていませんが、将来のバージョンで以下の制限を予定しています：

- 一般API: 1分間に100リクエスト
- 作成系API: 1分間に10リクエスト

## CORS設定

以下のオリジンからのクロスオリジンリクエストを許可しています：

- `http://localhost:3000` (開発環境)
- `https://your-frontend-domain.pages.dev` (本番環境)