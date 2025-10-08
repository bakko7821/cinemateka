import { useState, useEffect, type JSX } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/Profile.css'
import { ActiveStar, EditIcon, FollowIcon, GiftIcon, NonActiveStar, UnFollowIcon } from "../icons/Icons";

interface User {
  _id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  image: string;
  favorites: string[];
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

interface Reviews {
  filmId: string;
  text: string;
  rating: number;
  createdAt: Date;
  _id: string;
  film: Film;
}

interface IUser {
  _id: string;
  firstname: string;
  lastname: string;
  username: string;
  image?: string;
}

export default function ProfileCard(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Reviews[]>([]);
  const [isAuth, setIsAuth] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [genres, setGenres] = useState<GenreStat[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [favoriteUsers, setFavoriteUsers] = useState<IUser[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);

  const navigate = useNavigate();

  // Загружаем данные профиля
  useEffect(() => {
    if (!id) return;
    axios
      .get<User>(`http://localhost:5000/users/${id}`)
      .then(res => setUser(res.data))
      .catch(err => console.error(err));
  }, [id]);

  // Проверяем, является ли это мой профиль
  useEffect(() => {
    const authUser = localStorage.getItem("authUser");
    if (!authUser) return;
    const parsed = JSON.parse(authUser);
    setIsAuth(parsed?._id === id);
  }, [id]);

  // Проверяем, подписан ли Я на этого пользователя
  useEffect(() => {
    const checkFollowStatus = async () => {
      const authUserString = localStorage.getItem("authUser");
      if (!authUserString || !id) return;

      const parsed = JSON.parse(authUserString);
      try {
        const res = await axios.get<User>(`http://localhost:5000/users/${parsed._id}`);
        setIsFollowing(res.data.favorites.includes(id)); // если мой favorites содержит id этого профиля
      } catch (err) {
        console.error("Ошибка при проверке подписки:", err);
      }
    };

    checkFollowStatus();
  }, [id]);

  // Загружаем остальные данные
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
    const fetchReviews = async () => {
      try {
        const res = await axios.get<Reviews[]>(`http://localhost:5000/users/${id}/reviews`);
        setReviews(res.data);
      } catch (err) {
        console.log("Ошибка при загрузке рецензий:", err);
      }
    };
    fetchReviews();
  }, [id]);

  async function handleFollow(targetId: string | undefined) {
    if (!targetId) return;

    const authUser = localStorage.getItem("authUser");
    if (!authUser) return navigate("/login");

    const parsed = JSON.parse(authUser);

    try {
      const res = await axios.post(`http://localhost:5000/users/${targetId}/favorite`, {
        userId: parsed._id,
      });

      setIsFollowing(!isFollowing); // переключаем состояние локально
      console.log(res.data.msg);
    } catch (err) {
      console.error("Ошибка при подписке:", err);
    }
  }

  useEffect(() => {
    const fetchFavoriteUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:5000/users/${id}/favorite`);
        if (!response.ok) throw new Error("Ошибка при получении данных");
        const data: IUser[] = await response.json();
        setFavoriteUsers(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Неизвестная ошибка");
      } finally {
        setLoading(false);
      }
    };
    fetchFavoriteUsers();
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
                    <button onClick={() => navigate(`/profile/${user?._id}/edit`)} className="editProfileButton flex-center">
                        <EditIcon />
                        Изменить профиль
                    </button>
                ) : (
                    <div className="buttonsBox flex-center">
                        <button
                            className={`followButton flex-center ${isFollowing ? "unfollow" : ""}`}
                            onClick={() => handleFollow(user?._id)}
                        >
                            {isFollowing ? (
                            <>
                                <UnFollowIcon />
                            </>
                            ) : (
                            <>
                                <FollowIcon />
                            </>
                            )}
                        </button>
                        <button className="giftSubscribeButton flex-center">
                            <GiftIcon />
                            Подарить подписку
                        </button>
                    </div>
                )}
            </div>
            <div className="favoritesBox">
                <div className="favoritesLeftBox flex-column">
                    <div className="favoriteGenre flex-column">
                        <p className="titleText">Любимые жанры</p>
                        <div className="infoBox">
                        {Array.isArray(genres) && genres.length > 0 ? (
                            genres.map((g, idx) => (
                                <div className="genreCard flex-center" key={idx}>
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
                            {Array.isArray(reviews) && reviews.length > 0 ? (
                            reviews
                                .slice() // чтобы не мутировать исходный массив
                                .sort((a, b) => b.rating - a.rating) // сортировка по убыванию
                                .map(review => (
                                <div className="filmCard flex-column" onClick={() => navigate(`/review/${review._id}`)} key={review._id}>
                                    {review.film?.poster && (
                                    <img
                                        className="filmPoster"
                                        src={review.film.poster}
                                        alt={review.film.title}
                                    />
                                    )}
                                    <div className="filmRaiting flex-center">
                                    <p>{review.rating}/10</p>
                                    </div>
                                </div>
                                ))
                            ) : (
                            <p className="nullMessage">У пользователя нет рецензий</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="favoriteUsersBox flex-column">
                    <p className="titleText">Подписки</p>  
                    <div className="usersCardsBox flex-column">
                            {Array.isArray(favoriteUsers) && favoriteUsers.length > 0 ? (
                                favoriteUsers.map(favoriteUser => (
                                    <div className="userCard" key={favoriteUser._id}
                                    onClick={() => navigate(`/profile/${favoriteUser._id}`)}>
                                       {favoriteUser.image ? (
                                            <img className="userAvatar"
                                                src={`http://localhost:5000${favoriteUser.image}`}
                                                alt="avatar" />
                                        ) : (
                                            <div className="userAvatar flex-center">
                                                <p>{favoriteUser.username.charAt(0)}</p>
                                            </div>
                                        )}
                                        <div className="textBox flex-column">
                                            <p className="fullNameUser">{favoriteUser.firstname} {favoriteUser.lastname}</p>
                                            <p className="userName">@{favoriteUser.username}</p>
                                        </div> 
                                    </div>
                                ))
                            ) : (
                               <p className="nullMessage">Пользователь никого не отслеживает</p> 
                            )}
                    </div> 
                </div>
            </div>
            
            <div className="userReviews flex-column">
                <p className="titleText">Рецензии</p>
                <div className="infoBox flex-column">
                {Array.isArray(reviews) && reviews.length > 0 ? (
                    reviews.slice().reverse().map(review => (
                        <div className="reviewCard" key={review.filmId}>
                            {review.film?.poster && <img className="filmPoster" src={review.film.poster} alt={review.film.title} />}
                            <div className="reviewAllInfo flex-column">
                                <div className="headingBox flex-between">
                                    <div className="reviewInfo flex-center">
                                        <p className="titleText">{review.film.title} ({review.film.year})</p>
                                        <span></span>
                                        <div className="stars flex-center">
                                        {Array.from({ length: 10 }).map((_, index) =>
                                            index < review.rating ? (
                                            <ActiveStar key={index} />
                                            ) : (
                                            <NonActiveStar key={index} />
                                            )
                                        )}
                                        </div>
                                    </div>
                                    <button className="goToReviewButton flex-center" onClick={() => navigate(`/review/${review._id}`)}>
                                        Читать подробно...
                                    </button>
                                </div>
                                <p className="reviewText">{review.text}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="nullMessage">У пользователя нет рецензий</p>
                )}
                </div>
            </div>
        </>
    )
}