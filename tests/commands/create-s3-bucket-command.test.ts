import assert from "node:assert";
import { test } from "node:test";
import type { Queue } from "bullmq";
import { CreateS3BucketCommand } from "../../aws_commands/create-s3-bucket-command.js";
import type { S3Service } from "../../services/s3-service.js";

test("execute calls createNewBucket with correct bucket name", async () => {
	let receivedBucketName = "";
	const fakeS3Service = {
		createNewBucket: async (bucketName: string) => {
			receivedBucketName = bucketName;
			return "success";
		},
	} as S3Service;
	const fakeEmailQueue = {
		add: async () => Promise.resolve(),
	} as unknown as Queue;
	const command = new CreateS3BucketCommand(
		fakeS3Service,
		fakeEmailQueue,
		"my-bucket",
	);
	await command.execute();

	assert.strictEqual(receivedBucketName, "my-bucket");
});

test("execute enqueues failure job when create bucket fails", async () => {
	let receivedJobName = "";
	let receivedJobData: unknown = null;
	const fakeEmailQueue = {
		add: async (name: string, data: unknown) => {
			receivedJobName = name;
			receivedJobData = data;
			return Promise.resolve();
		},
	} as unknown as Queue;

	const fakeS3Service = {
		createNewBucket: async () => {
			throw new Error("boom");
		},
	} as unknown as S3Service;

	const command = new CreateS3BucketCommand(
		fakeS3Service,
		fakeEmailQueue,
		"my-bucket",
	);

	await command.execute();

	assert.strictEqual(receivedJobName, "createS3Failed");

	const payload = receivedJobData as {
		message: string;
		command: string;
		resourceId: string;
		error: { name: string; message: string; stack: string };
	};

	assert.strictEqual(
		payload.message,
		'Failed to create S3 bucket "my-bucket". Please check the bucket name and your AWS permissions.',
	);
	assert.strictEqual(payload.command, "CreateS3BucketCommand");
	assert.strictEqual(payload.resourceId, "my-bucket");
	assert.strictEqual(payload.error.name, "Error");
	assert.strictEqual(payload.error.message, "boom");
	assert.ok(typeof payload.error.stack === "string");
});
