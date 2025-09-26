import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("API работает 🚀");
});

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`Сервер на порту ${port}`));
  } catch (err) {
    console.error("Ошибка подключения к Mongo:", err);
  }
};

start();

import usersRoutes from './routes/users'
import authRoutes from './routes/auth'
import parseRoutes from './routes/parse'
import films from "./routes/films";

app.use("/films", films);
app.use("/users", usersRoutes);
app.use("/auth", authRoutes);
app.use("/api", parseRoutes);
