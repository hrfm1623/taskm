import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createTagSchema, updateTagSchema } from "../schemas/tag";
import type { CreateTagInput, UpdateTagInput } from "../types/database";
import type { Env } from "../types/env";

const router = new Hono<Env>();

// タグ一覧の取得
router.get("/", async (c) => {
  const tagService = c.get("tagService");
  const tags = await tagService.getAllTags();
  return c.json(tags);
});

// タグの作成
router.post("/", zValidator("json", createTagSchema), async (c) => {
  const tagService = c.get("tagService");
  const data = c.req.valid("json") as CreateTagInput;
  const tag = await tagService.createTag(data);
  return c.json(tag, 201);
});

// タグの更新
router.put("/:id", zValidator("json", updateTagSchema), async (c) => {
  const tagService = c.get("tagService");
  const id = Number(c.req.param("id"));
  const data = c.req.valid("json") as Omit<UpdateTagInput, "id">;
  const tag = await tagService.updateTag({ id, ...data });
  return c.json(tag);
});

// タグの削除
router.delete("/:id", async (c) => {
  const tagService = c.get("tagService");
  const id = Number(c.req.param("id"));
  await tagService.deleteTag(id);
  return c.json({ message: "Tag deleted successfully" });
});

export default router;
