import { useNavigate } from "react-router-dom";
import { ActiveStar, NonActiveStar } from "../../icons/Icons";
import type { Review } from "../../pages/ProfilePage";

export const ProfileReviews = ({ reviews }: { reviews: Review[] }) => {
  const navigate = useNavigate();

  return (
    <div className="userReviews flex-column">
      <p className="titleText">Рецензии</p>
      <div className="infoBox flex-column">
        {reviews.length ? (
          reviews.slice().reverse().map(r => (
            <div className="reviewCard" key={r._id}>
              {r.film?.poster && <img className="filmPoster" src={r.film.poster} alt={r.film.title} />}
              <div className="reviewAllInfo flex-column">
                <div className="headingBox flex-between">
                  <div className="reviewInfo flex-center">
                    <p className="titleText">{r.film.title} ({r.film.year})</p>
                    <span></span>
                    <div className="stars flex-center">
                      {Array.from({ length: 10 }).map((_, i) =>
                        i < r.rating ? <ActiveStar key={i} /> : <NonActiveStar key={i} />
                      )}
                    </div>
                  </div>
                  <button className="goToReviewButton flex-center" onClick={() => navigate(`/review/${r._id}`)}>
                    Читать подробно...
                  </button>
                </div>
                <p className="reviewText">{r.text}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="nullMessage">У пользователя нет рецензий</p>
        )}
      </div>
    </div>
  );
};
