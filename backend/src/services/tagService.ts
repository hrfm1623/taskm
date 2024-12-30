import { eq } from "drizzle-orm";
import type { Database } from "../db";
import type { NewTag, Tag } from "../db/schema/tag";
import { tags } from "../db/schema/tag";
import type { CreateTagInput, UpdateTagInput } from "../types/database";

export const createTagService = (db: Database) => ({
  async getAllTags(): Promise<Tag[]> {
    return db.select().from(tags).orderBy(tags.name);
  },

  async getTagById(id: number): Promise<Tag | null> {
    const [result] = await db
      .select()
      .from(tags)
      .where(eq(tags.id, id))
      .limit(1);
    return result ?? null;
  },

  async createTag(data: CreateTagInput): Promise<Tag> {
    const now = new Date().toISOString();
    const newTag: NewTag = {
      name: data.name,
      color: data.color,
      createdAt: now,
      updatedAt: now,
    };

    const [result] = await db.insert(tags).values(newTag).returning();

    if (!result) {
      throw new Error("Failed to create tag");
    }

    return result;
  },

  async updateTag(data: UpdateTagInput): Promise<Tag> {
    const { id, ...updateData } = data;
    const now = new Date().toISOString();

    const [result] = await db
      .update(tags)
      .set({
        ...updateData,
        updatedAt: now,
      })
      .where(eq(tags.id, id))
      .returning();

    if (!result) {
      throw new Error(`Failed to update tag with ID ${id}`);
    }

    return result;
  },

  async deleteTag(id: number): Promise<void> {
    await db.delete(tags).where(eq(tags.id, id));
  },
});
