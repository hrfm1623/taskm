# タスク管理アプリ

Cloudflare WorkersとNext.jsを使用したシンプルなタスク管理アプリケーション

## 機能

- タスクの作成、編集、削除
- ドラッグ&ドロップでのタスクの並び替え
- タグ付け機能
- ステータス管理
- レスポンシブデザイン
- ダークモード対応

## 技術スタック

### バックエンド

- Cloudflare Workers
- Hono v4.0.0
- Drizzle ORM
- Zod
- TypeScript

### フロントエンド

- Next.js 14
- React Query (TanStack Query)
- dnd-kit
- TailwindCSS
- Radix UI
- TypeScript

### 開発ツール

- pnpm (パッケージマネージャー)
- Turborepo (モノレポ管理)
- ESLint
- Prettier

## プロジェクト構成

```
.
├── backend/          # バックエンドアプリケーション
├── frontend/         # フロントエンドアプリケーション
├── packages/         # 共有パッケージ
└── .github/          # GitHub Actions ワークフロー
```

## 開発環境のセットアップ

1. 必要な依存関係をインストール

```bash
pnpm install
```

2. Cloudflareの設定

- Cloudflareアカウントを作成
- Workers & Pagesプロジェクトを作成
- D1データベースを作成
- wranglerでログイン

```bash
wrangler login
```

3. 環境変数の設定

バックエンド:

```bash
cp backend/.env.example backend/.env
```

フロントエンド:

```bash
cp frontend/.env.example frontend/.env.local
```

必要な環境変数を設定してください。

4. 開発サーバーの起動

バックエンド:

```bash
cd backend
pnpm dev
```

フロントエンド:

```bash
cd frontend
pnpm dev
```

## デプロイ

1. バックエンドのデプロイ

```bash
cd backend
pnpm deploy
```

2. フロントエンドのデプロイ

```bash
cd frontend
pnpm pages:build
```

デプロイはGitHub Actionsを通じて自動的に行われます。
