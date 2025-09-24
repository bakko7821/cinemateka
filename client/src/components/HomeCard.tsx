import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  id: string;
  exp: number;
}

function HomeCard() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        // Проверяем срок действия
        if (decoded.exp * 1000 > Date.now()) {
          setIsAuth(true);
        } else {
          localStorage.removeItem("token"); // токен просрочен
        }
      } catch {
        setIsAuth(false);
      }
    }
  }, []);

  return (
    <div>
      {isAuth ? (
        <p>Добро пожаловать! Контент для авторизованных</p>
      ) : (
        <p>Вы не авторизованы. <a href="/login">Войти</a></p>
      )}
    </div>
  );
}

export default HomeCard;
