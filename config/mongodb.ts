import mongoose from "mongoose";
import { MongoDBFactory } from "../factories/mongodb.factory.js";

export const connectDB = async (): Promise<void> => {
	await MongoDBFactory.create();
};

export const closeDB = async (): Promise<void> => {
	await mongoose.disconnect();
};
