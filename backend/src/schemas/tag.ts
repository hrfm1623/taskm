import { z } from "zod";

export const createTagSchema = z.object({
  name: z.string().min(1, "Name is required"),
  color: z.string().min(1, "Color is required"),
});

export const updateTagSchema = z.object({
  name: z.string().min(1).optional(),
  color: z.string().min(1).optional(),
});

export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
