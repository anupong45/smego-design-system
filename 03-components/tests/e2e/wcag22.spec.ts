import { test, expect, type Page } from '@playwright/test';

/* ═══════════════════════════════════════════════════════════════════════════
   4 เคสที่ `axe` จับไม่ได้เลย
   ───────────────────────────────────────────────────────────────────────────
   axe อ่าน markup · สี่ข้อนี้เป็น **ตำแหน่งจริง · พฤติกรรม · ลำดับเหตุการณ์**

     1 · SC 2.4.11  focus ถูก header หรือแถบล่างทับหรือไม่
     2 · SC 3.3.8   วางข้อความลงช่องได้หรือไม่
     3 · SC 2.5.7   เปลี่ยนค่า slider ได้โดยไม่ต้องลากหรือไม่
     4 · SC 2.1.2   Esc ออกจาก modal ได้ และ focus กลับที่ตัวเปิด
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * กล่องของ element ที่กำลังถูก focus
 *
 * ⚠️ `insideBar` สำคัญ — element ที่อยู่**ใน**แถบเองไม่ได้ถูกแถบบัง
 * ถ้าไม่กรองออก ปุ่มใน CompareBar จะถูกรายงานว่าถูก CompareBar บัง
 * ซึ่งเป็นข้อผิดพลาดของตัวเทส ไม่ใช่ของ component
 */
async function focusedBox(page: Page) {
  return page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body) return null;
    const r = el.getBoundingClientRect();
    const header = document.querySelector('[data-testid="header"]');
    const bottomBar = document.querySelector('[role="region"]');
    return {
      tag: el.tagName,
      label: (el.getAttribute('aria-label') ?? el.textContent ?? '').trim().slice(0, 40),
      top: r.top, bottom: r.bottom, left: r.left, right: r.right,
      height: r.height, width: r.width,
      insideBar: Boolean(header?.contains(el) || bottomBar?.contains(el)),
    };
  });
}

/* ─────────────────────────────────────────────────────────────────────────────
   1 · SC 2.4.11 Focus Not Obscured (Minimum)
   ───────────────────────────────────────────────────────────────────────────── */

test.describe('SC 2.4.11 · focus ต้องไม่ถูกบัง', () => {
  for (const width of [1280, 320]) {
    test(`Tab ทั้งหน้าที่ ${width}px แล้วไม่มี element ไหนถูกบังจนมิด`, async ({ page }) => {
      await page.setViewportSize({ width, height: 720 });
      await page.goto('/index.html');
      await page.waitForSelector('h1');

      /* ความสูงจริงของแถบบน/ล่าง — ไม่ใช้ค่าจากเอกสาร ใช้ที่วัดได้ */
      const bars = await page.evaluate(() => {
        const header = document.querySelector('[data-testid="header"]');
        const bottom = document.querySelector('[role="region"]');
        return {
          headerBottom: header ? header.getBoundingClientRect().bottom : 0,
          bottomTop: bottom ? bottom.getBoundingClientRect().top : window.innerHeight,
        };
      });

      const obscured: string[] = [];
      await page.locator('body').press('Tab');

      for (let i = 0; i < 60; i++) {
        const box = await focusedBox(page);
        if (!box) break;

        /* SC 2.4.11 (AA) = ต้องไม่ถูกบัง **ทั้งหมด**
           บังบางส่วนยังผ่าน AA (AAA ถึงจะห้ามบังเลย) */
        const fullyUnderHeader = box.bottom <= bars.headerBottom;
        const fullyUnderBottomBar = box.top >= bars.bottomTop;

        if (!box.insideBar && box.height > 0 && (fullyUnderHeader || fullyUnderBottomBar)) {
          obscured.push(`${box.tag} "${box.label}" top=${Math.round(box.top)} bottom=${Math.round(box.bottom)}`);
        }
        await page.keyboard.press('Tab');
      }

      expect(obscured, `element ที่ถูกบังจนมิด:\n${obscured.join('\n')}`).toHaveLength(0);
    });
  }

  test('แถบประกาศความสูงจริงเข้าตัวแปรของตัวเอง', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForSelector('[role="region"]');

    const result = await page.evaluate(() => {
      const bar = document.querySelector('[role="region"]') as HTMLElement;
      const cs = getComputedStyle(document.documentElement);
      return {
        barHeight: bar.getBoundingClientRect().height,
        /* ★ ตัวแปรของ **แถบนี้** ไม่ใช่ของ BottomNav */
        compareVar: cs.getPropertyValue('--compare-bar-height').trim(),
        bodyPad: parseFloat(getComputedStyle(document.body).paddingBottom),
      };
    });

    expect(parseFloat(result.compareVar)).toBeCloseTo(result.barHeight, 0);
    /* base.css §5a จองพื้นที่จาก --bottom-inset ที่รวมทุกแถบ */
    expect(result.bodyPad).toBeCloseTo(result.barHeight, 0);
  });
});

