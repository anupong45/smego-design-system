import { test, expect } from '@playwright/test';

/* ═══════════════════════════════════════════════════════════════════════════
   SC 1.4.10 Reflow — ไม่มีการเลื่อนแนวนอนที่ 320px
   ───────────────────────────────────────────────────────────────────────────
   ★★★ ทำไมเทสนี้เพิ่งมีวันที่ 2026-07-30

   `QUALITY.md` บันทึกไว้เองว่า **"gallery เองเลื่อนแนวนอนที่ 320px
   (`scrollWidth 549`)"** และใช้ข้อเท็จจริงนั้นเป็นเหตุผลให้ย้ายเทส tooltip
   ไปวัดบน fixture แทน — คือ **รู้ว่ามี แล้วเดินเลี่ยง ไม่ได้แก้**
   ระบบที่ประกาศว่า WCAG 2.2 AA เป็น pass/fail จึงมีหน้าแสดงตัวเองที่ตก 1.4.10

   ต้นเหตุมีสองชั้น และชั้นที่สองไม่ใช่ของ gallery:

   1 `Group` ของ gallery เป็น `grid` ที่ไม่ประกาศคอลัมน์ ⇒ implicit track เป็น
     `auto` = `minmax(min-content, max-content)` · specimen ที่ max-content กว้าง
     ดัน track ไป 540px แล้วล้นออกนอก container 288px
     → `grid-cols-[minmax(0,1fr)]` (556 → 443)

   2 ★★ **บั๊กของ component** — `sr-only` ของ Tailwind คือ `position: absolute`
     span "54 รายการ" ใน `CategoryNav` อยู่ในกล่องที่เลื่อนแนวนอน **แต่ไม่มี
     บรรพบุรุษที่ positioned** ⇒ containing block กลายเป็น viewport
     span จึงหลุดออกไปอยู่ที่ x=442 และดันความกว้างของ `html`
     ทั้งระบบมี scroll container 14 จุด และ **ไม่มีจุดไหนเป็น `relative`**
     → เติม `relative` ทั้ง 10 จุด + กฎ `lint:quality` ข้อ `scroll` (443 → 320)

   ⚠️ ตรวจ **ทั้งสองพื้นผิว** — `baseURL` ของ playwright คือ fixture :4321
      ไม่ใช่ gallery :4400 · รอบฟอนต์เพิ่งพลาดเพราะเรื่องนี้ (CLAUDE.md §2)
   ═══════════════════════════════════════════════════════════════════════════ */

const SURFACES = [
  { name: 'fixture', url: 'http://127.0.0.1:4321/index.html' },
  { name: 'gallery', url: 'http://127.0.0.1:4400/index.html' },
] as const;

/** 320 คือพื้นตาม SC 1.4.10 · 360 คือความกว้างจริงของ Android ระดับล่างที่ข้อ 01 อ้าง */
const WIDTHS = [320, 360] as const;

for (const s of SURFACES) {
  for (const w of WIDTHS) {
    test(`★★★ ${s.name} ที่ ${w}px ไม่เลื่อนแนวนอน (SC 1.4.10)`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: 800 });
      await page.goto(s.url);
      await page.evaluate(() => document.fonts.ready);

      const m = await page.evaluate(() => {
        const doc = document.documentElement;

        /* ★ เก็บตัวการไว้ในข้อความ fail ด้วย — เกตที่บอกแค่ "ล้น" ทำให้คนถัดไป
           ต้องมาไล่หาเองตั้งแต่ต้น (ผมใช้ 6 รอบ probe กว่าจะเจอในครั้งนี้)

           ลายเซ็นของบั๊กจริง: element ที่ position ไม่ใช่ static · อยู่ใน
           กล่องที่เลื่อน · แต่ **containing block ของมันอยู่นอกกล่องนั้น**
           ⇒ มันไม่ถูก clip และดันความกว้างของเอกสารจริง
           ส่วน absolute ที่อยู่ใน scroller ที่เป็น `relative` แล้ว จะยื่นพ้นขอบ
           ตามปกติ (rect ไม่สนใจการ clip) แต่ **ไม่ทำให้เอกสารกว้างขึ้น**

           ⚠️ ฉบับแรกเช็ค `offsetParent === null` ซึ่ง **ผิด** — สำหรับ absolute
              ที่ไม่มี positioned ancestor `offsetParent` คืน `body` ไม่ใช่ null
              บล็อกนี้จึงไม่พิมพ์อะไรเลยตอนที่ควรพิมพ์ (ยืนยันด้วยการฉีดความผิด) */
        const escaped: string[] = [];
        for (const el of Array.from(document.querySelectorAll<HTMLElement>('*'))) {
          const b = el.getBoundingClientRect();
          if (b.width === 0) continue;
          if (b.left + b.width <= doc.clientWidth + 0.5) continue;
          const cs = getComputedStyle(el);
          /* กล่องที่เลื่อนได้ตัวใกล้สุดที่ครอบอยู่ */
          let scroller: HTMLElement | null = el.parentElement;
          while (scroller && !/auto|scroll/.test(getComputedStyle(scroller).overflowX)) {
            scroller = scroller.parentElement;
          }
          const op = el.offsetParent;
          const escapes =
            cs.position !== 'static' && !!scroller && (!op || !scroller.contains(op));
          if (!escapes && scroller) continue;
          escaped.push(
            `${el.tagName.toLowerCase()}.${(el.className || '').toString().slice(0, 38)} ` +
              `right=${Math.round(b.left + b.width)} pos=${cs.position}` +
              `${escapes ? ' ★หลุด containing block' : ''}`,
          );
        }

        return {
          scrollWidth: doc.scrollWidth,
          clientWidth: doc.clientWidth,
          escaped: escaped.slice(0, 8),
        };
      });

      /* ★ guard — ถ้า clientWidth ไม่ใช่ค่าที่ตั้ง แปลว่า viewport ไม่ถูกใช้จริง
           และการเทียบด้านล่างจะผ่านโดยไม่ได้ตรวจอะไร */
      expect(m.clientWidth, 'viewport ไม่ถูกใช้จริง — เทสนี้จะไม่ได้ตรวจอะไร').toBe(w);

      expect(
        m.scrollWidth,
        `${s.name} เลื่อนแนวนอน: scrollWidth ${m.scrollWidth} > clientWidth ${m.clientWidth}\n` +
          `  ผู้ต้องสงสัย:\n    ${m.escaped.join('\n    ') || '(หาไม่เจอ — ดู grid ที่ไม่ประกาศคอลัมน์)'}`,
      ).toBe(m.clientWidth);
    });
  }
}
