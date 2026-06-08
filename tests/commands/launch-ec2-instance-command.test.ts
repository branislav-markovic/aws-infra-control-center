import { test } from "node:test";
import assert from "node:assert";
import { LaunchEC2Instance } from "../../aws_commands/launch-ec2-instance-command.js";
import { EC2Service } from "../../services/ec2-service.js";

test("execute calls launchInstance", async () => {
	let wasCalled = false;
	const fakeEC2Service = {
		launchInstance: async () => {
			wasCalled = true;
			return "i-123";
		},
	} as EC2Service;

	const command = new LaunchEC2Instance(fakeEC2Service);
	await command.execute();

	assert.strictEqual(wasCalled, true);
});
