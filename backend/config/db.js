import mongoose from "mongoose";import dotenv from "dotenv";

export const connectDB = async () => {
    const url = process.env.MONGO_URI;

    if(!url){
        throw new Error("MONGO_URI is not defined in the environment variables");
    }

    mongoose.set('strictQuery', true);

    const conn = await mongoose.connect(url , {
        serverSelectionTimeoutMS: 10000, // Set a timeout for server selection
    });

    console.log(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
} 