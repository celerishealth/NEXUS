import { describe, expect, it } from "vitest";

import {
  AI_WORKFORCE_CONSTITUTION,
  AI_WORKFORCE_PROHIBITION_IDS,
  AI_WORKFORCE_STOP_LAW_IDS,
  evaluateAiWorkforceConstitution,
  type AiWorkforceConstitutionEvaluationInput,
  type AiWorkforceRequesterSource,
} from "../aiWorkforceConstitution";

function baseInput(
  overrides: Partial<AiWorkforceConstitutionEvaluationInput> = {},
): AiWorkforceConstitutionEvaluationInput {
  return {
    tenantId: "tenant-phase-0",
    actorId: "actor-phase-0",
    requesterSource: "SYSTEM",
    actionClass: "READ_ONLY_VERIFIED_ANALYSIS",
    actionClassState: "KNOWN",
    requestedCapability: "READ_ONLY_ANALYSIS",
    countryState: "APPROVED",
    authorityState: "AUTHORIZED",
    verificationState: "VERIFIED",
    provenanceState: "VERIFIED",
    legalState: "LAWFUL",
    regulatedActivityState: "NOT_REGULATED",
    riskLevel: "LOW",
    humanApprovalRequirement: "NOT_REQUIRED",
    humanApprovalState: "NOT_APPLICABLE",
    evidenceState: "CLEAR",
    prohibitionFindings: [],
    constitutionalOverrideAttempted: false,
    ...overrides,
  };
}

