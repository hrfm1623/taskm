import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { createTaskSchema, updateTaskSchema } from "../schemas/task";
import type { Env } from "../types/env";

// タスク位置更新のスキーマを定義
const updateTaskPositionsSchema = z.object({
  taskIds: z.array(z.number()),
});

const router = new Hono<Env>();

// タスク一覧の取得
router.get("/", async (c) => {
  const taskService = c.get("taskService");
  const tasks = await taskService.getAllTasks();
  return c.json(tasks);
});

// タスクの作成
router.post("/", zValidator("json", createTaskSchema), async (c) => {
  const taskService = c.get("taskService");
  const data = c.req.valid("json");
  const task = await taskService.createTask(data);
  return c.json(task, 201);
});

// タスクの更新
router.put("/:id", zValidator("json", updateTaskSchema), async (c) => {
  const taskService = c.get("taskService");
  const id = Number(c.req.param("id"));
  const data = c.req.valid("json");
  const task = await taskService.updateTask(id, data);
  return c.json(task);
});

// タスクの削除
router.delete("/:id", async (c) => {
  const taskService = c.get("taskService");
  const id = Number(c.req.param("id"));
  await taskService.deleteTask(id);
  return c.json({ message: "Task deleted successfully" });
});

// タスクの並び順更新
router.put(
  "/positions",
  zValidator("json", updateTaskPositionsSchema),
  async (c) => {
    const taskService = c.get("taskService");
    const { taskIds } = c.req.valid("json");
    await taskService.updateTaskPositions(taskIds);
    return c.json({ message: "Task positions updated successfully" });
  }
);

export default router;
