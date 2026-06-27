import { styleText } from "node:util";
import logger from "../config/logger.js";
import emailQueue from "../queues/email-queue.js";
import type { AWSCommand } from "../interfaces/aws-command.js";
import type { EC2Service } from "../services/ec2-service.js";

export class ListEC2InstancesCommand implements AWSCommand {
	constructor(private ec2Service: EC2Service) {}

	async execute(): Promise<void> {
		try {
			const result = await this.ec2Service.listInstances();
			console.log(styleText("green", `EC2 Instances:\n${result}`));
		} catch (error) {
			const message = "Failed to list EC2 instances. Please check your AWS configuration and permissions.";
			logger.error(message, error);
			await emailQueue.add("listEc2Failed", {
				message,
				command: "ListEC2InstancesCommand",
				error,
			});
		}
	}
}
