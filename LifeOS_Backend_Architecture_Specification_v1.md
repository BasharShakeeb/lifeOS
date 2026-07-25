# LifeOS Backend Architecture Specification (v1.0)

## Objective

Design and implement a production-ready backend for **LifeOS** using:

-   Next.js 16
-   TypeScript
-   Supabase
-   PostgreSQL
-   Supabase Auth
-   Row Level Security (RLS)

> **Important** Do **not** generate frontend code. Do **not** redesign
> existing UI. The frontend already exists. Generate only the backend
> architecture, SQL schema, and integration layer.

------------------------------------------------------------------------

# 1. Database Design

Design a normalized PostgreSQL database.

Requirements:

-   UUID primary keys
-   Foreign keys
-   Indexes
-   Constraints
-   ENUM types
-   created_at / updated_at
-   Soft delete where appropriate
-   Optimized for Supabase

------------------------------------------------------------------------

# 2. Entities

## Core

-   profiles
-   workspaces
-   hubs
-   user_settings

## Productivity

-   projects
-   categories
-   tasks
-   assignments
-   goals
-   habits
-   health_records

## Shared

-   tags
-   entity_tags
-   comments
-   attachments
-   reminders
-   notifications
-   activity_logs

## System

-   audit_logs

------------------------------------------------------------------------

# 3. Relationships

Workspace └── Hubs ├── Projects │ ├── Tasks │ ├── Assignments │ └──
Goals ├── Habits └── Categories

Shared tables (comments, attachments, tags, reminders, activity_logs)
must support Tasks, Projects, Goals, Habits and Assignments using:

-   entity_type
-   entity_id

------------------------------------------------------------------------

# 4. Entity Attributes

## profiles

-   id
-   auth_user_id
-   full_name
-   username
-   email
-   phone
-   avatar_url
-   bio
-   timezone
-   language
-   theme
-   is_active
-   last_login
-   created_at
-   updated_at

## workspaces

-   id
-   owner_id
-   name
-   description
-   logo_url
-   color
-   visibility
-   created_at
-   updated_at

## hubs

-   id
-   workspace_id
-   title
-   description
-   color
-   icon
-   cover_image
-   sort_order
-   is_archived
-   created_by
-   created_at
-   updated_at

## projects

-   id
-   workspace_id
-   hub_id
-   owner_id
-   title
-   description
-   status
-   priority
-   progress
-   color
-   icon
-   start_date
-   due_date
-   is_favorite
-   is_archived
-   created_at
-   updated_at

## categories

-   id
-   workspace_id
-   title
-   description
-   color
-   icon
-   created_by
-   created_at
-   updated_at

## tasks

-   id
-   workspace_id
-   hub_id
-   project_id
-   category_id
-   parent_task_id
-   created_by
-   assigned_to
-   title
-   description
-   status
-   priority
-   progress
-   start_date
-   due_date
-   completed_at
-   estimated_hours
-   actual_hours
-   repeat_type
-   reminder_at
-   color
-   icon
-   is_favorite
-   is_archived
-   created_at
-   updated_at

## assignments

-   id
-   workspace_id
-   hub_id
-   project_id
-   course
-   subject
-   teacher
-   title
-   description
-   status
-   priority
-   progress
-   submission_url
-   grade
-   semester
-   start_date
-   due_date
-   created_by
-   assigned_to
-   created_at
-   updated_at

## goals

-   id
-   workspace_id
-   hub_id
-   project_id
-   title
-   description
-   goal_type
-   target_value
-   current_value
-   measurement_unit
-   status
-   priority
-   progress
-   start_date
-   due_date
-   created_by
-   assigned_to
-   created_at
-   updated_at

## habits

-   id
-   workspace_id
-   hub_id
-   title
-   description
-   frequency
-   target_per_day
-   target_per_week
-   current_streak
-   best_streak
-   last_completed
-   status
-   color
-   icon
-   created_by
-   created_at
-   updated_at

## health_records

-   id
-   workspace_id
-   user_id
-   record_type
-   value
-   unit
-   record_date
-   notes
-   created_at

## Shared Tables

### tags

id, workspace_id, name, color, icon, created_at

### entity_tags

id, entity_type, entity_id, tag_id

### comments

id, entity_type, entity_id, user_id, content, created_at

### attachments

id, entity_type, entity_id, file_name, file_url, mime_type, file_size,
uploaded_by, uploaded_at

### reminders

id, entity_type, entity_id, remind_at, notification_type, is_sent,
created_at

### notifications

id, user_id, title, message, type, entity_type, entity_id, is_read,
created_at

### activity_logs

id, entity_type, entity_id, user_id, action, old_value, new_value,
created_at

### audit_logs

id, user_id, action, table_name, record_id, created_at

------------------------------------------------------------------------

# 5. ENUMS

Status: - TODO - IN_PROGRESS - REVIEW - COMPLETED - CANCELLED - ARCHIVED

Priority: - LOW - MEDIUM - HIGH - URGENT

Repeat: - NONE - DAILY - WEEKLY - MONTHLY - YEARLY - CUSTOM

Goal Type: - NUMBER - BOOLEAN - PERCENTAGE - TIME - MONEY

Workspace Visibility: - PRIVATE - TEAM - PUBLIC

Notification Type: - EMAIL - PUSH - IN_APP

------------------------------------------------------------------------

# 6. SQL Requirements

Generate:

-   CREATE TYPE
-   CREATE TABLE
-   FOREIGN KEYS
-   INDEXES
-   CHECK CONSTRAINTS
-   UNIQUE CONSTRAINTS
-   DEFAULT VALUES
-   TRIGGERS
-   updated_at trigger
-   UUID defaults

The SQL must run directly inside Supabase SQL Editor.

------------------------------------------------------------------------

# 7. Security

Enable RLS on all user tables.

Generate policies for:

-   SELECT
-   INSERT
-   UPDATE
-   DELETE

Each user should only access their own workspace data.

------------------------------------------------------------------------

# 8. Deliverables

Generate:

1.  Complete PostgreSQL SQL
2.  ER Diagram
3.  Relationships
4.  Constraints
5.  Indexes
6.  RLS Policies
7.  Documentation

Do not generate frontend code until the backend schema is complete.
