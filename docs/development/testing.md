# テスト

## テスト戦略

本プロジェクトでは以下のテスト種別を実装しています：

- **単体テスト**: 個別の関数・コンポーネントのテスト
- **統合テスト**: API とフロントエンドの連携テスト
- **E2Eテスト**: ユーザーシナリオの自動化テスト

## フロントエンドテスト

### 使用技術

- **Jest**: テストランナー
- **React Testing Library**: Reactコンポーネントテスト
- **MSW**: APIモック

### テスト実行

```bash
cd frontend

# 全テスト実行
pnpm test

# ウォッチモード
pnpm test:watch

# カバレッジ
pnpm test:coverage
```

### コンポーネントテスト例

```typescript
// src/components/task/TaskCard.test.tsx
import { render, screen } from '@testing-library/react'
import { TaskCard } from './TaskCard'

describe('TaskCard', () => {
  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: 'todo',
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }

  it('renders task title', () => {
    render(<TaskCard task={mockTask} />)
    expect(screen.getByText('Test Task')).toBeInTheDocument()
  })

  it('renders task description', () => {
    render(<TaskCard task={mockTask} />)
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })
})
```

## バックエンドテスト

### 使用技術

- **Vitest**: テストランナー
- **Supertest**: HTTPテスト

### テスト実行

```bash
cd backend

# 全テスト実行
pnpm test

# ウォッチモード
pnpm test:watch
```

### APIテスト例

```typescript
// src/routes/taskRoutes.test.ts
import { describe, it, expect } from 'vitest'
import { testClient } from '../test-utils'

describe('Task Routes', () => {
  it('GET /api/tasks returns tasks list', async () => {
    const res = await testClient.get('/api/tasks')
    
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('data')
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  it('POST /api/tasks creates new task', async () => {
    const newTask = {
      title: 'New Task',
      description: 'Task Description'
    }

    const res = await testClient.post('/api/tasks').send(newTask)
    
    expect(res.status).toBe(201)
    expect(res.body.data).toHaveProperty('id')
    expect(res.body.data.title).toBe(newTask.title)
  })
})
```

## E2Eテスト

### 使用技術

- **Playwright**: E2Eテストフレームワーク

### テスト実行

```bash
# インストール
npx playwright install

# テスト実行
pnpm test:e2e

# UIモード
pnpm test:e2e:ui
```

### E2Eテスト例

```typescript
// tests/task-management.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Task Management', () => {
  test('create new task', async ({ page }) => {
    await page.goto('http://localhost:3000')
    
    // タスク作成ボタンをクリック
    await page.click('[data-testid="create-task-btn"]')
    
    // フォーム入力
    await page.fill('[data-testid="task-title"]', 'Test Task')
    await page.fill('[data-testid="task-description"]', 'Test Description')
    
    // 保存
    await page.click('[data-testid="save-task-btn"]')
    
    // 作成されたタスクが表示されることを確認
    await expect(page.locator('[data-testid="task-card"]')).toContainText('Test Task')
  })
})
```

## テストカバレッジ

目標カバレッジ：
- **フロントエンド**: 80%以上
- **バックエンド**: 85%以上

カバレッジレポートの確認：

```bash
# フロントエンド
cd frontend
pnpm test:coverage

# バックエンド
cd backend
pnpm test:coverage
```

## モックとスタブ

### APIモック（MSW）

```typescript
// src/mocks/handlers.ts
import { rest } from 'msw'

export const handlers = [
  rest.get('/api/tasks', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: [
          { id: '1', title: 'Task 1', status: 'todo' },
          { id: '2', title: 'Task 2', status: 'done' }
        ]
      })
    )
  })
]
```

## CI/CDでのテスト

GitHub Actionsでテストが自動実行されます：

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]

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
      - run: pnpm test
      - run: pnpm test:e2e
```