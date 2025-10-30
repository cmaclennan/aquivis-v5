-- Allow owners/managers to delete pending (unaccepted) invitations in their company

do $$
begin
  if exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'invitations' and policyname = 'invitations_delete'
  ) then
    execute 'drop policy invitations_delete on public.invitations';
  end if;

  execute '
    create policy invitations_delete on public.invitations
      for delete
      using (
        company_id in (select company_id from public.profiles where id = auth.uid())
        and exists (
          select 1 from public.profiles p
          where p.id = auth.uid() and p.role in (''owner'',''manager'')
        )
        and accepted_at is null
      )
  ';
end$$;

comment on policy invitations_delete on public.invitations is 'Owners/managers can delete pending invitations within their company.';


