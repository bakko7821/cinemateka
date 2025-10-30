import { Link } from "react-router-dom";
import type { GenreStat, Review } from "../../pages/ProfilePage";

export const ProfileFavorites = ({ genres, reviews }: { genres: GenreStat[]; reviews: Review[] }) => {
  return (
    <div className="favoritesLeftBox flex-column">
      <div className="favoriteGenre flex-column">
        <p className="titleText">Любимые жанры</p>
        <div className="infoBox">
          {genres.length ? (
            genres.map((g, i) => (
              <div className="genreCard flex-center" key={i}>
                <p className="genreName">{g.genre}</p>
                <span></span>
                <p className="genreCount">{g.count}</p>
              </div>
            ))
          ) : (
            <p className="nullMessage">У пользователя нет любимых жанров</p>
          )}
        </div>
      </div>

      <div className="favoriteFilms flex-column">
        <p className="titleText">Любимые фильмы</p>
        <div className="infoBox">
          {reviews.length ? (
            reviews
              .slice()
              .sort((a, b) => b.rating - a.rating)
              .map(r => (
                <Link to={`https://www.kinopoisk.ru/film/${r.film.kpId}`}>
                  <div className="filmCard flex-column" key={r._id}>
                    {r.film?.poster && <img className="filmPoster" src={r.film.poster} alt={r.film.title} />}
                    <div className="filmRaiting flex-center"><p>{r.rating}/10</p></div>
                  </div>
                </Link>
              ))
          ) : (
            <p className="nullMessage">Нет рецензий</p>
          )}
        </div>
      </div>
    </div>
  );
};
