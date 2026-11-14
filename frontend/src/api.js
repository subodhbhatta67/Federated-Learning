// api.js
// The ONLY file that talks to the Flask backend. Pages call these functions.
// In mock mode every function returns placeholder data after a short delay,
// so the loading states are visible.

import { USE_MOCK } from "./constants.js";
import { getMockResults } from "./mock/mockResults.js";
import { getMockRecommendation } from "./mock/mockRecommend.js";
import { getMockPrediction } from "./mock/mockPredict.js";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const MOCK_DELAY_MS = 400;

// Wait for a number of milliseconds (used to fake network time in mock mode).
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Call the backend and return the JSON body.
// On an HTTP error, throw an Error using the "error" field from the body.
async function request(path, options) {
  let response;
  try {
    response = await fetch(BASE_URL + path, options);
  } catch {
    throw new Error(`Could not reach the server at ${BASE_URL}. Is the Flask backend running?`);
  }

  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null; // body was empty or not JSON
  }

  if (!response.ok) {
    const error = new Error((body && body.error) || `Request failed (HTTP ${response.status}).`);
    error.status = response.status; // pages use this to spot a 404
    throw error;
  }
  return body;
}

// GET /api/results?alpha=0.5&strategies=fedavg,fedprox
// alpha is the exact string "100", "1.0", "0.5" or "0.1".
export async function getResults(alpha, strategies) {
  if (USE_MOCK) {
    await wait(MOCK_DELAY_MS);
    return getMockResults(alpha, strategies);
  }
  const query = `alpha=${encodeURIComponent(alpha)}&strategies=${strategies.join(",")}`;
  return request(`/api/results?${query}`);
}

// POST /api/recommend with { alpha: number, priority: "accuracy" | "fairness" | "cost" }
export async function recommend(alpha, priority) {
  if (USE_MOCK) {
    await wait(MOCK_DELAY_MS);
    return getMockRecommendation(alpha, priority);
  }
  return request("/api/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ alpha, priority }),
  });
}

// POST /api/predict (multipart form, file field "image")
// TODO: the backend has not built /api/predict yet, so this ALWAYS uses the
// mock, even when VITE_USE_MOCK is false. When it exists, replace the body with:
//   const form = new FormData();
//   form.append("image", file);
//   return request("/api/predict", { method: "POST", body: form });
export async function predict(file) {
  await wait(MOCK_DELAY_MS);
  return getMockPrediction(file);
}

// GET /api/health -> { status: "ok" }
export async function checkHealth() {
  if (USE_MOCK) {
    await wait(MOCK_DELAY_MS);
    return { status: "ok" };
  }
  return request("/api/health");
}
