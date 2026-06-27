import { type InferSchemaType, model, Schema } from "mongoose";

const auditLogSchema = new Schema({
	commandName: {
		type: String,
		required: true,
	},
	action: {
		type: String,
		required: true,
	},
	resourceId: {
		type: String,
		required: false,
	},
	message: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: () => Date.now(),
	},
});

export type AuditLog = InferSchemaType<typeof auditLogSchema>;

export const AuditLogModel = model("AuditLog", auditLogSchema);
