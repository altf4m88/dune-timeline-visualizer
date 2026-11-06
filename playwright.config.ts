import { defineConfig } from '@playwright/test';

// Only this one variable is read, and the e2e type check runs without Node's types.
declare const process: { env: Record<string, string | undefined> };

/**
 * Where the tests run: by default the production build served by `vite preview`; with
 * `E2E_BASE_URL` set, an already running copy instead, such as the Docker image (whose nginx adds
 * the Content-Security-Policy and headers that `vite preview` does not) or the deployed service.
 */
const target = process.env.E2E_BASE_URL?.replace(/\/?$/, '/');

/**
 * Browser tests. WebGL runs on SwiftShader, the software renderer, so they need no GPU: slow, but
 * the same pixels on a laptop and in CI.
 */
export default defineConfig({
  testDir: 'e2e',
  // Software WebGL: one browser at a time keeps each test's frame budget predictable.
  workers: 1,
  timeout: 180_000,
  expect: { timeout: 20_000 },
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: target ?? 'http://localhost:4173/',
    colorScheme: 'dark',
    launchOptions: { args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: target
    ? undefined
    : {
        command: 'npx vite preview --port 4173 --strictPort',
        url: 'http://localhost:4173/',
        reuseExistingServer: true,
      },
});
