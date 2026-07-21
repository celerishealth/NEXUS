import { createHash } from "node:crypto";

import {
  AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION,
} from "./aiEmployeeFactoryLifecycle";

import {
  AI_WORKFORCE_DIRECTOR_FIRST_WAVE_ROLES,
  AI_WORKFORCE_DIRECTOR_PLANNING_FOUNDATION,
} from "./aiWorkforceDirectorPlanningFoundation";

import {
  WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER,
} from "./worldClassAIWorkforceMasterRoster";

export const ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN_VERSION =
  "nexus-engineering-ai-workforce-development-plan-v1" as const;

export const ENGINEERING_AI_WORKFORCE_ROLE_DEFINITIONS =
  [
    {
      employeeCode:
        "nx-engineering-001",
      publicName:
        "Ishaan",
      officialRole:
        "AI Principal Software Architect",
      mission:
        "Prepare architecture decisions, system boundaries, technical designs, and owner-reviewable engineering standards.",
    },
    {
      employeeCode:
        "nx-engineering-002",
      publicName:
        "Leela",
      officialRole:
        "AI Software Engineering Director",
      mission:
        "Coordinate bounded implementation plans, code-change drafts, engineering reviews, and evidence-driven delivery.",
    },
    {
      employeeCode:
        "nx-engineering-003",
      publicName:
        "Vivaan",
      officialRole:
        "AI Quality Assurance Director",
      mission:
        "Design test strategy, regression coverage, acceptance gates, defect evidence, and release-quality reviews.",
    },
    {
      employeeCode:
        "nx-engineering-004",
      publicName:
        "Anaya",
      officialRole:
        "AI Security Engineering Director",
      mission:
        "Review threat models, tenant isolation, authorization, secret protection, auditability, and security boundaries.",
    },
    {
      employeeCode:
        "nx-engineering-005",
      publicName:
        "Atharv",
      officialRole:
        "AI Reliability Engineering Specialist",
      mission:
        "Prepare observability, recovery, rollback, continuity, capacity, and deployment-readiness evidence.",
    },
    {
      employeeCode:
        "nx-engineering-006",
      publicName:
        "Mahir",
      officialRole:
        "AI Chaos Engineering Specialist",
      mission:
        "Prepare reversible sandbox failure scenarios and resilience tests without damaging production systems.",
    },
    {
      employeeCode:
        "nx-engineering-007",
      publicName:
        "Zara",
      officialRole:
        "AI Data Engineering & Analytics Specialist",
      mission:
        "Design tenant-safe data models, migration plans, data-quality checks, analytics, and lineage evidence.",
    },
    {
      employeeCode:
        "nx-engineering-008",
      publicName:
        "Advik",
      officialRole:
        "AI Systems Evaluation & Red-Team Specialist",
      mission:
        "Prepare adversarial evaluations, safety tests, defect discovery, and independent system-quality evidence.",
    },
  ] as const;

export type EngineeringAIWorkforceRole =
  (
    typeof ENGINEERING_AI_WORKFORCE_ROLE_DEFINITIONS
  )[number]["officialRole"];

export interface CreateEngineeringAIWorkforceDevelopmentPlanInput {
  readonly planningId: string;
  readonly preparedAt: string;
}

export interface EngineeringAIWorkforcePlannedCandidate {
  readonly developmentSequence: number;
  readonly employeeId: string;
  readonly employeeCode: string;
  readonly publicName: string;
  readonly officialRole:
    EngineeringAIWorkforceRole;
  readonly department:
    "ENGINEERING_DATA_SECURITY";
  readonly managerRoleKey:
    "founder-owner-ceo";
  readonly priorityTier:
    "FOUNDATION_PRIORITY";
  readonly sourceFactoryRecordId:
    string;
  readonly sourceFactoryRecordDigest:
    string;
  readonly sourceLifecycleState:
    "PLANNED_CANDIDATE";
  readonly roleMission: string;
  readonly includedInWorkforceDirectorFirstWave:
    boolean;
  readonly routineEngineeringTakeoverTarget:
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
  readonly repositoryReadAuthorized:
    false;
  readonly repositoryWriteAuthorized:
    false;
  readonly branchCreationAuthorized:
    false;
  readonly pullRequestPreparationAuthorized:
    false;
  readonly mergeAuthorized: false;
  readonly productionDeploymentAuthorized:
    false;
  readonly secretsAccessAuthorized:
    false;
  readonly controlledWorkAuthorized:
    false;
}

