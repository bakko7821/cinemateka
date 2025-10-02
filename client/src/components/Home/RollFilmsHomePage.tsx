import { useEffect, useState, type JSX } from "react";

interface Movie {
  id: number;
  name: string;
  year: number;
  description?: string;
  poster?: {
    url: string;
    previewUrl: string;
  };
}

export default function RollFilms(): JSX.Element {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        fetch("http://localhost:5000/api/get-random")
        .then((res) => {
            if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
            return res.json();
        })
        .then((data: Movie[]) => {
            setMovies(data);
            setLoading(false);
        })
        .catch((err) => {
            console.error("Ошибка при загрузке фильмов:", err);
            setError("Не удалось загрузить фильмы");
            setLoading(false);
        });
    }, []);

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>{error}</p>;
    
    return (
        <div className="rollFilmsHomePageBox flex-column flex-center">
            <div className="filmsBox">
            {movies.map(movie => (
                <div className="movieCard" key={movie?.id}>
                    {movie.poster?.url && (
                    <img
                        className="filmPoster"
                        src={movie.poster?.url}
                        alt={movie.name}
                    />
                    )}
                </div>
            ))}
            </div>
            <div className="buttonsBox">
                <button className="">
                    <img src="../../../public/images/dice.svg" alt="" />
                    Вращать колесо
                </button>
                <button className="">
                    <img src="../../../public/images/note2.svg" alt="" />
                    Составить свою подборку
                </button>
            </div>
        </div>
    )
}