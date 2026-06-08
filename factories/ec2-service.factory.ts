import { EC2Client } from "@aws-sdk/client-ec2";
import { awsConfig } from "../config/aws.config.js";
import { EC2Service } from "../services/ec2-service.js";

export class EC2ServiceFactory {
	static create(): EC2Service {
		const client = new EC2Client({
			region: awsConfig.region,
		});
		return new EC2Service(client);
	}
}
