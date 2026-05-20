import { EC2Client, RunInstancesCommand, DescribeInstancesCommand, _InstanceType } from '@aws-sdk/client-ec2';

export class EC2Service {
    private client = new EC2Client({ region: 'us-east-1' });

    async launchInstance(): Promise<void> {
        const params = {
            ImageId: 'ami-0c7217cdde317cfec', // Amazon Linux 2 AMI
            InstanceType: _InstanceType.t2_micro,
            MinCount: 1,
            MaxCount: 1,
        };
        try {
            console.log('Launching new EC2 Instance...');
            const data = await this.client.send(new RunInstancesCommand(params));
            console.log('EC2 Instance launched successfully:', data.Instances?.[0].InstanceId);
        } catch(error) {
            console.log(error);
        }
    }

    async listInstances(): Promise<void> {
        try {
            console.log('Listing all EC2 Instances...');
            const data = await this.client.send(new DescribeInstancesCommand({}));
            console.log('EC2 Instances:', data.Reservations);
        } catch(error) {
            console.error(error);
        }
    }
}