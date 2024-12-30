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
- Hono
- Cloudflare D1 (SQLite)
- Prisma
- TypeScript

### フロントエンド

- Next.js
- React Query
- dnd-kit
- TailwindCSS
- DaisyUI
- TypeScript

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

```bash
cp .env.example .env
```

必要な環境変数を設定

4. 開発サーバーの起動

バックエンド:

```bash
cd packages/backend
pnpm dev
```

フロントエンド:

```bash
cd packages/frontend
pnpm dev
```

## デプロイ

1. バックエンドのデプロイ

```bash
cd packages/backend
pnpm deploy
```

2. フロントエンドのデプロイ

```bash
cd packages/frontend
pnpm build
pnpm deploy
```
