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

test("execute enqueues failure job when delete EC2 instance fails", async () => {
	let receivedJobName = "";
	let receivedJobData: unknown = null;
	const fakeEmailQueue = {
		add: async (name: string, data: unknown) => {
			receivedJobName = name;
			receivedJobData = data;
			return Promise.resolve();
		},
	} as unknown as Queue;

	const fakeEC2Service = {
		terminateInstance: async () => {
			throw new Error("boom");
		},
	} as unknown as EC2Service;

	const command = new DeleteEC2InstanceCommand(
		fakeEC2Service,
		fakeEmailQueue,
		"i-123",
	);
	await command.execute();

	assert.strictEqual(receivedJobName, "terminateEc2Failed");

	const payload = receivedJobData as {
		message: string;
		command: string;
		resourceId: string;
		error: { name: string; message: string; stack: string };
	};

	assert.strictEqual(
		payload.message,
		'Failed to terminate EC2 instance "i-123". Please check the instance ID and your AWS permissions.',
	);
	assert.strictEqual(payload.command, "DeleteEC2InstanceCommand");
	assert.strictEqual(payload.resourceId, "i-123");
	assert.strictEqual(payload.error.name, "Error");
	assert.strictEqual(payload.error.message, "boom");
	assert.ok(typeof payload.error.stack === "string");
});
