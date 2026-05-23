import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { styleText } from 'node:util';
import type { MenuItem } from './interfaces/menu-item.ts';
import { EC2Service } from './services/ec2-service.js';
import { EC2ServiceFactory } from './factories/ec2-service.factory.js';
import { S3Service } from './services/s3-service.js';
import { S3ServiceFactory } from './factories/s3-service.factory.js';

async function main(ec2Service: EC2Service, s3Service: S3Service) {
    const rl = readline.createInterface({input, output});
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
                const bucketName = (await rl.question('Enter the name of the new S3 bucket: ')).trim();
                if (!bucketName) {
                    console.log(styleText('red', 'Bucket name cannot be empty. Action cancelled.'));
                    return;
                }
                let result = await s3Service.createNewBucket(bucketName);
                console.log(styleText('green', 'New S3 Bucket created successfully: ' + result));
            },
        },
    ];

    const menuMap = new Map<number, MenuItem>(
        menu.map(item => [item.id, item])
    );

    let running = true;
    while (running) {
        console.clear();
        console.log(styleText('yellow', 'AWS CLI Menu:'));

        menu.forEach(menuItem => {
            let item = `${menuItem.id}. ${menuItem.icon} ${menuItem.label}`;
            console.log(styleText('cyan', item));
        });

        const choice = await rl.question('Please select an option: ');
        if (Number(choice) === 0) {
            console.log(styleText('yellow', 'Exiting...'));
            running = false;
            continue;
        }

        const selectedAction = menuMap.get(Number(choice));
        if (selectedAction) {
            await selectedAction.action();
        } else {
            console.log(styleText('red', 'Invalid option selected.'));
        }
        await rl.question('Press Enter to continue...');
    }
    rl.close();
}

main(EC2ServiceFactory.create(), S3ServiceFactory.create());
