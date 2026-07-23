import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "../engineeringAIWorkforceDevelopmentPlanDecision";

import {
  ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID,
} from "../engineeringAIWorkforceFormalQualificationTestPlan";

import {
  ENGINEERING_AI_WORKFORCE_TEMPLATE_REGISTRY,
} from "../engineeringAIWorkforceTemplateCreationExecution";

import {
  ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_ISSUANCE,
} from "../engineeringAIWorkforceFormalQualificationIssuance";

import {
  ENGINEERING_AI_WORKFORCE_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE,
  createEngineeringAIWorkforceQualifiedEmployeeManifestIssuance,
  validateEngineeringAIWorkforceQualifiedEmployeeManifestIssuance,
  type EngineeringAIWorkforceQualifiedEmployeeManifestIssuance,
} from "../engineeringAIWorkforceQualifiedEmployeeManifestIssuance";

function input() {
  return {
    manifestIssuanceId:
      "engineering-qualified-manifest-test-001",

    formalQualificationIssuance:
      ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_ISSUANCE,

    templateRegistry:
      ENGINEERING_AI_WORKFORCE_TEMPLATE_REGISTRY,

    tenantId:
      ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID,

    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,

    createdAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_ISSUANCE
            .qualifiedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering AI Workforce qualified employee manifest issuance",
  () => {
    it(
      "creates exactly eight qualified employee manifests",
      () => {
        const issuance =
          createEngineeringAIWorkforceQualifiedEmployeeManifestIssuance(
            input(),
          );

        expect(
          issuance.issuanceState,
        ).toBe(
          "ENGINEERING_QUALIFIED_EMPLOYEE_MANIFESTS_CREATED",
        );

        expect(
          issuance.candidateManifests,
        ).toHaveLength(8);

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
      "preserves exact Engineering candidate identities and sequence",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE
            .candidateManifests
            .map(
              (record) =>
                record.publicName,
            ),
        ).toEqual([
          "Ishaan",
          "Leela",
          "Vivaan",
          "Anaya",
          "Atharv",
          "Mahir",
          "Zara",
          "Advik",
        ]);

        expect(
          ENGINEERING_AI_WORKFORCE_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE
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
        ]);
      },
    );

    it(
      "preserves registered roles skills tool grants policies and safety boundaries",
      () => {
        ENGINEERING_AI_WORKFORCE_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE
          .candidateManifests
          .forEach(
            (
              record,
              index,
            ) => {
              const template =
                ENGINEERING_AI_WORKFORCE_TEMPLATE_REGISTRY
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
      "records the complete eight-manifest aggregate summary",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE
            .aggregateSummary,
        ).toEqual({
          formallyQualifiedCandidateCount:
            8,

          qualifiedManifestCount:
            8,

          qualifiedEvaluationCount:
            8,

          totalQualificationCasesPassed:
            800,

          exactEightQualifiedManifestsCreated:
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
            8,

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
            createEngineeringAIWorkforceQualifiedEmployeeManifestIssuance({
              ...input(),

              formalQualificationIssuance: {
                ...ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_ISSUANCE,
              },
            }),
        ).toThrow(
          "canonical Engineering formal qualification issuance",
        );

        expect(
          () =>
            createEngineeringAIWorkforceQualifiedEmployeeManifestIssuance({
              ...input(),

              templateRegistry: {
                ...ENGINEERING_AI_WORKFORCE_TEMPLATE_REGISTRY,
              },
            }),
        ).toThrow(
          "canonical Engineering template registry",
        );
      },
    );

    it(
      "blocks cross-tenant and cross-owner qualified-manifest creation",
      () => {
        expect(
          () =>
            createEngineeringAIWorkforceQualifiedEmployeeManifestIssuance({
              ...input(),

              tenantId:
                "tenant-other-001" as typeof ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID,
            }),
        ).toThrow(
          "Cross-tenant",
        );

        expect(
          () =>
            createEngineeringAIWorkforceQualifiedEmployeeManifestIssuance({
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
            createEngineeringAIWorkforceQualifiedEmployeeManifestIssuance({
              ...input(),

              createdAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_ISSUANCE
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
          ENGINEERING_AI_WORKFORCE_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE;

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
          ENGINEERING_AI_WORKFORCE_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE
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
          createEngineeringAIWorkforceQualifiedEmployeeManifestIssuance(
            input(),
          );

        const second =
          createEngineeringAIWorkforceQualifiedEmployeeManifestIssuance(
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
        ).toBe(8);

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
            validateEngineeringAIWorkforceQualifiedEmployeeManifestIssuance(
              first,
            ),
        ).not.toThrow();

        const tampered =
          {
            ...first,

            manifestIssuanceDigest:
              "0".repeat(64),
          } as
            EngineeringAIWorkforceQualifiedEmployeeManifestIssuance;

        expect(
          () =>
            validateEngineeringAIWorkforceQualifiedEmployeeManifestIssuance(
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
