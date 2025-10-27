import { useState } from "react";
import { NoteIcon, SendIcon } from "../../icons/Icons";
import RatingSelector from "../RatingSelector";
import { jwtDecode } from "jwt-decode";
import axios, { AxiosError } from "axios";
import type { FilmData } from "./FindFilmComponent";

interface JwtPayload {
  id: string;
  exp: number;
}

interface UserReviewProps {
  film: FilmData | null;
  setError: (err: string | null) => void;
  setMessage: (msg: string | null) => void;
}

export const UserReviewCompnent = ({ film, setError, setMessage }: UserReviewProps) => {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState<number>(0);

  async function postReview() {
    try {
      setError(null);
      setMessage(null);

      if (!film) {
        setError("Сначала выберите фильм для рецензии");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Вы не авторизованы");
        return;
      }

      const decoded = jwtDecode<JwtPayload>(token);
      if (!decoded.id) {
        setError("Ошибка авторизации: не найден userId");
        return;
      }

      if (!reviewText.trim()) {
        setError("Введите текст рецензии");
        return;
      }

      const res = await axios.put("http://localhost:5000/users/review", {
        userId: decoded.id,
        filmId: film._id,
        text: reviewText,
        rating,
      });

      setMessage(res.data.msg ?? "Рецензия успешно добавлена!");
      setReviewText("");
      setRating(0);
    } catch (e) {
      const err = e as AxiosError<{ error?: string }>;
      setError(err?.response?.data?.error ?? "Ошибка при отправке рецензии");
    }
  }

  return (
    <div className="userReviewBox flex-column">
      <div className="headingBox flex-between">
        <p className="titleText">Поделитесь мнением</p>
        <RatingSelector value={rating} onChange={setRating} />
      </div>

      <div className="reviewBox flex-column">
        <div className="floating-input">
          <textarea
            className="addFilmInput"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Рецензия к фильму"
          />
          <label htmlFor="textarea" className="flex-center">
            <NoteIcon /> Рецензия к фильму
          </label>
        </div>

        <button className="sendReviewButton flex-center" onClick={postReview}>
          <SendIcon /> Отправить рецензию
        </button>
      </div>
    </div>
  );
};
