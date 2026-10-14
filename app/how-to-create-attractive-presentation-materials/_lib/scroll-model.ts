import type {
  SceneGeometry,
  SceneId,
  TimelineLabels,
  ViewportAnchor,
} from './types';
const ids: readonly SceneId[] = ['title', 'explanation', 'principles', 'tips'];
/** Clamp normalized input, treating non-finite external input as the start. @param value Progress. @returns Finite 0–1 value. */
export function clamp(value: number): number {
  return Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
}
/** Map pinned native progress into the finite master after opening. @param progress Native progress. @param labels Master labels. @returns Target time. */
export function pinnedTime(progress: number, labels: TimelineLabels): number {
  return (
    labels.openingEnd + clamp(progress) * (labels.final - labels.openingEnd)
  );
}
/** Check finite ordered section intervals before enhancement. @param geometry Measured sections. @returns Whether mapping is safe. */
export function validGeometry(geometry: readonly SceneGeometry[]): boolean {
  return (
    geometry.length > 0 &&
    geometry.every((scene: SceneGeometry, index: number): boolean => {
      const values: readonly number[] = [
        scene.start,
        ...scene.entrance,
        ...scene.reading,
        ...scene.exit,
        scene.end,
      ];
      return (
        values.every(
          (value: number, i: number): boolean =>
            Number.isFinite(value) && (i === 0 || value >= values[i - 1]),
        ) &&
        scene.end > scene.start &&
        (index === 0 || scene.start >= geometry[index - 1].end)
      );
    })
  );
}
/** Map unequal measured flow sections with fully revealed reading holds. @param position Native scroll. @param geometry Measured ranges. @param labels Master labels. @returns Target time or null for readable fallback. */
export function flowTime(
  position: number,
  geometry: readonly SceneGeometry[],
  labels: TimelineLabels,
): number | null {
  if (!validGeometry(geometry) || !Number.isFinite(position)) return null;
  if (position <= geometry[0].start) return labels.openingEnd;
  const index: number = geometry.findIndex(
    (scene: SceneGeometry): boolean => position <= scene.end,
  );
  if (index < 0) return labels.final;
  const scene: SceneGeometry = geometry[index];
  const hold: number = labels.holds[ids.indexOf(scene.id)];
  const previous: number = labels.holds[Math.max(0, index - 1)];
  const next: number = labels.holds[Math.min(3, index + 1)];
  if (position < scene.reading[0])
    return (
      (previous + hold) / 2 +
      (clamp(
        (position - scene.entrance[0]) /
          (scene.entrance[1] - scene.entrance[0]),
      ) *
        (hold - previous)) /
        2
    );
  if (position <= scene.reading[1] || index === geometry.length - 1)
    return hold;
  return (
    hold +
    (clamp((position - scene.exit[0]) / (scene.exit[1] - scene.exit[0])) *
      (next - hold)) /
      2
  );
}
/** Capture local reading position for a rebuild. @param position Native scroll. @param geometry Valid section measurements. @returns Stable scene/fraction anchor. */
export function captureAnchor(
  position: number,
  geometry: readonly SceneGeometry[],
): ViewportAnchor {
  const scene: SceneGeometry | undefined =
    geometry.find((entry: SceneGeometry): boolean => position <= entry.end) ??
    geometry.at(-1);
  return scene
    ? {
        scene: scene.id,
        fraction: clamp(
          (position - scene.reading[0]) / (scene.reading[1] - scene.reading[0]),
        ),
      }
    : { scene: 'title', fraction: 0 };
}
/** Resolve an anchor after layout change. @param anchor Captured reading location. @param geometry New sections. @returns Native target scroll. */
export function restoreAnchor(
  anchor: ViewportAnchor,
  geometry: readonly SceneGeometry[],
): number {
  const scene: SceneGeometry | undefined = geometry.find(
    (entry: SceneGeometry): boolean => entry.id === anchor.scene,
  );
  return scene
    ? scene.reading[0] +
        clamp(anchor.fraction) * (scene.reading[1] - scene.reading[0])
    : 0;
}
/** Derive the active semantic scene from rendered master time. @param time Current time. @param labels Master labels. @returns Current scene. */
export function sceneAt(time: number, labels: TimelineLabels): SceneId {
  const index: number = labels.transitions.findIndex(
    (range: readonly [number, number]): boolean =>
      time < (range[0] + range[1]) / 2,
  );
  return ids[index < 0 ? 3 : index];
}
/** Determine loop eligibility from current visibility, never newest target. @param time Rendered master time. @param labels Master labels. @param reduced Suppress decorations. @returns Child-loop eligibility. */
export function decoration(
  time: number,
  labels: TimelineLabels,
  reduced: boolean,
): { cue: boolean; examples: boolean } {
  return {
    cue: !reduced && time >= labels.openingEnd && time < labels.cueFade[1],
    examples:
      !reduced &&
      time >= labels.examplesVisible[0] &&
      time < labels.examplesVisible[1],
  };
}
/** Derive pinned reading intervals from finite labels and measured scroll span. @param span Pin range in native pixels. @param labels Ordered master labels. @returns Geometry preserving scene/local reading fraction across mode changes. */
export function pinnedGeometry(
  span: number,
  labels: TimelineLabels,
): readonly SceneGeometry[] {
  if (!Number.isFinite(span) || span <= 0) return [];
  const position: (time: number) => number = (time: number): number =>
    ((time - labels.openingEnd) / (labels.final - labels.openingEnd)) * span;
  return ids.map((id: SceneId, index: number): SceneGeometry => {
    const previous: readonly [number, number] | undefined =
      labels.transitions[index - 1];
    const next: readonly [number, number] | undefined =
      labels.transitions[index];
    const start: number = previous
      ? position((previous[0] + previous[1]) / 2)
      : 0;
    const end: number = next ? position((next[0] + next[1]) / 2) : span;
    const hold: number = position(labels.holds[index]);
    const readingEnd: number = next ? position(next[0]) : span;
    return {
      id,
      start,
      end,
      entrance: [start, hold],
      reading: [hold, readingEnd],
      exit: [readingEnd, end],
    };
  });
}
