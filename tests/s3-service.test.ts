import { test, beforeEach  } from 'node:test';
import assert from 'node:assert';
import { S3Service } from '../services/s3-service.js';
import { CreateBucketCommand, DeleteBucketCommand, S3Client } from '@aws-sdk/client-s3';

let s3Service: S3Service;
let fakeS3Client: S3Client;
let receivedCommand: CreateBucketCommand | DeleteBucketCommand;

beforeEach(() => {
    fakeS3Client = {
        send: async () => {}
    } as unknown as S3Client;
    s3Service = new S3Service(fakeS3Client);
});

test('createNewBucket returns success message when bucket is created', async () => {
    fakeS3Client.send = async () => ({
        Location: '/my-bucket'
    });

    const result = await s3Service.createNewBucket('my-bucket');
    assert.strictEqual(
        result, 'Bucket "my-bucket" created successfully. Location: /my-bucket'
    );
});

test('createNewBucket throws friendly error when AWS fails', async () => {
    fakeS3Client.send = async () => {
        throw new Error('AWS Failure');
    };

    await assert.rejects(
        async () => {
            await s3Service.createNewBucket('my-bucket');
        },
        {
           message: 'Failed to create bucket "my-bucket".'  
        }
    );
});

test('deleteBucket returns success message when bucket is deleted', async () => {
    fakeS3Client.send = async (command: any) => {
        receivedCommand = command;
    };

    const result = await s3Service.deleteBucket('my-bucket');
    assert.ok(receivedCommand instanceof DeleteBucketCommand);
    assert.strictEqual(
        result, 'Bucket "my-bucket" deleted successfully.'
    );
    assert.deepStrictEqual(
        receivedCommand.input,
        {
            Bucket: 'my-bucket'
        }
    )
});

test('deleteBucket throws friendly error when AWS fails', async () => {
    fakeS3Client.send = async () => {
        throw new Error('AWS Failure');
    };

    await assert.rejects(
        async () => {
            await s3Service.deleteBucket('my-bucket');
        },
        {
            message: 'Failed to delete bucket "my-bucket".'
        }
    );
});

test('createNewBucket sends correct bucket name to AWS', async () => {
    fakeS3Client.send = async (command: any) => {
        receivedCommand = command;
        return {
            Location: 'my-bucket'
        }
    };

    await s3Service.createNewBucket('my-bucket');

    assert.ok(receivedCommand instanceof CreateBucketCommand);
    assert.deepStrictEqual(
        receivedCommand.input,
        {
            Bucket: 'my-bucket'
        }
    );
});