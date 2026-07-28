import { test, expect, type Page } from '@playwright/test';

/* ═══════════════════════════════════════════════════════════════════════════
   contrast sweep — ทุกข้อความบนหน้า gallery · ทั้งสองโหมด (SC 1.4.3)
   ───────────────────────────────────────────────────────────────────────────
   ★★★ ทำไมไฟล์นี้ถึงมี และทำไมมันมาช้า

   รอบ grill 2026-07-26 สรุปว่าจะทำ sweep นี้ เพราะบั๊ก `primary-50` เป็นพื้น
   หลุดถึงโค้ดพร้อมใช้ **เนื่องจากตรวจ contrast แบบสุ่มจุด** · ผ่านไปสามวัน
   ยังไม่ได้ทำ และของจริงคือ:

     · `color-contrast` ของ axe **ปิดอยู่** ใน `tests/a11y/render.tsx` (ถูกต้อง —
       jsdom ไม่คำนวณสีจริงจาก CSS) ⇒ unit test 339 ข้อให้ coverage contrast = **0**
     · ที่วัดจริงมีแค่ 2 ไฟล์ (`pass3` · `banner`) ⇒ ยังเป็นการสุ่มจุด แค่เพิ่มจุด

   หน้า `gallery/` มี **ทุก component ที่ export** พร้อมสวิตช์โหมดมืดอยู่แล้ว
   จึงเป็นที่เดียวที่ sweep ได้ครบในครั้งเดียว

   ═══ ขอบเขตที่ไฟล์นี้ตรวจ — และที่ไม่ตรวจ ═══

   ✅ **SC 1.4.3 ข้อความ** — 4.5:1 ปกติ · 3:1 ข้อความใหญ่ (≥24px หรือ ≥18.66px ตัวหนา)
   ❌ **SC 1.4.11 ขอบเขต UI (3:1)** ไม่ตรวจที่นี่ เพราะการหา "ขอบที่สื่อความหมาย"
      แบบทั่วไปแยกจากขอบตกแต่งไม่ได้ด้วยการอ่าน computed style เฉย ๆ —
      ยังต้องพึ่ง spec รายตัว (`pass3` · `banner`) ที่ระบุเจาะจงว่าวัดคู่ไหน
      **เขียนไว้ให้ชัดว่าเป็นช่องที่เหลืออยู่ ไม่ใช่ช่องที่ปิดแล้ว**

   ═══ สิ่งที่ยกเว้น และเหตุผล ═══

   · `[disabled]` / `[data-disabled]` — WCAG ยกเว้น component ที่ปิดใช้งาน
   · `.sr-only` — ไม่ปรากฏต่อสายตา
   · `opacity: 0` · `visibility: hidden` · กล่องขนาด 0
   · พื้นที่เป็น gradient/ภาพ — คำนวณจาก computed style ไม่ได้ **รายงานแยก**
     ไม่ใช่ผ่านเงียบ ๆ (ถ้ามีตัวไหนโผล่ ต้องเขียน spec เฉพาะให้มัน)
   ═══════════════════════════════════════════════════════════════════════════ */

const GALLERY = 'http://127.0.0.1:4400/index.html';

interface Finding {
  ratio: number;
  required: number;
  fg: string;
  bg: string;
  size: number;
  weight: string;
  text: string;
  where: string;
}

interface SweepResult {
  checked: number;
  findings: Finding[];
  unmeasurable: string[];
}

