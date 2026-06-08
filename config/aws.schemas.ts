import { z } from "zod";

export const S3BucketNameSchema = z
	.string()
	.min(3, "Bucket name must be at least 3 characters")
	.max(63, "Bucket name must be at most 63 characters")
	.regex(
		/^[a-z0-9][a-z0-9.-]*[a-z0-9]$/,
		"Bucket name must be DNS-compliant (lowercase, no consecutive dots, etc.)",
	);

export const InstanceIdSchema = z
	.string()
	.regex(
		/^i-[a-f0-9]{8,17}$/,
		"Invalid EC2 instance ID format (expected: i-xxxxxxxxxxxxx)",
	);
