-- NEXUS function-only table access hardening.
--
-- Supabase initializes public tables with default service_role privileges
-- including MAINTAIN, REFERENCES, TRIGGER, and TRUNCATE.
--
-- These four tables are intentionally accessible only through audited
-- SECURITY DEFINER functions. Remove all direct service_role table access.

revoke all privileges
on table public.nexus_controlled_pilot_resume_audit_events
from service_role;

revoke all privileges
on table public.nexus_provider_continuity_leases
from service_role;

revoke all privileges
on table public.nexus_provider_continuity_records
from service_role;

revoke all privileges
on table public.nexus_provider_continuity_scope_counters
from service_role;
