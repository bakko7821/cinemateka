import axios, { AxiosError } from "axios";
import { useState, useEffect } from "react";
import { jwtDecode} from "jwt-decode";
import RatingSelector from "./RatingSelector";

interface FilmData {
  _id: string;
  success: boolean;
  kpId: string;
  title: string;
  year?: number;
  poster?: string | null;
  genres?: string[];
}

interface JwtPayload {
  id: string;
  exp: number;
}

export default function AddFilmCard() {
  const [url, setUrl] = useState<string>("");
  const [film, setFilm] = useState<FilmData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [, setVisible] = useState(true);
  const [search, setSearch] = useState<string>("");
  const [searchResults, setSearchResults] = useState<FilmData[]>([]);
  const [isAuth, setIsAuth] = useState(false);
  const [reviewText, setReviewText] = useState(""); // хранение текста рецензии
  const [rating, setRating] = useState<number>(0);

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

      setFilm({
        ...res.data,
        _id: addRes.data.film._id,
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
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);

        if (decoded.exp * 1000 > Date.now()) {
          setIsAuth(true);
        } else {
          localStorage.removeItem("token");
        }
      } catch {
        setIsAuth(false);
      }
    }
  }, []);

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

  const textarea = document.querySelector("textarea");

  textarea?.addEventListener("input", () => {
    textarea.style.height = "auto"; 
    textarea.style.height = textarea.scrollHeight + "px";
  });

  return (
    <>
    <p className="titleText">Добавление рецезнии</p>
    {isAuth? (
      <div className="addFilmPage">
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

          {error && <div className="notificationMessage error flex-center">
              <img src="../../public/images/error.svg" alt="" />
              <p>{error}</p>
          </div>}
          {message && <div className="notificationMessage message flex-center">
              <img src="../../public/images/successful.svg" alt="" />
              <p>{message}</p>
          </div>}

        <div className="leftBox flex-column">
          <div className="findOrAddFilmBox flex-column">
            <p>Попробуйте найти фильм в списке фильмов, если его нету. Вставьте ссылку на страницу фильма из сервиса <a href="https://www.kinopoisk.ru/">Кинопоиск</a></p>
            <div className="inputsBox flex-center">
              <div className="floating-input search">
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
                <label htmlFor="search">
                  <img src="../../public/images/search2.svg" alt="" />
                  Поиск фильма по названию
                </label>
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
                <div className="floating-input addFromLink">
                  <input
                    id="addFilm"
                    name="addFilm"
                    className="addFilmInput"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="Вставьте ссылку на Кинопоиск"
                  />
                  <label htmlFor="addFilm">
                    <img src="../../public/images/link.svg" alt="" />
                    Вставьте ссылку на Кинопоиск
                  </label>
                </div>
                <button onClick={handleParseAndAdd}>
                  <img src="../../public/images/add2.svg" alt="Добавить" />
                </button>
              </div>
            </div>
          </div>
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
                <label htmlFor="textarea">
                  <img src="../../public/images/note.svg" alt="" />
                  Рецензия к фильму</label>
              </div>
              <button className="sendReviewButton flex-center" onClick={() => postReview()}>
                <img src="../../public/images/send.svg" alt="Добавить" />
                Отправить рецензию
              </button>
            </div>   
          </div>
        </div>
      </div>
    ) : (
      <p>Вы не авторизованы. <a href="/login">Войти</a></p>
    )}
    </>
  );
}
