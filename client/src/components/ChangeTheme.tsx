import { useState } from "react";

export default function ChangeTheme() {
    const [isSubscribe, setIsSubscribe] = useState(false); 
    
    const colors = [
        {id: "d65c5e", color: "#D65C5E", name: "red"},
        {id: "d6955c", color: "#D6955C", name: "orange"},
        {id: "d6d25c", color: "#D6D25C", name: "yellow"},
        {id: "5cd66a", color: "#5CD66A", name: "green"},
        {id: "5cbcd6", color: "#5CBCD6", name: "sky"},
        {id: "4b3bda", color: "#4B3BDA", name: "blue"},
        {id: "6c5cd6", color: "#6C5CD6", name: "purple"},
        {id: "d65cc6", color: "#D65CC6", name: "pink"},
    ];

    const themes = [
        {
            id: "1b1e23",
            colors: { backgroundColor: "#1B1E23", textColor: "#FFFFFF" },
            name: "dark",
            text: "Night",
            icon: "../../public/images/moon.svg",
        },
        {
            id: "ffffff",
            colors: { backgroundColor: "#FFFFFF", textColor: "#1B1E23" },
            name: "white",
            text: "Day",
            icon: "../../public/images/sun.svg",
        }
    ]

    function peakColor(id: string) {
        console.log(id)
    }

    function changeTheme(id: string) {
        console.log(id)
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
                        <button className="goToSubscribePageButton">Ознакомиться с условиями подписки</button>
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
                                onClick={() => peakColor(color.id)} 
                                style={{ backgroundColor: color.color }}></div>
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
                                    onClick={() => changeTheme(theme.id)}
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