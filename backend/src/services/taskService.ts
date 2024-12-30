import { prisma } from "../lib/prisma";
import type { CreateTaskInput, UpdateTaskInput } from "../schemas/task";

const serializeTask = (task: any) => {
  return {
    ...task,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
    dueDate: task.dueDate ? task.dueDate.toISOString() : null,
    status: task.status
      ? {
          ...task.status,
          createdAt: task.status.createdAt.toISOString(),
          updatedAt: task.status.updatedAt.toISOString(),
        }
      : null,
    tags: task.tags
      ? task.tags.map((tag: any) => ({
          ...tag,
          createdAt: tag.createdAt.toISOString(),
          updatedAt: tag.updatedAt.toISOString(),
        }))
      : [],
  };
};

export const taskService = {
  async getAllTasks() {
    const tasks = await prisma.task.findMany({
      include: {
        status: true,
        tags: true,
      },
      orderBy: {
        position: "asc",
      },
    });
    return tasks.map(serializeTask);
  },

  async getTaskById(id: number) {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        status: true,
        tags: true,
      },
    });
    return task ? serializeTask(task) : null;
  },

  async createTask(data: CreateTaskInput) {
    const { tagIds, ...taskData } = data;
    const task = await prisma.task.create({
      data: {
        ...taskData,
        tags: tagIds
          ? {
              connect: tagIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        status: true,
        tags: true,
      },
    });
    return serializeTask(task);
  },

  async updateTask(id: number, data: UpdateTaskInput) {
    const { tagIds, ...taskData } = data;
    const task = await prisma.task.update({
      where: { id },
      data: {
        ...taskData,
        tags: tagIds
          ? {
              set: tagIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        status: true,
        tags: true,
      },
    });
    return serializeTask(task);
  },

  async deleteTask(id: number) {
    return prisma.task.delete({
      where: { id },
    });
  },

  async updateTaskPositions(taskIds: number[]) {
    const updates = taskIds.map((id, index) => {
      return prisma.task.update({
        where: { id },
        data: { position: index },
      });
    });
    return prisma.$transaction(updates);
  },
};
