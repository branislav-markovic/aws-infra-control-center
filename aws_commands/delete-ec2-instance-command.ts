import type { Queue } from "bullmq";
import logger from "../config/logger.js";
import type { AWSCommand } from "../interfaces/aws-command.js";
import type { EC2Service } from "../services/ec2-service.js";

export class DeleteEC2InstanceCommand implements AWSCommand {
	constructor(
		private ec2Service: EC2Service,
		private emailQueue: Queue,
		private instanceId: string,
	) {}

	async execute(): Promise<void> {
		try {
			await this.ec2Service.terminateInstance(this.instanceId);
			console.log(`EC2 instance "${this.instanceId}" terminated successfully.`);
		} catch (error) {
			const message = `Failed to terminate EC2 instance "${this.instanceId}". Please check the instance ID and your AWS permissions.`;
			logger.error(message, error);
			await this.emailQueue.add("terminateEc2Failed", {
				message,
				command: "DeleteEC2InstanceCommand",
				resourceId: this.instanceId,
				error: {
					name: (error as Error).name ?? "",
					message: (error as Error).message ?? "",
					stack: (error as Error).stack ?? "",
				},
			});
		}
	}
}