async function sweep(page: Page, rootSel = 'body'): Promise<SweepResult> {
  return page.evaluate((rootSelector) => {
    const parseRgb = (s: string): [number, number, number, number] | null => {
      const m = s.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const p = m[1]!.split(',').map((n) => parseFloat(n));
      return [p[0]!, p[1]!, p[2]!, p[3] === undefined ? 1 : p[3]];
    };

    const lum = ([r, g, b]: [number, number, number]) => {
      const f = (c: number) => {
        const v = c / 255;
        return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };

    const ratio = (a: [number, number, number], b: [number, number, number]) => {
      const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m) as [number, number];
      return (x + 0.05) / (y + 0.05);
    };

    /* ทับสีที่มี alpha ลงบนพื้นด้านหลัง — ไม่ทำแบบนี้จะได้ค่าที่ดูดีเกินจริง
       ตอนใช้ opacity ซึ่งระบบนี้ใช้อยู่จริง (เช่น description ใน Radio card) */
    const over = (
      fg: [number, number, number, number],
      bg: [number, number, number],
    ): [number, number, number] => [
      fg[0] * fg[3] + bg[0] * (1 - fg[3]),
      fg[1] * fg[3] + bg[1] * (1 - fg[3]),
      fg[2] * fg[3] + bg[2] * (1 - fg[3]),
    ];

    const path = (el: Element) => {
      const bits: string[] = [];
      let n: Element | null = el;
      for (let i = 0; n && i < 4; i++, n = n.parentElement) {
        const cls = (n.getAttribute('class') || '').split(/\s+/).filter(Boolean).slice(0, 2);
        bits.unshift(n.tagName.toLowerCase() + (cls.length ? '.' + cls.join('.') : ''));
      }
      return bits.join(' > ');
    };

    const findings: Finding[] = [];
    const unmeasurable: string[] = [];
    let checked = 0;

    const root = document.querySelector(rootSelector) ?? document.body;
    for (const el of Array.from(root.querySelectorAll('*'))) {
      /* เฉพาะ element ที่มี **text node ของตัวเอง** — ไม่ใช่ของลูก
         มิฉะนั้นสีที่อ่านได้จะไม่ใช่สีของข้อความนั้นจริง */
      const own = Array.from(el.childNodes)
        .filter((n) => n.nodeType === 3)
        .map((n) => n.textContent || '')
        .join('')
        .trim();
      if (!own) continue;

      if (el.closest('[disabled],[data-disabled],.sr-only')) continue;

      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none') continue;
      if (parseFloat(cs.opacity) === 0) continue;

      const box = el.getBoundingClientRect();
      if (box.width === 0 || box.height === 0) continue;

      const fgRaw = parseRgb(cs.color);
      if (!fgRaw) continue;

      /* หาพื้นหลังที่ทึบตัวแรกที่เจอเมื่อไล่ขึ้นไป */
      let bg: [number, number, number] | null = null;
      let node: Element | null = el;
      let hitImage = false;
      while (node) {
        const s = getComputedStyle(node);
        if (s.backgroundImage && s.backgroundImage !== 'none') { hitImage = true; break; }
        const c = parseRgb(s.backgroundColor);
        if (c && c[3] === 1) { bg = [c[0], c[1], c[2]]; break; }
        if (c && c[3] > 0) {
          /* พื้นกึ่งโปร่ง — ต้องทับต่อขึ้นไป ทำให้ซับซ้อนเกินกว่าจะสรุปได้ตรงนี้ */
          hitImage = true; break;
        }
        node = node.parentElement;
      }

      if (hitImage) { unmeasurable.push(`${path(el)} — "${own.slice(0, 30)}"`); continue; }
      if (!bg) bg = [255, 255, 255];

      /* opacity ของตัวเองและบรรพบุรุษคูณกันจริง — รวมเข้าไปใน alpha */
      let eff = fgRaw[3];
      for (let n2: Element | null = el; n2; n2 = n2.parentElement) {
        const o = parseFloat(getComputedStyle(n2).opacity);
        if (!Number.isNaN(o)) eff *= o;
      }

      const fg = over([fgRaw[0], fgRaw[1], fgRaw[2], eff], bg);

      const px = parseFloat(cs.fontSize);
      const w = cs.fontWeight;
      const bold = Number(w) >= 700 || w === 'bold' || w === 'bolder';
      /* WCAG large text: ≥24px หรือ ≥18.66px เมื่อเป็นตัวหนา */
      const required = px >= 24 || (bold && px >= 18.66) ? 3 : 4.5;

      checked++;
      const r = ratio(fg, bg);
      if (r + 0.005 < required) {
        findings.push({
          ratio: Math.round(r * 100) / 100,
          required,
          fg: cs.color,
          bg: `rgb(${bg.map(Math.round).join(', ')})`,
          size: px,
          weight: w,
          text: own.slice(0, 40),
          where: path(el),
        });
      }
    }

    return { checked, findings, unmeasurable };
  }, rootSel);
}

const fmt = (r: SweepResult) =>
  r.findings
    .sort((a, b) => a.ratio - b.ratio)
    .map(
      (f) =>
        `  ${f.ratio}:1 (ต้อง ${f.required}:1) ${f.size}px/${f.weight}\n` +
        `      "${f.text}"\n      ${f.fg} บน ${f.bg}\n      ${f.where}`,
    )
    .join('\n');

for (const theme of ['light', 'dark'] as const) {
  test(`★★★ contrast ของทุกข้อความบน gallery ผ่านเกณฑ์ — โหมด ${theme}`, async ({ page }) => {
    await page.goto(GALLERY);

    /* ★★★ ต้องดับ transition **ก่อน** สลับธีม

       component ในระบบนี้ใช้ `transition-colors` เกือบทุกตัว · ครั้งแรกที่รัน
       sweep นี้อ่านค่าได้ต่างกันทุกรอบ (`rgb(120,123,128)` แล้ว `rgb(124,127,133)`)
       เพราะวัดตอนสีกำลังไล่อยู่กลางทาง — ทำให้เกตทั้ง **flaky** และ **รายงานสีผิด**
       ซึ่งอันตรายกว่า flaky เพราะพาไปแก้ token ที่ไม่ได้ผิด */
    await page.addStyleTag({
      content: `*, *::before, *::after {
        transition: none !important;
        animation: none !important;
      }`,
    });

    await page.evaluate((t) => {
      document.documentElement.setAttribute('data-theme', t);
    }, theme);
    /* หนึ่ง frame ให้ custom property ที่เปลี่ยนตามธีมถูกคำนวณใหม่ */
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => r(null))));

    const result = await sweep(page);

    /* sanity — ถ้า sweep วัดได้น้อยเกินไปแปลว่าหน้าไม่โหลด ไม่ใช่ว่าไม่มีปัญหา
       เกตนี้กันการ "ผ่านเพราะไม่ได้ตรวจอะไรเลย" ซึ่งเป็นวิธีที่ sweep ตายเงียบ */
    expect(
      result.checked,
      `วัดได้แค่ ${result.checked} element — หน้า gallery น่าจะไม่โหลด`,
    ).toBeGreaterThan(150);

    expect(
      result.findings,
      `\ncontrast ไม่ผ่าน ${result.findings.length} จุด (จาก ${result.checked} ที่วัด · โหมด ${theme}):\n${fmt(result)}\n`,
    ).toEqual([]);
  });
}

