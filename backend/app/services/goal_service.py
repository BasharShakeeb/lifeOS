"""Goal service: CRUD against the Supabase `goals` table with field mapping."""
from datetime import datetime
from typing import Any, Optional

from fastapi import HTTPException, status
from supabase import Client

from app.schemas.goal import GoalCreate, GoalOut, GoalUpdate

PRIORITY_TO_DB = {"low": "LOW", "medium": "MEDIUM", "high": "HIGH", "urgent": "URGENT"}
PRIORITY_FROM_DB = {v: k for k, v in PRIORITY_TO_DB.items()}

GOAL_TYPE_TO_DB = {
    "number": "NUMBER",
    "boolean": "BOOLEAN",
    "percentage": "PERCENTAGE",
    "time": "TIME",
    "money": "MONEY",
}
GOAL_TYPE_FROM_DB = {v: k for k, v in GOAL_TYPE_TO_DB.items()}

STATUS_TO_DB = {
    "not_started": "TODO",
    "in_progress": "IN_PROGRESS",
    "achieved": "COMPLETED",
}
STATUS_FROM_DB = {
    "TODO": "not_started",
    "IN_PROGRESS": "in_progress",
    "REVIEW": "in_progress",
    "COMPLETED": "achieved",
    "CANCELLED": "not_started",
    "ARCHIVED": "not_started",
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


def _row_to_goal(row: dict[str, Any]) -> GoalOut:
    """Map a DB row to the frontend-facing GoalOut model."""
    return GoalOut(
        id=str(row["id"]),
        title=row.get("title") or "",
        description=row.get("description") or "",
        goalType=GOAL_TYPE_FROM_DB.get(row.get("goal_type") or "PERCENTAGE", "percentage"),
        targetValue=float(row.get("target_value") or 100.0),
        currentValue=float(row.get("current_value") or 0.0),
        measurementUnit=row.get("measurement_unit") or "%",
        status=STATUS_FROM_DB.get(row.get("status") or "IN_PROGRESS", "in_progress"),
        priority=PRIORITY_FROM_DB.get(row.get("priority") or "MEDIUM", "medium"),
        progress=row.get("progress") or 0,
        startDate=(row.get("start_date") or "").split("T")[0] if row.get("start_date") else None,
        dueDate=(row.get("due_date") or "").split("T")[0] if row.get("due_date") else None,
        hubId=row.get("hub_id"),
        projectId=row.get("project_id"),
        assignedTo=row.get("assigned_to"),
        createdAt=row.get("created_at"),
        updatedAt=row.get("updated_at"),
    )


def list_goals(client: Client, workspace_id: str) -> list[GoalOut]:
    """Return all goals for a workspace, newest first."""
    res = (
        client.table("goals")
        .select("*")
        .eq("workspace_id", workspace_id)
        .order("created_at", desc=True)
        .execute()
    )
    return [_row_to_goal(row) for row in (res.data or [])]


def create_goal(
    client: Client, workspace_id: str, profile_id: str, payload: GoalCreate
) -> GoalOut:
    """Insert a new goal and return its mapped representation."""
    insert_data = {
        "workspace_id": workspace_id,
        "hub_id": payload.hubId or None,
        "project_id": payload.projectId or None,
        "title": payload.title,
        "description": payload.description or None,
        "goal_type": GOAL_TYPE_TO_DB.get(payload.goalType, "PERCENTAGE"),
        "target_value": payload.targetValue,
        "current_value": payload.currentValue,
        "measurement_unit": payload.measurementUnit,
        "status": STATUS_TO_DB.get(payload.status, "IN_PROGRESS"),
        "priority": PRIORITY_TO_DB.get(payload.priority, "MEDIUM"),
        "progress": payload.progress,
        "start_date": _to_iso(payload.startDate),
        "due_date": _to_iso(payload.dueDate),
        "created_by": profile_id,
        "assigned_to": payload.assignedTo or None,
    }
    res = client.table("goals").insert(insert_data).execute()
    if not res.data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create goal",
        )
    return _row_to_goal(res.data[0])


def get_goal(client: Client, goal_id: str) -> GoalOut:
    """Fetch a single goal by id."""
    res = client.table("goals").select("*").eq("id", goal_id).limit(1).execute()
    if not res.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found",
        )
    return _row_to_goal(res.data[0])


def update_goal(client: Client, goal_id: str, payload: GoalUpdate) -> GoalOut:
    """Apply a partial update to a goal."""
    update_data: dict[str, Any] = {}
    if payload.title is not None:
        update_data["title"] = payload.title
    if payload.description is not None:
        update_data["description"] = payload.description or None
    if payload.goalType is not None:
        update_data["goal_type"] = GOAL_TYPE_TO_DB.get(payload.goalType, "PERCENTAGE")
    if payload.targetValue is not None:
        update_data["target_value"] = payload.targetValue
    if payload.currentValue is not None:
        update_data["current_value"] = payload.currentValue
    if payload.measurementUnit is not None:
        update_data["measurement_unit"] = payload.measurementUnit
    if payload.status is not None:
        update_data["status"] = STATUS_TO_DB.get(payload.status, "IN_PROGRESS")
    if payload.priority is not None:
        update_data["priority"] = PRIORITY_TO_DB.get(payload.priority, "MEDIUM")
    if payload.progress is not None:
        update_data["progress"] = payload.progress
    if payload.startDate is not None:
        update_data["start_date"] = _to_iso(payload.startDate)
    if payload.dueDate is not None:
        update_data["due_date"] = _to_iso(payload.dueDate)
    if payload.hubId is not None:
        update_data["hub_id"] = payload.hubId or None
    if payload.projectId is not None:
        update_data["project_id"] = payload.projectId or None
    if payload.assignedTo is not None:
        update_data["assigned_to"] = payload.assignedTo or None

    if not update_data:
        return get_goal(client, goal_id)

    res = client.table("goals").update(update_data).eq("id", goal_id).execute()
    if not res.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found",
        )
    return _row_to_goal(res.data[0])


def delete_goal(client: Client, goal_id: str) -> None:
    """Delete a goal by id."""
    client.table("goals").delete().eq("id", goal_id).execute()
