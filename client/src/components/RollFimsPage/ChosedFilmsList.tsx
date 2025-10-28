import type { FilmData } from "../AddFilmPage/FindFilmComponent";

interface Props {
  films: FilmData[];
  onChanceChange: (filmId: string, value: number) => void;
}

export const ChosedFilmsList = ({ films, onChanceChange }: Props) => {
  return (
    <div className="chosedFilmsList flex-column g16">
      <p className="titleText">Список добавленных фильмов</p>

      {films.length > 0 ? (
        films.map((film) => (
          <div key={film._id} className="chosedFilmCard flex g16">
            <p>{film.title}</p>
            <input
              type="number"
              min={0}
              max={100}
              value={film.chance ?? 0}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0;
                onChanceChange(film._id, value);
              }}
            />
            <span>%</span>
          </div>
        ))
      ) : (
        <p className="nullMessage">Пока ничего не добавлено</p>
      )}
    </div>
  );
};
