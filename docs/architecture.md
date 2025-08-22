# アーキテクチャドキュメント

## システム概要

タスク管理アプリは、フロントエンドとバックエンドを分離したモノレポ構成のWebアプリケーションです。

## アーキテクチャ図

```
┌─────────────────┐    HTTP/REST API    ┌─────────────────┐
│                 │◄───────────────────►│                 │
│   Frontend      │                     │   Backend       │
│   (Next.js)     │                     │ (Cloudflare     │
│                 │                     │   Workers)      │
└─────────────────┘                     └─────────────────┘
                                                 │
                                                 │
                                                 ▼
                                        ┌─────────────────┐
                                        │                 │
                                        │  Cloudflare D1  │
                                        │   (Database)    │
                                        │                 │
                                        └─────────────────┘
```

## コンポーネント構成

### フロントエンド (Next.js)

#### ディレクトリ構造
```
frontend/src/
├── app/              # App Router
│   ├── page.tsx      # ホームページ
│   └── login/        # ログインページ
├── components/       # Reactコンポーネント
│   ├── common/       # 共通コンポーネント
│   ├── pages/        # ページ固有コンポーネント
│   ├── task/         # タスク関連コンポーネント
│   └── ui/           # UIコンポーネント
├── lib/              # ユーティリティ
└── types/            # 型定義
```

#### 主要な技術要素
- **Next.js 14**: App Router使用
- **React Query**: サーバーステート管理
- **TailwindCSS**: スタイリング
- **dnd-kit**: ドラッグ&ドロップ機能
- **Radix UI**: アクセシブルなUIコンポーネント

### バックエンド (Cloudflare Workers)

#### ディレクトリ構造
```
backend/src/
├── routes/           # APIルート
│   ├── taskRoutes.ts
│   ├── tagRoutes.ts
│   └── taskStatusRoutes.ts
├── services/         # ビジネスロジック
├── schemas/          # Zod バリデーション
├── db/               # データベース設定
└── types/            # 型定義
```

#### 主要な技術要素
- **Hono**: 軽量Webフレームワーク
- **Drizzle ORM**: 型安全なORM
- **Zod**: バリデーション
- **Cloudflare D1**: SQLiteベースのデータベース

## データフロー

1. **ユーザーアクション**: フロントエンドでユーザーがアクションを実行
2. **API呼び出し**: React QueryがバックエンドAPIを呼び出し
3. **バリデーション**: ZodスキーマでリクエストをValidation
4. **ビジネスロジック**: サービス層でビジネスロジックを処理
5. **データベース操作**: Drizzle ORMでD1データベースを操作
6. **レスポンス返却**: 処理結果をフロントエンドに返却
7. **UI更新**: React Queryがキャッシュを更新しUIが再レンダリング

## セキュリティ

### データベースアクセス
- Drizzle ORMによるSQLインジェクション対策
- Zodによる入力値の型安全性とバリデーション

### API セキュリティ
- CORS設定による適切なオリジン制限
- レート制限の実装（Cloudflare Workers）

### フロントエンド
- XSS対策（Reactの組み込み保護）
- CSRF対策（SameSite Cookieの使用）

## パフォーマンス

### フロントエンド最適化
- Next.js 14のApp Routerによる最適化されたバンドル
- React Queryによる効率的なキャッシュ管理
- TailwindCSSの未使用スタイル削除
- 画像の最適化（Next.js Image コンポーネント）

### バックエンド最適化
- Cloudflare Workersのエッジ実行による低レイテンシ
- Drizzle ORMによる効率的なクエリ生成
- D1データベースのSQLiteによる高速なクエリ実行

## スケーラビリティ

### 水平スケーリング
- Cloudflare Workersの自動スケーリング
- CDNによるフロントエンドの配信最適化

### データベーススケーリング
- Cloudflare D1の自動バックアップ
- 読み取り専用レプリカの活用可能性

## 監視とロギング

### フロントエンド
- Webバイタル（Core Web Vitals）の監視
- エラー境界によるエラー追跡

### バックエンド
- Cloudflare Workersの組み込み分析
- カスタムメトリクスの実装

## デプロイメント戦略

### CI/CDパイプライン
```
GitHub Actions
├── テストの実行
├── ビルドの実行
├── セキュリティスキャン
└── デプロイメント
```

### 環境管理
- 開発環境: ローカル開発
- ステージング環境: プレビューデプロイ
- 本番環境: メインブランチ