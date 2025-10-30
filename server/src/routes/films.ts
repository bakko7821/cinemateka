import express, { Request, Response } from "express";
import Film, { IFilm } from "../modules/Film";

const router = express.Router();

// Добавление нового фильма
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, year, poster, kpId, genres } = req.body;

    if (!title || !year || !poster || !genres) {
      return res.status(400).json({ error: "Не все данные переданы" });
    }

    const existingFilm = await Film.findOne({ title, year });
    if (existingFilm) {
      return res.status(400).json({ error: "Фильм с таким названием и годом уже существует" });
    }

    const newFilm: IFilm = new Film({ title, poster, kpId, year: Number(year), genres });
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

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const film = await Film.findById(id); // ✅ добавили await

    if (!film) {
      return res.status(404).json({ msg: "Фильм не найден" });
    }

    res.json(film);
  } catch (error: unknown) {
    console.log(error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});


export default router;
