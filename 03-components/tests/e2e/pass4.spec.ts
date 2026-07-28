import { test, expect } from '@playwright/test';

/* ═══════════════════════════════════════════════════════════════════════════
   Pass 4 · สัญญา 136px ของ EntityCard
   ───────────────────────────────────────────────────────────────────────────
   `EntityCard.md` ประกาศว่าทุกการ์ดต้องอ่านออกที่ **136px** ซึ่งเป็น
   ความกว้างที่แคบที่สุดจริงของการ์ดในกริดที่ 320px

   `GrantCard.md §3` อ้าง "ยืนยันจากการวัดที่ 136px" ไว้แล้วแต่ยังไม่เคยมี
   เทสที่บังคับจริง — ไฟล์นี้ทำให้สัญญานั้นมีฟันสำหรับการ์ดใหม่ 2 ใบ
   ═══════════════════════════════════════════════════════════════════════════ */

const NARROW = ['narrow-funding', 'narrow-business'] as const;

for (const id of NARROW) {
  test.describe(`${id} · ที่ 136px`, () => {
    test('ไม่มีข้อความใดล้นกล่องแนวนอน', async ({ page }) => {
      await page.goto('/index.html');

      const overflowing = await page.evaluate((testid) => {
        const root = document.querySelector(`[data-testid="${testid}"]`)!;
        const bad: { tag: string; text: string; scrollW: number; clientW: number }[] = [];
        for (const el of root.querySelectorAll<HTMLElement>('*')) {
          /* ข้ามกล่องที่ตั้งใจให้เลื่อนเอง */
          if (getComputedStyle(el).overflowX === 'auto') continue;
          if (el.scrollWidth > el.clientWidth + 1) {
            bad.push({
              tag: el.tagName,
              text: (el.textContent ?? '').trim().slice(0, 40),
              scrollW: el.scrollWidth,
              clientW: el.clientWidth,
            });
          }
        }
        return bad;
      }, id);

      expect(overflowing, JSON.stringify(overflowing, null, 2)).toEqual([]);
    });

    test('★ ชื่อของทุกคู่ใน <dl> อยู่ครบ ไม่ถูกตัด', async ({ page }) => {
      await page.goto('/index.html');

      const clipped = await page.evaluate((testid) => {
        const root = document.querySelector(`[data-testid="${testid}"]`)!;
        return [...root.querySelectorAll<HTMLElement>('dt')]
          .filter((dt) => dt.scrollWidth > dt.clientWidth + 1)
          .map((dt) => dt.textContent);
      }, id);

      expect(clipped).toEqual([]);
    });
  });
}

test('★★ FundingCard: "วงเงินกู้สูงสุด" อยู่ครบที่ 136px พร้อมเลข 7 หลัก', async ({ page }) => {
  await page.goto('/index.html');

  const result = await page.evaluate(() => {
    const root = document.querySelector('[data-testid="narrow-funding"]')!;
    const label = [...root.querySelectorAll<HTMLElement>('span')].find(
      (s) => s.textContent === 'วงเงินกู้สูงสุด',
    );
    const amount = [...root.querySelectorAll<HTMLElement>('span')].find(
      (s) => s.textContent === '1,250,000',
    );
    return {
      labelFound: Boolean(label),
      labelClipped: label ? label.scrollWidth > label.clientWidth + 1 : null,
      amountFound: Boolean(amount),
      /* label ต้องอยู่**เหนือ**ตัวเลข ไม่ใช่ข้างหลัง — ที่ 136px
         ท้ายบรรทัดถูกตัดก่อน (GrantCard.md §9) */
      labelAboveAmount:
        label && amount
          ? label.getBoundingClientRect().bottom <= amount.getBoundingClientRect().top + 1
          : null,
    };
  });

  expect(result.labelFound).toBe(true);
  expect(result.labelClipped).toBe(false);
  expect(result.amountFound).toBe(true);
  expect(result.labelAboveAmount).toBe(true);
});

test('★★ BusinessCard: ไม่มีจำนวนเงินโผล่ที่ 136px', async ({ page }) => {
  await page.goto('/index.html');

  const text = await page.evaluate(
    () => document.querySelector('[data-testid="narrow-business"]')!.textContent ?? '',
  );

  /* ธุรกิจไม่มีราคา — ถ้าคำว่า "บาท" โผล่ แปลว่ามีคนต่อ amount เข้ามา */
  expect(text).not.toContain('บาท');
});

/* ─────────────────────────────────────────────────────────────────────────────
   ★★★ หนี้ที่ปิดแล้ว — `EntityAmount` ที่กล่องแคบ

   เดิม `1,250,000` ที่ `text-title` (24px) กว้าง **109.47px** ส่วนกล่องในของ
   การ์ดที่ 136px เหลือ **102px** → ล้น 7.47px · เทสนี้เคยเป็น `test.fail()`

   แก้ด้วย container query ที่ `EntityAmount` — ตัวเลขลดเป็น `text-subtitle`
   เมื่อ **กล่อง** แคบกว่า 7rem (ไม่ใช่เมื่อจอแคบ เพราะเคสนี้เกิดที่ xl ด้วย)
   ───────────────────────────────────────────────────────────────────────────── */
test('★★ EntityAmount: ตัวเลข 7 หลักอยู่ในกล่องที่ 136px', async ({ page }) => {
  await page.goto('/index.html');

  const measured = await page.evaluate(() => {
    const root = document.querySelector('[data-testid="narrow-funding"]')!;
    const amount = [...root.querySelectorAll<HTMLElement>('span')].find(
      (s) => s.textContent === '1,250,000',
    )!;
    return {
      amountWidth: amount.getBoundingClientRect().width,
      availableWidth: (amount.parentElement as HTMLElement).clientWidth,
    };
  });

  expect(measured.amountWidth).toBeLessThanOrEqual(measured.availableWidth);
});

test('การ์ดใหม่ไม่ทำให้หน้าเลื่อนแนวนอนที่ 320px (SC 1.4.10)', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto('/index.html');

  const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollW).toBeLessThanOrEqual(320);
});
