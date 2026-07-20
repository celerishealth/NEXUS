import { createHash } from "node:crypto";

import {
  AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION,
  type AIEmployeeFactoryLifecycleFoundation,
} from "./aiEmployeeFactoryLifecycle";

import {
  WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER,
  type WorldClassAIWorkforceMasterRoster,
} from "./worldClassAIWorkforceMasterRoster";

export const AI_WORKFORCE_DIRECTOR_PLANNING_FOUNDATION_VERSION =
  "nexus-ai-workforce-director-planning-foundation-v1" as const;

export const AI_WORKFORCE_DIRECTOR_FIRST_WAVE_ROLES = [
  "AI Workforce Director",
  "AI Market Intelligence Director",
  "AI Product Director",
  "AI Software Engineering Director",
  "AI Quality Assurance Director",
  "AI Security Engineering Director",
  "AI Reliability Engineering Specialist",
  "AI Chaos Engineering Specialist",
] as const;

export type AIWorkforceDirectorFirstWaveRole =
  (typeof AI_WORKFORCE_DIRECTOR_FIRST_WAVE_ROLES)[number];

export interface CreateAIWorkforceDirectorPlanningFoundationInput {
  readonly planningId: string;
  readonly sourceRoster:
    WorldClassAIWorkforceMasterRoster;
  readonly sourceFactory:
    AIEmployeeFactoryLifecycleFoundation;
  readonly preparedAt: string;
}

export interface AIWorkforceDirectorPlannedCandidate {
  readonly qualificationSequence: number;
  readonly employeeId: string;
  readonly employeeCode: string;
  readonly publicName: string;
  readonly officialRole:
    AIWorkforceDirectorFirstWaveRole;
  readonly department: string;
  readonly priorityTier:
    "FOUNDATION_PRIORITY";
  readonly sourceLifecycleState:
    "PLANNED_CANDIDATE";
  readonly planningMode:
    "REVERSIBLE_INTERNAL_ONLY";
  readonly includedInFirstQualificationWave:
    true;
  readonly templatePreparationAuthorized:
    false;
  readonly qualificationAdmissionAuthorized:
    false;
  readonly qualificationExecutionAuthorized:
    false;
  readonly ownerQualificationApprovalRecorded:
    false;
  readonly activationCandidatePreparationAuthorized:
    false;
  readonly ownerActivationAuthorized:
    false;
  readonly runtimeActivationAuthorized:
    false;
  readonly controlledWorkAuthorized:
    false;
}

export interface AIWorkforceDirectorPlanningFoundation {
  readonly version:
    typeof AI_WORKFORCE_DIRECTOR_PLANNING_FOUNDATION_VERSION;
  readonly planningId: string;
  readonly planningState:
    "AI_WORKFORCE_DIRECTOR_FIRST_WAVE_PLANNING_RECORDED";
  readonly sourceRosterVersion:
    WorldClassAIWorkforceMasterRoster["version"];
  readonly sourceRosterDigest: string;
  readonly sourceFactoryVersion:
    AIEmployeeFactoryLifecycleFoundation["version"];
  readonly sourceFactoryDigest: string;
  readonly firstWaveCandidateCount: 8;
  readonly plannedCandidates:
    readonly AIWorkforceDirectorPlannedCandidate[];
  readonly qualificationSequence:
    readonly number[];
  readonly ownerPlanDecisionRequired:
    true;
  readonly ownerPlanDecisionRecorded:
    false;
  readonly authorityBoundary: Readonly<{
    internalPlanningOnly: true;
    rosterMutationAuthorized: false;
    factoryLifecycleTransitionAuthorized:
      false;
    templatePreparationAuthorized: false;
    qualificationAdmissionAuthorized:
      false;
    qualificationExecutionAuthorized:
      false;
    ownerQualificationApprovalRecorded:
      false;
    activationCandidatePreparationAuthorized:
      false;
    ownerActivationAuthorized: false;
    runtimeActivationAuthorized: false;
    controlledWorkAuthorized: false;
    productionAuthorityGranted: false;
    realCustomerDataAccessAuthorized:
      false;
    realCustomerContactAuthorized: false;
    externalDeliveryAuthorized: false;
    liveProviderExecutionAuthorized:
      false;
    paymentExecutionAuthorized: false;
    financialCommitmentAuthorized: false;
    legalCommitmentAuthorized: false;
    autonomousExecutionAuthorized: false;
    publicLaunchAuthorized: false;
  }>;
  readonly nextStep:
    "AWAIT_OWNER_WORKFORCE_DIRECTOR_PLAN_DECISION";
  readonly preparedAt: string;
  readonly planningDigest: string;
}

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9._:-]{2,127}$/;

