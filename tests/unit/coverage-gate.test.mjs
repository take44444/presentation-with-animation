import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync, execFileSync } from 'node:child_process';
const script = path.resolve('scripts/check-changed-coverage.mjs');
let root;
let base;
beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'coverage-fixture-'));
  execFileSync('git', ['init', '-q'], { cwd: root });
  execFileSync(
    'git',
    [
      '-c',
      'user.name=Test',
      '-c',
      'user.email=test@example.com',
      'commit',
      '--allow-empty',
      '-qm',
      'base',
    ],
    { cwd: root },
  );
  base = execFileSync('git', ['rev-parse', 'HEAD'], {
    cwd: root,
    encoding: 'utf8',
  }).trim();
  fs.mkdirSync(path.join(root, 'app'), { recursive: true });
  fs.writeFileSync(
    path.join(root, 'app/page.tsx'),
    'export const value: number = 1;',
  );
});
afterEach(() => fs.rmSync(root, { recursive: true, force: true }));
const run = (report, comparison = base) => {
  if (report) {
    fs.mkdirSync(path.join(root, 'coverage'));
    fs.writeFileSync(
      path.join(root, 'coverage/coverage-summary.json'),
      JSON.stringify(report),
    );
  }
  if (!fs.existsSync(script)) return 0;
  return spawnSync(
    'node',
    [script, ...(comparison ? ['--base', comparison] : [])],
    { cwd: root, encoding: 'utf8' },
  ).status;
};
const summary = (pct) => ({
  [path.join(root, 'app/page.tsx')]: {
    lines: { total: 10, covered: pct / 10, pct },
  },
});
test('fails an individual file below 80% despite aggregate 100%', () =>
  expect(run({ ...summary(79), total: { lines: { pct: 100 } } })).not.toBe(0));
test('fails an unreported untracked application file', () =>
  expect(run({ total: { lines: { pct: 100 } } })).not.toBe(0));
test('fails a missing comparison SHA', () =>
  expect(run(summary(100), null)).not.toBe(0));
test('fails a missing report', () => expect(run(null)).not.toBe(0));
test('passes covered executable source', () =>
  expect(run(summary(80))).toBe(0));
test('excludes deleted, generated and type-only files', () => {
  fs.writeFileSync(
    path.join(root, 'app/types.ts'),
    'export interface I { readonly value: number; }',
  );
  fs.writeFileSync(
    path.join(root, 'app/env.d.ts'),
    'declare const value: string;',
  );
  fs.mkdirSync(path.join(root, '.next'));
  fs.writeFileSync(path.join(root, '.next/generated.ts'), 'const x = 1;');
  expect(run(summary(100))).toBe(0);
});
