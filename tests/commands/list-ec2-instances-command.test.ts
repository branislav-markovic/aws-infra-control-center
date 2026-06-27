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

test("execute enqueues failure job when list instances fails", async () => {
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
		listInstances: async () => {
			throw new Error("boom");
		},
	} as unknown as EC2Service;

	const command = new ListEC2InstancesCommand(fakeEC2Service, fakeEmailQueue);
	await command.execute();

	assert.strictEqual(receivedJobName, "listEc2Failed");

	const payload = receivedJobData as {
		message: string;
		command: string;
		error: { name: string; message: string; stack: string };
	};

	assert.strictEqual(
		payload.message,
		"Failed to list EC2 instances. Please check your AWS configuration and permissions.",
	);
	assert.strictEqual(payload.command, "ListEC2InstancesCommand");
	assert.strictEqual(payload.error.name, "Error");
	assert.strictEqual(payload.error.message, "boom");
	assert.ok(typeof payload.error.stack === "string");
});
