import { styleText } from "node:util";
import logger from "../config/logger.js";
import type { AWSCommand } from "../interfaces/aws-command.js";
import type { EC2Service } from "../services/ec2-service.js";

export class LaunchEC2Instance implements AWSCommand {
	constructor(private ec2Service: EC2Service) {}

	async execute(): Promise<void> {
		try {
			const instanceId = await this.ec2Service.launchInstance();
			console.log(
				styleText(
					"green",
					`EC2 instance launched successfully. Instance ID: ${instanceId}`,
				),
			);
		} catch {
			logger.error(
				"Failed to launch EC2 instance. Please check your AWS configuration and permissions.",
			);
		}
	}
}
