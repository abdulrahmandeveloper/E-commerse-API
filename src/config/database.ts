import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce_api";

    const conn = await mongoose.connect(mongoURI);

    console.log(
      ` database connected successfully, the host is : ${conn.connection.host}, the database is : ${conn.connection.name}`
    );
  } catch (e) {
    console.error("❌ MongoDB connection error:", e);
    //process.exit(1);
  }
};
