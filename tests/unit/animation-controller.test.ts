import fs from 'node:fs';
import type { ControllerState } from '@/app/how-to-create-attractive-presentation-materials/_lib/types';
import type { Playhead } from '../helpers/animation-harness';
import { createHarness } from '../helpers/animation-harness';
import { labels } from '../helpers/presentation-fixtures';
type Playback = {
  request: (time: number, initial?: boolean) => void;
  state: () => ControllerState;
  dispose: () => void;
};
type Factory = (
  playhead: Playhead,
  options: {
    layoutMode: 'pinned' | 'flow';
    motionPreference: 'normal' | 'reduced';
    restoredTime: number;
  },
) => Playback;
const create: Factory = fs.existsSync(
  'app/how-to-create-attractive-presentation-materials/_lib/animation-controller.ts',
)
  ? jest.requireActual<{ createPlayback: Factory }>(
      '@/app/how-to-create-attractive-presentation-materials/_lib/animation-controller',
    ).createPlayback
  : (): Playback => ({
      request: (): void => {},
      state: (): ControllerState => ({
        lifecycle: 'fallback',
        currentTime: 0,
        targetTime: 0,
        targetScene: 'title',
        direction: 'stationary',
        layoutMode: 'flow',
        motionPreference: 'normal',
        openingComplete: false,
      }),
      dispose: (): void => {},
    });
test('zero-progress initialization leaves ordered opening in progress', (): void => {
  const harness: ReturnType<typeof createHarness> = createHarness();
  const player: Playback = create(harness.playhead, {
    layoutMode: 'pinned',
    motionPreference: 'normal',
    restoredTime: 0,
  });
  expect(player.state().lifecycle).toBe('opening');
  harness.advance(0.6);
  player.request(labels.openingEnd, true);
  expect(player.state().currentTime).toBe(0.6);
  expect(harness.live()).toBe(1);
});
test('early scroll replaces sole driver preserving the current pose', (): void => {
  const harness: ReturnType<typeof createHarness> = createHarness();
  const player: Playback = create(harness.playhead, {
    layoutMode: 'pinned',
    motionPreference: 'normal',
    restoredTime: 0,
  });
  harness.advance(0.6);
  player.request(5);
  expect(player.state().currentTime).toBe(0.6);
  expect(player.state().targetTime).toBe(5);
  expect(harness.live()).toBe(1);
  harness.finish();
  expect(player.state()).toMatchObject({
    currentTime: 5,
    targetScene: 'explanation',
    lifecycle: 'ready',
  });
  player.dispose();
  expect(harness.live()).toBe(0);
});
test('restored and reduced startup reconcile without opening replay', (): void => {
  const harness: ReturnType<typeof createHarness> = createHarness();
  const player: Playback = create(harness.playhead, {
    layoutMode: 'flow',
    motionPreference: 'reduced',
    restoredTime: 8,
  });
  expect(player.state()).toMatchObject({
    currentTime: 8,
    targetScene: 'principles',
    openingComplete: true,
  });
  expect(harness.live()).toBe(0);
  player.request(12);
  expect(player.state().currentTime).toBe(12);
});
test('US4 rapid reversal rejects obsolete completion and disposal is idempotent', (): void => {
  const harness: ReturnType<typeof createHarness> = createHarness();
  const callbacks: (() => void)[] = [];
  const playhead: Playhead = {
    ...harness.playhead,
    drive: (
      target: number,
      complete: () => void,
    ): ReturnType<Playhead['drive']> => {
      callbacks.push(complete);
      return harness.playhead.drive(target, complete);
    },
  };
  const player: Playback = create(playhead, {
    layoutMode: 'pinned',
    motionPreference: 'normal',
    restoredTime: 5,
  });
  player.request(12);
  harness.advance(6);
  player.request(2);
  callbacks[0]();
  expect(player.state()).toMatchObject({
    currentTime: 6,
    targetTime: 2,
    direction: 'backward',
    lifecycle: 'tracking',
  });
  expect(harness.live()).toBe(1);
  harness.finish();
  expect(player.state()).toMatchObject({
    currentTime: 2,
    targetScene: 'title',
    lifecycle: 'ready',
  });
  player.dispose();
  player.dispose();
  player.request(12);
  expect(player.state().lifecycle).toBe('disposed');
  expect(harness.live()).toBe(0);
});
