// Results.jsx — pick alpha, strategies and a metric; see charts and a summary table.
import { useEffect, useState } from "react";
import { getResults } from "../api.js";
import { ALPHA_OPTIONS, METRICS, STRATEGIES, USE_MOCK, displayName } from "../constants.js";
import ChartCard from "../components/ChartCard.jsx";
import RoundsChart from "../components/RoundsChart.jsx";
import FinalAccuracyChart from "../components/FinalAccuracyChart.jsx";
import ControlVariateChart from "../components/ControlVariateChart.jsx";
import ResultsTable from "../components/ResultsTable.jsx";
import StatusMessage from "../components/StatusMessage.jsx";

export default function Results() {
  const [alpha, setAlpha] = useState("0.5");
  const [selected, setSelected] = useState(STRATEGIES.map((s) => s.id));
  const [metric, setMetric] = useState("accuracy");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch whenever alpha or the strategy selection changes.
  // Changing only the metric does not refetch: the response holds every metric.
  useEffect(() => {
    if (selected.length === 0) {
      setData([]);
      setError("");
      setLoading(false);
      return undefined;
    }

    // "ignore" stops an old, slow response from overwriting a newer one.
    let ignore = false;
    setLoading(true);
    setError("");
    getResults(alpha, selected)
      .then((response) => {
        if (!ignore) setData(response);
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.message);
          setData([]);
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [alpha, selected]);

  // Tick or untick a strategy, keeping the fixed order.
  function toggleStrategy(id) {
    const next = selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id];
    setSelected(STRATEGIES.map((s) => s.id).filter((s) => next.includes(s)));
  }

  // Selected strategies that the backend returned no data for.
  const returned = data.map((item) => item.strategy.toLowerCase());
  const missing = selected.filter((id) => !returned.includes(id)).map(displayName);

  // SCAFFOLD's extra data, only if SCAFFOLD is selected and the response has it.
  const scaffold = data.find((item) => item.strategy.toLowerCase() === "scaffold");
  const showControlVariates =
    selected.includes("scaffold") && scaffold && scaffold.control_variate_norms;

  function renderBody() {
    if (selected.length === 0) {
      return <StatusMessage type="empty" message="No strategies selected. Pick at least one to compare." />;
    }
    if (loading) return <StatusMessage type="loading" />;
    if (error) return <StatusMessage type="error" message={error} />;
    if (data.length === 0) return <StatusMessage type="empty" />;

    const m = METRICS[metric];
    return (
      <>
        <div className="chart-grid">
          <ChartCard title={m.title}>
            <RoundsChart
              results={data}
              field={metric}
              yLabel={m.axis}
              missingNote={`no ${m.label.toLowerCase()} data yet`}
            />
          </ChartCard>

          <ChartCard title="Final-round accuracy">
            <FinalAccuracyChart results={data} />
          </ChartCard>

          <ChartCard title="Fairness (Jain's index) by round">
            <RoundsChart
              results={data}
              field="jfi"
              yLabel="Jain's Fairness Index"
              missingNote="not computed yet"
            />
            <p className="note">Strategies with no fairness data yet are not drawn.</p>
          </ChartCard>

          {showControlVariates && (
            <ChartCard title="SCAFFOLD control-variate norm (final round)">
              <ControlVariateChart norms={scaffold.control_variate_norms} />
            </ChartCard>
          )}
        </div>

        {missing.length > 0 && <p className="missing-note">No data yet for: {missing.join(", ")}</p>}

        <section className="card table-card">
          <h2 className="card-title">Summary table</h2>
          <ResultsTable results={data} />
          <p className="note">A dash means the metric is not computed yet.</p>
        </section>
      </>
    );
  }

  return (
    <div className="container page">
      <header className="page-header">
        <h1 className="page-title">Results</h1>
        <p className="lead">
          Pick a heterogeneity level and the strategies to compare. Charts update to match.
        </p>
        {USE_MOCK && <p className="mock-note">Showing placeholder data (mock mode), not real results.</p>}
      </header>

      <section className="card controls" aria-label="Chart options">
        <fieldset>
          <legend>Heterogeneity (α)</legend>
          <div className="option-row">
            {ALPHA_OPTIONS.map((opt) => (
              <label key={opt.value} className="option">
                <input
                  type="radio"
                  name="alpha"
                  value={opt.value}
                  checked={alpha === opt.value}
                  onChange={(e) => setAlpha(e.target.value)}
                />
                {opt.short}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>Strategies</legend>
          <div className="option-row">
            {STRATEGIES.map((s) => (
              <label key={s.id} className="option">
                <input
                  type="checkbox"
                  checked={selected.includes(s.id)}
                  onChange={() => toggleStrategy(s.id)}
                />
                {s.name}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="field">
          <label htmlFor="metric" className="field-label">
            Metric
          </label>
          <select id="metric" value={metric} onChange={(e) => setMetric(e.target.value)}>
            {Object.entries(METRICS).map(([key, m]) => (
              <option key={key} value={key}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <div className="results-body">{renderBody()}</div>
    </div>
  );
}
