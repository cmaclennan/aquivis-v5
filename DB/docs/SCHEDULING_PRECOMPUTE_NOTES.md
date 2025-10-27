# Scheduling precompute notes

Reference: [cmaclennan/aquivis](https://github.com/cmaclennan/aquivis.git)

## Targets
- Precompute `scheduled_tasks` daily and on template/config changes
- UI reads only from `scheduled_tasks` for speed and simplicity

## Minimal templates (M1)
- weekly or twice-weekly per property/unit
- fields: company_id, property_id, unit_id, template_type, template_config, is_active

## Precompute job
- Trigger: cron (daily) + on change to `schedule_templates` or `property_rules`
- Action: generate rows in `scheduled_tasks` for the upcoming window (e.g., 14 days)
- Ensure idempotence: upsert by (company_id, property_id, unit_id, date, task_type)

## `scheduled_tasks` shape (M1)
- id, company_id, property_id, unit_id
- date, time (nullable for day-level tasks)
- task_type, priority, status

## Considerations from prior repo
- Avoid calculating per-request schedules; expensive and error-prone
- Keep rules simple first; add occupancy/seasonal overrides later
- Soft-delete or status transitions rather than hard delete

## Failure modes and mitigations
- Drift from templates → run daily regen + on-change hooks
- Duplicates → upsert keys and unique constraints
- Perf → indexes on (company_id, date) and variants by property/unit


