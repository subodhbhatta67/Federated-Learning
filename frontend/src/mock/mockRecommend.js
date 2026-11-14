// mock/mockRecommend.js
// PLACEHOLDER DATA — not a real recommendation.
// Mimics POST /api/recommend using the placeholder results in mockResults.js.

import { getMockResults } from "./mockResults.js";

const VALID_ALPHAS = [100, 1, 0.5, 0.1];
const VALID_PRIORITIES = ["accuracy", "fairness", "cost"];

// Make an Error that looks like an HTTP error from the backend.
function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

// Sort helper: highest value first, null values last.
function byDesc(field) {
  return (a, b) => {
    if (a[field] === null) return 1;
    if (b[field] === null) return -1;
    return b[field] - a[field];
  };
}

export function getMockRecommendation(alpha, priority) {
  if (!VALID_ALPHAS.includes(alpha) || !VALID_PRIORITIES.includes(priority)) {
    throw httpError(400, "invalid alpha or priority");
  }
  if (alpha !== 0.5) throw httpError(404, "no data for this alpha yet");

  // One table row per strategy, taken from its final round.
  const rows = getMockResults("0.5", ["fedavg", "fedprox", "fedadam", "scaffold"]).map((item) => {
    const last = item.rounds[item.rounds.length - 1];
    return {
      strategy: item.strategy,
      accuracy: last.accuracy,
      jfi: last.jfi,
      communication: item.strategy === "SCAFFOLD" ? "about 2x" : "1x",
    };
  });

  let sorted;
  let keyField;
  let reason;
  if (priority === "fairness") {
    sorted = [...rows].sort(byDesc("jfi"));
    keyField = "jfi";
    reason = "Highest final Jain's Fairness Index among strategies with fairness data at alpha 0.5.";
  } else if (priority === "cost") {
    // Cheapest communication first, then the most accurate of those.
    sorted = [...rows].sort((a, b) => {
      if (a.communication !== b.communication) return a.communication === "1x" ? -1 : 1;
      return byDesc("accuracy")(a, b);
    });
    keyField = "accuracy";
    reason = "Highest final accuracy among strategies with the base communication cost (1x) at alpha 0.5.";
  } else {
    sorted = [...rows].sort(byDesc("accuracy"));
    keyField = "accuracy";
    reason = "Highest final accuracy among strategies with data at alpha 0.5.";
  }

  const runner = sorted[1];
  return {
    recommended: sorted[0].strategy,
    reason,
    runner_up: runner && runner[keyField] !== null ? runner.strategy : null,
    table: sorted,
  };
}
