import { useState, useEffect, type JSX } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import '../styles/Profile.css'

interface User {
  id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  image: string;
}

interface GenresResponse {
    genres: GenreStat[];
}

interface GenreStat {
    genre: string;
    count: number;
}

interface Film {
  _id: string;
  title: string;
  poster: string;
  year: number;
}

export default function ProfileCard() : JSX.Element {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [films, setFilms] = useState<Film[]>([]);
    const [isAuth, setIsAuth] = useState(false)
    const [userAvatar, setUserAvatar] = useState<string | null>(null);
    const [genres, setGenres] = useState<GenreStat[]>([]); // по умолчанию пустой массив
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        axios
            .get<User>(`http://localhost:5000/users/${id}`)
            .then(res => setUser(res.data))
            .catch(err => console.error(err));
    }, [id]);

    useEffect(() => {
        const authUser = localStorage.getItem("authUser")
        setIsAuth(authUser ? JSON.parse(authUser)?._id === id : false);
    })

    useEffect(() => {
        setUserAvatar(user?.image ? user.image : null);
    }, [user]);

    useEffect(() => {
    if (!id) return;

    const fetchGenres = async () => {
        try {
        setLoading(true);

        const res = await axios.get<GenresResponse>(`http://localhost:5000/users/${id}/genres`);
        setGenres(res.data.genres);

        } catch (err) {
        setError("Ошибка при загрузке жанров");
        console.error(err);
        } finally {
        setLoading(false);
        }
    };

    fetchGenres();
    }, [id]);

    useEffect(() => {
        if (!id) return;

        const fetchFilms = async () => {
        try {
            const res = await axios.get<Film[]>(`http://localhost:5000/users/${id}/films`);
            setFilms(res.data);
        } catch (err) {
            console.error("Ошибка при загрузке фильмов:", err);
        }
        };

        fetchFilms();
    }, [id]);

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>{error}</p>;

    return (
        <>
            <div className="headingBox flex-between">
                <div className="userInfoBox flex-center">
                    {userAvatar ? (
                        <img className="userAvatar"
                            src={`http://localhost:5000${user?.image}`}
                            alt="avatar" />
                    ) : (
                        <div className="userAvatar flex-center">
                            <p>{user?.username.charAt(0)}</p>
                        </div>
                    )}
                    <div className="textBox">
                        <p className="fullNameUser">{user?.firstname} {user?.lastname}</p>
                        <p className="userName">@{user?.username}</p>
                    </div>
                </div>
                {isAuth ? (
                    <button className="editProfileButton flex-center">
                        <img src="../../public/images/edit.svg" alt="" />
                        Изменить профиль
                    </button>
                ) : (
                    <div className="buttonsBox flex-center">
                        <button className="followButton flex-center">
                            <img src="../../public/images/follow.svg" alt="" />
                        </button>
                        <button className="giftSubscribeButton flex-center">
                            <img src="../../public/images/gift.svg" alt="" />
                            Подарить подписку
                        </button>
                    </div>
                )}
            </div>
            <div className="favoriteGenre flex-column">
                <p className="titleText">Любимые жанры</p>
                <div className="infoBox">
                {Array.isArray(genres) && genres.map((g, idx) => (
                    <div className="genreCard flex-center" key={idx}>
                        <p className="genreName">{g.genre}</p>
                        <span></span>
                        <p className="genreCount">{g.count}</p>
                    </div>
                ))}
                </div>
            </div>
            <div className="favoriteFilms flex-column">
                <p className="titleText">Любимые фильмы</p>
                <div className="infoBox">
                {films.map(film => (
                    <div className="filmCard" key={film._id}>
                        <img src={film.poster} alt="" />
                    </div>
                ))}
                </div>
            </div>
            <div className="userReviews flex-column">
                <p className="titleText">Рецензии</p>
                <div className="infoBox flex-column">

                </div>
            </div>
        </>
    )
}