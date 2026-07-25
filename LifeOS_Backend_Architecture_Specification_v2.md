# Database Enhancement Request (LifeOS v1.1)

The current PostgreSQL/Supabase schema is already implemented.

Do NOT redesign the existing database.

Do NOT rename existing tables or columns.

Only extend the current schema with the following improvements.

---

## 1. Checklist System

Implement a reusable checklist system for tasks.

Create two new tables:

### checklists

Fields:

- id (UUID Primary Key)
- task_id (Foreign Key -> tasks.id ON DELETE CASCADE)
- title
- created_at
- updated_at

### checklist_items

Fields:

- id (UUID Primary Key)
- checklist_id (Foreign Key -> checklists.id ON DELETE CASCADE)
- title
- is_completed (Boolean Default False)
- sort_order
- completed_at
- created_at
- updated_at

Requirements:

- One task can contain multiple checklists.
- One checklist can contain multiple checklist items.
- Automatically update updated_at using the existing trigger function.

---

## 2. Additional Database Constraints

Improve data integrity by adding CHECK constraints.

For Tasks:

CHECK (estimated_hours >= 0)

CHECK (actual_hours >= 0)

For Goals:

CHECK (target_value >= 0)

CHECK (current_value >= 0)

For Habits:

CHECK (target_per_day >= 0)

CHECK (target_per_week >= 0)

CHECK (current_streak >= 0)

CHECK (best_streak >= 0)

For Health Records:

CHECK (value >= 0)

Do not modify existing business logic.

Only prevent invalid negative values.

---

## 3. Performance

Create indexes for:

- checklist.task_id
- checklist_items.checklist_id
- checklist_items.is_completed

---

## 4. Security

Enable Row Level Security (RLS) on:

- checklists
- checklist_items

Create policies identical to the Tasks table so only users within the same workspace can access checklist data.

---

## 5. TypeScript

Update:

- database.types.ts

Generate types for:

- checklists
- checklist_items

---

## 6. Repository Layer

Extend the repository with CRUD methods for:

- Create Checklist
- Update Checklist
- Delete Checklist

- Create Checklist Item
- Toggle Checklist Item Completion
- Delete Checklist Item

Do not modify existing repository methods.

Only extend them.

---

## 7. Documentation

Update README.md with:

- ER Diagram
- Checklist relationships
- New constraints
- New RLS policies

Maintain compatibility with the existing database schema.