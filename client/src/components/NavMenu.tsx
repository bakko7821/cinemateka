import { useEffect, useRef, useState } from "react";
import '../styles/Header.css'
import { useNavigate } from "react-router-dom";

interface NavMenuProps {
  onClose: () => void;
}

export default function NavMenu({ onClose }: NavMenuProps) {
    const authUser = localStorage.getItem("authUser")
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const navigate = useNavigate()

    useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
        }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
    }, [onClose]);

    return (
        <>
        <div ref={menuRef} className="navMenuBox flex-column">
            <div className="subscribe link" onClick={() => navigate("/subscribe")}>
                <img src="../../public/images/cron.svg" alt="" />
                <p>Subscribe</p>
                <img src="../../public/images/cron.svg" alt="" />
            </div>
            <nav className="flex-column">
                <div className="addFilm link" onClick={() => navigate("/add")}>
                    <img src="../../public/images/add.svg" alt="" />
                    <p>Add Film</p>
                </div>
                <div className="profile link" onClick={() => authUser && navigate(`/profile/${JSON.parse(authUser)._id}`)}>
                    <img src="../../public/images/profile2.svg" alt="" />
                    <p>Profile</p>
                </div>
                <div className="favorites link" onClick={() => navigate("/favorites")}>
                    <img src="../../public/images/two-people.svg" alt="" />
                    <p>Favorite Users</p>
                </div>
                <div className="shareProfile link" onClick={() => {
                    const authUserString = localStorage.getItem("authUser");
                    const authUser = authUserString ? JSON.parse(authUserString) : null;
                    navigator.clipboard.writeText(`http://localhost:5173/profile/${authUser?._id}`)
                        .then(() => {
                            setMessage("Ссылка на ваш профиль скопированна!")
                        })
                        .catch(err => {
                            console.log(err)
                            setError("Не удалось скопировать ссылку!") 
                        });
                }}>
                    <img src="../../public/images/share.svg" alt="" />
                    <p>Share Profile</p>
                </div>
                <div className="logOut link" onClick={() => {
                    localStorage.removeItem("token");
                    window.location.reload();
                }}>
                    <img src="../../public/images/log-out.svg" alt="" />
                    <p>Log Out</p>
                </div>
            </nav>
        </div>
        {error && <div className="notificationMessage error flex-center">
              <img src="../../public/images/error.svg" alt="" />
              <p>{error}</p>
          </div>}
          {message && <div className="notificationMessage message flex-center">
              <img src="../../public/images/successful.svg" alt="" />
              <p>{message}</p>
          </div>}
        </>
    );
}
