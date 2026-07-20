import {
  readdirSync,
  readFileSync,
} from "node:fs";

import {
  join,
  resolve,
} from "node:path";

import {
  fileURLToPath,
} from "node:url";

const EXPECTED_MIGRATION_COUNT = 18;
const EXPECTED_TABLE_COUNT = 16;
const EXPECTED_SECURITY_DEFINER_COUNT = 17;

const allowedRoles =
  new Set([
    "public",
    "anon",
    "authenticated",
    "service_role",
  ]);

const highRiskPatterns = [
  {
    code: "CREATE_EXTENSION",
    pattern:
      /\bCREATE\s+EXTENSION\b/i,
  },
  {
    code: "CREATE_EVENT_TRIGGER",
    pattern:
      /\bCREATE\s+EVENT\s+TRIGGER\b/i,
  },
  {
    code: "ALTER_EVENT_TRIGGER",
    pattern:
      /\bALTER\s+EVENT\s+TRIGGER\b/i,
  },
  {
    code: "CREATE_ROLE",
    pattern:
      /\bCREATE\s+ROLE\b/i,
  },
  {
    code: "ALTER_ROLE",
    pattern:
      /\bALTER\s+ROLE\b/i,
  },
  {
    code: "SET_ROLE",
    pattern:
      /\bSET\s+ROLE\b/i,
  },
  {
    code: "ALTER_SYSTEM",
    pattern:
      /\bALTER\s+SYSTEM\b/i,
  },
  {
    code: "OWNER_TO",
    pattern:
      /\bOWNER\s+TO\b/i,
  },
  {
    code: "COPY_PROGRAM",
    pattern:
      /\bCOPY\b[\s\S]*?\bPROGRAM\b/i,
  },
];

function unique(values) {
  return [
    ...new Set(values),
  ].sort();
}

function escapeRegex(value) {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );
}

