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
        <div className="page flex-column g32">
            {isAuth ? (
                <>
                    <RandomRecomendedReviews />
                    <div className="subscribeBox flex g16">
                        <div className="subcsribeCard kitty flex-between g16">
                            <div className="textBox flex-column g16">
                                <p className="headingTitle">Подписка "Kitty"</p>
                                <ul className="conditionsBox flex-column g8">
                                    <li> - Условие 1</li>
                                    <li> - Условие 2</li>
                                    <li> - Условие 3</li>
                                </ul>
                            </div>
                            <img src="../../public/images/vecteezy_3d-cute-cat-happy-kitten-character_60006772.png" className="subcsribeCardImage" alt="" />
                        </div>
                        <div className="subcsribeCard croco flex-between g16">
                            <div className="textBox flex-column g16">
                                <p className="headingTitle">Подписка "Croco"</p>
                                <ul className="conditionsBox flex-column g8">
                                    <li> - Условие 1</li>
                                    <li> - Условие 2</li>
                                    <li> - Условие 3</li>
                                </ul>
                            </div>
                            <img src="../../public/images/vecteezy_3d-cute-crocodile-character_60006795.png" className="subcsribeCardImage" alt="" />
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <Header />
                    <Advantages />
                    <RollFilms />
                </>
            )}
        </div>
    )
}