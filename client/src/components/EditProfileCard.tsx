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

export default function EditProfileCard(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [isAuth, setIsAuth] = useState<boolean>(false);

  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [username, setUsername] = useState<string>("");
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

  // загрузка пользователя
  useEffect(() => {
    if (!id) return;

    axios
      .get<User>(`http://localhost:5000/users/${id}`)
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  // синхронизация аватара
  useEffect(() => {
    setUserAvatar(user?.image ?? null);
  }, [user]);

  // синхронизация полей
  useEffect(() => {
    setFirstname(user?.firstname ?? "");
    setLastname(user?.lastname ?? "");
    setUsername(user?.username ?? "");
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);

      const reader = new FileReader();
      reader.onload = () =>
        setUserAvatar(typeof reader.result === "string" ? reader.result : null);
      reader.readAsDataURL(file);
    }
  };

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
      <div className="headingPageInfo flex-between">
        <div className="leftBox flex-center">
          <button className="backButton" onClick={() => navigate(-1)}>
            <img src="../../public/images/left-arrow.svg" alt="" />
          </button>
          <p className="titleText">Изменение профиля {user?.username}</p>
        </div>
        <button onClick={handleSave} className="saveChangesButton flex-center">
          <img src="../../public/images/done.svg" alt="" />
          Сохранить изменения
        </button>
      </div>
      <div className="editProfilePage">
        {isAuth ? (
          <div className="editProfileBox flex-center">
            <div className="userInfo flex-center">
                <div className="editUserAvatarBox flex-column">
                    {userAvatar ? (
                    <img
                        className="userAvatar"
                        src={
                        avatarFile
                            ? userAvatar
                            : `http://localhost:5000${user?.image}`
                        }
                        alt="avatar"
                    />
                    ) : (
                    <div className="userAvatar flex-center">
                        <p>{user?.username.charAt(0)}</p>
                    </div>
                    )}
                    <form method="post" onSubmit={(e) => e.preventDefault()}>
                    <label className="input-file">
                        <input
                        type="file"
                        name="file"
                        onChange={handleFileChange}
                        />
                        <span className="input-file-btn">
                        <img src="../../public/images/upload.svg" alt="" />
                        </span>
                    </label>
                    </form>
                </div>
                </div>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="infoForm flex-column"
            >
              <div className="fullNameBox flex-center">
                <div className="floating-input">
                  <input
                    type="text"
                    id="firstname"
                    name="firstname"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    placeholder="Имя"
                    required
                  />
                  <label htmlFor="firstname">Имя</label>
                </div>
                <div className="floating-input">
                  <input
                    type="text"
                    id="lastname"
                    name="lastname"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    placeholder="Фамилия"
                    required
                  />
                  <label htmlFor="lastname">Фамилия</label>
                </div>
              </div>
              
              <div className="floating-input">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Имя пользователя"
                  required
                />
                <label htmlFor="username">Имя пользователя</label>
              </div>
            </form>
          </div>
        ) : (
          <p>Вы не можете редактировать чужой профиль</p>
        )}
      </div>
    </>
  );
}
