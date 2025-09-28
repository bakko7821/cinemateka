import express, { Request, Response } from "express";
import User, { IReview } from "../modules/User";
import Film from "../modules/Film";
import mongoose from "mongoose";

const router = express.Router();

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "Пользователь не найден" });
    }

    res.json(user);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Неизвестная ошибка" });
    }
  }
});

interface AddReviewBody {
  userId: string;
  filmId: string;
  text: string;
  rating: number;
}

router.put("/review", async (req: Request<{}, {}, AddReviewBody>, res: Response) => {
    try {
      const { userId, filmId, text, rating } = req.body;

      if (!userId || !text || rating === undefined) {
        return res.status(400).json({ error: "Не все данные переданы" });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "Пользователь не найден" });
      }

      const newReview: IReview = {
        filmId: new mongoose.Types.ObjectId(filmId),
        text,
        rating,
        createdAt: new Date(),
      };

      user.reviews.push(newReview);
      await user.save();

      return res.status(200).json({ msg: "Рецензия добавлена", reviews: user.reviews });
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        return res.status(500).json({ error: err.message });
      }
      return res.status(500).json({ error: "Неизвестная ошибка" });
    }
  }
);

router.get("/:id/films", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    if (!Array.isArray(user.reviews)) {
      return res.json([]);
    }

    // достаём id фильмов и убираем дубли
    const filmIds = [...new Set(user.reviews.map(r => r.filmId))];

    // приводим к ObjectId, если они строками
    const objectIds = filmIds.map(fid => new mongoose.Types.ObjectId(fid));

    const films = await Film.find({ _id: { $in: objectIds } });

    return res.json(films);
  } catch (err: unknown) {
    console.error(err);
    if (err instanceof Error) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(500).json({ error: "Неизвестная ошибка" });
  }
});

router.get("/:id/genres", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    const filmIds = user.reviews.map(r => r.filmId);

    const films = await Film.find({ _id: { $in: filmIds } });

    const genreCount: Record<string, number> = {};

    films.forEach(film => {
      film.genres.forEach(genre => {
        genreCount[genre] = (genreCount[genre] || 0) + 1;
      });
    });

    const sortedGenres = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])
      .map(([genre, count]) => ({ genre, count }));

    return res.json({ genres: sortedGenres });
  } catch (err: unknown) {
    console.error(err);
    if (err instanceof Error) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(500).json({ error: "Неизвестная ошибка" });
  }
});



export default router;