export interface EngineeringAIWorkforceDevelopmentPlan {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN_VERSION;
  readonly planningId: string;
  readonly planningState:
    "OWNER_CONTROLLED_ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLANNED";
  readonly sourceRosterVersion:
    typeof WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER.version;
  readonly sourceRosterDigest: string;
  readonly sourceFactoryVersion:
    typeof AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION.version;
  readonly sourceFactoryDigest: string;
  readonly sourceDirectorPlanningVersion:
    typeof AI_WORKFORCE_DIRECTOR_PLANNING_FOUNDATION.version;
  readonly sourceDirectorPlanningDigest:
    string;
  readonly plannedEngineeringEmployeeCount:
    8;
  readonly directorFirstWaveEngineeringOverlapCount:
    5;
  readonly engineeringSpecialistExtensionCount:
    3;
  readonly plannedCandidates:
    readonly EngineeringAIWorkforcePlannedCandidate[];
  readonly developmentSequence:
    readonly number[];
  readonly founderLiberationObjective: Readonly<{
    routineCodingTakeoverTarget: true;
    routineTestingTakeoverTarget: true;
    routineSecurityReviewTakeoverTarget:
      true;
    routineReliabilityReviewTakeoverTarget:
      true;
    founderReleaseAchieved: false;
    ownerRetainsFinalProductAuthority:
      true;
    ownerRetainsMergeAuthority: true;
    ownerRetainsProductionDeploymentAuthority:
      true;
  }>;
  readonly humanLikeEmployeeStandard: Readonly<{
    naturalProfessionalCommunicationRequired:
      true;
    contextAwarenessRequired: true;
    proactiveSpecialistWorkRequired: true;
    transparentAIIdentityRequired: true;
    humanImpersonationAuthorized: false;
    fabricatedHumanExperienceAuthorized:
      false;
  }>;
  readonly ownerEngineeringPlanDecisionRequired:
    true;
  readonly ownerEngineeringPlanDecisionRecorded:
    false;
  readonly authorityBoundary: Readonly<{
    planningOnly: true;
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
    repositoryReadAuthorized: false;
    repositoryWriteAuthorized: false;
    branchCreationAuthorized: false;
    pullRequestPreparationAuthorized:
      false;
    mergeAuthorized: false;
    productionDeploymentAuthorized:
      false;
    secretsAccessAuthorized: false;
    controlledWorkAuthorized: false;
    realCustomerDataAccessAuthorized:
      false;
    realCustomerContactAuthorized: false;
    externalDeliveryAuthorized: false;
    liveProviderExecutionAuthorized:
      false;
    paymentExecutionAuthorized: false;
    financialCommitmentAuthorized:
      false;
    legalCommitmentAuthorized: false;
    autonomousExecutionAuthorized:
      false;
    publicLaunchAuthorized: false;
  }>;
  readonly nextStep:
    "AWAIT_OWNER_ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN_DECISION";
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
        "Unsupported deterministic Engineering Workforce planning value.",
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
    value !== value.trim() ||
    !SAFE_IDENTIFIER_PATTERN.test(value)
  ) {
    throw new Error(
      `${label} must be a canonical safe identifier.`,
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

function requireTimestamp(
  label: string,
  value: string,
): void {
  const parsed =
    Date.parse(value);

  if (
    !Number.isFinite(parsed) ||
    new Date(parsed)
      .toISOString() !== value
  ) {
    throw new Error(
      `${label} must be an exact ISO timestamp.`,
    );
  }
}

function requireUnique(
  label: string,
  values: readonly string[],
): void {
  if (
    new Set<string>(values).size !==
    values.length
  ) {
    throw new Error(
      `${label} must not contain duplicates.`,
    );
  }
}

export function validateEngineeringAIWorkforceDevelopmentPlan(
  plan:
    EngineeringAIWorkforceDevelopmentPlan,
): void {
  const {
    planningDigest,
    ...unsignedPlan
  } = plan;

  requireDigest(
    "Engineering Workforce planning digest",
    planningDigest,
  );

  if (
    sha256(unsignedPlan) !==
    planningDigest
  ) {
    throw new Error(
      "Engineering Workforce planning digest verification failed.",
    );
  }

  requireIdentifier(
    "Engineering Workforce planning ID",
    plan.planningId,
  );

  requireDigest(
    "Source roster digest",
    plan.sourceRosterDigest,
  );

  requireDigest(
    "Source factory digest",
    plan.sourceFactoryDigest,
  );

  requireDigest(
    "Source director planning digest",
    plan.sourceDirectorPlanningDigest,
  );

  requireTimestamp(
    "Engineering Workforce planning time",
    plan.preparedAt,
  );

  if (
    plan.version !==
      ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN_VERSION ||
    plan.planningState !==
      "OWNER_CONTROLLED_ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLANNED" ||
    plan.sourceRosterVersion !==
      WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER.version ||
    plan.sourceRosterDigest !==
      WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER.rosterDigest ||
    plan.sourceFactoryVersion !==
      AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION.version ||
    plan.sourceFactoryDigest !==
      AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION.foundationDigest ||
    plan.sourceDirectorPlanningVersion !==
      AI_WORKFORCE_DIRECTOR_PLANNING_FOUNDATION.version ||
    plan.sourceDirectorPlanningDigest !==
      AI_WORKFORCE_DIRECTOR_PLANNING_FOUNDATION.planningDigest ||
    plan.plannedEngineeringEmployeeCount !==
      8 ||
    plan.directorFirstWaveEngineeringOverlapCount !==
      5 ||
    plan.engineeringSpecialistExtensionCount !==
      3 ||
    plan.plannedCandidates.length !==
      8 ||
    plan.developmentSequence.length !==
      8 ||
    plan.ownerEngineeringPlanDecisionRequired !==
      true ||
    plan.ownerEngineeringPlanDecisionRecorded !==
      false
  ) {
    throw new Error(
      "Engineering Workforce development-plan identity is invalid.",
    );
  }

  plan.plannedCandidates.forEach(
    (candidate, index) => {
      const expected =
        ENGINEERING_AI_WORKFORCE_ROLE_DEFINITIONS[
          index
        ];

      if (
        !expected ||
        candidate.developmentSequence !==
          index + 1 ||
        candidate.employeeCode !==
          expected.employeeCode ||
        candidate.publicName !==
          expected.publicName ||
        candidate.officialRole !==
          expected.officialRole ||
        candidate.roleMission !==
          expected.mission ||
        candidate.department !==
          "ENGINEERING_DATA_SECURITY" ||
        candidate.managerRoleKey !==
          "founder-owner-ceo" ||
        candidate.priorityTier !==
          "FOUNDATION_PRIORITY" ||
        candidate.sourceLifecycleState !==
          "PLANNED_CANDIDATE" ||
        candidate.routineEngineeringTakeoverTarget !==
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
        candidate.repositoryReadAuthorized !==
          false ||
        candidate.repositoryWriteAuthorized !==
          false ||
        candidate.branchCreationAuthorized !==
          false ||
        candidate.pullRequestPreparationAuthorized !==
          false ||
        candidate.mergeAuthorized !==
          false ||
        candidate.productionDeploymentAuthorized !==
          false ||
        candidate.secretsAccessAuthorized !==
          false ||
        candidate.controlledWorkAuthorized !==
          false
      ) {
        throw new Error(
          "Engineering Workforce candidate planning evidence is invalid.",
        );
      }
    },
  );

  requireUnique(
    "Engineering employee IDs",
    plan.plannedCandidates.map(
      (candidate) =>
        candidate.employeeId,
    ),
  );

  requireUnique(
    "Engineering employee codes",
    plan.plannedCandidates.map(
      (candidate) =>
        candidate.employeeCode,
    ),
  );

  requireUnique(
    "Engineering public names",
    plan.plannedCandidates.map(
      (candidate) =>
        candidate.publicName.toLowerCase(),
    ),
  );

  requireUnique(
    "Engineering official roles",
    plan.plannedCandidates.map(
      (candidate) =>
        candidate.officialRole,
    ),
  );

  const founder =
    plan.founderLiberationObjective;

  if (
    founder.routineCodingTakeoverTarget !==
      true ||
    founder.routineTestingTakeoverTarget !==
      true ||
    founder.routineSecurityReviewTakeoverTarget !==
      true ||
    founder.routineReliabilityReviewTakeoverTarget !==
      true ||
    founder.founderReleaseAchieved !==
      false ||
    founder.ownerRetainsFinalProductAuthority !==
      true ||
    founder.ownerRetainsMergeAuthority !==
      true ||
    founder.ownerRetainsProductionDeploymentAuthority !==
      true
  ) {
    throw new Error(
      "Founder-liberation objective is invalid.",
    );
  }

  const humanLike =
    plan.humanLikeEmployeeStandard;

  if (
    humanLike.naturalProfessionalCommunicationRequired !==
      true ||
    humanLike.contextAwarenessRequired !==
      true ||
    humanLike.proactiveSpecialistWorkRequired !==
      true ||
    humanLike.transparentAIIdentityRequired !==
      true ||
    humanLike.humanImpersonationAuthorized !==
      false ||
    humanLike.fabricatedHumanExperienceAuthorized !==
      false
  ) {
    throw new Error(
      "Engineering AI employee communication standard is invalid.",
    );
  }

  const boundary =
    plan.authorityBoundary;

  if (
    boundary.planningOnly !==
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
    boundary.repositoryReadAuthorized !==
      false ||
    boundary.repositoryWriteAuthorized !==
      false ||
    boundary.branchCreationAuthorized !==
      false ||
    boundary.pullRequestPreparationAuthorized !==
      false ||
    boundary.mergeAuthorized !==
      false ||
    boundary.productionDeploymentAuthorized !==
      false ||
    boundary.secretsAccessAuthorized !==
      false ||
    boundary.controlledWorkAuthorized !==
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
      "Engineering Workforce authority boundary is invalid.",
    );
  }

  if (
    plan.nextStep !==
      "AWAIT_OWNER_ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN_DECISION"
  ) {
    throw new Error(
      "Engineering Workforce development-plan next step is invalid.",
    );
  }
}

export function createEngineeringAIWorkforceDevelopmentPlan(
  input:
    CreateEngineeringAIWorkforceDevelopmentPlanInput,
): EngineeringAIWorkforceDevelopmentPlan {
  requireIdentifier(
    "Engineering Workforce planning ID",
    input.planningId,
  );

  requireTimestamp(
    "Engineering Workforce planning time",
    input.preparedAt,
  );

  const roster =
    WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER;

  const factory =
    AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION;

  const directorPlan =
    AI_WORKFORCE_DIRECTOR_PLANNING_FOUNDATION;

  if (
    factory.sourceRosterDigest !==
      roster.rosterDigest ||
    directorPlan.sourceRosterDigest !==
      roster.rosterDigest ||
    directorPlan.sourceFactoryDigest !==
      factory.foundationDigest
  ) {
    throw new Error(
      "Engineering Workforce source evidence is not integrity-bound.",
    );
  }

  const plannedCandidates =
    ENGINEERING_AI_WORKFORCE_ROLE_DEFINITIONS.map(
      (definition, index) => {
        const rosterEntry =
          roster.entries.find(
            (entry) =>
              entry.employeeCode ===
              definition.employeeCode,
          );

        if (
          !rosterEntry ||
          rosterEntry.publicName !==
            definition.publicName ||
          rosterEntry.officialRole !==
            definition.officialRole ||
          rosterEntry.department !==
            "ENGINEERING_DATA_SECURITY" ||
          rosterEntry.managerRoleKey !==
            "founder-owner-ceo" ||
          rosterEntry.status !==
            "PLANNED_CANDIDATE" ||
          rosterEntry.priorityTier !==
            "FOUNDATION_PRIORITY" ||
          rosterEntry.qualificationRequired !==
            true ||
          rosterEntry.activationAuthorized !==
            false
        ) {
          throw new Error(
            `Engineering roster candidate is invalid: ${definition.officialRole}.`,
          );
        }

        const factoryRecord =
          factory.candidateRecords.find(
            (record) =>
              record.employeeId ===
              rosterEntry.employeeId,
          );

        if (
          !factoryRecord ||
          factoryRecord.employeeCode !==
            rosterEntry.employeeCode ||
          factoryRecord.officialRole !==
            rosterEntry.officialRole ||
          factoryRecord.lifecycleState !==
            "PLANNED_CANDIDATE" ||
          factoryRecord.templatePrepared !==
            false ||
          factoryRecord.ownerQualificationApproved !==
            false ||
          factoryRecord.ownerActivationApproved !==
            false ||
          factoryRecord.runtimeAuthorized !==
            false
        ) {
          throw new Error(
            `Engineering factory candidate is invalid: ${definition.officialRole}.`,
          );
        }

        return {
          developmentSequence:
            index + 1,
          employeeId:
            rosterEntry.employeeId,
          employeeCode:
            rosterEntry.employeeCode,
          publicName:
            rosterEntry.publicName,
          officialRole:
            definition.officialRole,
          department:
            "ENGINEERING_DATA_SECURITY" as const,
          managerRoleKey:
            "founder-owner-ceo" as const,
          priorityTier:
            "FOUNDATION_PRIORITY" as const,
          sourceFactoryRecordId:
            factoryRecord.factoryRecordId,
          sourceFactoryRecordDigest:
            factoryRecord.recordDigest,
          sourceLifecycleState:
            "PLANNED_CANDIDATE" as const,
          roleMission:
            definition.mission,
          includedInWorkforceDirectorFirstWave:
            AI_WORKFORCE_DIRECTOR_FIRST_WAVE_ROLES.includes(
              definition.officialRole as
                typeof AI_WORKFORCE_DIRECTOR_FIRST_WAVE_ROLES[number],
            ),
          routineEngineeringTakeoverTarget:
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
          repositoryReadAuthorized:
            false as const,
          repositoryWriteAuthorized:
            false as const,
          branchCreationAuthorized:
            false as const,
          pullRequestPreparationAuthorized:
            false as const,
          mergeAuthorized:
            false as const,
          productionDeploymentAuthorized:
            false as const,
          secretsAccessAuthorized:
            false as const,
          controlledWorkAuthorized:
            false as const,
        };
      },
    );

  const firstWaveOverlapCount =
    plannedCandidates.filter(
      (candidate) =>
        candidate.includedInWorkforceDirectorFirstWave,
    ).length;

  if (
    firstWaveOverlapCount !==
      5
  ) {
    throw new Error(
      "Engineering Workforce Director first-wave overlap is invalid.",
    );
  }

  const planCore = {
    version:
      ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN_VERSION,
    planningId:
      input.planningId,
    planningState:
      "OWNER_CONTROLLED_ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLANNED" as const,
    sourceRosterVersion:
      roster.version,
    sourceRosterDigest:
      roster.rosterDigest,
    sourceFactoryVersion:
      factory.version,
    sourceFactoryDigest:
      factory.foundationDigest,
    sourceDirectorPlanningVersion:
      directorPlan.version,
    sourceDirectorPlanningDigest:
      directorPlan.planningDigest,
    plannedEngineeringEmployeeCount:
      8 as const,
    directorFirstWaveEngineeringOverlapCount:
      5 as const,
    engineeringSpecialistExtensionCount:
      3 as const,
    plannedCandidates,
    developmentSequence:
      plannedCandidates.map(
        (candidate) =>
          candidate.developmentSequence,
      ),
    founderLiberationObjective: {
      routineCodingTakeoverTarget:
        true as const,
      routineTestingTakeoverTarget:
        true as const,
      routineSecurityReviewTakeoverTarget:
        true as const,
      routineReliabilityReviewTakeoverTarget:
        true as const,
      founderReleaseAchieved:
        false as const,
      ownerRetainsFinalProductAuthority:
        true as const,
      ownerRetainsMergeAuthority:
        true as const,
      ownerRetainsProductionDeploymentAuthority:
        true as const,
    },
    humanLikeEmployeeStandard: {
      naturalProfessionalCommunicationRequired:
        true as const,
      contextAwarenessRequired:
        true as const,
      proactiveSpecialistWorkRequired:
        true as const,
      transparentAIIdentityRequired:
        true as const,
      humanImpersonationAuthorized:
        false as const,
      fabricatedHumanExperienceAuthorized:
        false as const,
    },
    ownerEngineeringPlanDecisionRequired:
      true as const,
    ownerEngineeringPlanDecisionRecorded:
      false as const,
    authorityBoundary: {
      planningOnly:
        true as const,
      rosterMutationAuthorized:
        false as const,
      factoryLifecycleTransitionAuthorized:
        false as const,
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
      repositoryReadAuthorized:
        false as const,
      repositoryWriteAuthorized:
        false as const,
      branchCreationAuthorized:
        false as const,
      pullRequestPreparationAuthorized:
        false as const,
      mergeAuthorized:
        false as const,
      productionDeploymentAuthorized:
        false as const,
      secretsAccessAuthorized:
        false as const,
      controlledWorkAuthorized:
        false as const,
      realCustomerDataAccessAuthorized:
        false as const,
      realCustomerContactAuthorized:
        false as const,
      externalDeliveryAuthorized:
        false as const,
      liveProviderExecutionAuthorized:
        false as const,
      paymentExecutionAuthorized:
        false as const,
      financialCommitmentAuthorized:
        false as const,
      legalCommitmentAuthorized:
        false as const,
      autonomousExecutionAuthorized:
        false as const,
      publicLaunchAuthorized:
        false as const,
    },
    nextStep:
      "AWAIT_OWNER_ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN_DECISION" as const,
    preparedAt:
      input.preparedAt,
  };

  const plan =
    deepFreeze({
      ...planCore,
      planningDigest:
        sha256(planCore),
    }) as EngineeringAIWorkforceDevelopmentPlan;

  validateEngineeringAIWorkforceDevelopmentPlan(
    plan,
  );

  return plan;
}

export const ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN =
  createEngineeringAIWorkforceDevelopmentPlan({
    planningId:
      "engineering-ai-workforce-development-plan-001",
    preparedAt:
      "2026-07-21T09:13:46.301Z",
  });
