import type { D1Database } from "@cloudflare/workers-types";

type Bindings = {
  DB: D1Database;
  ENV: "development" | "production";
};

export type Env = Bindings;
