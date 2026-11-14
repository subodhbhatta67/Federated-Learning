# FL Platform — frontend

React (JavaScript) + Vite + react-router-dom + recharts. Plain CSS in `src/styles/index.css`.

## Install and run

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173.

## Mock mode vs the real backend

Settings live in `.env.development`:

```
VITE_API_URL=http://localhost:5000
VITE_USE_MOCK=true
```

- `VITE_USE_MOCK=true` — every page uses placeholder data from `src/mock/` (a "mock mode" note is shown on the page).
- `VITE_USE_MOCK=false` — Results and Recommender call the Flask backend at `VITE_API_URL`.

Restart `npm run dev` after changing `.env.development`.

`/api/predict` is not built on the backend yet, so **Try the model always uses mock data** (see the TODO in `src/api.js`).

## Running with the Flask backend

Use two terminals:

```bash
# terminal 1 — backend (from fl-platform/backend, as described in its README)
python app.py          # serves http://localhost:5000

# terminal 2 — frontend
cd frontend
npm run dev            # serves http://localhost:5173
```

Check the backend is up: open http://localhost:5000/api/health — it should show `{"status": "ok"}`.

## Where things are

- `src/api.js` — the only file that calls `fetch`
- `src/constants.js` — strategies, alpha options, class names, chart line styles
- `src/utils/results.js` — `mergeByRound`, `getFinalRow`, `formatNumber`
- `src/components/` — small reusable pieces (Navbar, cards, charts, tables)
- `src/pages/` — Home, Results, Recommender, TryModel
