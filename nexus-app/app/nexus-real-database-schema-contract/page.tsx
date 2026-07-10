export default function NexusRealDatabaseSchemaContractPage() {
  return (
    <main>
      <h1>NEXUS Real Database Schema Contract</h1>

      <p>
        Day 624 contract for controlled and tenant-isolated real database
        architecture readiness.
      </p>

      <p>
        This contract defines mandatory schema, ownership, integrity and safety
        requirements before any future live database implementation can be
        considered. It does not authorize a database connection, migration or
        real write.
      </p>

      <h2>Tenant Ownership Contract</h2>

      <ul>
        <li>Every business tenant must have one stable and unique tenant record.</li>
        <li>Every tenant-owned record must contain a non-null tenant_id.</li>
        <li>Every tenant_id must reference an existing tenant record.</li>
        <li>Tenant ownership cannot be removed after record creation without a controlled migration.</li>
        <li>Tenant ownership cannot be reassigned through an ordinary update operation.</li>
        <li>PPA Industrial Solution records must remain assigned only to the PPA tenant.</li>
      </ul>

      <h2>Required Entity Contract</h2>

      <ul>
        <li>business_profiles must belong to exactly one tenant.</li>
        <li>inquiries must belong to exactly one tenant.</li>
        <li>catalog_items must belong to exactly one tenant.</li>
        <li>risk_flags must belong to exactly one tenant.</li>
        <li>owner_approvals must belong to exactly one tenant.</li>
        <li>quotation_drafts must belong to exactly one tenant.</li>
        <li>audit_records must belong to exactly one tenant.</li>
        <li>customer_memories must belong to exactly one tenant.</li>
        <li>follow_up_states must belong to exactly one tenant.</li>
        <li>subscription_entitlements must belong to exactly one tenant.</li>
      </ul>

      <h2>Record Integrity Contract</h2>

      <ul>
        <li>Every primary record must use a stable unique identifier.</li>
        <li>Required fields cannot be silently stored as null.</li>
        <li>Foreign-key relationships must reject invalid references.</li>
        <li>Created timestamps must not be rewritten through ordinary updates.</li>
        <li>Updated timestamps must reflect controlled record changes.</li>
        <li>Owner approvals must reference a target record from the same tenant.</li>
        <li>Risk flags must reference records from the same tenant.</li>
        <li>Quotation drafts must reference inquiries and catalog items from the same tenant.</li>
        <li>Follow-up states must reference customers or inquiries from the same tenant.</li>
      </ul>

      <h2>Access Isolation Contract</h2>

      <ul>
        <li>Every read must be filtered by the authenticated tenant identity.</li>
        <li>Every insert must use the authenticated tenant identity.</li>
        <li>Every update must verify existing tenant ownership.</li>
        <li>Every delete request must verify existing tenant ownership.</li>
        <li>Cross-tenant reads are forbidden.</li>
        <li>Cross-tenant writes are forbidden.</li>
        <li>Cross-tenant approvals are forbidden.</li>
        <li>Cross-tenant customer-memory access is forbidden.</li>
        <li>Cross-tenant subscription entitlement changes are forbidden.</li>
      </ul>

      <h2>Audit and Safety Contract</h2>

      <ul>
        <li>Future audit records must be append-only by default.</li>
        <li>Audit records must retain actor, tenant, action and timestamp references.</li>
        <li>Audit records cannot be silently moved between tenants.</li>
        <li>High-risk actions must require an owner-approval reference.</li>
        <li>Rejected actions must not be represented as successfully executed.</li>
        <li>Subscription locks must default to denied when entitlement is missing or invalid.</li>
        <li>Database failures must fail closed rather than bypass tenant isolation.</li>
      </ul>

      <h2>Authorization Boundary</h2>

      <ul>
        <li>No real database connection is authorized.</li>
        <li>No schema migration is authorized.</li>
        <li>No real database read or write is authorized.</li>
        <li>No real audit write is authorized.</li>
        <li>No real customer memory write is authorized.</li>
        <li>No customer signup is authorized.</li>
        <li>No public launch is authorized.</li>
        <li>No payment automation is authorized.</li>
        <li>No WhatsApp auto-send is authorized.</li>
        <li>No uncontrolled AI action or real execution is authorized.</li>
      </ul>
    </main>
  );
}
