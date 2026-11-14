// RoundsChart.jsx — line chart of one metric over rounds, one line per strategy.
// null values leave a gap in the line (connectNulls is off), never a 0.
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { CHART, LINE_WIDTH, lineStyleFor } from "../constants.js";
import { mergeByRound, hasAnyValue, formatMetric } from "../utils/results.js";
import LineLegend from "./LineLegend.jsx";
import StatusMessage from "./StatusMessage.jsx";

const tick = { fill: CHART.axis, fontSize: CHART.fontSize };

export default function RoundsChart({ results, field, yLabel, missingNote }) {
  const rows = mergeByRound(results, field);
  // Only draw strategies that have at least one value for this metric.
  const drawn = results.filter((item) => hasAnyValue(item, field)).map((item) => item.strategy);
  const notDrawn = results.filter((item) => !hasAnyValue(item, field)).map((item) => item.strategy);

  if (drawn.length === 0) {
    return <StatusMessage type="empty" message="None of the selected strategies have this metric yet." />;
  }

  return (
    <>
      <div className="chart-box">
        <ResponsiveContainer width="100%" height={CHART.height}>
          <LineChart data={rows} margin={{ top: 8, right: 16, bottom: 20, left: 8 }}>
            <CartesianGrid stroke={CHART.grid} vertical={false} />
            <XAxis
              dataKey="round"
              tick={tick}
              stroke={CHART.grid}
              label={{ value: "Round", position: "insideBottom", offset: -12, fill: CHART.axis, fontSize: CHART.fontSize }}
            />
            <YAxis
              domain={["auto", "auto"]}
              tick={tick}
              stroke={CHART.grid}
              width={64}
              label={{
                value: yLabel,
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle", fill: CHART.axis, fontSize: CHART.fontSize },
              }}
            />
            <Tooltip
              formatter={(value) => formatMetric(field, value)}
              labelFormatter={(round) => `Round ${round}`}
            />
            {drawn.map((name) => {
              const style = lineStyleFor(name);
              return (
                <Line
                  key={name}
                  type="linear"
                  dataKey={name}
                  name={name}
                  stroke={style.stroke}
                  strokeDasharray={style.dash}
                  strokeWidth={LINE_WIDTH}
                  dot={false}
                  connectNulls={false}
                  isAnimationActive={false}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <LineLegend names={drawn} missing={notDrawn} missingNote={missingNote} />
    </>
  );
}
