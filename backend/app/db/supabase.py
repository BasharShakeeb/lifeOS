"""Per-request Supabase client factory.

Each request gets a client authenticated with the caller's access token so
that the existing Row Level Security (RLS) policies are enforced automatically.
"""
from fastapi import Depends
from supabase import Client, create_client

from app.core.auth import CurrentUser, get_current_user
from app.core.config import Settings, get_settings


def get_supabase(
    current_user: CurrentUser = Depends(get_current_user),
    settings: Settings = Depends(get_settings),
) -> Client:
    """Create a Supabase client scoped to the current user's JWT.

    Setting the Authorization header on PostgREST makes all queries run under
    the user's identity, so RLS policies apply exactly as in the frontend.
    """
    client = create_client(settings.supabase_url, settings.supabase_anon_key)
    client.postgrest.auth(current_user.access_token)
    return client
