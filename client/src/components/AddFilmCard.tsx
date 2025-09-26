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
  const [film, setFilm] = useState<FilmData | null>(null); // ✅ типизируем film
  const [error, setError] = useState<string | null>(null);

  const handleParse = async () => {
    try {
      setError(null);
      const res = await axios.post<FilmData>("http://localhost:5000/api/parse-by-api", { url });
      setFilm(res.data);
    } catch (e) {
      const err = e as AxiosError<{ error: string }>; // ✅ типизируем ошибку
      setError(err?.response?.data?.error ?? (err.message ?? "Неизвестная ошибка"));
    }
  };

  return (
    <div>
      <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://www.kinopoisk.ru/film/5003510/" />
      <button onClick={handleParse}>Парсить через API</button>

      {error && <div style={{color: "red"}}>{error}</div>}

      {film && (
        <div>
          <h3>{film.title} {film.year ? `(${film.year})` : ""}</h3>
          {film.poster && <img src={film.poster} alt="poster" style={{maxWidth:200}}/>}
          <p>Жанры: {film.genres?.join(", ")}</p>
        </div>
      )}
    </div>
  );
}
