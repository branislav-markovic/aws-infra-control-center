import { styleText } from "node:util";
import type { AWSCommand } from "../interfaces/aws-command.js";
import type { S3Service } from "../services/s3-service.js";

export class CreateS3BucketCommand implements AWSCommand {
	constructor(
		private s3Service: S3Service,
		private bucketName: string,
	) {}

	async execute(): Promise<void> {
		try {
			await this.s3Service.createNewBucket(this.bucketName);
			console.log(
				styleText(
					"green",
					`S3 bucket "${this.bucketName}" created successfully.`,
				),
			);
		} catch {
			console.error(
				`Failed to create S3 bucket "${this.bucketName}". Please check the bucket name and your AWS permissions.`,
			);
		}
	}
}
