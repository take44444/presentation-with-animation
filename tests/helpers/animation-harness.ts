/** Deterministic latest-target driver; the authored controller consumes this seam. */
export interface Driver {
  readonly kill: () => void;
}
/** Typed playhead resources separate from serializable content. */
export interface Playhead {
  readonly time: () => number;
  readonly seek: (value: number) => void;
  readonly drive: (target: number, complete: () => void) => Driver;
}
/** Create a controllable driver for state assertions, without mocking authored logic. @returns Clock and fake playhead resource. */
export function createHarness(): {
  playhead: Playhead;
  finish: () => void;
  advance: (value: number) => void;
  live: () => number;
} {
  let time: number = 0;
  let target: number = 0;
  let completion: (() => void) | undefined;
  let live: number = 0;
  const playhead: Playhead = {
    time: (): number => time,
    seek: (value: number): void => {
      time = value;
    },
    drive: (value: number, done: () => void): Driver => {
      target = value;
      completion = done;
      live++;
      let killed: boolean = false;
      return {
        kill: (): void => {
          if (!killed) {
            live--;
            killed = true;
          }
        },
      };
    },
  };
  return {
    playhead,
    finish: (): void => {
      time = target;
      completion?.();
    },
    advance: (value: number): void => {
      time = value;
    },
    live: (): number => live,
  };
}
