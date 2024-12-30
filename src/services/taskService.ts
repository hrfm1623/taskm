import { prisma } from "../lib/prisma";
import type {
  CreateTaskInput,
  UpdateTaskInput,
  TaskWithRelations,
} from "../types/database";

export const taskService = {
  async getAllTasks(): Promise<TaskWithRelations[]> {
    return prisma.task.findMany({
      include: {
        status: true,
        tags: true,
      },
      orderBy: {
        position: "asc",
      },
    });
  },

  async getTaskById(id: number): Promise<TaskWithRelations | null> {
    return prisma.task.findUnique({
      where: { id },
      include: {
        status: true,
        tags: true,
      },
    });
  },

  async createTask(data: CreateTaskInput): Promise<TaskWithRelations> {
    const { tagIds, ...taskData } = data;
    return prisma.task.create({
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
  },

  async updateTask(data: UpdateTaskInput): Promise<TaskWithRelations> {
    const { id, tagIds, ...updateData } = data;
    return prisma.task.update({
      where: { id },
      data: {
        ...updateData,
        tags: tagIds
          ? {
              set: tagIds.map((tagId) => ({ id: tagId })),
            }
          : undefined,
      },
      include: {
        status: true,
        tags: true,
      },
    });
  },

  async deleteTask(id: number): Promise<void> {
    await prisma.task.delete({
      where: { id },
    });
  },

  async updateTaskPositions(taskIds: number[]): Promise<void> {
    await prisma.$transaction(
      taskIds.map((id, index) =>
        prisma.task.update({
          where: { id },
          data: { position: index },
        })
      )
    );
  },
};
