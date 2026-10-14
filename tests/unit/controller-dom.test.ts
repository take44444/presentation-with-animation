import gsap from 'gsap';
import {
  createPresentationController,
  type PresentationController,
} from '@/app/how-to-create-attractive-presentation-materials/_lib/animation-controller';
jest.mock('gsap/ScrollTrigger', (): object => ({
  ScrollTrigger: {
    create: jest.fn((): object => ({ kill: jest.fn(), update: jest.fn() })),
    refresh: jest.fn(),
  },
}));
let root: HTMLElement;
let controller: PresentationController;
beforeEach((): void => {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: jest.fn((): object => ({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    })),
  });
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    value: 1280,
  });
  Object.defineProperty(window, 'innerHeight', {
    configurable: true,
    value: 720,
  });
  root = document.createElement('main');
  root.innerHTML =
    '<div data-stage><section data-scene="title"><div data-motion="title"><h1 data-opening="title">Title</h1><p data-opening="attribution">Presenter</p></div></section><section data-scene="explanation"><div data-motion="explanation"></div></section><section data-scene="principles"><div data-motion="principles"></div></section><section data-scene="tips"><div data-motion="tips"></div></section><div data-cue><div data-cue-bob>Scroll</div></div></div>';
  document.body.append(root);
  Array.from(root.querySelectorAll<HTMLElement>('[data-scene]')).forEach(
    (scene: HTMLElement, index: number): void => {
      scene.getBoundingClientRect = (): DOMRect =>
        new DOMRect(0, index * 720, 1280, 720);
    },
  );
  controller = createPresentationController(root);
});
afterEach((): void => {
  controller.dispose();
  root.remove();
});
function master(): gsap.core.Timeline {
  const timeline: gsap.core.Animation | undefined = gsap.globalTimeline
    .getChildren(true, false, true)
    .find((entry: gsap.core.Animation): boolean => entry.duration() === 12);
  if (!(timeline instanceof gsap.core.Timeline))
    throw new Error('Missing finite master');
  return timeline;
}
test('one live driver starts the opening without an initialization reset', (): void => {
  const timeline: gsap.core.Timeline = master();
  expect(
    gsap.globalTimeline
      .getChildren(false, true, false)
      .filter(
        (tween: gsap.core.Animation): boolean =>
          tween instanceof gsap.core.Tween &&
          tween.targets().includes(timeline),
      ),
  ).toHaveLength(1);
});
test('actual title precedes attribution and cue, with two separate bob cycles', (): void => {
  const timeline: gsap.core.Timeline = master();
  timeline.time(0.6);
  expect(
    Number(
      gsap.getProperty(root.querySelector('[data-opening="title"]'), 'opacity'),
    ),
  ).toBeGreaterThan(0);
  expect(
    Number(
      gsap.getProperty(
        root.querySelector('[data-opening="attribution"]'),
        'opacity',
      ),
    ),
  ).toBe(0);
  expect(
    Number(gsap.getProperty(root.querySelector('[data-cue]'), 'opacity')),
  ).toBe(0);
  timeline.time(2);
  expect(
    Number(gsap.getProperty(root.querySelector('[data-cue]'), 'opacity')),
  ).toBe(1);
  expect(timeline.duration()).toBe(12);
});
test('scoped disposal is idempotent and static content becomes readable', (): void => {
  controller.dispose();
  controller.dispose();
  expect(root).not.toHaveAttribute('data-mode');
  expect(root.querySelector('[data-scene="explanation"]')).not.toHaveAttribute(
    'aria-hidden',
  );
});
test('missing refs leave a readable fallback', (): void => {
  controller.dispose();
  root.querySelector('[data-opening="title"]')?.remove();
  controller = createPresentationController(root);
  expect(root).not.toHaveAttribute('data-mode');
  expect(controller.state()).toBeUndefined();
});
test('reduced flow, restored state and media rebuild preserve content', (): void => {
  controller.dispose();
  Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: jest.fn((): object => ({
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    })),
  });
  controller = createPresentationController(root);
  expect(controller.state()).toMatchObject({
    layoutMode: 'flow',
    motionPreference: 'reduced',
    openingComplete: true,
  });
  expect(root.querySelector('[data-motion="tips"]')).not.toHaveAttribute(
    'aria-hidden',
  );
  let refresh: FrameRequestCallback | undefined;
  const request: jest.SpyInstance = jest
    .spyOn(window, 'requestAnimationFrame')
    .mockImplementation((callback: FrameRequestCallback): number => {
      refresh = callback;
      return 1;
    });
  window.dispatchEvent(new Event('resize'));
  refresh?.(0);
  expect(root.dataset.mode).toBe('flow');
  request.mockRestore();
});
test('US2 explanation precedes staggered examples and pair persists through principles', (): void => {
  controller.dispose();
  const group: Element | null = root.querySelector('[data-scene="principles"]');
  group?.insertAdjacentHTML(
    'afterend',
    '<div data-examples><div data-example style="--rotation:-5deg"><div data-example-entrance><div data-example-shake>First</div></div></div><div data-example style="--rotation:6deg"><div data-example-entrance><div data-example-shake>Second</div></div></div></div>',
  );
  controller = createPresentationController(root);
  const timeline: gsap.core.Timeline = master();
  timeline.time(4.2);
  expect(
    Number(
      gsap.getProperty(
        root.querySelector('[data-motion="explanation"]'),
        'opacity',
      ),
    ),
  ).toBeGreaterThan(0.9);
  expect(
    Number(
      gsap.getProperty(
        root.querySelector('[data-example-entrance]'),
        'opacity',
      ),
    ),
  ).toBe(0);
  timeline.time(5);
  expect(
    Number(
      gsap.getProperty(
        root.querySelector('[data-example-entrance]'),
        'opacity',
      ),
    ),
  ).toBe(1);
  const node: Element | null = root.querySelector('[data-example]');
  timeline.time(8);
  expect(root.querySelector('[data-example]')).toBe(node);
  expect(
    Number(gsap.getProperty(root.querySelector('[data-examples]'), 'opacity')),
  ).toBe(1);
  timeline.time(12);
  expect(
    Number(gsap.getProperty(root.querySelector('[data-examples]'), 'opacity')),
  ).toBe(0);
});
test('US3 cards cascade separately from scene travel, final cue pauses', (): void => {
  controller.dispose();
  root
    .querySelector('[data-motion="tips"]')
    ?.insertAdjacentHTML(
      'beforeend',
      '<ol>' +
        Array.from(
          { length: 6 },
          (_: unknown, index: number): string =>
            `<li data-card="tip-${index + 1}">Tip</li>`,
        ).join('') +
        '</ol>',
    );
  controller = createPresentationController(root);
  const timeline: gsap.core.Timeline = master();
  timeline.time(10.5);
  const cards: HTMLElement[] = Array.from(root.querySelectorAll('[data-card]'));
  expect(Number(gsap.getProperty(cards[0], 'opacity'))).toBeGreaterThan(0);
  expect(Number(gsap.getProperty(cards[5], 'opacity'))).toBe(0);
  timeline.time(12);
  expect(
    cards.every(
      (card: HTMLElement): boolean =>
        Number(gsap.getProperty(card, 'opacity')) === 1,
    ),
  ).toBe(true);
  expect(
    Number(gsap.getProperty(root.querySelector('[data-cue]'), 'opacity')),
  ).toBe(0);
});
test('US4 all reverse exits fade and travel downward using the same bounded master', (): void => {
  const timeline: gsap.core.Timeline = master();
  const holds: readonly number[] = [5, 8, 12];
  const backwards: readonly number[] = [3.85, 7.05, 10.3];
  for (let index: number = 0; index < 3; index++) {
    const node: HTMLElement | null = root.querySelector(
      `[data-motion="${['explanation', 'principles', 'tips'][index]}"]`,
    );
    timeline.time(holds[index]);
    expect(Number(gsap.getProperty(node, 'y'))).toBe(0);
    timeline.time(backwards[index]);
    expect(Number(gsap.getProperty(node, 'y'))).toBeGreaterThan(0);
    expect(Number(gsap.getProperty(node, 'opacity'))).toBeLessThan(1);
  }
});
test('partial setup failure releases only owned resources and restores readable content', (): void => {
  controller.dispose();
  const before: number = gsap.globalTimeline
    .getChildren(true, false, true)
    .filter(
      (entry: gsap.core.Animation): boolean => entry.duration() === 12,
    ).length;
  const plugin: typeof import('gsap/ScrollTrigger') =
    jest.requireMock('gsap/ScrollTrigger');
  jest
    .mocked(plugin.ScrollTrigger.create)
    .mockImplementationOnce((): import('gsap/ScrollTrigger').ScrollTrigger => {
      throw new Error('Trigger setup failed');
    });
  controller = createPresentationController(root);
  expect(root).not.toHaveAttribute('data-mode');
  expect(
    gsap.globalTimeline
      .getChildren(true, false, true)
      .filter((entry: gsap.core.Animation): boolean => entry.duration() === 12),
  ).toHaveLength(before);
  expect(
    root.querySelector('[data-opening="title"]')?.getAttribute('style') ?? '',
  ).toBe('');
});
test('non-finite flow geometry leaves every section readable without enhancement', (): void => {
  controller.dispose();
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    value: 390,
  });
  root.querySelector<HTMLElement>(
    '[data-scene="explanation"]',
  )!.getBoundingClientRect = (): DOMRect => new DOMRect(0, NaN, 390, 844);
  controller = createPresentationController(root);
  expect(root).not.toHaveAttribute('data-mode');
  expect(controller.state()).toBeUndefined();
  expect(
    root.querySelector('[data-motion="tips"]')?.getAttribute('style') ?? '',
  ).toBe('');
});
test('initial trigger setup with a tiny residual progress cannot supersede the opening driver', (): void => {
  controller.dispose();
  const plugin: typeof import('gsap/ScrollTrigger') =
    jest.requireMock('gsap/ScrollTrigger');
  jest
    .mocked(plugin.ScrollTrigger.create)
    .mockImplementationOnce(
      (
        options?: Parameters<typeof plugin.ScrollTrigger.create>[0],
      ): import('gsap/ScrollTrigger').ScrollTrigger => {
        if (typeof options === 'object')
          options.onUpdate?.({
            progress: 0.0001,
          } as import('gsap/ScrollTrigger').ScrollTrigger);
        return {
          kill: jest.fn(),
          update: jest.fn(),
        } as unknown as import('gsap/ScrollTrigger').ScrollTrigger;
      },
    );
  controller = createPresentationController(root);
  expect(controller.state()?.targetTime).toBe(2);
  const timeline: gsap.core.Timeline = master();
  const driver: gsap.core.Animation | undefined = gsap.globalTimeline
    .getChildren(false, true, false)
    .find(
      (tween: gsap.core.Animation): boolean =>
        tween instanceof gsap.core.Tween && tween.targets().includes(timeline),
    );
  expect(driver?.duration()).toBe(2);
});
test('reload restores viewport metadata from the native history entry when the engine resets scroll', (): void => {
  controller.dispose();
  history.replaceState(
    {
      preserved: 'router',
      attractivePresentationViewport: {
        route: '/how-to-create-attractive-presentation-materials',
        position: 2160,
      },
    },
    '',
    '/how-to-create-attractive-presentation-materials',
  );
  const entries: jest.SpyInstance | undefined =
    typeof performance.getEntriesByType === 'function'
      ? jest.spyOn(performance, 'getEntriesByType')
      : undefined;
  Object.defineProperty(performance, 'getEntriesByType', {
    configurable: true,
    value: jest.fn((): PerformanceEntry[] => [
      {
        entryType: 'navigation',
        type: 'reload',
      } as unknown as PerformanceNavigationTiming,
    ]),
  });
  const scroll: jest.SpyInstance = jest
    .spyOn(window, 'scrollTo')
    .mockImplementation((): void => {});
  controller = createPresentationController(root);
  expect(controller.state()?.currentTime).toBe(8);
  expect(history.state.preserved).toBe('router');
  expect(controller.state()?.lifecycle).toBe('ready');
  Object.defineProperty(window, 'scrollY', { configurable: true, value: 2160 });
  window.dispatchEvent(new Event('pagehide'));
  expect(history.state.attractivePresentationViewport).toMatchObject({
    position: 2160,
  });
  Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
  let scheduled: FrameRequestCallback | undefined;
  const raf: jest.SpyInstance = jest
    .spyOn(window, 'requestAnimationFrame')
    .mockImplementation((callback: FrameRequestCallback): number => {
      scheduled = callback;
      return 1;
    });
  const show: Event = new Event('pageshow');
  Object.defineProperty(show, 'persisted', { value: true });
  window.dispatchEvent(show);
  scheduled?.(0);
  expect(controller.state()?.currentTime).toBe(8);
  raf.mockRestore();
  scroll.mockRestore();
  entries?.mockRestore();
  Object.defineProperty(performance, 'getEntriesByType', {
    configurable: true,
    value: undefined,
  });
  history.replaceState(null, '', '/');
});
