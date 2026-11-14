// mock/mockPredict.js
// PLACEHOLDER DATA — not a real model prediction.
// POST /api/predict is not built yet, so this fakes the agreed response shape.
// The numbers depend on the file's size and name, so different images give
// different (but meaningless) results.

import { CLASS_NAMES } from "../constants.js";

export function getMockPrediction(file) {
  // Simple repeatable random numbers seeded from the file.
  let seed = (file.size + file.name.length * 7919) % 2147483647 || 1;
  function random() {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  }

  const weights = CLASS_NAMES.map(() => 0.2 + random());
  const topIndex = Math.floor(random() * CLASS_NAMES.length);
  weights[topIndex] += 4; // make one class clearly the winner

  const total = weights.reduce((sum, w) => sum + w, 0);
  const probabilities = {};
  CLASS_NAMES.forEach((name, i) => {
    probabilities[name] = Number((weights[i] / total).toFixed(4));
  });

  return {
    predicted_class: CLASS_NAMES[topIndex],
    confidence: probabilities[CLASS_NAMES[topIndex]],
    probabilities,
  };
}
