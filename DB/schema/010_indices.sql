-- Hot-path indices
create index if not exists idx_properties_company on properties(company_id);
create index if not exists idx_units_property on units(property_id) where is_active;
create index if not exists idx_services_property_date on services(property_id, service_date);
create index if not exists idx_scheduled_tasks_company_date on scheduled_tasks(company_id, date);
create index if not exists idx_scheduled_tasks_property_date on scheduled_tasks(property_id, date);

