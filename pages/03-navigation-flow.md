# LifeOS - Navigation Flow

## Navigation Philosophy

LifeOS uses a simple and predictable navigation structure.

The application should minimize page changes.

Most user actions should happen inside the current page using:

- Drawers
- Modals
- Context Menus

Avoid creating unnecessary pages.

---

# Application Flow

Landing Page

↓

Login

↓

Dashboard Home

↓

Modules

No other pages should appear before authentication.

---

# Public Routes

/

Landing Page

/login

Login

No Register page.

No Pricing page.

No Subscription page.

No Checkout page.

---

# Private Routes

/dashboard

Dashboard Home

/dashboard/tasks

Tasks

/dashboard/hubs

Hubs

/dashboard/projects

Projects

/dashboard/assignments

Assignments

/dashboard/habits

Habits

/dashboard/goals

Goals

/dashboard/health

Health

Future:

/dashboard/notes

/dashboard/calendar

/dashboard/reports

/dashboard/files

/dashboard/settings

---

# Dashboard Navigation

Dashboard

│

├── Tasks

├── Hubs

├── Projects

├── Assignments

├── Habits

├── Goals

├── Health

└── Settings

---

# Sidebar Navigation

The Sidebar is always visible on Desktop.

Contains:

Dashboard

Tasks

Hubs

Projects

Assignments

Habits

Goals

Health

Future:

Notes

Calendar

Reports

Files

Settings

Only one active item.

Active item uses Primary Green.

---

# Dashboard Flow

Landing

↓

Login

↓

Dashboard Home

↓

Choose Module

↓

Open Module

---

# Tasks Flow

Tasks

↓

View Task List

↓

Click "Add Task"

↓

Open Drawer

↓

Save

↓

Update List

----------------

Click Task

↓

Open Task Details Modal

↓

Edit

↓

Save

↓

Close

----------------

Three Dot Menu

↓

Duplicate

Archive

Delete

---

# Hubs Flow

Hubs

↓

View Hub List

↓

Add Hub

↓

Drawer

↓

Save

↓

Refresh

----------------

Click Hub

↓

Hub Details

↓

View Projects

↓

View Tasks

↓

View Goals

↓

Close

---

# Projects Flow

Projects

↓

View Projects

↓

Add Project

↓

Drawer

↓

Save

↓

Refresh

----------------

Click Project

↓

Project Details

↓

Tasks

↓

Files

↓

Notes

↓

Goals

↓

Close

---

# Assignments Flow

Assignments

↓

View Assignments

↓

Add Assignment

↓

Drawer

↓

Save

↓

Refresh

----------------

Click Assignment

↓

Assignment Details

↓

Edit

↓

Close

---

# Habits Flow

Habits

↓

Habit List

↓

Add Habit

↓

Drawer

↓

Save

↓

Refresh

----------------

Click Habit

↓

Habit Details

↓

History

↓

Statistics

↓

Close

---

# Goals Flow

Goals

↓

Goal List

↓

Add Goal

↓

Drawer

↓

Save

↓

Refresh

----------------

Click Goal

↓

Goal Details

↓

Progress

↓

Milestones

↓

Close

---

# Health Flow

Health

↓

Health Dashboard

↓

Add Health Record

↓

Drawer

↓

Save

↓

Refresh

----------------

Click Record

↓

Health Details

↓

Edit

↓

Delete

↓

Close

---

# Drawer Rules

Drawer is used for:

Create

Edit

Quick Forms

Always slides from the right.

Never opens as a new page.

---

# Modal Rules

Modal is used for:

Details

Preview

Confirmation

Never for long forms.

---

# Context Menu

Every table row includes:

Edit

Duplicate

Archive

Delete

No separate action page.

---

# Search Flow

Search

↓

Instant Results

↓

Filter

↓

Sort

↓

Open Item

---

# Notification Flow

Notification

↓

Click Notification

↓

Navigate to Related Module

↓

Open Related Details

---

# Authentication Flow

Landing

↓

Login

↓

Google Authentication

↓

Dashboard

If authentication fails:

Return to Login

Show Error

---

# Logout Flow

Settings

↓

Logout

↓

Return to Landing Page

---

# Mobile Navigation

Sidebar becomes Bottom Navigation.

Drawers become Full Screen.

Tables become Cards.

---

# Desktop Navigation

Sidebar fixed.

Top Navigation fixed.

Main Content scrolls.

---

# UX Rules

Never navigate to another page for:

Adding data

Editing data

Viewing details

Always use Drawers and Modals.

Only Sidebar navigation changes pages.

Everything else happens inside the current screen.

---

# Navigation Summary

Landing
    ↓
Login
    ↓
Dashboard
    ├── Tasks
    ├── Hubs
    ├── Projects
    ├── Assignments
    ├── Habits
    ├── Goals
    ├── Health
    └── Settings

Each module follows the same interaction pattern:

List
↓
Search
↓
Filter
↓
Add (Drawer)
↓
Details (Modal)
↓
Edit (Drawer)
↓
Save
↓
Refresh