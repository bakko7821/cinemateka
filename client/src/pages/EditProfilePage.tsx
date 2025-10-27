import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ChangeTheme from "../components/ChangeTheme";
import "../styles/EditProfile.css";
import { EditProfileHeader } from "../components/EditProfilePage/EditProfileHeader";
import { EditProfileForm } from "../components/EditProfilePage/EditProfileForm";

export interface User {
  _id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  image: string;
}

export const EditProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState<boolean>(false);

  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const navigate = useNavigate();

  // проверка авторизации
  useEffect(() => {
    const authUser = localStorage.getItem("authUser");
    if (authUser && id) {
      try {
        const parsed = JSON.parse(authUser) as { _id: string };
        setIsAuth(parsed._id === id);
      } catch {
        setIsAuth(false);
      }
    } else {
      setIsAuth(false);
    }
  }, [id]);

  // загрузка данных пользователя
  useEffect(() => {
    if (!id) return;
    axios
      .get<User>(`http://localhost:5000/users/${id}`)
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  // синхронизация полей
  useEffect(() => {
    setFirstname(user?.firstname ?? "");
    setLastname(user?.lastname ?? "");
    setUsername(user?.username ?? "");
  }, [user]);

  async function handleSave() {
    try {
      if (!user) return;

      const formData = new FormData();
      formData.append("firstname", firstname);
      formData.append("lastname", lastname);
      formData.append("username", username);
      if (avatarFile) formData.append("avatar", avatarFile);

      await axios.put(`http://localhost:5000/users/${user._id}/set`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate(`/profile/${user._id}`);
    } catch (err) {
      console.error("❌ Ошибка при обновлении:", err);
    }
  }

  return (
    <>
      <EditProfileHeader username={user?.username} onSave={handleSave} />

      <div className="editProfilePage">
        {isAuth ? (
          <>
            <EditProfileForm
              user={user}
              firstname={firstname}
              lastname={lastname}
              username={username}
              userAvatar={userAvatar}
              avatarFile={avatarFile}
              setFirstname={setFirstname}
              setLastname={setLastname}
              setUsername={setUsername}
              setAvatarFile={setAvatarFile}
              setUserAvatar={setUserAvatar}
            />
            <ChangeTheme />
          </>
        ) : (
          <p>Вы не можете редактировать чужой профиль</p>
        )}
      </div>
    </>
  );
};
