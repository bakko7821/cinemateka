import axios from "axios";
import { useEffect, useState, type JSX } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface User {
  _id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  image: string;
}

export default function EditProfileCard() : JSX.Element {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [userAvatar, setUserAvatar] = useState<string | null>(null);
    const [isAuth, setIsAuth] = useState(false)
    
    const navigate = useNavigate()

    useEffect(() => {
        const authUser = localStorage.getItem("authUser")
        setIsAuth(authUser ? JSON.parse(authUser)?._id === id : false);
    })

    useEffect(() => {
        if (!id) return;

        axios
            .get<User>(`http://localhost:5000/users/${id}`)
            .then(res => setUser(res.data))
            .catch(err => console.error(err));
    }, [id]);

    useEffect(() => {
        setUserAvatar(user?.image ? user.image : null);
    }, [user]);

    return (
        <div className="editProfilePage">
            <button className="backButton" onClick={() => navigate(-1)}>
                <img src="../../public/images/left-arrow.svg" alt="" />
            </button> 
            {isAuth ? (
                <div className="editProfileBox flex-column">
                    <div className="userInfo flex-center">
                        {userAvatar ? (
                            <div className="editUserAvatarBox flex-column">
                                <img className="userAvatar"
                                src={`http://localhost:5000${user?.image}`}
                                alt="avatar" />
                            </div>
                        ) : (
                            <div className="editUserAvatarBox flex-column">
                                <div className="userAvatar flex-center">
                                    <p>{user?.username.charAt(0)}</p>
                                </div>
                                <form method="post">
                                    <label className="input-file">
                                        <input type="file" name="file" />
                                        <span className="input-file-btn">
                                            <img src="../../public/images/upload.svg" alt="" />
                                            Выберите файл
                                        </span>           
                                    </label>
                                </form>
                            </div>
                        )}
                        <div className="userTextInfo flex-column">
                            <p className="fullNameUser">{user?.firstname} {user?.lastname}</p>
                            <p className="userName">@{user?.username}</p>
                        </div>    
                    </div>
                    
                </div>
            ) : (
                <p>Вы не можете редактировать чужой профиль</p>
            )}
        </div>
    )
}