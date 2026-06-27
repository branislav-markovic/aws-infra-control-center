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
