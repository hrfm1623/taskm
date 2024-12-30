import type { DrizzleD1Database } from "drizzle-orm/d1";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema/taskStatus";

export const createDb = (d1: D1Database): DrizzleD1Database<typeof schema> => {
  return drizzle(d1, { schema });
};

export type Database = DrizzleD1Database<typeof schema>;
