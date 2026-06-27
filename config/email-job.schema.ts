import { z } from "zod";

export const EmailJobSchema = z.object({
	message: z.string(),
	command: z.string(),
	resourceId: z.string().optional(),
	error: z.unknown().optional(),
});

export type EmailJob = z.infer<typeof EmailJobSchema>;
