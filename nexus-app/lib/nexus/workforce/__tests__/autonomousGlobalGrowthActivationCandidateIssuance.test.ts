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
} from "../autonomousGlobalGrowthQualifiedEmployeeManifestIssuance";

import {
  AUTONOMOUS_GLOBAL_GROWTH_ACTIVATION_CANDIDATE_ISSUANCE,
  createAutonomousGlobalGrowthActivationCandidateIssuance,
  validateAutonomousGlobalGrowthActivationCandidateIssuance,
  type AutonomousGlobalGrowthActivationCandidateIssuance,
} from "../autonomousGlobalGrowthActivationCandidateIssuance";

function input() {
  return {
    activationCandidateIssuanceId:
      "autonomous-global-growth-activation-candidate-test-001",

    qualifiedManifestIssuance:
      AUTONOMOUS_GLOBAL_GROWTH_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE,

    formalQualificationIssuance:
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_ISSUANCE,

    templateRegistry:
      AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_REGISTRY,

    tenantId:
      AUTONOMOUS_GLOBAL_GROWTH_INTERNAL_TENANT_ID,

    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,

    preparedAt:
      new Date(
        Date.parse(
          AUTONOMOUS_GLOBAL_GROWTH_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE
            .createdAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Autonomous Global Growth AI Workforce activation-candidate issuance",
  () => {
    it(
      "prepares exactly nine activation candidates",
      () => {
        const issuance =
          createAutonomousGlobalGrowthActivationCandidateIssuance(
            input(),
          );

        expect(
          issuance.issuanceState,
        ).toBe(
          "AUTONOMOUS_GLOBAL_GROWTH_ACTIVATION_CANDIDATES_PREPARED",
        );

        expect(
          issuance.candidateIssuances,
        ).toHaveLength(9);

        expect(
          issuance.candidateIssuances.every(
            (record) =>
              record.activationCandidate
                .activationEligible ===
                true &&
              record.activationCandidate
                .ownerActivationRequired ===
                true,
          ),
        ).toBe(true);
      },
    );

    it(
      "preserves exact Autonomous Global Growth candidate identities and sequence",
      () => {
        expect(
          AUTONOMOUS_GLOBAL_GROWTH_ACTIVATION_CANDIDATE_ISSUANCE
            .candidateIssuances
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
          AUTONOMOUS_GLOBAL_GROWTH_ACTIVATION_CANDIDATE_ISSUANCE
            .candidateIssuances
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
      "creates nine paused runtimes awaiting explicit owner activation",
      () => {
        expect(
          AUTONOMOUS_GLOBAL_GROWTH_ACTIVATION_CANDIDATE_ISSUANCE
            .candidateIssuances
            .every(
              (record) => {
                const runtime =
                  record.activationCandidate
                    .pausedRuntime;

                return (
                  runtime.runtimeState ===
                    "PAUSED_AWAITING_OWNER" &&
                  runtime.ownerActivated ===
                    false &&
                  runtime.controlledWorkAuthorized ===
                    false
                );
              },
            ),
        ).toBe(true);
      },
    );

    it(
      "preserves exact qualified-manifest and qualification bindings",
      () => {
        AUTONOMOUS_GLOBAL_GROWTH_ACTIVATION_CANDIDATE_ISSUANCE
          .candidateIssuances
          .forEach(
            (
              record,
              index,
            ) => {
              const manifest =
                AUTONOMOUS_GLOBAL_GROWTH_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE
                  .candidateManifests[index];

              const qualification =
                AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_ISSUANCE
                  .candidateIssuances[index];

              expect(
                record.qualifiedManifestDigest,
              ).toBe(
                manifest
                  ?.qualifiedManifestDigest,
              );

              expect(
                record.qualificationDigest,
              ).toBe(
                qualification
                  ?.qualificationDigest,
              );

              expect(
                record.activationCandidate
                  .qualifiedManifest
                  .manifestDigest,
              ).toBe(
                manifest
                  ?.qualifiedManifestDigest,
              );
            },
          );
      },
    );

    it(
      "records the complete activation-candidate aggregate summary",
      () => {
        expect(
          AUTONOMOUS_GLOBAL_GROWTH_ACTIVATION_CANDIDATE_ISSUANCE
            .aggregateSummary,
        ).toEqual({
          qualifiedManifestCount:
            9,

          activationCandidateCount:
            9,

          pausedRuntimeCount:
            9,

          ownerActivationRequiredCount:
            9,

          ownerActivationDecisionCount:
            0,

          activatedRuntimeCount:
            0,

          controlledWorkAuthorizationCount:
            0,

          exactNineActivationCandidatesPrepared:
            true,

          exactCandidateSequencePreserved:
            true,

          exactCandidateIdentityPreserved:
            true,

          exactQualifiedManifestBindingsPreserved:
            true,

          uniqueActivationCandidateDigests:
            9,

          uniquePausedRuntimeDigests:
            9,
        });
      },
    );

    it(
      "requires canonical manifest qualification and template sources",
      () => {
        expect(
          () =>
            createAutonomousGlobalGrowthActivationCandidateIssuance({
              ...input(),

              qualifiedManifestIssuance: {
                ...AUTONOMOUS_GLOBAL_GROWTH_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE,
              },
            }),
        ).toThrow(
          "canonical Autonomous Global Growth qualified-manifest issuance",
        );

        expect(
          () =>
            createAutonomousGlobalGrowthActivationCandidateIssuance({
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
            createAutonomousGlobalGrowthActivationCandidateIssuance({
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
      "blocks cross-tenant and cross-owner activation-candidate preparation",
      () => {
        expect(
          () =>
            createAutonomousGlobalGrowthActivationCandidateIssuance({
              ...input(),

              tenantId:
                "tenant-other-001" as typeof AUTONOMOUS_GLOBAL_GROWTH_INTERNAL_TENANT_ID,
            }),
        ).toThrow(
          "Cross-tenant",
        );

        expect(
          () =>
            createAutonomousGlobalGrowthActivationCandidateIssuance({
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
      "blocks activation candidates before qualified-manifest issuance",
      () => {
        expect(
          () =>
            createAutonomousGlobalGrowthActivationCandidateIssuance({
              ...input(),

              preparedAt:
                new Date(
                  Date.parse(
                    AUTONOMOUS_GLOBAL_GROWTH_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE
                      .createdAt,
                  ) - 1,
                ).toISOString(),
            }),
        ).toThrow(
          "cannot precede qualified-manifest issuance",
        );
      },
    );

    it(
      "does not record owner activation or authorize runtime work",
      () => {
        const issuance =
          AUTONOMOUS_GLOBAL_GROWTH_ACTIVATION_CANDIDATE_ISSUANCE;

        expect(
          issuance.nextStep,
        ).toBe(
          "AWAIT_AUTONOMOUS_GLOBAL_GROWTH_OWNER_ACTIVATION_DECISION",
        );

        expect(
          issuance.authorityBoundary,
        ).toMatchObject({
          activationCandidatePrepared:
            true,

          pausedRuntimeCreated:
            true,

          ownerActivationDecisionRequired:
            true,

          ownerActivationDecisionRecorded:
            false,

          runtimeActivationExecuted:
            false,

          runtimeActivated:
            false,

          controlledWorkAuthorized:
            false,
        });

        expect(
          "ownerActivationDecision" in
            issuance,
        ).toBe(false);

        expect(
          "activatedRuntimes" in
            issuance,
        ).toBe(false);
      },
    );

    it(
      "keeps repository production customer payment autonomy and launch blocked",
      () => {
        expect(
          AUTONOMOUS_GLOBAL_GROWTH_ACTIVATION_CANDIDATE_ISSUANCE
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
      "creates deterministic immutable digest-verified activation-candidate issuance",
      () => {
        const first =
          createAutonomousGlobalGrowthActivationCandidateIssuance(
            input(),
          );

        const second =
          createAutonomousGlobalGrowthActivationCandidateIssuance(
            input(),
          );

        expect(second).toEqual(first);

        expect(
          first.issuanceDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          new Set(
            first.candidateIssuances.map(
              (record) =>
                record.activationCandidateDigest,
            ),
          ).size,
        ).toBe(9);

        expect(
          new Set(
            first.candidateIssuances.map(
              (record) =>
                record.pausedRuntimeDigest,
            ),
          ).size,
        ).toBe(9);

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.candidateIssuances,
          ),
        ).toBe(true);

        expect(
          first.candidateIssuances.every(
            (record) =>
              Object.isFrozen(record) &&
              Object.isFrozen(
                record.activationCandidate,
              ) &&
              Object.isFrozen(
                record.activationCandidate
                  .pausedRuntime,
              ),
          ),
        ).toBe(true);

        expect(
          () =>
            validateAutonomousGlobalGrowthActivationCandidateIssuance(
              first,
            ),
        ).not.toThrow();

        const tampered =
          {
            ...first,

            issuanceDigest:
              "0".repeat(64),
          } as
            AutonomousGlobalGrowthActivationCandidateIssuance;

        expect(
          () =>
            validateAutonomousGlobalGrowthActivationCandidateIssuance(
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
