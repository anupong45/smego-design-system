import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { dictionary } from 'react-aria-components/i18n';
import { installRacThaiStrings } from '../../src/lib/install-rac-th';

/* ★ ต้องติดตั้งที่ระดับ module — global ถูกอ่านครั้งเดียวแล้ว cache
   (กลไกเดียวกับ rac-i18n.test.tsx) */
installRacThaiStrings(
  (dictionary as unknown as { strings: Record<string, Record<string, Record<string, unknown>>> })
    .strings['en-US']!,
);

import { expectNoViolations } from './render';
import { SmeGoProvider, ToastRegion, showToast, toastQueue } from '../../src/index';

/* ═══════════════════════════════════════════════════════════════════════════
   Pass 3 · Toast + ToastRegion
   ───────────────────────────────────────────────────────────────────────────
   เทสชุดนี้ตรวจ**คำอ้างในเอกสาร** เป็นหลัก เพราะ Toast พึ่ง API ที่เป็น
   `UNSTABLE_` ของ RAC — คำอ้างที่ไม่มีเทสรองรับจะกลายเป็นเท็จเงียบ ๆ
   ตอนอัปเกรด
   ═══════════════════════════════════════════════════════════════════════════ */

function mount() {
  return render(
    <SmeGoProvider>
      <ToastRegion />
    </SmeGoProvider>,
  );
}

afterEach(() => {
  act(() => { toastQueue.clear(); });
});

describe('Toast', () => {
  it('ไม่มี axe violation', async () => {
    const { container } = mount();
    await act(async () => { showToast({ title: 'เพิ่มเครื่องคั่วกาแฟ TR-500 ลงตะกร้าแล้ว' }); });
    const results = await expectNoViolations(container.ownerDocument.body);
    expect(results.violations).toEqual([]);
  });

  /* ── โครง ARIA ที่ RAC ให้ ─────────────────────────────────────────────── */

  it('★★ โครง role ที่วัดได้จริง: region → alertdialog → alert', async () => {
    mount();
    await act(async () => { showToast({ title: 'บันทึกร่างแล้ว' }); });

    const region = document.querySelector('[role="region"]')!;
    expect(region.getAttribute('tabindex')).toBe('-1');

    const toast = region.querySelector('[role="alertdialog"]')!;
    /* ★ modal="false" — ประกาศได้โดยไม่ขัดจังหวะและไม่กัก focus */
    expect(toast.getAttribute('aria-modal')).toBe('false');
    expect(toast.getAttribute('tabindex')).toBe('0');

    /* ★ ตัวที่ประกาศจริงคือ content ไม่ใช่ตัว toast */
    const content = toast.querySelector('[role="alert"]')!;
    expect(content.getAttribute('aria-atomic')).toBe('true');
  });

  it('★★★ ชื่อ region มาจาก RAC พร้อม**จำนวนใบ** — ไม่เขียนทับ', async () => {
    mount();
    await act(async () => { showToast({ title: 'ใบที่หนึ่ง' }); });
    expect(document.querySelector('[role="region"]')!.getAttribute('aria-label'))
      .toBe('มีการแจ้งเตือน 1 รายการ');

    await act(async () => { showToast({ title: 'ใบที่สอง' }); });
    expect(document.querySelector('[role="region"]')!.getAttribute('aria-label'))
      .toBe('มีการแจ้งเตือน 2 รายการ');
  });

  /* ── ขอบเขตที่บังคับด้วย type ──────────────────────────────────────────── */

  it('★★ ไอคอนของ 2 tone ต่างรูปทรงกันจริง (SC 1.4.1)', async () => {
    mount();
    await act(async () => {
      showToast({ title: 'สำเร็จ', tone: 'success' });
      showToast({ title: 'ข้อมูล', tone: 'info' });
    });
    const svgs = [...document.querySelectorAll('[role="alertdialog"] svg')];
    const shapes = svgs.slice(0, 2).map((s) => s.innerHTML);
    expect(new Set(shapes).size).toBe(2);
  });

  it('tone เริ่มต้นเป็น success', async () => {
    mount();
    await act(async () => { showToast({ title: 'บันทึกแล้ว' }); });
    const icon = document.querySelector('[role="alertdialog"] svg')!;
    expect(icon.getAttribute('class')).toContain('text-success-icon');
  });

  /* ── เวลา ─────────────────────────────────────────────────────────────── */

  it('★★★ timeout ต่ำกว่า 6 วินาทีถูกยกขึ้นเป็น 6000 — RAC ไม่บังคับให้เอง', async () => {
    const spy = vi.spyOn(toastQueue, 'add');
    mount();
    await act(async () => { showToast({ title: 'สั้นเกินไป' }, 1000); });
    expect(spy.mock.calls[0]![1]).toEqual({ timeout: 6000 });
    spy.mockRestore();
  });

  it('ค่าที่มากกว่า 6 วินาทีถูกเคารพ', async () => {
    const spy = vi.spyOn(toastQueue, 'add');
    mount();
    await act(async () => { showToast({ title: 'ข้อความยาว' }, 10_000); });
    expect(spy.mock.calls[0]![1]).toEqual({ timeout: 10_000 });
    spy.mockRestore();
  });

  /* ── ปุ่มปิด ──────────────────────────────────────────────────────────── */

  it('★★ ชื่อปุ่มปิดรวมข้อความ — สามใบพร้อมกันต้องแยกกันได้ (SC 2.5.3)', async () => {
    mount();
    await act(async () => {
      showToast({ title: 'เพิ่มลงตะกร้าแล้ว' });
      showToast({ title: 'บันทึกร่างแล้ว' });
    });
    expect(screen.getByRole('button', { name: 'ปิด: เพิ่มลงตะกร้าแล้ว' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'ปิด: บันทึกร่างแล้ว' })).toBeTruthy();
  });

  it('★ ปิดได้เสมอ — ไม่มี prop ที่เอาปุ่มออกได้', async () => {
    mount();
    await act(async () => { showToast({ title: 'บันทึกร่างแล้ว' }); });
    await userEvent.click(screen.getByRole('button', { name: /^ปิด:/ }));
    expect(document.querySelector('[role="alertdialog"]')).toBeNull();
  });

  /* ── ขีดจำกัดคิว ──────────────────────────────────────────────────────── */

  it('★ แสดงพร้อมกันไม่เกิน 3 ใบ', async () => {
    mount();
    await act(async () => {
      for (let i = 1; i <= 5; i += 1) showToast({ title: `ใบที่ ${i}` });
    });
    expect(document.querySelectorAll('[role="alertdialog"]')).toHaveLength(3);
  });

  /* ── โค้ดตายที่เคยมี ──────────────────────────────────────────────────── */

  it('★★★ RAC 1.19 ไม่ปล่อย data-entering/data-exiting — กันคลาส animation ตายกลับมา', async () => {
    mount();
    await act(async () => { showToast({ title: 'บันทึกร่างแล้ว' }); });
    const toast = document.querySelector('[role="alertdialog"]')!;
    const names = [...toast.attributes].map((a) => a.name);
    expect(names).not.toContain('data-entering');
    expect(names).not.toContain('data-exiting');
    /* ถ้า RAC เพิ่มให้ในอนาคต เทสนี้จะแดง = สัญญาณให้กลับมาใส่ animation */
    expect(toast.className).not.toContain('data-entering:');
  });
});
