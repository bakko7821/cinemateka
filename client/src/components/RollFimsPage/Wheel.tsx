import { useState } from "react";
import type { FilmData } from "../AddFilmPage/FindFilmComponent";

interface FilmWithChance {
  film: FilmData;
  chance: number;
}

interface WheelProps {
  films: FilmWithChance[];
}

export const Wheel = ({ films }: WheelProps) => {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<FilmWithChance | null>(null);

  const totalChance = films.reduce((sum, f) => sum + f.chance, 0);

  const spin = () => {
    if (spinning || films.length === 0) return;
    setSpinning(true);

    const rand = Math.random() * totalChance;
    let acc = 0;
    let selected: FilmWithChance = films[films.length - 1];
    for (const f of films) {
      acc += f.chance;
      if (rand <= acc) {
        selected = f;
        break;
      }
    }

    const extraSpins = 360 * 5; 
    let angleStart = 0;
    for (const f of films) {
      if (f.film._id === selected.film._id) break;
      angleStart += (f.chance / totalChance) * 360;
    }
    const segmentAngle = (selected.chance / totalChance) * 360;
    const targetRotation = rotation + extraSpins + (360 - (angleStart + segmentAngle / 2));
    setRotation(targetRotation);

    setTimeout(() => {
      setWinner(selected);
      setSpinning(false);
    }, 5000);
  };

  const radius = 150;
  const center = radius;

  let cumulativeAngle = 0;

  const paths = films.map((f, i) => {
    const sliceAngle = (f.chance / totalChance) * 360;
    const startRad = (cumulativeAngle * Math.PI) / 180;
    const endRad = ((cumulativeAngle + sliceAngle) * Math.PI) / 180;

    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    cumulativeAngle += sliceAngle;

    const largeArc = sliceAngle > 180 ? 1 : 0;

    return (
      <g key={f.film._id}>
        <path
          d={`M${center},${center} L${x1},${y1} A${radius},${radius} 0 ${largeArc} 1 ${x2},${y2} Z`}
          fill={`hsl(${(i * 360) / films.length},70%,60%)`}
          stroke="#fff"
          strokeWidth="1"
        />
        <text
          x={center + (radius / 2) * Math.cos((startRad + endRad) / 2)}
          y={center + (radius / 2) * Math.sin((startRad + endRad) / 2)}
          textAnchor="middle"
          alignmentBaseline="middle"
          transform={`rotate(${(startRad + endRad) / 2 * 180/Math.PI - 90}, ${center + (radius / 2) * Math.cos((startRad + endRad) / 2)}, ${center + (radius / 2) * Math.sin((startRad + endRad) / 2)})`}
          style={{ fontSize: 12 }}
        >
          {f.film.title}
        </text>
      </g>
    );
  });

  return (
    <div className="wheelContainer" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg
        width={radius * 2}
        height={radius * 2}
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: spinning ? "transform 5s cubic-bezier(0.33,1,0.68,1)" : "none",
        }}
      >
        {paths}
      </svg>
      <div
        style={{
          position: "relative",
          top: -radius * 2 - 10,
          width: 0,
          height: 0,
          borderLeft: "10px solid transparent",
          borderRight: "10px solid transparent",
          borderBottom: "20px solid red",
        }}
      />
      <button onClick={spin} disabled={spinning}>
        {spinning ? "Крутится..." : "Крутить колесо 🎬"}
      </button>

      {winner && !spinning && (
        <div style={{ marginTop: 16 }}>
          <p>Выпал фильм:</p>
          <h2>{winner.film.title}</h2>
          {winner.film.poster && <img alt={winner.film.title} src={winner.film.poster} width={120} />}
        </div>
      )}
    </div>
  );
};
