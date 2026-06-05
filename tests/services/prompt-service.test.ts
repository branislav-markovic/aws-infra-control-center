import { test } from 'node:test'
import assert from 'node:assert';
import { PromptService } from '../../services/prompt-service.js';
import { Interface } from "node:readline/promises";

test('ask trims whitespace from user input', async () => {
    const fakeRl = {
        question: async () => '       hello    '
    } as unknown as Interface;
    
    const promptService = new PromptService(fakeRl);
    const result = await promptService.ask('Prompt: ');
    assert.strictEqual(
        result,
        'hello'
    );
});