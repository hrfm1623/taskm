# タスク管理アプリ

Cloudflare WorkersとNext.jsを使用したシンプルなタスク管理アプリケーション

## 概要

このアプリケーションは、個人またはチーム向けのタスク管理を目的として開発されました。モダンなWebテクノロジーを使用し、レスポンシブデザインとダークモード対応を特徴としています。

## 主な機能

- **タスク管理**: タスクの作成、編集、削除
- **ドラッグ&ドロップ**: 直感的なタスクの並び替え
- **タグ付け**: タスクの分類とフィルタリング
- **ステータス管理**: タスクの進捗状況の追跡
- **レスポンシブデザイン**: モバイルからデスクトップまで対応
- **ダークモード**: ユーザーの好みに応じたテーマ切り替え

## アーキテクチャ

### システム構成

本アプリケーションは、モノレポ構成でフロントエンドとバックエンドが分離された構造になっています。

```
taskm/
├── frontend/    # Next.js フロントエンド
├── backend/     # Cloudflare Workers バックエンド
└── packages/    # 共有パッケージ
```

### 技術スタック

- **フロントエンド**: Next.js 14, React Query, TailwindCSS, Radix UI
- **バックエンド**: Cloudflare Workers, Hono, Drizzle ORM
- **データベース**: Cloudflare D1 (SQLite)
- **開発ツール**: Turborepo, TypeScript, ESLint, Prettier

## 開発環境

### 必要な環境

- Node.js 18+
- pnpm 8+
- Cloudflareアカウント

### セットアップ手順

1. 依存関係のインストール
   ```bash
   pnpm install
   ```

2. 環境変数の設定
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env.local
   ```

3. 開発サーバーの起動
   ```bash
   pnpm dev
   ```

## API仕様

### エンドポイント

| エンドポイント | メソッド | 説明 |
|---------------|---------|------|
| `/api/tasks` | GET | 全タスクの取得 |
| `/api/tasks` | POST | 新規タスクの作成 |
| `/api/tasks/{id}` | GET | 特定タスクの取得 |
| `/api/tasks/{id}` | PUT | タスクの更新 |
| `/api/tasks/{id}` | DELETE | タスクの削除 |
| `/api/tags` | GET, POST | タグの取得・作成 |
| `/api/task-status` | GET, POST | ステータスの取得・作成 |

### データモデル

#### Task
```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  tags: Tag[];
  createdAt: Date;
  updatedAt: Date;
}
```

#### Tag
```typescript
interface Tag {
  id: string;
  name: string;
  color: string;
}
```

#### TaskStatus
```typescript
interface TaskStatus {
  id: string;
  name: string;
  order: number;
}
```

## デプロイメント

### バックエンド (Cloudflare Workers)

```bash
cd backend
pnpm deploy
```

### フロントエンド (Cloudflare Pages)

```bash
cd frontend
pnpm pages:build
```

GitHub Actionsを使用した自動デプロイメントも設定されています。

## 貢献

1. フォークを作成
2. フィーチャーブランチを作成 (`git checkout -b feature/new-feature`)
3. 変更をコミット (`git commit -am 'Add new feature'`)
4. ブランチをプッシュ (`git push origin feature/new-feature`)
5. プルリクエストを作成

## ライセンス

MIT License