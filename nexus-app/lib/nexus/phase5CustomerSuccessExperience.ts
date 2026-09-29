export type Phase5IssueSeverity =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export interface Phase5CustomerSuccessInput {
  userName: string;
  businessType: string;
  goal: string;
  technicalConfidence: "LOW" | "MEDIUM" | "HIGH";
  mobileUser: boolean;
  preferredLanguage: string;
  hasExistingData: boolean;
  currentIssue?: {
    title: string;
    severity: Phase5IssueSeverity;
  } | null;
}

export interface Phase5CustomerSuccessSnapshot {
  schemaVersion:
    "nexus-phase5-customer-success-experience-v1";

  authorityBoundary: {
    externalMessageSendAuthorized: false;
    autonomousCustomerActionAuthorized: false;
    databaseMutationAuthorized: false;
    productionMutationAuthorized: false;
    ownerFinalAuthorityPreserved: true;
  };

  recommendedSetup: {
    mode: "GUIDED";
    complexity: "MINIMAL";
    useSampleData: boolean;
    recommendedLanguage: string;
  };

  demoSampleData: {
    available: true;
    syntheticOnly: true;
    customerDataRequired: false;
  };

  inAppHelp: {
    contextualHelpEnabled: true;
    plainLanguageEnabled: true;
    technicalTermsMinimized: true;
  };

  customerInboxSupportWorkflow: {
    intakeEnabled: true;
    classificationEnabled: true;
    escalationEnabled: true;
    externalReplyRequiresHumanApproval: true;
  };

  adoptionValueMilestones: readonly string[];

  mobileFriendlyUse: {
    mobileSupported: true;
    smallScreenPriority: boolean;
    primaryActionsLimited: true;
  };

  friendlyErrorRecovery: {
    blameFreeMessage: true;
    safeRetryOffered: true;
    destructiveRecoveryAutomatic: false;
  };

  accessibilityLanguageSimplification: {
    plainLanguage: true;
    conciseInstructions: true;
    preferredLanguage: string;
  };

  fastFirstUsefulResult: {
    targetSteps: number;
    nextAction: string;
    requiresTechnicalExpertise: false;
  };

  supportIncident: {
    issuePresent: boolean;
    severity: Phase5IssueSeverity | null;
    escalationRequired: boolean;
  };
}

function text(value: string, field: string): string {
  if(
    typeof value !== "string" ||
    value.trim().length === 0
  ){
    throw new Error(
      `Invalid Phase 5 field: ${field}`,
    );
  }

  return value.trim();
}

export function buildPhase5CustomerSuccessSnapshot(
  input: Phase5CustomerSuccessInput,
): Phase5CustomerSuccessSnapshot {

  const userName=text(input.userName,"userName");
  const businessType=text(
    input.businessType,
    "businessType",
  );
  const goal=text(input.goal,"goal");
  const language=text(
    input.preferredLanguage,
    "preferredLanguage",
  );

  const issue=input.currentIssue ?? null;

  const escalationRequired=
    issue !== null &&
    (
      issue.severity === "HIGH" ||
      issue.severity === "CRITICAL"
    );

  const useSampleData=
    input.hasExistingData === false;

  const targetSteps=
    input.technicalConfidence === "LOW"
      ? 3
      : 4;

  const nextAction=
    useSampleData
      ? `Open the guided ${businessType} sample and complete one ${goal} workflow.`
      : `Connect the minimum required data and complete one ${goal} workflow.`;

  void userName;

  return Object.freeze({
    schemaVersion:
      "nexus-phase5-customer-success-experience-v1",

    authorityBoundary:
      Object.freeze({
        externalMessageSendAuthorized: false,
        autonomousCustomerActionAuthorized: false,
        databaseMutationAuthorized: false,
        productionMutationAuthorized: false,
        ownerFinalAuthorityPreserved: true,
      }),

    recommendedSetup:
      Object.freeze({
        mode: "GUIDED",
        complexity: "MINIMAL",
        useSampleData,
        recommendedLanguage: language,
      }),

    demoSampleData:
      Object.freeze({
        available: true,
        syntheticOnly: true,
        customerDataRequired: false,
      }),

    inAppHelp:
      Object.freeze({
        contextualHelpEnabled: true,
        plainLanguageEnabled: true,
        technicalTermsMinimized: true,
      }),

    customerInboxSupportWorkflow:
      Object.freeze({
        intakeEnabled: true,
        classificationEnabled: true,
        escalationEnabled: true,
        externalReplyRequiresHumanApproval: true,
      }),

    adoptionValueMilestones:
      Object.freeze([
        "ONBOARDING_COMPLETE",
        "FIRST_USEFUL_RESULT",
        "REPEAT_VALUE",
        "OWNER_CONFIDENCE",
      ]),

    mobileFriendlyUse:
      Object.freeze({
        mobileSupported: true,
        smallScreenPriority:
          input.mobileUser === true,
        primaryActionsLimited: true,
      }),

    friendlyErrorRecovery:
      Object.freeze({
        blameFreeMessage: true,
        safeRetryOffered: true,
        destructiveRecoveryAutomatic: false,
      }),

    accessibilityLanguageSimplification:
      Object.freeze({
        plainLanguage: true,
        conciseInstructions: true,
        preferredLanguage: language,
      }),

    fastFirstUsefulResult:
      Object.freeze({
        targetSteps,
        nextAction,
        requiresTechnicalExpertise: false,
      }),

    supportIncident:
      Object.freeze({
        issuePresent: issue !== null,
        severity:
          issue === null
            ? null
            : issue.severity,
        escalationRequired,
      }),
  });
}