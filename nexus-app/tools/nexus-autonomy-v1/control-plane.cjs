
"use strict";

const CONTROL_PLANE_VERSION =
  "nexus-autonomy-v1";

const ROLES = Object.freeze([
  "chief_architect",
  "build_engineer",
  "security_engineer",
  "database_guardian",
  "tara_qa",
  "red_team",
  "evidence_auditor",
  "roadmap_controller",
  "rollback_recovery",
  "owner_gate",
]);

const AUTO_ALLOWED = new Set([
  "repo_read",
  "file_read",
  "roadmap_read",
  "architecture_analyze",
  "code_propose",
  "test_design",
  "security_review",
  "red_team_plan",
  "evidence_prepare",
  "rollback_plan",
]);

const OWNER_REQUIRED = new Set([
  "production_deploy",
  "production_config_change",
  "payment_execute",
  "legal_filing",
  "credential_use",
  "secret_access",
  "public_message_send",
  "roadmap_authority_change",
  "constitutional_change",
  "db_schema_change",
  "db_write",
]);

const FORBIDDEN = new Set([
  "existing_nexus_db_mutation",
  "destructive_git",
  "force_push",
  "history_rewrite",
  "secret_export",
  "disable_audit",
  "bypass_owner_gate",
]);

const CAPABILITIES = Object.freeze({
  executionEnabled: false,
  networkEnabled: false,
  databaseMutationEnabled: false,
  productionMutationEnabled: false,
  destructiveGitEnabled: false,
  automaticPhaseAdvanceEnabled: false,
});

function decision(
  actionType,
  value,
  reason
) {
  return Object.freeze({
    actionType,
    decision: value,
    reason,
  });
}

function contextFailure(context) {
  if (!context ||
      typeof context !== "object") {
    return "CONTEXT_MISSING";
  }

  if (context.unlockedPhase !== 0) {
    return "PHASE_0_ONLY";
  }

  if (context.currentPhase !== 0) {
    return "CURRENT_PHASE_NOT_0";
  }

  if (
    context.phase0ConstitutionLocked
    !== true
  ) {
    return "CONSTITUTION_NOT_LOCKED";
  }

  if (
    context.ownerControlEnabled
    !== true
  ) {
    return "OWNER_CONTROL_DISABLED";
  }

  if (context.auditRequired !== true) {
    return "AUDIT_DISABLED";
  }

  if (
    context.existingNexusDbImmutable
    !== true
  ) {
    return "NEXUS_DB_NOT_IMMUTABLE";
  }

  return null;
}

function evaluateAction(
  action,
  context
) {
  const failure =
    contextFailure(context);

  if (failure) {
    return decision(
      action?.type ?? "UNKNOWN",
      "DENY",
      failure
    );
  }

  if (
    !action ||
    typeof action.type !== "string" ||
    action.type.length === 0
  ) {
    return decision(
      "UNKNOWN",
      "DENY",
      "INVALID_ACTION"
    );
  }

  const type = action.type;

  if (FORBIDDEN.has(type)) {
    return decision(
      type,
      "DENY",
      "AUTONOMOUSLY_FORBIDDEN"
    );
  }

  if (OWNER_REQUIRED.has(type)) {
    return decision(
      type,
      "OWNER_APPROVAL_REQUIRED",
      "OWNER_AUTHORITY_BOUNDARY"
    );
  }

  if (AUTO_ALLOWED.has(type)) {
    return decision(
      type,
      "ALLOW_DRY_RUN",
      "AUTHORIZED_NON_MUTATING_WORK"
    );
  }

  return decision(
    type,
    "DENY",
    "UNKNOWN_ACTION_DEFAULT_DENY"
  );
}

function evaluatePlan(
  plan,
  context
) {
  if (!Array.isArray(plan) ||
      plan.length === 0) {
    return Object.freeze({
      status: "STOP",
      reason: "INVALID_PLAN",
      decisions: [],
    });
  }

  const decisions = plan.map(
    action =>
      evaluateAction(action, context)
  );

  if (
    decisions.some(
      x => x.decision === "DENY"
    )
  ) {
    return Object.freeze({
      status: "STOP",
      reason:
        "PLAN_CONTAINS_DENIED_ACTION",
      decisions,
    });
  }

  if (
    decisions.some(
      x =>
        x.decision ===
        "OWNER_APPROVAL_REQUIRED"
    )
  ) {
    return Object.freeze({
      status: "WAIT_OWNER",
      reason: "OWNER_GATE_REQUIRED",
      decisions,
    });
  }

  return Object.freeze({
    status: "DRY_RUN_READY",
    reason:
      "AUTHORIZED_NON_MUTATING_PLAN",
    decisions,
  });
}

module.exports = Object.freeze({
  CONTROL_PLANE_VERSION,
  ROLES,
  CAPABILITIES,
  evaluateAction,
  evaluatePlan,
});