function canonicalize(
  value: unknown,
): string {
  if (
    value === null ||
    typeof value !== "object"
  ) {
    const primitive =
      JSON.stringify(value);

    if (primitive === undefined) {
      throw new Error(
        "Unsupported deterministic Workforce Director planning value.",
      );
    }

    return primitive;
  }

  if (Array.isArray(value)) {
    return (
      "[" +
      value
        .map(canonicalize)
        .join(",") +
      "]"
    );
  }

  const record =
    value as Record<string, unknown>;

  return (
    "{" +
    Object.keys(record)
      .sort()
      .map(
        (key) =>
          JSON.stringify(key) +
          ":" +
          canonicalize(record[key]),
      )
      .join(",") +
    "}"
  );
}

function sha256(
  value: unknown,
): string {
  return createHash("sha256")
    .update(
      canonicalize(value),
      "utf8",
    )
    .digest("hex");
}

function deepFreeze<T>(
  value: T,
): Readonly<T> {
  if (
    value !== null &&
    typeof value === "object" &&
    !Object.isFrozen(value)
  ) {
    Object.freeze(value);

    for (
      const child of
      Object.values(
        value as Record<string, unknown>,
      )
    ) {
      if (
        child !== null &&
        typeof child === "object"
      ) {
        deepFreeze(child);
      }
    }
  }

  return value as Readonly<T>;
}

function requireIdentifier(
  label: string,
  value: string,
): void {
  if (
    typeof value !== "string" ||
    value !== value.trim() ||
    !SAFE_IDENTIFIER_PATTERN.test(value)
  ) {
    throw new Error(
      `${label} must be a canonical safe identifier.`,
    );
  }
}

function requireExactIsoTimestamp(
  label: string,
  value: string,
): void {
  const timestamp =
    Date.parse(value);

  if (
    !Number.isFinite(timestamp) ||
    new Date(timestamp)
      .toISOString() !== value
  ) {
    throw new Error(
      `${label} must be an exact ISO timestamp.`,
    );
  }
}

function requireDigest(
  label: string,
  value: string,
): void {
  if (
    !/^[0-9a-f]{64}$/.test(value)
  ) {
    throw new Error(
      `${label} must be a SHA-256 digest.`,
    );
  }
}

function requireUnique(
  label: string,
  values: readonly string[],
): void {
  if (
    new Set(values).size !==
    values.length
  ) {
    throw new Error(
      `${label} must not contain duplicates.`,
    );
  }
}

