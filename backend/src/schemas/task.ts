import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  statusId: z.number().int().positive(),
  dueDate: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(([+-]\d{2}:?\d{2})|Z)?)?$/,
      "Invalid date format. Use YYYY-MM-DD or ISO 8601 format"
    )
    .optional(),
  position: z.number().int(),
  tagIds: z.array(z.number().int().positive()).optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  statusId: z.number().int().positive().optional(),
  dueDate: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(([+-]\d{2}:?\d{2})|Z)?)?$/,
      "Invalid date format. Use YYYY-MM-DD or ISO 8601 format"
    )
    .nullable()
    .optional(),
  position: z.number().int().optional(),
  tagIds: z.array(z.number().int().positive()).optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
