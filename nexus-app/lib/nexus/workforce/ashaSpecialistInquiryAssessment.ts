
import { createHash } from "node:crypto";

import {
  ASHA_SUPER_SPECIALIST_COMPETENCIES,
  ASHA_SUPER_SPECIALIST_STANDARD,
} from "./ashaSuperSpecialistStandard";

export const ASHA_SPECIALIST_INQUIRY_ASSESSMENT_VERSION =
  "nexus-asha-specialist-inquiry-assessment-v1" as const;

export type AshaInquiryChannel =
  | "WEB"
  | "EMAIL"
  | "WHATSAPP"
  | "MANUAL"
  | "API";

export type AshaInquiryIntent =
  | "PURCHASE"
  | "QUOTE"
  | "PRODUCT_ADVICE"
  | "ORDER_STATUS"
  | "TECHNICAL_SUPPORT"
  | "COMPLAINT"
  | "BILLING"
  | "PAYMENT"
  | "LOGISTICS"
  | "PROCUREMENT"
  | "COMPLIANCE"
  | "GENERAL";

export type AshaInquiryDepartment =
  | "SALES"
  | "CUSTOMER_SUCCESS"
  | "TECHNICAL_SUPPORT"
  | "COMPLAINT_ESCALATION"
  | "ORDER_OPERATIONS"
  | "LOGISTICS"
  | "BILLING"
  | "PAYMENT_COLLECTION"
  | "PROCUREMENT"
  | "COMPLIANCE"
  | "OWNER_REVIEW";

export type AshaVerifiedFactSource =
  | "CUSTOMER"
  | "OWNER"
  | "SYSTEM";

export interface AshaVerifiedInquiryFact {
  readonly key: string;
  readonly value: string;
  readonly source:
    AshaVerifiedFactSource;
}

export interface AshaPriorCustomerContext {
  readonly tenantId: string;
  readonly customerRef: string;
  readonly facts:
    readonly AshaVerifiedInquiryFact[];
}

export interface AshaDuplicateInquiryCandidate {
  readonly tenantId: string;
  readonly customerRef: string;
  readonly inquiryId: string;
  readonly idempotencyKey: string;
  readonly messageDigest: string;
}

export interface AshaSpecialistInquiryAssessmentInput {
  readonly evaluationMode:
    "ISOLATED_EVALUATION";
  readonly tenantId: string;
  readonly inquiryId: string;
  readonly customerRef: string;
  readonly channel:
    AshaInquiryChannel;
  readonly message: string;
  readonly idempotencyKey: string;
  readonly verifiedFacts?:
    readonly AshaVerifiedInquiryFact[];
  readonly priorContext?:
    AshaPriorCustomerContext | null;
  readonly duplicateCandidates?:
    readonly AshaDuplicateInquiryCandidate[];
}

export interface AshaSpecialistInquiryAssessment {
  readonly version:
    typeof ASHA_SPECIALIST_INQUIRY_ASSESSMENT_VERSION;
  readonly employeeId: string;
  readonly templateId: string;
  readonly tenantId: string;
  readonly inquiryId: string;
  readonly customerRef: string;

  readonly intent: Readonly<{
    primary: AshaInquiryIntent;
    secondary:
      AshaInquiryIntent | null;
    confidence:
      "HIGH" | "MEDIUM" | "LOW";
    matchedSignals:
      readonly string[];
    ambiguityDetected: boolean;
  }>;

  readonly requirementCompleteness: Readonly<{
    verifiedFacts:
      readonly AshaVerifiedInquiryFact[];
    requiredFields:
      readonly string[];
    missingFields:
      readonly string[];
    conflictingFields:
      readonly string[];
    completenessPercent: number;
    unsupportedAssumptionsBlocked: true;
  }>;

  readonly missingInformation: Readonly<{
    clarificationRequired: boolean;
    priorityQuestions:
      readonly string[];
    customerRepetitionAvoided: true;
  }>;

  readonly urgency: Readonly<{
    level:
      "NORMAL" | "HIGH" | "CRITICAL";
    evidence:
      readonly string[];
    inventedDeadlineBlocked: true;
  }>;

  readonly leadQuality: Readonly<{
    score: number;
    level:
      "LOW" | "MEDIUM" | "HIGH";
    positiveSignals:
      readonly string[];
    uncertaintySignals:
      readonly string[];
    commercialDecisionAuthorized: false;
  }>;

  readonly duplicateAssessment: Readonly<{
    status:
      | "NONE"
      | "EXACT_DUPLICATE"
      | "POSSIBLE_DUPLICATE"
      | "BINDING_CONFLICT";
    existingInquiryId:
      string | null;
    messageDigest: string;
    idempotencyConflict: boolean;
  }>;

