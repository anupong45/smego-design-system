import { test, expect, type Page } from '@playwright/test';

/* ═══════════════════════════════════════════════════════════════════════════
   Pass 3 · การวัดจากการ render จริง
   ───────────────────────────────────────────────────────────────────────────
   ขั้นที่ `tsc` · lint · axe จับไม่ได้ (STYLE-GUIDELINE §7)

     1 · utility ทุกตัว generate จริงหรือไม่ — ชื่อ token ผิดจะเงียบสนิท
     2 · ความสูงจริงตรงกับที่เขียนในเอกสารหรือไม่ (รวมขอบ)
     3 · contrast จาก computed style **ทั้งสองโหมด**
     4 · ★ โหมดมืด `sunken` = `canvas` — รางต้องไม่หายไป
   ═══════════════════════════════════════════════════════════════════════════ */

function relLuminance(rgb: number[]) {
  const f = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(rgb[0]!) + 0.7152 * f(rgb[1]!) + 0.0722 * f(rgb[2]!);
}

function contrast(a: number[], b: number[]) {
  const x = relLuminance(a);
  const y = relLuminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

function parseRgb(value: string): number[] {
  const m = value.match(/\d+(\.\d+)?/g);
  if (!m) throw new Error(`อ่านสีไม่ได้: ${value}`);
  return [Number(m[0]), Number(m[1]), Number(m[2])];
}

async function setTheme(page: Page, theme: 'light' | 'dark') {
  await page.evaluate((t) => {
    document.documentElement.setAttribute('data-theme', t);
  }, theme);
}

async function progressColors(page: Page) {
  return page.evaluate(() => {
    const block = document.querySelector('[data-testid="progress-block"]')!;
    const track = block.querySelector('div > div:nth-child(2)') as HTMLElement;
    const fill = block.querySelector('[aria-hidden="true"]') as HTMLElement;
    const tCs = getComputedStyle(track);
    const fCs = getComputedStyle(fill);
    return {
      trackBg: tCs.backgroundColor,
      trackBorder: tCs.borderTopColor,
      trackBorderWidth: tCs.borderTopWidth,
      trackHeight: track.getBoundingClientRect().height,
      fillBg: fCs.backgroundColor,
      fillWidth: fill.getBoundingClientRect().width,
      fillHeight: fill.getBoundingClientRect().height,
      pageBg: getComputedStyle(document.body).backgroundColor,
    };
  });
}

test.describe('ProgressBar · การวัดจริง', () => {
  test('utility ทุกตัว generate จริง — ไม่มี transparent ที่ไม่ได้ตั้งใจ', async ({ page }) => {
    await page.goto('/index.html');
    const c = await progressColors(page);

    /* ชื่อ token ผิด → Tailwind ไม่สร้าง class → สีเป็น transparent เงียบ ๆ */
    expect(c.trackBg).not.toBe('rgba(0, 0, 0, 0)');
    expect(c.fillBg).not.toBe('rgba(0, 0, 0, 0)');
    expect(c.trackBorder).not.toBe('rgba(0, 0, 0, 0)');
    expect(c.trackBorderWidth).toBe('1px');
  });

  test('ความสูงจริง = 12px สำหรับ size md — ขอบกินเข้าใน ไม่บวกออก', async ({ page }) => {
    await page.goto('/index.html');
    const c = await progressColors(page);

    /* 📌 ค้นพบจากการวัด ไม่ใช่การออกแบบ
       Tailwind v4 ตั้ง `box-sizing: border-box` เป็นค่าเริ่มต้น ขอบ 1px
       จึงกินเข้าไป**ใน** h-3 ไม่ได้บวกออก — ต่างจากกรณี Button ที่เอกสาร
       เคยผิด +2px เพราะสูงจาก padding ซึ่งขอบบวกออกจริง

       ผลคือ: กล่องรวม 12px · พื้นที่แถบจริงเหลือ 10px */
    expect(c.trackHeight).toBe(12);
    expect(c.fillHeight).toBe(10);
  });

  test('★ contrast แถบเทียบราง ≥ 3:1 ทั้งสองโหมด (SC 1.4.11)', async ({ page }) => {
    await page.goto('/index.html');

    for (const theme of ['light', 'dark'] as const) {
      await setTheme(page, theme);
      const c = await progressColors(page);
      const ratio = contrast(parseRgb(c.fillBg), parseRgb(c.trackBg));
      expect(ratio, `แถบเทียบราง โหมด ${theme} ได้ ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(3);
    }
  });

  test('★★ โหมดมืด: ราง = canvas เป๊ะ — ขอบคือสิ่งเดียวที่ทำให้รางยังเห็นได้', async ({ page }) => {
    await page.goto('/index.html');
    await setTheme(page, 'dark');
    const c = await progressColors(page);

    /* ยืนยันข้อเท็จจริงที่ STYLE-GUIDELINE §5.4 บันทึกไว้ —
       ถ้าวันหนึ่ง token เปลี่ยนจนไม่จริงแล้ว เทสนี้จะเตือน */
    const trackVsPage = contrast(parseRgb(c.trackBg), parseRgb(c.pageBg));
    expect(trackVsPage).toBeLessThan(1.1);

    /* ...ดังนั้นขอบต้องรับน้ำหนักแทน และต้องผ่าน 3:1 เทียบพื้นหน้า */
    const borderVsPage = contrast(parseRgb(c.trackBorder), parseRgb(c.pageBg));
    expect(
      borderVsPage,
      `ขอบรางเทียบพื้นหน้าในโหมดมืดได้ ${borderVsPage.toFixed(2)}:1`,
    ).toBeGreaterThanOrEqual(3);
  });

  test('ความกว้างแถบตรงกับสัดส่วนจริง 78%', async ({ page }) => {
    await page.goto('/index.html');
    const c = await progressColors(page);
    const track = await page.evaluate(() => {
      const block = document.querySelector('[data-testid="progress-block"]')!;
      const t = block.querySelector('div > div:nth-child(2)') as HTMLElement;
      return t.clientWidth;
    });
    expect(Math.round((c.fillWidth / track) * 100)).toBe(78);
  });

  test('ไม่ทำให้เกิด horizontal scroll ที่ 320px (SC 1.4.10)', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto('/index.html');
    const overflow = await page.evaluate(() => {
      const el = document.querySelector('[data-testid="progress-block"]') as HTMLElement;
      return { scrollW: el.scrollWidth, clientW: el.clientWidth };
    });
    expect(overflow.scrollW).toBeLessThanOrEqual(overflow.clientW);
  });
});

test.describe('DescriptionList · การวัดจริง', () => {
  test('layout="inline" เป็น 2 คอลัมน์ที่ 1280px', async ({ page }) => {
    await page.goto('/index.html');
    const cols = await page.evaluate(() => {
      const dl = document.querySelector('[data-testid="desclist-block"] dl') as HTMLElement;
      return getComputedStyle(dl).gridTemplateColumns.split(' ').length;
    });
    expect(cols).toBe(2);
  });

  test('★ ยุบเป็นคอลัมน์เดียวที่ 320px — เลข 13 หลักไม่ถูกบีบ', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto('/index.html');

    const result = await page.evaluate(() => {
      const block = document.querySelector('[data-testid="desclist-block"]') as HTMLElement;
      const dl = block.querySelector('dl') as HTMLElement;
      const dd = block.querySelector('dd') as HTMLElement;
      return {
        cols: getComputedStyle(dl).gridTemplateColumns.split(' ').length,
        ddScrollW: dd.scrollWidth,
        ddClientW: dd.clientWidth,
        blockScrollW: block.scrollWidth,
        blockClientW: block.clientWidth,
      };
    });

    expect(result.cols).toBe(1);
    /* เลข 13 หลักต้องอยู่ครบในบรรทัดเดียว ไม่ถูกตัด */
    expect(result.ddScrollW).toBeLessThanOrEqual(result.ddClientW);
    expect(result.blockScrollW).toBeLessThanOrEqual(result.blockClientW);
  });

  test('ตัวเลขได้ font-numeric จริงหลัง render', async ({ page }) => {
    await page.goto('/index.html');
    const fonts = await page.evaluate(() => {
      const dds = [
        ...document.querySelectorAll('[data-testid="desclist-block"] dd'),
      ] as HTMLElement[];
      return dds.map((d) => getComputedStyle(d).fontVariantNumeric);
    });
    /* ค่าแรกเป็นตัวเลขทะเบียน — ต้องต่างจากค่าที่สอง */
    expect(fonts[0]).not.toBe(fonts[1]);
  });
});
