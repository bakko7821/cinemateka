import { useState } from "react";
import { ActiveStar, NonActiveStar } from "../icons/Icons";

export default function RatingSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (rating: number) => void;
}) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  return (
    <div className="ratingBox flex-center">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => {
        const isActive = hoverValue !== null ? num <= hoverValue : num <= value;

        return (
          <button
            key={num}
            className="ratingButton"
            onClick={() => onChange(num)}
            onMouseEnter={() => setHoverValue(num)}
            onMouseLeave={() => setHoverValue(null)}
          >
            {isActive ? <ActiveStar /> : <NonActiveStar />}
          </button>
        );
      })}
    </div>
  );
}
