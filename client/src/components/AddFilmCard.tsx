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

      // Парсим фильм через API
      const res = await axios.post<FilmData>(
        "http://localhost:5000/api/parse-by-api",
        { url }
      );
      setFilm(res.data);

      // Проверяем уникальность по title
      const existingRes = await axios.get<{ title: string }[]>("http://localhost:5000/films");
      const exists = existingRes.data.some(f => f.title === res.data.title);

      if (exists) {
        setError("Фильм с таким названием уже существует");
        return;
      }

      // Добавляем фильм в базу
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
        placeholder="Вставьте ссылку на свой"
        style={{ width: 400 }}
      />
      <button onClick={handleParseAndAdd}>
        <img src="../../public/images/add2.svg" alt="" />
      </button>

      {error && <div className="errorMessage">{error}</div>}
      {message && <div className="notificationMessage">{message}</div>}

      {film && (
        <div>
          {film.poster && <img src={film.poster} alt="poster" />}
          <div className="filmTextInfoBox">
            <div className="titleBox">
                <p>Название:</p>
                <p>{film.title} {film.year ? `(${film.year})` : ""}</p>
            </div>
            <div className="genresBox">
                <p>Жанры:</p>
                <div className="genserList">
                    {film.genres?.map((genre, index) => (
                        <div key={index} className="genreCard">
                        {genre}
                        </div>
                    ))}
                </div>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}
