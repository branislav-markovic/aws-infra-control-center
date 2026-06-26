import { Worker } from "bullmq";
import nodemailer from "nodemailer";
import { EmailJobSchema } from "../config/email-job.schema.js";
import logger from "../config/logger.js";
import redis from "../config/redis.js";
import { renderCommandFailureEmail } from "../emails/command-failure-template.js";
import { EMAIL_QUEUE_LIMITER, EMAIL_QUEUE_NAME } from "../queues/config.js";

const transporter = nodemailer.createTransport({
	host: process.env.EMAIL_HOST,
	port: Number(process.env.EMAIL_PORT),
	secure: false,
	tls: {
		rejectUnauthorized: false,
	},
});
const serializeError = (error: unknown): string => {
	if (error instanceof Error) {
		return JSON.stringify(
			{
				name: error.name,
				message: error.message,
				stack: error.stack,
			},
			null,
			2,
		);
	}
	return JSON.stringify(error, null, 2);
};

const mailOptions = {
	from: '"AWS Infra Control Center" <sender@example.com>',
	to: process.env.ADMIN_EMAIL,
	subject: "AWS Action Notification",
	text: "",
	html: "",
};

const worker = new Worker(
	EMAIL_QUEUE_NAME,
	async (job) => {
		try {
			const jobData = EmailJobSchema.parse(job.data);
			mailOptions.text = jobData.message;
			mailOptions.html = renderCommandFailureEmail({
				message: jobData.message,
				instanceId: jobData.instanceId,
				errors: serializeError(jobData.error),
			});
			await transporter.sendMail(mailOptions);
		} catch (error) {
			logger.error("Failed to send email", error);
			console.error("Error sending email:", error);
		}
	},
	{
		connection: redis,
		limiter: EMAIL_QUEUE_LIMITER,
	},
);

worker.on("completed", (job) => {
	const msg = `Job with ID ${job.id} has completed!`;
	console.log(msg);
	logger.info(msg);
});

worker.on("failed", (job, err) => {
	const msg = `Job with ID ${job?.id} has failed with ${err.message}`;
	console.error(msg);
	logger.error(msg, err);
});

process.on("SIGTERM", async () => {
	await worker.close();
	logger.error("Email worker is shutting down gracefully.");
	process.exit(0);
});
