import { PrismaClient } from "@prisma/client/edge";
import { Hono } from "hono";
import { cors } from "hono/cors";
import tagRouter from "./routes/tagRoutes";
import taskRouter from "./routes/taskRoutes";
import taskStatusRouter from "./routes/taskStatusRoutes";
import { createTagService } from "./services/tagService";
import { createTaskService } from "./services/taskService";
import { createTaskStatusService } from "./services/taskStatusService";
import type { Env } from "./types/env";

const app = new Hono<Env>();

// CORSの設定
app.use("*", cors());

// Prismaクライアントの初期化とミドルウェアの設定
app.use("*", async (c, next) => {
  const prisma = new PrismaClient({
    datasourceUrl: "file:./dev.db",
  });

  // サービスの初期化
  const taskService = createTaskService(prisma);
  const tagService = createTagService(prisma);
  const taskStatusService = createTaskStatusService(prisma);

  // サービスをコンテキストに設定
  c.set("taskService", taskService);
  c.set("tagService", tagService);
  c.set("taskStatusService", taskStatusService);

  await next();
  await prisma.$disconnect();
});

// ヘルスチェック
app.get("/health", (c) => c.json({ status: "ok" }));

// ルートの追加
app.route("/api/tasks", taskRouter);
app.route("/api/tags", tagRouter);
app.route("/api/task-statuses", taskStatusRouter);

export default app;
