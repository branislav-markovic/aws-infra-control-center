import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { styleText } from 'node:util';
import type { MenuItem } from './interfaces/menu-item.ts';
import { EC2Service } from './services/ec2-service.js';

const ec2Service = new EC2Service();

async function main(ec2Service: EC2Service) {
    const rl = readline.createInterface({input, output});
    console.clear();
    const menu: MenuItem[] = [
        {
            id: 1,
            label: 'Launch new EC2 Instance',
            icon: '🚀',
            action: () => ec2Service.launchInstance(),
        },
        {
            id: 2,
            label: 'List all EC2 Instances',
            icon: '📊',
            action: () => ec2Service.listInstances(),
        },
    ];

    const menuMap = new Map<number, MenuItem>(
        menu.map(item => [item.id, item])
    );

    console.log(styleText('yellow', 'AWS CLI Menu:'));

    menu.forEach(menuItem => {
        let item = `${menuItem.id}. ${menuItem.icon} ${menuItem.label}`;
        console.log(styleText('cyan', item));
    });

    const choice = await rl.question('Please select an option: ');
    const selectedAction = menuMap.get(Number(choice));

    if (selectedAction) {
        await selectedAction.action();
    } else {
        console.log(styleText('red', 'Invalid option selected. Exiting...'));
    }
    rl.close();
}

main(ec2Service);