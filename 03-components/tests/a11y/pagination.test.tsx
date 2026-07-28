import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, expectNoViolations } from './render';
import { Pagination, pageSlots } from '../../src/index';

/* ═══════════════════════════════════════════════════════════════════════════
   เฟส 5 · Pagination
   ───────────────────────────────────────────────────────────────────────────
   ตัวนี้มีตรรกะจริง (การเลือกเลขหน้า) จึงเทสอัลกอริทึมแยกจาก DOM
   ส่วน a11y ที่ผิดง่ายและเงียบ: ชื่อปุ่มเป็น "3" ลอย ๆ · `…` ติด tab order ·
   ปุ่มขอบเขตกดได้ทั้งที่ไม่ควร
   ═══════════════════════════════════════════════════════════════════════════ */

describe('pageSlots · อัลกอริทึมเลือกเลขหน้า', () => {
  it('หน้าน้อยพอ → แสดงทุกหน้า ไม่มีช่องว่าง', () => {
    expect(pageSlots(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(pageSlots(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('หน้าเดียว → ปุ่มเดียว', () => {
    expect(pageSlots(1, 1)).toEqual([1]);
  });

  it('★ หน้าแรกและหน้าสุดท้ายเห็นเสมอ — กระโดดสุดทางได้ในหนึ่งกด', () => {
    for (const page of [1, 5, 10, 20]) {
      const slots = pageSlots(page, 20);
      expect(slots[0], `page ${page}`).toBe(1);
      expect(slots[slots.length - 1], `page ${page}`).toBe(20);
    }
  });

  it('อยู่กลาง → มีช่องว่างสองข้าง', () => {
    expect(pageSlots(10, 20)).toEqual([1, 'gap', 9, 10, 11, 'gap', 20]);
  });

  it('อยู่ต้น → ช่องว่างข้างขวาเท่านั้น', () => {
    expect(pageSlots(2, 20)).toEqual([1, 2, 3, 'gap', 20]);
  });

  it('อยู่ท้าย → ช่องว่างข้างซ้ายเท่านั้น', () => {
    expect(pageSlots(19, 20)).toEqual([1, 'gap', 18, 19, 20]);
  });

  it('★★ ช่องว่างที่กินหน้าเดียวถูกแทนด้วยเลขหน้านั้น', () => {
    /* ถ้าใส่ `…` แทนหน้า 2 ผู้ใช้ต้องกดสองครั้งเพื่อไปหน้าที่อยู่ตรงหน้าต่อตา */
    const slots = pageSlots(4, 20);
    expect(slots).toContain(2);
    expect(slots.slice(0, 3)).toEqual([1, 2, 3]);
  });

  it('siblingCount กว้างขึ้นแสดงเลขมากขึ้น', () => {
    expect(pageSlots(10, 20, 2)).toEqual([1, 'gap', 8, 9, 10, 11, 12, 'gap', 20]);
  });

  it('ไม่มีเลขซ้ำและเรียงจากน้อยไปมากเสมอ', () => {
    for (let total = 1; total <= 30; total++) {
      for (let page = 1; page <= total; page++) {
        const nums = pageSlots(page, total).filter((x): x is number => x !== 'gap');
        expect(new Set(nums).size, `p${page}/t${total}`).toBe(nums.length);
        expect([...nums].sort((a, b) => a - b), `p${page}/t${total}`).toEqual(nums);
      }
    }
  });

  it('หน้าปัจจุบันอยู่ในผลลัพธ์เสมอ', () => {
    for (let total = 1; total <= 30; total++) {
      for (let page = 1; page <= total; page++) {
        expect(pageSlots(page, total), `p${page}/t${total}`).toContain(page);
      }
    }
  });
});

describe('Pagination · a11y', () => {
  it('ไม่มี axe violation ทุก variant', async () => {
    /* ★ render ทีละตัว — สอง <nav> ที่ชื่อเหมือนกันในหน้าเดียวผิดกฎ
       `landmark-unique` ของ axe · ดูเทสถัดไป */
    const cases = [
      <Pagination page={3} totalPages={10} onChange={() => {}} />,
      <Pagination page={3} totalItems={240} onChange={() => {}} variant="count" />,
      <Pagination page={3} totalPages={10} onChange={() => {}} variant="compact" />,
      <Pagination page={3} hasMore onChange={() => {}} />,
    ];

    for (const ui of cases) {
      const { container, unmount } = render(ui);
      const results = await expectNoViolations(container);
      expect(results.violations).toEqual([]);
      unmount();
    }
  });

  it('★★ สอง Pagination ในหน้าเดียว (บน+ล่าง) ต้องตั้ง `label` ให้ต่างกัน', async () => {
    /* เคสจริงที่พบบ่อย: pagination อยู่ทั้งหัวและท้ายรายการ
       ถ้าใช้ชื่อค่าเริ่มต้นทั้งคู่จะได้ landmark ซ้ำ = axe ฟ้อง `landmark-unique`
       ทางแก้คือ prop `label` ไม่ใช่การถอด <nav> ออก */
    const { container: dup } = render(
      <>
        <Pagination page={2} totalPages={9} onChange={() => {}} />
        <Pagination page={2} totalPages={9} onChange={() => {}} />
      </>,
    );
    const bad = await expectNoViolations(dup);
    expect(bad.violations.map((v) => v.id)).toContain('landmark-unique');

    const { container: ok } = render(
      <>
        <Pagination page={2} totalPages={9} onChange={() => {}} label="การแบ่งหน้า ด้านบน" />
        <Pagination page={2} totalPages={9} onChange={() => {}} label="การแบ่งหน้า ด้านล่าง" />
      </>,
    );
    const good = await expectNoViolations(ok);
    expect(good.violations).toEqual([]);
  });

  it('เป็น landmark ที่มีชื่อ — กระโดดมาที่การแบ่งหน้าได้ตรง ๆ', () => {
    render(<Pagination page={1} totalPages={5} onChange={() => {}} />);
    expect(screen.getByRole('navigation', { name: 'การแบ่งหน้า' })).toBeTruthy();
  });

  it('★★★ ชื่อปุ่มเป็น "หน้า 3" ไม่ใช่ "3" ลอย ๆ', () => {
    render(<Pagination page={1} totalPages={5} onChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'หน้า 3' })).toBeTruthy();
    /* "3" เพียว ๆ ต้องหาไม่เจอ — ตัวเลขที่เห็นเป็นเนื้อหา ไม่ใช่ชื่อ */
    expect(screen.queryByRole('button', { name: '3' })).toBeNull();
  });

  it('★★ หน้าปัจจุบันได้ทั้ง aria-current และข้อความ "หน้าปัจจุบัน"', () => {
    render(<Pagination page={2} totalPages={5} onChange={() => {}} />);
    const current = screen.getByRole('button', { name: 'หน้า 2 หน้าปัจจุบัน' });
    /* ไม่พึ่ง aria-current เดียว — SR เก่าบางตัวไม่ประกาศมัน */
    expect(current.getAttribute('aria-current')).toBe('page');
  });

  it('มีปุ่ม aria-current="page" เพียงอันเดียว', () => {
    const { container } = render(<Pagination page={3} totalPages={20} onChange={() => {}} />);
    expect(container.querySelectorAll('[aria-current="page"]')).toHaveLength(1);
  });

  it('★★ `…` ไม่ใช่ปุ่ม — ไม่อยู่ใน tab order และไม่ถูกอ่าน', () => {
    const { container } = render(<Pagination page={10} totalPages={20} onChange={() => {}} />);
    const gaps = [...container.querySelectorAll('li')].filter(
      (li) => li.textContent === '…',
    );
    expect(gaps.length).toBeGreaterThan(0);
    for (const gap of gaps) {
      expect(gap.getAttribute('aria-hidden')).toBe('true');
      expect(gap.querySelector('button')).toBeNull();
    }
  });

  it('ปุ่มก่อนหน้า/ถัดไป มีชื่อไทย ไม่ใช่ไอคอนเปล่า', () => {
    render(<Pagination page={2} totalPages={5} onChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'หน้าก่อนหน้า' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'หน้าถัดไป' })).toBeTruthy();
  });

  it('★ ไม่มี live region — SearchResult ประกาศจำนวนผลลัพธ์อยู่แล้ว', () => {
    const { container } = render(<Pagination page={2} totalPages={5} onChange={() => {}} />);
    expect(container.querySelector('[role="status"]')).toBeNull();
    expect(container.querySelector('[aria-live]')).toBeNull();
  });

  it('เลขหน้าใช้ tabular-nums — ปุ่มไม่ขยับตอนเปลี่ยนหน้า', () => {
    render(<Pagination page={1} totalPages={5} onChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'หน้า 1 หน้าปัจจุบัน' }).className).toContain(
      'tabular-nums',
    );
  });
});

