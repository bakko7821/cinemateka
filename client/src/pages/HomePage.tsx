import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Header } from "../components/HomePage/HeaderHomePage";
import { Advantages } from "../components/HomePage/AdvantagesHomePage";
import { RollFilms } from "../components/HomePage/RollFilmsHomePage";
import { RandomRecomendedReviews } from "../components/HomePage/RandomRecomendedReviews";

interface JwtPayload {
  id: string;
  exp: number;
}

export const HomePage = () => {
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
        <div className="page flex-column g16">
        {isAuth ? (
            <RandomRecomendedReviews />
        ) : (
            <div className="homePage flex-column flex-center">
                <Header />
                <Advantages />
                <RollFilms />
            </div>
        )}
        </div>
    )
}