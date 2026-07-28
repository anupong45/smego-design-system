import { test, expect, type Page } from '@playwright/test';

/* ═══════════════════════════════════════════════════════════════════════════
   Alert · การวัดจาก render จริง
   ───────────────────────────────────────────────────────────────────────────
   สิ่งที่ `tsc` · lint · axe จับไม่ได้เลย

     1 · ★ utility ของ tint **generate จริง** หรือเป็น class ที่ไม่มี CSS
         (บทเรียนตรงจาก `bg-primary-50` ที่ได้ 1.04:1 ในโหมดมืดเพราะ ramp
          ไม่ถูก override — เงียบสนิททั้ง tsc และ axe)
     2 · contrast จาก computed style **ทั้งสองโหมด** ทั้ง 4 tone
     3 · เป้าของปุ่มปิดวัดได้ ≥ 24×24 จริง (SC 2.5.8)
     4 · ปุ่มใน action ซ้อนแนวตั้งที่ 320px ไม่ล้น (ข้อ 08 §7 · SC 1.4.10)
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

/** อ่านสีจริงของ Alert ทั้ง 4 ใบตามลำดับ info · success · warning · danger */
async function alertColors(page: Page) {
  return page.evaluate(() => {
    const block = document.querySelector('[data-testid="alert-block"]')!;
    return [...block.children].map((box) => {
      const cs = getComputedStyle(box as HTMLElement);
      const icon = box.querySelector('svg') as SVGElement;
      const title = box.querySelector('p') as HTMLElement;
      return {
        bg: cs.backgroundColor,
        border: cs.borderTopColor,
        borderWidth: cs.borderTopWidth,
        iconColor: getComputedStyle(icon).color,
        titleColor: getComputedStyle(title).color,
        pageBg: getComputedStyle(document.body).backgroundColor,
      };
    });
  });
}

const TONES = ['info', 'success', 'warning', 'danger'] as const;

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('Alert · utility generate จริงไหม', () => {
  test('★★ พื้น tint ของทั้ง 4 tone ไม่ใช่ transparent — class มี CSS จริง', async ({ page }) => {
    for (const theme of ['light', 'dark'] as const) {
      await setTheme(page, theme);
      const rows = await alertColors(page);
      expect(rows).toHaveLength(4);
      rows.forEach((r, i) => {
        expect(r.bg, `${TONES[i]} · ${theme}`).not.toBe('rgba(0, 0, 0, 0)');
        expect(r.borderWidth, `${TONES[i]} · ${theme}`).toBe('1px');
      });
    }
  });

  test('★★ พื้นของ 4 tone ต่างกันจริงทั้งสองโหมด — ไม่ยุบเป็นสีเดียว', async ({ page }) => {
    for (const theme of ['light', 'dark'] as const) {
      await setTheme(page, theme);
      const rows = await alertColors(page);
      expect(new Set(rows.map((r) => r.bg)).size, `พื้น · ${theme}`).toBe(4);
      expect(new Set(rows.map((r) => r.iconColor)).size, `ไอคอน · ${theme}`).toBe(4);
    }
  });
});

test.describe('Alert · contrast จาก computed style', () => {
  test('★★ ข้อความและไอคอนผ่าน AA ทุก tone ทั้งสองโหมด', async ({ page }) => {
    for (const theme of ['light', 'dark'] as const) {
      await setTheme(page, theme);
      const rows = await alertColors(page);
      rows.forEach((r, i) => {
        const bg = parseRgb(r.bg);
        const title = contrast(parseRgb(r.titleColor), bg);
        const icon = contrast(parseRgb(r.iconColor), bg);
        /* ข้อความเป็น text-fg ทุก tone → ต้องสูงมาก ไม่ใช่แค่ผ่าน */
        expect(title, `ข้อความ ${TONES[i]} · ${theme}`).toBeGreaterThanOrEqual(4.5);
        /* ไอคอนไม่ใช่ข้อความ แต่ระบบเลือกขั้นที่ผ่าน 4.5 อยู่แล้ว */
        expect(icon, `ไอคอน ${TONES[i]} · ${theme}`).toBeGreaterThanOrEqual(4.5);
      });
    }
  });

  test('⚠️ บันทึกความจริง: กล่องแทบมองไม่เห็นในโหมดสว่าง — ขอบอยู่ในย่านตกแต่ง', async ({ page }) => {
    await setTheme(page, 'light');
    const rows = await alertColors(page);
    rows.forEach((r, i) => {
      const edge = contrast(parseRgb(r.border), parseRgb(r.pageBg));
      /* ไม่ใช่บั๊ก — อยู่ในย่านเดียวกับ --color-edge (1.56) ที่ระบบเรียกว่าตกแต่ง
         ความหมายมาจากไอคอน + ข้อความ (SC 1.4.1) · Alert ไม่ใช่ control
         เทสนี้มีไว้ให้ค่าที่เปลี่ยนไปในอนาคตไม่หลุดไปเงียบ ๆ */
      expect(edge, `ขอบ ${TONES[i]}`).toBeLessThan(3);
      expect(edge, `ขอบ ${TONES[i]}`).toBeGreaterThan(1.1);
    });
  });
});

test.describe('Alert · การวัดขนาด', () => {
  test('เป้าของปุ่มปิด ≥ 24×24 จริง (SC 2.5.8)', async ({ page }) => {
    const box = await page.getByRole('button', { name: /^ปิด:/ }).boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(24);
    expect(box!.height).toBeGreaterThanOrEqual(24);
    /* size="md" → ไอคอน 20 + p-2 = 36 · ยืนยันว่าไม่ได้บีบลงถึงขั้นต่ำ */
    expect(box!.width).toBeGreaterThanOrEqual(36);
  });

  test('★ ปุ่มใน action ซ้อนแนวตั้งที่ 320px และไม่ล้น (SC 1.4.10)', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    const block = page.locator('[data-testid="alert-block"]');
    const outer = (await block.boundingBox())!;
    const action = (await page.getByRole('button', { name: 'ลองบันทึกอีกครั้ง' }).boundingBox())!;
    expect(action.x + action.width).toBeLessThanOrEqual(outer.x + outer.width + 0.5);

    const scrolls = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(scrolls).toBe(false);
  });

  test('ข้อความไทยหลายบรรทัดไม่ถูกตัด — กล่องสูงตามเนื้อหา', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    const warning = page.locator('[data-testid="alert-block"] > div').nth(2);
    const overflow = await warning.evaluate(
      (el) => el.scrollHeight - el.clientHeight,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