  readonly structuredInquiry: Readonly<{
    channel:
      AshaInquiryChannel;
    normalizedMessage: string;
    verifiedFacts:
      readonly AshaVerifiedInquiryFact[];
    meaningChanged: false;
    tenantScoped: true;
  }>;

  readonly routing: Readonly<{
    destination:
      AshaInquiryDepartment;
    reason: string;
    confidence:
      "HIGH" | "MEDIUM" | "LOW";
    ownerReviewRequired: boolean;
  }>;

  readonly handoff: Readonly<{
    status:
      | "READY_FOR_CONTROLLED_HANDOFF"
      | "CUSTOMER_CLARIFICATION_REQUIRED"
      | "OWNER_REVIEW_REQUIRED"
      | "EXISTING_INQUIRY_REUSE";
    inquiryId: string;
    destination:
      AshaInquiryDepartment;
    verifiedContext:
      readonly AshaVerifiedInquiryFact[];
    missingContext:
      readonly string[];
    nextAction: string;
    externalDeliveryAuthorized: false;
  }>;

  readonly ownerBrief: Readonly<{
    customerObjective: string;
    businessImpact:
      "LOW" | "MEDIUM" | "HIGH";
    riskSummary:
      readonly string[];
    recommendedNextAction: string;
    ownerDecisionRequired: boolean;
  }>;

  readonly risk: Readonly<{
    level:
      "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    reasons:
      readonly string[];
    affectedSurfaces:
      readonly string[];
    blockedActions:
      readonly string[];
    escalationRequired: boolean;
  }>;

  readonly continuity: Readonly<{
    priorContextUsed: boolean;
    retainedFactKeys:
      readonly string[];
    conflictingFactKeys:
      readonly string[];
    crossCustomerContextBlocked: true;
    crossTenantContextBlocked: true;
  }>;

  readonly competencyCoverage:
    readonly Readonly<{
      competencyId: string;
      executed: true;
    }>[];

  readonly safetyBoundary: Readonly<{
    isolatedEvaluationOnly: true;
    inquiryPersistencePerformed: false;
    recommendationGenerated: false;
    ownerDecisionPerformed: false;
    externalMessageDeliveryPerformed: false;
    liveProviderExecutionPerformed: false;
    paymentExecutionPerformed: false;
    productionDatabaseTouched: false;
    publicLaunchAuthorized: false;
  }>;

  readonly assessmentDigest: string;
}

const SAFE_IDENTIFIER_PATTERN =
  /^[A-Za-z0-9][A-Za-z0-9._:-]{2,127}$/;

const SAFE_FACT_KEY_PATTERN =
  /^[a-z][a-z0-9_]{1,63}$/;

const SHA_256_PATTERN =
  /^[0-9a-f]{64}$/;

const INTENT_DEFINITIONS: readonly Readonly<{
  intent: AshaInquiryIntent;
  keywords: readonly string[];
}>[] = [
  {
    intent: "QUOTE",
    keywords: [
      "quote",
      "quotation",
      "price proposal",
      "cost estimate",
    ],
  },
  {
    intent: "PRODUCT_ADVICE",
    keywords: [
      "recommend",
      "recommendation",
      "best option",
      "which product",
      "suggest",
    ],
  },
  {
    intent: "ORDER_STATUS",
    keywords: [
      "order status",
      "track order",
      "where is my order",
      "delivery status",
    ],
  },
  {
    intent: "TECHNICAL_SUPPORT",
    keywords: [
      "not working",
      "technical issue",
      "installation help",
      "troubleshoot",
      "support",
    ],
  },
  {
    intent: "COMPLAINT",
    keywords: [
      "complaint",
      "damaged",
      "wrong item",
      "poor service",
      "refund problem",
    ],
  },
  {
    intent: "BILLING",
    keywords: [
      "invoice",
      "billing",
      "bill correction",
      "tax invoice",
    ],
  },
  {
    intent: "PAYMENT",
    keywords: [
      "payment",
      "paid",
      "payment failed",
      "payment link",
      "outstanding amount",
    ],
  },
  {
    intent: "LOGISTICS",
    keywords: [
      "shipping",
      "logistics",
      "dispatch",
      "transport",
      "delivery location",
    ],
  },
  {
    intent: "PROCUREMENT",
    keywords: [
      "supplier",
      "procurement",
      "source material",
      "vendor",
      "purchase requirement",
    ],
  },
  {
    intent: "COMPLIANCE",
    keywords: [
      "compliance",
      "certificate",
      "regulation",
      "legal requirement",
      "audit document",
    ],
  },
  {
    intent: "PURCHASE",
    keywords: [
      "buy",
      "purchase",
      "place order",
      "want to order",
      "need to purchase",
    ],
  },
];

