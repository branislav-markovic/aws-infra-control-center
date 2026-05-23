import { Interface } from "node:readline/promises";

export class PromptService {
    constructor(private rl: Interface) {}

    async ask(message: string): Promise<string> {
        return (await this.rl.question(message)).trim();
    }
}