export function validateAIWorkforceDirectorPlanningFoundation(
  plan:
    AIWorkforceDirectorPlanningFoundation,
): void {
  const {
    planningDigest,
    ...unsignedPlan
  } = plan;

  requireDigest(
    "Workforce Director planning digest",
    planningDigest,
  );

  if (
    sha256(unsignedPlan) !==
    planningDigest
  ) {
    throw new Error(
      "Workforce Director planning digest verification failed.",
    );
  }

  requireIdentifier(
    "Workforce Director planning ID",
    plan.planningId,
  );

  requireExactIsoTimestamp(
    "Workforce Director planning time",
    plan.preparedAt,
  );

  if (
    plan.version !==
      AI_WORKFORCE_DIRECTOR_PLANNING_FOUNDATION_VERSION ||
    plan.planningState !==
      "AI_WORKFORCE_DIRECTOR_FIRST_WAVE_PLANNING_RECORDED" ||
    plan.firstWaveCandidateCount !==
      8 ||
    plan.plannedCandidates.length !==
      8 ||
    plan.qualificationSequence.length !==
      8 ||
    plan.ownerPlanDecisionRequired !==
      true ||
    plan.ownerPlanDecisionRecorded !==
      false ||
    plan.nextStep !==
      "AWAIT_OWNER_WORKFORCE_DIRECTOR_PLAN_DECISION"
  ) {
    throw new Error(
      "Workforce Director planning identity is invalid.",
    );
  }

  plan.plannedCandidates.forEach(
    (candidate, index) => {
      const expectedRole =
        AI_WORKFORCE_DIRECTOR_FIRST_WAVE_ROLES[
          index
        ];

      if (
        candidate.officialRole !==
          expectedRole ||
        candidate.qualificationSequence !==
          index + 1 ||
        plan.qualificationSequence[index] !==
          index + 1 ||
        candidate.priorityTier !==
          "FOUNDATION_PRIORITY" ||
        candidate.sourceLifecycleState !==
          "PLANNED_CANDIDATE" ||
        candidate.planningMode !==
          "REVERSIBLE_INTERNAL_ONLY" ||
        candidate.includedInFirstQualificationWave !==
          true ||
        candidate.templatePreparationAuthorized !==
          false ||
        candidate.qualificationAdmissionAuthorized !==
          false ||
        candidate.qualificationExecutionAuthorized !==
          false ||
        candidate.ownerQualificationApprovalRecorded !==
          false ||
        candidate.activationCandidatePreparationAuthorized !==
          false ||
        candidate.ownerActivationAuthorized !==
          false ||
        candidate.runtimeActivationAuthorized !==
          false ||
        candidate.controlledWorkAuthorized !==
          false
      ) {
        throw new Error(
          "Workforce Director first-wave candidate binding is invalid.",
        );
      }
    },
  );

  requireUnique(
    "Workforce Director planned employee IDs",
    plan.plannedCandidates.map(
      (candidate) =>
        candidate.employeeId,
    ),
  );

  requireUnique(
    "Workforce Director planned employee codes",
    plan.plannedCandidates.map(
      (candidate) =>
        candidate.employeeCode,
    ),
  );

  const boundary =
    plan.authorityBoundary;

  if (
    boundary.internalPlanningOnly !==
      true ||
    boundary.rosterMutationAuthorized !==
      false ||
    boundary.factoryLifecycleTransitionAuthorized !==
      false ||
    boundary.templatePreparationAuthorized !==
      false ||
    boundary.qualificationAdmissionAuthorized !==
      false ||
    boundary.qualificationExecutionAuthorized !==
      false ||
    boundary.ownerQualificationApprovalRecorded !==
      false ||
    boundary.activationCandidatePreparationAuthorized !==
      false ||
    boundary.ownerActivationAuthorized !==
      false ||
    boundary.runtimeActivationAuthorized !==
      false ||
    boundary.controlledWorkAuthorized !==
      false ||
    boundary.productionAuthorityGranted !==
      false ||
    boundary.realCustomerDataAccessAuthorized !==
      false ||
    boundary.realCustomerContactAuthorized !==
      false ||
    boundary.externalDeliveryAuthorized !==
      false ||
    boundary.liveProviderExecutionAuthorized !==
      false ||
    boundary.paymentExecutionAuthorized !==
      false ||
    boundary.financialCommitmentAuthorized !==
      false ||
    boundary.legalCommitmentAuthorized !==
      false ||
    boundary.autonomousExecutionAuthorized !==
      false ||
    boundary.publicLaunchAuthorized !==
      false
  ) {
    throw new Error(
      "Workforce Director planning authority boundary is invalid.",
    );
  }
}

