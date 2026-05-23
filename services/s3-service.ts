import { CreateBucketCommand, S3Client } from "@aws-sdk/client-s3";

export class S3Service {
    constructor(private client: S3Client) {}

    async createNewBucket(bucketName: string): Promise<string> {
        try {
            const data = await this.client.send(
                new CreateBucketCommand(
                    { Bucket: bucketName }
                )
            );
            return `Bucket "${bucketName}" created successfully. Location: ${data.Location}`;
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to create bucket "${bucketName}".`);
        }
    }
}