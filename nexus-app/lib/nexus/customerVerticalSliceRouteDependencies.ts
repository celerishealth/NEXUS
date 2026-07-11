import type {
  CustomerVerticalSliceHttpRouteDependencies,
} from "./customerVerticalSliceHttpRoute";

export type CustomerVerticalSliceRouteDependencyErrorCode =
  | "ROUTE_DEPENDENCIES_NOT_CONFIGURED"
  | "ROUTE_DEPENDENCIES_ALREADY_CONFIGURED"
  | "INVALID_ROUTE_DEPENDENCIES";

export class CustomerVerticalSliceRouteDependencyError extends Error {
  readonly code: CustomerVerticalSliceRouteDependencyErrorCode;

  constructor(
    code: CustomerVerticalSliceRouteDependencyErrorCode,
    message =
      "Customer vertical slice route dependencies are unavailable.",
  ) {
    super(message);
    this.name =
      "CustomerVerticalSliceRouteDependencyError";
    this.code = code;
  }
}

function validateDependencies(
  dependencies: CustomerVerticalSliceHttpRouteDependencies,
): void {
  if (
    !dependencies ||
    typeof dependencies !== "object" ||
    typeof dependencies.loadSession !== "function" ||
    typeof dependencies.verifyRequestIntegrity !== "function" ||
    typeof dependencies.loadAuditContext !== "function" ||
    typeof dependencies.rateLimiter?.consume !== "function" ||
    typeof dependencies.repository?.runInTransaction !== "function"
  ) {
    throw new CustomerVerticalSliceRouteDependencyError(
      "INVALID_ROUTE_DEPENDENCIES",
    );
  }
}

export interface CustomerVerticalSliceRouteDependencyRegistry {
  configure(
    dependencies: CustomerVerticalSliceHttpRouteDependencies,
  ): {
    configured: boolean;
    idempotent: boolean;
  };

  require(): CustomerVerticalSliceHttpRouteDependencies;

  isConfigured(): boolean;
}

export function createCustomerVerticalSliceRouteDependencyRegistry():
  CustomerVerticalSliceRouteDependencyRegistry {
  let configuredDependencies:
    | CustomerVerticalSliceHttpRouteDependencies
    | null = null;

  return {
    configure(dependencies) {
      validateDependencies(dependencies);

      if (configuredDependencies === null) {
        configuredDependencies = dependencies;

        return {
          configured: true,
          idempotent: false,
        };
      }

      if (configuredDependencies === dependencies) {
        return {
          configured: false,
          idempotent: true,
        };
      }

      throw new CustomerVerticalSliceRouteDependencyError(
        "ROUTE_DEPENDENCIES_ALREADY_CONFIGURED",
      );
    },

    require() {
      if (configuredDependencies === null) {
        throw new CustomerVerticalSliceRouteDependencyError(
          "ROUTE_DEPENDENCIES_NOT_CONFIGURED",
        );
      }

      return configuredDependencies;
    },

    isConfigured() {
      return configuredDependencies !== null;
    },
  };
}

const routeDependencyRegistry =
  createCustomerVerticalSliceRouteDependencyRegistry();

export function configureCustomerVerticalSliceRouteDependencies(
  dependencies: CustomerVerticalSliceHttpRouteDependencies,
): {
  configured: boolean;
  idempotent: boolean;
} {
  return routeDependencyRegistry.configure(dependencies);
}

export function requireCustomerVerticalSliceRouteDependencies():
  CustomerVerticalSliceHttpRouteDependencies {
  return routeDependencyRegistry.require();
}

export function areCustomerVerticalSliceRouteDependenciesConfigured():
  boolean {
  return routeDependencyRegistry.isConfigured();
}
