import { CreateS3BucketCommand } from "./aws_commands/create-s3-bucket-command.js";
import { DeleteEC2InstanceCommand } from "./aws_commands/delete-ec2-instance-command.js";
import { DeleteS3BucketCommand } from "./aws_commands/delete-s3-bucket-command.js";
import { LaunchEC2Instance } from "./aws_commands/launch-ec2-instance-command.js";
import { ListEC2InstancesCommand } from "./aws_commands/list-ec2-instances-command.js";
import { RebootEC2InstanceCommand } from "./aws_commands/reboot-ec2-instance-command.js";
import { InstanceIdSchema, S3BucketNameSchema } from "./config/aws.schemas.js";
import type { MenuItem } from "./interfaces/menu-item.js";
import emailQueue from "./queues/email-queue.js";
import type { EC2Service } from "./services/ec2-service.js";
import type { PromptService } from "./services/prompt-service.js";
import type { S3Service } from "./services/s3-service.js";

export function createAwsMenu(
	ec2Service: EC2Service,
	s3Service: S3Service,
	promptService: PromptService,
): MenuItem[] {
	const menu: MenuItem[] = [
		{
			id: 0,
			label: "Exit",
			icon: "❌",
			action: async () => {},
		},
		{
			id: 1,
			label: "Launch new EC2 Instance",
			icon: "🚀",
			action: async () => {
				const launchEC2InstanceCommand = new LaunchEC2Instance(
					ec2Service,
					emailQueue,
				);
				await launchEC2InstanceCommand.execute();
			},
		},
		{
			id: 2,
			label: "List all EC2 Instances",
			icon: "📋",
			action: async () => {
				const listEC2InstancesCommand = new ListEC2InstancesCommand(
					ec2Service,
					emailQueue,
				);
				await listEC2InstancesCommand.execute();
			},
		},
		{
			id: 3,
			label: "Create new S3 Bucket",
			icon: "📦",
			action: async () => {
				const bucketName = await promptService.ask(
					"Enter the name of the new S3 bucket: ",
					S3BucketNameSchema,
				);
				const createS3BucketCommand = new CreateS3BucketCommand(
					s3Service,
					emailQueue,
					bucketName,
				);
				await createS3BucketCommand.execute();
			},
		},
		{
			id: 4,
			label: "Delete S3 Bucket",
			icon: "🗑️ ",
			action: async () => {
				const bucketName = await promptService.ask(
					"Enter the name of the S3 bucket to delete: ",
					S3BucketNameSchema,
				);
				const deleteS3BucketCommand = new DeleteS3BucketCommand(
					s3Service,
					emailQueue,
					bucketName,
				);
				await deleteS3BucketCommand.execute();
			},
		},
		{
			id: 5,
			label: "Delete EC2 Instance",
			icon: "🗑️ ",
			action: async () => {
				const instanceId = await promptService.ask(
					"Enter the ID of the EC2 instance to delete: ",
					InstanceIdSchema,
				);
				const deleteEC2InstanceCommand = new DeleteEC2InstanceCommand(
					ec2Service,
					emailQueue,
					instanceId,
				);
				await deleteEC2InstanceCommand.execute();
			},
		},
		{
			id: 6,
			label: "Reboot EC2 Instance",
			icon: "🔄",
			action: async () => {
				const instanceId = await promptService.ask(
					"Enter the ID of the EC2 instance to reboot: ",
					InstanceIdSchema,
				);
				const rebootEC2InstanceCommand = new RebootEC2InstanceCommand(
					ec2Service,
					emailQueue,
					instanceId,
				);
				await rebootEC2InstanceCommand.execute();
			},
		},
	];

	return menu;
}
