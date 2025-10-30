-- Set a stable search_path for update_updated_at_column to avoid role-mutable lookups
-- This ensures all references are resolved in the intended schema and reduces attack surface
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'update_updated_at_column' AND p.pronargs = 0
  ) THEN
    EXECUTE 'ALTER FUNCTION public.update_updated_at_column() SET search_path = public, pg_temp';
  END IF;
END$$;

COMMENT ON FUNCTION public.update_updated_at_column() IS 'Stable search_path (public, pg_temp) to prevent role-mutable resolution.';


