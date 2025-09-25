import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // исправил импорт
import "../styles/Header.css";
import { useNavigate } from "react-router-dom";
import NavMenu from "./NavMenu";

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
      <img src="/images/logo.svg" alt="logo" onClick={() => navigate("/")} />
      {isAuth ? (
        <div className="userNavBox flex-center">
          <div className="searchBox flex-center">
            <img src="/images/search.svg" alt="search" />
            <input type="text" placeholder="Поиск" />
          </div>
          <button
            className={`userProfileButton flex-center ${menuOpen ? "active" : ""}`}
            onClick={() => setMenuOpen(prev => !prev)}
          >
            <img src="/images/profile.svg" alt="profile" />
          </button>
          {menuOpen && <NavMenu onClose={() => setMenuOpen(false)} />}
        </div>
      ) : (
        <div className="signInBox flex-center">
          <button className="signInButton" onClick={() => navigate("/login")}>Sign In</button>
          <button className="registerButton" onClick={() => navigate("/register")}>Registration</button>
        </div>
      )}
    </div>
  );
}

export default Header;
