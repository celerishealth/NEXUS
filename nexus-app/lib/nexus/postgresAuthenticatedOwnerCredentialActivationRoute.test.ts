import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

const doubles = vi.hoisted(
  () => ({
    activateCredential:
      vi.fn(),
    createRuntime:
      vi.fn(),
  }),
);

vi.mock(
  "@/lib/nexus/postgresAuthenticatedOwnerAuthApi",
  () => ({
    activatePostgresAuthenticatedOwnerCredential:
      doubles.activateCredential,
  }),
);

vi.mock(
  "@/lib/nexus/postgresAuthenticatedOwnerAccessRuntime",
  () => ({
    createPostgresAuthenticatedOwnerAuthRuntime:
      doubles.createRuntime,
  }),
);

import {
  POST,
} from "../../app/api/nexus/auth/postgres/credential/activate/route";

const ROUTE_URL =
  "https://nexus.test/api/nexus/auth/postgres/credential/activate";

const originalActivationEnabled =
  process.env
    .NEXUS_POSTGRES_OWNER_CREDENTIAL_ACTIVATION_ENABLED;

const originalStorageMode =
  process.env
    .NEXUS_POSTGRES_AUTH_STORAGE_MODE;

const originalActivationSecret =
  process.env
    .NEXUS_POSTGRES_OWNER_CREDENTIAL_ACTIVATION_SECRET;

const runtimeDouble =
  Object.freeze({
    kind:
      "authenticated-owner-runtime-double",
  });

const successfulBody =
  Object.freeze({
    activated:
      true,
    credential: {
      tenantId:
        "tenant-ppa-industrial-solution-v1",
      ownerId:
        "owner-prashant-srivastav-v1",
      emailNormalized:
        "owner@nexus.test",
      status:
        "ACTIVE",
      credentialVersion:
        1,
    },
    publicSignupAuthorized:
      false,
    publicLaunchAuthorized:
      false,
    liveProviderExecutionAuthorized:
      false,
    paymentExecutionAuthorized:
      false,
    externalDeliveryAuthorized:
      false,
  });

interface ActivationRequestOptions {
  readonly secret?: string;
  readonly tenantId?: string;
  readonly requestId?: string;
  readonly body?: unknown;
  readonly rawBody?: string;
}

function restoreEnvironmentValue(
  name: string,
  value: string | undefined,
): void {
  if (value === undefined) {
    delete process.env[name];
    return;
  }

  process.env[name] =
    value;
}

function configureEnabledRoute(): void {
  process.env
    .NEXUS_POSTGRES_OWNER_CREDENTIAL_ACTIVATION_ENABLED =
    "true";

  process.env
    .NEXUS_POSTGRES_AUTH_STORAGE_MODE =
    "postgres";

  process.env
    .NEXUS_POSTGRES_OWNER_CREDENTIAL_ACTIVATION_SECRET =
    "configured-owner-activation-secret";
}

function activationRequest(
  input:
    ActivationRequestOptions = {},
): Parameters<typeof POST>[0] {
  const headers:
    Record<string, string> = {
      "content-type":
        "application/json",
  };

  if (input.secret !== undefined) {
    headers[
      "x-nexus-owner-activation-secret"
    ] =
      input.secret;
  }

  if (input.tenantId !== undefined) {
    headers[
      "x-nexus-tenant-id"
    ] =
      input.tenantId;
  }

  if (input.requestId !== undefined) {
    headers[
      "x-request-id"
    ] =
      input.requestId;
  }

  const body =
    input.rawBody ??
    JSON.stringify(
      input.body ?? {
        tenantId:
          "tenant-ppa-industrial-solution-v1",
        ownerId:
          "owner-prashant-srivastav-v1",
        email:
          "owner@nexus.test",
        password:
          "Controlled-Password-For-Test-Only",
      },
    );

  return new Request(
    ROUTE_URL,
    {
      method:
        "POST",
      headers,
      body,
    },
  ) as Parameters<typeof POST>[0];
}

async function readJson(
  response: Response,
): Promise<Record<string, unknown>> {
  return await response.json() as
    Record<string, unknown>;
}

