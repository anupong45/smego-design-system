import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render, expectNoViolations } from './render';
import { DeadlineBadge, DeadlineText } from '../../src/index';

/* ═══════════════════════════════════════════════════════════════════════════
   Deadline — ปิดหนี้ข้อ 2.4 ใน QUALITY.md (2026-07-29)
   ───────────────────────────────────────────────────────────────────────────
   ★ หนี้เดิมเขียนว่า "ถูกอ้างจากหลายที่แล้วแต่ไม่มีเทสเอง" ซึ่งจริง —
   `Deadline` โดนทดสอบผ่านการ์ดที่ใช้มันเท่านั้น จึงไม่มีอะไรล็อกพฤติกรรม
   ที่เป็นแกนของมันเอง: **การแปลง พ.ศ.** และ **สถานะที่ไม่ใช่สีเดียว**

   ★★★ ทำไม พ.ศ. ต้องมีเทส

   `<time dateTime>` เก็บ **ค.ศ.** ไว้ให้เครื่องอ่าน ส่วนข้อความที่คนเห็นเป็น
   **พ.ศ.** — ถ้าใครสลับสองอย่างนี้ เครื่องมืออื่นจะอ่านปีผิด **543 ปี**
   และความผิดแบบนั้นมองไม่เห็นด้วยตาเลย เพราะหน้ายังแสดงถูก
   ═══════════════════════════════════════════════════════════════════════════ */

describe('DeadlineText · พ.ศ. กับ ค.ศ. ต้องอยู่คนละที่', () => {
  it('★★★ ข้อความเป็น พ.ศ. แต่ dateTime เป็น ค.ศ.', () => {
    render(<DeadlineText date="2026-12-31" />);
    const el = screen.getByText(/2569/);

    /* คนเห็น พ.ศ. 2569 */
    expect(el.textContent).toContain('2569');
    /* ★★★ เครื่องอ่าน ค.ศ. 2026 — ถ้าเก็บ พ.ศ. ที่นี่จะผิดมาตรฐาน HTML
       และเครื่องมืออื่นอ่านผิดไป 543 ปี โดยที่หน้ายังดูถูกทุกอย่าง */
    expect(el.getAttribute('datetime')).toBe('2026-12-31');
    expect(el.tagName).toBe('TIME');
  });

  it('format="long" ให้ชื่อเดือนเต็ม · short ให้ย่อ', () => {
    const { unmount } = render(<DeadlineText date="2026-12-31" format="long" />);
    expect(screen.getByText(/ธันวาคม/)).toBeTruthy();
    unmount();

    render(<DeadlineText date="2026-12-31" />);
    /* ย่อต้องไม่ใช่ชื่อเต็ม */
    expect(screen.queryByText(/ธันวาคม/)).toBeNull();
    expect(screen.getByText(/ธ\.ค\./)).toBeTruthy();
  });

  it('★ ใช้เขตเวลา Asia/Bangkok — วันที่ไม่เลื่อนตามเครื่องผู้ใช้', () => {
    /* ★ ถ้า parse เป็น UTC เฉย ๆ วันที่ 1 ของเดือนจะกลายเป็นวันสุดท้ายของ
       เดือนก่อนสำหรับผู้ใช้ที่อยู่ตะวันตกของกรุงเทพ — กำหนดการรับสมัคร
       เลื่อนไปหนึ่งวันเป็นเรื่องใหญ่บนแพลตฟอร์มภาครัฐ */
    render(<DeadlineText date="2026-01-01" />);
    const el = screen.getByText(/2569/);
    expect(el.textContent).toContain('1');
    expect(el.textContent).toContain('ม.ค.');
    expect(el.getAttribute('datetime')).toBe('2026-01-01');
  });

  it('ไม่มี axe violation', async () => {
    const { container } = render(<DeadlineText date="2026-12-31" />);
    const results = await expectNoViolations(container);
    expect(results.violations).toEqual([]);
  });
});

describe('DeadlineBadge · สถานะไม่บอกด้วยสีเดียว (SC 1.4.1)', () => {
  it('★★ ทุกสถานะมีทั้งข้อความและไอคอน', async () => {
    for (const status of ['open', 'closing-soon', 'closed'] as const) {
      const { container, unmount } = render(<DeadlineBadge status={status} />);
      /* ข้อความ — ไม่ใช่แค่จุดสี */
      expect(container.textContent?.trim().length, `${status} ต้องมีข้อความ`).toBeGreaterThan(0);
      /* ไอคอนจาก Badge ที่ผูกกับ variant — วงกลม/สามเหลี่ยม/กากบาท */
      expect(container.querySelector('svg'), `${status} ต้องมีไอคอน`).toBeTruthy();
      unmount();
    }
  });

  it('closing-soon แสดงจำนวนวันต่อท้ายเมื่อส่ง daysLeft', () => {
    render(<DeadlineBadge status="closing-soon" daysLeft={3} />);
    /* ★ "ใกล้ปิดรับ · เหลือ 3 วัน" — ตัวเลขลอย ๆ ไม่บอกอะไร ต้องมีหน่วย */
    const text = screen.getByText(/ใกล้ปิดรับ/).textContent ?? '';
    expect(text).toContain('3');
    expect(text).toMatch(/วัน/);
  });

  it('closing-soon ไม่ส่ง daysLeft = ไม่มีตัวเลขค้าง', () => {
    render(<DeadlineBadge status="closing-soon" />);
    expect(screen.getByText(/ใกล้ปิดรับ/).textContent).not.toMatch(/\d/);
  });

  it('สามสถานะให้ข้อความต่างกันจริง — ไม่ใช่ต่างแค่สี', () => {
    const seen = new Set<string>();
    for (const status of ['open', 'closing-soon', 'closed'] as const) {
      const { container, unmount } = render(<DeadlineBadge status={status} />);
      seen.add(container.textContent?.trim() ?? '');
      unmount();
    }
    expect(seen.size, 'ทั้งสามสถานะต้องอ่านต่างกันได้โดยไม่ต้องเห็นสี').toBe(3);
  });

  it('ไม่มี axe violation ทุกสถานะ', async () => {
    for (const status of ['open', 'closing-soon', 'closed'] as const) {
      const { container, unmount } = render(
        <DeadlineBadge status={status} daysLeft={2} />,
      );
      const results = await expectNoViolations(container);
      expect(results.violations, status).toEqual([]);
      unmount();
    }
  });
});
