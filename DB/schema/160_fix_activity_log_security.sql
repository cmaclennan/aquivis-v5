-- Ensure the activity_log view does not bypass RLS by running with invoker rights
-- Postgres 15+: security_invoker=true makes the view respect the caller's privileges and RLS
DO $$
BEGIN
  -- If the view exists, set security_invoker to true
  IF EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relkind = 'v' AND n.nspname = 'public' AND c.relname = 'activity_log'
  ) THEN
    EXECUTE 'ALTER VIEW public.activity_log SET (security_invoker = true)';
  END IF;
END$$;

COMMENT ON VIEW public.activity_log IS 'Runs with invoker rights so underlying table RLS and caller permissions are enforced.';


