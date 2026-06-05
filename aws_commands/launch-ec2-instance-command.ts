import { styleText } from "node:util";
import { AWSCommand } from "../interfaces/aws-command.js";
import { EC2Service } from "../services/ec2-service.js";

export class LaunchEC2Instance implements AWSCommand {
    constructor(private ec2Service: EC2Service) {}

    async execute(): Promise<void> {
        try {
            const result = await this.ec2Service.launchInstance();
            console.log(styleText('green', `EC2 Instance launched with ID: ${result}`));
        } catch (error) {
            console.error('Failed to launch EC2 instance.', error);
        }
    }
}