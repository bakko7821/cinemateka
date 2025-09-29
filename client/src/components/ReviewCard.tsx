import axios from "axios";
import { useEffect, useState, type JSX } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface Reviews {
    filmId: string;
    text: string;
    rating: number;
    createdAt: Date;
    _id: string;
    film: Film;
}

interface Film {
    _id: string;
    title: string;
    poster: string;
    year: number;
}

export default function ReviewCard() : JSX.Element {
    const { id } = useParams<{ id: string }>();
    const [review, setReview] = useState<Reviews | null>(null)
    const navigate = useNavigate()

    useEffect(()=> {
        if(!id) return

        const fetchReviews = async () => {
            try {
                const res = await axios.get<Reviews>(`http://localhost:5000/users/review/${id}`)
                setReview(res.data)
            } catch (err) {
                console.log("Ошибка при загрузке рецензий:", err)
            }
        }

        fetchReviews()
    }, [id])

    function goToBack() {
        navigate(-1)
    }

    return (
        <>
            <button onClick={() => goToBack()}>Go back</button>
            <div className="reviewCard">
               {review?.text}
               {review?.film.title}
            </div>
        </>
        
    )
}