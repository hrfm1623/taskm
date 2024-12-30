import type {
  CreateTagInput,
  CreateTaskInput,
  CreateTaskStatusInput,
  Tag,
  Task,
  TaskStatus,
  UpdateTagInput,
  UpdateTaskInput,
  UpdateTaskStatusInput,
} from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    console.log(`Fetching ${API_BASE_URL}${endpoint}`, options);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("API Error:", error);
      throw new Error(error.message || "APIエラーが発生しました");
    }

    const data = await response.json();
    console.log(`Response from ${endpoint}:`, data);
    return data;
  } catch (error) {
    console.error("API Request Failed:", error);
    throw error;
  }
}

export const api = {
  // タスク関連
  getTasks: () => fetchApi<Task[]>("/api/tasks"),

  createTask: (data: CreateTaskInput) =>
    fetchApi<Task>("/api/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateTask: ({ id, ...data }: UpdateTaskInput) =>
    fetchApi<Task>(`/api/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteTask: (id: number) =>
    fetchApi<void>(`/api/tasks/${id}`, {
      method: "DELETE",
    }),

  reorderTasks: (taskIds: number[]) =>
    fetchApi<void>("/api/tasks/reorder", {
      method: "POST",
      body: JSON.stringify({ taskIds }),
    }),

  // タグ関連
  getTags: () => fetchApi<Tag[]>("/api/tags"),

  createTag: (data: CreateTagInput) =>
    fetchApi<Tag>("/api/tags", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateTag: ({ id, ...data }: UpdateTagInput) =>
    fetchApi<Tag>(`/api/tags/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteTag: (id: number) =>
    fetchApi<void>(`/api/tags/${id}`, {
      method: "DELETE",
    }),

  // タスクステータス関連
  getTaskStatuses: () => fetchApi<TaskStatus[]>("/api/task-statuses"),

  createTaskStatus: (data: CreateTaskStatusInput) =>
    fetchApi<TaskStatus>("/api/task-statuses", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateTaskStatus: ({ id, ...data }: UpdateTaskStatusInput) =>
    fetchApi<TaskStatus>(`/api/task-statuses/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteTaskStatus: (id: number) =>
    fetchApi<void>(`/api/task-statuses/${id}`, {
      method: "DELETE",
    }),
};
