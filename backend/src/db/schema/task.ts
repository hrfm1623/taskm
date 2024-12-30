import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { tags } from "./tag";
import { taskStatuses } from "./taskStatus";

export const tasks = sqliteTable("tasks", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: text("due_date"),
  position: integer("position", { mode: "number" }).notNull(),
  statusId: integer("status_id", { mode: "number" }).references(
    () => taskStatuses.id
  ),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").notNull().default("CURRENT_TIMESTAMP"),
});

export const taskTags = sqliteTable("task_tags", {
  taskId: integer("task_id", { mode: "number" })
    .notNull()
    .references(() => tasks.id),
  tagId: integer("tag_id", { mode: "number" })
    .notNull()
    .references(() => tags.id),
});

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type TaskTag = typeof taskTags.$inferSelect;
export type NewTaskTag = typeof taskTags.$inferInsert;
