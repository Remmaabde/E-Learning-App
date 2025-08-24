import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import courseRoutes from "./routes/courseRoutes";
import progressRoutes from "./routes/progressRoutes";
import quizRoutes from "./routes/quizRoutes"
<<<<<<< HEAD
=======
import studentRoutes from "./routes/studentRoutes";
import instructorRoutes from "./routes/instructorRoutes";
>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223

import platformRoutes from "./routes/platformRoutes";
import authRoutes from "./routes/authRoutes";
import searchRoutes from "./routes/searchRoutes";
import notificationRoutes from "./routes/notificationRoutes";


// environment variables
dotenv.config();

const app: Application = express();
const mongoURI = process.env.MONGO_URI as string;
connectDB(mongoURI);



app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}))










app.use("/api", platformRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/notifications", notificationRoutes);

<<<<<<< HEAD


app.use("/api/courses", courseRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/quizzes", quizRoutes);
=======
app.use("/api/courses", courseRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/instructor", instructorRoutes);
>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223

//server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}!`);
  console.log("=== SERVER RESTARTED SUCCESSFULLY ===");
  console.log("Time:", new Date().toISOString());
});