import type { PrismaClient, Status, Tag, Task } from "@prisma/client/edge";
import type { CreateTaskInput, UpdateTaskInput } from "../schemas/task";

interface SerializedTask
  extends Omit<Task, "createdAt" | "updatedAt" | "dueDate"> {
  createdAt: string;
  updatedAt: string;
  dueDate: string | null;
  status: {
    id: number;
    name: string;
    color: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  tags: {
    id: number;
    name: string;
    color: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

const serializeTask = (
  task: Task & { status: Status | null; tags: Tag[] }
): SerializedTask => {
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
    tags: task.tags.map((tag) => ({
      ...tag,
      createdAt: tag.createdAt.toISOString(),
      updatedAt: tag.updatedAt.toISOString(),
    })),
  };
};

export const createTaskService = (prisma: PrismaClient) => ({
  async getAllTasks(): Promise<SerializedTask[]> {
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

  async getTaskById(id: number): Promise<SerializedTask | null> {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        status: true,
        tags: true,
      },
    });
    return task ? serializeTask(task) : null;
  },

  async createTask(data: CreateTaskInput): Promise<SerializedTask> {
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

  async updateTask(id: number, data: UpdateTaskInput): Promise<SerializedTask> {
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

  async deleteTask(id: number): Promise<void> {
    await prisma.task.delete({
      where: { id },
    });
  },

  async updateTaskPositions(taskIds: number[]): Promise<void> {
    const updates = taskIds.map((id, index) => {
      return prisma.task.update({
        where: { id },
        data: { position: index },
      });
    });
    await prisma.$transaction(updates);
  },
});
