import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";

// environment variables
dotenv.config();

const app: Application = express();


app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", // Vite default port
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));


// database connection
const mongoURI = process.env.MONGO_URI as string;
connectDB(mongoURI);




import courseRoutes from "./routes/courseRoutes";

import platformRoutes from "./routes/platformRoutes";
app.use("/api/courses", courseRoutes);




app.use("/api", platformRoutes);



//server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}!`));