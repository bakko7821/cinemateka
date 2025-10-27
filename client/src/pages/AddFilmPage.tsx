import { useEffect, useState } from "react";
import "../styles/AddFilm.css";
import { ChosedFilmInfoComponent } from "../components/AddFilmPage/ChosedFilmInfoComponent";
import { FindFilmComponent, type FilmData } from "../components/AddFilmPage/FindFilmComponent";
import { UserReviewCompnent } from "../components/AddFilmPage/UserReviewComponent";
import { jwtDecode, type JwtPayload } from "jwt-decode";

export const AddFilmPage = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [film, setFilm] = useState<FilmData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded.exp && decoded.exp * 1000 > Date.now()) {
        setIsAuth(true);
      } else {
        localStorage.removeItem("token");
      }
    } catch {
      setIsAuth(false);
    }
  }, []);

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage(null);
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  return (
    <>
      <p className="titleText">Добавление рецензии</p>

      {!isAuth && (
        <p>
          Вы не авторизованы. <a href="/login">Войти</a>
        </p>
      )}

      {isAuth && (
        <div className="addFilmPage">
          <div className="leftBox flex-column">
            <FindFilmComponent onFilmSelect={setFilm} setError={setError} setMessage={setMessage} />
            <UserReviewCompnent film={film} setError={setError} setMessage={setMessage} />
          </div>
          <ChosedFilmInfoComponent film={film} />
        </div>
      )}

      {(error || message) && (
        <div className={`alertBox ${error ? "error" : "success"}`}>
          <p>{error || message}</p>
        </div>
      )}
    </>
  );
};
