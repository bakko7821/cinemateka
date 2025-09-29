import express, { Request, Response } from "express";
import User, { IReview } from "../modules/User";
import Film from "../modules/Film";
import { Types } from "mongoose";

const router = express.Router();

interface AddReviewBody {
  userId: string;
  filmId: string;
  text: string;
  rating: number;
}

// Добавление рецензии
router.put("/review", async (req: Request<{}, {}, AddReviewBody>, res: Response) => {
  try {
    const { userId, filmId, text, rating } = req.body;

    if (!userId || !filmId || !text || rating === undefined) {
      return res.status(400).json({ error: "Не все данные переданы" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    const newReview: IReview = {
      filmId: new Types.ObjectId(filmId), // это то же самое, что _id фильма
      text,
      rating,
      createdAt: new Date(),
    };

    const film = await Film.findById(filmId);
    if (!film) {
      return res.status(404).json({ error: "Фильм не найден" });
    }

    user.reviews.push(newReview);
    await user.save();

    return res.status(200).json({ msg: "Рецензия добавлена", reviews: user.reviews });
  } catch (err: unknown) {
    console.error(err);
    return res.status(500).json({ error: err instanceof Error ? err.message : "Неизвестная ошибка" });
  }
});

// Рецензии + фильмы
router.get("/:id/reviews", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).lean();

    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    if (!user.reviews || user.reviews.length === 0) {
      return res.json([]);
    }

    const filmIds = user.reviews.map(r => r.filmId);
    const films = await Film.find({ _id: { $in: filmIds } }).lean();

    const reviewsWithFilms = user.reviews.map(review => {
      const film = films.find(f => f._id.toString() === review.filmId.toString());
      return {
        ...review,
        film: film || null,
      };
    });

    return res.json(reviewsWithFilms);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Ошибка при загрузке рецензий" });
  }
});

// Жанры по рецензиям
router.get("/:id/genres", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).lean();

    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    if (!user.reviews || user.reviews.length === 0) {
      return res.json({ genres: [] });
    }

    const filmIds = user.reviews.map(r => r.filmId);

    const films = await Film.find({ _id: { $in: filmIds } }).lean();

    const genreCount: Record<string, number> = {};

    films.forEach(film => {    // по каждому фильму
      if (Array.isArray(film.genres)) {
        film.genres.forEach((genre: string) => {
          genreCount[genre] = (genreCount[genre] || 0) + 1;
        });
      }
    });

    const sortedGenres = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])
      .map(([genre, count]) => ({ genre, count }));

    return res.json({ genres: sortedGenres });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Ошибка при загрузке жанров" });
  }
});

// Профиль пользователя
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "Пользователь не найден" });
    }

    res.json(user);
  } catch (err: unknown) {
    return res.status(500).json({ error: err instanceof Error ? err.message : "Неизвестная ошибка" });
  }
});

router.get("/review/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Некорректный ID" });
    }

    const user = await User.findOne(
      { "reviews._id": new Types.ObjectId(id) },
      { "reviews.$": 1 }
    );

    if (!user || !user.reviews || user.reviews.length === 0) {
      return res.status(404).json({ error: "Рецензия не найдена" });
    }

    const review = user.reviews[0]; // одна рецензия
    const film = await Film.findById(review.filmId).lean();

    return res.json({
      ...review,
      film: film || null,
    });
  } catch (err: unknown) {
    return res
      .status(500)
      .json({ error: err instanceof Error ? err.message : "Неизвестная ошибка" });
  }
});


export default router;
