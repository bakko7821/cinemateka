import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("API работает 🚀");
});

const start = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/mern-ts");
    app.listen(5000, () => console.log("Сервер запущен на http://localhost:5000"));
  } catch (err) {
    console.error("Ошибка подключения к Mongo:", err);
  }
};

start();
