import { and, eq } from "drizzle-orm";
import type { Database } from "../db";
import type { Tag } from "../db/schema/tag";
import { tags } from "../db/schema/tag";
import type { Task } from "../db/schema/task";
import { tasks, taskTags } from "../db/schema/task";
import type { TaskStatus } from "../db/schema/taskStatus";
import { taskStatuses } from "../db/schema/taskStatus";
import type { CreateTaskInput, UpdateTaskInput } from "../schemas/task";

type SerializedTask = Omit<Task, "statusId"> & {
  status: TaskStatus | null;
  tags: Tag[];
};

export const createTaskService = (db: Database) => ({
  async getAllTasks(): Promise<SerializedTask[]> {
    const tasksWithStatus = await db
      .select({
        task: tasks,
        status: taskStatuses,
      })
      .from(tasks)
      .leftJoin(taskStatuses, eq(tasks.statusId, taskStatuses.id))
      .orderBy(tasks.position);

    const taskIds = tasksWithStatus.map((t) => t.task.id);
    const taskTagsResult = await db
      .select({
        taskId: taskTags.taskId,
        tag: tags,
      })
      .from(taskTags)
      .innerJoin(tags, eq(taskTags.tagId, tags.id))
      .where(and(...taskIds.map((id) => eq(taskTags.taskId, id))));

    const tagsByTaskId = taskTagsResult.reduce<Record<number, Tag[]>>(
      (acc, { taskId, tag }) => {
        if (!acc[taskId]) {
          acc[taskId] = [];
        }
        acc[taskId].push(tag);
        return acc;
      },
      {}
    );

    return tasksWithStatus.map(({ task, status }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { statusId, ...rest } = task;
      return {
        ...rest,
        status,
        tags: tagsByTaskId[task.id] || [],
      };
    });
  },

  async getTaskById(id: number): Promise<SerializedTask | null> {
    const [taskWithStatus] = await db
      .select({
        task: tasks,
        status: taskStatuses,
      })
      .from(tasks)
      .leftJoin(taskStatuses, eq(tasks.statusId, taskStatuses.id))
      .where(eq(tasks.id, id))
      .limit(1);

    if (!taskWithStatus) return null;

    const taskTagsResult = await db
      .select({
        tag: tags,
      })
      .from(taskTags)
      .innerJoin(tags, eq(taskTags.tagId, tags.id))
      .where(eq(taskTags.taskId, id));

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { statusId, ...rest } = taskWithStatus.task;
    return {
      ...rest,
      status: taskWithStatus.status,
      tags: taskTagsResult.map((r) => r.tag),
    };
  },

  async createTask(data: CreateTaskInput): Promise<SerializedTask> {
    const { tagIds, ...taskData } = data;
    const now = new Date().toISOString();

    const [result] = await db
      .insert(tasks)
      .values({
        title: taskData.title,
        description: taskData.description ?? null,
        dueDate: taskData.dueDate ?? null,
        position: taskData.position,
        statusId: taskData.statusId,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    if (!result) {
      throw new Error("Failed to create task");
    }

    if (tagIds && tagIds.length > 0) {
      await db.insert(taskTags).values(
        tagIds.map((tagId) => ({
          taskId: result.id,
          tagId,
        }))
      );
    }

    const createdTask = await this.getTaskById(result.id);
    if (!createdTask) {
      throw new Error(`Failed to retrieve created task with ID ${result.id}`);
    }

    return createdTask;
  },

  async updateTask(
    id: number,
    data: Omit<UpdateTaskInput, "id">
  ): Promise<SerializedTask> {
    const { tagIds, ...updateData } = data;
    const now = new Date().toISOString();

    const [result] = await db
      .update(tasks)
      .set({
        ...updateData,
        dueDate: updateData.dueDate ?? null,
        updatedAt: now,
      })
      .where(eq(tasks.id, id))
      .returning();

    if (!result) {
      throw new Error(`Failed to update task with ID ${id}`);
    }

    if (tagIds !== undefined) {
      await db.delete(taskTags).where(eq(taskTags.taskId, id));

      if (tagIds.length > 0) {
        await db.insert(taskTags).values(
          tagIds.map((tagId) => ({
            taskId: id,
            tagId,
          }))
        );
      }
    }

    const updatedTask = await this.getTaskById(id);
    if (!updatedTask) {
      throw new Error(`Failed to retrieve updated task with ID ${id}`);
    }

    return updatedTask;
  },

  async deleteTask(id: number): Promise<void> {
    await db.delete(taskTags).where(eq(taskTags.taskId, id));
    await db.delete(tasks).where(eq(tasks.id, id));
  },

  async updateTaskPositions(taskIds: number[]): Promise<void> {
    await Promise.all(
      taskIds.map((id, index) =>
        db.update(tasks).set({ position: index }).where(eq(tasks.id, id))
      )
    );
  },
});
