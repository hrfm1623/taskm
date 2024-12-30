import type { PrismaClient, Status } from "@prisma/client/edge";
import type {
  CreateTaskStatusInput,
  UpdateTaskStatusInput,
} from "../types/database";

interface SerializedStatus extends Omit<Status, "createdAt" | "updatedAt"> {
  createdAt: string;
  updatedAt: string;
}

const serializeTaskStatus = (status: Status): SerializedStatus => {
  return {
    ...status,
    createdAt: status.createdAt.toISOString(),
    updatedAt: status.updatedAt.toISOString(),
  };
};

export const createTaskStatusService = (prisma: PrismaClient) => ({
  async getAllTaskStatuses(): Promise<SerializedStatus[]> {
    const statuses = await prisma.status.findMany({
      orderBy: {
        id: "asc",
      },
    });
    return statuses.map(serializeTaskStatus);
  },

  async getTaskStatusById(id: number): Promise<SerializedStatus | null> {
    const status = await prisma.status.findUnique({
      where: { id },
    });
    return status ? serializeTaskStatus(status) : null;
  },

  async createTaskStatus(
    data: CreateTaskStatusInput
  ): Promise<SerializedStatus> {
    const status = await prisma.status.create({
      data,
    });
    return serializeTaskStatus(status);
  },

  async updateTaskStatus(
    data: UpdateTaskStatusInput
  ): Promise<SerializedStatus> {
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
});
