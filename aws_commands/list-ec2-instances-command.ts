import { styleText } from "node:util";
import { AWSCommand } from "../interfaces/aws-command.js";
import { EC2Service } from "../services/ec2-service.js";

export class ListEC2InstancesCommand implements AWSCommand {
    constructor(private ec2Service: EC2Service) {}

    async execute(): Promise<void> {
        let result = await this.ec2Service.listInstances();
        console.log(styleText('green', `EC2 Instances:\n${result}`));
    }
}