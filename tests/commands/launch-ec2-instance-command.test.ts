import assert from "node:assert";
import { test } from "node:test";
import type { Queue } from "bullmq";
import { LaunchEC2Instance } from "../../aws_commands/launch-ec2-instance-command.js";
import type { EC2Service } from "../../services/ec2-service.js";

test("execute calls launchInstance", async () => {
	let wasCalled = false;
	const fakeEC2Service = {
		launchInstance: async () => {
			wasCalled = true;
			return "i-123";
		},
	} as EC2Service;
	const fakeEmailQueue = {
		add: async () => Promise.resolve(),
	} as unknown as Queue;

	const command = new LaunchEC2Instance(fakeEC2Service, fakeEmailQueue);
	await command.execute();

	assert.strictEqual(wasCalled, true);
});
