import { test, expect, type Page } from '@playwright/test';
test('browser executes DOM assertions', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.setContent('<main>Ready</main>');
  await expect(page.getByRole('main')).toHaveText('Ready');
});
