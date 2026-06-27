import { Queue } from "bullmq";
import { EMAIL_QUEUE_NAME } from "../queues/config.js";

export class EmailQueueFactory {
	static create(): Queue {
		return new Queue(EMAIL_QUEUE_NAME);
	}
}
