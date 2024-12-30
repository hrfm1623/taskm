import { eq } from "drizzle-orm";
import type { Database } from "../db";
import type { NewTaskStatus, TaskStatus } from "../db/schema/taskStatus";
import { taskStatuses } from "../db/schema/taskStatus";
import type {
  CreateTaskStatusInput,
  UpdateTaskStatusInput,
} from "../types/database";

export const createTaskStatusService = (db: Database) => ({
  async getAllTaskStatuses(): Promise<TaskStatus[]> {
    return db.select().from(taskStatuses);
  },

  async getTaskStatusById(id: number): Promise<TaskStatus | null> {
    const [result] = await db
      .select()
      .from(taskStatuses)
      .where(eq(taskStatuses.id, id))
      .limit(1);
    return result ?? null;
  },

  async createTaskStatus(data: CreateTaskStatusInput): Promise<TaskStatus> {
    const now = new Date().toISOString();
    const newStatus: NewTaskStatus = {
      name: data.name,
      color: data.color,
      createdAt: now,
      updatedAt: now,
    };

    const [result] = await db
      .insert(taskStatuses)
      .values(newStatus)
      .returning();

    if (!result) {
      throw new Error("Failed to create task status");
    }

    return result;
  },

  async updateTaskStatus(data: UpdateTaskStatusInput): Promise<TaskStatus> {
    const { id, ...updateData } = data;
    const now = new Date().toISOString();

    const [result] = await db
      .update(taskStatuses)
      .set({
        ...updateData,
        updatedAt: now,
      })
      .where(eq(taskStatuses.id, id))
      .returning();

    if (!result) {
      throw new Error(`Failed to update status with ID ${id}`);
    }

    return result;
  },

  async deleteTaskStatus(id: number): Promise<void> {
    await db.delete(taskStatuses).where(eq(taskStatuses.id, id));
  },
});
