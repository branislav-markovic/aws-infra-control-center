import { test } from "node:test";
import assert from "node:assert";
import { RebootEC2InstanceCommand } from "../../aws_commands/reboot-ec2-instance-command.js";
import { EC2Service } from "../../services/ec2-service.js";

test("execute calls rebootInstance with correct instance id", async () => {
	let receivedInstanceId = "";
	const fakeEC2Service = {
		rebootInstance: async (instanceId: string) => {
			receivedInstanceId = instanceId;
			return "success";
		},
	} as EC2Service;

	const command = new RebootEC2InstanceCommand(fakeEC2Service, "i-456");
	await command.execute();

	assert.strictEqual(receivedInstanceId, "i-456");
});
