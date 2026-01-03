import * as mongoose from "mongoose";

const mongo = await mongoose.connect(process.env.MONGO_URL as string);

export const database = mongo.connection;
