import { Queue } from "bullmq";
import { EMAIL_QUEUE_NAME } from "./config.js";

const emailQueue = new Queue(EMAIL_QUEUE_NAME);

export default emailQueue;
