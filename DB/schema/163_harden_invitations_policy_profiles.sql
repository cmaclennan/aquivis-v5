-- Harden invitations INSERT policy to not depend on JWT claims
-- Use authoritative checks against profiles for tenant and role

do $$
begin
  if exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'invitations' and policyname = 'invitations_insert'
  ) then
    execute 'drop policy invitations_insert on public.invitations';
  end if;

  execute '
    create policy invitations_insert on public.invitations
      for insert
      with check (
        company_id in (select company_id from public.profiles where id = auth.uid())
        and exists (
          select 1 from public.profiles p
          where p.id = auth.uid() and p.role in (''owner'',''manager'')
        )
      )
  ';
end$$;

comment on policy invitations_insert on public.invitations is 'Owners/managers can invite within their company (checked via profiles, not JWT).';


