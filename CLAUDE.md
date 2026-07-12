# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Malaria Drug Resistance Intelligence Platform — a surveillance/ML-prediction dashboard for antimalarial drug resistance across Sub-Saharan Africa. FastAPI backend, React 19 + Vite frontend. Surveillance/research tool only — not for clinical decision-making (this disclaimer is shown in the UI and API responses; preserve it in any related copy changes).

## Commands

### Local dev (Docker, full stack)
```bash
docker compose up            # frontend :5173, backend :8000, postgres :5432, redis :6379
```

### Frontend (`frontend/`)
```bash
npm run dev       # vite dev server
npm run build     # tsc -b && vite build
npm run lint      # eslint .
npm run preview   # preview a production build
```
There is no frontend test script/framework configured (no vitest/jest present).

### Backend (`backend/`)
```bash
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload   # :8000, docs at /docs
```
There are no backend tests in the repo currently.

### Production deployment
```bash
cp .env.production.example .env   # fill in SECRET_KEY, POSTGRES_PASSWORD, FRONTEND_PORT, CORS_ORIGINS
docker compose -f docker-compose.prod.yml up -d --build
```
`docker-compose.prod.yml` builds the frontend's `production` target (nginx serving the Vite build + proxying `/api/`) and does **not** publish host ports for `backend`, `db`, or `redis` — only `frontend` is reachable from outside the compose network. Keep it that way when editing this file; it's deliberate for running alongside other services on a shared host.

## Architecture

### The backend currently runs entirely on in-memory mock data — there is no real database or ML wiring yet

This is the single most important thing to know before touching backend code:

- `app/db/database.py`'s `init_db()`/`get_db()` are no-ops (`get_db` is just `pass`); nothing in the app actually opens a SQLAlchemy/asyncpg session, despite `DATABASE_URL`, `sqlalchemy`, `asyncpg`, and `alembic` all being present in `requirements.txt` and docker-compose. Postgres/PostGIS and `backend/init_db/01_init.sql` create placeholder tables that nothing queries.
- All endpoint data comes from Python dicts/lists: `app/db/mock_data.py` (`COUNTRIES`, etc.) and, confusingly, `app/api/v1/reports.py` keeps its **own separate copy** of the same country data inline (comment: "Mock data directly in the file to ensure it works") rather than importing the shared module. If you update mock country data, check whether it needs to change in both places.
- `app/api/v1/predictions.py`'s "ML" endpoints are hand-written arithmetic (marker-weight lookup tables + `random.uniform` jitter) that label their output `model_version`/`model_type` as an "XGBoost + LogReg + RF Ensemble" — there is no trained model and `scikit-learn`/`xgboost` (also in requirements.txt) aren't imported anywhere. Treat "prediction" changes as tuning a heuristic formula, not a model.
- `SECRET_KEY` is provisioned via env/compose but not consumed anywhere in the app (no auth/JWT is implemented despite `python-jose`/`passlib` being in requirements.txt).

If a task requires making any of this real (actual DB persistence, an actual model, actual auth), that's a substantial addition, not a bug fix — confirm scope with the user first.

### Frontend: offline-first, API-optional

`frontend/src/hooks/useApi.ts` is the data-fetching layer the UI actually uses (`useAppData`, `useIndividualPrediction`). Pattern: always try the FastAPI backend first; on any failure, fall back to static bundled data in `frontend/src/malariaData.ts` (and a local `generatePrediction` heuristic for predictions) so the dashboard always renders something even with no backend reachable. `isOnline`/`error` state reflects which source is currently active. `frontend/src/services/api.ts` is a second, more complete API client (typed responses for all endpoints) — `useApi.ts`'s inline `fetchApi`/`postApi` duplicate a subset of it. When adding new endpoints, wire them into both the mock fallback and whichever client the consuming component actually uses.

`API_BASE_URL` in both files reads `import.meta.env.VITE_API_URL ?? 'http://localhost:8000'` — deliberately `??` not `||`, because an intentional empty string (same-origin relative requests, used in the production nginx build) is a valid, non-fallback value.

### Frontend routing/layout

`App.tsx` is a two-tab shell (`report` vs `prediction`, no router) toggling between `sections/ReportLayer.tsx` (surveillance dashboard/map) and `sections/PredictionLayer.tsx` (ML risk form). UI components in `components/ui/` are shadcn/ui primitives (Radix + Tailwind) — treat them as generated/vendored; extend via composition rather than editing them directly unless fixing a real bug in one.

### Nginx / API proxy path (production only)

`frontend/nginx.conf`'s `/api/` location does `proxy_pass http://backend:8000;` with **no trailing path** on purpose — this passes the full request URI through unchanged (e.g. `/api/v1/health` stays `/api/v1/health`), which matches the backend's own router prefix (`app.include_router(..., prefix="/api/v1")` in `main.py`). If you ever add a trailing `/` (`proxy_pass http://backend:8000/;`), nginx will instead strip the matched `/api/` prefix before forwarding, breaking every route — this exact bug existed before (pointed at a non-existent `api` service name, too) and is easy to reintroduce.

The frontend's `production` Docker target builds via Vite then serves through nginx (`frontend/Dockerfile`) — do not revert it to serving via `serve`/a raw static server, since that path used to skip `nginx.conf` (and the `/api/` proxy) entirely.

### CORS

`backend/app/main.py` reads `CORS_ORIGINS` from the environment (comma-separated) — do not hardcode origins or reintroduce a wildcard (`"*"`) combined with `allow_credentials=True`; browsers reject that combination and it was a real bug here previously.
