import type { MenuItem } from "./interfaces/menu-item.js";
import { styleText } from 'node:util';
import { EC2Service } from "./services/ec2-service.js";
import { S3Service } from "./services/s3-service.js";
import { PromptService } from "./services/prompt-service.js";

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
                let result = await ec2Service.launchInstance();
                console.log(styleText('green', `EC2 Instance launched with ID: ${result}`));
            },
        },
        {
            id: 2,
            label: 'List all EC2 Instances',
            icon: '📋',
            action: async () => {
                let result = await ec2Service.listInstances();
                console.log(styleText('green', `EC2 Instances:\n${result}`));
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
                let result = await s3Service.createNewBucket(bucketName);
                console.log(styleText('green', 'New S3 Bucket created successfully: ' + result));
            },
        },
    ];

    return menu;
}