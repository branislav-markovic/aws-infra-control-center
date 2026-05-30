import {
    EC2Client,
    RunInstancesCommand,
    DescribeInstancesCommand,
    TerminateInstancesCommand,
    _InstanceType,
    Reservation,
    Instance
} from '@aws-sdk/client-ec2';
import { awsConfig } from '../config/aws.config.js';

export class EC2Service {
    constructor(private client: EC2Client) {}

    async launchInstance(): Promise<string> {
        const params = {
            ImageId: awsConfig.amiId,
            InstanceType: _InstanceType.t3_micro,
            MinCount: 1,
            MaxCount: 1,
        };
        try {
            const data = await this.client.send(new RunInstancesCommand(params));
            const instanceId = data.Instances?.[0].InstanceId;
            if (!instanceId) {
                throw new Error('Failed to obtain InstanceId from RunInstances response.');
            }
            return instanceId;
        } catch(error) {
            console.log(error);
            throw new Error('Failed to launch EC2 instance.');
        }
    }

    async listInstances(): Promise<string> {
        try {
            const data = await this.client.send(new DescribeInstancesCommand({}));
            if (!data.Reservations || data.Reservations.length === 0) {
                return 'No instances found.';
            }
            return data.Reservations
                .flatMap((reservation: Reservation) => reservation.Instances || [])
                .map((instance: Instance) => instance.InstanceId || 'Unknown ID')
                .join('\n');
        } catch(error) {
            console.error(error);
            throw new Error('Failed to list EC2 instances.');
        }
    }

    async terminateInstance(instanceId: string): Promise<string> {
        try {
            await this.client.send(new TerminateInstancesCommand({
                InstanceIds: [instanceId],
            }));
            return `Instance "${instanceId}" terminated successfully.`;
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to terminate instance "${instanceId}".`);
        }
    }
}