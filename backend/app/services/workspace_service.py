"""Workspace/profile resolution helpers.

Maps a Supabase auth user (auth.users.id) to their `profiles` row and their
default workspace, as created by the `handle_new_user` trigger on signup.
"""
from fastapi import HTTPException, status
from supabase import Client


def get_profile(client: Client, auth_user_id: str) -> dict:
    """Return the profile row linked to the given auth user id."""
    res = (
        client.table("profiles")
        .select("*")
        .eq("auth_user_id", auth_user_id)
        .limit(1)
        .execute()
    )
    if not res.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found for the authenticated user",
        )
    return res.data[0]


def get_default_workspace(client: Client, profile_id: str) -> dict:
    """Return the user's default (first-owned) workspace."""
    res = (
        client.table("workspaces")
        .select("*")
        .eq("owner_id", profile_id)
        .order("created_at", desc=False)
        .limit(1)
        .execute()
    )
    if not res.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No workspace found for the current user",
        )
    return res.data[0]