const REQUIRED_FIELDS:
  Readonly<
    Record<
      AshaInquiryIntent,
      readonly string[]
    >
  > = {
    PURCHASE: [
      "product",
      "quantity",
    ],
    QUOTE: [
      "product",
      "quantity",
    ],
    PRODUCT_ADVICE: [
      "product_or_use_case",
      "quantity",
    ],
    ORDER_STATUS: [
      "order_ref",
    ],
    TECHNICAL_SUPPORT: [
      "issue",
      "product_or_order_ref",
    ],
    COMPLAINT: [
      "issue",
      "product_or_order_ref",
    ],
    BILLING: [
      "invoice_ref",
    ],
    PAYMENT: [
      "invoice_ref",
    ],
    LOGISTICS: [
      "order_ref",
      "destination",
    ],
    PROCUREMENT: [
      "product",
      "quantity",
    ],
    COMPLIANCE: [
      "compliance_topic",
      "jurisdiction",
    ],
    GENERAL: [
      "customer_goal",
    ],
  };

const QUESTION_BY_FIELD:
  Readonly<Record<string, string>> = {
    product:
      "Which exact product or service is required?",
    quantity:
      "What quantity is required?",
    product_or_use_case:
      "Which product or business use case should be evaluated?",
    order_ref:
      "What is the relevant order reference?",
    issue:
      "What exact issue occurred?",
    product_or_order_ref:
      "Which product or order does this concern?",
    invoice_ref:
      "What is the relevant invoice reference?",
    destination:
      "What is the delivery destination?",
    compliance_topic:
      "Which compliance requirement or document is involved?",
    jurisdiction:
      "Which country, state, or regulatory jurisdiction applies?",
    customer_goal:
      "What exact outcome would you like NEXUS to help with?",
  };

const DEPARTMENT_BY_INTENT:
  Readonly<
    Record<
      AshaInquiryIntent,
      AshaInquiryDepartment
    >
  > = {
    PURCHASE:
      "SALES",
    QUOTE:
      "SALES",
    PRODUCT_ADVICE:
      "SALES",
    ORDER_STATUS:
      "ORDER_OPERATIONS",
    TECHNICAL_SUPPORT:
      "TECHNICAL_SUPPORT",
    COMPLAINT:
      "COMPLAINT_ESCALATION",
    BILLING:
      "BILLING",
    PAYMENT:
      "PAYMENT_COLLECTION",
    LOGISTICS:
      "LOGISTICS",
    PROCUREMENT:
      "PROCUREMENT",
    COMPLIANCE:
      "COMPLIANCE",
    GENERAL:
      "OWNER_REVIEW",
  };

function stableStringify(
  value: unknown,
): string {
  if (Array.isArray(value)) {
    return (
      "[" +
      value
        .map((item) =>
          stableStringify(item),
        )
        .join(",") +
      "]"
    );
  }

  if (
    value !== null &&
    typeof value === "object"
  ) {
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
            stableStringify(
              record[key],
            ),
        )
        .join(",") +
      "}"
    );
  }

  const primitive =
    JSON.stringify(value);

  if (primitive === undefined) {
    throw new Error(
      "Unsupported deterministic Asha assessment value.",
    );
  }

  return primitive;
}

function sha256(
  value: unknown,
): string {
  return createHash("sha256")
    .update(
      stableStringify(value),
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
    for (
      const propertyName of
      Object.getOwnPropertyNames(value)
    ) {
      const child =
        (
          value as unknown as
            Record<string, unknown>
        )[propertyName];

      if (
        child !== null &&
        typeof child === "object"
      ) {
        deepFreeze(child);
      }
    }

    Object.freeze(value);
  }

  return value as Readonly<T>;
}

function requireIdentifier(
  label: string,
  value: unknown,
): string {
  if (
    typeof value !== "string" ||
    value !== value.trim() ||
    !SAFE_IDENTIFIER_PATTERN.test(
      value,
    )
  ) {
    throw new Error(
      label +
        " must be a canonical safe identifier.",
    );
  }

  return value;
}

function requireMessage(
  value: unknown,
): string {
  if (
    typeof value !== "string"
  ) {
    throw new Error(
      "Asha inquiry message is required.",
    );
  }

  const normalized =
    value
      .trim()
      .replace(/\s+/g, " ");

  if (
    normalized.length < 3 ||
    normalized.length > 4000
  ) {
    throw new Error(
      "Asha inquiry message length is invalid.",
    );
  }

  return normalized;
}

