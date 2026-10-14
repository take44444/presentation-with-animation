import { test, expect, type Page } from '@playwright/test';
test('restored nonzero position survives reload and route history without title reset', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.goto('/how-to-create-attractive-presentation-materials');
  await expect(page.locator('main')).toHaveAttribute(
    'data-mode',
    /pinned|flow/,
  );
  const pinned: boolean =
    (await page.locator('main').getAttribute('data-mode')) === 'pinned';
  if (pinned) {
    await page.evaluate((): void => window.scrollTo(0, innerHeight * 3));
    await expect(page.locator('[data-motion="principles"]')).toHaveCSS(
      'opacity',
      '1',
    );
  } else
    await page.locator('[data-scene="principles"]').scrollIntoViewIfNeeded();
  await page.reload();
  await expect(page.locator('main')).toHaveAttribute(
    'data-mode',
    pinned ? 'pinned' : 'flow',
  );
  await expect
    .poll(async (): Promise<number> => page.evaluate((): number => scrollY))
    .toBeGreaterThan(0);
  if (pinned)
    await expect(page.locator('[data-motion="principles"]')).toHaveCSS(
      'opacity',
      '1',
    );
  await page.goto('/');
  await page.goBack();
  await expect(page.locator('main')).toHaveAttribute(
    'data-mode',
    pinned ? 'pinned' : 'flow',
  );
  await expect
    .poll(async (): Promise<number> => page.evaluate((): number => scrollY))
    .toBeGreaterThan(0);
  if (pinned)
    await expect(page.locator('[data-motion="principles"]')).toHaveCSS(
      'opacity',
      '1',
    );
});
