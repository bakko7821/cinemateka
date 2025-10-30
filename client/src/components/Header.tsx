import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // исправил импорт
import "../styles/Header.css";
import { useNavigate } from "react-router-dom";
import NavMenu from "./NavMenu";
import { EmojiHappyIcon, SearchIcon } from "../icons/Icons";

interface JwtPayload {
  id: string;
  exp: number;
}

function Header() {
  const [isAuth, setIsAuth] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        if (decoded.exp * 1000 > Date.now()) {
          setIsAuth(true);
        } else {
          localStorage.removeItem("token");
        }
      } catch {
        setIsAuth(false);
      }
    }
  }, []);

  return (
    <div className="headerBox flex-between">
      <p className="logo" onClick={() => navigate("/")}>Кинотека</p>
      {isAuth ? (
        <div className="userNavBox flex-center">
          <div className="searchBox flex-center">
            <SearchIcon />
            <input type="text" placeholder="Поиск" />
          </div>
          <button
            className={`userProfileButton flex-center ${menuOpen ? "active" : ""}`}
            onClick={() => setMenuOpen(prev => !prev)}
          >
            <EmojiHappyIcon />
          </button>
          {menuOpen && <NavMenu onClose={() => setMenuOpen(false)} />}
        </div>
      ) : (
        <div className="signInBox flex-center">
          <button className="signInButton" onClick={() => navigate("/auth/login")}>Sign In</button>
          <button className="registerButton" onClick={() => navigate("/auth/register")}>Registration</button>
        </div>
      )}
    </div>
  );
}

export default Header;
