import { Task, Tag, TaskStatus } from '@prisma/client';

export interface TaskWithRelations extends Task {
  status: TaskStatus;
  tags: Tag[];
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  statusId: number;
  dueDate?: Date;
  position: number;
  tagIds?: number[];
}

export interface UpdateTaskInput {
  id: number;
  title?: string;
  description?: string;
  statusId?: number;
  dueDate?: Date | null;
  position?: number;
  tagIds?: number[];
}

export interface CreateTagInput {
  name: string;
  color: string;
}

export interface UpdateTagInput {
  id: number;
  name?: string;
  color?: string;
}

export interface CreateTaskStatusInput {
  name: string;
  color: string;
}

export interface UpdateTaskStatusInput {
  id: number;
  name?: string;
  color?: string;
}
