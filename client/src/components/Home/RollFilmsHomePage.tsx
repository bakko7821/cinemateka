import axios from "axios";
import { useEffect, useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";

interface FilmData {
  _id: string;
  success: boolean;
  kpId: string;
  title: string;
  year?: number;
  poster?: string | null;
  genres?: string[];
}

const positionClasses = ["first", "second", "mainCard", "second", "first"];

export default function RollFilms(): JSX.Element {
  const [films, setFilms] = useState<FilmData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAllFilms = async () => {
      try {
        const res = await axios.get<FilmData[]>(`http://localhost:5000/films/`);

        if (res.data.length < 15) {
          setError("В базе данных меньше 15 фильмов");
          setLoading(false);
          return;
        }

        const randomFilms = getRandomFilms(res.data);
        setFilms(randomFilms);
        console.log(randomFilms)

        setLoading(false);
      } catch (err) {
        console.error("Ошибка при получении всех фильмов:", err);
        setError("Ошибка при получении всех фильмов");
        setLoading(false);
      }
    };

    fetchAllFilms();
  }, []);

  function getRandomFilms(filmsArray: FilmData[]): FilmData[] {
    const selected: FilmData[] = [];

    while (selected.length < 15) {
      const randomIndex = Math.floor(Math.random() * filmsArray.length);
      const film = filmsArray[randomIndex];

      if (!selected.includes(film)) {
        selected.push(film);
      }
    }

    return selected;
  }

    const handleRotate = () => {
        if (isAnimating) return;
        setIsAnimating(true);

        let step = 0;

        const interval = setInterval(() => {
            // 1. Сдвигаем контейнер
            setTranslateX(-0); // ширина первой карточки

            setTimeout(() => {
            // 2. После завершения transition переставляем первый фильм в конец
            setFilms(prev => {
                const updated = [...prev];
                const first = updated.shift();
                if (first) updated.push(first);
                return updated;
            });

            // 3. Сбрасываем transform
            setTranslateX(0);
            }, 200); // совпадает с transition на 0.2s

            step++;
            if (step >= 10) {
            clearInterval(interval);
            setIsAnimating(false);
            }
        }, 200);
    };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="rollFilmsHomePageBox flex-column flex-center">
      <p className="headingText">Выбери себе фильм на вечер</p>
      <div
        className={`filmsBox transition-transform duration-[10000ms] ease-in-out`}
        style={{
            transform: `translateX(${translateX}px)`,
            transition: 'transform 0.2s ease'
        }}
      >
        {films.map((film, index) => (
          <div
            className={`movieCard ${index < 5 ? positionClasses[index] : ""}`}
            key={film?._id}
            onClick={() => window.open(`https://www.kinopoisk.ru/film/${film.kpId}`)}
          >
            <span className="backgroundBlur"></span>
            {film.poster && (
              <img
                className="filmPoster"
                src={film.poster}
                alt={film.title}
              />
            )}
          </div>
        ))}
      </div>
      <div className="buttonsBox flex-center">
        <button className="rollButton flex-center" onClick={handleRotate}>
          <img src="../../../public/images/dice.svg" alt="" />
          Выбрать фильм
        </button>
        <button className="goToRollPageButton flex-center" onClick={() => navigate("/roll")}>
          <img src="../../../public/images/note2.svg" alt="" />
          Составить свою подборку
        </button>
      </div>
    </div>
  );
}
