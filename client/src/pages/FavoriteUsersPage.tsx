import { useEffect, useState, type JSX } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LeftArrowIcon } from "../icons/Icons";

interface IUser {
  _id: string;
  firstname: string;
  lastname: string;
  username: string;
  image?: string;
}

export default function FavoriteUsersPage() : JSX.Element {
    const {id} = useParams()
    const navigate = useNavigate()
    const [favoriteUsers, setFavoriteUsers] = useState<IUser[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

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
            <div className="leftBox">
                <button className="backButton" onClick={() => navigate(-1)}>
                <LeftArrowIcon />
                </button>
                <p className="titleText">Любимые пользователи</p>
            </div>
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
        </>
    )
}