test('รายงานจุดที่คำนวณไม่ได้ — ต้องมี spec เฉพาะรองรับ', async ({ page }) => {
  await page.goto(GALLERY);
  const { unmeasurable, checked } = await sweep(page);

  /* ★ ไม่ fail แต่ **ต้องพิมพ์ออกมา** — จุดที่พื้นเป็น gradient/ภาพ/กึ่งโปร่ง
     คำนวณจาก computed style ไม่ได้ ถ้าปล่อยเงียบจะอ่านเหมือน "ตรวจครบแล้ว"
     ซึ่งเป็นสิ่งเดียวกับที่ทำให้บั๊ก primary-50 หลุดไปได้ */
  console.log(
    `contrast sweep: วัด ${checked} · คำนวณไม่ได้ ${unmeasurable.length}` +
      (unmeasurable.length ? '\n  ' + unmeasurable.join('\n  ') : ''),
  );
  expect(checked).toBeGreaterThan(150);
});

/* ═══════════════════════════════════════════════════════════════════════════
   รอบที่สอง — overlay ที่ปิดอยู่ตอนโหลด
   ───────────────────────────────────────────────────────────────────────────
   ★ รอบแรกวัดได้ 618 element แต่ **ไม่แตะ popover เลย** เพราะ RAC render
   listbox/calendar/dialog ใน portal และสร้างตอนเปิดเท่านั้น

   นั่นคือส่วนที่พลาดง่ายที่สุดด้วย เพราะพื้นของ popover เป็น `--color-surface`
   ที่ต่างจากพื้นหน้า และรายการที่ hover/selected ใช้ `--color-selected-surface`
   ซึ่งเป็น token ชุดเดียวกับที่บั๊ก `primary-50` เคยเกิด (ดู 2026-07-26)

   ⚠️ ยังไม่ครอบ state hover/focus — เป็นช่องที่เหลืออยู่ เขียนไว้ให้ชัด
   ═══════════════════════════════════════════════════════════════════════════ */

for (const theme of ['light', 'dark'] as const) {
  test(`★★ contrast ใน popover ที่เปิดอยู่ — โหมด ${theme}`, async ({ page }) => {
    await page.goto(GALLERY);
    await page.addStyleTag({
      content: `*, *::before, *::after { transition: none !important; animation: none !important; }`,
    });
    await page.evaluate((t) => {
      document.documentElement.setAttribute('data-theme', t);
    }, theme);

    const triggers = page.locator('button[aria-expanded="false"], [role="combobox"]');
    const n = await triggers.count();
    expect(n, 'ไม่พบ trigger ที่เปิด popover ได้เลย — gallery เปลี่ยนโครงหรือเปล่า').toBeGreaterThan(5);

    const all: Finding[] = [];
    let opened = 0;
    let measured = 0;

    for (let i = 0; i < n; i++) {
      const t = triggers.nth(i);
      if (!(await t.isVisible().catch(() => false))) continue;
      await t.click({ timeout: 2000 }).catch(() => {});

      /* popover ของ RAC อยู่ใน portal ระดับ body — จับด้วย role ที่มันประกาศ */
      const pop = page.locator('[role="listbox"], [role="dialog"], [role="grid"]').first();
      if (await pop.isVisible().catch(() => false)) {
        opened++;
        const r = await sweep(page, '[role="listbox"], [role="dialog"], [role="grid"]');
        measured += r.checked;
        all.push(...r.findings);
      }
      await page.keyboard.press('Escape').catch(() => {});
    }

    /* ★ ถ้าเปิดไม่ได้เลย เกตนี้จะ "ผ่าน" ทั้งที่ไม่ได้ตรวจอะไร — กันไว้ */
    expect(opened, 'เปิด popover ไม่ได้แม้แต่ตัวเดียว').toBeGreaterThan(0);
    console.log(`popover sweep (${theme}): เปิดได้ ${opened} · วัด ${measured} element`);

    expect(
      all,
      `\ncontrast ใน popover ไม่ผ่าน ${all.length} จุด (โหมด ${theme}):\n${fmt({ checked: measured, findings: all, unmeasurable: [] })}\n`,
    ).toEqual([]);
  });
}
