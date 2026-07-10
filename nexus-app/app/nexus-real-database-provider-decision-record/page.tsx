export default function NexusRealDatabaseProviderDecisionRecordPage() {
  return (
    <main>
      <h1>NEXUS Real Database Provider Decision Record</h1>

      <p>
        Day 628 decision record for selecting the future controlled database
        foundation for NEXUS.
      </p>

      <p>
        PostgreSQL is selected as the required database engine. Supabase is the
        preferred managed provider for the first controlled implementation
        because it supports PostgreSQL, row-level security, authentication
        integration, migrations, backups and environment separation.
      </p>

      <h2>Selected Foundation</h2>

      <ul>
        <li>Database engine: PostgreSQL.</li>
        <li>Preferred managed provider: Supabase.</li>
        <li>Tenant isolation: PostgreSQL row-level security.</li>
        <li>Schema changes: version-controlled migrations only.</li>
        <li>Privileged credentials: server-side environment variables only.</li>
        <li>Production secrets: never committed to Git.</li>
      </ul>

      <h2>Selection Requirements</h2>

      <ul>
        <li>Native support for strict tenant isolation.</li>
        <li>Foreign keys, unique constraints and transactional integrity.</li>
        <li>Separate development, preview and production environments.</li>
        <li>Backup, recovery and credential rotation support.</li>
        <li>Controlled authentication integration.</li>
        <li>Audit-compatible timestamps and stable identifiers.</li>
        <li>Ability to fail closed when tenant identity is missing.</li>
      </ul>

      <h2>Rejected Architecture Patterns</h2>

      <ul>
        <li>No shared records without tenant_id.</li>
        <li>No browser-exposed service-role credential.</li>
        <li>No direct production schema editing without migration history.</li>
        <li>No unrestricted database client access.</li>
        <li>No cross-tenant administrative shortcut.</li>
        <li>No real customer data inside local test environments.</li>
        <li>No production database reuse for development testing.</li>
      </ul>

      <h2>Environment Contract</h2>

      <ul>
        <li>Local development must use isolated development configuration.</li>
        <li>Preview deployments must not use unrestricted production credentials.</li>
        <li>Production must use dedicated protected credentials.</li>
        <li>Service-role access must remain server-only and narrowly controlled.</li>
        <li>Credential rotation must be possible without code changes.</li>
        <li>Every environment must preserve the same tenant-isolation rules.</li>
      </ul>

      <h2>Current Authorization Boundary</h2>

      <ul>
        <li>This record selects an architecture direction only.</li>
        <li>No Supabase project creation is authorized by this page.</li>
        <li>No live database connection is authorized.</li>
        <li>No schema migration is authorized.</li>
        <li>No real database read or write is authorized.</li>
        <li>No real audit or customer-memory write is authorized.</li>
        <li>No customer signup or public launch is authorized.</li>
        <li>No payment automation is authorized.</li>
        <li>No WhatsApp auto-send is authorized.</li>
        <li>No uncontrolled AI action or real execution is authorized.</li>
      </ul>
    </main>
  );
}
