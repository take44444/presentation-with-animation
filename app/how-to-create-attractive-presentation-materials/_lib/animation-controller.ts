import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  captureAnchor,
  restoreAnchor,
  flowTime,
  pinnedTime,
  sceneAt,
  validGeometry,
  pinnedGeometry,
} from './scroll-model';
import type {
  ControllerState,
  LayoutMode,
  MotionPreference,
  SceneGeometry,
  SceneId,
  TimelineLabels,
  ViewportAnchor,
} from './types';
/** Finite time labels shared by native geometry and rendered states. */
export const timelineLabels: TimelineLabels = {
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
/** Killable playhead driver resource. */
export interface Driver {
  readonly kill: () => void;
}
/** Typed animation seam; no content or React state lives in these handles. */
export interface Playhead {
  readonly time: () => number;
  readonly seek: (value: number) => void;
  readonly drive: (target: number, complete: () => void) => Driver;
}
/** Observable latest-target playback with idempotent scoped disposal. */
export interface Playback {
  readonly request: (time: number, initial?: boolean) => void;
  readonly state: () => ControllerState;
  readonly dispose: () => void;
}
/** Playback initialization, including restored nonzero position. */
export interface PlaybackOptions {
  readonly layoutMode: LayoutMode;
  readonly motionPreference: MotionPreference;
  readonly restoredTime: number;
}
/** Create one latest-target driver without resetting its current pose. @param playhead Animation resource. @param options Native layout/preference/restoration. @returns Scoped playback state and disposal. */
export function createPlayback(
  playhead: Playhead,
  options: PlaybackOptions,
): Playback {
  let driver: Driver | undefined;
  let generation: number = 0;
  let disposed: boolean = false;
  let target: number =
    options.restoredTime > 0 ? options.restoredTime : timelineLabels.openingEnd;
  let lifecycle: ControllerState['lifecycle'] = 'ready';
  let direction: ControllerState['direction'] = 'stationary';
  let openingComplete: boolean =
    options.restoredTime > 0 || options.motionPreference === 'reduced';
  const request: (time: number, initial?: boolean) => void = (
    time: number,
    initial: boolean = false,
  ): void => {
    if (
      disposed ||
      (initial && !openingComplete && time === timelineLabels.openingEnd)
    )
      return;
    const current: number = playhead.time();
    target = Math.max(
      timelineLabels.openingEnd,
      Math.min(
        timelineLabels.final,
        Number.isFinite(time) ? time : timelineLabels.openingEnd,
      ),
    );
    direction =
      target > current
        ? 'forward'
        : target < current
          ? 'backward'
          : 'stationary';
    driver?.kill();
    driver = undefined;
    generation++;
    const token: number = generation;
    if (options.motionPreference === 'reduced') {
      playhead.seek(target);
      lifecycle = 'ready';
      openingComplete = true;
      return;
    }
    lifecycle = openingComplete ? 'tracking' : 'opening';
    driver = playhead.drive(target, (): void => {
      if (disposed || token !== generation) return;
      driver?.kill();
      driver = undefined;
      openingComplete = true;
      lifecycle = 'ready';
    });
  };
  if (openingComplete) playhead.seek(target);
  else request(target);
  return {
    request,
    state: (): ControllerState => ({
      lifecycle: disposed ? 'disposed' : lifecycle,
      currentTime: playhead.time(),
      targetTime: target,
      targetScene: sceneAt(target, timelineLabels),
      direction,
      layoutMode: options.layoutMode,
      motionPreference: options.motionPreference,
      openingComplete,
    }),
    dispose: (): void => {
      if (disposed) return;
      disposed = true;
      generation++;
      driver?.kill();
      driver = undefined;
    },
  };
}
/** Root-scoped DOM lifecycle; dispose restores the static native-flow deck. */
export interface PresentationController {
  readonly dispose: () => void;
  readonly state: () => ControllerState | undefined;
}
/** Enhance semantic scenes using one finite master and standalone ScrollTrigger. @param root Mounted presentation landmark. @returns Owned resources; failures retain readable static flow. */
export function createPresentationController(
  root: HTMLElement,
): PresentationController {
  gsap.registerPlugin(ScrollTrigger);
  const stage: HTMLElement | null = root.querySelector('[data-stage]');
  const scenes: HTMLElement[] = Array.from(
    root.querySelectorAll<HTMLElement>('[data-scene]'),
  );
  const motions: HTMLElement[] = Array.from(
    root.querySelectorAll<HTMLElement>('[data-motion]'),
  );
  const title: HTMLElement | null = root.querySelector(
    '[data-opening="title"]',
  );
  const attribution: HTMLElement | null = root.querySelector(
    '[data-opening="attribution"]',
  );
  const cue: HTMLElement | null = root.querySelector('[data-cue]');
  const bob: HTMLElement | null = root.querySelector('[data-cue-bob]');
  let context: gsap.Context | undefined;
  let playback: Playback | undefined;
  let trigger: ScrollTrigger | undefined;
  let disposed: boolean = false;
  let frame: number = 0;
  let geometry: readonly SceneGeometry[] = [];
  let mode: LayoutMode = 'flow';
  let reduced: boolean = false;
  let openingSeen: boolean = false;
  const route: string = '/how-to-create-attractive-presentation-materials';
  const navigation: PerformanceEntry | undefined =
    typeof performance.getEntriesByType === 'function'
      ? performance.getEntriesByType('navigation')[0]
      : undefined;
  let navigationRestore: boolean = Boolean(
    navigation &&
    'type' in navigation &&
    (navigation.type === 'reload' || navigation.type === 'back_forward'),
  );
  const savedPosition: () => number | undefined = (): number | undefined => {
    const entry: unknown = history.state;
    if (
      typeof entry !== 'object' ||
      entry === null ||
      !('attractivePresentationViewport' in entry)
    )
      return undefined;
    const viewport: unknown = entry.attractivePresentationViewport;
    if (
      typeof viewport !== 'object' ||
      viewport === null ||
      !('route' in viewport) ||
      viewport.route !== route ||
      !('position' in viewport)
    )
      return undefined;
    return typeof viewport.position === 'number' &&
      Number.isFinite(viewport.position) &&
      viewport.position >= 0
      ? viewport.position
      : undefined;
  };
  const rememberPosition: () => void = (): void => {
    if (location.pathname !== route) return;
    const current: unknown = history.state;
    const entry: Record<string, unknown> =
      typeof current === 'object' && current !== null ? { ...current } : {};
    history.replaceState(
      {
        ...entry,
        attractivePresentationViewport: { route, position: window.scrollY },
      },
      '',
    );
  };
  const preference: MediaQueryList = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  );
  const cleanup: () => void = (): void => {
    playback?.dispose();
    trigger?.kill();
    trigger = undefined;
    context?.revert();
    context = undefined;
    scenes.forEach((scene: HTMLElement): void => {
      scene.removeAttribute('aria-hidden');
      scene.inert = false;
    });
    delete root.dataset.mode;
  };
  const measure: () => readonly SceneGeometry[] =
    (): readonly SceneGeometry[] =>
      scenes.map((scene: HTMLElement, index: number): SceneGeometry => {
        const start: number =
          index === 0
            ? 0
            : Math.max(
                0,
                scene.getBoundingClientRect().top +
                  window.scrollY -
                  innerHeight * 0.5,
              );
        const end: number =
          index < 3
            ? Math.max(
                start + 1,
                scenes[index + 1].getBoundingClientRect().top +
                  window.scrollY -
                  innerHeight * 0.5,
              )
            : Math.max(
                start + 1,
                document.documentElement.scrollHeight - innerHeight,
              );
        const margin: number = Math.min(
          innerHeight * 0.18,
          (end - start) * 0.2,
        );
        return {
          id: scene.dataset.scene as SceneId,
          start,
          end,
          entrance: [start, start + margin],
          reading: [start + margin, end - margin],
          exit: [end - margin, end],
        };
      });
  const rebuild: (anchor?: ViewportAnchor) => void = (
    anchor?: ViewportAnchor,
  ): void => {
    const nativePosition: number =
      window.scrollY || (navigationRestore ? (savedPosition() ?? 0) : 0);
    navigationRestore = false;
    cleanup();
    if (
      disposed ||
      !stage ||
      !title ||
      !attribution ||
      !cue ||
      !bob ||
      scenes.length !== 4 ||
      motions.length !== 4
    )
      return;
    reduced = preference.matches;
    mode =
      !reduced && innerWidth >= 1024 && innerHeight >= 640 ? 'pinned' : 'flow';
    root.dataset.mode = mode;
    if (
      mode === 'pinned' &&
      motions.some(
        (node: HTMLElement): boolean => node.scrollHeight > innerHeight * 0.84,
      )
    ) {
      mode = 'flow';
      root.dataset.mode = mode;
    }
    geometry =
      mode === 'pinned'
        ? pinnedGeometry(innerHeight * 5, timelineLabels)
        : measure();
    if (mode === 'flow' && !validGeometry(geometry)) {
      delete root.dataset.mode;
      return;
    }
    context = gsap.context((): void => {}, root);
    let setupFailed: boolean = false;
    context.add((owned: gsap.Context): void => {
      try {
        const master: gsap.core.Timeline = gsap.timeline({ paused: true });
        const examples: HTMLElement | null =
          root.querySelector('[data-examples]');
        const entrances: HTMLElement[] = Array.from(
          root.querySelectorAll<HTMLElement>('[data-example-entrance]'),
        );
        const shakes: HTMLElement[] = Array.from(
          root.querySelectorAll<HTMLElement>('[data-example-shake]'),
        );
        const shakeLoop: gsap.core.Timeline = gsap
          .timeline({ paused: true, repeat: -1 })
          .to(shakes.length ? shakes : {}, {
            rotation: 2.0,
            duration: 0.3,
            ease: 'sine.inOut',
          })
          .to(shakes.length ? shakes : {}, {
            rotation: -2.0,
            duration: 0.3,
            ease: 'sine.inOut',
          })
          .to(shakes.length ? shakes : {}, {
            rotation: 0,
            duration: 0.3,
            ease: 'sine.inOut',
          });
        if (!reduced && examples) {
          gsap.set(entrances, { autoAlpha: 0, rotation: -3, y: 20 });
          master
            .to(
              entrances,
              {
                autoAlpha: 1,
                rotation: 0,
                y: 0,
                duration: 0.45,
                stagger: 0.12,
                ease: 'power1.inOut',
              },
              4.3,
            )
            .to(
              examples,
              { autoAlpha: 0, y: -44, duration: 0.7, ease: 'power1.inOut' },
              9.3,
            );
        }

        const cueLoop: gsap.core.Timeline = gsap
          .timeline({ paused: true, repeat: -1 })
          .to(bob, { y: 5, duration: 0.3, ease: 'sine.inOut' })
          .to(bob, { y: 0, duration: 0.3, ease: 'sine.inOut' })
          .to(bob, { y: 5, duration: 0.3, ease: 'sine.inOut' })
          .to(bob, { y: 0, duration: 0.3, ease: 'sine.inOut' })
          .to({}, { duration: 0.9 });
        if (!reduced) {
          gsap.set(motions.slice(1), { autoAlpha: 0, y: 44 });
          gsap.set([title, attribution], { autoAlpha: 0, y: 28 });
          gsap.set(cue, { autoAlpha: 0 });
          master
            .to(
              title,
              { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power1.inOut' },
              0,
            )
            .to(
              attribution,
              { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power1.inOut' },
              0.8,
            )
            .to(cue, { autoAlpha: 1, duration: 0.5, ease: 'power1.inOut' }, 1.5)
            .to(
              motions[0],
              { autoAlpha: 0, y: -44, duration: 0.65, ease: 'power1.inOut' },
              3,
            )
            .to(
              motions[1],
              { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power1.inOut' },
              3.5,
            )
            .to(
              motions[1],
              { autoAlpha: 0, y: -44, duration: 0.65, ease: 'power1.inOut' },
              6,
            )
            .to(
              motions[2],
              { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power1.inOut' },
              6.7,
            )
            .to(
              motions[2],
              { autoAlpha: 0, y: -44, duration: 0.65, ease: 'power1.inOut' },
              9,
            )
            .to(cue, { autoAlpha: 0, duration: 0.7, ease: 'power1.inOut' }, 9.3)
            .to(
              motions[3],
              { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power1.inOut' },
              10,
            );
        }
        const cards: HTMLElement[] = Array.from(
          root.querySelectorAll<HTMLElement>('[data-card]'),
        );
        if (!reduced && cards.length) {
          gsap.set(cards, { autoAlpha: 0, scale: 0.94 });
          master.to(
            cards,
            {
              autoAlpha: 1,
              scale: 1,
              duration: 0.85,
              stagger: 0.14,
              ease: 'elastic.out(1,0.6)',
            },
            10.3,
          );
        }
        master.to({}, { duration: 0.1 }, 11.9);
        const sync: () => void = (): void => {
          const visible: boolean =
            !reduced && Number(gsap.getProperty(cue, 'opacity')) > 0.05;
          if (
            !reduced &&
            examples &&
            Number(gsap.getProperty(examples, 'opacity')) > 0.05 &&
            Number(gsap.getProperty(entrances[0], 'opacity')) > 0.95
          )
            shakeLoop.play();
          else shakeLoop.pause(0);
          if (visible) cueLoop.play();
          else cueLoop.pause(0);
          if (mode === 'pinned')
            scenes.forEach((scene: HTMLElement, index: number): void => {
              const hidden: boolean =
                Number(gsap.getProperty(motions[index], 'opacity')) <= 0.05;
              scene.inert = hidden;
              scene.setAttribute('aria-hidden', String(hidden));
            });
        };
        master.eventCallback('onUpdate', sync);
        const playhead: Playhead = {
          time: (): number => master.time(),
          seek: (value: number): void => {
            master.time(value);
            sync();
          },
          drive: (target: number, complete: () => void): Driver => {
            let tween: gsap.core.Tween | undefined;
            owned.add((): void => {
              tween = master.tweenTo(target, {
                duration: master.time() === 0 && target === 2 ? 2 : 0.25,
                ease: 'power1.inOut',
                onComplete: complete,
              });
            });
            return {
              kill: (): void => {
                tween?.kill();
              },
            };
          },
        };
        const targetAt: (position: number) => number = (
          position: number,
        ): number =>
          mode === 'pinned'
            ? pinnedTime(position / (innerHeight * 5), timelineLabels)
            : (flowTime(position, geometry, timelineLabels) ?? 2);
        const restoredPosition: number = anchor
          ? restoreAnchor(anchor, geometry)
          : nativePosition;
        playback = createPlayback(playhead, {
          layoutMode: mode,
          motionPreference: reduced ? 'reduced' : 'normal',
          restoredTime:
            restoredPosition > 0 || openingSeen
              ? targetAt(restoredPosition)
              : 0,
        });
        openingSeen = true;
        let initialized: boolean = false;
        trigger = ScrollTrigger.create({
          trigger: stage,
          start: 'top top',
          end:
            mode === 'pinned'
              ? (): string => `+=${innerHeight * 5}`
              : (): number =>
                  Math.max(
                    1,
                    document.documentElement.scrollHeight - innerHeight,
                  ),
          pin: mode === 'pinned' ? stage : false,
          invalidateOnRefresh: true,
          onUpdate: (self: ScrollTrigger): void => {
            const refreshing: boolean =
              'isRefreshing' in ScrollTrigger &&
              ScrollTrigger.isRefreshing === true;
            if (!initialized || refreshing) return;
            if (reduced) {
              gsap.set(cue, {
                autoAlpha: window.scrollY < geometry[3].start ? 1 : 0,
              });
              return;
            }
            playback?.request(
              mode === 'pinned'
                ? pinnedTime(self.progress, timelineLabels)
                : targetAt(window.scrollY),
              window.scrollY === 0,
            );
          },
        });
        initialized = true;
        if (restoredPosition > 0) {
          window.scrollTo(0, restoredPosition);
          trigger.update();
        }
        sync();
      } catch {
        setupFailed = true;
      }
    });
    if (setupFailed) cleanup();
  };
  const onResize: () => void = (): void => {
    if (disposed || frame) return;
    const anchor: ViewportAnchor = captureAnchor(window.scrollY, geometry);
    frame = requestAnimationFrame((): void => {
      frame = 0;
      rebuild(window.scrollY === 0 ? undefined : anchor);
      ScrollTrigger.refresh();
    });
  };
  try {
    rebuild();
  } catch {
    cleanup();
  }
  const onPageShow: (event: PageTransitionEvent) => void = (
    event: PageTransitionEvent,
  ): void => {
    if (event.persisted) {
      navigationRestore = true;
      onResize();
    }
  };
  window.addEventListener('pagehide', rememberPosition);
  window.addEventListener('pageshow', onPageShow);
  window.addEventListener('resize', onResize);
  preference.addEventListener('change', onResize);
  return {
    state: (): ControllerState | undefined => playback?.state(),
    dispose: (): void => {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener('pagehide', rememberPosition);
      window.removeEventListener('pageshow', onPageShow);
      window.removeEventListener('resize', onResize);
      preference.removeEventListener('change', onResize);
      cleanup();
    },
  };
}
