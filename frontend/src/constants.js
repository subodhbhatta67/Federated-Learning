// constants.js
// Shared lists used across the app: strategies, alpha options, metrics,
// class names and chart line styles. Change them here, not in the pages.

// Mock mode. When true, api.js returns placeholder data instead of calling Flask.
// Set VITE_USE_MOCK=false in .env.development to use the real backend.
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

// The four aggregation strategies. "id" is the lowercase name the API expects,
// "name" is the display name shown in the UI.
export const STRATEGIES = [
  {
    id: "fedavg",
    name: "FedAvg",
    description: "Weighted average of client updates. The baseline.",
  },
  {
    id: "fedprox",
    name: "FedProx",
    description: "Adds a penalty that keeps local training close to the global model.",
  },
  {
    id: "fedadam",
    name: "FedAdam",
    description: "Applies an adaptive Adam step on the server side.",
  },
  {
    id: "scaffold",
    name: "SCAFFOLD",
    description: "Uses control variates to correct client drift. Doubles the communication per round.",
  },
];

// Turn an API name ("fedprox") into a display name ("FedProx").
export function displayName(id) {
  const found = STRATEGIES.find((s) => s.id === String(id).toLowerCase());
  return found ? found.name : id;
}

// Heterogeneity levels. "value" is the exact string the API expects
// (keep "1.0" as "1.0", never "1").
export const ALPHA_OPTIONS = [
  { value: "100", short: "100 · near-IID", question: "Nearly the same (α = 100)" },
  { value: "1.0", short: "1.0 · mild", question: "Mildly different (α = 1.0)" },
  { value: "0.5", short: "0.5 · moderate", question: "Moderately different (α = 0.5)" },
  { value: "0.1", short: "0.1 · severe", question: "Very different (α = 0.1)" },
];

// What the user cares about most, for the recommender.
export const PRIORITY_OPTIONS = [
  { value: "accuracy", label: "Accuracy" },
  { value: "fairness", label: "Fairness across clients" },
  { value: "cost", label: "Low communication cost" },
];

// Metrics the Results page can plot.
export const METRICS = {
  accuracy: { label: "Accuracy", title: "Global accuracy by round", axis: "Accuracy (%)" },
  loss: { label: "Validation loss", title: "Validation loss by round", axis: "Validation loss" },
  jfi: { label: "Jain's Fairness Index", title: "Jain's Fairness Index by round", axis: "Jain's Fairness Index" },
};

// The ten CINIC-10 classes, in the fixed order the model uses.
export const CLASS_NAMES = [
  "airplane",
  "automobile",
  "bird",
  "cat",
  "deer",
  "dog",
  "frog",
  "horse",
  "ship",
  "truck",
];

// Chart styles. No colour: each strategy gets its own shade and dash pattern.
export const LINE_WIDTH = 2;
export const LINE_STYLES = {
  fedprox: { stroke: "#111111", dash: undefined },
  scaffold: { stroke: "#444444", dash: "2 4" },
  fedavg: { stroke: "#666666", dash: "6 4" },
  fedadam: { stroke: "#888888", dash: "8 3 2 3" },
};

// Look up the line style for a strategy, whatever case its name is in.
export function lineStyleFor(name) {
  return LINE_STYLES[String(name).toLowerCase()] || { stroke: "#666666", dash: undefined };
}

// Shared look for chart axes, grid and labels.
export const CHART = {
  grid: "#e5e5e5",
  axis: "#555555",
  fontSize: 12,
  height: 300,
};

// Largest image the Try the model page accepts (5 MB).
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
