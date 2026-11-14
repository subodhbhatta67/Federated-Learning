// ProbabilityBars.jsx — one row per class: name, a horizontal bar, the percentage.
// Rows stay in the fixed class order; the predicted class is dark, the rest gray.
import { CLASS_NAMES } from "../constants.js";
import { formatNumber } from "../utils/results.js";

export default function ProbabilityBars({ probabilities, predictedClass }) {
  return (
    <ul className="prob-list" aria-label="Probability for every class">
      {CLASS_NAMES.map((name) => {
        const p = probabilities[name] || 0;
        const isTop = name === predictedClass;
        return (
          <li key={name} className={isTop ? "prob-row is-top" : "prob-row"}>
            <span className="prob-name">{name}</span>
            <span className="prob-track" aria-hidden="true">
              <span className="prob-fill" style={{ width: `${Math.min(100, p * 100)}%` }} />
            </span>
            <span className="prob-value">{formatNumber(p * 100, 1, "%")}</span>
          </li>
        );
      })}
    </ul>
  );
}
