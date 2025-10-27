import type { FilmData } from "./FindFilmComponent";

export const ChosedFilmInfoComponent = ({ film }: { film: FilmData | null }) => {
  if (!film) return null;
  return (
    <div className="choosedFilmInfoBox flex-column">
      <p className="titleText">Информация о фильме:</p>
      <div className="filmInfo">
        {film.poster && <img src={film.poster} alt="poster" />}
        <div className="filmTextInfoBox flex-column">
          <div className="titleBox">
            <p className="secondText">Название:</p>
            <p className="titleText">
              {film.title} {film.year ? `(${film.year})` : ""}
            </p>
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
    </div>
  );
};
