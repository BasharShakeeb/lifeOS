# TODO — Fix: Projects not loading after page refresh (F5)

## Goal
Ensure saved projects (and other initial data) are loaded from the database after
refreshing any dashboard page, including `/dashboard/projects`.

## Root Cause
`fetchInitialData()` was only invoked from the dashboard home page
(`app/dashboard/page.tsx`). When refreshing a subpage like `/dashboard/projects`,
the home component is not mounted, so no data fetch runs and the store stays empty.

## Steps
- [x] Analyze data flow (dashboard page → store → project repository → backend → Supabase)
- [x] Confirm root cause: initial data fetch only triggered from dashboard home page
- [x] Add initial data fetching to shared `AppLayout` (mounted on every dashboard route)
- [x] Remove duplicate `fetchInitialData` call from dashboard home page
- [x] Verify refresh of `/dashboard/projects` loads existing projects