function normalizeFact(
  fact:
    AshaVerifiedInquiryFact,
): AshaVerifiedInquiryFact {
  if (
    !fact ||
    typeof fact !== "object" ||
    typeof fact.key !== "string" ||
    !SAFE_FACT_KEY_PATTERN.test(
      fact.key,
    ) ||
    typeof fact.value !== "string" ||
    fact.value !== fact.value.trim() ||
    fact.value.length < 1 ||
    fact.value.length > 500 ||
    (
      fact.source !== "CUSTOMER" &&
      fact.source !== "OWNER" &&
      fact.source !== "SYSTEM"
    )
  ) {
    throw new Error(
      "Asha verified inquiry fact is invalid.",
    );
  }

  return {
    key:
      fact.key,
    value:
      fact.value,
    source:
      fact.source,
  };
}

function extractLabelledFacts(
  message: string,
): readonly AshaVerifiedInquiryFact[] {
  const labelMap:
    Readonly<Record<string, string>> = {
      product:
        "product",
      item:
        "product",
      quantity:
        "quantity",
      qty:
        "quantity",
      location:
        "location",
      timeline:
        "timeline",
      order:
        "order_ref",
      order_ref:
        "order_ref",
      invoice:
        "invoice_ref",
      invoice_ref:
        "invoice_ref",
      destination:
        "destination",
      jurisdiction:
        "jurisdiction",
      issue:
        "issue",
      compliance:
        "compliance_topic",
      use_case:
        "product_or_use_case",
    };

  const facts:
    AshaVerifiedInquiryFact[] = [];

  const pattern =
    /\b(product|item|quantity|qty|location|timeline|order|order_ref|invoice|invoice_ref|destination|jurisdiction|issue|compliance|use_case)\s*[:=]\s*([^,;\n]{1,100})/gi;

  for (
    const match of
    message.matchAll(pattern)
  ) {
    const label =
      match[1].toLowerCase();

    const key =
      labelMap[label];

    const value =
      match[2]
        .trim()
        .replace(/\s+/g, " ");

    if (
      key &&
      value.length > 0
    ) {
      facts.push({
        key,
        value,
        source:
          "CUSTOMER",
      });
    }
  }

  return facts;
}

function assessIntent(
  message: string,
): Readonly<{
  primary: AshaInquiryIntent;
  secondary:
    AshaInquiryIntent | null;
  confidence:
    "HIGH" | "MEDIUM" | "LOW";
  matchedSignals:
    readonly string[];
  ambiguityDetected: boolean;
}> {
  const lower =
    message.toLowerCase();

  const scored =
    INTENT_DEFINITIONS
      .map((definition) => {
        const matched =
          definition.keywords.filter(
            (keyword) =>
              lower.includes(
                keyword,
              ),
          );

        return {
          intent:
            definition.intent,
          score:
            matched.length,
          matched,
        };
      })
      .filter(
        (candidate) =>
          candidate.score > 0,
      )
      .sort(
        (left, right) =>
          right.score -
            left.score ||
          left.intent.localeCompare(
            right.intent,
          ),
      );

  if (scored.length === 0) {
    return {
      primary:
        "GENERAL",
      secondary:
        null,
      confidence:
        "LOW",
      matchedSignals: [],
      ambiguityDetected:
        true,
    };
  }

  const primary =
    scored[0];

  const second =
    scored[1] ?? null;

  const tied =
    second !== null &&
    second.score ===
      primary.score;

  const confidence =
    tied
      ? "LOW"
      : primary.score >= 2
        ? "HIGH"
        : "MEDIUM";

  return {
    primary:
      primary.intent,
    secondary:
      second?.intent ?? null,
    confidence,
    matchedSignals: [
      ...primary.matched,
    ],
    ambiguityDetected:
      tied,
  };
}

