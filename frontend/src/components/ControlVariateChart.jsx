// ControlVariateChart.jsx — SCAFFOLD's control-variate norm per client.
// The client with the largest norm is drawn darkest.
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, LabelList } from "recharts";
import { CHART } from "../constants.js";
import { formatNumber } from "../utils/results.js";

const tick = { fill: CHART.axis, fontSize: CHART.fontSize };

export default function ControlVariateChart({ norms }) {
  // { client_0: 2.32 } -> [{ client: "Client 0", norm: 2.32 }]
  const data = Object.entries(norms).map(([key, value]) => ({
    client: "Client " + key.replace("client_", ""),
    norm: value,
  }));
  const largest = Math.max(...data.map((d) => d.norm || 0));

  return (
    <div className="chart-box">
      <ResponsiveContainer width="100%" height={CHART.height}>
        <BarChart data={data} margin={{ top: 24, right: 16, bottom: 8, left: 8 }}>
          <CartesianGrid stroke={CHART.grid} vertical={false} />
          <XAxis dataKey="client" tick={tick} stroke={CHART.grid} />
          <YAxis
            tick={tick}
            stroke={CHART.grid}
            width={64}
            label={{
              value: "Norm",
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle", fill: CHART.axis, fontSize: CHART.fontSize },
            }}
          />
          <Bar dataKey="norm" isAnimationActive={false} maxBarSize={64}>
            {data.map((d) => (
              <Cell key={d.client} fill={d.norm === largest ? "#111111" : "#555555"} />
            ))}
            <LabelList
              dataKey="norm"
              position="top"
              fill={CHART.axis}
              fontSize={CHART.fontSize}
              formatter={(v) => formatNumber(v, 2)}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
