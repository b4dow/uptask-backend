import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { corsOptions } from "./config/cors";
import { connectDB } from "./config/db";
import projectRoutes from "./routes/projectRoutes";
import authRoutes from "./routes/authRoutes";

dotenv.config();
connectDB();

const app: express.Application = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors(corsOptions));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

export default app;
