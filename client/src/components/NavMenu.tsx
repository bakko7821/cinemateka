import { useEffect, useRef, useState } from "react";
import '../styles/Header.css'
import { useNavigate } from "react-router-dom";
import { BrushIcon, CrownIcon, ErrorIcon, LogOutIcon, ShareIcon, SuccessIcon, UserIcon, UsersIcon } from "../icons/Icons";

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
                <CrownIcon />
                <p>Subscribe</p>
                <CrownIcon />
            </div>
            <nav className="flex-column">
                <div className="addFilm link" onClick={() => navigate("/add")}>
                    <BrushIcon />
                    <p>Add Film</p>
                </div>
                <div className="profile link" onClick={() => authUser && navigate(`/profile/${JSON.parse(authUser)._id}`)}>
                    <UserIcon />
                    <p>Profile</p>
                </div>
                <div className="favorites link" onClick={() => navigate("/favorites")}>
                    <UsersIcon />
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
                    <ShareIcon />
                    <p>Share Profile</p>
                </div>
                <div className="logOut link" onClick={() => {
                    localStorage.removeItem("token");
                    window.location.reload();
                }}>
                    <LogOutIcon />
                    <p>Log Out</p>
                </div>
            </nav>
        </div>
        {error && <div className="notificationMessage error flex-center">
              <ErrorIcon />
              <p>{error}</p>
          </div>}
          {message && <div className="notificationMessage message flex-center">
              <SuccessIcon />
              <p>{message}</p>
          </div>}
        </>
    );
}
