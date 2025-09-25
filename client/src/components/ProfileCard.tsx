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

export default function ProfileCard() : JSX.Element {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [isAuth, setIsAuth] = useState(false)
    const [userAvatar, setUserAvatar] = useState<string | null>(null);

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

                </div>
            </div>
            <div className="favoriteFilms flex-column">
                <p className="titleText">Любимые фильмы</p>
                <div className="infoBox">

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