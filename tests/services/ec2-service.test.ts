import { test, beforeEach } from "node:test";
import assert from "node:assert";
import { EC2Service } from "../../services/ec2-service.js";
import {
	DescribeInstancesCommand,
	EC2Client,
	RebootInstancesCommand,
	RunInstancesCommand,
	TerminateInstancesCommand,
} from "@aws-sdk/client-ec2";

let ec2Service: EC2Service;
let fakeEC2Client: EC2Client;
let receivedCommand:
	| RunInstancesCommand
	| DescribeInstancesCommand
	| TerminateInstancesCommand
	| RebootInstancesCommand;

beforeEach(() => {
	fakeEC2Client = {
		send: async () => {},
	} as unknown as EC2Client;

	ec2Service = new EC2Service(fakeEC2Client);
});

test("launchInstance returns instance id when instance is created", async () => {
	fakeEC2Client.send = async (command: any) => {
		receivedCommand = command;
		return {
			Instances: [
				{
					InstanceId: "i-123",
				},
			],
		};
	};

	const result = await ec2Service.launchInstance();
	assert.ok(receivedCommand instanceof RunInstancesCommand);
	assert.strictEqual(result, "i-123");
});

test("launchInstance throws friendly error when instance id is missing", async () => {
	fakeEC2Client.send = async () => ({
		Instances: [],
	});

	await assert.rejects(
		async () => {
			await ec2Service.launchInstance();
		},
		{
			message: "Failed to launch EC2 instance.",
		},
	);
});

test("launchInstance throws friendly error when AWS fails", async () => {
	fakeEC2Client.send = async () => {
		throw new Error("AWS Failure");
	};

	await assert.rejects(
		async () => {
			await ec2Service.launchInstance();
		},
		{
			message: "Failed to launch EC2 instance.",
		},
	);
});

test("listInstances returns instance ids when instances exist", async () => {
	fakeEC2Client.send = async (command: any) => {
		receivedCommand = command;
		return {
			Reservations: [
				{
					Instances: [
						{
							InstanceId: "i-123",
						},
						{
							InstanceId: "i-456",
						},
					],
				},
			],
		};
	};

	const result = await ec2Service.listInstances();
	assert.ok(receivedCommand instanceof DescribeInstancesCommand);
	assert.strictEqual(result, "i-123\ni-456");
});

test("listInstances returns no instances found when no reservations exist", async () => {
	fakeEC2Client.send = async () => ({
		Reservations: [],
	});

	const result = await ec2Service.listInstances();
	assert.strictEqual(result, "No instances found.");
});

test("listInstances throws friendly error when AWS fails", async () => {
	fakeEC2Client.send = async () => {
		throw new Error("AWS Failure");
	};

	await assert.rejects(
		async () => {
			await ec2Service.listInstances();
		},
		{
			message: "Failed to list EC2 instances.",
		},
	);
});

test("terminateInstance returns instance id when instance is terminated", async () => {
	fakeEC2Client.send = async (command: any) => {
		receivedCommand = command;
		return {};
	};

	const result = await ec2Service.terminateInstance("i-123");
	assert.ok(receivedCommand instanceof TerminateInstancesCommand);
	assert.deepStrictEqual(receivedCommand.input, {
		InstanceIds: ["i-123"],
	});
	assert.strictEqual(result, 'Instance "i-123" terminated successfully.');
});

test("terminateInstance throws friendly error when AWS fails", async () => {
	fakeEC2Client.send = async () => {
		throw new Error("AWS Failure");
	};

	await assert.rejects(
		async () => {
			await ec2Service.terminateInstance("i-123");
		},
		{
			message: 'Failed to terminate instance "i-123".',
		},
	);
});

test("rebootInstance returns instance id when instance is rebooted", async () => {
	fakeEC2Client.send = async (command: any) => {
		receivedCommand = command;
		return {};
	};

	const result = await ec2Service.rebootInstance("i-123");
	assert.ok(receivedCommand instanceof RebootInstancesCommand);
	assert.deepStrictEqual(receivedCommand.input, {
		InstanceIds: ["i-123"],
	});
	assert.strictEqual(result, 'Instance "i-123" rebooted successfully.');
});

test("rebootInstance throws friendly error when AWS fails", async () => {
	fakeEC2Client.send = async () => {
		throw new Error("AWS Failure");
	};

	await assert.rejects(
		async () => {
			await ec2Service.rebootInstance("i-123");
		},
		{
			message: 'Failed to reboot instance "i-123".',
		},
	);
});