function buildFactState(
  input:
    AshaSpecialistInquiryAssessmentInput,
  normalizedMessage: string,
): Readonly<{
  facts:
    readonly AshaVerifiedInquiryFact[];
  conflictingFields:
    readonly string[];
  priorContextUsed: boolean;
  retainedFactKeys:
    readonly string[];
}> {
  const factsByKey =
    new Map<
      string,
      AshaVerifiedInquiryFact
    >();

  const conflicts =
    new Set<string>();

  const retained =
    new Set<string>();

  const addFact = (
    fact:
      AshaVerifiedInquiryFact,
    fromPrior:
      boolean,
  ): void => {
    const normalized =
      normalizeFact(fact);

    const existing =
      factsByKey.get(
        normalized.key,
      );

    if (!existing) {
      factsByKey.set(
        normalized.key,
        normalized,
      );

      if (fromPrior) {
        retained.add(
          normalized.key,
        );
      }

      return;
    }

    if (
      existing.value !==
      normalized.value
    ) {
      conflicts.add(
        normalized.key,
      );
    }
  };

  if (input.priorContext) {
    if (
      input.priorContext.tenantId !==
        input.tenantId
    ) {
      throw new Error(
        "Asha cross-tenant prior context is blocked.",
      );
    }

    if (
      input.priorContext.customerRef !==
        input.customerRef
    ) {
      throw new Error(
        "Asha cross-customer prior context is blocked.",
      );
    }

    for (
      const fact of
      input.priorContext.facts
    ) {
      addFact(
        fact,
        true,
      );
    }
  }

  for (
    const fact of
    input.verifiedFacts ?? []
  ) {
    addFact(
      fact,
      false,
    );
  }

  for (
    const fact of
    extractLabelledFacts(
      normalizedMessage,
    )
  ) {
    addFact(
      fact,
      false,
    );
  }

  return {
    facts: [
      ...factsByKey.values(),
    ].sort(
      (left, right) =>
        left.key.localeCompare(
          right.key,
        ),
    ),
    conflictingFields: [
      ...conflicts,
    ].sort(),
    priorContextUsed:
      input.priorContext !==
      undefined &&
      input.priorContext !== null,
    retainedFactKeys: [
      ...retained,
    ].sort(),
  };
}

function factExists(
  facts:
    readonly AshaVerifiedInquiryFact[],
  key: string,
): boolean {
  return facts.some(
    (fact) =>
      fact.key === key,
  );
}

function assessUrgency(
  message: string,
): Readonly<{
  level:
    "NORMAL" | "HIGH" | "CRITICAL";
  evidence:
    readonly string[];
}> {
  const lower =
    message.toLowerCase();

  const criticalSignals = [
    "accident",
    "injury",
    "fire",
    "hazard",
    "emergency",
    "shutdown",
    "life safety",
  ].filter(
    (signal) =>
      lower.includes(signal),
  );

  if (
    criticalSignals.length > 0
  ) {
    return {
      level:
        "CRITICAL",
      evidence:
        criticalSignals,
    };
  }

  const highSignals = [
    "urgent",
    "asap",
    "immediately",
    "today",
    "deadline",
  ].filter(
    (signal) =>
      lower.includes(signal),
  );

  if (
    highSignals.length > 0
  ) {
    return {
      level:
        "HIGH",
      evidence:
        highSignals,
    };
  }

  return {
    level:
      "NORMAL",
    evidence: [],
  };
}

export function createAshaInquiryMessageDigest(
  message: string,
): string {
  return sha256(
    requireMessage(message)
      .toLowerCase(),
  );
}

function assessDuplicates(
  input:
    AshaSpecialistInquiryAssessmentInput,
  messageDigest: string,
): Readonly<{
  status:
    | "NONE"
    | "EXACT_DUPLICATE"
    | "POSSIBLE_DUPLICATE"
    | "BINDING_CONFLICT";
  existingInquiryId:
    string | null;
  idempotencyConflict: boolean;
}> {
  let possible:
    AshaDuplicateInquiryCandidate |
    null = null;

  for (
    const candidate of
    input.duplicateCandidates ?? []
  ) {
    if (
      candidate.tenantId !==
        input.tenantId
    ) {
      throw new Error(
        "Asha cross-tenant duplicate candidate is blocked.",
      );
    }

    if (
      candidate.customerRef !==
        input.customerRef
    ) {
      throw new Error(
        "Asha cross-customer duplicate candidate is blocked.",
      );
    }

    requireIdentifier(
      "duplicate inquiryId",
      candidate.inquiryId,
    );

    requireIdentifier(
      "duplicate idempotencyKey",
      candidate.idempotencyKey,
    );

    if (
      !SHA_256_PATTERN.test(
        candidate.messageDigest,
      )
    ) {
      throw new Error(
        "Asha duplicate message digest is invalid.",
      );
    }

    if (
      candidate.idempotencyKey ===
        input.idempotencyKey
    ) {
      if (
        candidate.messageDigest ===
          messageDigest
      ) {
        return {
          status:
            "EXACT_DUPLICATE",
          existingInquiryId:
            candidate.inquiryId,
          idempotencyConflict:
            false,
        };
      }

      return {
        status:
          "BINDING_CONFLICT",
        existingInquiryId:
          candidate.inquiryId,
        idempotencyConflict:
          true,
      };
    }

    if (
      candidate.messageDigest ===
        messageDigest
    ) {
      possible =
        candidate;
    }
  }

  if (possible) {
    return {
      status:
        "POSSIBLE_DUPLICATE",
      existingInquiryId:
        possible.inquiryId,
      idempotencyConflict:
        false,
    };
  }

  return {
    status:
      "NONE",
    existingInquiryId:
      null,
    idempotencyConflict:
      false,
  };
}

