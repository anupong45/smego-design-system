import { describe, it, expect, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import { render, expectNoViolations } from './render';
import { BottomNav, type BottomNavItem } from '../../src/index';

/* ═══════════════════════════════════════════════════════════════════════════
   BottomNav
   ───────────────────────────────────────────────────────────────────────────
   จุดที่ต้องล็อกไว้ทั้งหมดมาจากบั๊กจริงที่ระบบนี้เคยเจอ ไม่ใช่เช็กลิสต์ทั่วไป
   ═══════════════════════════════════════════════════════════════════════════ */

const ITEMS: [BottomNavItem, BottomNavItem, BottomNavItem, BottomNavItem] = [
  { label: 'หน้าแรก', icon: 'layout-grid', href: '/', isCurrent: true },
  { label: 'ค้นหา', icon: 'search', href: '/search' },
  { label: 'ตะกร้า', icon: 'shopping-cart', href: '/cart', count: 3 },
  { label: 'รายการโปรด', icon: 'heart', href: '/wishlist' },
];

afterEach(() => {
  document.documentElement.style.removeProperty('--bottom-nav-height');
  document.documentElement.style.removeProperty('--compare-bar-height');
});

describe('BottomNav · โครงสร้างและ a11y', () => {
  it('ไม่มี axe violation', async () => {
    const { container } = render(<BottomNav items={ITEMS} />);
    const results = await expectNoViolations(container);
    expect(results.violations).toEqual([]);
  });

  it('เป็น landmark นำทางที่มีชื่อ', () => {
    render(<BottomNav items={ITEMS} />);
    expect(screen.getByRole('navigation', { name: 'เมนูหลัก' })).toBeTruthy();
  });

  it('★ หน้าปัจจุบันใช้ aria-current="page" ไม่ใช่ aria-selected', () => {
    render(<BottomNav items={ITEMS} />);
    const home = screen.getByRole('link', { name: 'หน้าแรก' });
    expect(home.getAttribute('aria-current')).toBe('page');
    /* นี่คือลิงก์ ไม่ใช่ tab — aria-selected จะทำให้ SR ประกาศบทบาทผิด */
    expect(home.getAttribute('aria-selected')).toBeNull();

    const search = screen.getByRole('link', { name: 'ค้นหา' });
    expect(search.getAttribute('aria-current')).toBeNull();
  });

  it('★★ จำนวนมีหน่วยในชื่อ accessible — ไม่ใช่ตัวเลขลอย (SC 2.4.4)', () => {
    render(<BottomNav items={ITEMS} />);
    /* "ตะกร้า 3" ไม่บอกว่า 3 อะไร — หลักเดียวกับ TopNav และ RemovableChip */
    expect(screen.getByRole('link', { name: 'ตะกร้า 3 รายการ' })).toBeTruthy();
  });

  it('★ ตัวเลขที่เห็นด้วยตาเป็น aria-hidden — ไม่ให้อ่านซ้ำ', () => {
    render(<BottomNav items={ITEMS} />);
    const badge = screen.getByText('3');
    expect(badge.getAttribute('aria-hidden')).toBe('true');
  });

  it('count = 0 ไม่แสดงตัวเลข แต่ชื่อยังบอกจำนวน', () => {
    render(
      <BottomNav
        items={[{ label: 'ตะกร้า', icon: 'shopping-cart', href: '/cart', count: 0 }]}
      />,
    );
    expect(screen.queryByText('0')).toBeNull();
    expect(screen.getByRole('link', { name: 'ตะกร้า 0 รายการ' })).toBeTruthy();
  });

  it('จำนวนเกิน 99 ตัดเป็น 99+ ที่ตา แต่ชื่อยังเป็นเลขจริง', () => {
    render(
      <BottomNav
        items={[{ label: 'ตะกร้า', icon: 'shopping-cart', href: '/cart', count: 128 }]}
      />,
    );
    expect(screen.getByText('99+')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'ตะกร้า 128 รายการ' })).toBeTruthy();
  });

  it('★★ หน้าปัจจุบันมีตัวชี้ที่ไม่ใช่สี (SC 1.4.1)', () => {
    const { container } = render(<BottomNav items={ITEMS} />);
    const current = screen.getByRole('link', { name: 'หน้าแรก' });
    /* ขีดบนขอบ — ถ้าหายไป ผู้ใช้ตาบอดสีจะแยกหน้าปัจจุบันไม่ออก */
    const bar = current.querySelector('[aria-hidden="true"].bg-primary-600');
    expect(bar, 'หน้าปัจจุบันต้องมีขีดบอก ไม่ใช่พึ่งสีข้อความเดียว').toBeTruthy();
    expect(container).toBeDefined();
  });

  it('ป้ายทุกตัวเห็นด้วยตา — ไม่เหลือแต่ไอคอน', () => {
    render(<BottomNav items={ITEMS} />);
    for (const item of ITEMS) {
      const el = screen.getByText(item.label);
      expect(el.className).not.toContain('sr-only');
    }
  });
});

