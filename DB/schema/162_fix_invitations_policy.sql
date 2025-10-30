-- Fix invitations INSERT policy to correctly enforce tenant and role
-- Ensures only owners/managers of the current tenant can create invitations

do $$
begin
  -- Replace existing insert policy with stricter, unambiguous logic
  if exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'invitations' and policyname = 'invitations_insert'
  ) then
    execute 'drop policy invitations_insert on public.invitations';
  end if;

  execute 'create policy invitations_insert on public.invitations for insert with check (company_id = request_company_id() and (is_owner() or is_manager()))';
end$$;

comment on policy invitations_insert on public.invitations is 'Only owners/managers of current tenant may insert invitations.';


