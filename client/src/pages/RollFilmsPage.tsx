import { useState, useEffect } from "react";
import { ChosedFilmInfoComponent } from "../components/AddFilmPage/ChosedFilmInfoComponent";
import { FindFilmComponent, type FilmData } from "../components/AddFilmPage/FindFilmComponent";
import "../styles/RollFilms.css";
import { ChosedFilmsList } from "../components/RollFimsPage/ChosedFilmsList";

export const RollFilmsPage = () => {
  const [film, setFilm] = useState<FilmData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [chosedFilms, setChosedFilms] = useState<FilmData[]>([]);

  // добавляем фильм в список
  const handleAddFilm = (selectedFilm: FilmData) => {
    const exists = chosedFilms.some(f => f._id === selectedFilm._id);
    if (exists) {
      setError("Этот фильм уже добавлен");
      return;
    }

    setChosedFilms(prev => [...prev, { ...selectedFilm }]);
    setMessage("Фильм добавлен в колесо");
  };

    useEffect(() => {
        if (chosedFilms.length > 0) {
            const equalChance = +(100 / chosedFilms.length).toFixed(2);
            setChosedFilms(prev => prev.map(f => ({ ...f, chance: equalChance })));
        }
    }, [chosedFilms.length]);

  // изменение шанса у конкретного фильма
  const handleChanceChange = (filmId: string, value: number) => {
    setChosedFilms(prev =>
      prev.map(f => (f._id === filmId ? { ...f, chance: value } : f))
    );
  };

  return (
    <>
        <ChosedFilmsList films={chosedFilms} onChanceChange={handleChanceChange} />
        <div className="addFilmToRollBox flex-column g16">
            <p className="titleText">Добавьте фильм в колесо</p>

            <div className="addFilmToRollBoxContent flex g16">
            <FindFilmComponent
                onFilmSelect={(film) => {
                setFilm(film);
                handleAddFilm(film);
                }}
                setError={setError}
                setMessage={setMessage}
            />
            <ChosedFilmInfoComponent film={film} />
            </div>
        </div>

        {(error || message) && (
        <div className={`alertBox ${error ? "error" : "success"}`}>
            <p>{error || message}</p>
        </div>
        )}
    </>
  );
};
