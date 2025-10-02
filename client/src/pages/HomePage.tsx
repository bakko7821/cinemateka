import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Header from "../components/Home/HeaderHomePage";
import Advantages from "../components/Home/AdvantagesHomePage";
import RollFilms from "../components/Home/RollFilmsHomePage";
import UserAuth from "../components/Home/UserAuthHomePage";

interface JwtPayload {
  id: string;
  exp: number;
}

function HomePage() {
    const [isAuth, setIsAuth] = useState(false);
    
        useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
            const decoded = jwtDecode<JwtPayload>(token);
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
        <>
        {isAuth ? (
            <UserAuth />
        ) : (
            <div className="homePage flex-column flex-center">
                <Header />
                <Advantages />
                <RollFilms />
            </div>
        )}
        </>
    )
}

export default HomePage