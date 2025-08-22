import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import courseRoutes from "./routes/courseRoutes";
import progressRoutes from "./routes/progressRoutes";
import quizRoutes from "./routes/quizRoutes";

// environment variables
dotenv.config();

const app: Application = express();


app.use(express.json());
app.use(cors());

// database connection
const mongoURI = process.env.MONGO_URI as string;
connectDB(mongoURI);

// Routes
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "API is running...🚀🚀" });
});

app.use("/api/courses", courseRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/quizzes", quizRoutes);

//server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}!`));