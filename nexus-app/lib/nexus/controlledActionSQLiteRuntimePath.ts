import {
  isAbsolute,
  join,
  normalize,
  posix,
  relative,
  sep,
  win32,
} from "node:path";

const RUNTIME_DIRECTORY_NAME =
  ".nexus-runtime";

const DEFAULT_SQLITE_FILE_NAME =
  "controlled-action-state.sqlite";

function rejectInvalidSegment(
  segment: string,
): void {
  if (
    segment === ".." ||
    segment.includes("\0") ||
    segment.includes(":")
  ) {
    throw new Error(
      "NEXUS_CONTROLLED_ACTION_SQLITE_PATH must remain inside .nexus-runtime.",
    );
  }
}

export interface ControlledActionRuntimePathOptions {
  fieldName: string;
  defaultRelativePath?: string;
  allowAbsolute?: boolean;
}

export function resolveControlledActionRuntimePath(
  configuredPath: string | undefined,
  options: ControlledActionRuntimePathOptions,
): string {
  const fieldName =
    options.fieldName.trim();

  if (!fieldName) {
    throw new Error(
      "Controlled-action runtime-path field name is required.",
    );
  }

  const rawPath =
    configuredPath === undefined
      ? options.defaultRelativePath?.trim() ?? ""
      : configuredPath.trim();

  if (!rawPath) {
    throw new Error(
      `${fieldName} must identify a file path.`,
    );
  }

  const portablePath =
    rawPath.replaceAll("\\", "/");

  const absolutePath =
    isAbsolute(rawPath) ||
    posix.isAbsolute(portablePath) ||
    win32.isAbsolute(rawPath);

  if (absolutePath) {
    if (options.allowAbsolute !== true) {
      throw new Error(
        `${fieldName} must be a relative file path below .nexus-runtime.`,
      );
    }

    return normalize(rawPath);
  }

  if (portablePath.endsWith("/")) {
    throw new Error(
      `${fieldName} must identify a file below .nexus-runtime.`,
    );
  }

  const pathSegments =
    portablePath.split("/");

  if (
    pathSegments[0] ===
      RUNTIME_DIRECTORY_NAME
  ) {
    pathSegments.shift();
  }

  if (
    pathSegments.length === 0 ||
    pathSegments.every(
      (segment) =>
        segment === "" ||
        segment === ".",
    )
  ) {
    throw new Error(
      `${fieldName} must identify a file below .nexus-runtime.`,
    );
  }

  for (const segment of pathSegments) {
    if (
      segment === ".." ||
      segment.includes("\0") ||
      segment.includes(":")
    ) {
      throw new Error(
        `${fieldName} must remain inside .nexus-runtime.`,
      );
    }
  }

  const containedRelativePath =
    pathSegments.join("/");

  const runtimeRoot =
    join(
      process.cwd(),
      RUNTIME_DIRECTORY_NAME,
    );

  const resolvedPath =
    join(
      process.cwd(),
      RUNTIME_DIRECTORY_NAME,
      containedRelativePath,
    );

  const containment =
    relative(
      runtimeRoot,
      resolvedPath,
    );

  if (
    !containment ||
    containment === ".." ||
    containment.startsWith(
      `..${sep}`,
    ) ||
    isAbsolute(containment)
  ) {
    throw new Error(
      `${fieldName} escaped .nexus-runtime.`,
    );
  }

  return resolvedPath;
}

export function resolveControlledActionSQLiteRuntimePath(
  configuredPath: string | undefined,
): string {
  const rawPath =
    configuredPath === undefined
      ? DEFAULT_SQLITE_FILE_NAME
      : configuredPath.trim();

  if (!rawPath) {
    throw new Error(
      "NEXUS_CONTROLLED_ACTION_SQLITE_PATH must not be empty.",
    );
  }

  const portablePath =
    rawPath.replaceAll("\\", "/");

  if (
    portablePath.endsWith("/") ||
    isAbsolute(rawPath) ||
    posix.isAbsolute(portablePath) ||
    win32.isAbsolute(rawPath)
  ) {
    throw new Error(
      "NEXUS_CONTROLLED_ACTION_SQLITE_PATH must be a relative file path.",
    );
  }

  const pathSegments =
    portablePath.split("/");

  if (
    pathSegments[0] ===
      RUNTIME_DIRECTORY_NAME
  ) {
    pathSegments.shift();
  }

  if (
    pathSegments.length === 0 ||
    pathSegments.every(
      (segment) =>
        segment === "" ||
        segment === ".",
    )
  ) {
    throw new Error(
      "NEXUS_CONTROLLED_ACTION_SQLITE_PATH must identify a file below .nexus-runtime.",
    );
  }

  for (const segment of pathSegments) {
    rejectInvalidSegment(segment);
  }

  const containedRelativePath =
    pathSegments.join("/");

  const runtimeRoot =
    join(
      process.cwd(),
      RUNTIME_DIRECTORY_NAME,
    );

  const resolvedPath =
    join(
      process.cwd(),
      RUNTIME_DIRECTORY_NAME,
      containedRelativePath,
    );

  const containment =
    relative(
      runtimeRoot,
      resolvedPath,
    );

  if (
    !containment ||
    containment === ".." ||
    containment.startsWith(
      `..${sep}`,
    ) ||
    isAbsolute(containment)
  ) {
    throw new Error(
      "NEXUS_CONTROLLED_ACTION_SQLITE_PATH escaped .nexus-runtime.",
    );
  }

  return resolvedPath;
}