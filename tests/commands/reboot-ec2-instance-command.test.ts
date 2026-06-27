import assert from "node:assert";
import { test } from "node:test";
import type { Queue } from "bullmq";
import { RebootEC2InstanceCommand } from "../../aws_commands/reboot-ec2-instance-command.js";
import type { EC2Service } from "../../services/ec2-service.js";

test("execute calls rebootInstance with correct instance id", async () => {
	let receivedInstanceId = "";
	const fakeEC2Service = {
		rebootInstance: async (instanceId: string) => {
			receivedInstanceId = instanceId;
			return "success";
		},
	} as EC2Service;

	const fakeEmailQueue = {
		add: async () => Promise.resolve(),
	} as unknown as Queue;

	const command = new RebootEC2InstanceCommand(
		fakeEC2Service,
		fakeEmailQueue,
		"i-456",
	);
	await command.execute();

	assert.strictEqual(receivedInstanceId, "i-456");
});
