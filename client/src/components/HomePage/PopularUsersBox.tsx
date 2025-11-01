import { useEffect, useState } from "react";
import axios from "axios";
import { User } from "../../pages/ProfilePage";
import { useNavigate } from "react-router-dom";

export const PopularUsersBox = () => {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get<User[]>("http://localhost:5000/users");
        const sorted = res.data
          .sort((a, b) => (b.followersCount || 0) - (a.followersCount || 0))
          .slice(0, 20); // берем только первых 20
        setUsers(sorted);
      } catch (err) {
        console.error("Ошибка при загрузке пользователей:", err);
      }
    };

    fetchUsers();
  }, []);

  const firstTrack = users.slice(0, 10);
  const secondTrack = users.slice(10, 20);

  return (
    <div className="popularUsersBox flex-column">
      <div className="popularUsersBoxTrackFirst flex g8">
        {firstTrack.map((user) => (
          <div key={user._id} className="popularUserCard flex g8" onClick={() => navigate(`/profile/${user._id}`)}>
            {user.image ? (
                    <img className="userAvatar" src={`http://localhost:5000${user.image}`} alt="avatar" />
                ) : (
                    <div className="userAvatar flex-center">
                        <p>{user.username.charAt(0)}</p>
                    </div>
                )}
            <div className="textBox flex-column">
                <p className="fullname">{user.firstname} {user.lastname}</p>
                <div className="bottomBox flex g8">
                    <p className="username">@{user.username}</p>
                    <span></span>
                    <p className="followersCount">{user.followersCount} followers</p>
                </div>
            </div>
          </div>
        ))}
      </div>
      <div className="popularUsersBoxTrackSecond flex g8">
        {secondTrack.map((user) => (
          <div key={user._id} className="popularUserCard flex g8" onClick={() => navigate(`/profile/${user._id}`)}>
            {user.image ? (
                    <img className="userAvatar" src={`http://localhost:5000${user.image}`} alt="avatar" />
                ) : (
                    <div className="userAvatar flex-center">
                        <p>{user.username.charAt(0)}</p>
                    </div>
                )}
            <div className="textBox flex-column">
                <p className="fullname">{user.firstname} {user.lastname}</p>
                <div className="bottomBox flex g8">
                    <p className="username">@{user.username}</p>
                    <span></span>
                    <p className="followersCount">{user.followersCount} followers</p>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
