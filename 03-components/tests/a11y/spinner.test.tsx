import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render, expectNoViolations } from './render';
import { Spinner } from '../../src/index';

/* ═══════════════════════════════════════════════════════════════════════════
   เฟส 5 · Spinner
   ───────────────────────────────────────────────────────────────────────────
   เทสที่มีค่าที่นี่คือข้อที่ **ผิดง่ายและเงียบ**:
   สามโหมดของ label · `.spinner` ไม่ใช่ `animate-spin` (ค้างนิ่งใน reduced
   motion โดยไม่มี error) · ไอคอนต้องไม่โผล่ใน a11y tree ซ้อนกับข้อความ
   ═══════════════════════════════════════════════════════════════════════════ */

describe('Spinner', () => {
  it('ไม่มี axe violation ทั้งสามโหมด', async () => {
    const { container } = render(
      <>
        <Spinner />
        <Spinner label="กำลังยืนยันการชำระเงิน" />
        <Spinner label="กำลังตรวจสอบเลขนิติบุคคล" isLabelHidden />
      </>,
    );
    const results = await expectNoViolations(container);
    expect(results.violations).toEqual([]);
  });

  /* ── ★★★ ต้องใช้ .spinner ไม่ใช่ animate-spin ───────────────────────────── */

  it('★★★ ใช้ class `.spinner` ไม่ใช่ `animate-spin` — reduced motion จะค้างนิ่ง', () => {
    const { container } = render(<Spinner />);
    const icon = container.querySelector('svg')!;
    /* ⚠️ ต้องอ่านด้วย getAttribute('class') — `svg.className` เป็น
       `SVGAnimatedString` **ไม่ใช่ string** ทำให้ `toContain` เทียบกับ `[]`
       แล้วผ่านหรือไม่ผ่านโดยไม่เกี่ยวกับคลาสจริง (เจอตอนเขียนเทสนี้) */
    const cls = icon.getAttribute('class') ?? '';
    /* `.spinner` อยู่ในรายการ ALLOW ของ base.css §10 · `animate-spin` ไม่อยู่
       ถ้าใช้ animate-spin ตัวหมุนจะหมุนรอบเดียวใน 1ms แล้วค้าง — เงียบสนิท */
    expect(cls).toContain('spinner');
    expect(cls).not.toContain('animate-spin');
  });

  /* ── สามโหมดของ label ─────────────────────────────────────────────────── */

  it('★★ ไม่ส่ง label = ไม่ประกาศอะไร — ผู้เรียกเป็นเจ้าของชื่อ', () => {
    render(<Spinner />);
    /* ใน <Button isLoading> ข้อความปุ่มประกาศไปแล้ว ถ้าประกาศอีกจะได้ยินซ้ำ */
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('label ทำให้เป็น role="status" และเห็นข้อความ', () => {
    render(<Spinner label="กำลังยืนยันการชำระเงิน" />);
    const status = screen.getByRole('status');
    expect(status.textContent).toBe('กำลังยืนยันการชำระเงิน');
    /* ต้องไม่ sr-only — โหมดนี้ข้อความต้องเห็นได้ */
    expect(screen.getByText('กำลังยืนยันการชำระเงิน').className).not.toContain('sr-only');
  });

  it('★ isLabelHidden ยังประกาศแต่ไม่เห็นด้วยตา', () => {
    render(<Spinner label="กำลังตรวจสอบ" isLabelHidden />);
    /* ยังอยู่ใน a11y tree — accessible name ไม่หาย */
    expect(screen.getByRole('status').textContent).toBe('กำลังตรวจสอบ');
    /* แต่ซ่อนด้วยตาเพราะไม่มีที่ว่างในช่องกรอก */
    expect(screen.getByText('กำลังตรวจสอบ').className).toContain('sr-only');
  });

  it('role="status" เป็น polite ไม่ใช่ assertive — การโหลดไม่ใช่เรื่องด่วน', () => {
    render(<Spinner label="กำลังโหลด" />);
    /* role="status" มี aria-live="polite" โดยปริยาย · ต้องไม่มี alert */
    expect(screen.getByRole('status')).toBeTruthy();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  /* ── SC 1.1.1 ─────────────────────────────────────────────────────────── */

  it('ไอคอนเป็น aria-hidden เสมอ — ไม่ซ้อนกับข้อความ', () => {
    const { container } = render(<Spinner label="กำลังโหลด" />);
    expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  });

  /* ── ขนาดผูกกับสเกลไอคอนที่มี stroke ล็อก ──────────────────────────────── */

  it('★ ทุกขนาดได้ค่าที่มี stroke ล็อกไว้ใน Icon (16/20/24/32)', () => {
    const expected = { sm: '16', md: '20', lg: '24', xl: '32' } as const;

    for (const [size, px] of Object.entries(expected)) {
      const { container, unmount } = render(
        <Spinner size={size as keyof typeof expected} />,
      );
      const svg = container.querySelector('svg')!;
      expect(svg.getAttribute('width'), size).toBe(px);
      /* stroke ต้องมี — ถ้าขนาดหลุดจาก IconSize จะได้ undefined เงียบ ๆ */
      expect(svg.getAttribute('stroke-width'), size).toBeTruthy();
      unmount();
    }
  });

  it('shade="inherit" ไม่ใส่คลาสสี — รับ currentColor ของพ่อแม่', () => {
    const { container } = render(<Spinner shade="inherit" />);
    /* getAttribute ไม่ใช่ .className — ดูหมายเหตุ SVGAnimatedString ด้านบน */
    const cls = container.querySelector('svg')!.getAttribute('class') ?? '';
    expect(cls).toContain('spinner');
    expect(cls).not.toContain('text-primary-600');
    expect(cls).not.toContain('text-fg-muted');
    expect(cls).not.toContain('text-on-brand');
  });

  it('shade="default" ใส่ text-primary-600 จริง', () => {
    const { container } = render(<Spinner shade="default" />);
    const cls = container.querySelector('svg')!.getAttribute('class') ?? '';
    /* คู่กับเทสด้านบน — ยืนยันว่า `inherit` ว่างเพราะตั้งใจ ไม่ใช่เพราะ
       การอ่านคลาสพังทั้งสองเทส */
    expect(cls).toContain('text-primary-600');
  });
});
