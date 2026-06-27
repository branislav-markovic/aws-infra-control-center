import { styleText } from "node:util";
import type { Queue } from "bullmq";
import logger from "../config/logger.js";
import type { AWSCommand } from "../interfaces/aws-command.js";
import { AuditLogModel } from "../models/ActionLog.js";
import type { EC2Service } from "../services/ec2-service.js";

export class LaunchEC2Instance implements AWSCommand {
	constructor(
		private ec2Service: EC2Service,
		private emailQueue: Queue,
	) {}

	async execute(): Promise<void> {
		try {
			const instanceId = await this.ec2Service.launchInstance();
			const message = `EC2 instance launched successfully. Instance ID: ${instanceId}`;
			await AuditLogModel.create({
				commandName: "LaunchEC2InstanceCommand",
				action: "Launch EC2 instance",
				resourceId: instanceId,
				message,
			});
			console.log(styleText("green", message));
		} catch (error) {
			const message =
				"Failed to launch EC2 instance. Please check your AWS configuration and permissions.";
			logger.error(message, error);
			await this.emailQueue.add("launchEc2Failed", {
				message,
				command: "LaunchEC2Instance",
				error: {
					name: (error as Error).name ?? "",
					message: (error as Error).message ?? "",
					stack: (error as Error).stack ?? "",
				},
			});
		}
	}
}
