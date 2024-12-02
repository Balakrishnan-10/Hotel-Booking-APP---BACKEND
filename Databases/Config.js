import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Connecting MONGODB Atlas URL :
const mongoDB_URL = process.env.MONGODB_URL;
const connectDB = async (res, req) => {
  try {
    const connection = await mongoose.connect(mongoDB_URL);
    console.log("MongoDB Connected Succesfully");
    return connection;
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "MongoDB Connected Error" });
  }
};
export default connectDB;
