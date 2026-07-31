# LifeOS Backend (FastAPI)

REST API layer between the Next.js frontend and Supabase/PostgreSQL.
The frontend sends the Supabase `access_token` as `Authorization: Bearer`;
this backend verifies the JWT and runs all queries under the user's identity
so the existing Row Level Security (RLS) policies apply automatically.

## Requirements

- Python 3.10+
- A Supabase project with the schema from `../supabase/schema.sql` applied.

## Setup

```bash
cd backend
python -m venv .venv
# Windows PowerShell
.venv\Scripts\Activate.ps1
# macOS/Linux
# source .venv/bin/activate

pip install -r requirements.txt
```

## Configuration

Copy `.env.example` to `.env` and fill in the values from your Supabase
dashboard (Settings > API):

- `SUPABASE_URL` — Project URL
- `SUPABASE_ANON_KEY` — anon public / publishable key
- `SUPABASE_JWT_SECRET` — legacy HS256 secret; **leave empty** if your project
  uses the new JWT Signing Keys (ES256) — tokens are then verified via the
  public JWKS endpoint automatically (Settings > JWT Keys)
- `FRONTEND_ORIGIN` — the frontend origin, e.g. `http://localhost:3000`

## Run

```bash
uvicorn app.main:app --reload --port 8000
```

- Interactive API docs: http://localhost:8000/docs
- Health check: http://localhost:8000/health

## Endpoints (Phase 1: Tasks)

| Method | Path                        | Description                     |
| ------ | --------------------------- | ------------------------------- |
| GET    | `/api/me`                   | Current profile + workspace id  |
| GET    | `/api/tasks?workspaceId=`   | List tasks                      |
| POST   | `/api/tasks`                | Create a task                   |
| PATCH  | `/api/tasks/{id}`           | Update a task                   |
| PATCH  | `/api/tasks/{id}/toggle`    | Toggle completion               |
| DELETE | `/api/tasks/{id}`           | Delete a task                   |

All endpoints (except `/health`) require a valid `Authorization: Bearer <token>`.