describe(
  "PostgreSQL authenticated-owner credential activation route",
  () => {
    beforeEach(
      () => {
        delete process.env
          .NEXUS_POSTGRES_OWNER_CREDENTIAL_ACTIVATION_ENABLED;

        delete process.env
          .NEXUS_POSTGRES_AUTH_STORAGE_MODE;

        delete process.env
          .NEXUS_POSTGRES_OWNER_CREDENTIAL_ACTIVATION_SECRET;

        doubles.activateCredential
          .mockReset();

        doubles.createRuntime
          .mockReset();

        doubles.createRuntime
          .mockReturnValue(
            runtimeDouble,
          );

        doubles.activateCredential
          .mockResolvedValue({
            status:
              201,
            body:
              successfulBody,
          });
      },
    );

    afterEach(
      () => {
        restoreEnvironmentValue(
          "NEXUS_POSTGRES_OWNER_CREDENTIAL_ACTIVATION_ENABLED",
          originalActivationEnabled,
        );

        restoreEnvironmentValue(
          "NEXUS_POSTGRES_AUTH_STORAGE_MODE",
          originalStorageMode,
        );

        restoreEnvironmentValue(
          "NEXUS_POSTGRES_OWNER_CREDENTIAL_ACTIVATION_SECRET",
          originalActivationSecret,
        );
      },
    );

    it(
      "blocks credential activation when the route is disabled by default",
      async () => {
        const response =
          await POST(
            activationRequest(),
          );

        expect(response.status)
          .toBe(503);

        expect(
          await readJson(
            response,
          ),
        ).toMatchObject({
          error:
            "PostgreSQL owner credential activation is disabled by default.",
          publicSignupAuthorized:
            false,
          publicLaunchAuthorized:
            false,
          liveProviderExecutionAuthorized:
            false,
          paymentExecutionAuthorized:
            false,
          externalDeliveryAuthorized:
            false,
        });

        expect(
          response.headers.get(
            "cache-control",
          ),
        ).toBe("no-store");

        expect(
          doubles.createRuntime,
        ).not.toHaveBeenCalled();

        expect(
          doubles.activateCredential,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "blocks credential activation outside postgres storage mode",
      async () => {
        process.env
          .NEXUS_POSTGRES_OWNER_CREDENTIAL_ACTIVATION_ENABLED =
          "true";

        process.env
          .NEXUS_POSTGRES_AUTH_STORAGE_MODE =
          "file";

        const response =
          await POST(
            activationRequest(),
          );

        expect(response.status)
          .toBe(503);

        expect(
          await readJson(
            response,
          ),
        ).toMatchObject({
          error:
            "PostgreSQL owner credential activation requires postgres storage mode.",
          publicLaunchAuthorized:
            false,
        });

        expect(
          doubles.createRuntime,
        ).not.toHaveBeenCalled();

        expect(
          doubles.activateCredential,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "blocks credential activation when the authorization secret is not configured",
      async () => {
        process.env
          .NEXUS_POSTGRES_OWNER_CREDENTIAL_ACTIVATION_ENABLED =
          "true";

        process.env
          .NEXUS_POSTGRES_AUTH_STORAGE_MODE =
          "postgres";

        const response =
          await POST(
            activationRequest(),
          );

        expect(response.status)
          .toBe(503);

        expect(
          await readJson(
            response,
          ),
        ).toMatchObject({
          error:
            "PostgreSQL owner credential activation is not configured.",
          publicLaunchAuthorized:
            false,
        });

        expect(
          doubles.createRuntime,
        ).not.toHaveBeenCalled();

        expect(
          doubles.activateCredential,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "blocks a request carrying an incorrect activation secret",
      async () => {
        configureEnabledRoute();

        const response =
          await POST(
            activationRequest({
              secret:
                "incorrect-owner-activation-secret",
            }),
          );

        expect(response.status)
          .toBe(401);

        expect(
          await readJson(
            response,
          ),
        ).toMatchObject({
          error:
            "Owner credential activation authorization failed.",
          publicSignupAuthorized:
            false,
          publicLaunchAuthorized:
            false,
          liveProviderExecutionAuthorized:
            false,
          paymentExecutionAuthorized:
            false,
          externalDeliveryAuthorized:
            false,
        });

        expect(
          doubles.createRuntime,
        ).not.toHaveBeenCalled();

        expect(
          doubles.activateCredential,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "delegates one tenant-bound request only after the protected activation secret matches",
      async () => {
        configureEnabledRoute();

        const requestBody = {
          tenantId:
            "tenant-ppa-industrial-solution-v1",
          ownerId:
            "owner-prashant-srivastav-v1",
          email:
            "owner@nexus.test",
          password:
            "Controlled-Password-For-Test-Only",
        };

        const response =
          await POST(
            activationRequest({
              secret:
                "configured-owner-activation-secret",
              tenantId:
                "tenant-ppa-industrial-solution-v1",
              requestId:
                "request-owner-activation-0001",
              body:
                requestBody,
            }),
          );

        expect(
          doubles.createRuntime,
        ).toHaveBeenCalledTimes(1);

        expect(
          doubles.activateCredential,
        ).toHaveBeenCalledTimes(1);

        expect(
          doubles.activateCredential,
        ).toHaveBeenCalledWith(
          {
            body:
              requestBody,
            headers: {
              tenantId:
                "tenant-ppa-industrial-solution-v1",
              requestId:
                "request-owner-activation-0001",
            },
            ownerApprovalGranted:
              true,
          },
          runtimeDouble,
        );

        expect(response.status)
          .toBe(201);

        expect(
          await readJson(
            response,
          ),
        ).toEqual(
          successfulBody,
        );

        expect(
          response.headers.get(
            "cache-control",
          ),
        ).toBe("no-store");

        expect(
          response.headers.get(
            "pragma",
          ),
        ).toBe("no-cache");
      },
    );
  },
);
