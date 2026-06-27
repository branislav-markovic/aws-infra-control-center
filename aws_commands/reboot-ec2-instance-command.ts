import logger from "../config/logger.js";
import type { AWSCommand } from "../interfaces/aws-command.js";
import emailQueue from "../queues/email-queue.js";
import type { EC2Service } from "../services/ec2-service.js";

export class RebootEC2InstanceCommand implements AWSCommand {
	constructor(
		private ec2Service: EC2Service,
		private instanceId: string,
	) {}

	async execute(): Promise<void> {
		try {
			await this.ec2Service.rebootInstance(this.instanceId);
			console.log(`EC2 instance "${this.instanceId}" rebooted successfully.`);
		} catch (error) {
			const message = `Failed to reboot EC2 instance "${this.instanceId}". Please check the instance ID and your AWS permissions.`;
			logger.error(message, error);
			await emailQueue.add("rebootFailed", {
				message,
				command: "RebootEC2InstanceCommand",
				resourceId: this.instanceId,
				error,
			});
		}
	}
}
