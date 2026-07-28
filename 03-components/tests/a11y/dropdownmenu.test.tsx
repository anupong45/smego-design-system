import { describe, it, expect } from 'vitest';
import { screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, expectNoViolations } from './render';
import {
  Button,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSection,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../src/index';

/* ═══════════════════════════════════════════════════════════════════════════
   DropdownMenu
   ───────────────────────────────────────────────────────────────────────────
   ★ เมนูอยู่ใน portal — ต้องค้นจาก `document.body` ไม่ใช่ `container`
   ═══════════════════════════════════════════════════════════════════════════ */

function Fixture({ open = true }: { open?: boolean } = {}) {
  return (
    <DropdownMenuTrigger defaultOpen={open}>
      <Button variant="secondary">จัดการรายการ</Button>
      <DropdownMenu>
        <DropdownMenuSection title="แก้ไข">
          <DropdownMenuItem label="แก้ไขรายละเอียดสินค้า" icon="file-text" />
          <DropdownMenuItem
            label="ทำสำเนา"
            description="สร้างรายการใหม่จากรายการนี้"
          />
        </DropdownMenuSection>
        <DropdownMenuSeparator />
        <DropdownMenuItem label="ยกเลิกการเผยแพร่" isDisabled />
        <DropdownMenuItem label="ลบรายการถาวร" isDestructive />
      </DropdownMenu>
    </DropdownMenuTrigger>
  );
}

describe('DropdownMenu · โครงสร้างและ a11y', () => {
  it('ไม่มี axe violation เมื่อเปิดอยู่', async () => {
    render(<Fixture />);
    await screen.findByRole('menu');
    /* เมนู render ใน portal — ตรวจทั้ง body */
    const results = await expectNoViolations(document.body);
    expect(results.violations).toEqual([]);
  });

  it('★★★ ชื่อเมนูมาจาก **ปุ่ม** ไม่ใช่จาก aria-label ที่ส่งเข้ามา', async () => {
    render(<Fixture />);
    /* ★★★ RAC ตั้งทั้ง `aria-label` และ `aria-labelledby` (ชี้ไปปุ่ม) แล้ว
       `aria-labelledby` ชนะตามลำดับความสำคัญของ ARIA · `aria-label` ที่
       ผู้เรียกส่งมาจึงถูกทิ้งเงียบ ๆ — วัดแล้วก่อนแก้: ส่ง "คำสั่งสำหรับ
       รายการนี้" แต่ได้ชื่อจริงเป็น "จัดการรายการ"

       จึงถอด `aria-label`/`aria-labelledby` ออกจาก type ไปเลย เพื่อให้
       ผู้เรียกตั้งชื่อผิดที่ไม่ได้ · เทสนี้ล็อกพฤติกรรมที่เหลืออยู่ */
    const menu = await screen.findByRole('menu', { name: 'จัดการรายการ' });
    const items = within(menu).getAllByRole('menuitem');
    expect(items.length).toBe(4);
  });

  it('★ หมวดมีชื่อประกาศจริง — ไม่ใช่กลุ่มเปล่า', async () => {
    render(<Fixture />);
    const menu = await screen.findByRole('menu');
    const group = within(menu).getByRole('group', { name: 'แก้ไข' });
    expect(group).toBeTruthy();
  });

  it('★★ คำสั่งอันตรายมีไอคอนโดยปริยาย ไม่ใช่สีเดียว (SC 1.4.1)', async () => {
    render(<Fixture />);
    const menu = await screen.findByRole('menu');
    const del = within(menu).getByRole('menuitem', { name: /ลบรายการถาวร/ });
    /* ★ ถ้าไอคอนหาย เหลือแต่สีแดง ผู้ใช้ตาบอดสีแยกไม่ออกว่าอันไหนลบถาวร */
    expect(
      del.querySelector('svg'),
      'isDestructive ต้องให้ไอคอนมาด้วย ไม่ใช่แค่สี',
    ).toBeTruthy();
  });

  it('isDisabled ประกาศจริง ไม่ใช่แค่จางลง', async () => {
    render(<Fixture />);
    const menu = await screen.findByRole('menu');
    const item = within(menu).getByRole('menuitem', { name: /ยกเลิกการเผยแพร่/ });
    expect(item.getAttribute('aria-disabled')).toBe('true');
  });

  it('★ description อยู่ในชื่อ accessible ของคำสั่ง', async () => {
    render(<Fixture />);
    const menu = await screen.findByRole('menu');
    /* คำสั่งเป็นปุ่มลอย ๆ ไม่มี describedby — คำอธิบายจึงต้องอ่านได้
       ผ่านชื่อ มิฉะนั้นผู้ใช้ screen reader จะไม่ได้ยินเลย */
    expect(
      within(menu).getByRole('menuitem', { name: /ทำสำเนา.*สร้างรายการใหม่/ }),
    ).toBeTruthy();
  });
});

describe('DropdownMenu · คีย์บอร์ด', () => {
  it('★★ ลูกศรลงเลื่อนโฟกัส และข้ามรายการที่ปิดใช้งาน', async () => {
    const user = userEvent.setup();
    render(<Fixture />);
    const menu = await screen.findByRole('menu');

    await user.keyboard('{ArrowDown}');
    const items = within(menu).getAllByRole('menuitem');
    expect(items[0]!.getAttribute('data-focused')).toBe('true');

    await user.keyboard('{ArrowDown}{ArrowDown}');
    /* ตัวที่ 3 ปิดใช้งาน — RAC ต้องข้ามไปตัวที่ 4 */
    expect(items[2]!.getAttribute('data-focused')).toBeNull();
    expect(items[3]!.getAttribute('data-focused')).toBe('true');
  });

  it('★ พิมพ์เพื่อค้นหา (typeahead) ใช้ได้ — ต้องมี textValue', async () => {
    const user = userEvent.setup();
    render(<Fixture />);
    const menu = await screen.findByRole('menu');

    /* ★ ถ้าไม่ส่ง `textValue` RAC จะอ่านจาก children ที่เป็น element
       แล้วได้ค่าว่าง ทำให้พิมพ์หาไม่เจอ — เทสนี้ล็อกไว้ */
    await user.keyboard('ลบ');
    const del = within(menu).getByRole('menuitem', { name: /ลบรายการถาวร/ });
    expect(del.getAttribute('data-focused')).toBe('true');
  });

  it('Escape ปิดเมนูและคืนโฟกัสไปที่ปุ่ม', async () => {
    const user = userEvent.setup();
    /* ★★ ต้องเปิดด้วยการ **กดปุ่มจริง** ไม่ใช่ `defaultOpen`

       ฉบับแรกของเทสนี้ใช้ `<Fixture />` ที่เปิดด้วย `defaultOpen` แล้ว fail
       เพราะโฟกัสไปอยู่ที่ `<body>` — ซึ่ง **ถูกต้อง**: โฟกัสไม่เคยอยู่ที่ปุ่ม
       ตั้งแต่แรก RAC จึงไม่มีอะไรให้คืน · ความผิดอยู่ที่สมมติฐานของเทส
       ไม่ใช่ที่ component (เคสเดียวกับเทส landmark ที่เคยเขียนไม่สมจริง) */
    render(<Fixture open={false} />);
    await user.click(screen.getByRole('button', { name: 'จัดการรายการ' }));
    await screen.findByRole('menu');

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).toBeNull();

    /* ★★ การคืนโฟกัสเกิด **หนึ่ง tick หลัง** Escape ไม่ใช่ทันที
       วัดแล้ว: ทันทีหลัง Escape → `<body>` · หลังรอหนึ่งรอบ → ปุ่ม
       ฉบับแรกของเทสนี้ assert แบบ sync แล้ว fail — ความผิดอยู่ที่เทส
       ไม่ใช่ที่ component (jest-dom ไม่ได้โหลด จึงเทียบ activeElement ตรง ๆ) */
    await waitFor(() =>
      expect(document.activeElement).toBe(
        screen.getByRole('button', { name: 'จัดการรายการ' }),
      ),
    );
  });
});