describe("NEXUS AI Workforce Constitution v1", () => {
  it("contains all locked Phase-0 stop laws", () => {
    expect(AI_WORKFORCE_STOP_LAW_IDS).toEqual([
      "UNKNOWN",
      "UNVERIFIED",
      "UNAUTHORIZED",
      "CONFLICTING_EVIDENCE",
      "REGULATED_ACTIVITY",
      "HIGH_RISK_ACTION",
      "LEGAL_UNCERTAINTY",
      "COUNTRY_NOT_APPROVED",
    ]);
  });

  it("contains all 19 permanent prohibitions", () => {
    expect(AI_WORKFORCE_PROHIBITION_IDS).toHaveLength(19);
    expect(new Set(AI_WORKFORCE_PROHIBITION_IDS).size).toBe(19);
  });

  it.each(AI_WORKFORCE_PROHIBITION_IDS)(
    "permanent prohibition %s blocks",
    (prohibition) => {
      const result = evaluateAiWorkforceConstitution(
        baseInput({
          prohibitionFindings: [prohibition],
          humanApprovalState: "APPROVED",
        }),
      );

      expect(result.allowed).toBe(false);
      expect(result.decision).toBe("BLOCK_PROHIBITED");
      expect(result.prohibitionFindings).toContain(prohibition);
    },
  );

  it("UNKNOWN evidence blocks", () => {
    const result = evaluateAiWorkforceConstitution(
      baseInput({ actionClassState: "UNKNOWN" }),
    );

    expect(result.allowed).toBe(false);
    expect(result.decision).toBe("BLOCK_UNKNOWN");
  });

  it("UNVERIFIED evidence blocks", () => {
    const result = evaluateAiWorkforceConstitution(
      baseInput({ verificationState: "UNVERIFIED" }),
    );

    expect(result.allowed).toBe(false);
    expect(result.decision).toBe("BLOCK_UNVERIFIED");
  });

  it("UNVERIFIED provenance blocks", () => {
    const result = evaluateAiWorkforceConstitution(
      baseInput({ provenanceState: "UNVERIFIED" }),
    );

    expect(result.allowed).toBe(false);
    expect(result.decision).toBe("BLOCK_UNVERIFIED");
  });

  it("UNAUTHORIZED action blocks", () => {
    const result = evaluateAiWorkforceConstitution(
      baseInput({ authorityState: "UNAUTHORIZED" }),
    );

    expect(result.allowed).toBe(false);
    expect(result.decision).toBe("BLOCK_UNAUTHORIZED");
  });

  it("CONFLICTING EVIDENCE blocks", () => {
    const result = evaluateAiWorkforceConstitution(
      baseInput({ evidenceState: "CONFLICTING" }),
    );

    expect(result.allowed).toBe(false);
    expect(result.decision).toBe(
      "BLOCK_CONFLICTING_EVIDENCE",
    );
  });

  it("LEGAL UNCERTAINTY blocks", () => {
    const result = evaluateAiWorkforceConstitution(
      baseInput({ legalState: "UNCERTAIN" }),
    );

    expect(result.allowed).toBe(false);
    expect(result.decision).toBe("BLOCK_LEGAL_UNCERTAINTY");
  });

  it("COUNTRY NOT APPROVED blocks", () => {
    const result = evaluateAiWorkforceConstitution(
      baseInput({ countryState: "NOT_APPROVED" }),
    );

    expect(result.allowed).toBe(false);
    expect(result.decision).toBe("BLOCK_COUNTRY_NOT_APPROVED");
  });

  it("regulated activity requires professional review and never silently allows", () => {
    const result = evaluateAiWorkforceConstitution(
      baseInput({
        regulatedActivityState:
          "PROFESSIONAL_REVIEW_REQUIRED",
        humanApprovalState: "APPROVED",
      }),
    );

    expect(result.allowed).toBe(false);
    expect(result.decision).toBe(
      "REQUIRE_PROFESSIONAL_REVIEW",
    );
  });

  it("high-risk action requires human approval", () => {
    const result = evaluateAiWorkforceConstitution(
      baseInput({
        riskLevel: "HIGH",
        humanApprovalRequirement: "REQUIRED",
        humanApprovalState: "MISSING",
      }),
    );

    expect(result.allowed).toBe(false);
    expect(result.decision).toBe("REQUIRE_HUMAN_APPROVAL");
  });

  it("explicit human-approval requirement cannot silently allow when approval is missing", () => {
    const result = evaluateAiWorkforceConstitution(
      baseInput({
        humanApprovalRequirement: "REQUIRED",
        humanApprovalState: "MISSING",
      }),
    );

    expect(result.allowed).toBe(false);
    expect(result.decision).toBe("REQUIRE_HUMAN_APPROVAL");
  });

  it.each([
    "AI_PROMPT",
    "EMPLOYEE",
    "EXTERNAL_DOCUMENT",
    "CUSTOMER",
    "VENDOR",
    "FOUNDER",
  ] satisfies AiWorkforceRequesterSource[])(
    "%s cannot override the constitution",
    (requesterSource) => {
      const result = evaluateAiWorkforceConstitution(
        baseInput({
          requesterSource,
          constitutionalOverrideAttempted: true,
          humanApprovalState: "APPROVED",
        }),
      );

      expect(result.allowed).toBe(false);
      expect(result.decision).toBe("BLOCK_PROHIBITED");
      expect(result.reasonCodes).toContain(
        "CONSTITUTION_OVERRIDE_ATTEMPT",
      );
    },
  );

  it("unlawful founder request is rejected even with approval", () => {
    const result = evaluateAiWorkforceConstitution(
      baseInput({
        requesterSource: "FOUNDER",
        legalState: "UNLAWFUL",
        riskLevel: "HIGH",
        humanApprovalRequirement: "REQUIRED",
        humanApprovalState: "APPROVED",
      }),
    );

    expect(result.allowed).toBe(false);
    expect(result.decision).toBe("BLOCK_PROHIBITED");
    expect(result.reasonCodes).toContain("UNLAWFUL_REQUEST");
  });

  it("owner/human approval cannot override a permanent prohibition", () => {
    const result = evaluateAiWorkforceConstitution(
      baseInput({
        requesterSource: "FOUNDER",
        prohibitionFindings: ["UNAUTHORIZED_PAYMENT"],
        riskLevel: "HIGH",
        humanApprovalRequirement: "REQUIRED",
        humanApprovalState: "APPROVED",
      }),
    );

    expect(result.allowed).toBe(false);
    expect(result.decision).toBe("BLOCK_PROHIBITED");
  });

  it("missing structured input blocks", () => {
    const input = baseInput() as unknown as Record<string, unknown>;
    delete input.tenantId;

    const result = evaluateAiWorkforceConstitution(input);

    expect(result.allowed).toBe(false);
    expect(result.decision).toBe("BLOCK_UNKNOWN");
  });

  it("unknown prohibition identifier blocks instead of being ignored", () => {
    const input = {
      ...baseInput(),
      prohibitionFindings: ["NOT_A_REAL_PROHIBITION"],
    };

    const result = evaluateAiWorkforceConstitution(input);

    expect(result.allowed).toBe(false);
    expect(result.decision).toBe("BLOCK_UNKNOWN");
  });

  it.each([
    ["requesterSource", "ROOT_SUPERUSER"],
    ["actionClassState", "MAYBE"],
    ["countryState", "GLOBAL"],
    ["authorityState", "OWNER_SAYS_YES"],
    ["verificationState", "TRUST_ME"],
    ["provenanceState", "INFERRED"],
    ["legalState", "PROBABLY_LAWFUL"],
    ["regulatedActivityState", "SELF_APPROVED"],
    ["riskLevel", "NONE"],
    ["humanApprovalRequirement", "WAIVED"],
    ["humanApprovalState", "ASSUMED"],
    ["evidenceState", "MOSTLY_CLEAR"],
  ])(
    "malformed enum %s=%s fails closed",
    (field, value) => {
      const input = {
        ...baseInput(),
        [field]: value,
      };

      const result = evaluateAiWorkforceConstitution(input);

      expect(result.allowed).toBe(false);
      expect(result.decision).toBe("BLOCK_UNKNOWN");
    },
  );

  it("canonical constitution cannot be weakened at runtime", () => {
    expect(Object.isFrozen(AI_WORKFORCE_CONSTITUTION)).toBe(true);
    expect(
      Object.isFrozen(
        AI_WORKFORCE_CONSTITUTION.permanentProhibitions,
      ),
    ).toBe(true);
    expect(
      Object.isFrozen(AI_WORKFORCE_CONSTITUTION.overridePolicy),
    ).toBe(true);

    expect(() => {
      (
        AI_WORKFORCE_CONSTITUTION.permanentProhibitions as unknown as string[]
      ).push("ALLOW_FRAUD");
    }).toThrow();

    expect(
      AI_WORKFORCE_CONSTITUTION.permanentProhibitions,
    ).not.toContain("ALLOW_FRAUD");
  });

  it("only fully explicit verified lawful evidence allows constitutionally", () => {
    const result = evaluateAiWorkforceConstitution(baseInput());

    expect(result.allowed).toBe(true);
    expect(result.decision).toBe("ALLOW_CONSTITUTIONALLY");
    expect(result.reasonCodes).toEqual([
      "ALL_CONSTITUTION_REQUIREMENTS_SATISFIED",
    ]);
  });

  it("allowed decision object is frozen", () => {
    const result = evaluateAiWorkforceConstitution(baseInput());

    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.reasonCodes)).toBe(true);
    expect(Object.isFrozen(result.prohibitionFindings)).toBe(true);
  });
});