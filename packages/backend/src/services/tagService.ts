import { prisma } from '../lib/prisma';
import type { Tag } from '@prisma/client';
import type { CreateTagInput, UpdateTagInput } from '../types/database';

export const tagService = {
  async getAllTags(): Promise<Tag[]> {
    return prisma.tag.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  },

  async getTagById(id: number): Promise<Tag | null> {
    return prisma.tag.findUnique({
      where: { id },
    });
  },

  async createTag(data: CreateTagInput): Promise<Tag> {
    return prisma.tag.create({
      data,
    });
  },

  async updateTag(data: UpdateTagInput): Promise<Tag> {
    const { id, ...updateData } = data;
    return prisma.tag.update({
      where: { id },
      data: updateData,
    });
  },

  async deleteTag(id: number): Promise<void> {
    await prisma.tag.delete({
      where: { id },
    });
  },
};
