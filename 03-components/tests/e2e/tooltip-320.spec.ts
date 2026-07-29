import { test, expect } from '@playwright/test';

/* ═══════════════════════════════════════════════════════════════════════════
   Tooltip ที่ 320px — ปิดหนี้ข้อ 2.1 ใน QUALITY.md (2026-07-29)
   ───────────────────────────────────────────────────────────────────────────
   หนี้เดิมระบุวิธีปิดไว้เอง: *"เทส Playwright ที่เปิด tooltip ที่ viewport
   320px แล้วยืนยันว่า `scrollWidth` ของหน้ายังเป็น 320 (SC 1.4.10)"*

   ★ ทำไมต้องวัด ไม่ใช่เดา

   `Tooltip` มี `max-w-64` = **256px** · ที่ viewport 320px ถ้า React Aria
   วางมันชิดขอบขวาแล้วบวก offset เข้าไป กล่องอาจล้นออกนอกจอ ซึ่งทำให้เกิด
   การเลื่อนแนวนอน = **ไม่ผ่าน SC 1.4.10** (Reflow)

   หนี้เขียนไว้ว่า *"ต้องวัดก่อนว่าข้อความยาวสุดที่ยอมรับได้กว้างเท่าไร แล้ว
   จึงตัดสินใจว่าจะจำกัดความกว้างหรือจำกัดความยาวข้อความ"* — เทสนี้คือ
   การวัดนั้น และมันจะบอกเองว่าต้องแก้อะไรหรือไม่ต้องแก้เลย

   320px = จอแคบสุดที่ระบบนี้รองรับ (ข้อ 08)
   ═══════════════════════════════════════════════════════════════════════════ */

/* ★★ ใช้ **fixture** ไม่ใช่ gallery

   ลองวัดบน gallery ก่อนแล้ว guard ข้อแรกจับได้ว่า **gallery เองเลื่อน
   แนวนอนอยู่แล้วที่ 320px** (scrollWidth 549 / clientWidth 320) จาก
   specimen ที่กว้างอย่าง `Table` — ถ้าไม่มี guard นั้นผมจะรายงานว่า
   "tooltip ทำให้หน้าเลื่อน" ทั้งที่หน้าเลื่อนอยู่ก่อนแล้ว

   fixture คือหน้าที่ playwright.config เขียนไว้ว่า "หน้าเล็กที่คุมได้
   ใช้กับเคส WCAG เฉพาะจุด" — ซึ่งตรงกับงานนี้พอดี */
const PAGE = 'http://127.0.0.1:4321/index.html';

test.use({ viewport: { width: 320, height: 640 } });

test('★★ Tooltip ที่ 320px ไม่ทำให้หน้าเลื่อนแนวนอน (SC 1.4.10)', async ({ page }) => {
  await page.goto(PAGE);
  await page.addStyleTag({
    content: `*, *::before, *::after { transition: none !important; animation: none !important; }`,
  });

  /* ค่าตั้งต้นก่อนเปิด tooltip — ถ้าหน้าเลื่อนอยู่แล้วเทสนี้จะวัดผิดคน */
  const before = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(
    before.scrollWidth,
    `หน้าเลื่อนแนวนอนอยู่แล้วก่อนเปิด tooltip (${before.scrollWidth} > ${before.clientWidth}) — ปัญหาอยู่ที่อื่น ไม่ใช่ tooltip`,
  ).toBeLessThanOrEqual(before.clientWidth);

  /* เปิด tooltip ด้วยคีย์บอร์ด — โฟกัสเป็นทางที่ใช้ได้ทั้งเมาส์และ SR
     (hover-only จะทดสอบบนมือถือไม่ได้ ซึ่งเป็นเหตุที่ระบบปฏิเสธ HoverCard) */
  const target = page.getByRole('button', { name: /วงเงินสูงสุด/ }).first();
  await target.scrollIntoViewIfNeeded();
  await target.focus();

  /* RAC เปิด tooltip เมื่อโฟกัส · รอให้มันโผล่จริง */
  const tip = page.locator('[role="tooltip"]');
  await expect(tip).toBeVisible({ timeout: 3000 });

  const after = await page.evaluate(() => {
    const t = document.querySelector('[role="tooltip"]') as HTMLElement;
    const r = t.getBoundingClientRect();
    return {
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      tipWidth: Math.round(r.width),
      tipLeft: Math.round(r.left),
      tipRight: Math.round(r.right),
    };
  });

  /* ★ ผลการวัด — พิมพ์ไว้เสมอเพราะหนี้ 2.1 ขอ "ค่าที่วัดจริง" ไม่ใช่ ✅ เปล่า */
  console.log(
    `Tooltip @320px: กว้าง ${after.tipWidth}px · ซ้าย ${after.tipLeft} ขวา ${after.tipRight} ` +
      `· scrollWidth ${after.scrollWidth} / clientWidth ${after.clientWidth}`,
  );

  /* ★★ ข้อหลัก: หน้าต้องไม่เลื่อนแนวนอน */
  expect(
    after.scrollWidth,
    `เปิด tooltip แล้วหน้าเลื่อนแนวนอน (${after.scrollWidth} > ${after.clientWidth}) — ` +
      `กล่องกว้าง ${after.tipWidth}px วางที่ ${after.tipLeft}–${after.tipRight}`,
  ).toBeLessThanOrEqual(after.clientWidth);

  /* ★ และกล่องต้องอยู่ในจอทั้งใบ — ไม่ใช่แค่ "ไม่ทำให้เลื่อน" เพราะกล่องที่
     ล้นออกไปโดยถูก clip ก็อ่านไม่ได้เหมือนกัน */
  expect(after.tipLeft, 'ขอบซ้ายของ tooltip หลุดออกนอกจอ').toBeGreaterThanOrEqual(0);
  expect(after.tipRight, 'ขอบขวาของ tooltip หลุดออกนอกจอ').toBeLessThanOrEqual(
    after.clientWidth,
  );
});
