import { Redis } from "ioredis";

export function getRedisOptions(env: NodeJS.ProcessEnv = process.env) {
	return {
		host: env.REDIS_HOST ?? "127.0.0.1",
		port: Number(env.REDIS_PORT ?? 6379),
		maxRetriesPerRequest: null,
	};
}

export class RedisFactory {
	static create(): Redis {
		return new Redis(getRedisOptions());
	}
}
