import { styleText } from "node:util";
import type { Queue } from "bullmq";
import logger from "../config/logger.js";
import type { AWSCommand } from "../interfaces/aws-command.js";
import { AuditLogModel } from "../models/ActionLog.js";
import type { S3Service } from "../services/s3-service.js";

export class CreateS3BucketCommand implements AWSCommand {
	constructor(
		private s3Service: S3Service,
		private emailQueue: Queue,
		private bucketName: string,
	) {}

	async execute(): Promise<void> {
		try {
			await this.s3Service.createNewBucket(this.bucketName);
			await AuditLogModel.create({
				commandName: "CreateS3BucketCommand",
				action: "Create S3 bucket",
				resourceId: null,
				message: `S3 bucket "${this.bucketName}" created successfully.`,
			});
			console.log(
				styleText(
					"green",
					`S3 bucket "${this.bucketName}" created successfully.`,
				),
			);
		} catch (error) {
			const message = `Failed to create S3 bucket "${this.bucketName}". Please check the bucket name and your AWS permissions.`;
			logger.error(message, error);
			await this.emailQueue.add("createS3Failed", {
				message,
				command: "CreateS3BucketCommand",
				resourceId: this.bucketName,
				error: {
					name: (error as Error).name ?? "",
					message: (error as Error).message ?? "",
					stack: (error as Error).stack ?? "",
				},
			});
		}
	}
}
