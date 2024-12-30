import { Hono } from "hono";
import { cors } from "hono/cors";
import taskRouter from "./routes/taskRoutes";
import type { Env } from "./types/env";

const app = new Hono<{ Bindings: Env }>();

// CORSの設定
app.use("/*", cors());

// ヘルスチェック
app.get("/", (c) => {
  return c.json({
    message: "Task Management API",
    env: c.env.ENV,
  });
});

// タスク関連のルート
app.route("/api/tasks", taskRouter);

export default app;
