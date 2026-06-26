import type { ConnectionOptions } from "bullmq";
import { Redis } from "ioredis";

const redis = new Redis({ maxRetriesPerRequest: null });

export default redis as ConnectionOptions;
