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

test("execute enqueues failure job when launch fails", async () => {
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
		launchInstance: async () => {
			throw new Error("boom");
		},
	} as unknown as EC2Service;

	const command = new LaunchEC2Instance(fakeEC2Service, fakeEmailQueue);
	await command.execute();

	assert.strictEqual(receivedJobName, "launchEc2Failed");

	const payload = receivedJobData as {
		message: string;
		command: string;
		error: { name: string; message: string; stack: string };
	};

	assert.strictEqual(
		payload.message,
		"Failed to launch EC2 instance. Please check your AWS configuration and permissions.",
	);
	assert.strictEqual(payload.command, "LaunchEC2Instance");
	assert.strictEqual(payload.error.name, "Error");
	assert.strictEqual(payload.error.message, "boom");
	assert.ok(typeof payload.error.stack === "string");
});
