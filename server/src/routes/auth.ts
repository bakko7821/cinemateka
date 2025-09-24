import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { authMiddleware } from "../middleware/middleware";

const router = express.Router();

// Регистрация (без middleware)
router.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "Email уже используется" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstname,
      lastname,
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ msg: "Регистрация успешна!" });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Неизвестная ошибка" });
    }
  }
});

// Авторизация (без middleware)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Пользователь не найден" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ msg: "Неверный пароль" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "1h" });

    res.json({msg: "Авторизация успешна!", token, user});
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Неизвестная ошибка" });
    }
  }
});

// Пример защищённого роута
router.get("/profile", authMiddleware, async (req, res) => {
  res.json({ msg: "Это защищённая страница профиля" });
});


export default router;
