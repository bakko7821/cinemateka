import { useNavigate } from "react-router-dom";
import { EditIcon, FollowIcon, GiftIcon, UnFollowIcon } from "../../icons/Icons";
import type { User } from "../../pages/ProfilePage";

interface Props {
  user: User | null;
  isAuth: boolean;
  isFollowing: boolean;
  onFollow: (id?: string) => void;
}

export const ProfileHeader = ({ user, isAuth, isFollowing, onFollow }: Props) => {
  const navigate = useNavigate();
  const avatar = user?.image ? `http://localhost:5000${user.image}` : null;

  return (
    <div className="headingBox flex-between">
      <div className="userInfoBox flex-center">
        {avatar ? (
          <img className="userAvatar" src={avatar} alt="avatar" />
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
            onClick={() => onFollow(user?._id)}
          >
            {isFollowing ? <UnFollowIcon /> : <FollowIcon />}
          </button>
          <button className="giftSubscribeButton flex-center">
            <GiftIcon /> Подарить подписку
          </button>
        </div>
      )}
    </div>
  );
};
