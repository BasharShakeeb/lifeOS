"""Health record service: CRUD against the Supabase `health_records` table with field mapping."""
from datetime import datetime
from typing import Any, Optional

from fastapi import HTTPException, status
from supabase import Client

from app.schemas.health_record import HealthRecordCreate, HealthRecordOut, HealthRecordUpdate


def _to_iso(value: Optional[str]) -> Optional[str]:
    """Normalize a frontend date string into an ISO timestamp."""
    if not value:
        return None
    try:
        return datetime.fromisoformat(value).isoformat()
    except ValueError:
        try:
            return datetime.fromisoformat(f"{value}T00:00:00").isoformat()
        except ValueError:
            return value


def _row_to_health_record(row: dict[str, Any]) -> HealthRecordOut:
    """Map a DB row to the frontend-facing HealthRecordOut model."""
    record_date = row.get("record_date")
    return HealthRecordOut(
        id=str(row["id"]),
        date=(record_date or "").split("T")[0] if record_date else "",
        waterIntakeMl=int(row.get("water_intake_ml") or 0),
        sleepHours=float(row.get("sleep_hours") or 0.0),
        exerciseMinutes=int(row.get("exercise_minutes") or 0),
        weightKg=float(row.get("weight_kg")) if row.get("weight_kg") is not None else None,
        bloodPressure=row.get("blood_pressure"),
        caloriesBurned=int(row.get("calories_burned")) if row.get("calories_burned") is not None else None,
        notes=row.get("notes"),
        createdAt=row.get("created_at"),
    )


def list_health_records(client: Client, workspace_id: str) -> list[HealthRecordOut]:
    """Return all health records for a workspace, newest first."""
    res = (
        client.table("health_records")
        .select("*")
        .eq("workspace_id", workspace_id)
        .order("record_date", desc=True)
        .execute()
    )
    return [_row_to_health_record(row) for row in (res.data or [])]


def create_health_record(
    client: Client,
    workspace_id: str,
    profile_id: str,
    payload: HealthRecordCreate,
) -> HealthRecordOut:
    """Insert a new health record and return its mapped representation."""
    insert_data = {
        "workspace_id": workspace_id,
        "user_id": profile_id,
        "record_date": _to_iso(payload.date),
        "water_intake_ml": payload.waterIntakeMl,
        "sleep_hours": payload.sleepHours,
        "exercise_minutes": payload.exerciseMinutes,
        "weight_kg": payload.weightKg,
        "blood_pressure": payload.bloodPressure or None,
        "calories_burned": payload.caloriesBurned,
        "notes": payload.notes or None,
    }
    res = client.table("health_records").insert(insert_data).execute()
    if not res.data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create health record",
        )
    return _row_to_health_record(res.data[0])


def get_health_record(client: Client, health_record_id: str) -> HealthRecordOut:
    """Fetch a single health record by id."""
    res = client.table("health_records").select("*").eq("id", health_record_id).limit(1).execute()
    if not res.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Health record not found",
        )
    return _row_to_health_record(res.data[0])


def update_health_record(
    client: Client,
    health_record_id: str,
    payload: HealthRecordUpdate,
) -> HealthRecordOut:
    """Apply a partial update to a health record."""
    update_data: dict[str, Any] = {}
    if payload.date is not None:
        update_data["record_date"] = _to_iso(payload.date)
    if payload.waterIntakeMl is not None:
        update_data["water_intake_ml"] = payload.waterIntakeMl
    if payload.sleepHours is not None:
        update_data["sleep_hours"] = payload.sleepHours
    if payload.exerciseMinutes is not None:
        update_data["exercise_minutes"] = payload.exerciseMinutes
    if payload.weightKg is not None:
        update_data["weight_kg"] = payload.weightKg
    if payload.bloodPressure is not None:
        update_data["blood_pressure"] = payload.bloodPressure or None
    if payload.caloriesBurned is not None:
        update_data["calories_burned"] = payload.caloriesBurned
    if payload.notes is not None:
        update_data["notes"] = payload.notes or None

    if not update_data:
        return get_health_record(client, health_record_id)

    res = client.table("health_records").update(update_data).eq("id", health_record_id).execute()
    if not res.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Health record not found",
        )
    return _row_to_health_record(res.data[0])


def delete_health_record(client: Client, health_record_id: str) -> None:
    """Delete a health record by id."""
    client.table("health_records").delete().eq("id", health_record_id).execute()
