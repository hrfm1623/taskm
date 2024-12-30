import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  statusId: z.number().int().positive(),
  dueDate: z.string().datetime().optional(),
  position: z.number().int(),
  tagIds: z.array(z.number().int().positive()).optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  statusId: z.number().int().positive().optional(),
  dueDate: z.string().datetime().nullable().optional(),
  position: z.number().int().optional(),
  tagIds: z.array(z.number().int().positive()).optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
