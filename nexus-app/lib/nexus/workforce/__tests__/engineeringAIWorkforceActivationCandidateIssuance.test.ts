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
} from "../engineeringAIWorkforceQualifiedEmployeeManifestIssuance";

import {
  ENGINEERING_AI_WORKFORCE_ACTIVATION_CANDIDATE_ISSUANCE,
  createEngineeringAIWorkforceActivationCandidateIssuance,
  validateEngineeringAIWorkforceActivationCandidateIssuance,
  type EngineeringAIWorkforceActivationCandidateIssuance,
} from "../engineeringAIWorkforceActivationCandidateIssuance";

function input() {
  return {
    activationCandidateIssuanceId:
      "engineering-activation-candidate-test-001",

    qualifiedManifestIssuance:
      ENGINEERING_AI_WORKFORCE_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE,

    formalQualificationIssuance:
      ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_ISSUANCE,

    templateRegistry:
      ENGINEERING_AI_WORKFORCE_TEMPLATE_REGISTRY,

    tenantId:
      ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID,

    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,

    preparedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE
            .createdAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering AI Workforce activation-candidate issuance",
  () => {
    it(
      "prepares exactly eight activation candidates",
      () => {
        const issuance =
          createEngineeringAIWorkforceActivationCandidateIssuance(
            input(),
          );

        expect(
          issuance.issuanceState,
        ).toBe(
          "ENGINEERING_ACTIVATION_CANDIDATES_PREPARED",
        );

        expect(
          issuance.candidateIssuances,
        ).toHaveLength(8);

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
      "preserves exact Engineering candidate identities and sequence",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_ACTIVATION_CANDIDATE_ISSUANCE
            .candidateIssuances
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
          ENGINEERING_AI_WORKFORCE_ACTIVATION_CANDIDATE_ISSUANCE
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
        ]);
      },
    );

    it(
      "creates eight paused runtimes awaiting explicit owner activation",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_ACTIVATION_CANDIDATE_ISSUANCE
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
        ENGINEERING_AI_WORKFORCE_ACTIVATION_CANDIDATE_ISSUANCE
          .candidateIssuances
          .forEach(
            (
              record,
              index,
            ) => {
              const manifest =
                ENGINEERING_AI_WORKFORCE_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE
                  .candidateManifests[index];

              const qualification =
                ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_ISSUANCE
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
          ENGINEERING_AI_WORKFORCE_ACTIVATION_CANDIDATE_ISSUANCE
            .aggregateSummary,
        ).toEqual({
          qualifiedManifestCount:
            8,

          activationCandidateCount:
            8,

          pausedRuntimeCount:
            8,

          ownerActivationRequiredCount:
            8,

          ownerActivationDecisionCount:
            0,

          activatedRuntimeCount:
            0,

          controlledWorkAuthorizationCount:
            0,

          exactEightActivationCandidatesPrepared:
            true,

          exactCandidateSequencePreserved:
            true,

          exactCandidateIdentityPreserved:
            true,

          exactQualifiedManifestBindingsPreserved:
            true,

          uniqueActivationCandidateDigests:
            8,

          uniquePausedRuntimeDigests:
            8,
        });
      },
    );

    it(
      "requires canonical manifest qualification and template sources",
      () => {
        expect(
          () =>
            createEngineeringAIWorkforceActivationCandidateIssuance({
              ...input(),

              qualifiedManifestIssuance: {
                ...ENGINEERING_AI_WORKFORCE_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE,
              },
            }),
        ).toThrow(
          "canonical Engineering qualified-manifest issuance",
        );

        expect(
          () =>
            createEngineeringAIWorkforceActivationCandidateIssuance({
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
            createEngineeringAIWorkforceActivationCandidateIssuance({
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
      "blocks cross-tenant and cross-owner activation-candidate preparation",
      () => {
        expect(
          () =>
            createEngineeringAIWorkforceActivationCandidateIssuance({
              ...input(),

              tenantId:
                "tenant-other-001" as typeof ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID,
            }),
        ).toThrow(
          "Cross-tenant",
        );

        expect(
          () =>
            createEngineeringAIWorkforceActivationCandidateIssuance({
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
            createEngineeringAIWorkforceActivationCandidateIssuance({
              ...input(),

              preparedAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE
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
          ENGINEERING_AI_WORKFORCE_ACTIVATION_CANDIDATE_ISSUANCE;

        expect(
          issuance.nextStep,
        ).toBe(
          "AWAIT_ENGINEERING_OWNER_ACTIVATION_DECISION",
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
          ENGINEERING_AI_WORKFORCE_ACTIVATION_CANDIDATE_ISSUANCE
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
          createEngineeringAIWorkforceActivationCandidateIssuance(
            input(),
          );

        const second =
          createEngineeringAIWorkforceActivationCandidateIssuance(
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
        ).toBe(8);

        expect(
          new Set(
            first.candidateIssuances.map(
              (record) =>
                record.pausedRuntimeDigest,
            ),
          ).size,
        ).toBe(8);

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
            validateEngineeringAIWorkforceActivationCandidateIssuance(
              first,
            ),
        ).not.toThrow();

        const tampered =
          {
            ...first,

            issuanceDigest:
              "0".repeat(64),
          } as
            EngineeringAIWorkforceActivationCandidateIssuance;

        expect(
          () =>
            validateEngineeringAIWorkforceActivationCandidateIssuance(
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