/* ─────────────────────────────────────────────────────────────────────────────
   2 · SC 3.3.8 Accessible Authentication — ต้องวางได้
   ───────────────────────────────────────────────────────────────────────────── */

test.describe('SC 3.3.8 · ต้องวางข้อความลงช่องได้', () => {
  test('วางเลข 13 หลักลง TextField ได้ครบ', async ({ page }) => {
    await page.goto('/index.html');
    const input = page.getByLabel('เลขทะเบียนนิติบุคคล');

    await page.evaluate(() => navigator.clipboard.writeText('0105561234567'))
      .catch(() => {});

    /* จำลองการวางจริงผ่าน paste event ไม่ใช่การพิมพ์ —
       ถ้ามี `onPaste preventDefault` อยู่ที่ไหน เคสนี้จะจับได้ */
    await input.click();
    await input.evaluate((el: HTMLInputElement) => {
      const dt = new DataTransfer();
      dt.setData('text/plain', '0105561234567');
      const ev = new ClipboardEvent('paste', {
        clipboardData: dt, bubbles: true, cancelable: true,
      });
      const notPrevented = el.dispatchEvent(ev);
      if (notPrevented) {
        /* jsdom/แชโดว์ของ browser ไม่เติมค่าให้เอง — จำลองผลของการวาง */
        const setter = Object.getOwnPropertyDescriptor(
          HTMLInputElement.prototype, 'value',
        )!.set!;
        setter.call(el, '0105561234567');
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });

    await expect(input).toHaveValue('0105561234567');
  });

  test('ไม่มี component ไหนบล็อกการวาง', async ({ page }) => {
    await page.goto('/index.html');
    const blocked = await page.evaluate(() => {
      const results: string[] = [];
      document.querySelectorAll('input, textarea').forEach((el) => {
        const dt = new DataTransfer();
        dt.setData('text/plain', '123456');
        const ev = new ClipboardEvent('paste', {
          clipboardData: dt, bubbles: true, cancelable: true,
        });
        const ok = el.dispatchEvent(ev);
        if (!ok) {
          results.push(
            (el as HTMLInputElement).getAttribute('aria-label')
              ?? (el as HTMLInputElement).type,
          );
        }
      });
      return results;
    });

    expect(blocked, `ช่องที่บล็อกการวาง: ${blocked.join(', ')}`).toHaveLength(0);
  });
});

/* ─────────────────────────────────────────────────────────────────────────────
   3 · SC 2.5.7 Dragging Movements
   ───────────────────────────────────────────────────────────────────────────── */

test.describe('SC 2.5.7 · เปลี่ยนค่า slider ได้โดยไม่ต้องลาก', () => {
  test('คีย์บอร์ดเปลี่ยนค่าได้ (SC 2.1.1 — ยังไม่พอสำหรับ 2.5.7)', async ({ page }) => {
    await page.goto('/index.html');
    const before = await page.getByTestId('price-readout').textContent();

    /* ⚠️ `getByLabel('ราคาต่ำสุด')` ตรงกับ **สองตัว** — input ของ slider
       ที่ซ่อนไว้ (aria-label) และช่องกรอกตัวเลข (`<label>`)
       ต้องระบุ `input[type="range"]` ให้ชัดเจน */
    const thumbInput = page
      .getByTestId('slider-block')
      .locator('input[type="range"][aria-label="ราคาต่ำสุด"]');

    await thumbInput.focus();
    await page.keyboard.press('ArrowRight');

    await expect(page.getByTestId('price-readout')).not.toHaveText(before ?? '');
  });

  test('★ มีช่องกรอกตัวเลขเป็นทางเลือกที่ใช้ pointer อย่างเดียวได้', async ({ page }) => {
    await page.goto('/index.html');

    /* นี่คือข้อที่ทำให้ผ่าน 2.5.7 จริง — คีย์บอร์ดไม่นับ */
    const numberFields = page
      .getByTestId('slider-block')
      .locator('input[type="text"], input[inputmode="numeric"]');

    await expect(numberFields).toHaveCount(2);

    const before = await page.getByTestId('price-readout').textContent();
    const lo = numberFields.first();
    await lo.click();
    await lo.press('Control+a');
    await lo.fill('300000');
    await lo.press('Enter');

    await expect(page.getByTestId('price-readout')).not.toHaveText(before ?? '');
  });

  test('กดบนรางได้เลย ไม่ต้องลาก', async ({ page }) => {
    await page.goto('/index.html');
    const before = await page.getByTestId('price-readout').textContent();

    /* หา element ราง (ตัวที่มี cursor-pointer) แล้วคลิกกลางความสูงของมันจริง ๆ
       การเดาพิกัดจากกล่องรวมของ block พลาดได้เพราะมี label กับช่องกรอกอยู่ด้วย */
    const track = page
      .getByTestId('slider-block')
      .locator('.cursor-pointer')
      .first();
    const box = (await track.boundingBox())!;

    /* คลิกครั้งเดียว — single pointer ไม่มีการลาก */
    await page.mouse.click(box.x + box.width * 0.75, box.y + box.height / 2);

    await expect(page.getByTestId('price-readout')).not.toHaveText(before ?? '');
  });
});

/* ─────────────────────────────────────────────────────────────────────────────
   4 · SC 2.1.2 No Keyboard Trap · SC 2.4.3 Focus Order
   ───────────────────────────────────────────────────────────────────────────── */

test.describe('SC 2.1.2 · Esc ออกจาก modal ได้ และ focus กลับที่ตัวเปิด', () => {
  test('Esc ปิด modal และคืน focus', async ({ page }) => {
    await page.goto('/index.html');

    const trigger = page.getByTestId('open-dialog');
    await trigger.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    /* focus ต้องอยู่ใน modal แล้ว ไม่ใช่ค้างที่ตัวเปิด */
    const insideBefore = await page.evaluate(
      () => !!document.querySelector('[role="dialog"]')?.contains(document.activeElement),
    );
    expect(insideBefore).toBe(true);

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();

    /* ★ focus กลับที่ปุ่มที่เปิด ไม่ใช่หลุดไปที่ body */
    await expect(trigger).toBeFocused();
  });

  test('Tab ใน modal วนอยู่ข้างใน ไม่หลุดไปหลังฉาก', async ({ page }) => {
    await page.goto('/index.html');
    await page.getByTestId('open-dialog').click();
    await expect(page.getByRole('dialog')).toBeVisible();

    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab');
      const inside = await page.evaluate(
        () => !!document.querySelector('[role="dialog"]')?.contains(document.activeElement),
      );
      expect(inside, `หลุดออกนอก modal ที่ Tab ครั้งที่ ${i + 1}`).toBe(true);
    }

    /* แต่ต้องออกได้ด้วย Esc — ไม่ใช่ keyboard trap */
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
  });

  test('ปุ่มปิดในหัว modal ทำงานและคืน focus', async ({ page }) => {
    await page.goto('/index.html');
    const trigger = page.getByTestId('open-dialog');
    await trigger.click();

    /* ★ ต้องจำกัดขอบเขตไว้ใน dialog — `name` ของ getByRole จับแบบ substring
       และหน้านี้มีปุ่มปิดของ Alert ชื่อ "ปิด: บันทึกไม่สำเร็จ" อยู่ด้วย
       ซึ่งเป็นผลโดยตรงของกฎ SC 2.5.3 ที่บังคับให้ชื่อปุ่มปิดรวมหัวเรื่อง */
    await page.getByRole('dialog').getByRole('button', { name: 'ปิด' }).click();
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(trigger).toBeFocused();
  });
});