function assessLeadQuality(
  intent:
    AshaInquiryIntent,
  facts:
    readonly AshaVerifiedInquiryFact[],
  missingFields:
    readonly string[],
): Readonly<{
  score: number;
  level:
    "LOW" | "MEDIUM" | "HIGH";
  positiveSignals:
    readonly string[];
  uncertaintySignals:
    readonly string[];
}> {
  let score = 0;

  const positiveSignals:
    string[] = [];

  const uncertaintySignals:
    string[] = [];

  if (
    intent === "PURCHASE" ||
    intent === "QUOTE" ||
    intent === "PRODUCT_ADVICE" ||
    intent === "PROCUREMENT"
  ) {
    score += 30;

    positiveSignals.push(
      "commercial-intent",
    );
  }

  const scoredFacts:
    readonly Readonly<{
      key: string;
      points: number;
    }>[] = [
      {
        key:
          "product",
        points:
          20,
      },
      {
        key:
          "product_or_use_case",
        points:
          20,
      },
      {
        key:
          "quantity",
        points:
          15,
      },
      {
        key:
          "location",
        points:
          10,
      },
      {
        key:
          "timeline",
        points:
          10,
      },
    ];

  for (
    const scoredFact of
    scoredFacts
  ) {
    if (
      factExists(
        facts,
        scoredFact.key,
      )
    ) {
      score +=
        scoredFact.points;

      positiveSignals.push(
        "verified-" +
          scoredFact.key,
      );
    }
  }

  if (
    missingFields.length === 0
  ) {
    score += 15;

    positiveSignals.push(
      "required-information-complete",
    );
  }
  else {
    uncertaintySignals.push(
      ...missingFields.map(
        (field) =>
          "missing-" + field,
      ),
    );
  }

  const boundedScore =
    Math.min(
      100,
      score,
    );

  return {
    score:
      boundedScore,
    level:
      boundedScore >= 70
        ? "HIGH"
        : boundedScore >= 40
          ? "MEDIUM"
          : "LOW",
    positiveSignals,
    uncertaintySignals,
  };
}

function uniqueSorted(
  values:
    readonly string[],
): readonly string[] {
  return [
    ...new Set(values),
  ].sort();
}

