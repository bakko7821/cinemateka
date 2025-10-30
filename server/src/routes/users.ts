import express, { Request, Response } from "express";
import User, { IReview } from "../modules/User";
import Film from "../modules/Film";
import mongoose, { Types } from "mongoose";
import { upload } from "../middleware/multer";

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
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({ error: error instanceof Error ? error.message : "Неизвестная ошибка" });
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
  } catch (error) {
    console.error(error);
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

    // достаем пользователя вместе с нужным отзывом
    const user = await User.findOne(
      { "reviews._id": new Types.ObjectId(id) },
      { firstname: 1, lastname: 1, username: 1, image: 1, "reviews.$": 1 }
    ).lean();

    if (!user || !user.reviews || user.reviews.length === 0) {
      return res.status(404).json({ error: "Рецензия не найдена" });
    }

    const review = user.reviews[0];
    const film = await Film.findById(review.filmId).lean();

    return res.json({
      review: {
        ...review,
        film: film || null,
      },
      author: {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        image: user.image,
      },
    });
  } catch (err: unknown) {
    return res.status(500).json({ error: err instanceof Error ? err.message : "Неизвестная ошибка" });
  }
});

router.put("/:id/set", upload.single("avatar"), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { firstname, lastname, username } = req.body;

    const updatedData: Record<string, any> = {
      firstname,
      lastname,
      username,
    };

    if (req.file) {
      updatedData.image = `/uploads/avatars/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(id, updatedData, { new: true }).select("-password");

    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    res.json(user);
  } catch (err: unknown) {
    return res.status(500).json({
      error: err instanceof Error ? err.message : "Неизвестная ошибка",
    });
  }
});

router.post("/:id/favorite", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Не передан userId" });
    }

    if (id === userId) {
      return res.status(400).json({ error: "Нельзя подписаться на себя" });
    }

    const user = await User.findById(userId);
    const target = await User.findById(id);

    if (!user || !target) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    const isFollowing = user.favorites.includes(new mongoose.Types.ObjectId(id));

    if (isFollowing) {
      user.favorites = user.favorites.filter(
        favId => favId.toString() !== id
      );
      await user.save();
      return res.json({ msg: "Отписка выполнена", favorites: user.favorites });
    } else {
      user.favorites.push(new mongoose.Types.ObjectId(id));
      await user.save();
      return res.json({ msg: "Подписка выполнена", favorites: user.favorites });
    }

  } catch (err: unknown) {
    return res.status(500).json({
      error: err instanceof Error ? err.message : "Неизвестная ошибка",
    });
  }
});

router.get("/:id/favorite", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).lean();
    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    const favoriteIds: string[] = (user.favorites || []).map(id => id.toString());

    const favoriteUsers = await User.find({ _id: { $in: favoriteIds } })
    .select("_id firstname lastname username image")
    .lean();

    return res.json(favoriteUsers);
  } catch (err: unknown) {
    return res.status(500).json({
      error: err instanceof Error ? err.message : "Неизвестная ошибка",
    });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    let users;
    users = await User.find()
    res.json(users)
  } catch (error: unknown) {
    return res.status(500).json({
      error: error instanceof Error ? error.message: "Неизвестная ошибка",
    })
  }
})

export default router;
