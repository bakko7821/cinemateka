import type { JSX } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Home.css"

export default function Header(): JSX.Element {
    const navigate = useNavigate();

    return (
        <div className="headerHomePageBox flex-column">
            <p className="headingText">Больше никогда не трать время на скучные фильмы</p>
            <p className="secondText">Создавай подборки, пиши рецензии, выбирай кино по отзывам настоящих людей</p>
            <button className="useAuthButton" onClick={() => navigate("/register")}>Попробовать бесплатно</button>
        </div>
    )
}