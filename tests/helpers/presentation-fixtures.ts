import type {
  SceneGeometry,
  SceneId,
  TimelineLabels,
} from '@/app/how-to-create-attractive-presentation-materials/_lib/types';
/** Finite master labels used for model/controller expectations. */
export const labels: TimelineLabels = {
  openingEnd: 2,
  holds: [2, 5, 8, 12],
  transitions: [
    [3, 5],
    [6, 8],
    [9, 12],
  ],
  examplesVisible: [4, 10],
  cueFade: [9, 10],
  final: 12,
};
/** Unequal scene lengths ensure flow mapping never assumes equal viewport slices. */
export const geometry: readonly SceneGeometry[] = [
  'title',
  'explanation',
  'principles',
  'tips',
].map((id: string, index: number): SceneGeometry => {
  const starts: readonly number[] = [0, 800, 1800, 3000];
  const ends: readonly number[] = [800, 1800, 3000, 6000];
  const start: number = starts[index];
  const end: number = ends[index];
  return {
    id: id as SceneId,
    start,
    end,
    entrance: [start, start + 100],
    reading: [start + 100, end - 100],
    exit: [end - 100, end],
  };
});
