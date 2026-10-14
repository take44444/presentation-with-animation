import { defineConfig, type PlaywrightTestConfig } from '@playwright/test';
type BrowserName = 'chromium' | 'firefox' | 'webkit';
const browsers: readonly BrowserName[] = ['chromium', 'firefox', 'webkit'];
const viewports: readonly { name: string; width: number; height: number }[] = [
  { name: 'desktop', width: 1280, height: 720 },
  { name: 'large', width: 1920, height: 1080 },
  { name: 'mobile', width: 390, height: 844 },
];
/** Production matrix with build first, isolated server ownership and failure artifacts. */
const config: PlaywrightTestConfig = defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: browsers.flatMap(
    (browserName: BrowserName): NonNullable<PlaywrightTestConfig['projects']> =>
      viewports.map(
        (
          viewport: (typeof viewports)[number],
        ): NonNullable<PlaywrightTestConfig['projects']>[number] => ({
          name: `${browserName}-${viewport.name}`,
          use: {
            browserName,
            viewport: { width: viewport.width, height: viewport.height },
          },
        }),
      ),
  ),
  webServer: {
    command:
      'npm run build && npm run start -- --hostname 127.0.0.1 --port 3000',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: false,
    timeout: 180000,
  },
});
export default config;
