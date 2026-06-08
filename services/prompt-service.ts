import type { Interface } from "node:readline/promises";
import { styleText } from "node:util";
import type { z } from "zod";

export class PromptService {
	constructor(private rl: Interface) {}

	async ask(message: string, schema?: z.ZodType<string>): Promise<string> {
		const input = (await this.rl.question(message)).trim();
		if (!schema) {
			return input;
		}
		const result = schema.safeParse(input);
		if (!result.success) {
			console.log(styleText("red", result.error.issues[0].message));
			return this.ask(message, schema);
		}
		return result.data;
	}
}
