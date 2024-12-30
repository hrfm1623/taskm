import { Hono } from "hono";
import { cors } from "hono/cors";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { taskService } from "./services/taskService";
import { tagService } from "./services/tagService";
import { taskStatusService } from "./services/taskStatusService";
import { errorHandler } from "./middleware/errorHandler";
import type { Env } from "./types/env";

const app = new Hono<Env>();

// CORSの設定
app.use("/*", cors());
app.use("/*", errorHandler);

// タスクステータス関連のエンドポイント
app.get("/api/task-statuses", async (c) => {
  const statuses = await taskStatusService.getAllTaskStatuses();
  return c.json(statuses);
});

const createTaskStatusSchema = z.object({
  name: z.string().min(1),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

app.post(
  "/api/task-statuses",
  zValidator("json", createTaskStatusSchema),
  async (c) => {
    const data = c.req.valid("json");
    const status = await taskStatusService.createTaskStatus(data);
    return c.json(status, 201);
  }
);

const updateTaskStatusSchema = z.object({
  name: z.string().min(1).optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
});

app.patch(
  "/api/task-statuses/:id",
  zValidator("json", updateTaskStatusSchema),
  async (c) => {
    const id = Number(c.req.param("id"));
    const data = c.req.valid("json");
    const status = await taskStatusService.updateTaskStatus({ id, ...data });
    return c.json(status);
  }
);

app.delete("/api/task-statuses/:id", async (c) => {
  const id = Number(c.req.param("id"));
  await taskStatusService.deleteTaskStatus(id);
  return c.json({ success: true });
});

// タスク関連のエンドポイント
app.get("/api/tasks", async (c) => {
  const tasks = await taskService.getAllTasks();
  return c.json(tasks);
});

const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  statusId: z.number(),
  dueDate: z.string().datetime().optional(),
  position: z.number(),
  tagIds: z.array(z.number()).optional(),
});

app.post("/api/tasks", zValidator("json", createTaskSchema), async (c) => {
  const data = c.req.valid("json");
  const task = await taskService.createTask({
    ...data,
    dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
  });
  return c.json(task, 201);
});

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  statusId: z.number().optional(),
  dueDate: z.string().datetime().nullable().optional(),
  position: z.number().optional(),
  tagIds: z.array(z.number()).optional(),
});

app.patch("/api/tasks/:id", zValidator("json", updateTaskSchema), async (c) => {
  const id = Number(c.req.param("id"));
  const data = c.req.valid("json");
  const task = await taskService.updateTask({
    id,
    ...data,
    dueDate: data.dueDate ? new Date(data.dueDate) : null,
  });
  return c.json(task);
});

app.delete("/api/tasks/:id", async (c) => {
  const id = Number(c.req.param("id"));
  await taskService.deleteTask(id);
  return c.json({ success: true });
});

// タスクの並び替え
const updatePositionsSchema = z.object({
  taskIds: z.array(z.number()),
});

app.post(
  "/api/tasks/reorder",
  zValidator("json", updatePositionsSchema),
  async (c) => {
    const { taskIds } = c.req.valid("json");
    await taskService.updateTaskPositions(taskIds);
    return c.json({ success: true });
  }
);

// タグ関連のエンドポイント
app.get("/api/tags", async (c) => {
  const tags = await tagService.getAllTags();
  return c.json(tags);
});

const createTagSchema = z.object({
  name: z.string().min(1),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

app.post("/api/tags", zValidator("json", createTagSchema), async (c) => {
  const data = c.req.valid("json");
  const tag = await tagService.createTag(data);
  return c.json(tag, 201);
});

const updateTagSchema = z.object({
  name: z.string().min(1).optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
});

app.patch("/api/tags/:id", zValidator("json", updateTagSchema), async (c) => {
  const id = Number(c.req.param("id"));
  const data = c.req.valid("json");
  const tag = await tagService.updateTag({ id, ...data });
  return c.json(tag);
});

app.delete("/api/tags/:id", async (c) => {
  const id = Number(c.req.param("id"));
  await tagService.deleteTag(id);
  return c.json({ success: true });
});

export default app;
