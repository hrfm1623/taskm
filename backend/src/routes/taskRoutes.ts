import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { taskService } from "../services/taskService";
import { createTaskSchema, updateTaskSchema } from "../schemas/task";
import type { Env } from "../types/env";

const taskRouter = new Hono<{ Bindings: Env }>();

// タスク一覧の取得
taskRouter.get("/", async (c) => {
  const tasks = await taskService.getAllTasks();
  return c.json(tasks);
});

// タスクの取得
taskRouter.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const task = await taskService.getTaskById(id);
  if (!task) {
    return c.json({ message: "Task not found" }, 404);
  }
  return c.json(task);
});

// タスクの作成
taskRouter.post("/", zValidator("json", createTaskSchema), async (c) => {
  const data = c.req.valid("json");
  const task = await taskService.createTask(data);
  return c.json(task, 201);
});

// タスクの更新
taskRouter.patch("/:id", zValidator("json", updateTaskSchema), async (c) => {
  const id = Number(c.req.param("id"));
  const data = c.req.valid("json");
  const task = await taskService.updateTask(id, data);
  return c.json(task);
});

// タスクの削除
taskRouter.delete("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  await taskService.deleteTask(id);
  return c.json({ message: "Task deleted successfully" });
});

// タスクの並び替え
taskRouter.post("/reorder", async (c) => {
  const { taskIds } = await c.req.json<{ taskIds: number[] }>();
  await taskService.updateTaskPositions(taskIds);
  return c.json({ message: "Task positions updated successfully" });
});

export default taskRouter;
