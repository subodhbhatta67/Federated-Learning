// StatTile.jsx — a small card with a big number and a label under it.
export default function StatTile({ value, label }) {
  return (
    <div className="card stat-tile">
      <p className="stat-value">{value}</p>
      <p className="stat-label">{label}</p>
    </div>
  );
}