export function assessAshaSpecialistInquiry(
  input:
    AshaSpecialistInquiryAssessmentInput,
): AshaSpecialistInquiryAssessment {
  if (
    !input ||
    input.evaluationMode !==
      "ISOLATED_EVALUATION"
  ) {
    throw new Error(
      "Asha specialist inquiry assessment is isolated-evaluation only.",
    );
  }

  const tenantId =
    requireIdentifier(
      "tenantId",
      input.tenantId,
    );

  const inquiryId =
    requireIdentifier(
      "inquiryId",
      input.inquiryId,
    );

  const customerRef =
    requireIdentifier(
      "customerRef",
      input.customerRef,
    );

  const idempotencyKey =
    requireIdentifier(
      "idempotencyKey",
      input.idempotencyKey,
    );

  const normalizedMessage =
    requireMessage(
      input.message,
    );

  if (
    input.channel !== "WEB" &&
    input.channel !== "EMAIL" &&
    input.channel !== "WHATSAPP" &&
    input.channel !== "MANUAL" &&
    input.channel !== "API"
  ) {
    throw new Error(
      "Asha inquiry channel is invalid.",
    );
  }

  const intent =
    assessIntent(
      normalizedMessage,
    );

  const factState =
    buildFactState(
      input,
      normalizedMessage,
    );

  const requiredFields =
    REQUIRED_FIELDS[
      intent.primary
    ];

  const missingFields =
    requiredFields.filter(
      (field) =>
        !factExists(
          factState.facts,
          field,
        ),
    );

  const completenessPercent =
    requiredFields.length === 0
      ? 100
      : Math.round(
          (
            (
              requiredFields.length -
              missingFields.length
            ) /
            requiredFields.length
          ) *
            100,
        );

  const priorityQuestions =
    missingFields.map(
      (field) =>
        QUESTION_BY_FIELD[field] ??
        (
          "Please provide " +
          field +
          "."
        ),
    );

  const urgency =
    assessUrgency(
      normalizedMessage,
    );

  const messageDigest =
    createAshaInquiryMessageDigest(
      normalizedMessage,
    );

  const duplicateAssessment =
    assessDuplicates(
      {
        ...input,
        tenantId,
        inquiryId,
        customerRef,
        idempotencyKey,
      },
      messageDigest,
    );

  const leadQuality =
    assessLeadQuality(
      intent.primary,
      factState.facts,
      missingFields,
    );

  const initialDestination =
    DEPARTMENT_BY_INTENT[
      intent.primary
    ];

  const riskReasons:
    string[] = [];

  const affectedSurfaces:
    string[] = [];

  if (
    intent.ambiguityDetected ||
    intent.confidence === "LOW"
  ) {
    riskReasons.push(
      "INTENT_AMBIGUITY",
    );

    affectedSurfaces.push(
      "routing",
    );
  }

  if (
    missingFields.length > 0
  ) {
    riskReasons.push(
      "MISSING_REQUIRED_INFORMATION",
    );

    affectedSurfaces.push(
      "customer-context",
    );
  }

  if (
    factState.conflictingFields
      .length > 0
  ) {
    riskReasons.push(
      "CONFLICTING_VERIFIED_CONTEXT",
    );

    affectedSurfaces.push(
      "customer-memory",
    );
  }

  if (
    duplicateAssessment.status ===
      "BINDING_CONFLICT"
  ) {
    riskReasons.push(
      "IDEMPOTENCY_BINDING_CONFLICT",
    );

    affectedSurfaces.push(
      "inquiry-persistence",
    );
  }

  if (
    duplicateAssessment.status ===
      "POSSIBLE_DUPLICATE"
  ) {
    riskReasons.push(
      "POSSIBLE_DUPLICATE_INQUIRY",
    );

    affectedSurfaces.push(
      "inquiry-lifecycle",
    );
  }

  if (
    urgency.level === "CRITICAL"
  ) {
    riskReasons.push(
      "CRITICAL_CUSTOMER_IMPACT_SIGNAL",
    );

    affectedSurfaces.push(
      "customer-safety",
    );
  }

  const sensitiveIntent =
    intent.primary ===
      "COMPLIANCE" ||
    intent.primary ===
      "PAYMENT" ||
    intent.primary ===
      "COMPLAINT";

  if (sensitiveIntent) {
    riskReasons.push(
      "SENSITIVE_WORKFLOW",
    );

    affectedSurfaces.push(
      intent.primary.toLowerCase(),
    );
  }

  const escalationRequired =
    urgency.level === "CRITICAL" ||
    sensitiveIntent ||
    intent.ambiguityDetected ||
    intent.confidence === "LOW" ||
    factState.conflictingFields
      .length > 0 ||
    duplicateAssessment.status ===
      "BINDING_CONFLICT" ||
    duplicateAssessment.status ===
      "POSSIBLE_DUPLICATE";

  const destination:
    AshaInquiryDepartment =
      escalationRequired
        ? "OWNER_REVIEW"
        : initialDestination;

  const routingConfidence:
    AshaSpecialistInquiryAssessment[
      "routing"
    ]["confidence"] =
      escalationRequired
        ? "LOW"
        : intent.confidence;

  let handoffStatus:
    AshaSpecialistInquiryAssessment[
      "handoff"
    ]["status"];

  let nextAction: string;

  if (
    duplicateAssessment.status ===
      "EXACT_DUPLICATE"
  ) {
    handoffStatus =
      "EXISTING_INQUIRY_REUSE";

    nextAction =
      "Reuse the existing tenant-scoped inquiry and do not create a duplicate.";
  }
  else if (
    escalationRequired
  ) {
    handoffStatus =
      "OWNER_REVIEW_REQUIRED";

    nextAction =
      "Present the evidence, risk reasons, and blocked action to the owner.";
  }
  else if (
    missingFields.length > 0
  ) {
    handoffStatus =
      "CUSTOMER_CLARIFICATION_REQUIRED";

    nextAction =
      "Collect only the missing information before controlled handoff.";
  }
  else {
    handoffStatus =
      "READY_FOR_CONTROLLED_HANDOFF";

    nextAction =
      "Transfer the verified inquiry context to the selected internal specialist.";
  }

  const businessImpact:
    "LOW" | "MEDIUM" | "HIGH" =
      urgency.level ===
        "CRITICAL" ||
      sensitiveIntent
        ? "HIGH"
        : urgency.level ===
            "HIGH" ||
          leadQuality.level ===
            "HIGH"
          ? "MEDIUM"
          : "LOW";

  const riskLevel:
    "LOW" |
    "MEDIUM" |
    "HIGH" |
    "CRITICAL" =
      urgency.level ===
        "CRITICAL"
        ? "CRITICAL"
        : escalationRequired
          ? "HIGH"
          : missingFields.length > 0
            ? "MEDIUM"
            : "LOW";

  const customerObjective =
    intent.primary === "GENERAL"
      ? normalizedMessage
      : (
          intent.primary +
          ": " +
          normalizedMessage
        );

  const reportCore = {
    version:
      ASHA_SPECIALIST_INQUIRY_ASSESSMENT_VERSION,
    employeeId:
      ASHA_SUPER_SPECIALIST_STANDARD
        .employeeId,
    templateId:
      ASHA_SUPER_SPECIALIST_STANDARD
        .templateId,
    tenantId,
    inquiryId,
    customerRef,

    intent: {
      ...intent,
      matchedSignals: [
        ...intent.matchedSignals,
      ],
    },

    requirementCompleteness: {
      verifiedFacts: [
        ...factState.facts,
      ],
      requiredFields: [
        ...requiredFields,
      ],
      missingFields: [
        ...missingFields,
      ],
      conflictingFields: [
        ...factState
          .conflictingFields,
      ],
      completenessPercent,
      unsupportedAssumptionsBlocked:
        true as const,
    },

    missingInformation: {
      clarificationRequired:
        missingFields.length > 0,
      priorityQuestions: [
        ...priorityQuestions,
      ],
      customerRepetitionAvoided:
        true as const,
    },

    urgency: {
      level:
        urgency.level,
      evidence: [
        ...urgency.evidence,
      ],
      inventedDeadlineBlocked:
        true as const,
    },

    leadQuality: {
      ...leadQuality,
      positiveSignals: [
        ...leadQuality
          .positiveSignals,
      ],
      uncertaintySignals: [
        ...leadQuality
          .uncertaintySignals,
      ],
      commercialDecisionAuthorized:
        false as const,
    },

    duplicateAssessment: {
      ...duplicateAssessment,
      messageDigest,
    },

    structuredInquiry: {
      channel:
        input.channel,
      normalizedMessage,
      verifiedFacts: [
        ...factState.facts,
      ],
      meaningChanged:
        false as const,
      tenantScoped:
        true as const,
    },

    routing: {
      destination,
      reason:
        escalationRequired
          ? "Owner review is required because one or more safety, ambiguity, conflict, or sensitive-workflow conditions were detected."
          : (
              "The verified primary intent maps to " +
              initialDestination +
              "."
            ),
      confidence:
        routingConfidence,
      ownerReviewRequired:
        escalationRequired,
    },

    handoff: {
      status:
        handoffStatus,
      inquiryId,
      destination,
      verifiedContext: [
        ...factState.facts,
      ],
      missingContext: [
        ...missingFields,
      ],
      nextAction,
      externalDeliveryAuthorized:
        false as const,
    },

    ownerBrief: {
      customerObjective,
      businessImpact,
      riskSummary:
        uniqueSorted(
          riskReasons,
        ),
      recommendedNextAction:
        nextAction,
      ownerDecisionRequired:
        escalationRequired,
    },

    risk: {
      level:
        riskLevel,
      reasons:
        uniqueSorted(
          riskReasons,
        ),
      affectedSurfaces:
        uniqueSorted(
          affectedSurfaces,
        ),
      blockedActions: [
        "EXTERNAL_MESSAGE_DELIVERY",
        "LIVE_PROVIDER_EXECUTION",
        "PAYMENT_EXECUTION",
        "PRODUCTION_DATABASE_MUTATION",
        "PUBLIC_LAUNCH",
      ],
      escalationRequired,
    },

    continuity: {
      priorContextUsed:
        factState.priorContextUsed,
      retainedFactKeys: [
        ...factState
          .retainedFactKeys,
      ],
      conflictingFactKeys: [
        ...factState
          .conflictingFields,
      ],
      crossCustomerContextBlocked:
        true as const,
      crossTenantContextBlocked:
        true as const,
    },

    competencyCoverage:
      ASHA_SUPER_SPECIALIST_COMPETENCIES
        .map(
          (competency) => ({
            competencyId:
              competency.competencyId,
            executed:
              true as const,
          }),
        ),

    safetyBoundary: {
      isolatedEvaluationOnly:
        true as const,
      inquiryPersistencePerformed:
        false as const,
      recommendationGenerated:
        false as const,
      ownerDecisionPerformed:
        false as const,
      externalMessageDeliveryPerformed:
        false as const,
      liveProviderExecutionPerformed:
        false as const,
      paymentExecutionPerformed:
        false as const,
      productionDatabaseTouched:
        false as const,
      publicLaunchAuthorized:
        false as const,
    },
  };

  const report:
    AshaSpecialistInquiryAssessment = {
      ...reportCore,
      assessmentDigest:
        sha256(reportCore),
  };

  return deepFreeze(
    report,
  ) as AshaSpecialistInquiryAssessment;
}
