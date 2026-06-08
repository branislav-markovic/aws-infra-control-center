import assert from "node:assert";
import { test } from "node:test";
import { DeleteS3BucketCommand } from "../../aws_commands/delete-s3-bucket-command.js";
import type { S3Service } from "../../services/s3-service.js";

test("execute calls deleteBucket with correct bucket name", async () => {
	let receivedBucketName = "";
	const fakeS3Service = {
		deleteBucket: async (bucketName: string) => {
			receivedBucketName = bucketName;
			return "success";
		},
	} as S3Service;

	const command = new DeleteS3BucketCommand(fakeS3Service, "my-bucket");
	await command.execute();

	assert.strictEqual(receivedBucketName, "my-bucket");
});
