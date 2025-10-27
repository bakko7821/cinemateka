import { DoneIcon, LeftArrowIcon } from "../../icons/Icons";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  username?: string;
  onSave: () => void;
}

export const EditProfileHeader = ({ username, onSave }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="headingPageInfo flex-between">
      <div className="leftBox flex-center">
        <button className="backButton" onClick={() => navigate(-1)}>
          <LeftArrowIcon />
        </button>
        <p className="titleText">Изменение профиля {username}</p>
      </div>
      <button onClick={onSave} className="saveChangesButton flex-center">
        <DoneIcon />
        Сохранить изменения
      </button>
    </div>
  );
};
