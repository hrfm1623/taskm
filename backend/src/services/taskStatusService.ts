import { prisma } from "../lib/prisma";
import type { Status } from "@prisma/client";
import type {
  CreateTaskStatusInput,
  UpdateTaskStatusInput,
} from "../types/database";

const serializeTaskStatus = (status: any) => {
  return {
    ...status,
    createdAt: status.createdAt.toISOString(),
    updatedAt: status.updatedAt.toISOString(),
  };
};

export const taskStatusService = {
  async getAllTaskStatuses(): Promise<Status[]> {
    const statuses = await prisma.status.findMany({
      orderBy: {
        id: "asc",
      },
    });
    return statuses.map(serializeTaskStatus);
  },

  async getTaskStatusById(id: number): Promise<Status | null> {
    const status = await prisma.status.findUnique({
      where: { id },
    });
    return status ? serializeTaskStatus(status) : null;
  },

  async createTaskStatus(data: CreateTaskStatusInput): Promise<Status> {
    const status = await prisma.status.create({
      data,
    });
    return serializeTaskStatus(status);
  },

  async updateTaskStatus(data: UpdateTaskStatusInput): Promise<Status> {
    const { id, ...updateData } = data;
    const status = await prisma.status.update({
      where: { id },
      data: updateData,
    });
    return serializeTaskStatus(status);
  },

  async deleteTaskStatus(id: number): Promise<void> {
    await prisma.status.delete({
      where: { id },
    });
  },
};
