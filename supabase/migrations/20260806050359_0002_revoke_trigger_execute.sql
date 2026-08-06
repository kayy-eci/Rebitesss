/*
# Revoke public execute on handle_new_user trigger

The handle_new_user() trigger function is SECURITY DEFINER and only meant to be
called by the Postgres trigger engine on auth.users INSERT — never by API clients.
Revoke EXECUTE from anon and authenticated so it cannot be invoked via /rest/v1/rpc.
*/

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
