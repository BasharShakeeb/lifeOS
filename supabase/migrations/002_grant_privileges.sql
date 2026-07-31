-- ============================================================================
-- Migration 002: Grant table privileges to Supabase API roles.
-- ============================================================================
-- Problem:
--   schema.sql created the tables and RLS policies but never granted table
--   privileges, so API queries fail with:
--   42501 "permission denied for table profiles".
--
--   Table privileges (GRANT) and RLS policies are two separate layers:
--   the role must first be allowed to touch the table at all, then RLS
--   filters which rows it can actually see/modify.
--
-- How to apply:
--   Run this file in the Supabase SQL Editor. Safe to re-run.
-- ============================================================================

-- Allow the API roles to access the public schema.
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Standard Supabase grants: full table access for API roles.
-- Row Level Security still restricts each user to their own rows.
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

-- Ensure any tables created later automatically receive the same grants.
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
