import { D1Database } from "@cloudflare/workers-types";

const createD1Client = (db: D1Database) => {
  if (!db) {
    throw new Error("D1 database instance is required");
  }

  return db;
};

export { createD1Client };
