import type { AWSCommand } from "../interfaces/aws-command.js";
import type { S3Service } from "../services/s3-service.js";

export class DeleteS3BucketCommand implements AWSCommand {
	constructor(
		private s3Service: S3Service,
		private bucketName: string,
	) {}

	async execute(): Promise<void> {
		try {
			await this.s3Service.deleteBucket(this.bucketName);
			console.log(`S3 bucket "${this.bucketName}" deleted successfully.`);
		} catch {
			console.error(
				`Failed to delete S3 bucket "${this.bucketName}". Please check the bucket name and your AWS permissions.`,
			);
		}
	}
}
