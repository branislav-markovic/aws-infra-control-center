import type { ConnectionOptions } from "bullmq";
import { RedisFactory } from "../factories/redis.factory.js";

const redis = RedisFactory.create();

export default redis;
