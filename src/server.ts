import app from "./app";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";

dotenv.config();

const port = process.env.PORT || 4000;

async function startServer() {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`server is running on port : ${port}`);
    });
  } catch (e) {
    console.error(`error running the server!   ${e}`);
    process.exit(1);
  }
}

startServer();
