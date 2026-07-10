import {
  ControlledActionOperationalReadinessService,
  type ControlledActionOperationalReadinessConfig,
  type ControlledActionOperationalReadinessResult,
} from "./controlledActionOperationalReadiness";

export interface AssertCommandReadinessRequest {
  now: string;
}

export class ControlledActionReadinessGateClosedError
  extends Error {
  readonly readiness:
    ControlledActionOperationalReadinessResult;

  constructor(
    readiness:
      ControlledActionOperationalReadinessResult,
  ) {
    const failedChecks =
      readiness.checks
        .filter(
          (check) =>
            check.required &&
            !check.passed,
        )
        .map(
          (check) =>
            `${check.name}: ${check.detail}`,
        );

    super(
      `Controlled-action operational readiness gate is closed.${
        failedChecks.length > 0
          ? ` ${failedChecks.join(" ")}`
          : ""
      }`,
    );

    this.name =
      "ControlledActionReadinessGateClosedError";

    this.readiness = readiness;
  }
}

export class ControlledActionCommandReadinessGate {
  private readonly readinessService:
    ControlledActionOperationalReadinessService;

  constructor(
    config:
      ControlledActionOperationalReadinessConfig,
  ) {
    this.readinessService =
      new ControlledActionOperationalReadinessService(
        config,
      );
  }

  async assertOpen(
    request: AssertCommandReadinessRequest,
  ): Promise<ControlledActionOperationalReadinessResult> {
    const readiness =
      await this.readinessService.evaluate({
        now: request.now,
      });

    if (!readiness.ready) {
      throw new ControlledActionReadinessGateClosedError(
        readiness,
      );
    }

    if (
      readiness.executionGate !==
      "OPEN_FOR_PERSISTENCE_ONLY_COMMANDS"
    ) {
      throw new ControlledActionReadinessGateClosedError(
        readiness,
      );
    }

    if (
      readiness.liveProviderExecutionAuthorized !==
      false
    ) {
      throw new Error(
        "Controlled-action readiness returned an unsafe provider-execution boundary.",
      );
    }

    return readiness;
  }
}
