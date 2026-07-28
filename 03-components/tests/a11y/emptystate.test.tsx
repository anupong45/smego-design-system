import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render, expectNoViolations } from './render';
import { EmptyState, Button, Icon, CartList, WishlistGrid, SearchResult } from '../../src/index';

/* ═══════════════════════════════════════════════════════════════════════════
   เฟส 5 · EmptyState
   ───────────────────────────────────────────────────────────────────────────
   ข้อที่ผิดง่ายและเงียบ: live region ที่ประกาศซ้ำกับข้อความจำนวนด้านบน ·
   หัวข้อที่ฉีดเข้าไปปนโครง heading ของหน้า
   เทสท้ายไฟล์ล็อกว่า **การ refactor 3 call site ไม่เปลี่ยนพฤติกรรม**
   ═══════════════════════════════════════════════════════════════════════════ */

describe('EmptyState', () => {
  it('ไม่มี axe violation', async () => {
    const { container } = render(
      <EmptyState
        icon={<Icon name="search" size={32} />}
        title="ไม่พบรายการที่ตรงกับการค้นหา"
        description="ลองใช้คำค้นที่สั้นลง หรือลดจำนวนตัวกรอง"
        actions={<Button variant="secondary">ล้างตัวกรอง</Button>}
      />,
    );
    const results = await expectNoViolations(container);
    expect(results.violations).toEqual([]);
  });

  /* ── ★★★ live region เป็น opt-in ─────────────────────────────────────────── */

  it('★★★ ไม่มี role โดยค่าเริ่มต้น — กันประกาศซ้ำกับข้อความจำนวนด้านบน', () => {
    render(<EmptyState title="ไม่พบรายการ" />);
    /* Astryx ตั้ง role="status" ตายตัว · เราทำไม่ได้เพราะ SearchResult
       มี live region ของตัวเองอยู่แล้ว (D26) */
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('isLive ทำให้เป็น role="status" เมื่อผู้เรียกยืนยันว่าไม่มีใครประกาศแทน', () => {
    render(<EmptyState isLive title="ตะกร้าว่างแล้ว" />);
    expect(screen.getByRole('status')).toBeTruthy();
  });

  /* ── หัวข้อ ───────────────────────────────────────────────────────────── */

  it('★★ title ไม่เป็นหัวข้อโดยค่าเริ่มต้น — ไม่ปนโครง heading ของหน้า', () => {
    render(<EmptyState title="ยังไม่มีรายการที่บันทึกไว้" />);
    /* ต่างจาก Astryx ที่ตั้ง headingLevel: 3 ให้ (D26) */
    expect(screen.queryByRole('heading')).toBeNull();
    expect(screen.getByText('ยังไม่มีรายการที่บันทึกไว้').tagName).toBe('P');
  });

  it('headingLevel ทำให้เป็นหัวข้อได้เมื่อจำเป็น', () => {
    render(<EmptyState headingLevel={2} title="ยังไม่มีคำสั่งซื้อ" />);
    expect(screen.getByRole('heading', { level: 2, name: 'ยังไม่มีคำสั่งซื้อ' })).toBeTruthy();
  });

  /* ── เนื้อหา ───────────────────────────────────────────────────────────── */

  it('ไอคอนเป็นของตกแต่ง — Icon ใส่ aria-hidden ให้เองเมื่อไม่มี label', () => {
    const { container } = render(
      <EmptyState icon={<Icon name="heart" size={32} />} title="ว่าง" />,
    );
    expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('description จำกัดความกว้าง — บรรทัดยาวเต็มจอกว้างอ่านยาก', () => {
    render(<EmptyState title="ว่าง" description="กดปุ่มบันทึกบนรายการที่สนใจ" />);
    expect(screen.getByText('กดปุ่มบันทึกบนรายการที่สนใจ').className).toContain(
      'max-w-(--container-form)',
    );
  });

  it('ไม่ส่ง description / actions แล้วไม่ render กล่องเปล่าค้างไว้', () => {
    const { container } = render(<EmptyState title="ว่าง" />);
    expect(container.querySelectorAll('p')).toHaveLength(1);
  });

  it('isCompact ลดระยะสำหรับพื้นที่แคบ', () => {
    const { container: normal } = render(<EmptyState title="ว่าง" />);
    const { container: compact } = render(<EmptyState isCompact title="ว่าง" />);
    expect((normal.firstElementChild as HTMLElement).className).toContain('py-12');
    expect((compact.firstElementChild as HTMLElement).className).toContain('py-6');
  });
});

/* ═══════════════════════════════════════════════════════════════════════════
   การ refactor 3 call site ต้องไม่เปลี่ยนพฤติกรรม
   ───────────────────────────────────────────────────────────────────────────
   ข้อความไทยและการตัดสินใจเรื่อง live region ต้องเหมือนเดิมเป๊ะ
   ═══════════════════════════════════════════════════════════════════════════ */

describe('EmptyState · call site ที่ refactor แล้ว', () => {
  it('CartList ว่าง — ข้อความและปุ่มทางออกยังอยู่', () => {
    render(
      <CartList
        itemCount={0}
        sellerCount={0}
        emptyAction={<Button variant="secondary">ดูสินค้าทั้งหมด</Button>}
      >
        <div />
      </CartList>,
    );
    expect(screen.getByText('ยังไม่มีสินค้าในตะกร้า')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'ดูสินค้าทั้งหมด' })).toBeTruthy();
  });

  it('WishlistGrid ว่าง — ข้อความบอกวิธียังอยู่', () => {
    render(
      <WishlistGrid count={0}>
        <div />
      </WishlistGrid>,
    );
    expect(screen.getByText('ยังไม่มีรายการที่บันทึกไว้')).toBeTruthy();
    expect(
      screen.getByText('กดปุ่มบันทึกบนรายการที่สนใจ เพื่อกลับมาดูภายหลัง'),
    ).toBeTruthy();
  });

  it('★★★ SearchResult ว่าง — ต้อง**ไม่**เป็น live region (จำนวนด้านบนประกาศแล้ว)', () => {
    const { container } = render(
      <SearchResult count={0} query="เครื่องคั่วกาแฟ">
        <div />
      </SearchResult>,
    );
    expect(screen.getByText('ไม่พบรายการที่ตรงกับการค้นหา')).toBeTruthy();

    /* ★ live region เดียวในหน้านี้ต้องเป็นของ "จำนวนผลลัพธ์" ไม่ใช่ของ EmptyState
       ถ้า EmptyState ได้ role="status" มาด้วย ผู้ใช้จะได้ยินสองรอบ */
    const statuses = container.querySelectorAll('[role="status"]');
    for (const el of statuses) {
      expect(el.textContent).not.toContain('ไม่พบรายการที่ตรงกับการค้นหา');
    }
  });

  it('CartList / WishlistGrid / SearchResult ว่างพร้อมกัน ไม่มี axe violation', async () => {
    const { container } = render(
      <>
        <CartList itemCount={0} sellerCount={0}>
          <div />
        </CartList>
        <WishlistGrid count={0}>
          <div />
        </WishlistGrid>
        <SearchResult count={0} query="ทดสอบ">
          <div />
        </SearchResult>
      </>,
    );
    const results = await expectNoViolations(container);
    expect(results.violations).toEqual([]);
  });
});
