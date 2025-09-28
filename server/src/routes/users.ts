import express, { Request, Response } from "express";
import User, { IReview } from "../modules/User";
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

export default router;
