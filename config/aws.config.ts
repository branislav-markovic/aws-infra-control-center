export const awsConfig = {
	region: process.env.AWS_REGION ?? "us-east-1",
	amiId: process.env.AWS_AMI_ID ?? "ami-00e801948462f718a",
	instanceType: process.env.AWS_INSTANCE_TYPE ?? "t3.micro",
};
