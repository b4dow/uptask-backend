import mongoose from "mongoose";
import colors from "colors";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.DATABASE_URL);
    const url = `${connection.host}:${connection.port}`;
    console.log(colors.cyan.bold(`MongoDB Connected: ${url}`));
  } catch (error) {
    console.log(colors.red.bold(`Error al conectar a MongoDB`));
    process.exit(1);
  }
};
