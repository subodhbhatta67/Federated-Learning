// FinalAccuracyChart.jsx — one bar per strategy showing its last-round accuracy.
// A strategy whose final accuracy is null gets an empty dashed slot saying "no data".
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, LabelList } from "recharts";
import { CHART, lineStyleFor } from "../constants.js";
import { getFinalRow, formatNumber } from "../utils/results.js";

const tick = { fill: CHART.axis, fontSize: CHART.fontSize };

export default function FinalAccuracyChart({ results }) {
  const finals = results.map((item) => {
    const last = getFinalRow(item);
    const accuracy = last && last.accuracy !== undefined ? last.accuracy : null;
    return { strategy: item.strategy, accuracy };
  });

  // Height of the empty "no data" slot: half of the tallest real bar.
  const tallest = Math.max(10, ...finals.map((f) => f.accuracy || 0));
  const data = finals.map((f) => ({
    ...f,
    placeholder: f.accuracy === null ? tallest * 0.5 : null,
  }));

  return (
    <div className="chart-box">
      <ResponsiveContainer width="100%" height={CHART.height}>
        <BarChart data={data} margin={{ top: 24, right: 16, bottom: 8, left: 8 }}>
          <CartesianGrid stroke={CHART.grid} vertical={false} />
          <XAxis dataKey="strategy" tick={tick} stroke={CHART.grid} />
          <YAxis
            tick={tick}
            stroke={CHART.grid}
            width={64}
            label={{
              value: "Accuracy (%)",
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle", fill: CHART.axis, fontSize: CHART.fontSize },
            }}
          />
          {/* Real bars, shaded like each strategy's line */}
          <Bar dataKey="accuracy" stackId="final" isAnimationActive={false} maxBarSize={72}>
            {data.map((d) => (
              <Cell key={d.strategy} fill={lineStyleFor(d.strategy).stroke} />
            ))}
            <LabelList
              dataKey="accuracy"
              position="top"
              fill={CHART.axis}
              fontSize={CHART.fontSize}
              formatter={(v) => (v === null || v === undefined ? "" : formatNumber(v, 2, "%"))}
            />
          </Bar>
          {/* Empty dashed slot for strategies without a final accuracy */}
          <Bar
            dataKey="placeholder"
            stackId="final"
            fill="#ffffff"
            stroke="#999999"
            strokeDasharray="4 3"
            isAnimationActive={false}
            maxBarSize={72}
          >
            <LabelList
              dataKey="placeholder"
              position="center"
              fill={CHART.axis}
              fontSize={CHART.fontSize}
              formatter={(v) => (v === null || v === undefined ? "" : "no data")}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
