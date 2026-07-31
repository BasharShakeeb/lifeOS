-- ============================================================================
-- Migration 001: Fix entity fields to match the frontend data model.
-- ============================================================================
-- Purpose:
--   The Next.js frontend models `Habit`, `Goal`, and `HealthRecord` with fields
--   that the initial schema does not expose. This migration adds those columns
--   so future phases (habits, goals, health) can persist their data cleanly.
--
--   Phase 1 (tasks) is NOT affected: the `tasks` table already has every column
--   the tasks feature needs, so nothing here touches it.
--
-- How to apply:
--   Run this file manually in the Supabase SQL Editor (or via the Supabase CLI).
--   All statements are idempotent (IF NOT EXISTS) and safe to re-run.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- HABITS: add a free-text category (frontend `Habit.category`).
-- ----------------------------------------------------------------------------
ALTER TABLE public.habits
    ADD COLUMN IF NOT EXISTS category TEXT;

-- ----------------------------------------------------------------------------
-- GOALS: add a free-text category (frontend `Goal.category`).
-- ----------------------------------------------------------------------------
ALTER TABLE public.goals
    ADD COLUMN IF NOT EXISTS category TEXT;

-- ----------------------------------------------------------------------------
-- HEALTH RECORDS: replace the generic (record_type/value/unit) model with the
-- discrete metrics the frontend `HealthRecord` uses. The legacy generic columns
-- are kept (made nullable) so existing rows are preserved.
-- ----------------------------------------------------------------------------
ALTER TABLE public.health_records
    ADD COLUMN IF NOT EXISTS water_intake_ml   INTEGER,
    ADD COLUMN IF NOT EXISTS sleep_hours       NUMERIC(4,1),
    ADD COLUMN IF NOT EXISTS exercise_minutes  INTEGER,
    ADD COLUMN IF NOT EXISTS weight_kg         NUMERIC(5,2),
    ADD COLUMN IF NOT EXISTS calories_burned   INTEGER,
    ADD COLUMN IF NOT EXISTS blood_pressure    TEXT;

-- Make the legacy generic metric columns optional so the new discrete-metric
-- rows do not require them.
ALTER TABLE public.health_records
    ALTER COLUMN record_type DROP NOT NULL,
    ALTER COLUMN value       DROP NOT NULL,
    ALTER COLUMN unit        DROP NOT NULL;
