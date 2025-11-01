import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Header } from "../components/HomePage/HeaderHomePage";
import { Advantages } from "../components/HomePage/AdvantagesHomePage";
import { RollFilms } from "../components/HomePage/RollFilmsHomePage";
import { RandomRecomendedReviews } from "../components/HomePage/RandomRecomendedReviews";
import { SubscribeInfoBox } from "../components/HomePage/SubscribeInfoBox";
import axios from "axios";
import { BrushIcon } from "../icons/Icons";
import { useNavigate } from "react-router-dom";

interface JwtPayload {
  id: string;
  exp: number;
}

export const HomePage = () => {
    const [isAuth, setIsAuth] = useState(false);
    const [isSubscribe, setIsSubscribe] = useState(false)
    const navigate = useNavigate()
    const authUser = localStorage.getItem("authUser")
    
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

    useEffect(() => {
        if (!authUser) {
            setIsSubscribe(false);
            return;
        }

        try {
            const user = JSON.parse(authUser);

            axios
            .get<{ subscribe: boolean }>(`http://localhost:5000/users/${user._id}`)
            .then((res) => {
                setIsSubscribe(res.data.subscribe);
            })
            .catch((err) => {
                console.error("Ошибка при запросе пользователя:", err);
                setIsSubscribe(false);
            });
        } catch (e) {
            console.error("Ошибка парсинга authUser:", e);
            setIsSubscribe(false);
        }
    }, [authUser]);


    return (
        <div className="page flex-column g32">
            {isAuth ? (
                <>
                    <RandomRecomendedReviews />
                    <div className="tellUsBox flex-center g16">
                        <img src="../../public/images/vecteezy_3d-male-character-sitting-on-a-sofa-and-working-on-a-laptop_24785818.png" alt="" className="maleImage"/>
                        <div className="textBox flex-column g24">
                            <div className="titleText">Что можете рассказать</div>
                            <p className="descriptionText">Посмотрели новый фильм? Расскажите, что вас зацепило — сюжет, актёры, музыка или, может быть, неожиданный финал. Поделитесь своим мнением с другими пользователями: им будет интересно прочитать вашу рецензию, сравнить впечатления и выбрать, стоит ли смотреть этот фильм самому. <br/><br/>Ваш отзыв может помочь кому-то открыть для себя настоящую кинопремию или, наоборот, избежать разочарования.</p>
                            <button className="goToAddReview flex-center g8" onClick={() => navigate("/add")}><BrushIcon /> Написать рецензию</button>
                        </div>
                    </div>
                    {isSubscribe ? (
                        <div className="">У вас уже есть подписка</div>
                    ) : (
                        <SubscribeInfoBox />
                    )}
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