import type { AWSCommand } from "../interfaces/aws-command.js";
import type { EC2Service } from "../services/ec2-service.js";

export class RebootEC2InstanceCommand implements AWSCommand {
	constructor(
		private ec2Service: EC2Service,
		private instanceId: string,
	) {}

	async execute(): Promise<void> {
		try {
			await this.ec2Service.rebootInstance(this.instanceId);
			console.log(`Instance "${this.instanceId}" rebooted successfully.`);
		} catch (error) {
			console.error(`Failed to reboot instance "${this.instanceId}".`, error);
		}
	}
}
