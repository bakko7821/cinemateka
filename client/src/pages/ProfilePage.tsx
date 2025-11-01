import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Profile.css";
import { ProfileHeader } from "../components/ProfilePage/ProfileHeader";
import { ProfileFavorites } from "../components/ProfilePage/ProfileFavorites";
import { ProfileFollowings } from "../components/ProfilePage/ProfileFollowing";
import { ProfileReviews } from "../components/ProfilePage/ProfileReviews";

export interface User {
  _id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  image: string;
  favorites: string[];
  reviews: Review[];
  subscribe: boolean;
  followersCount: number;
}

export interface GenreStat {
  genre: string;
  count: number;
}

export interface Film {
  _id: string;
  title: string;
  poster: string;
  year: number;
  kpId: string;
}

export interface Review {
  filmId: string;
  text: string;
  rating: number;
  createdAt: string;
  _id: string;
  film: Film;
}

export interface IUser {
  _id: string;
  firstname: string;
  lastname: string;
  username: string;
  image?: string;
}

export const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [genres, setGenres] = useState<GenreStat[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [favoriteUsers, setFavoriteUsers] = useState<IUser[]>([]);
  const [isAuth, setIsAuth] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // --- загрузка пользователя ---
  useEffect(() => {
    if (!id) return;
    axios
      .get<User>(`http://localhost:5000/users/${id}`)
      .then(res => setUser(res.data))
      .catch(err => setError(err + "Ошибка при загрузке профиля"));
  }, [id]);

  // --- проверка авторизации ---
  useEffect(() => {
    const authUser = localStorage.getItem("authUser");
    if (!authUser) return;
    const parsed = JSON.parse(authUser);
    setIsAuth(parsed?._id === id);
  }, [id]);

  // --- проверка подписки ---
  useEffect(() => {
    const checkFollowStatus = async () => {
      const authUser = localStorage.getItem("authUser");
      if (!authUser || !id) return;
      const parsed = JSON.parse(authUser);
      try {
        const res = await axios.get<User>(`http://localhost:5000/users/${parsed._id}`);
        setIsFollowing(res.data.favorites.includes(id));
      } catch (err) {
        console.error("Ошибка проверки подписки:", err);
      }
    };
    checkFollowStatus();
  }, [id]);

  // --- загрузка жанров ---
  useEffect(() => {
    if (!id) return;
    axios
      .get<{ genres: GenreStat[] }>(`http://localhost:5000/users/${id}/genres`)
      .then(res => setGenres(res.data.genres))
      .catch(() => setError("Ошибка при загрузке жанров"))
      .finally(() => setLoading(false));
  }, [id]);

  // --- загрузка рецензий ---
  useEffect(() => {
    if (!id) return;
    axios
      .get<Review[]>(`http://localhost:5000/users/${id}/reviews`)
      .then(res => setReviews(res.data))
      .catch(() => console.log("Ошибка при загрузке рецензий"));
  }, [id]);

  // --- загрузка подписок ---
  useEffect(() => {
    if (!id) return;
    const fetchFavorites = async () => {
      try {
        const res = await fetch(`http://localhost:5000/users/${id}/favorite`);
        if (!res.ok) throw new Error();
        const data: IUser[] = await res.json();
        setFavoriteUsers(data);
      } catch {
        setError("Ошибка при загрузке подписок");
      }
    };
    fetchFavorites();
  }, [id]);

  // --- подписка/отписка ---
  async function handleFollow(targetId?: string) {
    if (!targetId) return;
    const authUser = localStorage.getItem("authUser");
    if (!authUser) return navigate("/login");

    const parsed = JSON.parse(authUser);
    try {
      const res = await axios.post(`http://localhost:5000/users/${targetId}/favorite`, {
        userId: parsed._id,
      });
      setIsFollowing(res.data.following);
      // если хочешь — можешь сразу обновить счетчик на UI
      // setFollowersCount(res.data.followersCount);
    } catch (err) {
      console.error("Ошибка при подписке:", err);
    }
  }

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="page flex-column g16">
      <ProfileHeader
        user={user}
        isAuth={isAuth}
        isFollowing={isFollowing}
        onFollow={handleFollow}
      />
      <div className="favoritesBox">
        <ProfileFavorites genres={genres} reviews={reviews} />
        <ProfileFollowings users={favoriteUsers} />
      </div>
      <ProfileReviews reviews={reviews} />
    </div>
  );
}
