import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Colors {
  mainColor: string;
  mainHoverColor: string;
}

interface ThemeColors {
  backgroundColor: string;
  backgroundCardColor: string;
  textColor: string;
}

export default function ChangeTheme() {
    const [isSubscribe, setIsSubscribe] = useState(true); 
    const navigate = useNavigate()

    const colors = [
        {id: "d65c5e", colors:{mainColor: "#D65C5E", mainHoverColor: "#db6f71" } , name: "red"},
        {id: "d6955c", colors:{mainColor: "#d6955c", mainHoverColor: "#dba16f" }, name: "orange"},
        {id: "d6d25c", colors:{mainColor: "#d6d25c", mainHoverColor: "#dbd76f" }, name: "yellow"},
        {id: "5cd66a", colors:{mainColor: "#5cd66a", mainHoverColor: "#6fdb7c" }, name: "green"},
        {id: "5cbcd6", colors:{mainColor: "#5cbcd6", mainHoverColor: "#6fc4db" }, name: "sky"},
        {id: "4b3bda", colors:{mainColor: "#4b3bda", mainHoverColor: "#6052de" }, name: "blue"},
        {id: "6c5cd6", colors:{mainColor: "#6c5cd6", mainHoverColor: "#7d6fdb" }, name: "purple"},
        {id: "d65cc6", colors:{mainColor: "#d65cc6", mainHoverColor: "#db6fcd" }, name: "pink"},
    ];

    const themes = [
        {
            id: "1b1e23",
            colors: { backgroundColor: "#1B1E23", backgroundCardColor: "#242632", textColor: "#FFFFFF" },
            name: "dark",
            text: "Night",
            icon: "../../public/images/moon.svg",
        },
        {
            id: "ffffff",
            colors: { backgroundColor: "#FFFFFF", backgroundCardColor: "#e9e9e9", textColor: "#1B1E23" },
            name: "white",
            text: "Day",
            icon: "../../public/images/sun.svg",
        }
    ]

    function peakColor(color: Colors) {
        document.documentElement.style.setProperty("--main-color", color.mainColor);
        document.documentElement.style.setProperty("--main-hover-color", color.mainHoverColor);

        localStorage.setItem("mainColors", JSON.stringify(color));
    }

    function changeTheme(themes: ThemeColors) {
        document.documentElement.style.setProperty("--background-color", themes.backgroundColor);
        document.documentElement.style.setProperty("--background-card-color", themes.backgroundCardColor);
        document.documentElement.style.setProperty("--text-color", themes.textColor);

        localStorage.setItem("themeColors", JSON.stringify(themes));
    }

    return (
        <div className="changeThemeBox flex-column">
            <div className="titleText">
              <img src="../../public/images/settings.svg" alt="" />
              <p>Цветовая тема</p>
            </div>
            <div className="changeThemeInfo flex-column">
                {isSubscribe ? (
                    <div className="nonSubcscribeBox" style={{ display: "none"}}></div>
                ) : (
                    <div className="nonSubcscribeBox flex-column">
                        <p className="nonSubcscribeText">Изменение темы доступно только по подписке</p>
                        <button className="goToSubscribePageButton" onClick={() => navigate("/subscribe")}>Ознакомиться с условиями подписки</button>
                    </div>
                )}
                <div className="peakMainColorBox flex-column">
                    <p className="titleText">Основной цвет</p>
                    <div className="colorsBox">
                        {Array.isArray(colors) && colors.length > 0 ? (
                            colors.map(color => (
                                <div 
                                className="color" 
                                key={color.id} 
                                onClick={() => peakColor(color.colors)} 
                                style={{ backgroundColor: color.colors.mainColor }}></div>
                            ))
                        ) : (
                            <p className="nullMessage">Не удалось загрузить цвета...</p>
                        )}
                    </div>
                </div>
                <div className="peakThemeColorBox flex-column">
                    <p className="titleText">Акцентная тема</p>
                    <div className="themeBox">
                        {Array.isArray(themes) && themes.length > 0 ? (
                            themes.map(theme => (
                                <div 
                                    className="theme" 
                                    key={theme.id} 
                                    onClick={() => changeTheme(theme.colors)}
                                    style={{ backgroundColor: theme.colors.backgroundColor }}>

                                    <img src={theme.icon} alt="" />
                                    <p style={{ color: theme.colors.textColor}}>{theme.text}</p>
                                </div>
                            ))
                        ) : (
                            <p className="nullMessage">Не удалось загрузить темы...</p>
                        )}

                    </div>
                </div>
            </div>
        </div>
    )
}