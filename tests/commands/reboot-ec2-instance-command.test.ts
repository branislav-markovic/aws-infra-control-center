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

test("execute enqueues failure job when reboot fails", async () => {
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
		rebootInstance: async () => {
			throw new Error("boom");
		},
	} as unknown as EC2Service;

	const command = new RebootEC2InstanceCommand(
		fakeEC2Service,
		fakeEmailQueue,
		"i-456",
	);

	await command.execute();

	assert.strictEqual(receivedJobName, "rebootFailed");

	const payload = receivedJobData as {
		message: string;
		command: string;
		resourceId: string;
		error: { name: string; message: string; stack: string };
	};

	assert.strictEqual(
		payload.message,
		'Failed to reboot EC2 instance "i-456". Please check the instance ID and your AWS permissions.',
	);
	assert.strictEqual(payload.command, "RebootEC2InstanceCommand");
	assert.strictEqual(payload.resourceId, "i-456");
	assert.strictEqual(payload.error.name, "Error");
	assert.strictEqual(payload.error.message, "boom");
	assert.ok(typeof payload.error.stack === "string");
});
