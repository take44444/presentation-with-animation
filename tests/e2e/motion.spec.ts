import { writeFileSync } from 'node:fs';
import { test, expect, type Page } from '@playwright/test';
/** Browser-only frame observations, injected by tests rather than application globals. */
interface Sample {
  readonly time: number;
  readonly title: number;
  readonly attribution: number;
  readonly cue: number;
  readonly y: number;
}
type ObservedWindow = Window & { motionSamples?: Sample[] };
test.use({ video: 'on', trace: 'on' });
test('opening frame sequence and continuity with production GSAP', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.addInitScript((): void => {
    const samples: Sample[] = [];
    (window as ObservedWindow).motionSamples = samples;
    let start: number = 0;
    const frame: (time: number) => void = (time: number): void => {
      const root: HTMLElement | null =
        document.querySelector('main[data-mode]');
      const title: HTMLElement | null = document.querySelector(
        '[data-opening="title"]',
      );
      const attribution: HTMLElement | null = document.querySelector(
        '[data-opening="attribution"]',
      );
      const cue: HTMLElement | null = document.querySelector('[data-cue]');
      if (root && title && attribution && cue) {
        if (!start) start = time;
        const transform: string = getComputedStyle(title).transform;
        samples.push({
          time: time - start,
          title: Number(getComputedStyle(title).opacity),
          attribution: Number(getComputedStyle(attribution).opacity),
          cue: Number(getComputedStyle(cue).opacity),
          y: transform === 'none' ? 0 : new DOMMatrix(transform).m42,
        });
      }
      if (!start || time - start < 3500) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  });
  await page.goto('/how-to-create-attractive-presentation-materials');
  await expect
    .poll(
      async (): Promise<number> =>
        page.evaluate(
          (): number =>
            (window as ObservedWindow).motionSamples?.at(-1)?.time ?? 0,
        ),
      { timeout: 10000 },
    )
    .toBeGreaterThan(3500);
  const samples: Sample[] = await page.evaluate(
    (): Sample[] => (window as ObservedWindow).motionSamples ?? [],
  );
  const first: (key: 'title' | 'attribution' | 'cue') => number = (
    key: 'title' | 'attribution' | 'cue',
  ): number =>
    samples.find((sample: Sample): boolean => sample[key] > 0.02)?.time ??
    Infinity;
  expect(first('title')).toBeLessThan(first('attribution'));
  expect(first('attribution')).toBeLessThan(first('cue'));
  const intervals: number[] = samples
    .slice(1)
    .map(
      (sample: Sample, index: number): number =>
        sample.time - samples[index].time,
    );
  const observed: number = samples.at(-1)!.time;
  const stalls: number = intervals
    .filter((duration: number): boolean => duration > 100)
    .reduce((total: number, duration: number): number => total + duration, 0);
  const smooth: number = 1 - stalls / observed;
  await test.info().attach('motion-frames.json', {
    body: JSON.stringify(
      {
        samples,
        firstTitle: first('title'),
        firstAttribution: first('attribution'),
        firstCue: first('cue'),
        observed,
        stalls,
        smooth,
      },
      null,
      2,
    ),
    contentType: 'application/json',
  });
  expect(smooth).toBeGreaterThanOrEqual(0.95);
  await page.screenshot({ path: test.info().outputPath('opening.png') });
});
/** Rendered outgoing motion and shared parent visibility during native transitions. */
interface TransitionFrame {
  readonly time: number;
  readonly y: number;
  readonly opacity: number;
  readonly pair: number;
}
test('six rendered transitions and decoration retain continuous poses', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.goto('/how-to-create-attractive-presentation-materials');
  await expect(page.locator('[data-cue]')).toHaveCSS('opacity', '1');
  if ((await page.locator('main').getAttribute('data-mode')) !== 'pinned') {
    await page.locator('[data-scene="tips"]').scrollIntoViewIfNeeded();
    await page.screenshot({ path: test.info().outputPath('flow-tips.png') });
    return;
  }
  const scenes: readonly string[] = [
    'title',
    'explanation',
    'principles',
    'tips',
  ];
  const progress: readonly number[] = [0, 0.3, 0.6, 1];
  const records: { from: string; to: string; frames: TransitionFrame[] }[] = [];
  for (let step: number = 1; step <= 6; step++) {
    const from: number = step <= 3 ? step - 1 : 7 - step;
    const to: number = step <= 3 ? step : 6 - step;
    const frames: TransitionFrame[] = await page.evaluate(
      ({
        scene,
        target,
      }: {
        scene: string;
        target: number;
      }): Promise<TransitionFrame[]> =>
        new Promise((resolve: (value: TransitionFrame[]) => void): void => {
          const node: HTMLElement | null = document.querySelector(
            `[data-motion="${scene}"]`,
          );
          const pair: HTMLElement | null =
            document.querySelector('[data-examples]');
          const values: TransitionFrame[] = [];
          const start: number = performance.now();
          const sample: (time: number) => void = (time: number): void => {
            if (node) {
              const style: CSSStyleDeclaration = getComputedStyle(node);
              values.push({
                time: time - start,
                y:
                  style.transform === 'none'
                    ? 0
                    : new DOMMatrix(style.transform).m42,
                opacity: Number(style.opacity),
                pair: pair ? Number(getComputedStyle(pair).opacity) : 0,
              });
            }
            if (time - start < 450) requestAnimationFrame(sample);
            else resolve(values);
          };
          requestAnimationFrame(sample);
          window.scrollTo(0, target * innerHeight * 5);
        }),
      { scene: scenes[from], target: progress[to] },
    );
    records.push({ from: scenes[from], to: scenes[to], frames });
    await expect(page.locator(`[data-motion="${scenes[to]}"]`)).toHaveCSS(
      'opacity',
      '1',
    );
    expect(
      frames.some(
        (frame: TransitionFrame): boolean =>
          frame.opacity < 0.98 && (step <= 3 ? frame.y < 0 : frame.y > 0),
      ),
    ).toBe(true);
    if ((from === 1 && to === 2) || (from === 2 && to === 1))
      expect(
        frames.every((frame: TransitionFrame): boolean => frame.pair === 1),
      ).toBe(true);
    await page.screenshot({
      path: test.info().outputPath(`scene-${step}.png`),
    });
  }
  const output: string = test.info().outputPath('transition-frames.json');
  writeFileSync(output, JSON.stringify(records, null, 2));
  await test.info().attach('transition-frames.json', {
    path: output,
    contentType: 'application/json',
  });
});
