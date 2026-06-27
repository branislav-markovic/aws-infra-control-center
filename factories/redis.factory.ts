import { Redis } from "ioredis";

export class RedisFactory {
	static create(): Redis {
		return new Redis({ maxRetriesPerRequest: null });
	}
}
