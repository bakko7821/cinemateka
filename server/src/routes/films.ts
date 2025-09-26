import express, { Request, Response } from "express";
import Film, { IFilm } from "../modules/Film";

const router = express.Router();

// Добавление нового фильма
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, poster, genres } = req.body;

    if (!title || !poster || !genres) {
      return res.status(400).json({ error: "Не все данные переданы" });
    }

    // Проверка на дубликат по title
    const existingFilm = await Film.findOne({ title });
    if (existingFilm) {
      return res.status(400).json({ error: "Фильм с таким названием уже существует" });
    }

    const newFilm: IFilm = new Film({ title, poster, genres });
    await newFilm.save();

    res.status(201).json({ msg: "Фильм добавлен", film: newFilm });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Получение всех фильмов (например, для проверки дубликатов)
router.get("/", async (req: Request, res: Response) => {
  try {
    const films = await Film.find();
    res.json(films);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

export default router;
