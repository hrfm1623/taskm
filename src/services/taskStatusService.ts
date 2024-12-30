import { prisma } from "../lib/prisma";
import type { TaskStatus } from "@prisma/client";
import type {
  CreateTaskStatusInput,
  UpdateTaskStatusInput,
} from "../types/database";

export const taskStatusService = {
  async getAllTaskStatuses(): Promise<TaskStatus[]> {
    return prisma.taskStatus.findMany({
      orderBy: {
        id: "asc",
      },
    });
  },

  async getTaskStatusById(id: number): Promise<TaskStatus | null> {
    return prisma.taskStatus.findUnique({
      where: { id },
    });
  },

  async createTaskStatus(data: CreateTaskStatusInput): Promise<TaskStatus> {
    return prisma.taskStatus.create({
      data,
    });
  },

  async updateTaskStatus(data: UpdateTaskStatusInput): Promise<TaskStatus> {
    const { id, ...updateData } = data;
    return prisma.taskStatus.update({
      where: { id },
      data: updateData,
    });
  },

  async deleteTaskStatus(id: number): Promise<void> {
    await prisma.taskStatus.delete({
      where: { id },
    });
  },
};
