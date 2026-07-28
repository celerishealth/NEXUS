import {
  readFileSync,
} from "node:fs";
import {
  resolve,
} from "node:path";
import {
  describe,
  expect,
  it,
} from "vitest";

const layoutSource =
  readFileSync(
    resolve(
      process.cwd(),
      "app/layout.tsx",
    ),
    "utf8",
  );

describe(
  "root layout external attribute hydration boundary",
  () => {
    it(
      "suppresses unavoidable browser-injected attributes only at the body boundary",
      () => {
        expect(
          layoutSource,
        ).toMatch(
          /<body\s+suppressHydrationWarning\s+className="min-h-full flex flex-col"\s*>/,
        );

        expect(
          layoutSource,
        ).not.toMatch(
          /<html[^>]*suppressHydrationWarning/,
        );

        expect(
          layoutSource.match(
            /suppressHydrationWarning/g,
          ),
        ).toHaveLength(1);

        expect(
          layoutSource,
        ).toContain(
          "{children}",
        );
      },
    );
  },
);