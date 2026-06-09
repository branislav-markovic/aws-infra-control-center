import type { AWSCommand } from "../interfaces/aws-command.js";
import type { EC2Service } from "../services/ec2-service.js";

export class DeleteEC2InstanceCommand implements AWSCommand {
	constructor(
		private ec2Service: EC2Service,
		private instanceId: string,
	) {}

	async execute(): Promise<void> {
		try {
			await this.ec2Service.terminateInstance(this.instanceId);
			console.log(`EC2 instance "${this.instanceId}" terminated successfully.`);
		} catch {
			console.error(
				`Failed to terminate EC2 instance "${this.instanceId}". Please check the instance ID and your AWS permissions.`,
			);
		}
	}
}
