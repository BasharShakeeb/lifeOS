"""Assignment service: CRUD against the Supabase `assignments` table with field mapping."""
from datetime import datetime
from typing import Any, Optional

from fastapi import HTTPException, status
from supabase import Client

from app.schemas.assignment import AssignmentCreate, AssignmentOut, AssignmentUpdate

PRIORITY_TO_DB = {"low": "LOW", "medium": "MEDIUM", "high": "HIGH", "urgent": "URGENT"}
PRIORITY_FROM_DB = {v: k for k, v in PRIORITY_TO_DB.items()}

STATUS_TO_DB = {
    "pending": "TODO",
    "in_progress": "IN_PROGRESS",
    "submitted": "REVIEW",
    "graded": "COMPLETED",
}
STATUS_FROM_DB = {
    "TODO": "pending",
    "IN_PROGRESS": "in_progress",
    "REVIEW": "submitted",
    "COMPLETED": "graded",
    "CANCELLED": "pending",
    "ARCHIVED": "pending",
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


def _row_to_assignment(row: dict[str, Any]) -> AssignmentOut:
    """Map a DB row to the frontend-facing AssignmentOut model."""
    return AssignmentOut(
        id=str(row["id"]),
        title=row.get("title") or "",
        course=row.get("course"),
        subject=row.get("subject"),
        teacher=row.get("teacher"),
        description=row.get("description") or "",
        status=STATUS_FROM_DB.get(row.get("status") or "TODO", "pending"),
        priority=PRIORITY_FROM_DB.get(row.get("priority") or "MEDIUM", "medium"),
        progress=row.get("progress") or 0,
        submissionUrl=row.get("submission_url"),
        grade=row.get("grade"),
        semester=row.get("semester"),
        startDate=(row.get("start_date") or "").split("T")[0] if row.get("start_date") else None,
        dueDate=(row.get("due_date") or "").split("T")[0] if row.get("due_date") else None,
        hubId=row.get("hub_id"),
        projectId=row.get("project_id"),
        assignedTo=row.get("assigned_to"),
        createdAt=row.get("created_at"),
        updatedAt=row.get("updated_at"),
    )


def list_assignments(client: Client, workspace_id: str) -> list[AssignmentOut]:
    """Return all assignments for a workspace, newest first."""
    res = (
        client.table("assignments")
        .select("*")
        .eq("workspace_id", workspace_id)
        .order("created_at", desc=True)
        .execute()
    )
    return [_row_to_assignment(row) for row in (res.data or [])]


def create_assignment(
    client: Client, workspace_id: str, profile_id: str, payload: AssignmentCreate
) -> AssignmentOut:
    """Insert a new assignment and return its mapped representation."""
    insert_data = {
        "workspace_id": workspace_id,
        "hub_id": payload.hubId or None,
        "project_id": payload.projectId or None,
        "course": payload.course,
        "subject": payload.subject,
        "teacher": payload.teacher,
        "title": payload.title,
        "description": payload.description or None,
        "status": STATUS_TO_DB.get(payload.status, "TODO"),
        "priority": PRIORITY_TO_DB.get(payload.priority, "MEDIUM"),
        "progress": payload.progress,
        "submission_url": payload.submissionUrl,
        "grade": payload.grade,
        "semester": payload.semester,
        "start_date": _to_iso(payload.startDate),
        "due_date": _to_iso(payload.dueDate),
        "created_by": profile_id,
        "assigned_to": payload.assignedTo or None,
    }
    res = client.table("assignments").insert(insert_data).execute()
    if not res.data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create assignment",
        )
    return _row_to_assignment(res.data[0])


def get_assignment(client: Client, assignment_id: str) -> AssignmentOut:
    """Fetch a single assignment by id."""
    res = client.table("assignments").select("*").eq("id", assignment_id).limit(1).execute()
    if not res.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found",
        )
    return _row_to_assignment(res.data[0])


def update_assignment(client: Client, assignment_id: str, payload: AssignmentUpdate) -> AssignmentOut:
    """Apply a partial update to an assignment."""
    update_data: dict[str, Any] = {}
    if payload.title is not None:
        update_data["title"] = payload.title
    if payload.course is not None:
        update_data["course"] = payload.course
    if payload.subject is not None:
        update_data["subject"] = payload.subject
    if payload.teacher is not None:
        update_data["teacher"] = payload.teacher
    if payload.description is not None:
        update_data["description"] = payload.description or None
    if payload.status is not None:
        update_data["status"] = STATUS_TO_DB.get(payload.status, "TODO")
    if payload.priority is not None:
        update_data["priority"] = PRIORITY_TO_DB.get(payload.priority, "MEDIUM")
    if payload.progress is not None:
        update_data["progress"] = payload.progress
    if payload.submissionUrl is not None:
        update_data["submission_url"] = payload.submissionUrl
    if payload.grade is not None:
        update_data["grade"] = payload.grade
    if payload.semester is not None:
        update_data["semester"] = payload.semester
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
        return get_assignment(client, assignment_id)

    res = client.table("assignments").update(update_data).eq("id", assignment_id).execute()
    if not res.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found",
        )
    return _row_to_assignment(res.data[0])


def delete_assignment(client: Client, assignment_id: str) -> None:
    """Delete an assignment by id."""
    client.table("assignments").delete().eq("id", assignment_id).execute()
