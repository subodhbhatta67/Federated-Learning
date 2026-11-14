// mock/mockResults.js
// PLACEHOLDER DATA — these are NOT real experiment results.
// They copy the shape of GET /api/results so the UI can be built and tested
// before the backend has full data. Only alpha 0.5 has data (10 rounds each).
// FedAdam has accuracy and jfi set to null (not computed yet).

// Build round objects from matching lists of values.
function buildRounds(accuracy, loss, jfi) {
  return accuracy.map((acc, i) => ({
    round: i + 1,
    accuracy: acc,
    loss: loss[i],
    jfi: jfi[i],
  }));
}

const TEN_NULLS = [null, null, null, null, null, null, null, null, null, null];

const MOCK_ALPHA_05 = [
  {
    strategy: "FedAvg",
    alpha: 0.5,
    rounds: buildRounds(
      [12.7, 10.6, 15.6, 20.0, 20.1, 20.6, 21.4, 19.8, 15.6, 21.18],
      [2.25, 2.27, 2.22, 2.18, 2.17, 2.16, 2.15, 2.16, 2.2, 2.13],
      [0.755, 0.62, 0.86, 0.89, 0.845, 0.838, 0.9, 0.83, 0.84, 0.918]
    ),
  },
  {
    strategy: "FedProx",
    alpha: 0.5,
    rounds: buildRounds(
      [20.9, 23.1, 23.2, 22.9, 22.9, 24.9, 23.8, 24.4, 26.0, 27.12],
      [2.08, 2.03, 2.01, 1.99, 1.97, 1.95, 1.94, 1.92, 1.9, 1.88],
      [0.863, 0.952, 0.925, 0.953, 0.902, 0.965, 0.955, 0.845, 0.993, 0.894]
    ),
  },
  {
    strategy: "FedAdam",
    alpha: 0.5,
    rounds: buildRounds(
      TEN_NULLS,
      [2.3, 2.3, 2.31, 2.3, 2.31, 2.3, 2.31, 2.31, 2.3, 2.31],
      TEN_NULLS
    ),
  },
  {
    strategy: "SCAFFOLD",
    alpha: 0.5,
    rounds: buildRounds(
      [16.3, 17.2, 18.0, 21.3, 21.8, 22.2, 25.2, 23.0, 24.3, 25.36],
      [2.28, 2.24, 2.2, 2.15, 2.12, 2.1, 2.06, 2.05, 2.03, 2.0],
      TEN_NULLS
    ),
    control_variate_norms: {
      client_0: 2.32,
      client_1: 2.65,
      client_2: 1.83,
      client_3: 1.62,
      client_4: 2.28,
    },
  },
];

// Same behaviour as the backend: only the requested strategies, and an
// empty list for any alpha without data.
export function getMockResults(alpha, strategies) {
  if (alpha !== "0.5") return [];
  return MOCK_ALPHA_05.filter((item) => strategies.includes(item.strategy.toLowerCase()));
}
