export const Advantages = () => {
    return (
        <div className="advantagesHomePageBox flex-column flex-center">
            <p className="headingText">Ключевые преимущества</p>
            <div className="cardBox flex-center">
                <div className="card flex-column">
                    <img className="cardImage" src="#" alt="#" />
                    <div className="textBoxCard">
                        <img src="../../../public/images/Memo.svg" alt="" />
                        <p>Личные списки фильмов</p>
                    </div>
                </div>
                <div className="card flex-column">
                    <img className="cardImage" src="#" alt="#" />
                    <div className="textBoxCard">
                        <img src="../../../public/images/Speech Balloon.svg" alt="" />
                        <p>Честные рецензии</p>
                    </div>
                </div>
                <div className="card flex-column">
                    <img className="cardImage" src="#" alt="#" />
                    <div className="textBoxCard">
                        <img src="../../../public/images/Alarm Clock.svg" alt="" />
                        <p>Экономия времени</p>
                    </div>
                </div>
                <div className="card flex-column">
                    <img className="cardImage" src="#" alt="#" />
                    <div className="textBoxCard">
                        <img src="../../../public/images/Busts In Silhouette.svg" alt="" />
                        <p>Рекомендации от похожих зрителей</p>
                    </div>
                </div>
            </div>
        </div>
    )
}