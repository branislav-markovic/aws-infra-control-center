import { EC2Client, RunInstancesCommand, DescribeInstancesCommand, _InstanceType, Reservation, Instance } from '@aws-sdk/client-ec2';
import { awsConfig } from '../config/aws.config.js';
export class EC2Service {
    private client = new EC2Client({ region: awsConfig.region });

    async launchInstance(): Promise<string | void> {
        const params = {
            ImageId: awsConfig.amiId,
            InstanceType: _InstanceType.t2_micro,
            MinCount: 1,
            MaxCount: 1,
        };
        try {
            const data = await this.client.send(new RunInstancesCommand(params));
            return data.Instances?.[0].InstanceId;
        } catch(error) {
            console.log(error);
        }
    }

    async listInstances(): Promise<string | void> {
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
        }
    }
}