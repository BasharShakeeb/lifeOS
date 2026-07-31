"""JWT authentication dependency for verifying Supabase access tokens.

Supports both signing schemes:
- New asymmetric keys (ES256/RS256): verified against the project's public
  JWKS endpoint (Settings > JWT Keys > JWT Signing Keys).
- Legacy shared secret (HS256): verified with SUPABASE_JWT_SECRET.
The scheme is chosen per-token from its unverified header's `alg` field.
"""
from dataclasses import dataclass
from functools import lru_cache

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import PyJWKClient

from app.core.config import Settings, get_settings

_bearer_scheme = HTTPBearer(auto_error=False)


@lru_cache
def _get_jwks_client(supabase_url: str) -> PyJWKClient:
    """Return a cached JWKS client for the project's public signing keys."""
    return PyJWKClient(f"{supabase_url}/auth/v1/.well-known/jwks.json")


@dataclass
class CurrentUser:
    """Authenticated user resolved from a verified Supabase JWT."""

    user_id: str
    access_token: str


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer_scheme),
    settings: Settings = Depends(get_settings),
) -> CurrentUser:
    """Verify the Bearer token and return the current user.

    Raises 401 if the token is missing, malformed, or fails verification.
    """
    if credentials is None or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials

    try:
        header = jwt.get_unverified_header(token)
        alg = header.get("alg", "")
        if alg == "HS256":
            # Legacy shared-secret tokens.
            payload = jwt.decode(
                token,
                settings.supabase_jwt_secret,
                algorithms=["HS256"],
                audience="authenticated",
            )
        else:
            # New asymmetric signing keys (e.g. ES256) verified via JWKS.
            signing_key = _get_jwks_client(settings.supabase_url).get_signing_key_from_jwt(token)
            payload = jwt.decode(
                token,
                signing_key.key,
                algorithms=["ES256", "RS256"],
                audience="authenticated",
            )
    except jwt.PyJWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication token: {exc}",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token does not contain a subject",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return CurrentUser(user_id=user_id, access_token=token)
