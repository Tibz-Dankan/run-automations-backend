import { server } from "./app";
import { AppError } from "./utils/error";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const startApp = async () => {
  const port = process.env.PORT || 5000;
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) return new AppError("MONGO URL not defined", 400);

  try {
    await mongoose.connect(MONGO_URI);

    console.log("connected to mongo successfully!");
  } catch (err: any) {
    console.log(`An error occurred: ${JSON.stringify(err)}`);
  }

  server.listen(port, () =>
    console.log(`server started and running on port ${port}...`)
  );
};

startApp();
