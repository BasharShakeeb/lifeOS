"""FastAPI application entrypoint for the LifeOS backend."""
import truststore

# Use the OS certificate store (fixes SSL verification behind AV/corporate
# proxies on Windows). Must run before any HTTPS client is created.
truststore.inject_into_ssl()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.routers import assignments, bootstrap, goals, habits, health_records, hubs, projects, tasks

settings = get_settings()
frontend_origins = [
    origin.strip() for origin in settings.frontend_origin.split(",") if origin.strip()
]

app = FastAPI(
    title="LifeOS Backend API",
    version="1.0.0",
    description="REST API backing the LifeOS frontend, connected to Supabase.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_origins or ["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(bootstrap.router)
app.include_router(tasks.router)
app.include_router(hubs.router)
app.include_router(projects.router)
app.include_router(goals.router)
app.include_router(habits.router)
app.include_router(assignments.router)
app.include_router(health_records.router)


@app.get("/", tags=["health"])
def root() -> dict:
    """Root route to confirm the API is running."""
    return {"status": "ok", "message": "LifeOS backend is running", "docs": "/docs"}


@app.get("/health", tags=["health"])
def health_check() -> dict:
    """Simple liveness probe."""
    return {"status": "ok"}
