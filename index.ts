import { stdin as input, stdout as output } from "node:process";
import readline from "node:readline/promises";
import { styleText } from "node:util";
import { createAwsMenu } from "./aws-menu.js";
import { closeDB, connectDB } from "./config/mongodb.js";
import { EC2ServiceFactory } from "./factories/ec2-service.factory.js";
import { S3ServiceFactory } from "./factories/s3-service.factory.js";
import type { MenuItem } from "./interfaces/menu-item.ts";
import emailQueue from "./queues/email-queue.js";
import type { EC2Service } from "./services/ec2-service.js";
import { PromptService } from "./services/prompt-service.js";
import type { S3Service } from "./services/s3-service.js";

async function main(ec2Service: EC2Service, s3Service: S3Service) {
	await connectDB();
	const rl = readline.createInterface({ input, output });
	const promptService = new PromptService(rl);
	const menu = createAwsMenu(ec2Service, s3Service, promptService);

	const menuMap = new Map<number, MenuItem>(
		menu.map((item) => [item.id, item]),
	);

	try {
		let running = true;
		while (running) {
			console.clear();
			console.log(styleText("yellow", "AWS CLI Menu:"));

			menu.forEach((menuItem) => {
				const item = `${menuItem.id}. ${menuItem.icon} ${menuItem.label}`;
				console.log(styleText("cyan", item));
			});

			const choice = await rl.question("Please select an option: ");
			if (Number(choice) === 0) {
				console.log(styleText("yellow", "Exiting..."));
				running = false;
				continue;
			}

			const selectedAction = menuMap.get(Number(choice));
			if (selectedAction) {
				await selectedAction.action();
			} else {
				console.log(styleText("red", "Invalid option selected."));
			}
			await rl.question("Press Enter to continue...");
		}
	} finally {
		rl.close();
		await emailQueue.close();
		await closeDB();
	}
}

main(EC2ServiceFactory.create(), S3ServiceFactory.create());
