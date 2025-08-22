# 開発フロー

## ブランチ戦略

### メインブランチ

- `main`: 本番環境にデプロイされる安定版
- `develop`: 開発中の統合ブランチ

### フィーチャーブランチ

新機能開発時は以下の手順：

```bash
# developから新しいブランチを作成
git checkout develop
git pull origin develop
git checkout -b feature/task-priority

# 開発作業...

# コミット
git add .
git commit -m "feat: add task priority feature"

# プッシュ
git push origin feature/task-priority
```

## コミットメッセージ規則

[Conventional Commits](https://www.conventionalcommits.org/ja/)に従います：

- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメントのみの変更
- `style`: コードの意味に影響を与えない変更
- `refactor`: バグ修正や機能追加を行わないコードの変更
- `test`: テストの追加や既存テストの修正
- `chore`: ビルドプロセスやツールの変更

例：
```
feat: add drag and drop for tasks
fix: resolve task deletion bug
docs: update API documentation
```

## 開発コマンド

### 全体

```bash
# 開発サーバー起動
pnpm dev

# ビルド
pnpm build

# リント
pnpm lint

# テスト
pnpm test

# クリーンアップ
pnpm clean
```

### フロントエンド

```bash
cd frontend

# 開発サーバー
pnpm dev

# ビルド
pnpm build

# 型チェック
pnpm type-check

# Storybook
pnpm storybook
```

### バックエンド

```bash
cd backend

# 開発サーバー
pnpm dev

# データベース操作
pnpm db:migrate
pnpm db:seed
pnpm db:reset

# デプロイ
pnpm deploy
```

## コードレビュー

### プルリクエスト前のチェックリスト

- [ ] コードがリント規則に準拠している
- [ ] 型エラーがない
- [ ] テストが通っている
- [ ] 新機能にはテストが追加されている
- [ ] ドキュメントが更新されている

### レビューのポイント

1. **機能性**: 要求通りに動作するか
2. **可読性**: コードが理解しやすいか
3. **保守性**: 将来の変更に対応しやすいか
4. **パフォーマンス**: 性能に問題はないか
5. **セキュリティ**: セキュリティリスクはないか

## デバッグ

### フロントエンド

```bash
# React Developer Tools使用
# Chrome DevToolsでコンポーネントの状態を確認

# ログ出力
console.log('Debug info:', data)
```

### バックエンド

```bash
# Cloudflare Workersのログ
npx wrangler tail

# ローカル開発時のログ
console.log('API Debug:', request)
```