describe('BottomNav · การจองพื้นที่ก้นจอ (SC 2.4.11)', () => {
  it('★★★ ประกาศ --bottom-nav-height ของตัวเองเท่านั้น', () => {
    const root = document.documentElement;
    /* จำลองว่ามี CompareBar อยู่บนจอด้วย */
    root.style.setProperty('--compare-bar-height', '77px');

    render(<BottomNav items={ITEMS} />);

    /* ★★★ นี่คือบั๊กที่ CompareBar เคยเป็น: เขียนทับตัวแปรของแถบอื่น
       แล้ว last-writer-wins ทำให้จองพื้นที่แค่แถบเดียว → ปุ่มท้ายหน้าจม
       ใต้แถบ · มองไม่เห็นเลยจนกว่าจะมีสองแถบพร้อมกัน (Compare.md §5) */
    expect(root.style.getPropertyValue('--compare-bar-height')).toBe('77px');
    expect(root.style.getPropertyValue('--bottom-nav-height')).not.toBe('');
  });

  it('ถอด component แล้วคืนเป็น 0px ไม่ใช่ลบ property', () => {
    const root = document.documentElement;
    const { unmount } = render(<BottomNav items={ITEMS} />);
    unmount();
    /* ★ ต้องเป็น '0px' — ถ้า removeProperty ทิ้ง `calc()` ใน --bottom-inset
       จะคำนวณไม่ได้ทั้งก้อน แล้วพื้นที่จองของแถบอื่นหายไปด้วย */
    expect(root.style.getPropertyValue('--bottom-nav-height')).toBe('0px');
  });

  it('reserveSpace={false} ไม่ประกาศอะไรเลย', () => {
    const root = document.documentElement;
    render(<BottomNav items={ITEMS} reserveSpace={false} />);
    expect(root.style.getPropertyValue('--bottom-nav-height')).toBe('');
  });

  it('ไม่แตะ body.style — linter ห้ามไว้ และเทสต์ยืนยัน', () => {
    render(<BottomNav items={ITEMS} />);
    expect(document.body.style.paddingBottom).toBe('');
  });
});

describe('BottomNav · ชื่อ landmark ต้องต่างกันเมื่อมีหลาย nav', () => {
  it('รับ label ทับได้ — จำเป็นเมื่อหน้ามี nav อื่นอยู่แล้ว', () => {
    render(<BottomNav items={ITEMS} label="เมนูหลักบนมือถือ" />);
    expect(screen.getByRole('navigation', { name: 'เมนูหลักบนมือถือ' })).toBeTruthy();
  });

  it('★ สอง nav ชื่อซ้ำ = axe ฟ้อง landmark-unique', async () => {
    /* เคสเดียวกับ Pagination บน+ล่างในหน้าเดียว — บันทึกไว้เป็นกฎ
       ไม่ใช่ให้คนมาค้นพบเองตอน axe แดง */
    const { container } = render(
      <>
        <BottomNav items={ITEMS} />
        <BottomNav items={ITEMS} />
      </>,
    );
    const results = await expectNoViolations(container);
    expect(results.violations.map((v) => v.id)).toContain('landmark-unique');
  });
});
