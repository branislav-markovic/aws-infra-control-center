import { S3Client } from "@aws-sdk/client-s3";
import { awsConfig } from "../config/aws.config.js";
import { S3Service } from "../services/s3-service.js";

export class S3ServiceFactory {
	static create() {
		const client = new S3Client({ region: awsConfig.region });

		return new S3Service(client);
	}
}
