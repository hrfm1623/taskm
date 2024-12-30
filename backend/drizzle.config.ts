import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema/*",
  out: "./drizzle",
  dialect: "sqlite",
  driver: "durable-sqlite",
  verbose: true,
  strict: true,
} satisfies Config;
