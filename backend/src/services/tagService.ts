import type { PrismaClient, Tag } from "@prisma/client/edge";
import type { CreateTagInput, UpdateTagInput } from "../types/database";

interface SerializedTag extends Omit<Tag, "createdAt" | "updatedAt"> {
  createdAt: string;
  updatedAt: string;
}

const serializeTag = (tag: Tag): SerializedTag => {
  return {
    ...tag,
    createdAt: tag.createdAt.toISOString(),
    updatedAt: tag.updatedAt.toISOString(),
  };
};

export const createTagService = (prisma: PrismaClient) => ({
  async getAllTags(): Promise<SerializedTag[]> {
    const tags = await prisma.tag.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return tags.map(serializeTag);
  },

  async getTagById(id: number): Promise<SerializedTag | null> {
    const tag = await prisma.tag.findUnique({
      where: { id },
    });
    return tag ? serializeTag(tag) : null;
  },

  async createTag(data: CreateTagInput): Promise<SerializedTag> {
    const tag = await prisma.tag.create({
      data,
    });
    return serializeTag(tag);
  },

  async updateTag(data: UpdateTagInput): Promise<SerializedTag> {
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
});
