import { useState } from "react";

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
        // определяем, активная ли картинка
        const isActive = hoverValue !== null ? num <= hoverValue : num <= value;

        return (
          <button
            key={num}
            className="ratingButton"
            onClick={() => onChange(num)}
            onMouseEnter={() => setHoverValue(num)}
            onMouseLeave={() => setHoverValue(null)}
          >
            <img
              src={isActive ? "../../public/images/activeStar.svg" : "../../public/images/nonActiveStar.svg"}
              alt={`Оценка ${num}`}
              width={32}
              height={32}
            />
          </button>
        );
      })}
    </div>
  );
}
