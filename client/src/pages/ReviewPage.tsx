import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ActiveStar, LeftArrowIcon, NonActiveStar } from "../icons/Icons";
import '../styles/ReviewPage.css'

interface ReviewResponse {
  review: Review;
  author: Author;
}

interface Review {
  _id: string;
  filmId: string;
  text: string;
  rating: number;
  createdAt: Date;
  film: Film | null;
}

interface Film {
  _id: string;
  kpId: string;
  title: string;
  poster: string;
  year: number;
  genres?: string[];
}

interface Author {
  _id: string;
  firstname: string;
  lastname: string;
  username: string;
  image: string;
}

export const ReviewPage = () => {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<ReviewResponse  | null>(null)
    const [userAvatar, setUserAvatar] = useState<string | null>(null);
    const navigate = useNavigate()

    useEffect(()=> {
        if(!id) return

        const fetchReviews = async () => {
            try {
                const res = await axios.get<ReviewResponse>(`http://localhost:5000/users/review/${id}`)
                setData(res.data)
            } catch (err) {
                console.log("Ошибка при загрузке рецензий:", err)
            }
        }

        fetchReviews()
    }, [id])

    useEffect(() => {
        setUserAvatar(data?.author.image ? data.author.image : null);
    }, [data?.author]);

    return (
        <div className="page flex-column g16">
            <div className="headingPageInfo">
                <button className="backButton" onClick={() => navigate(-1)}>
                    <LeftArrowIcon />
                </button> 
                <p className="titleText">Рецензия на фильм <span>{data?.review.film?.title}</span> от {data?.author.username}</p>
            </div>
            
            <div className="reviewPage">
                <div className="choosedFilmInfoBox flex-column" onClick={() => window.open(`https://www.kinopoisk.ru/film/${data?.review.film?.kpId}`)}>
                    <p className="titleText">Информация о фильме:</p>
                    {data?.review.film && (
                        <div className="filmInfo">
                        {data?.review.film.poster && <img src={data?.review.film.poster} alt="poster" />}
                        <div className="filmTextInfoBox flex-column">
                            <div className="titleBox">
                            <p className="secondText">Название:</p>
                            <p className="titleText">{data?.review.film.title} {data?.review.film.year ? `(${data?.review.film.year})` : ""}</p>
                            </div>
                            <div className="genresBox flex-column">
                            <p className="secondText">Жанры:</p>
                            <div className="genresList">
                                {data?.review.film.genres?.map((genre, index) => (
                                <div key={index} className="genreCard">{genre}</div>
                                ))}
                            </div>
                            </div>
                        </div>
                        </div>
                    )}
                </div>
                <div className="reviewInfoBox">
                    <div className="headingBox">
                        <div className="userInfo flex-center" onClick={() => navigate(`/profile/${data?.author._id}`)}>
                            {userAvatar ? (
                                <img className="userAvatar"
                                    src={`http://localhost:5000${data?.author.image}`}
                                    alt="avatar" />
                            ) : (
                                <div className="userAvatar flex-center">
                                    <p>{data?.author.username.charAt(0)}</p>
                                </div>
                            )}
                            <div className="textBox">
                                <p className="fullNameUser">{data?.author.firstname} {data?.author.lastname}</p>
                                <p className="userName">@{data?.author.username}</p>
                            </div>
                        </div>
                        <span></span>
                        <div className="stars flex-center">
                        {Array.from({ length: 10 }).map((_, index) =>
                            index < (data?.review.rating ?? 0) ? (
                            <ActiveStar key={index}/>
                            ) : (
                            <NonActiveStar key={index}/>
                            )
                        )}
                        </div>
                    </div>
                    <p className="reviewText">{data?.review.text}</p>
                </div>
            </div>
        </div>
    )
}