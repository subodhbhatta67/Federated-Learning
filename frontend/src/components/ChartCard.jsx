// ChartCard.jsx — a white card with a title, used to hold one chart.
export default function ChartCard({ title, children }) {
  return (
    <section className="card chart-card">
      <h2 className="card-title">{title}</h2>
      {children}
    </section>
  );
}
