# LifeOS - UI Components Library

## Overview

All pages in LifeOS must be built using reusable UI components.

Components should never be duplicated with different styles.

Every component must follow the Design System.

All modules should reuse the exact same components whenever possible.

---

# Layout Components

## App Layout

Purpose

Provides the main application structure.

Contains

- Fixed Sidebar
- Fixed Top Navigation
- Main Content Area

Used In

Every authenticated page.

---

## Sidebar

Purpose

Primary navigation.

Contains

- Logo
- Navigation Items
- Active Indicator
- Collapse Button (Tablet)
- User Profile (Bottom)

Navigation Items

- Dashboard
- Tasks
- Hubs
- Projects
- Assignments
- Habits
- Goals
- Health

Future

- Notes
- Calendar
- Reports
- Files
- Settings

Behavior

Desktop

Always visible.

Tablet

Collapsible.

Mobile

Hidden.

Replaced by Bottom Navigation.

---

## Top Navigation

Contains

- Search
- Filter Button
- Notifications
- User Avatar

Always fixed.

---

# Dashboard Components

## Statistics Card

Purpose

Displays summary information.

Contains

- Icon
- Title
- Value
- Trend
- Optional Mini Progress

Examples

Tasks Completed

Today's Habits

Goals Progress

Health Score

Reusable across all modules.

---

## Section Header

Contains

- Page Title
- Subtitle
- Primary Action Button

Example

Tasks

+ Add Task

---

# Data Display Components

## Data Table

Purpose

Displays collections of data.

Features

- Sorting
- Search
- Filtering
- Pagination
- Row Hover
- Context Menu

Used In

Tasks

Projects

Assignments

Health

Goals

Habits

---

## Card Grid

Purpose

Displays visual collections.

Used In

Dashboard

Projects

Hubs

Goals

Health

Responsive layout.

---

## List View

Purpose

Simple list representation.

Used In

Notifications

Recent Activity

History

Timeline

---

# Form Components

## Text Input

Single-line input.

Supports

- Label
- Placeholder
- Validation
- Helper Text

---

## Text Area

Multi-line input.

Supports

Descriptions

Notes

Comments

---

## Select Dropdown

Supports

Single Selection

Examples

Priority

Status

Hub

Project

Category

---

## Multi Select

Supports multiple values.

Examples

Tags

Labels

Categories

Members (Future)

---

## Date Picker

Supports

Single Date

Examples

Due Date

Start Date

Goal Date

Assignment Date

---

## Date Range Picker

Supports

Start Date

End Date

Used In

Projects

Reports

Goals

---

## Time Picker

Used For

Reminder Time

Meeting Time

Health Tracking

---

## Toggle Switch

Boolean values.

Examples

Recurring

Notifications

Completed

Private

---

## Checkbox

Multiple selections.

Examples

Filters

Bulk Actions

Permissions

---

## Radio Group

Single selection.

Examples

Priority

Gender

Health Type

---

## Slider

Used For

Progress

Percentage

Health Metrics

---

## File Upload

Supports

Documents

Images

PDF

Attachments

Drag & Drop enabled.

---

# Action Components

## Primary Button

Used For

Save

Create

Add

Confirm

---

## Secondary Button

Used For

Cancel

Back

Close

---

## Icon Button

Used For

Edit

Delete

View

Favorite

Archive

---

## Floating Action Button

Optional.

Mobile only.

Quick Add.

---

# Feedback Components

## Badge

Used For

Status

Priority

Category

Examples

Completed

Pending

High

Medium

Low

---

## Progress Bar

Used For

Task Progress

Goal Progress

Habit Completion

Health Tracking

---

## Toast Notification

Types

Success

Error

Warning

Information

Appears

Top Right

Auto dismiss.

---

## Alert

Persistent message.

Examples

System Warning

Validation Error

Connection Lost

---

## Confirmation Dialog

Used Before

Delete

Archive

Logout

Reset

---

## Loading Skeleton

Used while data loads.

Never use page spinners.

---

## Empty State

Contains

- Illustration
- Title
- Description
- Primary Button

Example

"No tasks yet."

Button

Create Task

---

# Overlay Components

## Drawer

Purpose

Create

Edit

Quick Forms

Slides from right.

Scrollable.

Width

Approximately 420px

Contains

- Form
- Save
- Cancel

---

## Modal

Purpose

View Details

Preview

Confirmation

Large centered dialog.

Scrollable.

Never used for long forms.

---

## Dropdown Menu

Appears on

Three-dot button.

Contains

Edit

Duplicate

Archive

Delete

---

## Tooltip

Appears on hover.

Short description only.

---

# Search Components

## Search Bar

Supports

Instant Search

Clear Button

Search Icon

Placeholder

---

## Filter Panel

Contains

Status

Priority

Date

Category

Tags

Apply

Reset

---

## Sort Menu

Options

Newest

Oldest

Name

Priority

Due Date

Alphabetical

---

# Navigation Components

## Breadcrumb

Not used.

LifeOS intentionally avoids breadcrumbs.

---

## Pagination

Bottom of tables.

Contains

Previous

Next

Page Numbers

Rows Per Page

---

## Tabs

Used inside Details Modal.

Examples

Project

- Overview
- Tasks
- Notes
- Files

Health

- Records
- Statistics
- History

Goal

- Overview
- Milestones
- Progress

---

# Charts

Only lightweight charts.

Allowed

- Line Chart
- Bar Chart
- Progress Ring
- Sparkline

Avoid

Complex dashboards.

3D charts.

Pie charts unless necessary.

---

# Mobile Components

## Bottom Navigation

Replaces Sidebar.

Maximum

5 Items

Additional items available through "More".

---

## Mobile Cards

Tables convert into cards.

One item per card.

Expandable.

---

## Full Screen Drawer

Drawer occupies full screen.

Sticky actions at bottom.

---

# Component Reuse Rules

Every module must reuse existing components.

Do not redesign buttons.

Do not redesign tables.

Do not redesign cards.

Do not redesign forms.

Do not redesign drawers.

Do not redesign modals.

Consistency is mandatory.

---

# Component Architecture

Application

├── Layout
│   ├── Sidebar
│   ├── Top Navigation
│   └── Main Content
│
├── Data Display
│   ├── Statistics Card
│   ├── Table
│   ├── Card Grid
│   └── List
│
├── Forms
│   ├── Input
│   ├── Textarea
│   ├── Select
│   ├── Date Picker
│   ├── Time Picker
│   ├── Toggle
│   ├── Checkbox
│   ├── Slider
│   └── File Upload
│
├── Actions
│   ├── Buttons
│   ├── Icon Buttons
│   └── Floating Action Button
│
├── Feedback
│   ├── Badge
│   ├── Progress
│   ├── Toast
│   ├── Alert
│   ├── Skeleton
│   └── Empty State
│
└── Overlays
    ├── Drawer
    ├── Modal
    ├── Dialog
    ├── Dropdown
    └── Tooltip