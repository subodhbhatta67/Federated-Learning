// Recommender.jsx — answer two questions, get a suggested strategy.
import { useState } from "react";
import { recommend } from "../api.js";
import { ALPHA_OPTIONS, PRIORITY_OPTIONS, USE_MOCK } from "../constants.js";
import { formatMetric } from "../utils/results.js";
import StatusMessage from "../components/StatusMessage.jsx";

export default function Recommender() {
  const [alpha, setAlpha] = useState("0.5"); // radio value, sent as a number
  const [priority, setPriority] = useState("accuracy");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  async function handleRecommend() {
    setLoading(true);
    setError("");
    setNotFound(false);
    try {
      const response = await recommend(Number(alpha), priority);
      setResult(response);
    } catch (err) {
      setResult(null);
      if (err.status === 404) setNotFound(true); // friendly "no data" message
      else setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function renderResult() {
    if (loading) return <StatusMessage type="loading" />;
    if (notFound) return <StatusMessage type="empty" message="No data for this heterogeneity level yet." />;
    if (error) return <StatusMessage type="error" message={error} />;
    if (!result) return <p className="hint">Pick your options and press Recommend</p>;

    return (
      <>
        <p className="eyebrow">Recommended strategy</p>
        <p className="big-name">{result.recommended}</p>
        <p className="reason">{result.reason}</p>
        {result.runner_up && <p className="runner-up">Runner-up: {result.runner_up}</p>}

        <div className="table-wrap">
          <table className="data-table compact">
            <thead>
              <tr>
                <th scope="col">Strategy</th>
                <th scope="col">Accuracy</th>
                <th scope="col">Fairness (JFI)</th>
                <th scope="col">Communication</th>
              </tr>
            </thead>
            <tbody>
              {result.table.map((row) => (
                <tr key={row.strategy} className={row.strategy === result.recommended ? "row-highlight" : ""}>
                  <th scope="row">{row.strategy}</th>
                  <td>{formatMetric("accuracy", row.accuracy)}</td>
                  <td>{formatMetric("jfi", row.jfi)}</td>
                  <td>{row.communication || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="note">Final recommendation comes from the full experiment results.</p>
        {USE_MOCK && <p className="mock-note">Placeholder data (mock mode), not a real recommendation.</p>}
      </>
    );
  }

  return (
    <div className="container page">
      <header className="page-header">
        <h1 className="page-title">Strategy recommender</h1>
        <p className="lead">Answer two questions and get a suggestion based on the experiment results.</p>
      </header>

      <div className="two-col">
        <section className="card form-card" aria-label="Your situation">
          <fieldset>
            <legend>How different is your clients' data?</legend>
            <div className="option-stack">
              {ALPHA_OPTIONS.map((opt) => (
                <label key={opt.value} className="option">
                  <input
                    type="radio"
                    name="rec-alpha"
                    value={opt.value}
                    checked={alpha === opt.value}
                    onChange={(e) => setAlpha(e.target.value)}
                  />
                  {opt.question}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>What matters most?</legend>
            <div className="option-stack">
              {PRIORITY_OPTIONS.map((opt) => (
                <label key={opt.value} className="option">
                  <input
                    type="radio"
                    name="priority"
                    value={opt.value}
                    checked={priority === opt.value}
                    onChange={(e) => setPriority(e.target.value)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </fieldset>

          <button type="button" className="btn btn-primary" onClick={handleRecommend} disabled={loading}>
            {loading ? "Recommending..." : "Recommend"}
          </button>
        </section>

        <section className="card result-card" aria-live="polite" aria-label="Recommendation">
          {renderResult()}
        </section>
      </div>
    </div>
  );
}
