import { describe, expect, it } from "vitest"

import {
  activateProviderIncidentContainment,
  checkProviderDomainOperationPermission,
  releaseResolvedProviderContainment,
} from "../providerIncidentContainmentCoordinator"
import {
  InMemoryProviderIncidentContainmentRegistry,
} from "../providerIncidentContainment"
import {
  InMemoryProviderIncidentRegistry,
} from "../providerIncidentRegistry"
import type {
  ProviderIncidentSeverity,
} from "../providerIncidentClassifier"
import type {
  ProviderDomain,
} from "../providerRecoveryQueue"

const openIncident = (
  incidentRegistry:
    InMemoryProviderIncidentRegistry,
  input: {
    incidentId: string
    tenantId: string
    providerDomain: ProviderDomain
    severity: ProviderIncidentSeverity
  },
) =>
  incidentRegistry.open(
    input.incidentId,
    {
      traceId: `${input.incidentId}:trace`,
      tenantId: input.tenantId,
      operationId: `${input.incidentId}:operation`,
      providerDomain: input.providerDomain,
      severity: input.severity,
      requiresOwnerEscalation:
        input.severity === "high" ||
        input.severity === "critical",
      reasonCodes:
        input.severity === "critical"
          ? [
              "all-providers-unavailable",
              "critical-domain-interruption",
            ]
          : ["all-providers-unavailable"],
      failedAttempts: 1,
      skippedAttempts: 1,
      queueItemId: `${input.incidentId}:queue`,
      firstObservedAt: 10,
      lastObservedAt: 20,
    },
  )