describe('DropdownMenu · การกด', () => {
  it('กดคำสั่งแล้วเรียก onAction และปิดเมนู', async () => {
    const user = userEvent.setup();
    let fired = '';
    render(
      <DropdownMenuTrigger defaultOpen>
        <Button variant="secondary">จัดการ</Button>
        <DropdownMenu onAction={(k) => (fired = String(k))}>
          <DropdownMenuItem id="dup" label="ทำสำเนา" />
          <DropdownMenuItem id="del" label="ลบถาวร" isDestructive />
        </DropdownMenu>
      </DropdownMenuTrigger>,
    );

    const menu = await screen.findByRole('menu');
    await user.click(within(menu).getByRole('menuitem', { name: 'ทำสำเนา' }));

    expect(fired).toBe('dup');
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('กดรายการที่ปิดใช้งานแล้วไม่เกิดอะไร', async () => {
    const user = userEvent.setup();
    let fired = false;
    render(
      <DropdownMenuTrigger defaultOpen>
        <Button variant="secondary">จัดการ</Button>
        <DropdownMenu onAction={() => (fired = true)}>
          <DropdownMenuItem id="x" label="ยกเลิกการเผยแพร่" isDisabled />
        </DropdownMenu>
      </DropdownMenuTrigger>,
    );

    const menu = await screen.findByRole('menu');
    await user.click(within(menu).getByRole('menuitem'));
    expect(fired).toBe(false);
    /* เมนูต้องยังเปิดอยู่ — ปิดไปจะทำให้ผู้ใช้คิดว่าคำสั่งทำงานแล้ว */
    expect(screen.getByRole('menu')).toBeTruthy();
  });
});

describe('DropdownMenu · ข้อความไทยยาว', () => {
  it('★ ป้ายคำสั่งไม่ถูก truncate', async () => {
    render(
      <DropdownMenuTrigger defaultOpen>
        <Button variant="secondary">จัดการ</Button>
        <DropdownMenu>
          <DropdownMenuItem label="ยกเลิกคำสั่งซื้อและขอคืนเงินเต็มจำนวน" />
        </DropdownMenu>
      </DropdownMenuTrigger>,
    );
    const menu = await screen.findByRole('menu');
    const label = within(menu).getByText('ยกเลิกคำสั่งซื้อและขอคืนเงินเต็มจำนวน');
    /* ★ ตัดแล้วอ่านไม่ออกว่าจะเกิดอะไร ซึ่งอันตรายกว่าเมนูสูงขึ้นสองบรรทัด
       ต่างจาก BottomNav ที่ตัดได้เพราะมีไอคอนกำกับและป้ายสั้น */
    expect(label.className).not.toContain('truncate');
  });
});
