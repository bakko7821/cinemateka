import express from "express";
import User from "../models/User";

const router = express.Router();

// Получить юзера по id (без авторизации)
router.get("/:id", async (req, res) => {
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

export default router;