export function createAIWorkforceDirectorPlanningFoundation(
  input:
    CreateAIWorkforceDirectorPlanningFoundationInput,
): AIWorkforceDirectorPlanningFoundation {
  requireIdentifier(
    "Workforce Director planning ID",
    input.planningId,
  );

  requireExactIsoTimestamp(
    "Workforce Director planning time",
    input.preparedAt,
  );

  requireDigest(
    "Source roster digest",
    input.sourceRoster.rosterDigest,
  );

  requireDigest(
    "Source factory digest",
    input.sourceFactory.foundationDigest,
  );

  if (
    input.sourceFactory
      .sourceRosterDigest !==
      input.sourceRoster.rosterDigest ||
    input.sourceFactory
      .plannedCandidateCount !==
      input.sourceRoster
        .plannedCandidateCount
  ) {
    throw new Error(
      "Workforce Director planning sources are not integrity-bound.",
    );
  }

  const plannedCandidates =
    AI_WORKFORCE_DIRECTOR_FIRST_WAVE_ROLES.map(
      (officialRole, index) => {
        const rosterEntry =
          input.sourceRoster.entries.find(
            (entry) =>
              entry.officialRole ===
              officialRole,
          );

        if (
          !rosterEntry ||
          rosterEntry.status !==
            "PLANNED_CANDIDATE" ||
          rosterEntry.priorityTier !==
            "FOUNDATION_PRIORITY" ||
          rosterEntry.activationAuthorized !==
            false ||
          rosterEntry.qualificationRequired !==
            true
        ) {
          throw new Error(
            `Required first-wave role is not an eligible planned candidate: ${officialRole}.`,
          );
        }

        const factoryRecord =
          input.sourceFactory
            .candidateRecords.find(
              (record) =>
                record.employeeId ===
                rosterEntry.employeeId,
            );

        if (
          !factoryRecord ||
          factoryRecord.employeeCode !==
            rosterEntry.employeeCode ||
          factoryRecord.lifecycleState !==
            "PLANNED_CANDIDATE" ||
          factoryRecord.runtimeAuthorized !==
            false ||
          factoryRecord.ownerActivationApproved !==
            false
        ) {
          throw new Error(
            `Required first-wave role is not safely bound to the factory lifecycle: ${officialRole}.`,
          );
        }

        return {
          qualificationSequence:
            index + 1,
          employeeId:
            rosterEntry.employeeId,
          employeeCode:
            rosterEntry.employeeCode,
          publicName:
            rosterEntry.publicName,
          officialRole,
          department:
            rosterEntry.department,
          priorityTier:
            "FOUNDATION_PRIORITY" as const,
          sourceLifecycleState:
            "PLANNED_CANDIDATE" as const,
          planningMode:
            "REVERSIBLE_INTERNAL_ONLY" as const,
          includedInFirstQualificationWave:
            true as const,
          templatePreparationAuthorized:
            false as const,
          qualificationAdmissionAuthorized:
            false as const,
          qualificationExecutionAuthorized:
            false as const,
          ownerQualificationApprovalRecorded:
            false as const,
          activationCandidatePreparationAuthorized:
            false as const,
          ownerActivationAuthorized:
            false as const,
          runtimeActivationAuthorized:
            false as const,
          controlledWorkAuthorized:
            false as const,
        };
      },
    );

  const planCore = {
    version:
      AI_WORKFORCE_DIRECTOR_PLANNING_FOUNDATION_VERSION,
    planningId:
      input.planningId,
    planningState:
      "AI_WORKFORCE_DIRECTOR_FIRST_WAVE_PLANNING_RECORDED" as const,
    sourceRosterVersion:
      input.sourceRoster.version,
    sourceRosterDigest:
      input.sourceRoster.rosterDigest,
    sourceFactoryVersion:
      input.sourceFactory.version,
    sourceFactoryDigest:
      input.sourceFactory
        .foundationDigest,
    firstWaveCandidateCount:
      8 as const,
    plannedCandidates,
    qualificationSequence:
      plannedCandidates.map(
        (candidate) =>
          candidate.qualificationSequence,
      ),
    ownerPlanDecisionRequired:
      true as const,
    ownerPlanDecisionRecorded:
      false as const,
    authorityBoundary: {
      internalPlanningOnly:
        true,
      rosterMutationAuthorized:
        false,
      factoryLifecycleTransitionAuthorized:
        false,
      templatePreparationAuthorized:
        false,
      qualificationAdmissionAuthorized:
        false,
      qualificationExecutionAuthorized:
        false,
      ownerQualificationApprovalRecorded:
        false,
      activationCandidatePreparationAuthorized:
        false,
      ownerActivationAuthorized:
        false,
      runtimeActivationAuthorized:
        false,
      controlledWorkAuthorized:
        false,
      productionAuthorityGranted:
        false,
      realCustomerDataAccessAuthorized:
        false,
      realCustomerContactAuthorized:
        false,
      externalDeliveryAuthorized:
        false,
      liveProviderExecutionAuthorized:
        false,
      paymentExecutionAuthorized:
        false,
      financialCommitmentAuthorized:
        false,
      legalCommitmentAuthorized:
        false,
      autonomousExecutionAuthorized:
        false,
      publicLaunchAuthorized:
        false,
    } as const,
    nextStep:
      "AWAIT_OWNER_WORKFORCE_DIRECTOR_PLAN_DECISION" as const,
    preparedAt:
      input.preparedAt,
  };

  const plan =
    deepFreeze({
      ...planCore,
      planningDigest:
        sha256(planCore),
    }) as AIWorkforceDirectorPlanningFoundation;

  validateAIWorkforceDirectorPlanningFoundation(
    plan,
  );

  return plan;
}

export const AI_WORKFORCE_DIRECTOR_PLANNING_FOUNDATION =
  createAIWorkforceDirectorPlanningFoundation({
    planningId:
      "ai-workforce-director-first-wave-plan-v1",
    sourceRoster:
      WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER,
    sourceFactory:
      AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION,
    preparedAt:
      "2026-07-20T16:45:00.000Z",
  });
