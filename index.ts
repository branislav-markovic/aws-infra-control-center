import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { styleText } from 'node:util';

async function main() {
    const rl = readline.createInterface({input, output});
    console.clear();
    const menu = [
        {
            id: 1,
            label: 'Launch new EC2 Instance',
            icon: '🚀',
        },
        {
            id: 2,
            label: 'List all EC2 Instances',
            icon: '📊',
        },
    ];

    console.log(styleText('yellow', 'AWS CLI Menu:'));

    menu.forEach(menuItem => {
        let item = `${menuItem.id}. ${menuItem.icon} ${menuItem.label}`;
        console.log(styleText('cyan', item));
    });

    const choice = await rl.question('Please select an option: ');

    console.log(`You selected option: ${choice}`);

    rl.close();
}

main();