import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const taskStatuses = sqliteTable("task_statuses", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  color: text("color").notNull(),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").notNull().default("CURRENT_TIMESTAMP"),
});

export type TaskStatus = typeof taskStatuses.$inferSelect;
export type NewTaskStatus = typeof taskStatuses.$inferInsert;
