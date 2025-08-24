import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import courseRoutes from "./routes/courseRoutes";
import progressRoutes from "./routes/progressRoutes";
import quizRoutes from "./routes/quizRoutes"
import studentRoutes from "./routes/studentRoutes";

import platformRoutes from "./routes/platformRoutes";
import authRoutes from "./routes/authRoutes";
import searchRoutes from "./routes/searchRoutes";
import notificationRoutes from "./routes/notificationRoutes";
//import instructorRoutes from "./routes/instructorRoutes";


// environment variables
dotenv.config();

const app: Application = express();
const mongoURI = process.env.MONGO_URI as string;
connectDB(mongoURI);



app.use(express.json());
app.use("/api/instructor", instructorRoutes);

app.use(cors({
  origin: "http://localhost:5173", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}))










app.use("/api", platformRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/notifications", notificationRoutes);



app.use("/api/courses", courseRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/quizzes", quizRoutes);

//server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}!`));