// ts-morph Project singleton for the audit scanner. Constructing the project
// from tsconfig.app.json takes several seconds on a cold start; every
// consumer (writer/reader index, hand-card analyzer, future AST scans)
// shares this one instance so the cost amortizes.
//
// We target tsconfig.app.json (not the root tsconfig.json) because the root
// uses project references with no direct `include`, and ts-morph's default
// behavior doesn't recursively expand referenced projects. The app config is
// what covers `src/` — which is everything the scanner needs to inspect.

import * as path from 'node:path';
import { Project } from 'ts-morph';

let cached: Project | null = null;

export function getAuditProject(): Project {
  if (cached) return cached;
  const tsConfigFilePath = path.resolve(process.cwd(), 'tsconfig.app.json');
  cached = new Project({
    tsConfigFilePath,
    skipAddingFilesFromTsConfig: false,
    skipLoadingLibFiles: true,
  });
  return cached;
}

/** Reset — only used by tests that want to rebuild against a mock project. */
export function __resetAuditProjectForTests(): void {
  cached = null;
}
