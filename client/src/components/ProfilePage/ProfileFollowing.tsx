import { useNavigate } from "react-router-dom";
import type { IUser } from "../../pages/ProfilePage";


export const ProfileFollowings = ({ users }: { users: IUser[] }) => {
  const navigate = useNavigate();

  return (
    <div className="favoriteUsersBox flex-column">
      <p className="titleText">Подписки</p>
      <div className="usersCardsBox flex-column">
        {users.length ? (
          users.map(u => (
            <div key={u._id} className="userCard" onClick={() => navigate(`/profile/${u._id}`)}>
              {u.image ? (
                <img className="userAvatar" src={`http://localhost:5000${u.image}`} alt="avatar" />
              ) : (
                <div className="userAvatar flex-center"><p>{u.username.charAt(0)}</p></div>
              )}
              <div className="textBox flex-column">
                <p className="fullNameUser">{u.firstname} {u.lastname}</p>
                <p className="userName">@{u.username}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="nullMessage">Пользователь никого не отслеживает</p>
        )}
      </div>
    </div>
  );
};
