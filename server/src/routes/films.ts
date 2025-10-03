import express, { Request, Response } from "express";
import Film, { IFilm } from "../modules/Film";

const router = express.Router();

// Добавление нового фильма
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, year, poster, genres } = req.body;

    if (!title || !year || !poster || !genres) {
      return res.status(400).json({ error: "Не все данные переданы" });
    }

    const existingFilm = await Film.findOne({ title, year });
    if (existingFilm) {
      return res.status(400).json({ error: "Фильм с таким названием и годом уже существует" });
    }

    const newFilm: IFilm = new Film({ title, poster, year: Number(year), genres });
    await newFilm.save();

    res.status(201).json({ msg: "Фильм добавлен", film: newFilm });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string | undefined;

    let films;
    if (search) {
      films = await Film.find({
        title: { $regex: "^" + search, $options: "i" }
      });
    } else {
      films = await Film.find();
    }

    res.json(films);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});


export default router;