function parseRoleTargets(value) {
  return value
    .split(",")
    .map(
      (item) =>
        item
          .trim()
          .replace(
            /^["']|["']$/g,
            "",
          )
          .match(
            /^[a-z_][a-z0-9_]*/i,
          )?.[0]
          ?.toLowerCase() ?? "",
    )
    .filter(Boolean);
}

function collectPermissionRoles({
  sql,
  objectType,
  objectName,
  action,
}) {
  const escapedName =
    escapeRegex(objectName);

  const prefix =
    action === "revoke"
      ? "revoke\\s+all"
      : objectType === "function"
        ? "grant\\s+execute"
        : "grant\\s+[\\s\\S]*?";

  const direction =
    action === "revoke"
      ? "from"
      : "to";

  const signature =
    objectType === "function"
      ? "\\s*\\([\\s\\S]*?\\)"
      : "";

  const pattern =
    new RegExp(
      `${prefix}\\s+on\\s+${objectType}\\s+${escapedName}${signature}\\s+${direction}\\s+([^;']+)`,
      "gi",
    );

  return unique(
    [
      ...sql.matchAll(pattern),
    ].flatMap(
      (match) =>
        parseRoleTargets(
          match[1],
        ),
    ),
  );
}

export function buildSupabaseMigrationSecurityReport({
  appRoot = process.cwd(),
} = {}) {
  const migrationsDirectory =
    join(
      appRoot,
      "supabase",
      "migrations",
    );

  const migrationFiles =
    readdirSync(
      migrationsDirectory,
    )
      .filter(
        (name) =>
          name.endsWith(".sql") &&
          name !==
            "0000_remote_rls_guard_fixture.sql",
      )
      .sort();

  const migrations =
    migrationFiles.map(
      (name) => ({
        name,
        sql:
          readFileSync(
            join(
              migrationsDirectory,
              name,
            ),
            "utf8",
          ),
      }),
    );

  const allSql =
    migrations
      .map(
        (migration) =>
          migration.sql,
      )
      .join("\n");

  const highRiskFindings = [];

  for (
    const migration
    of migrations
  ) {
    for (
      const control
      of highRiskPatterns
    ) {
      if (
        control.pattern.test(
          migration.sql,
        )
      ) {
        highRiskFindings.push({
          file:
            migration.name,
          code:
            control.code,
        });
      }
    }
  }

  const createdTables =
    unique(
      [
        ...allSql.matchAll(
          /\bcreate\s+table\s+(?:if\s+not\s+exists\s+)?public\.([a-z_][a-z0-9_]*)/gi,
        ),
      ].map(
        (match) =>
          match[1].toLowerCase(),
      ),
    );

  const rlsEnabledTables =
    unique(
      [
        ...allSql.matchAll(
          /\balter\s+table\s+(?:if\s+exists\s+)?public\.([a-z_][a-z0-9_]*)\s+enable\s+row\s+level\s+security/gi,
        ),
      ].map(
        (match) =>
          match[1].toLowerCase(),
      ),
    );

  const missingRls =
    createdTables.filter(
      (table) =>
        !rlsEnabledTables.includes(
          table,
        ),
    );

  const unknownRlsTargets =
    rlsEnabledTables.filter(
      (table) =>
        !createdTables.includes(
          table,
        ),
    );

  const policyCount =
    [
      ...allSql.matchAll(
        /\bcreate\s+policy\b/gi,
      ),
    ].length;

  const permissionStatements =
    [
      ...allSql.matchAll(
        /\b(?:grant|revoke)\b[\s\S]*?;/gi,
      ),
    ];

  const roleReferences = [];
  const unparsedPermissionStatements = [];

  for (
    const statementMatch
    of permissionStatements
  ) {
    const statement =
      statementMatch[0];

    const targetMatch =
      statement.match(
        /\b(?:to|from)\s+([a-z_][a-z0-9_]*(?:\s*,\s*[a-z_][a-z0-9_]*)*)/i,
      );

    if (!targetMatch) {
      unparsedPermissionStatements.push(
        statement
          .replace(
            /\s+/g,
            " ",
          )
          .trim(),
      );

      continue;
    }

    roleReferences.push(
      ...parseRoleTargets(
        targetMatch[1],
      ),
    );
  }

  const uniqueRoles =
    unique(
      roleReferences,
    );

  const unexpectedRoles =
    uniqueRoles.filter(
      (role) =>
        !allowedRoles.has(role),
    );

  const functionPattern =
    /\bcreate\s+or\s+replace\s+function\s+(public\.[a-z_][a-z0-9_]*)\s*\((.*?)\)(.*?)\bas\s+(\$[a-z_0-9]*\$)(.*?)\4\s*;/gis;

  const functionBlocks =
    [
      ...allSql.matchAll(
        functionPattern,
      ),
    ];

  const securedFunctions =
    functionBlocks
      .filter(
        (match) =>
          /\bsecurity\s+definer\b/i.test(
            match[3],
          ),
      )
      .map(
        (match) => {
          const name =
            match[1].toLowerCase();

          const header =
            match[3];

          const body =
            match[5];

          const revokedRoles =
            collectPermissionRoles({
              sql:
                allSql,
              objectType:
                "function",
              objectName:
                name,
              action:
                "revoke",
            });

          const grantedRoles =
            collectPermissionRoles({
              sql:
                allSql,
              objectType:
                "function",
              objectName:
                name,
              action:
                "grant",
            });

          const unexpectedGrants =
            grantedRoles.filter(
              (role) =>
                role !==
                  "service_role",
            );

          const explicitSearchPath =
            /\bset\s+search_path\s*(?:=|to)/i.test(
              header,
            );

          const passed =
            explicitSearchPath &&
            revokedRoles.includes(
              "public",
            ) &&
            revokedRoles.includes(
              "anon",
            ) &&
            revokedRoles.includes(
              "authenticated",
            ) &&
            grantedRoles.includes(
              "service_role",
            ) &&
            unexpectedGrants.length === 0;

          return {
            name,
            body,
            explicitSearchPath,
            revokedRoles,
            grantedRoles,
            unexpectedGrants,
            passed,
          };
        },
      );

  const functionFailures =
    securedFunctions.filter(
      (item) =>
        !item.passed,
    );

  const tableReports =
    createdTables.map(
      (table) => {
        const objectName =
          `public.${table}`;

        const revokedRoles =
          collectPermissionRoles({
            sql:
              allSql,
            objectType:
              "table",
            objectName,
            action:
              "revoke",
          });

        const grantedRoles =
          collectPermissionRoles({
            sql:
              allSql,
            objectType:
              "table",
            objectName,
            action:
              "grant",
          });

        const unexpectedDirectGrants =
          grantedRoles.filter(
            (role) =>
              role !==
                "service_role",
          );

        const directServiceRoleAccess =
          grantedRoles.includes(
            "service_role",
          ) &&
          unexpectedDirectGrants.length ===
            0;

        const tablePattern =
          new RegExp(
            `(?:public\\.)?\\b${escapeRegex(table)}\\b`,
            "i",
          );

        const mappedFunctions =
          securedFunctions.filter(
            (item) =>
              tablePattern.test(
                item.body,
              ),
          );

        const securedFunctionOnlyAccess =
          !directServiceRoleAccess &&
          mappedFunctions.some(
            (item) =>
              item.passed,
          );

        const passed =
          revokedRoles.includes(
            "public",
          ) &&
          revokedRoles.includes(
            "anon",
          ) &&
          revokedRoles.includes(
            "authenticated",
          ) &&
          unexpectedDirectGrants.length ===
            0 &&
          (
            directServiceRoleAccess ||
            securedFunctionOnlyAccess
          );

        return {
          table,
          revokedRoles,
          grantedRoles,
          unexpectedDirectGrants,
          directServiceRoleAccess,
          securedFunctionOnlyAccess,
          mappedFunctions:
            unique(
              mappedFunctions.map(
                (item) =>
                  item.name,
              ),
            ),
          passed,
        };
      },
    );

  const tableFailures =
    tableReports.filter(
      (item) =>
        !item.passed,
    );

  const directServiceRoleTableCount =
    tableReports.filter(
      (item) =>
        item.directServiceRoleAccess,
    ).length;

  const securedFunctionOnlyTableCount =
    tableReports.filter(
      (item) =>
        item.securedFunctionOnlyAccess,
    ).length;

  const passed =
    migrationFiles.length ===
      EXPECTED_MIGRATION_COUNT &&
    createdTables.length ===
      EXPECTED_TABLE_COUNT &&
    securedFunctions.length ===
      EXPECTED_SECURITY_DEFINER_COUNT &&
    highRiskFindings.length === 0 &&
    missingRls.length === 0 &&
    unknownRlsTargets.length === 0 &&
    policyCount === 2 &&
    unparsedPermissionStatements.length ===
      0 &&
    unexpectedRoles.length === 0 &&
    functionFailures.length === 0 &&
    tableFailures.length === 0;

  return {
    schemaVersion:
      "nexus.supabase-migration-security-gate.v1",
    passed,
    permanentMigrationCount:
      migrationFiles.length,
    publicTableCount:
      createdTables.length,
    rlsEnabledTableCount:
      rlsEnabledTables.length,
    missingRls,
    unknownRlsTargets,
    policyCount,
    highRiskFindings,
    permissionStatementCount:
      permissionStatements.length,
    roleReferenceCount:
      roleReferences.length,
    uniqueRoles,
    unparsedPermissionStatementCount:
      unparsedPermissionStatements.length,
    unexpectedRoles,
    securityDefinerCount:
      securedFunctions.length,
    securityDefinerFailures:
      functionFailures.map(
        (item) => ({
          name:
            item.name,
          explicitSearchPath:
            item.explicitSearchPath,
          revokedRoles:
            item.revokedRoles,
          grantedRoles:
            item.grantedRoles,
          unexpectedGrants:
            item.unexpectedGrants,
          passed:
            item.passed,
        }),
      ),
    directServiceRoleTableCount,
    securedFunctionOnlyTableCount,
    tableFailures,
    productionDatabaseConfigured:
      false,
    productionMigrationPerformed:
      false,
    publicLaunchAuthorized:
      false,
  };
}

const isDirectExecution =
  process.argv[1] &&
  resolve(
    process.argv[1],
  ) ===
    resolve(
      fileURLToPath(
        import.meta.url,
      ),
    );

if (isDirectExecution) {
  const report =
    buildSupabaseMigrationSecurityReport();

  console.log(
    `SUPABASE MIGRATION SECURITY GATE: ${
      report.passed
        ? "PASS"
        : "FAIL"
    }`,
  );

  console.log(
    `PERMANENT MIGRATIONS: ${report.permanentMigrationCount}`,
  );

  console.log(
    `PUBLIC TABLES / RLS: ${report.publicTableCount}/${report.rlsEnabledTableCount}`,
  );

  console.log(
    `SECURITY DEFINER CONTRACT: ${
      report.securityDefinerCount -
      report.securityDefinerFailures.length
    }/${report.securityDefinerCount}`,
  );

  console.log(
    `TABLE ACCESS CONTRACT: ${
      report.publicTableCount -
      report.tableFailures.length
    }/${report.publicTableCount}`,
  );

  console.log(
    `DIRECT / FUNCTION-ONLY TABLES: ${report.directServiceRoleTableCount}/${report.securedFunctionOnlyTableCount}`,
  );

  console.log(
    `HIGH-RISK FINDINGS: ${report.highRiskFindings.length}`,
  );

  console.log(
    `UNPARSED PERMISSION STATEMENTS: ${report.unparsedPermissionStatementCount}`,
  );

  console.log(
    `UNEXPECTED ROLES: ${report.unexpectedRoles.length}`,
  );

  if (!report.passed) {
    console.log(
      JSON.stringify(
        report,
        null,
        2,
      ),
    );

    process.exitCode = 1;
  }
}