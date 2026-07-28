import { defineConfig } from '@playwright/test';

/* fixture ถูก build ด้วย esbuild + tailwind ก่อนรัน — ดู `npm run test:e2e` */
export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://127.0.0.1:4321',
    /* ขนาดจอเริ่มต้น — เคส SC 2.4.11 ทดสอบซ้ำที่ 320px ในตัวเทสเอง */
    viewport: { width: 1280, height: 720 },
  },
  webServer: {
    command: 'npx http-server tests/e2e/fixture -p 4321 -s',
    url: 'http://127.0.0.1:4321/index.html',
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
