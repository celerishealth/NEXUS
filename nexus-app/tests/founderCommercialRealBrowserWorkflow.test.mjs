import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { resolve } from "node:path";

const workflowPath = resolve(process.cwd(), "..", ".github", "workflows", "founder-commercial-real-browser-e2e.yml");
const source = readFileSync(workflowPath, "utf8");

test("keeps founder commercial browser CI manual isolated and read-only", () => {
  assert.match(source, /workflow_dispatch:/);
  assert.match(source, /permissions:\s*\n\s*contents: read/);
  assert.match(source, /node-version: 22/);
  assert.match(source, /npm ci/);
  assert.match(source, /npm run build/);
  assert.match(source, /NEXUS_LOCAL_BROWSER_EXECUTABLE/);
  assert.match(source, /npm run test:founder-emergency-http/);
  assert.doesNotMatch(source, /secrets\./);
  assert.doesNotMatch(source, /supabase\s+(?:link|db push)/i);
  assert.doesNotMatch(source, /\b(?:vercel|deploy|deployment)\b/i);
  assert.doesNotMatch(source, /^\s*(?:push|pull_request):/m);
});
