import { useEffect, useRef } from "react";
import '../styles/Header.css'

interface NavMenuProps {
  onClose: () => void;
}

export default function NavMenu({ onClose }: NavMenuProps) {
  const menuRef = useRef<HTMLDivElement | null>(null);

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
    <div ref={menuRef} className="navMenuBox flex-column">
        <div className="subscribe link">
            <img src="../../public/images/cron.svg" alt="" />
            <p>Subscribe</p>
            <img src="../../public/images/cron.svg" alt="" />
        </div>
        <nav className="flex-column">
            <div className="addFilm link">
                <img src="../../public/images/add.svg" alt="" />
                <p>Add Film</p>
            </div>
            <div className="profile link">
                <img src="../../public/images/profile2.svg" alt="" />
                <p>Profile</p>
            </div>
            <div className="settings link">
                <img src="../../public/images/settings.svg" alt="" />
                <p>Settings</p>
            </div>
            <div className="shareProfile link">
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
  );
}
