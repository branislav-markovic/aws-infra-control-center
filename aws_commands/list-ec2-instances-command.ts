import { styleText } from "node:util";
import type { Queue } from "bullmq";
import logger from "../config/logger.js";
import type { AWSCommand } from "../interfaces/aws-command.js";
import { AuditLogModel } from "../models/ActionLog.js";
import type { EC2Service } from "../services/ec2-service.js";

export class ListEC2InstancesCommand implements AWSCommand {
	constructor(
		private ec2Service: EC2Service,
		private emailQueue: Queue,
	) {}

	async execute(): Promise<void> {
		try {
			const result = await this.ec2Service.listInstances();
			const message = `EC2 Instances:\n${result}`;
			await AuditLogModel.create({
				commandName: "ListEC2InstancesCommand",
				action: "List EC2 instances",
				resourceId: null,
				message,
			});
			console.log(styleText("green", message));
		} catch (error) {
			const message =
				"Failed to list EC2 instances. Please check your AWS configuration and permissions.";
			logger.error(message, error);
			await this.emailQueue.add("listEc2Failed", {
				message,
				command: "ListEC2InstancesCommand",
				error: {
					name: (error as Error).name ?? "",
					message: (error as Error).message ?? "",
					stack: (error as Error).stack ?? "",
				},
			});
		}
	}
}
