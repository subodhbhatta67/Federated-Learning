// utils/results.js
// Small helpers for turning API results into chart rows and table text.

// Merge every strategy's rounds into one array for a chart:
// [{ round: 1, FedAvg: 12.7, FedProx: 20.9 }, ...]
// A missing or null value stays null, so the chart shows a gap (never a 0).
export function mergeByRound(results, field) {
  const byRound = {};
  results.forEach((item) => {
    item.rounds.forEach((r) => {
      if (!byRound[r.round]) byRound[r.round] = { round: r.round };
      const value = r[field];
      byRound[r.round][item.strategy] = value === undefined ? null : value;
    });
  });
  return Object.values(byRound).sort((a, b) => a.round - b.round);
}

// The last round of a strategy, or null if it has no rounds.
export function getFinalRow(item) {
  if (!item || !item.rounds || item.rounds.length === 0) return null;
  return item.rounds[item.rounds.length - 1];
}

// True when at least one round has a real (non-null) value for this field.
export function hasAnyValue(item, field) {
  return item.rounds.some((r) => r[field] !== null && r[field] !== undefined);
}

// Format a number with fixed decimals. null / missing becomes a dash.
export function formatNumber(value, decimals, suffix = "") {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "—";
  return Number(value).toFixed(decimals) + suffix;
}

// Format a value the right way for its metric.
export function formatMetric(field, value) {
  if (field === "accuracy" || field === "worst_client_acc") return formatNumber(value, 2, "%");
  if (field === "loss") return formatNumber(value, 2);
  if (field === "jfi") return formatNumber(value, 3);
  return formatNumber(value, 2);
}

// ["FedAdam", "SCAFFOLD"] -> "FedAdam and SCAFFOLD"
export function joinNames(names) {
  if (names.length <= 1) return names.join("");
  return names.slice(0, -1).join(", ") + " and " + names[names.length - 1];
}
