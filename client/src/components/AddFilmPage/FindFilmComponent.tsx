import axios, { AxiosError } from "axios";
import { AddIcon, LinkIcon, SearchIcon } from "../../icons/Icons";
import { useEffect, useState } from "react";

export interface FilmData {
  _id: string;
  success: boolean;
  kpId: string;
  title: string;
  year?: number;
  poster?: string | null;
  genres?: string[];
}

interface FindFilmProps {
  onFilmSelect: (film: FilmData) => void;
  setError: (err: string | null) => void;
  setMessage: (msg: string | null) => void;
}

export const FindFilmComponent = ({ onFilmSelect, setError, setMessage }: FindFilmProps) => {
  const [url, setUrl] = useState<string>("");
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

      if (!url.trim()) {
        setError("Введите ссылку на фильм с Кинопоиска");
        return;
      }

      const res = await axios.post<FilmData>("http://localhost:5000/api/parse-by-api", { url });
      const filmData = res.data;

      const existingRes = await axios.get<{ title: string; year: number }[]>("http://localhost:5000/films");
      const exists = existingRes.data.some(f => f.title === filmData.title && f.year === filmData.year);

      if (exists) {
        setError("Фильм с таким названием и годом уже существует");
        return;
      }

      const addRes = await axios.post("http://localhost:5000/films", {
        title: filmData.title,
        year: filmData.year ?? "",
        poster: filmData.poster ?? "",
        kpId: filmData.kpId ?? "",
        genres: filmData.genres ?? [],
      });

      const addedFilm = { ...filmData, _id: addRes.data.film._id };
      setMessage(addRes.data.msg ?? "Фильм успешно добавлен!");
      onFilmSelect(addedFilm);
      setUrl("");
    } catch (e) {
      const err = e as AxiosError<{ error?: string }>;
      setError(err?.response?.data?.error ?? "Ошибка при добавлении фильма");
    }
  };

  return (
    <div className="findOrAddFilmBox flex-column">
      <p>
        Попробуйте найти фильм в списке фильмов.  
        Если его нет — вставьте ссылку на страницу фильма из сервиса{" "}
        <a href="https://www.kinopoisk.ru/" target="_blank" rel="noreferrer">Кинопоиск</a>.
      </p>

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
          />
          <label htmlFor="search">
            <SearchIcon /> Поиск фильма по названию
          </label>
        </div>
        {searchResults.length > 0 && (
          <ul className="searchResults flex-column">
            {searchResults.map((filmItem, idx) => (
              <li
                key={idx}
                className="searchFilmCard"
                onClick={() => {
                  onFilmSelect(filmItem);
                  setSearch("");
                  setSearchResults([]);
                }}
              >
                {filmItem.poster && <img src={filmItem.poster} alt="poster" />}
                <div className="filmText flex-center">
                  <p>{filmItem.title}</p>
                  {filmItem.year && <p>({filmItem.year})</p>}
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
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Вставьте ссылку на Кинопоиск"
            />
            <label htmlFor="addFilm">
              <LinkIcon /> Вставьте ссылку на Кинопоиск
            </label>
          </div>
          <button onClick={handleParseAndAdd} className="flex-center">
            <AddIcon />
          </button>
        </div>
      </div>
    </div>
  );
};
