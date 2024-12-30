import { prisma } from "../lib/prisma";
import type { Tag } from "@prisma/client";
import type { CreateTagInput, UpdateTagInput } from "../types/database";

const serializeTag = (tag: any) => {
  return {
    ...tag,
    createdAt: tag.createdAt.toISOString(),
    updatedAt: tag.updatedAt.toISOString(),
  };
};

export const tagService = {
  async getAllTags(): Promise<Tag[]> {
    const tags = await prisma.tag.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return tags.map(serializeTag);
  },

  async getTagById(id: number): Promise<Tag | null> {
    const tag = await prisma.tag.findUnique({
      where: { id },
    });
    return tag ? serializeTag(tag) : null;
  },

  async createTag(data: CreateTagInput): Promise<Tag> {
    const tag = await prisma.tag.create({
      data,
    });
    return serializeTag(tag);
  },

  async updateTag(data: UpdateTagInput): Promise<Tag> {
    const { id, ...updateData } = data;
    const tag = await prisma.tag.update({
      where: { id },
      data: updateData,
    });
    return serializeTag(tag);
  },

  async deleteTag(id: number): Promise<void> {
    await prisma.tag.delete({
      where: { id },
    });
  },
};
