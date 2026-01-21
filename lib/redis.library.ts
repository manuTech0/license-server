import { Redis } from "ioredis";
import { ENV_SERVER } from "@/schema/env.schema";

export const redis = new Redis(ENV_SERVER.REDIS_URL, {
  enableAutoPipelining: true,
});
