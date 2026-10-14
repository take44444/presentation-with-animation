import fs from 'node:fs';
import type {
  SceneGeometry,
  TimelineLabels,
  ViewportAnchor,
} from '@/app/how-to-create-attractive-presentation-materials/_lib/types';
import { geometry, labels } from '../helpers/presentation-fixtures';
type Model = {
  clamp: (value: number) => number;
  pinnedTime: (progress: number, labels: TimelineLabels) => number;
  validGeometry: (geometry: readonly SceneGeometry[]) => boolean;
  flowTime: (
    position: number,
    geometry: readonly SceneGeometry[],
    labels: TimelineLabels,
  ) => number | null;
  captureAnchor: (
    position: number,
    geometry: readonly SceneGeometry[],
  ) => ViewportAnchor;
  restoreAnchor: (
    anchor: ViewportAnchor,
    geometry: readonly SceneGeometry[],
  ) => number;
  sceneAt: (time: number, labels: TimelineLabels) => string;
  decoration: (
    time: number,
    labels: TimelineLabels,
    reduced: boolean,
  ) => { cue: boolean; examples: boolean };
};
const baseline: Model = {
  clamp: (): number => 0,
  pinnedTime: (): number => 0,
  validGeometry: (): boolean => true,
  flowTime: (): number => 0,
  captureAnchor: (): ViewportAnchor => ({ scene: 'title', fraction: 0 }),
  restoreAnchor: (): number => 0,
  sceneAt: (): string => 'title',
  decoration: (): { cue: boolean; examples: boolean } => ({
    cue: false,
    examples: false,
  }),
};
const model: Model = fs.existsSync(
  'app/how-to-create-attractive-presentation-materials/_lib/scroll-model.ts',
)
  ? (jest.requireActual(
      '@/app/how-to-create-attractive-presentation-materials/_lib/scroll-model',
    ) as Model)
  : baseline;
test('pinned time normalizes and clamps overshoot', (): void => {
  expect(model.pinnedTime(0.5, labels)).toBe(7);
  expect(model.pinnedTime(-1, labels)).toBe(2);
  expect(model.pinnedTime(2, labels)).toBe(12);
  expect(model.pinnedTime(NaN, labels)).toBe(2);
});
test('flow holds complete long text and final tips using measured geometry', (): void => {
  expect(model.flowTime(1300, geometry, labels)).toBe(5);
  expect(model.flowTime(5500, geometry, labels)).toBe(12);
  expect(model.flowTime(9000, geometry, labels)).toBe(12);
  expect(model.flowTime(-10, geometry, labels)).toBe(2);
  expect(model.flowTime(850, geometry, labels)).toBeGreaterThan(2);
  expect(model.flowTime(850, geometry, labels)).toBeLessThan(5);
});
test('invalid geometry requests readable fallback', (): void => {
  const bad: readonly SceneGeometry[] = [{ ...geometry[0], end: NaN }];
  expect(model.validGeometry(bad)).toBe(false);
  expect(model.flowTime(500, bad, labels)).toBeNull();
  expect(model.validGeometry([])).toBe(false);
});
test('anchors preserve scene and local reading fraction across resize', (): void => {
  const anchor: ViewportAnchor = model.captureAnchor(1300, geometry);
  expect(anchor).toEqual({ scene: 'explanation', fraction: 0.5 });
  expect(model.restoreAnchor(anchor, geometry)).toBe(1300);
  expect(model.restoreAnchor({ scene: 'tips', fraction: 2 }, geometry)).toBe(
    5900,
  );
});
test('visibility and scene derive from current time including reverse restoration', (): void => {
  expect(model.sceneAt(8, labels)).toBe('principles');
  expect(model.decoration(8, labels, false)).toEqual({
    cue: true,
    examples: true,
  });
  expect(model.decoration(12, labels, false)).toEqual({
    cue: false,
    examples: false,
  });
  expect(model.decoration(8, labels, true)).toEqual({
    cue: false,
    examples: false,
  });
});
test('pinned resize captures the actual fraction of the current reading hold', (): void => {
  const actual: {
    pinnedGeometry?: (
      span: number,
      labels: TimelineLabels,
    ) => readonly SceneGeometry[];
  } = jest.requireActual(
    '@/app/how-to-create-attractive-presentation-materials/_lib/scroll-model',
  );
  const ranges: readonly SceneGeometry[] =
    actual.pinnedGeometry?.(4000, labels) ?? [];
  expect(model.captureAnchor(1400, ranges)).toEqual({
    scene: 'explanation',
    fraction: 0.5,
  });
  expect(
    model.restoreAnchor({ scene: 'principles', fraction: 0.5 }, ranges),
  ).toBe(2600);
});
