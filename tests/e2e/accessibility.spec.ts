import {
  test,
  expect,
  type Page,
  type Browser,
  type BrowserContext,
  type Locator,
} from '@playwright/test';
const route: string = '/how-to-create-attractive-presentation-materials';
test('JavaScript-disabled flow and unstyled local examples remain readable', async ({
  browser,
}: {
  browser: Browser;
}): Promise<void> => {
  const context: BrowserContext = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page: Page = await context.newPage();
  await page.goto(route);
  await expect(page.getByRole('main')).toHaveAttribute('lang', 'ja');
  await expect(page.getByRole('img')).toHaveCount(2);
  await expect(page.getByRole('listitem')).toHaveCount(6);
  await page
    .getByText('その他のTips', { exact: true })
    .scrollIntoViewIfNeeded();
  await expect(page.getByText('その他のTips', { exact: true })).toBeVisible();
  await context.close();
});
test('reduced motion keeps all cards reachable and keyboard native scrolling works', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(route);
  await expect(page.locator('main')).toHaveAttribute('data-mode', 'flow');
  await expect(page.locator('[data-cue-bob]')).toHaveCSS('transform', 'none');
  await expect(page.locator('[data-example]').first()).toHaveCSS(
    'transform',
    'none',
  );
  await page.keyboard.press('PageDown');
  await expect
    .poll(async (): Promise<number> => page.evaluate((): number => scrollY))
    .toBeGreaterThan(0);
  const cards: Locator[] = await page.locator('[data-card]').all();
  for (let index: number = 0; index < cards.length; index++) {
    await cards[index].scrollIntoViewIfNeeded();
    await expect(cards[index]).toHaveCSS('opacity', '1');
    await expect(cards[index]).toHaveCSS('transform', 'none');
  }
  await expect(page.locator('[data-cue]')).toHaveCSS('opacity', '0');
});
test('inactive pinned scenes are inert, cue avoids text and enlarged copy chooses flow', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.goto(route);
  await expect(page.locator('main')).toHaveAttribute(
    'data-mode',
    /pinned|flow/,
  );
  await expect(page.locator('[data-cue]')).toHaveCSS('opacity', '1');
  if ((await page.locator('main').getAttribute('data-mode')) === 'pinned') {
    await expect(page.locator('[data-scene="tips"]')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(
      await page
        .locator('[data-scene="tips"]')
        .evaluate((node: HTMLElement): boolean => node.inert),
    ).toBe(true);
  }
  await page.addStyleTag({
    content:
      '[data-presentation] h1,[data-presentation] h2,[data-presentation] p {font-size:80px !important;}',
  });
  await page.setViewportSize({ width: 1024, height: 640 });
  await expect(page.locator('main')).toHaveAttribute('data-mode', 'flow');
  expect(
    await page.evaluate(
      (): boolean => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
