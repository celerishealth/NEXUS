import {
  readFileSync,
} from "node:fs";
import {
  join,
} from "node:path";
import {
  describe,
  expect,
  it,
} from "vitest";

import {
  resolveControlledActionRuntimePath,
  resolveControlledActionSQLiteRuntimePath,
} from "../controlledActionSQLiteRuntimePath";

const affectedRoutes = [
  "app/api/nexus/auth/password/change/route.ts",
  "app/api/nexus/auth/session/revoke/route.ts",
  "app/api/nexus/auth/session/route.ts",
  "app/api/nexus/founder-emergency/route.ts",
  "app/api/nexus/internal/controlled-actions/readiness/route.ts",
  "app/api/nexus/internal/controlled-actions/route.ts",
  "app/api/nexus/onboarding/tenant/route.ts",
] as const;

describe(
  "resolveControlledActionSQLiteRuntimePath",
  () => {
    it(
      "preserves the default SQLite location",
      () => {
        expect(
          resolveControlledActionSQLiteRuntimePath(
            undefined,
          ),
        ).toBe(
          join(
            process.cwd(),
            ".nexus-runtime",
            "controlled-action-state.sqlite",
          ),
        );
      },
    );

    it(
      "allows a contained relative descendant",
      () => {
        expect(
          resolveControlledActionSQLiteRuntimePath(
            "tenant-a/session.sqlite",
          ),
        ).toBe(
          join(
            process.cwd(),
            ".nexus-runtime",
            "tenant-a",
            "session.sqlite",
          ),
        );
      },
    );

    it(
      "normalizes the legacy .nexus-runtime prefix",
      () => {
        expect(
          resolveControlledActionSQLiteRuntimePath(
            ".nexus-runtime/tenant-a/session.sqlite",
          ),
        ).toBe(
          join(
            process.cwd(),
            ".nexus-runtime",
            "tenant-a",
            "session.sqlite",
          ),
        );
      },
    );

    it.each([
      "",
      "   ",
      ".nexus-runtime",
      "../outside.sqlite",
      "tenant/../../outside.sqlite",
      "/absolute/outside.sqlite",
      "C:\\absolute\\outside.sqlite",
      "\\\\server\\share\\outside.sqlite",
      "C:drive-relative.sqlite",
      "tenant/",
    ])(
      "rejects unsafe configuration %s",
      (configuredPath) => {
        expect(() =>
          resolveControlledActionSQLiteRuntimePath(
            configuredPath,
          ),
        ).toThrow();
      },
    );
  },
);

describe(
  "controlled-action SQLite API route containment",
  () => {
    it.each(
      affectedRoutes,
    )(
      "%s uses the shared resolver",
      (routePath) => {
        const source =
          readFileSync(
            join(
              process.cwd(),
              routePath,
            ),
            "utf8",
          );

        expect(source).toContain(
          "@/lib/nexus/controlledActionSQLiteRuntimePath",
        );

        expect(source).toMatch(
          /resolveControlledActionSQLiteRuntimePath\(\s*process\.env\s*\.\s*NEXUS_CONTROLLED_ACTION_SQLITE_PATH,\s*\)/,
        );

        expect(source).not.toMatch(
          /resolve\(\s*(?:\/\*\s*turbopackIgnore:\s*true\s*\*\/\s*)?process\.cwd\(\)\s*,\s*process\.env\s*\.\s*NEXUS_CONTROLLED_ACTION_SQLITE_PATH/,
        );
      },
    );

    it(
      "keeps the founder-emergency integration fixture contained",
      () => {
        const source =
          readFileSync(
            join(
              process.cwd(),
              "scripts/nexus-founder-emergency-http-integration.ts",
            ),
            "utf8",
          );

        expect(source).toContain(
          "NEXUS_CONTROLLED_ACTION_SQLITE_PATH:\n          sqliteRelativePath,",
        );

        expect(source).toContain(
          "await rm(\n    sqliteRuntimeDirectory,",
        );

        expect(source).toContain(
          'join(\n    process.cwd(),\n    ".nexus-runtime",\n    sqliteRuntimeSegment,',
        );
      },
    );
  },
);

describe(
  "controlled-action general runtime path containment",
  () => {
    it(
      "preserves a contained default runtime path",
      () => {
        expect(
          resolveControlledActionRuntimePath(
            undefined,
            {
              fieldName:
                "NEXUS_CONTROLLED_ACTION_STATE_PATH",
              defaultRelativePath:
                "controlled-action-state.json",
            },
          ),
        ).toBe(
          join(
            process.cwd(),
            ".nexus-runtime",
            "controlled-action-state.json",
          ),
        );
      },
    );

    it(
      "normalizes the legacy runtime prefix",
      () => {
        expect(
          resolveControlledActionRuntimePath(
            ".nexus-runtime/gateway/replay.json",
            {
              fieldName:
                "NEXUS_GATEWAY_REPLAY_STATE_PATH",
            },
          ),
        ).toBe(
          join(
            process.cwd(),
            ".nexus-runtime",
            "gateway",
            "replay.json",
          ),
        );
      },
    );

    it(
      "preserves an explicitly allowed absolute backup path",
      () => {
        const absoluteBackupPath =
          join(
            process.cwd(),
            "external-backup.sqlite",
          );

        expect(
          resolveControlledActionRuntimePath(
            absoluteBackupPath,
            {
              fieldName:
                "NEXUS_CONTROLLED_ACTION_BACKUP_SQLITE_PATH",
              allowAbsolute: true,
            },
          ),
        ).toBe(absoluteBackupPath);
      },
    );

    it(
      "rejects an absolute live-state path",
      () => {
        expect(() =>
          resolveControlledActionRuntimePath(
            join(
              process.cwd(),
              "outside-state.json",
            ),
            {
              fieldName:
                "NEXUS_CONTROLLED_ACTION_STATE_PATH",
            },
          ),
        ).toThrow();
      },
    );

    it.each([
      "../outside.json",
      "tenant/../../outside.json",
      "C:drive-relative.json",
      ".nexus-runtime/",
    ])(
      "rejects unsafe general runtime configuration %s",
      (configuredPath) => {
        expect(() =>
          resolveControlledActionRuntimePath(
            configuredPath,
            {
              fieldName:
                "NEXUS_CONTROLLED_ACTION_STATE_PATH",
            },
          ),
        ).toThrow();
      },
    );

    it.each([
      [
        "app/api/nexus/internal/controlled-actions/readiness/route.ts",
        2,
      ],
      [
        "app/api/nexus/internal/controlled-actions/route.ts",
        5,
      ],
    ] as const)(
      "%s contains every non-SQLite runtime path through the shared resolver",
      (
        routePath,
        expectedResolverCalls,
      ) => {
        const source =
          readFileSync(
            join(
              process.cwd(),
              routePath,
            ),
            "utf8",
          );

        expect(
          source.match(
            /resolveControlledActionRuntimePath\(/g,
          )?.length ?? 0,
        ).toBe(expectedResolverCalls);

        expect(source).not.toMatch(
          /resolve\(\s*process\.cwd\(\)\s*,\s*process\.env/,
        );

        expect(source).not.toMatch(
          /from\s*"node:path"/,
        );
      },
    );
  },
);
