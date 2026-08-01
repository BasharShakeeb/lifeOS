"""Habit service: CRUD against the Supabase `habits` table with field mapping."""
from datetime import datetime
from typing import Any, Optional

from fastapi import HTTPException, status
from supabase import Client

from app.schemas.habit import HabitCreate, HabitOut, HabitUpdate

FREQUENCY_TO_DB = {
    "daily": "DAILY",
    "weekly": "WEEKLY",
    "monthly": "MONTHLY",
    "yearly": "YEARLY",
    "custom": "CUSTOM",
    "none": "NONE",
}
FREQUENCY_FROM_DB = {v: k for k, v in FREQUENCY_TO_DB.items()}

STATUS_TO_DB = {
    "not_started": "TODO",
    "in_progress": "IN_PROGRESS",
    "completed": "COMPLETED",
    "paused": "ARCHIVED",
}
STATUS_FROM_DB = {
    "TODO": "not_started",
    "IN_PROGRESS": "in_progress",
    "REVIEW": "in_progress",
    "COMPLETED": "completed",
    "CANCELLED": "paused",
    "ARCHIVED": "paused",
}


def _to_iso(value: Optional[str]) -> Optional[str]:
    """Normalize a frontend date/datetime string into an ISO timestamp."""
    if not value:
        return None
    try:
        return datetime.fromisoformat(value).isoformat()
    except ValueError:
        try:
            return datetime.fromisoformat(f"{value}T00:00:00").isoformat()
        except ValueError:
            return value


def _row_to_habit(row: dict[str, Any]) -> HabitOut:
    """Map a DB row to the frontend-facing HabitOut model."""
    return HabitOut(
        id=str(row["id"]),
        title=row.get("title") or "",
        description=row.get("description") or "",
        frequency=FREQUENCY_FROM_DB.get(row.get("frequency") or "DAILY", "daily"),
        targetPerDay=row.get("target_per_day") or 1,
        targetPerWeek=row.get("target_per_week") or 7,
        currentStreak=row.get("current_streak") or 0,
        bestStreak=row.get("best_streak") or 0,
        lastCompleted=(row.get("last_completed") or "").split("T")[0] if row.get("last_completed") else None,
        status=STATUS_FROM_DB.get(row.get("status") or "IN_PROGRESS", "in_progress"),
        color=row.get("color") or "#10b981",
        icon=row.get("icon") or "flame",
        hubId=row.get("hub_id"),
        createdAt=row.get("created_at"),
        updatedAt=row.get("updated_at"),
    )


def list_habits(client: Client, workspace_id: str) -> list[HabitOut]:
    """Return all habits for a workspace, newest first."""
    res = (
        client.table("habits")
        .select("*")
        .eq("workspace_id", workspace_id)
        .order("created_at", desc=True)
        .execute()
    )
    return [_row_to_habit(row) for row in (res.data or [])]


def create_habit(
    client: Client, workspace_id: str, profile_id: str, payload: HabitCreate
) -> HabitOut:
    """Insert a new habit and return its mapped representation."""
    insert_data = {
        "workspace_id": workspace_id,
        "hub_id": payload.hubId or None,
        "title": payload.title,
        "description": payload.description or None,
        "frequency": FREQUENCY_TO_DB.get(payload.frequency, "DAILY"),
        "target_per_day": payload.targetPerDay,
        "target_per_week": payload.targetPerWeek,
        "current_streak": payload.currentStreak,
        "best_streak": payload.bestStreak,
        "last_completed": _to_iso(payload.lastCompleted),
        "status": STATUS_TO_DB.get(payload.status, "IN_PROGRESS"),
        "color": payload.color,
        "icon": payload.icon,
        "created_by": profile_id,
    }
    res = client.table("habits").insert(insert_data).execute()
    if not res.data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create habit",
        )
    return _row_to_habit(res.data[0])


def get_habit(client: Client, habit_id: str) -> HabitOut:
    """Fetch a single habit by id."""
    res = client.table("habits").select("*").eq("id", habit_id).limit(1).execute()
    if not res.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found",
        )
    return _row_to_habit(res.data[0])


def update_habit(client: Client, habit_id: str, payload: HabitUpdate) -> HabitOut:
    """Apply a partial update to a habit."""
    update_data: dict[str, Any] = {}
    if payload.title is not None:
        update_data["title"] = payload.title
    if payload.description is not None:
        update_data["description"] = payload.description or None
    if payload.frequency is not None:
        update_data["frequency"] = FREQUENCY_TO_DB.get(payload.frequency, "DAILY")
    if payload.targetPerDay is not None:
        update_data["target_per_day"] = payload.targetPerDay
    if payload.targetPerWeek is not None:
        update_data["target_per_week"] = payload.targetPerWeek
    if payload.currentStreak is not None:
        update_data["current_streak"] = payload.currentStreak
    if payload.bestStreak is not None:
        update_data["best_streak"] = payload.bestStreak
    if payload.lastCompleted is not None:
        update_data["last_completed"] = _to_iso(payload.lastCompleted)
    if payload.status is not None:
        update_data["status"] = STATUS_TO_DB.get(payload.status, "IN_PROGRESS")
    if payload.color is not None:
        update_data["color"] = payload.color
    if payload.icon is not None:
        update_data["icon"] = payload.icon
    if payload.hubId is not None:
        update_data["hub_id"] = payload.hubId or None

    if not update_data:
        return get_habit(client, habit_id)

    res = client.table("habits").update(update_data).eq("id", habit_id).execute()
    if not res.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found",
        )
    return _row_to_habit(res.data[0])


def delete_habit(client: Client, habit_id: str) -> None:
    """Delete a habit by id."""
    client.table("habits").delete().eq("id", habit_id).execute()
