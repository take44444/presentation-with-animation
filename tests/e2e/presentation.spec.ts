import { test, expect, type Locator, type Page } from '@playwright/test';
const route: string = '/how-to-create-attractive-presentation-materials';
test('title wraps at the preferred Japanese phrase boundaries', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.goto(route);
  await expect(page.locator('[data-cue]')).toHaveCSS('opacity', '1');
  await expect(page.locator('h1')).toHaveAccessibleName(
    '惹きつけるプレゼン資料の作り方',
  );
  const cases: readonly {
    selector: string;
    width: number;
    lines: readonly string[];
  }[] = [
    { selector: 'h1', width: 640, lines: ['惹きつけるプレゼン資料の作り方'] },
    {
      selector: 'h1',
      width: 480,
      lines: ['惹きつける', 'プレゼン資料の作り方'],
    },
    {
      selector: 'h1',
      width: 320,
      lines: ['惹きつける', 'プレゼン資料の', '作り方'],
    },
    {
      selector: '[data-motion="explanation"] h2',
      width: 640,
      lines: ['きれいなスライドはセンス？'],
    },
    {
      selector: '[data-motion="explanation"] h2',
      width: 400,
      lines: ['きれいなスライドは', 'センス？'],
    },
  ];
  for (let index: number = 0; index < cases.length; index++) {
    const lines: string[] = await page
      .locator(cases[index].selector)
      .evaluate((heading: HTMLElement, width: number): string[] => {
        heading.style.width = `${width}px`;
        heading.style.maxWidth = 'none';
        heading.style.fontSize = '40px';
        const walker: TreeWalker = document.createTreeWalker(
          heading,
          NodeFilter.SHOW_TEXT,
        );
        const observed: { top: number; text: string }[] = [];
        let node: Node | null = walker.nextNode();
        while (node) {
          const text: string = node.textContent ?? '';
          for (let offset: number = 0; offset < text.length; offset++) {
            const range: Range = document.createRange();
            range.setStart(node, offset);
            range.setEnd(node, offset + 1);
            const top: number = range.getBoundingClientRect().top;
            const line: { top: number; text: string } | undefined =
              observed.find(
                (entry: { top: number; text: string }): boolean =>
                  Math.abs(entry.top - top) < 1,
              );
            if (line) line.text += text[offset];
            else observed.push({ top, text: text[offset] });
          }
          node = walker.nextNode();
        }
        return observed.map(
          (line: { top: number; text: string }): string => line.text,
        );
      }, cases[index].width);
    expect(lines).toEqual(cases[index].lines);
  }
});
test('US1 exact opening, native early handoff, cue and title exit', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.goto(route);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    '惹きつけるプレゼン資料の作り方',
  );
  await expect(page.locator('[data-cue]')).toHaveCSS('opacity', '1');
  await expect(page.getByText('Scroll')).toHaveCSS(
    'writing-mode',
    'vertical-rl',
  );
  const mode: string | null = await page
    .locator('main')
    .getAttribute('data-mode');
  if (mode === 'pinned') {
    await page.evaluate((): void => window.scrollTo(0, innerHeight * 1.5));
    await expect(page.locator('[data-motion="title"]')).toHaveCSS(
      'opacity',
      '0',
    );
  } else {
    await page.getByText('2026-10-03').scrollIntoViewIfNeeded();
    await expect(page.getByText('2026-10-03')).toBeVisible();
  }
});
test('US2 teaching arrangement and shared identity survive 2 to 3', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.goto(route);
  await expect(page.locator('main')).toHaveAttribute(
    'data-mode',
    /pinned|flow/,
  );
  await expect(
    page.getByRole('heading', {
      name: 'きれいなスライドはセンス？',
      includeHidden: true,
    }),
  ).toBeAttached();
  if ((await page.locator('main').getAttribute('data-mode')) === 'pinned') {
    await page.evaluate((): void => window.scrollTo(0, innerHeight * 1.5));
    await expect(page.locator('[data-example-entrance]').first()).toHaveCSS(
      'opacity',
      '1',
    );
    await page
      .locator('[data-example]')
      .first()
      .evaluate((node: Element): void => {
        node.setAttribute('data-identity', 'same');
      });
    await page.evaluate((): void => window.scrollTo(0, innerHeight * 3));
    await expect(page.locator('[data-motion="principles"]')).toHaveCSS(
      'opacity',
      '1',
    );
    await expect(page.locator('[data-identity="same"]')).toHaveCount(1);
    await expect(page.locator('[data-examples]')).toHaveCSS('opacity', '1');
  } else {
    await page.locator('[data-scene="explanation"]').scrollIntoViewIfNeeded();
    await expect(page.locator('[data-scene="explanation"]')).toBeVisible();
    expect(
      await page.evaluate(
        (): boolean => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});
test('US3 final six cards are readable, desktop grid or reachable native flow', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.goto(route);
  await expect(page.locator('main')).toHaveAttribute(
    'data-mode',
    /pinned|flow/,
  );
  await expect(page.locator('[data-card]')).toHaveCount(6);
  if ((await page.locator('main').getAttribute('data-mode')) === 'pinned') {
    await page.evaluate((): void =>
      window.scrollTo(0, document.documentElement.scrollHeight),
    );
    await expect(page.locator('[data-card]').last()).toHaveCSS('opacity', '1');
    await expect(page.locator('[data-cue]')).toHaveCSS('opacity', '0');
    const boxes: readonly DOMRect[] = await page
      .locator('[data-card]')
      .evaluateAll((nodes: Element[]): DOMRect[] =>
        nodes.map((node: Element): DOMRect => node.getBoundingClientRect()),
      );
    expect(Math.abs(boxes[0].y - boxes[2].y)).toBeLessThan(2);
    expect(boxes[3].y).toBeGreaterThan(boxes[0].y);
    expect(boxes[5].bottom).toBeLessThanOrEqual(
      (await page.viewportSize())!.height,
    );
  } else {
    const cards: Locator[] = await page.locator('[data-card]').all();
    for (let index: number = 0; index < cards.length; index++) {
      await cards[index].scrollIntoViewIfNeeded();
      await expect(cards[index]).toBeVisible();
    }
    expect(
      await page.evaluate(
        (): boolean => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});
test('US4 all six paths, twenty round trips and latest target after rapid reversal', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  test.setTimeout(120000);
  await page.goto(route);
  await expect(page.locator('main')).toHaveAttribute(
    'data-mode',
    /pinned|flow/,
  );
  if ((await page.locator('main').getAttribute('data-mode')) === 'flow') {
    await page.locator('[data-scene="tips"]').scrollIntoViewIfNeeded();
    await page.evaluate((): void => window.scrollTo(0, 0));
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    return;
  }
  const destinations: readonly { scene: string; progress: number }[] = [
    { scene: 'title', progress: 0 },
    { scene: 'explanation', progress: 0.3 },
    { scene: 'principles', progress: 0.6 },
    { scene: 'tips', progress: 1 },
  ];
  for (let round: number = 0; round < 20; round++) {
    for (let step: number = 1; step <= 6; step++) {
      const destination: { scene: string; progress: number } =
        destinations[step <= 3 ? step : 6 - step];
      await page.evaluate(
        (progress: number): void =>
          window.scrollTo(0, progress * innerHeight * 5),
        destination.progress,
      );
      await expect(
        page.locator(`[data-motion="${destination.scene}"]`),
      ).toHaveCSS('opacity', '1');
      await expect(
        page.locator(`[data-scene="${destination.scene}"]`),
      ).toHaveAttribute('aria-hidden', 'false');
      await expect(page.locator('[data-example]')).toHaveCount(2);
      await expect(page.locator('[data-cue]')).toHaveCSS(
        'opacity',
        destination.scene === 'tips' ? '0' : '1',
      );
    }
  }
  await page.evaluate((): void => {
    window.scrollTo(0, document.documentElement.scrollHeight);
    requestAnimationFrame((): void => window.scrollTo(0, innerHeight * 3));
  });
  await expect(page.locator('[data-motion="principles"]')).toHaveCSS(
    'opacity',
    '1',
  );
  await expect(page.locator('[data-examples]')).toHaveCSS('opacity', '1');
});
test('US4 resize and runtime reduced motion preserve teaching location', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.goto(route);
  await expect(page.locator('main')).toHaveAttribute(
    'data-mode',
    /pinned|flow/,
  );
  if ((await page.locator('main').getAttribute('data-mode')) === 'pinned')
    await page.evaluate((): void => window.scrollTo(0, innerHeight * 3));
  else await page.locator('[data-scene="principles"]').scrollIntoViewIfNeeded();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('main')).toHaveAttribute('data-mode', 'flow');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('[data-card]').last()).toHaveCSS('opacity', '1');
  await expect(page.locator('[data-example]').first()).toHaveCSS(
    'transform',
    'none',
  );
  await expect(page.locator('[data-cue-bob]')).toHaveCSS('transform', 'none');
  await expect(page.locator('[data-example]')).toHaveCount(2);
});
test('real native scrolling during opening preserves the current pose and latest destination', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.goto(route);
  await page.waitForFunction((): boolean => {
    const root: HTMLElement | null = document.querySelector('main[data-mode]');
    const title: HTMLElement | null = document.querySelector(
      '[data-opening="title"]',
    );
    const attribution: HTMLElement | null = document.querySelector(
      '[data-opening="attribution"]',
    );
    return Boolean(
      root &&
      title &&
      attribution &&
      Number(getComputedStyle(title).opacity) > 0 &&
      Number(getComputedStyle(attribution).opacity) < 1,
    );
  });
  const preserved: boolean = await page.evaluate((): boolean => {
    const title: HTMLElement = document.querySelector(
      '[data-opening="title"]',
    )!;
    const before: string = getComputedStyle(title).transform;
    const root: HTMLElement = document.querySelector('main')!;
    const destination: HTMLElement = document.querySelector(
      '[data-scene="principles"]',
    )!;
    const position: number =
      root.dataset.mode === 'pinned'
        ? innerHeight * 3
        : destination.getBoundingClientRect().top +
          scrollY -
          innerHeight * 0.25;
    window.scrollTo(0, position);
    return getComputedStyle(title).transform === before;
  });
  expect(preserved).toBe(true);
  await expect(page.locator('[data-motion="principles"]')).toHaveCSS(
    'opacity',
    '1',
  );
  await expect(page.locator('[data-motion="title"]')).toHaveCSS('opacity', '0');
  await expect(page.locator('[data-example]')).toHaveCount(2);
});
