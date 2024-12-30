import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
  createTaskStatusSchema,
  updateTaskStatusSchema,
} from "../schemas/taskStatus";
import type {
  CreateTaskStatusInput,
  UpdateTaskStatusInput,
} from "../types/database";
import type { Env } from "../types/env";

const router = new Hono<Env>();

// ステータス一覧の取得
router.get("/", async (c) => {
  const taskStatusService = c.get("taskStatusService");
  const statuses = await taskStatusService.getAllTaskStatuses();
  return c.json(statuses);
});

// ステータスの作成
router.post("/", zValidator("json", createTaskStatusSchema), async (c) => {
  const taskStatusService = c.get("taskStatusService");
  const data = c.req.valid("json") as CreateTaskStatusInput;
  const status = await taskStatusService.createTaskStatus(data);
  return c.json(status, 201);
});

// ステータスの更新
router.put("/:id", zValidator("json", updateTaskStatusSchema), async (c) => {
  const taskStatusService = c.get("taskStatusService");
  const id = Number(c.req.param("id"));
  const data = c.req.valid("json") as Omit<UpdateTaskStatusInput, "id">;
  const status = await taskStatusService.updateTaskStatus({ id, ...data });
  return c.json(status);
});

// ステータスの削除
router.delete("/:id", async (c) => {
  const taskStatusService = c.get("taskStatusService");
  const id = Number(c.req.param("id"));
  await taskStatusService.deleteTaskStatus(id);
  return c.json({ message: "Status deleted successfully" });
});

export default router;