describe('Pagination · ขอบเขต', () => {
  it('★★ หน้าแรก → ปุ่มก่อนหน้าถูก disable จริง ไม่ใช่แค่ดูจาง', async () => {
    const onChange = vi.fn();
    render(<Pagination page={1} totalPages={5} onChange={onChange} />);
    const prev = screen.getByRole('button', { name: 'หน้าก่อนหน้า' });
    /* RAC ใส่ `disabled` จริงบน <button> ไม่ใช่แค่ aria-disabled */
    expect(prev.hasAttribute('disabled')).toBe(true);
    await userEvent.click(prev);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('★★ หน้าสุดท้าย → ปุ่มถัดไปถูก disable จริง', async () => {
    const onChange = vi.fn();
    render(<Pagination page={5} totalPages={5} onChange={onChange} />);
    const next = screen.getByRole('button', { name: 'หน้าถัดไป' });
    expect(next.hasAttribute('disabled')).toBe(true);
    await userEvent.click(next);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('กดเลขหน้าเรียก onChange ด้วยเลขนั้น', async () => {
    const onChange = vi.fn();
    render(<Pagination page={1} totalPages={5} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'หน้า 3' }));
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('กดหน้าปัจจุบันไม่เรียก onChange — ไม่ยิงคำขอซ้ำ', async () => {
    const onChange = vi.fn();
    render(<Pagination page={2} totalPages={5} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'หน้า 2 หน้าปัจจุบัน' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('isDisabled ปิดทั้งแถบ', async () => {
    const onChange = vi.fn();
    render(<Pagination isDisabled page={2} totalPages={5} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'หน้า 3' }));
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('Pagination · การคำนวณจำนวนหน้า', () => {
  it('totalItems + pageSize → จำนวนหน้า (ปัดขึ้น)', () => {
    render(<Pagination page={1} totalItems={41} pageSize={20} onChange={() => {}} />);
    /* 41 / 20 = 2.05 → 3 หน้า */
    expect(screen.getByRole('button', { name: 'หน้า 3' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'หน้า 4' })).toBeNull();
  });

  it('totalItems มีผลเหนือ totalPages เมื่อส่งมาทั้งคู่', () => {
    render(
      <Pagination page={1} totalItems={40} pageSize={20} totalPages={99} onChange={() => {}} />,
    );
    expect(screen.queryByRole('button', { name: 'หน้า 3' })).toBeNull();
  });

  it('★ hasMore (cursor) → บังคับเป็น none เพราะวาดเลขหน้าไม่ได้', () => {
    render(<Pagination page={2} hasMore onChange={() => {}} variant="pages" />);
    /* ไม่รู้ยอดรวม จึงไม่มีปุ่มเลขหน้าให้วาด */
    expect(screen.queryByRole('button', { name: /^หน้า \d/ })).toBeNull();
    expect(screen.getByRole('button', { name: 'หน้าถัดไป' }).hasAttribute('disabled')).toBe(false);
  });

  it('hasMore={false} → ปุ่มถัดไปถูก disable', () => {
    render(<Pagination page={3} hasMore={false} onChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'หน้าถัดไป' }).hasAttribute('disabled')).toBe(true);
  });

  it('variant="count" แสดงช่วงรายการ ไม่ใช่เลขหน้า', () => {
    render(<Pagination page={2} totalItems={240} pageSize={20} variant="count" onChange={() => {}} />);
    expect(screen.getByText('21–40 จาก 240 รายการ')).toBeTruthy();
  });

  it('variant="count" หน้าสุดท้ายไม่เกินยอดรวม', () => {
    render(<Pagination page={3} totalItems={41} pageSize={20} variant="count" onChange={() => {}} />);
    expect(screen.getByText('41–41 จาก 41 รายการ')).toBeTruthy();
  });

  it('variant="compact" แสดง "หน้า X จาก Y"', () => {
    render(<Pagination page={2} totalPages={12} variant="compact" onChange={() => {}} />);
    expect(screen.getByText('หน้า 2 จาก 12')).toBeTruthy();
  });
});

describe('Pagination · เป้ากด (SC 2.5.8 · D1)', () => {
  it('★★★ ทุกขนาดมีพื้นเป้ากด ≥ 24px และใช้ min-h ไม่ใช่ h', () => {
    const expected = { sm: 'min-h-9', md: 'min-h-11', lg: 'min-h-12' } as const;

    for (const [size, cls] of Object.entries(expected)) {
      const { unmount } = render(
        <Pagination
          page={1}
          totalPages={3}
          size={size as keyof typeof expected}
          onChange={() => {}}
        />,
      );
      const btn = screen.getByRole('button', { name: 'หน้า 2' });
      /* min-h เป็น**พื้น** ไม่ใช่ความสูงตายตัว — ข้อความยังโตได้ (SC 1.4.12)
         `h-11` จะตัดข้อความทิ้งเมื่อผู้ใช้ขยายตัวอักษร */
      expect(btn.className, size).toContain(cls);
      expect(btn.className, size).not.toMatch(/(?<![\w-])h-\d/);
      unmount();
    }
  });

  it('หน้าปัจจุบันไม่ใช้พื้นทึบน้ำเงิน — สงวนให้ CTA (ข้อ 05)', () => {
    render(<Pagination page={2} totalPages={5} onChange={() => {}} />);
    const cls = screen.getByRole('button', { name: 'หน้า 2 หน้าปัจจุบัน' }).className;
    expect(cls).toContain('bg-selected-surface');
    expect(cls).not.toContain('bg-primary-600');
  });
});
