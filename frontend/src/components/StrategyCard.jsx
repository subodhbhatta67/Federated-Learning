// StrategyCard.jsx — name and one-line description of an aggregation strategy.
export default function StrategyCard({ name, description }) {
  return (
    <article className="card strategy-card">
      <h3>{name}</h3>
      <p>{description}</p>
    </article>
  );
}
