import { defineConfig } from '@playwright/test';

/* fixture ถูก build ด้วย esbuild + tailwind ก่อนรัน — ดู `npm run test:e2e` */
export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://127.0.0.1:4321',
    /* ขนาดจอเริ่มต้น — เคส SC 2.4.11 ทดสอบซ้ำที่ 320px ในตัวเทสเอง */
    viewport: { width: 1280, height: 720 },
  },
  /* สองเซิร์ฟเวอร์:
       4321 fixture — หน้าเล็กที่คุมได้ ใช้กับเคส WCAG เฉพาะจุด
       4400 gallery — หน้าที่มี **ทุก component** ใช้กับ contrast sweep
                      (ดู tests/e2e/contrast-sweep.spec.ts ว่าทำไมต้องเป็นหน้านี้) */
  webServer: [
    {
      command: 'npx http-server tests/e2e/fixture -p 4321 -s',
      url: 'http://127.0.0.1:4321/index.html',
      reuseExistingServer: true,
      timeout: 60_000,
    },
    {
      command: 'npx http-server gallery -p 4400 -s -c-1',
      url: 'http://127.0.0.1:4400/index.html',
      reuseExistingServer: true,
      timeout: 60_000,
    },
  ],
});
