Tenancy & Roles
- All core tables include company_id
- Roles: owner, manager, technician (plus optional super_admin)

Policies (outline)
- SELECT: company_id = request_company_id()
- INSERT/UPDATE: role-based; technicians can write services/tests/photos they created
- DELETE: owner/manager for their company

JWT Claims
- company_id, role embedded in Supabase JWT

Helpers
- request_company_id() stable function
- is_owner(), is_manager(), is_technician() boolean helpers

