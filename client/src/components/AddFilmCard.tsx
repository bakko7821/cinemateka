import axios, { AxiosError } from "axios";
import { useState } from "react";

interface FilmData {
  success: boolean;
  kpId: string;
  title: string;
  year?: number;
  poster?: string | null;
  genres?: string[];
}

export default function AddFilmCard() {
  const [url, setUrl] = useState<string>("");
  const [film, setFilm] = useState<FilmData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Парсинг фильма и автоматическое добавление
  const handleParseAndAdd = async () => {
    try {
      setError(null);
      setMessage(null);

      // 1️⃣ Парсим фильм через API
      const res = await axios.post<FilmData>(
        "http://localhost:5000/api/parse-by-api",
        { url }
      );
      setFilm(res.data);

      // 2️⃣ Проверяем уникальность по title
      const existingRes = await axios.get<{ title: string }[]>("http://localhost:5000/films");
      const exists = existingRes.data.some(f => f.title === res.data.title);

      if (exists) {
        setError("Фильм с таким названием уже существует");
        return;
      }

      // 3️⃣ Добавляем фильм в базу
      const addRes = await axios.post("http://localhost:5000/films", {
        title: res.data.title,
        poster: res.data.poster ?? "",
        genres: res.data.genres ?? [],
      });

      setMessage(addRes.data.msg ?? "Фильм успешно добавлен!");
    } catch (e) {
      const err = e as AxiosError<{ error?: string }>;
      setError(err?.response?.data?.error ?? (err.message ?? "Ошибка при обработке фильма"));
    }
  };

  return (
    <div>
      <input
        value={url}
        onChange={e => setUrl(e.target.value)}
        placeholder="https://www.kinopoisk.ru/film/5003510/"
        style={{ width: 400 }}
      />
      <button onClick={handleParseAndAdd}>Добавить фильм</button>

      {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
      {message && <div style={{ color: "green", marginTop: 10 }}>{message}</div>}

      {film && (
        <div style={{ marginTop: 20 }}>
          <h3>{film.title} {film.year ? `(${film.year})` : ""}</h3>
          {film.poster && <img src={film.poster} alt="poster" style={{ maxWidth: 200 }} />}
          <p>Жанры: {film.genres?.join(", ")}</p>
        </div>
      )}
    </div>
  );
}
