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
  const [, setVisible] = useState(true);
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

      const res = await axios.post<FilmData>(
        "http://localhost:5000/api/parse-by-api",
        { url }
      );
      setFilm(res.data);

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

  useEffect(() => {
    if (message || error) {
      setVisible(true);

      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => {
          setMessage(null);
          setError(null);
        }, 1000);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, error]);


  return (
    <>
      <p className="titleText">Добавление рецезнии</p>
      <div className="findOrAddFilmBox flex-column">
        <p>Попробуйте найти фильм в списке фильмов, если его нету. Вставьте ссылку на страницу фильма из сервиса <a href="https://www.kinopoisk.ru/">Кинопоиск</a></p>
        <div className="inputsBox flex-center">
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
              {searchResults.map((filmItem, idx) => (
                <li
                  key={idx}
                  className="searchFilmCard flex-center"
                  onClick={() => setFilm(filmItem)} // ✅ теперь правильно
                >
                  {filmItem.poster && (
                    <img src={filmItem.poster} alt="poster" />
                  )}
                  <div className="filmText flex-center">
                    <p>{filmItem.title}</p>
                    <p>({filmItem.year})</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <p>Или</p>
          <div className="addFillmFromLink flex-center">
            <div className="floating-input">
              <input
                className="addFilmInput"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="Вставьте ссылку на Кинопоиск"
              />
              <label htmlFor="email">Вставьте ссылку на Кинопоиск</label>
            </div>
            <button onClick={handleParseAndAdd}>
              <img src="../../public/images/add2.svg" alt="Добавить" />
            </button>
          </div>
        </div>
      </div>
      {error && <div className="notificationMessage error flex-center">
          <img src="../../public/images/error.svg" alt="" />
          <p>{error}</p>
        </div>}
      {message && <div className="notificationMessage message flex-center">
          <img src="../../public/images/successful.svg" alt="" />
          <p>{message}</p>
        </div>}
      <div className="bottomBox">
        <div className="choosedFilmInfoBox flex-column">
          <p className="titleText">Информация о фильме:</p>
          {film && (
            <div className="filmInfo">
              {film.poster && <img src={film.poster} alt="poster" />}
              <div className="filmTextInfoBox flex-column">
                <div className="titleBox">
                  <p className="secondText">Название:</p>
                  <p className="titleText">{film.title} {film.year ? `(${film.year})` : ""}</p>
                </div>
                <div className="genresBox flex-column">
                  <p className="secondText">Жанры:</p>
                  <div className="genresList">
                    {film.genres?.map((genre, index) => (
                      <div key={index} className="genreCard">{genre}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="userReviewBox flex-column">
          <p className="titleText">Поделитесь мнением</p>
          <div className="floating-input">
            <textarea
              className="addFilmInput"
              // value={url}
              // onChange={e => setUrl(e.target.value)}
              placeholder="Рецензия к фильму"
            />
            <label htmlFor="textarea">Рецензия к фильму</label>
          </div>
          <button className="sendReviewButton flex-center">
              <img src="../../public/images/send.svg" alt="Добавить" />
              Отправить отзыв
            </button>
        </div>
      </div>
    </>
  );
}
