import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const check = (source, rule) => {
  const path = `eslint/rules/${rule}.mjs`;
  if (!fs.existsSync(path)) return [];
  const script = `import {Linter} from 'eslint'; import parser from '@typescript-eslint/parser'; import rule from './${path}'; const l=new Linter(); console.log(JSON.stringify(l.verify(${JSON.stringify(source)}, [{files:['**/*.ts'],languageOptions:{parser},plugins:{local:{rules:{tested:rule}}},rules:{'local/tested':'error'}}],{filename:'fixture.ts'})));`;
  return JSON.parse(
    execFileSync('node', ['--input-type=module', '-e', script], {
      encoding: 'utf8',
    }),
  );
};

describe('explicit annotation enforcement', () => {
  test.each([
    'const answer = 42;',
    'let value;',
    'const {x} = {x:1};',
    'const values: number[] = []; values.map((value) => value);',
    'function f(value) { return value; }',
    'class C { field = 1; }',
    'const x: any = 1;',
    'type Bad = any;',
  ])('rejects %s', (source) =>
    expect(check(source, 'explicit-types').length).toBeGreaterThan(0),
  );
  test('accepts explicitly typed declarations and callbacks', () =>
    expect(
      check(
        'const answer: number = 42; const fn: (x: number) => number = (x: number): number => x;',
        'explicit-types',
      ),
    ).toEqual([]));
});
describe('public documentation enforcement', () => {
  test.each([
    'export function f(x: number): number { return x; }',
    'export interface I { readonly value: number; }',
    'export class C {}',
    'export const f: () => void = (): void => {};',
  ])('rejects undocumented %s', (source) =>
    expect(check(source, 'public-docs').length).toBeGreaterThan(0),
  );
  test('accepts a documented public function', () =>
    expect(
      check(
        '/** Returns the input. @param x Input. @returns Input. */ export function f(x: number): number { return x; }',
        'public-docs',
      ),
    ).toEqual([]));
});
