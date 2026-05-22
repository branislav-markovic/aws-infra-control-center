import { EC2Client, RunInstancesCommand, DescribeInstancesCommand, _InstanceType, Reservation, Instance } from '@aws-sdk/client-ec2';
import { awsConfig } from '../config/aws.config.js';
export class EC2Service {
    private client = new EC2Client({ region: awsConfig.region });

    async launchInstance(): Promise<string> {
        const params = {
            ImageId: awsConfig.amiId,
            InstanceType: _InstanceType.t2_micro,
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
}