describe("critical provider incident containment", () => {
  it("automatically contains a critical provider domain", () => {
    let now = 100

    const incidentRegistry =
      new InMemoryProviderIncidentRegistry(
        () => now++,
      )
    const containmentRegistry =
      new InMemoryProviderIncidentContainmentRegistry(
        () => now++,
      )

    const incident = openIncident(
      incidentRegistry,
      {
        incidentId: "database-critical",
        tenantId: "tenant-a",
        providerDomain: "database",
        severity: "critical",
      },
    )

    const containment =
      activateProviderIncidentContainment(
        incident.incidentId,
        "tenant-a",
        {
          incidentRegistry,
          containmentRegistry,
        },
      )

    expect(containment).toMatchObject({
      tenantId: "tenant-a",
      providerDomain: "database",
      triggerIncidentId: "database-critical",
      status: "active",
      reason: "critical-provider-incident",
    })

    expect(
      checkProviderDomainOperationPermission(
        "tenant-a",
        "database",
        containmentRegistry,
      ),
    ).toMatchObject({
      allowed: false,
      code: "PROVIDER_DOMAIN_CONTAINED",
      tenantId: "tenant-a",
      providerDomain: "database",
    })
  })

  it("does not contain a non-critical incident", () => {
    const incidentRegistry =
      new InMemoryProviderIncidentRegistry(
        () => 200,
      )
    const containmentRegistry =
      new InMemoryProviderIncidentContainmentRegistry(
        () => 201,
      )

    const incident = openIncident(
      incidentRegistry,
      {
        incidentId: "messaging-high",
        tenantId: "tenant-a",
        providerDomain: "messaging",
        severity: "high",
      },
    )

    const containment =
      activateProviderIncidentContainment(
        incident.incidentId,
        "tenant-a",
        {
          incidentRegistry,
          containmentRegistry,
        },
      )

    expect(containment).toBeNull()

    expect(
      checkProviderDomainOperationPermission(
        "tenant-a",
        "messaging",
        containmentRegistry,
      ),
    ).toEqual({
      allowed: true,
      code: "PROVIDER_DOMAIN_OPERATION_ALLOWED",
      tenantId: "tenant-a",
      providerDomain: "messaging",
      activeContainmentIds: [],
    })
  })

  it("blocks containment release before incident resolution", () => {
    let now = 300

    const incidentRegistry =
      new InMemoryProviderIncidentRegistry(
        () => now++,
      )
    const containmentRegistry =
      new InMemoryProviderIncidentContainmentRegistry(
        () => now++,
      )

    const incident = openIncident(
      incidentRegistry,
      {
        incidentId: "payments-critical",
        tenantId: "tenant-a",
        providerDomain: "payments",
        severity: "critical",
      },
    )

    const containment =
      activateProviderIncidentContainment(
        incident.incidentId,
        "tenant-a",
        {
          incidentRegistry,
          containmentRegistry,
        },
      )

    expect(() =>
      releaseResolvedProviderContainment(
        {
          containmentId:
            containment!.containmentId,
          incidentId: incident.incidentId,
          tenantId: "tenant-a",
          ownerId: "owner-a",
          reason: "unsafe early release",
        },
        {
          incidentRegistry,
          containmentRegistry,
        },
      ),
    ).toThrow(
      "provider incident must be owner-acknowledged and resolved before containment release",
    )
  })

  it("allows owner release after acknowledgement and resolution", () => {
    let now = 400

    const incidentRegistry =
      new InMemoryProviderIncidentRegistry(
        () => now++,
      )
    const containmentRegistry =
      new InMemoryProviderIncidentContainmentRegistry(
        () => now++,
      )

    const incident = openIncident(
      incidentRegistry,
      {
        incidentId: "database-restored",
        tenantId: "tenant-a",
        providerDomain: "database",
        severity: "critical",
      },
    )

    const containment =
      activateProviderIncidentContainment(
        incident.incidentId,
        "tenant-a",
        {
          incidentRegistry,
          containmentRegistry,
        },
      )

    incidentRegistry.acknowledge({
      incidentId: incident.incidentId,
      tenantId: "tenant-a",
      ownerId: "owner-a",
      reason: "incident reviewed",
    })

    incidentRegistry.resolve({
      incidentId: incident.incidentId,
      tenantId: "tenant-a",
      ownerId: "owner-a",
      reason: "provider recovery verified",
    })

    const released =
      releaseResolvedProviderContainment(
        {
          containmentId:
            containment!.containmentId,
          incidentId: incident.incidentId,
          tenantId: "tenant-a",
          ownerId: "owner-a",
          reason: "safe operation restored",
        },
        {
          incidentRegistry,
          containmentRegistry,
        },
      )

    expect(released.status).toBe("released")
    expect(released.release?.ownerId).toBe(
      "owner-a",
    )

    expect(
      checkProviderDomainOperationPermission(
        "tenant-a",
        "database",
        containmentRegistry,
      ).allowed,
    ).toBe(true)
  })

  it("keeps containment tenant-isolated", () => {
    const incidentRegistry =
      new InMemoryProviderIncidentRegistry(
        () => 500,
      )
    const containmentRegistry =
      new InMemoryProviderIncidentContainmentRegistry(
        () => 501,
      )

    const incident = openIncident(
      incidentRegistry,
      {
        incidentId: "private-critical",
        tenantId: "tenant-a",
        providerDomain: "payments",
        severity: "critical",
      },
    )

    const containment =
      activateProviderIncidentContainment(
        incident.incidentId,
        "tenant-a",
        {
          incidentRegistry,
          containmentRegistry,
        },
      )

    expect(
      containmentRegistry.getForTenant(
        containment!.containmentId,
        "tenant-b",
      ),
    ).toBeNull()

    expect(
      checkProviderDomainOperationPermission(
        "tenant-b",
        "payments",
        containmentRegistry,
      ).allowed,
    ).toBe(true)

    expect(() =>
      releaseResolvedProviderContainment(
        {
          containmentId:
            containment!.containmentId,
          incidentId: incident.incidentId,
          tenantId: "tenant-b",
          ownerId: "owner-b",
          reason: "unauthorized release",
        },
        {
          incidentRegistry,
          containmentRegistry,
        },
      ),
    ).toThrow(
      "provider incident was not found for tenant",
    )
  })

  it("keeps a domain contained until every active incident is released", () => {
    let now = 600

    const incidentRegistry =
      new InMemoryProviderIncidentRegistry(
        () => now++,
      )
    const containmentRegistry =
      new InMemoryProviderIncidentContainmentRegistry(
        () => now++,
      )

    const firstIncident = openIncident(
      incidentRegistry,
      {
        incidentId: "database-incident-one",
        tenantId: "tenant-a",
        providerDomain: "database",
        severity: "critical",
      },
    )

    const secondIncident = openIncident(
      incidentRegistry,
      {
        incidentId: "database-incident-two",
        tenantId: "tenant-a",
        providerDomain: "database",
        severity: "critical",
      },
    )

    const firstContainment =
      activateProviderIncidentContainment(
        firstIncident.incidentId,
        "tenant-a",
        {
          incidentRegistry,
          containmentRegistry,
        },
      )

    const secondContainment =
      activateProviderIncidentContainment(
        secondIncident.incidentId,
        "tenant-a",
        {
          incidentRegistry,
          containmentRegistry,
        },
      )

    for (const incident of [
      firstIncident,
      secondIncident,
    ]) {
      incidentRegistry.acknowledge({
        incidentId: incident.incidentId,
        tenantId: "tenant-a",
        ownerId: "owner-a",
        reason: "incident reviewed",
      })

      incidentRegistry.resolve({
        incidentId: incident.incidentId,
        tenantId: "tenant-a",
        ownerId: "owner-a",
        reason: "provider recovery verified",
      })
    }

    releaseResolvedProviderContainment(
      {
        containmentId:
          firstContainment!.containmentId,
        incidentId: firstIncident.incidentId,
        tenantId: "tenant-a",
        ownerId: "owner-a",
        reason: "first incident resolved",
      },
      {
        incidentRegistry,
        containmentRegistry,
      },
    )

    expect(
      checkProviderDomainOperationPermission(
        "tenant-a",
        "database",
        containmentRegistry,
      ),
    ).toMatchObject({
      allowed: false,
      code: "PROVIDER_DOMAIN_CONTAINED",
      activeContainmentIds: [
        secondContainment!.containmentId,
      ],
    })

    releaseResolvedProviderContainment(
      {
        containmentId:
          secondContainment!.containmentId,
        incidentId: secondIncident.incidentId,
        tenantId: "tenant-a",
        ownerId: "owner-a",
        reason: "second incident resolved",
      },
      {
        incidentRegistry,
        containmentRegistry,
      },
    )

    expect(
      checkProviderDomainOperationPermission(
        "tenant-a",
        "database",
        containmentRegistry,
      ).allowed,
    ).toBe(true)
  })
})
