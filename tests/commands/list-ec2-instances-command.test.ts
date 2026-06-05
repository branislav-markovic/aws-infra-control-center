import { test } from 'node:test';
import assert from 'node:assert';
import { ListEC2InstancesCommand } from '../../aws_commands/list-ec2-instances-command.js';
import { EC2Service } from '../../services/ec2-service.js';

test('execute calls listInstances', async () => {
    let wasCalled = false;
    const fakeEC2Service = {
        listInstances: async () => {
            wasCalled = true;
            return 'instance list';
        }
    } as EC2Service;

    const command = new ListEC2InstancesCommand(fakeEC2Service);
    await command.execute();

    assert.strictEqual(wasCalled, true);
});
