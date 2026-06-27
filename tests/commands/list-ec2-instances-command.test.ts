import assert from "node:assert";
import { test } from "node:test";
import type { Queue } from "bullmq";
import { ListEC2InstancesCommand } from "../../aws_commands/list-ec2-instances-command.js";
import type { EC2Service } from "../../services/ec2-service.js";

test("execute calls listInstances", async () => {
	let wasCalled = false;
	const fakeEC2Service = {
		listInstances: async () => {
			wasCalled = true;
			return "instance list";
		},
	} as EC2Service;
	const fakeEmailQueue = {
		add: async () => Promise.resolve(),
	} as unknown as Queue;

	const command = new ListEC2InstancesCommand(fakeEC2Service, fakeEmailQueue);
	await command.execute();

	assert.strictEqual(wasCalled, true);
});
