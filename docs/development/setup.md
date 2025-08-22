# セットアップガイド

## 必要な環境

- Node.js 18以上
- pnpm 8以上
- Cloudflareアカウント
- Git

## インストール手順

### 1. リポジトリのクローン

```bash
git clone https://github.com/hrfm1623/taskm.git
cd taskm
```

### 2. 依存関係のインストール

```bash
pnpm install
```

### 3. 環境変数の設定

#### バックエンド

```bash
cd backend
cp .env.example .env
```

`.env`ファイルを編集して、必要な環境変数を設定してください：

```env
DATABASE_URL="your_database_url"
CLOUDFLARE_ACCOUNT_ID="your_account_id"
CLOUDFLARE_API_TOKEN="your_api_token"
```

#### フロントエンド

```bash
cd frontend
cp .env.example .env.local
```

`.env.local`ファイルを編集：

```env
NEXT_PUBLIC_API_URL="http://localhost:8787"
```

### 4. データベースのセットアップ

```bash
cd backend
pnpm db:migrate
pnpm db:seed
```

### 5. 開発サーバーの起動

```bash
# ルートディレクトリから
pnpm dev
```

これにより以下が起動します：
- フロントエンド: http://localhost:3000
- バックエンド: http://localhost:8787

## トラブルシューティング

### ポートが使用中の場合

```bash
# プロセスを強制終了
fuser -k 8787/tcp
fuser -k 3000/tcp
```

### 依存関係の問題

```bash
# node_modulesとロックファイルを削除して再インストール
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Cloudflare Workers関連

Cloudflare Workersの開発環境でエラーが発生する場合：

```bash
cd backend
npx wrangler login
npx wrangler dev
```