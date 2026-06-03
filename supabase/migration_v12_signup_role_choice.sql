-- Migration v12: allow a new user to choose a safe initial profile role

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  requested_role public.user_role;
BEGIN
  requested_role := CASE
    WHEN new.raw_user_meta_data->>'role' = 'producer' THEN 'producer'::public.user_role
    ELSE 'affiliate'::public.user_role
  END;

  INSERT INTO public.profiles (id, role, full_name)
  VALUES (
    new.id,
    requested_role,
    new.raw_user_meta_data->>'full_name'
  );

  RETURN new;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
