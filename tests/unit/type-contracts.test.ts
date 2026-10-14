/** @jest-environment node */
import ts from 'typescript';
import fs from 'node:fs';
import path from 'node:path';
const contractPath: string = path.resolve(
  'app/how-to-create-attractive-presentation-materials/_lib/types.ts',
);
const unconstrained: string =
  'export type SceneId = string; export type LayoutMode = string; export type MotionPreference = string; export type ScrollDirection = string; export type Presentation = {title: string; slides: unknown[]; examples: unknown[]}; export type Slide = {id: string; kind: string; order: number; phrases?: string[]; cards?: unknown[]};';
function diagnostics(fixture: string): readonly string[] {
  const virtual: string = path.resolve('contract-fixture.ts');
  const host: ts.CompilerHost = ts.createCompilerHost({});
  const read: (file: string) => string | undefined = host.readFile.bind(host);
  host.readFile = (file: string): string | undefined =>
    file === virtual
      ? (fs.existsSync(contractPath)
          ? fs.readFileSync(contractPath, 'utf8')
          : unconstrained) + fixture
      : file === contractPath
        ? fs.existsSync(file)
          ? read(file)
          : unconstrained
        : read(file);
  host.fileExists = (
    (original: (file: string) => boolean): ((file: string) => boolean) =>
    (file: string): boolean =>
      file === virtual || file === contractPath || original(file)
  )(host.fileExists.bind(host));
  const program: ts.Program = ts.createProgram(
    [virtual],
    {
      strict: true,
      noEmit: true,
      skipLibCheck: true,
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      types: [],
    },
    host,
  );
  return ts
    .getPreEmitDiagnostics(program)
    .map((diagnostic: ts.Diagnostic): string =>
      ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
    );
}
const imports: string = ''; // Contract is loaded into the same in-memory consumer module.
test.each([
  "const x: SceneId = 'other';",
  "const x: LayoutMode = 'grid';",
  "const x: MotionPreference = 'fast';",
  "const x: ScrollDirection = 'up';",
  "declare const p: Presentation; p.title = '惹きつけるプレゼン資料の作り方';",
  'declare const p: Presentation; p.slides.push(p.slides[0]);',
  "const x: Slide = {id:'title',kind:'tips',order:1};",
  "const x: Slide = {id:'principles',kind:'principles',order:3,phrases:['a','b']};",
  'declare const p: Presentation; const slides: Presentation["slides"] = [p.slides[0]];',
  'declare const p: Presentation; const examples: Presentation["examples"] = [p.examples[0]];',
  "const x: Slide = {id:'tips',kind:'tips',order:4,heading:'その他のTips',cards:[]};",
])('rejects invalid contract: %s', (fixture: string): void => {
  expect(diagnostics(imports + fixture).length).toBeGreaterThan(0);
});
test('valid consumers compile', (): void => {
  expect(
    diagnostics(
      imports +
        "const id: SceneId='title'; const layout: LayoutMode='flow'; const motion: MotionPreference='reduced'; const direction: ScrollDirection='backward'; const scene: Slide={id:'title',kind:'title',order:1};",
    ),
  ).toEqual([]);
});
