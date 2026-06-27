import mongoose from "mongoose";
import logger from "../config/logger.js";

export class MongoDBFactory {
	static async create(): Promise<void> {
		try {
			const MONGO_URI = process.env.MONGO_URI || "";
			await mongoose.connect(MONGO_URI);
		} catch (error) {
			logger.error("MongoDB connection error:", error);
			process.exit(1);
		}
	}
}
