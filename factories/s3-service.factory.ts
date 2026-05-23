import { S3Client } from "@aws-sdk/client-s3";
import { S3Service } from "../services/s3-service.js";
import { awsConfig } from "../config/aws.config.js";

export class S3ServiceFactory {
    static create() {
        const client = new S3Client({region: awsConfig.region});

        return new S3Service(client);
    }
}