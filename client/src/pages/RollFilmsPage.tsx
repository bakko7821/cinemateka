import { useState, useEffect } from "react";
import { ChosedFilmInfoComponent } from "../components/AddFilmPage/ChosedFilmInfoComponent";
import { FindFilmComponent, type FilmData } from "../components/AddFilmPage/FindFilmComponent";
import "../styles/RollFilms.css";
import { ChosedFilmsList } from "../components/RollFimsPage/ChosedFilmsList";
import { Wheel } from "../components/RollFimsPage/Wheel";

interface ChosedFilm {
  film: FilmData;
  chance: number;
}

export const RollFilmsPage = () => {
  const [film, setFilm] = useState<FilmData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [chosedFilms, setChosedFilms] = useState<ChosedFilm[]>([]);

  // добавляем фильм в список
    const handleAddFilm = (selectedFilm: FilmData) => {
        const exists = chosedFilms.some(f => f.film._id === selectedFilm._id);
        if (exists) {
            setError("Этот фильм уже добавлен");
            return;
        }

        const updated = [...chosedFilms, { film: selectedFilm, chance: 0 }];
        const equalChance = +(100 / updated.length).toFixed(2);
        const balanced = updated.map(f => ({ ...f, chance: equalChance }));
        setChosedFilms(balanced);
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
      prev.map(f => (f.film._id === filmId ? { ...f, chance: value } : f))
    );
  };

  return (
    <>
        <div className="headingRollFilmPageBox flex g16">
            <ChosedFilmsList 
             films={chosedFilms.map(f => ({ ...f.film, chance: f.chance }))} 
             onChanceChange={handleChanceChange} 
            />

            <Wheel films={chosedFilms} />
        </div>
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
