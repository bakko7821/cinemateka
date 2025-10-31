import { useEffect, useState } from "react";
import type { User } from "../../pages/ProfilePage";
import axios from "axios";
import "../../styles/Home.css";
import { useNavigate } from "react-router-dom";

interface Review {
  _id: string;
  filmId: string;
  text: string;
  rating: number;
  createdAt: string;
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

interface ReviewResponse {
  review: Review;
  author: Author;
}

export const RandomRecomendedReviews = () => {
  const [data, setData] = useState<ReviewResponse[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

    useEffect(() => {
        axios
            .get<User[]>("http://localhost:5000/users/")
            .then(res => {
            setUsers(res.data);
            })
            .catch(() => console.log("Ошибка при загрузке пользователей"));
    }, []);

    useEffect(() => {
        if (users.length === 0) return;

        const fetchReviewsWithFilms = async () => {
            const allReviews: ReviewResponse[] = [];

            for (const user of users) {
                if (user.reviews && user.reviews.length > 0) {
                    for (const review of user.reviews) {
                        let film: Film | null = null;
                        try {
                            const res = await axios.get<Film>(`http://localhost:5000/films/${review.filmId}`);
                            film = res.data;
                        } catch {
                            console.log(`Ошибка при загрузке фильма ${review.filmId}`);
                        }

                        allReviews.push({
                            review: { ...review, film },
                            author: {
                                _id: user._id,
                                firstname: user.firstname,
                                lastname: user.lastname,
                                username: user.username,
                                image: user.image
                            }
                        });
                    }
                }
            }

            // случайные 10
            const getRandomItems = <T,>(arr: T[], count: number) => {
                const array = [...arr];
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array.slice(0, count);
            };

            setData(getRandomItems(allReviews, 10));
        };

        fetchReviewsWithFilms();
    }, [users]);


  return (
    <div className="randomReviewsList flex g8">
      <div className="randomReviewsListTrack">
        {data.map(item => (
          <div className="reviewCard flex-column g8" key={item.review._id} onClick={() => navigate(`/review/${item.review._id}`)}>
            {item.review.film?.poster && <img className="backgroundPoster" src={item.review.film.poster} alt={item.review.film.title} />}
            <span className="backgroundImage"></span>
            <p className="userReview">{item.review.text}</p>
            <div className="userInfo flex g8">
                {item.author.image ? (
                    <img className="userAvatar" src={`http://localhost:5000${item.author.image}`} alt="avatar" />
                ) : (
                    <div className="userAvatar flex-center">
                        <p>{item.author.username.charAt(0)}</p>
                    </div>
                )}
                <span></span>
                <div className="userText flex-center g8">
                    <p className="fullname">{item.author.firstname} {item.author.lastname}</p>
                    <span></span>
                    <p className="username">@{item.author.username}</p>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
