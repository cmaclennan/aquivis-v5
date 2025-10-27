# Index plan mapped to hot filters and SLOs

Reference: [cmaclennan/aquivis](https://github.com/cmaclennan/aquivis.git)

## SLO targets
- Desktop TTFB < 300ms for Inbox/Properties/Services lists
- p95 API < 400ms; zero unindexed scans

## Hot list views and filters

### Task Inbox (scheduled_tasks)
- filters: company_id, date range (date), status, property_id, unit_id, priority
- indexes:
  - (company_id, date)
  - (company_id, status, date)
  - (company_id, property_id, date)
  - (company_id, unit_id, date)

### Properties list
- filters: company_id, name prefix
- indexes:
  - (company_id, name)

### Services list
- filters: company_id, property_id, unit_id, service_date range, status
- indexes:
  - (company_id, service_date)
  - (company_id, property_id, service_date)
  - (company_id, unit_id, service_date)
  - (company_id, status, service_date)

### Units list
- filters: property_id, unit_type
- indexes:
  - (property_id, unit_type)

### Equipment
- filters: property_id, maintenance_scheduled, category
- indexes:
  - (property_id, maintenance_scheduled)
  - (property_id, category)

## Views-first for lists
- Create lightweight denormalized views to serve list UIs (select only fields needed by the page).

## Verification
- EXPLAIN ANALYZE on each list query in CI.
- Log slow queries and fail budgets when unindexed scans occur.


