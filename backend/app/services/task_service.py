"""Task service: CRUD against the Supabase `tasks` table with field mapping."""
from datetime import datetime, timezone
from typing import Any, Optional

from fastapi import HTTPException, status
from supabase import Client

from app.schemas.task import TaskCreate, TaskOut, TaskUpdate

# ── Enum mapping between frontend (lowercase) and DB (UPPERCASE) ──────────────
PRIORITY_TO_DB = {"low": "LOW", "medium": "MEDIUM", "high": "HIGH", "urgent": "URGENT"}
PRIORITY_FROM_DB = {v: k for k, v in PRIORITY_TO_DB.items()}

STATUS_TO_DB = {
    "not_started": "TODO",
    "in_progress": "IN_PROGRESS",
    "completed": "COMPLETED",
    "paused": "ARCHIVED",
    "overdue": "TODO",  # overdue is derived on read; persisted as TODO
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
        # Date-only string (YYYY-MM-DD) -> midnight UTC
        try:
            return datetime.fromisoformat(f"{value}T00:00:00").isoformat()
        except ValueError:
            return value


def _row_to_task(row: dict[str, Any]) -> TaskOut:
    """Map a DB row to the frontend-facing TaskOut model."""
    due_raw = row.get("due_date")
    due_date = due_raw.split("T")[0] if isinstance(due_raw, str) and due_raw else None

    db_status = row.get("status") or "TODO"
    fe_status = STATUS_FROM_DB.get(db_status, "not_started")

    # Derive overdue for non-completed tasks past their due date.
    if fe_status != "completed" and due_raw:
        try:
            if datetime.fromisoformat(due_raw.replace("Z", "+00:00")) < datetime.now(
                timezone.utc
            ):
                fe_status = "overdue"
        except ValueError:
            pass

    return TaskOut(
        id=str(row["id"]),
        title=row.get("title") or "",
        description=row.get("description") or "",
        dueDate=due_date,
        priority=PRIORITY_FROM_DB.get(row.get("priority") or "MEDIUM", "medium"),
        status=fe_status,
        projectId=row.get("project_id"),
        hubId=row.get("hub_id"),
        tags=[],
        subtasks=[],
        createdAt=row.get("created_at"),
    )


def list_tasks(client: Client, workspace_id: str) -> list[TaskOut]:
    """Return all tasks for a workspace, newest first."""
    res = (
        client.table("tasks")
        .select("*")
        .eq("workspace_id", workspace_id)
        .order("created_at", desc=True)
        .execute()
    )
    return [_row_to_task(row) for row in (res.data or [])]


def create_task(
    client: Client, workspace_id: str, profile_id: str, payload: TaskCreate
) -> TaskOut:
    """Insert a new task and return its mapped representation."""
    insert_data = {
        "workspace_id": workspace_id,
        "created_by": profile_id,
        "title": payload.title,
        "description": payload.description or None,
        "status": STATUS_TO_DB.get(payload.status, "TODO"),
        "priority": PRIORITY_TO_DB.get(payload.priority, "MEDIUM"),
        "due_date": _to_iso(payload.dueDate),
        "project_id": payload.projectId or None,
        "hub_id": payload.hubId or None,
    }
    res = client.table("tasks").insert(insert_data).execute()
    if not res.data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to create task"
        )
    return _row_to_task(res.data[0])


def update_task(client: Client, task_id: str, payload: TaskUpdate) -> TaskOut:
    """Apply a partial update to a task."""
    update_data: dict[str, Any] = {}
    if payload.title is not None:
        update_data["title"] = payload.title
    if payload.description is not None:
        update_data["description"] = payload.description or None
    if payload.status is not None:
        update_data["status"] = STATUS_TO_DB.get(payload.status, "TODO")
    if payload.priority is not None:
        update_data["priority"] = PRIORITY_TO_DB.get(payload.priority, "MEDIUM")
    if payload.dueDate is not None:
        update_data["due_date"] = _to_iso(payload.dueDate)
    if payload.projectId is not None:
        update_data["project_id"] = payload.projectId or None
    if payload.hubId is not None:
        update_data["hub_id"] = payload.hubId or None

    if not update_data:
        return get_task(client, task_id)

    res = client.table("tasks").update(update_data).eq("id", task_id).execute()
    if not res.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
        )
    return _row_to_task(res.data[0])


def get_task(client: Client, task_id: str) -> TaskOut:
    """Fetch a single task by id."""
    res = client.table("tasks").select("*").eq("id", task_id).limit(1).execute()
    if not res.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
        )
    return _row_to_task(res.data[0])


def delete_task(client: Client, task_id: str) -> None:
    """Delete a task by id."""
    client.table("tasks").delete().eq("id", task_id).execute()


def toggle_task(client: Client, task_id: str) -> TaskOut:
    """Toggle a task between completed and TODO."""
    current = client.table("tasks").select("status").eq("id", task_id).limit(1).execute()
    if not current.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
        )
    is_completed = current.data[0].get("status") == "COMPLETED"
    next_status = "TODO" if is_completed else "COMPLETED"
    update_data = {
        "status": next_status,
        "completed_at": None if is_completed else datetime.now(timezone.utc).isoformat(),
    }
    res = client.table("tasks").update(update_data).eq("id", task_id).execute()
    return _row_to_task(res.data[0])
