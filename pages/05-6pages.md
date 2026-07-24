TODO_LIST/
│
├── image/
│   ├── landingpage.png
│   ├── login.png
│   ├── dashboard.png
│   ├── task.png
│   ├── hub.png
│   ├── project.png
│   ├── assignment.png
│   ├── habits.png
│   ├── goals.png
│   └── health.png
│
└── docs/
    ├── 01-project-overview.md
    ├── 02-design-system.md
    ├── 03-navigation-flow.md
    ├── 04-components.md
    ├── 05-pages.md   ← يحتوي أيضًا على Database Mapping إذا أردت
    ├── 07-user-flows.md
    ├── 08-responsive-rules.md
    ├── 09-ui-rules.md
    └── 10-stitch-prompt.md


    # LifeOS - Pages Documentation

## Overview

This directory contains the complete specification for every page in LifeOS.

Each page document includes:

- Purpose
- Layout
- Components
- Statistics
- Main Content
- Search
- Filters
- Primary Actions
- Drawers
- Detail Modals
- Empty State
- Loading State
- Error State
- Responsive Behavior

Every page must follow the shared Design System and Components Library.

---

## Page Structure

### 01. Landing

File

pages/01-landing.md

Purpose

Introduce LifeOS and guide users to authentication.

---

### 02. Login

File

pages/02-login.md

Purpose

Authenticate users using Google or Email.

---

### 03. Dashboard

File

pages/03-dashboard.md

Purpose

Provide a complete overview of user productivity.

---

### 04. Tasks

File

pages/04-tasks.md

Purpose

Manage all personal tasks.

---

### 05. Hubs

File

pages/05-hubs.md

Purpose

Organize life into categories.

---

### 06. Projects

File

pages/06-projects.md

Purpose

Manage projects inside Hubs.

---

### 07. Assignments

File

pages/07-assignments.md

Purpose

Track academic assignments.

---

### 08. Habits

File

pages/08-habits.md

Purpose

Track recurring habits.

---

### 09. Goals

File

pages/09-goals.md

Purpose

Manage long-term objectives.

---

### 10. Health

File

pages/10-health.md

Purpose

Monitor health metrics and daily wellness.

---

## Shared Rules

Every page includes:

- Fixed Sidebar
- Fixed Top Navigation
- Search
- Filter
- Statistics Cards
- Main Content Area
- Primary Action Button
- Drawer for Create/Edit
- Modal for Details
- Empty State
- Loading State
- Responsive Layout

No page should introduce custom UI patterns that differ from the Design System.