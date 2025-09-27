import axios, { AxiosError } from "axios";
import { useState, useEffect } from "react";

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

  const [search, setSearch] = useState<string>("");
  const [searchResults, setSearchResults] = useState<FilmData[]>([]);

  useEffect(() => {
    const fetchSearch = async () => {
      if (!search.trim()) {
        setSearchResults([]);
        return;
      }
      try {
        const res = await axios.get<FilmData[]>(`http://localhost:5000/films?search=${search}`);
        setSearchResults(res.data);
      } catch (err) {
        console.error("Ошибка поиска:", err);
      }
    };

    const delay = setTimeout(fetchSearch, 300);
    return () => clearTimeout(delay);
  }, [search]);

  const handleParseAndAdd = async () => {
    try {
      setError(null);
      setMessage(null);

      // 1. Парсим фильм через API
      const res = await axios.post<FilmData>(
        "http://localhost:5000/api/parse-by-api",
        { url }
      );
      setFilm(res.data);

      // 2. Проверяем уникальность по title + year
      const existingRes = await axios.get<{ title: string; year: number }[]>(
        "http://localhost:5000/films"
      );

      const exists = existingRes.data.some(
        f => f.title === res.data.title && f.year === res.data.year
      );

      if (exists) {
        setError("Фильм с таким названием и годом уже существует");
        return;
      }

      console.log(res.data.year)

      const addRes = await axios.post("http://localhost:5000/films", {
        title: res.data.title,
        year: res.data.year ?? "",
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
    <>
      <p className="titleText">Добавление рецезнии</p>
      <div>
        <div className="floating-input">
          <input
            type="search"
            id="search"
            name="search"
            className="searchInput"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск фильма по названию"
            required
          />
          <label htmlFor="email">Поиск фильма по названию</label>
        </div>
        {searchResults.length > 0 && (
          <ul className="searchResults">
            {searchResults.map((f, idx) => (
              <li key={idx} className="searchFilmCard flex-center">
                {f.poster && <img src={f.poster} alt="poster"/>}
                <p>{f.title}</p>
                <p>({f.year})</p>
              </li>
            ))}
          </ul>
        )}
        <div style={{ marginTop: 20 }}>
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="Вставьте ссылку на Кинопоиск"
            style={{ width: 400 }}
          />
          <button onClick={handleParseAndAdd}>
            <img src="../../public/images/add2.svg" alt="Добавить" />
          </button>
        </div>

        {error && <div className="errorMessage">{error}</div>}
        {message && <div className="notificationMessage">{message}</div>}

        {film && (
          <div style={{ marginTop: 20 }}>
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
                    <div key={index} className="genreCard">{genre}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
