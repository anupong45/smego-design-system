import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, expectNoViolations } from './render';
import { Main, TopNav, Button } from '../../src/index';

/* ═══════════════════════════════════════════════════════════════════════════
   ลิงก์ข้ามไปเนื้อหา + เป้าของมัน (SC 2.4.1)
   ───────────────────────────────────────────────────────────────────────────
   ★★★ ชุดนี้ทดสอบ **ความเข้าคู่กันของสองชิ้น** ไม่ใช่ชิ้นใดชิ้นเดียว

   `TopNav` render ลิงก์ชี้ไป `#main` · `Main` เป็นตัวประกาศ `id="main"`
   ก่อนหน้านี้มีแต่ชิ้นแรก และเป้าถูกผลักเป็นภาระของแอป ("จัดการที่ชั้น 05")
   ซึ่งเป็นชั้นที่คำตัดสิน 2026-07-29 บอกว่า **ไม่ทำ**

   ความพังแบบเดิม **มองไม่เห็นเลย**: ลิงก์ซ่อนอยู่จนกว่าจะโฟกัส หน้าดูปกติ
   ทุกอย่าง แต่กด Enter แล้วไม่มีอะไรเกิดขึ้น
   ═══════════════════════════════════════════════════════════════════════════ */

describe('Main · เป้าของลิงก์ข้าม', () => {
  it('ไม่มี axe violation', async () => {
    const { container } = render(<Main><p>เนื้อหา</p></Main>);
    const results = await expectNoViolations(container);
    expect(results.violations).toEqual([]);
  });

  it('เป็น landmark main ที่มี id', () => {
    render(<Main><p>เนื้อหา</p></Main>);
    const main = screen.getByRole('main');
    expect(main.id).toBe('main');
  });

  it('★★ มี tabIndex={-1} — ไม่มีบรรทัดนี้โฟกัสจะไม่ย้ายลงมา', () => {
    render(<Main><p>เนื้อหา</p></Main>);
    /* ★★ `<main>` ไม่ใช่ element ที่โฟกัสได้เอง · เบราว์เซอร์บางตัวเลื่อนหน้า
       ไปที่ fragment แต่ไม่ย้ายโฟกัส ทำให้ Tab ครั้งถัดไปวนกลับไปที่ลิงก์ข้าม */
    expect(screen.getByRole('main').getAttribute('tabindex')).toBe('-1');
  });

  it('★ tabIndex -1 ไม่เพิ่ม tab stop', async () => {
    const user = userEvent.setup();
    render(
      <Main>
        <Button>ปุ่มแรกในเนื้อหา</Button>
      </Main>,
    );
    await user.tab();
    /* Tab ครั้งแรกต้องไปที่ปุ่ม ไม่ใช่ที่ <main> */
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: 'ปุ่มแรกในเนื้อหา' }),
    );
  });

  it('รับ id เองได้ เมื่อหน้าต้องใช้ค่าอื่น', () => {
    render(<Main id="page-content"><p>เนื้อหา</p></Main>);
    expect(screen.getByRole('main').id).toBe('page-content');
  });
});

describe('TopNav + Main · สองชิ้นต้องเข้าคู่กัน', () => {
  it('★★★ ลิงก์ข้ามชี้ไปเป้าที่มีจริงในหน้า', () => {
    render(
      <>
        <TopNav homeHref="#" signInHref="#" />
        <Main>
          <Button>ปุ่มแรกในเนื้อหา</Button>
        </Main>
      </>,
    );

    /* ลิงก์ข้ามเป็นชิ้นแรกใน DOM ตาม SC 2.4.1 */
    const skip = document.querySelector('a[href^="#"]') as HTMLAnchorElement;
    expect(skip, 'TopNav ต้อง render ลิงก์ข้าม').toBeTruthy();

    const target = skip.getAttribute('href')!.slice(1);
    /* ★★★ นี่คือข้อที่เคยพังเงียบ ๆ — ลิงก์มี แต่เป้าไม่มี */
    expect(
      document.getElementById(target),
      `ลิงก์ข้ามชี้ไป #${target} แต่ไม่มี element นั้นในหน้า — ลิงก์ตาย`,
    ).toBeTruthy();
    expect(document.getElementById(target)).toBe(screen.getByRole('main'));
  });

  it('★★ ค่าเริ่มต้นของทั้งสองตัวเข้าคู่กันเองโดยไม่ต้องตั้งอะไร', () => {
    render(
      <>
        <TopNav homeHref="#" signInHref="#" />
        <Main><p>เนื้อหา</p></Main>
      </>,
    );
    const skip = document.querySelector('a[href^="#"]') as HTMLAnchorElement;
    /* ถ้าค่าเริ่มต้นสองฝั่งหลุดจากกัน จะไม่มีใครรู้จนกว่าจะมีคนกด Tab จริง */
    expect(skip.getAttribute('href')).toBe('#main');
    expect(screen.getByRole('main').id).toBe('main');
  });

  it('mainId ที่ตั้งเองต้องตั้งให้ตรงทั้งสองฝั่ง', () => {
    render(
      <>
        <TopNav homeHref="#" signInHref="#" mainId="page-content" />
        <Main id="page-content"><p>เนื้อหา</p></Main>
      </>,
    );
    const skip = document.querySelector('a[href^="#"]') as HTMLAnchorElement;
    expect(document.getElementById(skip.getAttribute('href')!.slice(1))).toBeTruthy();
  });

  it('★ main สองอันในหน้าเดียว = axe ฟ้อง', async () => {
    /* บันทึกไว้เป็นกฎ ไม่ใช่ให้คนมาค้นพบเองตอน axe แดง
       (เคสเดียวกับ Pagination/BottomNav ที่ชื่อ landmark ซ้ำ) */
    const { container } = render(
      <>
        <Main><p>หนึ่ง</p></Main>
        <Main id="two"><p>สอง</p></Main>
      </>,
    );
    const results = await expectNoViolations(container);
    /* ★ ชื่อกฎจริงคือ `landmark-no-duplicate-main` ไม่ใช่ `landmark-one-main`
       ที่เดาไว้ตอนแรก — ยืนยันกับผลของ axe จริงแล้ว */
    expect(results.violations.map((v) => v.id)).toContain('landmark-no-duplicate-main');
  });
});
