import assert from "node:assert";
import { test } from "node:test";
import type { Queue } from "bullmq";
import { DeleteEC2InstanceCommand } from "../../aws_commands/delete-ec2-instance-command.js";
import type { EC2Service } from "../../services/ec2-service.js";

test("execute calls terminateInstance with correct instance id", async () => {
	let receivedInstanceId: string = "";
	const fakeEC2Service = {
		terminateInstance: async (instanceId: string) => {
			receivedInstanceId = instanceId;
			return "success";
		},
	} as EC2Service;
	const fakeEmailQueue = {
		add: async () => Promise.resolve(),
	} as unknown as Queue;
	const command = new DeleteEC2InstanceCommand(
		fakeEC2Service,
		fakeEmailQueue,
		"i-123",
	);
	await command.execute();
	assert.strictEqual(receivedInstanceId, "i-123");
});
