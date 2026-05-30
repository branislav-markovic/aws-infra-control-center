import { AWSCommand } from "../interfaces/aws-command.js";
import { EC2Service } from "../services/ec2-service.js";

export class DeleteEC2InstanceCommand implements AWSCommand {
    constructor(
        private ec2Service: EC2Service,
        private instanceId: string
    ) {}

    async execute(): Promise<void> {
        try {
            const result = await this.ec2Service.terminateInstance(this.instanceId);
            console.log(`EC2 Instance "${this.instanceId}" terminated successfully. Result: ${result}`);
        } catch (error) {
            console.error(`Failed to terminate EC2 Instance "${this.instanceId}".`, error);
        }
    }
}