import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "../engineeringAIWorkforceDevelopmentPlanDecision";

import {
  AUTONOMOUS_GLOBAL_GROWTH_INTERNAL_TENANT_ID,
} from "../autonomousGlobalGrowthFormalQualificationTestPlan";

import {
  AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_REGISTRY,
} from "../autonomousGlobalGrowthAIEmployeeTemplateCreationExecution";

import {
  AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_ISSUANCE,
} from "../autonomousGlobalGrowthFormalQualificationIssuance";

import {
  AUTONOMOUS_GLOBAL_GROWTH_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE,
  createAutonomousGlobalGrowthQualifiedEmployeeManifestIssuance,
  validateAutonomousGlobalGrowthQualifiedEmployeeManifestIssuance,
  type AutonomousGlobalGrowthQualifiedEmployeeManifestIssuance,
} from "../autonomousGlobalGrowthQualifiedEmployeeManifestIssuance";

function input() {
  return {
    manifestIssuanceId:
      "autonomous-global-growth-qualified-manifest-test-001",

    formalQualificationIssuance:
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_ISSUANCE,

    templateRegistry:
      AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_REGISTRY,

    tenantId:
      AUTONOMOUS_GLOBAL_GROWTH_INTERNAL_TENANT_ID,

    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,

    createdAt:
      new Date(
        Date.parse(
          AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_ISSUANCE
            .qualifiedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Autonomous Global Growth AI Workforce qualified employee manifest issuance",
  () => {
    it(
      "creates exactly nine qualified employee manifests",
      () => {
        const issuance =
          createAutonomousGlobalGrowthQualifiedEmployeeManifestIssuance(
            input(),
          );

        expect(
          issuance.issuanceState,
        ).toBe(
          "AUTONOMOUS_GLOBAL_GROWTH_QUALIFIED_EMPLOYEE_MANIFESTS_CREATED",
        );

        expect(
          issuance.candidateManifests,
        ).toHaveLength(9);

        expect(
          issuance.candidateManifests.every(
            (record) =>
              record.qualifiedManifest
                .evaluation.status ===
                "QUALIFIED" &&
              record.qualifiedManifest
                .evaluation.testCasesPassed ===
                100 &&
              record.authorityBoundary
                .qualifiedManifestCreated ===
                true,
          ),
        ).toBe(true);
      },
    );

    it(
      "preserves exact Autonomous Global Growth candidate identities and sequence",
      () => {
        expect(
          AUTONOMOUS_GLOBAL_GROWTH_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE
            .candidateManifests
            .map(
              (record) =>
                record.publicName,
            ),
        ).toEqual([
          "Niyara",
          "Rivaan",
          "Ahaana",
          "Kairav",
          "Samyra",
          "Ruhan",
          "Tavisha",
          "Yuvaan",
          "Vedanshi",
        ]);

        expect(
          AUTONOMOUS_GLOBAL_GROWTH_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE
            .candidateManifests
            .map(
              (record) =>
                record.developmentSequence,
            ),
        ).toEqual([
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
        ]);
      },
    );

    it(
      "preserves registered roles skills tool grants policies and safety boundaries",
      () => {
        AUTONOMOUS_GLOBAL_GROWTH_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE
          .candidateManifests
          .forEach(
            (
              record,
              index,
            ) => {
              const template =
                AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_REGISTRY
                  .templates[index];

              expect(template).toBeDefined();

              expect(
                record.qualifiedManifest
                  .roleTitle,
              ).toBe(
                template?.manifest.roleTitle,
              );

              expect(
                record.qualifiedManifest
                  .skills,
              ).toEqual(
                template?.manifest.skills,
              );

              expect(
                record.qualifiedManifest
                  .toolGrants,
              ).toEqual(
                template?.manifest.toolGrants,
              );

              expect(
                record.qualifiedManifest
                  .approvalPolicy,
              ).toEqual(
                template?.manifest
                  .approvalPolicy,
              );

              expect(
                record.qualifiedManifest
                  .safetyBoundary,
              ).toMatchObject({
                ownerControlled:
                  true,

                emergencyPauseRequired:
                  true,

                crossTenantAccessAuthorized:
                  false,

                liveProviderExecutionAuthorized:
                  false,

                externalDeliveryAuthorized:
                  false,

                paymentExecutionAuthorized:
                  false,

                publicLaunchAuthorized:
                  false,
              });
            },
          );
      },
    );

    it(
      "records the complete nine-manifest aggregate summary",
      () => {
        expect(
          AUTONOMOUS_GLOBAL_GROWTH_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE
            .aggregateSummary,
        ).toEqual({
          formallyQualifiedCandidateCount:
            9,

          qualifiedManifestCount:
            9,

          qualifiedEvaluationCount:
            9,

          totalQualificationCasesPassed:
            900,

          exactNineQualifiedManifestsCreated:
            true,

          exactCandidateSequencePreserved:
            true,

          exactRegisteredIdentitiesPreserved:
            true,

          exactRegisteredRolesPreserved:
            true,

          exactRegisteredSkillsPreserved:
            true,

          exactRegisteredToolGrantsPreserved:
            true,

          exactRegisteredSafetyBoundariesPreserved:
            true,

          uniqueQualifiedManifestDigests:
            9,

          activationCandidatesCreated:
            0,

          runtimesActivated:
            0,

          controlledWorkAuthorizations:
            0,
        });
      },
    );

    it(
      "requires canonical formal qualification and template sources",
      () => {
        expect(
          () =>
            createAutonomousGlobalGrowthQualifiedEmployeeManifestIssuance({
              ...input(),

              formalQualificationIssuance: {
                ...AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_ISSUANCE,
              },
            }),
        ).toThrow(
          "canonical Autonomous Global Growth formal qualification issuance",
        );

        expect(
          () =>
            createAutonomousGlobalGrowthQualifiedEmployeeManifestIssuance({
              ...input(),

              templateRegistry: {
                ...AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_REGISTRY,
              },
            }),
        ).toThrow(
          "canonical Autonomous Global Growth template registry",
        );
      },
    );

    it(
      "blocks cross-tenant and cross-owner qualified-manifest creation",
      () => {
        expect(
          () =>
            createAutonomousGlobalGrowthQualifiedEmployeeManifestIssuance({
              ...input(),

              tenantId:
                "tenant-other-001" as typeof AUTONOMOUS_GLOBAL_GROWTH_INTERNAL_TENANT_ID,
            }),
        ).toThrow(
          "Cross-tenant",
        );

        expect(
          () =>
            createAutonomousGlobalGrowthQualifiedEmployeeManifestIssuance({
              ...input(),

              ownerId:
                "owner-other-001" as typeof ENGINEERING_AI_WORKFORCE_OWNER_ID,
            }),
        ).toThrow(
          "qualification-bound NEXUS owner",
        );
      },
    );

    it(
      "blocks qualified-manifest issuance before formal qualification",
      () => {
        expect(
          () =>
            createAutonomousGlobalGrowthQualifiedEmployeeManifestIssuance({
              ...input(),

              createdAt:
                new Date(
                  Date.parse(
                    AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_ISSUANCE
                      .qualifiedAt,
                  ) - 1,
                ).toISOString(),
            }),
        ).toThrow(
          "cannot precede formal qualification",
        );
      },
    );

    it(
      "does not create activation candidates paused runtimes or controlled work authority",
      () => {
        const issuance =
          AUTONOMOUS_GLOBAL_GROWTH_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE;

        expect(
          issuance.authorityBoundary,
        ).toMatchObject({
          qualifiedManifestCreated:
            true,

          activationCandidatePreparationAuthorized:
            false,

          activationCandidateCreated:
            false,

          ownerActivationRecorded:
            false,

          runtimeActivated:
            false,

          controlledWorkAuthorized:
            false,
        });

        expect(
          "activationCandidates" in
            issuance,
        ).toBe(false);

        expect(
          "pausedRuntimes" in
            issuance,
        ).toBe(false);
      },
    );

    it(
      "keeps repository production customer payment autonomy and public launch blocked",
      () => {
        expect(
          AUTONOMOUS_GLOBAL_GROWTH_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE
            .authorityBoundary,
        ).toMatchObject({
          repositoryReadAuthorized:
            false,

          repositoryWriteAuthorized:
            false,

          branchCreationAuthorized:
            false,

          pullRequestPreparationAuthorized:
            false,

          mergeAuthorized:
            false,

          productionDeploymentAuthorized:
            false,

          secretsAccessAuthorized:
            false,

          realCustomerDataAccessAuthorized:
            false,

          realCustomerContactAuthorized:
            false,

          externalDeliveryAuthorized:
            false,

          liveProviderExecutionAuthorized:
            false,

          productionDatabaseAuthorized:
            false,

          productionMutationAuthorized:
            false,

          paymentExecutionAuthorized:
            false,

          financialCommitmentAuthorized:
            false,

          legalCommitmentAuthorized:
            false,

          autonomousDecisionAuthorized:
            false,

          productionReadinessAuthorized:
            false,

          publicLaunchAuthorized:
            false,
        });
      },
    );

    it(
      "creates deterministic immutable digest-verified qualified-manifest issuance",
      () => {
        const first =
          createAutonomousGlobalGrowthQualifiedEmployeeManifestIssuance(
            input(),
          );

        const second =
          createAutonomousGlobalGrowthQualifiedEmployeeManifestIssuance(
            input(),
          );

        expect(second).toEqual(first);

        expect(
          first.manifestIssuanceDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          new Set(
            first.candidateManifests.map(
              (record) =>
                record.qualifiedManifestDigest,
            ),
          ).size,
        ).toBe(9);

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.candidateManifests,
          ),
        ).toBe(true);

        expect(
          first.candidateManifests.every(
            (record) =>
              Object.isFrozen(record) &&
              Object.isFrozen(
                record.qualifiedManifest,
              ),
          ),
        ).toBe(true);

        expect(
          () =>
            validateAutonomousGlobalGrowthQualifiedEmployeeManifestIssuance(
              first,
            ),
        ).not.toThrow();

        const tampered =
          {
            ...first,

            manifestIssuanceDigest:
              "0".repeat(64),
          } as
            AutonomousGlobalGrowthQualifiedEmployeeManifestIssuance;

        expect(
          () =>
            validateAutonomousGlobalGrowthQualifiedEmployeeManifestIssuance(
              tampered,
            ),
        ).toThrow(
          "integrity is invalid",
        );
      },
      15_000,
    );
  },
);
