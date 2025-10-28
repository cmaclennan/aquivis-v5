-- Hot-path indices
create index if not exists idx_properties_company on properties(company_id);
create index if not exists idx_units_property on units(property_id) where is_active;
create index if not exists idx_services_property_date on services(property_id, service_date);
create index if not exists idx_scheduled_tasks_company_date on scheduled_tasks(company_id, date);
create index if not exists idx_scheduled_tasks_property_date on scheduled_tasks(property_id, date);

-- Unique key for precompute idempotence
create unique index if not exists uniq_scheduled_task_key on scheduled_tasks(company_id, property_id, coalesce(unit_id, '00000000-0000-0000-0000-000000000000'::uuid), date, task_type, coalesce(time_slot,'_'));

