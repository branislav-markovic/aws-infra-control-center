import { z } from "zod";

export const EmailJobSchema = z.object({
	message: z.string(),
	instanceId: z.string(),
	error: z.unknown().optional(),
});

export type EmailJob = z.infer<typeof EmailJobSchema>;