/* ═══════════════════════════════════════════════════════════════════════════
   Regression · utility ขนาดต้องใช้ได้กับ <button>
   ───────────────────────────────────────────────────────────────────────────
   `base.css §8` เคยตั้ง `:where(button) { width: auto; block-size: auto }`
   **นอก `@layer`** ซึ่งชนะ `@layer utilities` เสมอ

   ผลคือ `size-*` · `w-*` · `h-*` บนปุ่มทุกตัวในระบบ**ถูกเพิกเฉยเงียบ ๆ**
   วัดเจอตอนทำ NumberField: ปุ่ม `size-6` ออกมา 16×16 แทน 24×24
   ซึ่งไม่ผ่าน SC 2.5.8

   เทสนี้กันไม่ให้กฎนั้นหลุดออกจาก layer อีก — jsdom ตรวจไม่ได้
   เพราะต้องคำนวณ cascade จริง
   ═══════════════════════════════════════════════════════════════════════════ */

test.describe('Regression · ขนาดของ <button>', () => {
  test('size-* ใช้ได้กับ button ไม่ถูก base.css ทับ', async ({ page }) => {
    await page.goto('/index.html');

    const result = await page.evaluate(() => {
      const probe = document.createElement('button');
      probe.className = 'size-6';
      document.body.appendChild(probe);
      const cs = getComputedStyle(probe);
      const out = { width: cs.width, height: cs.height };
      probe.remove();
      return out;
    });

    expect(result.width).toBe('24px');
    expect(result.height).toBe('24px');
  });

  test('ปุ่มที่มีข้อความยังกว้างตามเนื้อหา (SC 1.4.12)', async ({ page }) => {
    await page.goto('/index.html');

    const widths = await page.evaluate(() => {
      const make = (text: string) => {
        const b = document.createElement('button');
        b.textContent = text;
        document.body.appendChild(b);
        const w = b.getBoundingClientRect().width;
        b.remove();
        return w;
      };
      return { short: make('ตกลง'), long: make('ยื่นคำขอสินเชื่อเพื่อปรับเปลี่ยนเครื่องจักร') };
    });

    /* ค่าเริ่มต้นต้องยังเป็น auto — ปุ่มยาวต้องกว้างกว่าปุ่มสั้น */
    expect(widths.long).toBeGreaterThan(widths.short);
  });
});

