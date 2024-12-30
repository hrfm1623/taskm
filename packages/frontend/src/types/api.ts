export interface Task {
  id: number;
  title: string;
  description: string | null;
  statusId: number;
  dueDate: string | null;
  position: number;
  createdAt: string;
  updatedAt: string;
  status: TaskStatus;
  tags: Tag[];
}

export interface TaskStatus {
  id: number;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: number;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  statusId: number;
  dueDate?: string;
  position: number;
  tagIds?: number[];
}

export interface UpdateTaskInput {
  id: number;
  title?: string;
  description?: string;
  statusId?: number;
  dueDate?: string | null;
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

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
