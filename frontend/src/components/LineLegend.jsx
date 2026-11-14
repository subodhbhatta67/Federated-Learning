// LineLegend.jsx — legend under a line chart. Each item shows a short sample
// of the strategy's line style, so it works without colour.
// "missing" lists strategies that are not drawn, with a short note.
import { lineStyleFor, LINE_WIDTH } from "../constants.js";
import { joinNames } from "../utils/results.js";

export default function LineLegend({ names, missing, missingNote }) {
  return (
    <ul className="line-legend" aria-label="Chart legend">
      {names.map((name) => {
        const style = lineStyleFor(name);
        return (
          <li key={name}>
            <svg width="28" height="10" aria-hidden="true">
              <line
                x1="0"
                y1="5"
                x2="28"
                y2="5"
                stroke={style.stroke}
                strokeWidth={LINE_WIDTH}
                strokeDasharray={style.dash}
              />
            </svg>
            {name}
          </li>
        );
      })}
      {missing.length > 0 && (
        <li className="legend-missing">
          {joinNames(missing)}: {missingNote}
        </li>
      )}
    </ul>
  );
}