/* ═══════════════════════════════════════════════════════════════════════════
   Regression · ระบบก้นจอต้อง compose ได้ (SC 2.4.11)
   ───────────────────────────────────────────────────────────────────────────
   เดิม `CompareBar` เขียนทับ `--bottom-nav-height` และ `body.paddingBottom`
   ตรง ๆ → พังทันทีที่มีแถบที่สอง (last-writer-wins) จองพื้นที่แค่แถบเดียว

   ตอนนี้แต่ละแถบเขียนตัวแปรของตัวเอง · `semantic.css` รวมด้วย `calc()`
   · `base.css §5a` จองพื้นที่จาก `--bottom-inset`

   เทสนี้จำลองแถบที่สองแล้วยืนยันว่าพื้นที่ที่จอง = ผลรวมจริง
   ═══════════════════════════════════════════════════════════════════════════ */

test.describe('Regression · --bottom-inset', () => {
  test('สองแถบพร้อมกันต้องจองพื้นที่เท่าผลรวม ไม่ใช่แถบเดียว', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForSelector('[role="region"]');

    const result = await page.evaluate(() => {
      const root = document.documentElement;
      const bar = document.querySelector('[role="region"]') as HTMLElement;
      const compareH = bar.getBoundingClientRect().height;

      /* จำลอง BottomNav ที่ประกาศตัวแปรของตัวเอง */
      root.style.setProperty('--bottom-nav-height', '56px');

      const bodyPad = parseFloat(getComputedStyle(document.body).paddingBottom);
      root.style.setProperty('--bottom-nav-height', '0px');

      return { compareH, bodyPad, expected: compareH + 56 };
    });

    /* ★ ถ้ายังเป็นโค้ดเดิม bodyPad จะเท่ากับ compareH เฉย ๆ (ตกหาย 56px) */
    expect(result.bodyPad).toBeCloseTo(result.expected, 0);
  });

  test('CompareBar ต้องไม่แตะ --bottom-nav-height ของแถบอื่น', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForSelector('[role="region"]');

    const navVar = await page.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue('--bottom-nav-height').trim(),
    );

    /* ไม่มี BottomNav ในหน้านี้ → ต้องยังเป็น 0px */
    expect(navVar).toBe('0px');
  });

  test('z-index ทุกชั้นมาจาก token และเรียงถูกลำดับ', async ({ page }) => {
    await page.goto('/index.html');

    const z = await page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement);
      const g = (n: string) => parseInt(cs.getPropertyValue(n).trim(), 10);
      return {
        raised: g('--z-raised'), sticky: g('--z-sticky'), bar: g('--z-bar'),
        overlay: g('--z-overlay'), modal: g('--z-modal'), toast: g('--z-toast'),
      };
    });

    expect(z.raised).toBeLessThan(z.sticky);
    expect(z.sticky).toBeLessThan(z.bar);
    expect(z.bar).toBeLessThan(z.overlay);
    expect(z.overlay).toBeLessThan(z.modal);
    /* ★ toast เหนือ modal โดยตั้งใจ — error ตอน modal เปิดต้องมองเห็น */
    expect(z.modal).toBeLessThan(z.toast);
  });
});
