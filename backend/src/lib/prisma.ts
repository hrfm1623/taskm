import { PrismaClient } from "@prisma/client/edge";

const createPrismaClient = (databaseUrl: string) => {
  return new PrismaClient({
    datasourceUrl: databaseUrl,
  });
};

export { createPrismaClient };
