# デプロイメント

## 概要

本アプリケーションは以下の環境にデプロイされます：

- **バックエンド**: Cloudflare Workers
- **フロントエンド**: Cloudflare Pages
- **データベース**: Cloudflare D1

## 前提条件

- Cloudflareアカウント
- GitHub アカウント
- 適切な環境変数の設定

## バックエンド（Cloudflare Workers）

### 手動デプロイ

```bash
cd backend

# Cloudflareにログイン
npx wrangler login

# デプロイ
pnpm deploy
```

### 環境変数の設定

```bash
# 本番環境の環境変数を設定
npx wrangler secret put DATABASE_URL
npx wrangler secret put API_TOKEN
```

### wrangler.tomlの設定

```toml
name = "taskm-api"
main = "src/index.ts"
compatibility_date = "2024-01-15"

[env.production]
name = "taskm-api-prod"

[[env.production.d1_databases]]
binding = "DB"
database_name = "taskm-production"
database_id = "your-database-id"

[env.staging]
name = "taskm-api-staging"

[[env.staging.d1_databases]]
binding = "DB"
database_name = "taskm-staging"
database_id = "your-staging-database-id"
```

## フロントエンド（Cloudflare Pages）

### 手動デプロイ

```bash
cd frontend

# ビルド
pnpm build

# Pages用ビルド
pnpm pages:build

# デプロイ（Cloudflare PagesのGit連携を推奨）
```

### ビルド設定

Cloudflare Pagesの設定：

- **Framework preset**: Next.js
- **Build command**: `cd frontend && pnpm install && pnpm pages:build`
- **Build output directory**: `frontend/.next`
- **Root directory**: `/`
- **Node.js version**: `18`

### 環境変数

Cloudflare Pagesダッシュボードで設定：

```
NEXT_PUBLIC_API_URL=https://your-api-domain.workers.dev
NODE_VERSION=18
```

## データベース（Cloudflare D1）

### D1データベースの作成

```bash
# 本番データベース作成
npx wrangler d1 create taskm-production

# ステージングデータベース作成
npx wrangler d1 create taskm-staging
```

### マイグレーション

```bash
# 本番環境
npx wrangler d1 migrations apply taskm-production --env production

# ステージング環境
npx wrangler d1 migrations apply taskm-staging --env staging
```

## CI/CDパイプライン

### GitHub Actions設定

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm build

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      
      - run: pnpm install
      - run: cd backend && npx wrangler deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      
      - run: pnpm install
      - run: cd frontend && pnpm pages:build
      
      # Cloudflare Pagesは自動デプロイされる
```

## 環境別設定

### 本番環境

- **URL**: https://taskm.pages.dev
- **API**: https://taskm-api.workers.dev
- **Database**: taskm-production

### ステージング環境

- **URL**: https://staging.taskm.pages.dev
- **API**: https://taskm-api-staging.workers.dev
- **Database**: taskm-staging

## モニタリング

### Cloudflare Analytics

- Workers Analytics でAPI使用状況を監視
- Pages Analytics でフロントエンドのトラフィックを監視

### エラーハンドリング

```typescript
// バックエンドエラーハンドリング
app.onError((err, c) => {
  console.error('Application Error:', err)
  
  return c.json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  }, 500)
})
```

### ログ監視

```bash
# Workers ログの確認
npx wrangler tail taskm-api-prod

# リアルタイム監視
npx wrangler tail taskm-api-prod --format pretty
```

## ロールバック手順

### バックエンド

```bash
# 以前のデプロイメントを確認
npx wrangler deployments list

# 特定のデプロイメントにロールバック
npx wrangler rollback [deployment-id]
```

### フロントエンド

Cloudflare Pagesダッシュボードから：
1. デプロイメント履歴を確認
2. 以前のデプロイメントを選択
3. "Retry deployment" をクリック

## セキュリティ考慮事項

- API トークンは GitHub Secrets で管理
- 本番環境では HTTPS のみ許可
- CORS 設定の適切な制限
- レート制限の実装
- セキュリティヘッダーの設定