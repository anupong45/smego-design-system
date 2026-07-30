import { test, expect } from '@playwright/test';

/* ═══════════════════════════════════════════════════════════════════════════
   โหมดมืดต้องใช้ได้จริงในเบราว์เซอร์จริง
   ───────────────────────────────────────────────────────────────────────────
   ★★★ contrast sweep พิสูจน์ว่า **ค่าสีของโหมดมืดถูก** — แต่มันตั้ง
   `data-theme` เองด้วย `page.evaluate` ⇒ ไม่ได้พิสูจน์ว่า **ผู้ใช้เปิดโหมดมืด
   ได้** · จนถึง 2026-07-30 เปิดไม่ได้จริง: `theme-init.js` ไม่มี call site
   และ gallery มี toggle ของตัวเองที่เขียน `dataset.theme` ตรง ๆ โดยไม่ผ่าน
   localStorage ⇒ **ไม่ถูกจำข้ามการรีโหลด**

   เทสนี้ล็อกสิ่งที่ unit test แตะไม่ได้:
     · การจำข้ามการรีโหลด (persistence)
     · `data-theme` ถูกตั้ง **ก่อน first paint** ไม่ใช่หลัง hydrate
     · `color-scheme` ถูกตั้งด้วย เพื่อ scrollbar และ native control
   ═══════════════════════════════════════════════════════════════════════════ */

const GALLERY = 'http://127.0.0.1:4400/index.html';

/* ⚠️ input[type=radio] ของ RAC ถูกซ่อนจากตาและมี <span> คลุมอยู่ —
   คลิกที่ role=radio ตรง ๆ จะถูก span ดักไว้ ("intercepts pointer events")
   จึงคลิกที่ข้อความในกลุ่ม ซึ่งเป็นสิ่งที่ผู้ใช้จริงคลิกด้วย
   ★ scope ไปที่ radiogroup ตัวแรก — หน้านี้มี ThemeToggle 3 ตัว (หัวหน้า + specimen 2) */
const group = (page: import('@playwright/test').Page) =>
  page.getByRole('radiogroup', { name: 'ธีมการแสดงผล' }).first();

const choose = (page: import('@playwright/test').Page, label: string) =>
  group(page).getByText(label, { exact: true }).click();

test.describe('ThemeToggle · โหมดมืดจากมุมผู้ใช้', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test('★★★ กด "มืด" แล้วหน้าเปลี่ยนเป็นมืด และ **จำไว้หลังรีโหลด**', async ({
    page,
  }) => {
    await page.goto(GALLERY);
    await page.evaluate(() => localStorage.removeItem('smego-theme'));
    await page.reload();

    await choose(page, 'มืด');

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    expect(await page.evaluate(() => localStorage.getItem('smego-theme'))).toBe('dark');

    /* ★ หัวใจของเทสนี้ — toggle เดิมของ gallery ตกข้อนี้ */
    await page.reload();
    await expect(
      page.locator('html'),
      'รีโหลดแล้วกลับเป็นสว่าง = ไม่ได้เขียน localStorage หรือ script ไม่ได้อ่าน',
    ).toHaveAttribute('data-theme', 'dark');
  });

  test('★★★ data-theme ถูกตั้งก่อน first paint ไม่ใช่หลัง hydrate', async ({ page }) => {
    await page.goto(GALLERY);
    await page.evaluate(() => localStorage.setItem('smego-theme', 'dark'));

    /* บล็อก JS ของ gallery ไว้ — เหลือแค่ theme-init ที่อยู่ใน <head>
       ถ้า data-theme ยังเป็น dark แปลว่า script ใน head ทำงาน ไม่ใช่ React */
    await page.route('**/gallery.js', (r) => r.abort());
    await page.goto(GALLERY);

    await expect(
      page.locator('html'),
      'ไม่มี gallery.js แล้ว theme หาย ⇒ theme ถูกตั้งหลัง hydrate = เห็นการกระพริบ',
    ).toHaveAttribute('data-theme', 'dark');

    expect(
      await page.evaluate(() => document.documentElement.style.colorScheme),
      'color-scheme ต้องถูกตั้งด้วย ไม่งั้น scrollbar และ native control เป็นสีสว่างในหน้ามืด',
    ).toBe('dark');
  });

  test('★★ "ตามระบบ" เก็บ system ไว้ และตามค่าของ OS', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto(GALLERY);
    await page.evaluate(() => localStorage.setItem('smego-theme', 'light'));
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    await choose(page, 'ตามระบบ');

    expect(
      await page.evaluate(() => localStorage.getItem('smego-theme')),
      'ต้องเก็บ system ไม่ใช่ค่าที่ resolve แล้ว — ไม่งั้นผู้ใช้หลุดจากโหมดตามระบบ',
    ).toBe('system');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    /* OS เปลี่ยนทีหลังต้องมีผลทันที โดยไม่ต้องรีโหลด */
    await page.emulateMedia({ colorScheme: 'light' });
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });

  test('★★ ปุ่มไม่ถูกปิด — gallery inline script แล้ว', async ({ page }) => {
    await page.goto(GALLERY);
    const dark = group(page).getByRole('radio', { name: 'มืด' });
    await expect(
      dark,
      'ปุ่มปิดอยู่ ⇒ window.smegoTheme ไม่มี ⇒ index.html ไม่ได้โหลด theme-init',
    ).toBeEnabled();
  });
});
