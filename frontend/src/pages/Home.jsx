// Home.jsx — static landing page. No API calls.
import { Link } from "react-router-dom";
import StatTile from "../components/StatTile.jsx";
import StrategyCard from "../components/StrategyCard.jsx";
import { STRATEGIES } from "../constants.js";

// Facts about the experiment setup (not results).
const STATS = [
  { value: 4, label: "aggregation strategies" },
  { value: 4, label: "heterogeneity levels (α)" },
  { value: 10, label: "image classes (CINIC-10)" },
  { value: 5, label: "random seeds per setting" },
];

export default function Home() {
  return (
    <div className="container page">
      <section className="hero">
        <h1 className="hero-title">Federated learning aggregation strategies under Non-IID data</h1>
        <p className="lead">
          Compare FedAvg, FedProx, FedAdam and SCAFFOLD on accuracy and on how fairly they serve
          every client.
        </p>
        <div className="button-row">
          <Link to="/results" className="btn btn-primary">
            Explore results
          </Link>
          <Link to="/try" className="btn btn-secondary">
            Try the model
          </Link>
        </div>
      </section>

      <section className="tile-row" aria-label="Experiment setup">
        {STATS.map((stat) => (
          <StatTile key={stat.label} value={stat.value} label={stat.label} />
        ))}
      </section>

      <section className="section">
        <h2 className="section-title">What is federated learning?</h2>
        <p className="prose">
          Instead of sending private data to one server, each client trains a model on its own data
          and sends back only the model update. The server combines the updates into a better
          global model. The rule used to combine them is the aggregation strategy, and it matters
          most when clients hold very different data.
        </p>
      </section>

      <section className="section">
        <h2 className="section-title">The four strategies</h2>
        <div className="strategy-grid">
          {STRATEGIES.map((s) => (
            <StrategyCard key={s.id} name={s.name} description={s.description} />
          ))}
        </div>
      </section>
    </div>
  );
}
