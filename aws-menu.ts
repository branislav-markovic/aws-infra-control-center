import type { MenuItem } from "./interfaces/menu-item.js";
import { styleText } from 'node:util';
import { EC2Service } from "./services/ec2-service.js";
import { S3Service } from "./services/s3-service.js";
import { PromptService } from "./services/prompt-service.js";
import { ListEC2InstancesCommand } from "./aws_commands/list-ec2-instances-command.js";
import { LaunchEC2Instance } from "./aws_commands/launch-ec2-instance-command.js";
import { CreateS3BucketCommand } from "./aws_commands/create-s3-bucket-command.js";

export function createAwsMenu(
    ec2Service: EC2Service,
    s3Service:S3Service,
    promptService: PromptService
): MenuItem[] {
        const menu: MenuItem[] = [
        {
            id: 0,
            label: 'Exit',
            icon: '❌',
            action: async () => {},
        },
        {
            id: 1,
            label: 'Launch new EC2 Instance',
            icon: '🚀',
            action: async () => {
                const launchEC2InstanceCommand = new LaunchEC2Instance(ec2Service);
                await launchEC2InstanceCommand.execute();
            },
        },
        {
            id: 2,
            label: 'List all EC2 Instances',
            icon: '📋',
            action: async () => {
                const listEC2InstancesCommand = new ListEC2InstancesCommand(ec2Service);
                await listEC2InstancesCommand.execute();
            },
        },
        {
            id: 3,
            label: 'Create new S3 Bucket',
            icon: '📦',
            action: async () => {
                const bucketName = (await promptService.ask('Enter the name of the new S3 bucket: ')).trim();
                if (!bucketName) {
                    console.log(styleText('red', 'Bucket name cannot be empty. Action cancelled.'));
                    return;
                }
                const createS3BucketCommand = new CreateS3BucketCommand(s3Service, bucketName);
                await createS3BucketCommand.execute();
            },
        },
    ];

    return menu;
}