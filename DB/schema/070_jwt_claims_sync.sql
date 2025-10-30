-- Sync profile changes to Supabase Auth user_metadata
-- This ensures JWT contains company_id and role for RLS

-- Create function to update user_metadata in auth.users
create or replace function sync_user_metadata()
returns trigger
security definer
set search_path = public
language plpgsql
as $$
declare
  v_user_id uuid;
  v_company_id uuid;
  v_role text;
begin
  -- Get values from the profile
  v_user_id := new.id;
  v_company_id := new.company_id;
  v_role := new.role;

  -- Update auth.users.user_metadata
  update auth.users
  set raw_user_meta_data = jsonb_set(
    coalesce(raw_user_meta_data, '{}'::jsonb),
    '{company_id}',
    to_jsonb(v_company_id)
  )
  where id = v_user_id;

  update auth.users
  set raw_user_meta_data = jsonb_set(
    raw_user_meta_data,
    '{role}',
    to_jsonb(v_role)
  )
  where id = v_user_id;

  return new;
end;
$$;

-- Create trigger to sync on profile changes
drop trigger if exists sync_user_metadata_trigger on profiles;
create trigger sync_user_metadata_trigger
  after insert or update of company_id, role on profiles
  for each row
  execute function sync_user_metadata();

-- Backfill: Update existing profiles' JWT claims
-- This is safe to run multiple times
do $$
declare
  profile_record record;
begin
  for profile_record in 
    select id, company_id, role from profiles
  loop
    update auth.users
    set raw_user_meta_data = jsonb_set(
      coalesce(raw_user_meta_data, '{}'::jsonb),
      '{company_id}',
      to_jsonb(profile_record.company_id)
    )
    where id = profile_record.id;

    update auth.users
    set raw_user_meta_data = jsonb_set(
      raw_user_meta_data,
      '{role}',
      to_jsonb(profile_record.role)
    )
    where id = profile_record.id;
  end loop;
end $$;

