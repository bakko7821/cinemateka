import { EmojiNormalIcon, UploadIcon } from "../../icons/Icons";
import { useEffect } from "react";
import type { User } from "../../pages/EditProfilePage";

interface EditProfileFormProps {
  user: User | null;
  firstname: string;
  lastname: string;
  username: string;
  userAvatar: string | null;
  avatarFile: File | null;
  setFirstname: (val: string) => void;
  setLastname: (val: string) => void;
  setUsername: (val: string) => void;
  setAvatarFile: (file: File | null) => void;
  setUserAvatar: (url: string | null) => void;
}

export const EditProfileForm = ({
  user,
  firstname,
  lastname,
  username,
  userAvatar,
  avatarFile,
  setFirstname,
  setLastname,
  setUsername,
  setAvatarFile,
  setUserAvatar,
}: EditProfileFormProps) => {
  // обработка загрузки аватара
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

  // сброс изображения при смене пользователя
  useEffect(() => {
    setUserAvatar(user?.image ?? null);
  }, [user, setUserAvatar]);

  return (
    <div className="editProfileBox flex-column">
      <div className="titleText">
        <EmojiNormalIcon />
        <p>Информация о себе</p>
      </div>

      <div className="editUserBox flex-center">
        <div className="userInfo flex-center">
          <div className="editUserAvatarBox flex-column">
            {userAvatar ? (
              <img
                className="userAvatar"
                src={avatarFile ? userAvatar : `http://localhost:5000${user?.image}`}
                alt="avatar"
              />
            ) : (
              <div className="userAvatar flex-center">
                <p>{user?.username.charAt(0)}</p>
              </div>
            )}

            <form method="post" onSubmit={(e) => e.preventDefault()}>
              <label className="input-file">
                <input type="file" name="file" onChange={handleFileChange} />
                <span className="input-file-btn">
                  <UploadIcon />
                </span>
              </label>
            </form>
          </div>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="infoForm flex-column">
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
    </div>
  );
};
