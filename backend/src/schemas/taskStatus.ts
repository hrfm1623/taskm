import { z } from "zod";

export const createTaskStatusSchema = z.object({
  name: z.string().min(1, "Name is required"),
  color: z.string().min(1, "Color is required"),
});

export const updateTaskStatusSchema = z.object({
  name: z.string().min(1).optional(),
  color: z.string().min(1).optional(),
});

export type CreateTaskStatusInput = z.infer<typeof createTaskStatusSchema>;
export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;
