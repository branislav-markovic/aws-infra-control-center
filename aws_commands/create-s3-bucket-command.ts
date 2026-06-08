import { styleText } from "node:util";
import { AWSCommand } from "../interfaces/aws-command.js";
import { S3Service } from "../services/s3-service.js";

export class CreateS3BucketCommand implements AWSCommand {
	constructor(
		private s3Service: S3Service,
		private bucketName: string,
	) {}

	async execute(): Promise<void> {
		try {
			const result = await this.s3Service.createNewBucket(this.bucketName);
			console.log(
				styleText("green", "New S3 Bucket created successfully: " + result),
			);
		} catch (error) {
			console.error(`Failed to create S3 Bucket "${this.bucketName}".`, error);
		}
	}
}
