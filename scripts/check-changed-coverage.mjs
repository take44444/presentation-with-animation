import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import ts from 'typescript';
/** Return executable application paths, excluding declarations and erased type modules. */
export function executableFiles(root, base) {
  execFileSync('git', ['rev-parse', '--verify', `${base}^{commit}`], {
    cwd: root,
    stdio: 'pipe',
  });
  const changed = execFileSync(
    'git',
    ['diff', '--name-only', base, '--', 'app'],
    { cwd: root, encoding: 'utf8' },
  ).split('\n');
  const untracked = execFileSync(
    'git',
    ['ls-files', '--others', '--exclude-standard', 'app'],
    { cwd: root, encoding: 'utf8' },
  ).split('\n');
  const feature = path.join(
    root,
    'app/how-to-create-attractive-presentation-materials',
  );
  const walk = (dir) =>
    fs
      .readdirSync(dir, { withFileTypes: true })
      .flatMap((entry) =>
        entry.isDirectory()
          ? walk(path.join(dir, entry.name))
          : [path.relative(root, path.join(dir, entry.name))],
      );
  return [
    ...new Set([
      ...changed,
      ...untracked,
      ...(fs.existsSync(feature) ? walk(feature) : []),
    ]),
  ].filter((file) => {
    if (
      !/^app\/.*\.(ts|tsx|js|jsx)$/.test(file) ||
      file.endsWith('.d.ts') ||
      !fs.existsSync(path.join(root, file))
    )
      return false;
    const output = ts.transpileModule(
      fs.readFileSync(path.join(root, file), 'utf8'),
      {
        compilerOptions: {
          target: ts.ScriptTarget.ESNext,
          module: ts.ModuleKind.ESNext,
          jsx: ts.JsxEmit.ReactJSX,
        },
      },
    ).outputText;
    return output.replace(/export\s*\{\s*\};?/g, '').trim().length > 0;
  });
}
/** Enforce ≥80% lines in every executable file; missing evidence always fails. */
export function checkCoverage(
  root,
  base,
  reportPath = 'coverage/coverage-summary.json',
) {
  if (!base)
    throw new Error('Missing comparison SHA: supply --base <recorded-sha>.');
  const files = executableFiles(root, base);
  const report = JSON.parse(
    fs.readFileSync(path.resolve(root, reportPath), 'utf8'),
  );
  const failures = [];
  for (const file of files) {
    const metric = report[path.join(root, file)]?.lines;
    if (!metric || !Number.isFinite(metric.pct) || metric.pct < 80)
      failures.push(`${file}: ${metric?.pct ?? 'missing'}% lines`);
    else console.log(`${file}: ${metric.pct}% lines`);
  }
  if (failures.length) throw new Error(failures.join('\n'));
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === new URL(import.meta.url).pathname
) {
  try {
    const index = process.argv.indexOf('--base');
    checkCoverage(
      process.cwd(),
      index >= 0 ? process.argv[index + 1] : undefined,
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
