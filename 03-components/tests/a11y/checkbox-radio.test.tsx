import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render, expectNoViolations } from './render';

import { CheckboxInput, CheckboxList, Radio, RadioList } from '../../src/index';

/* ═══════════════════════════════════════════════════════════════════════════
   props ที่รับมาจาก Astryx — `status` `isOptional` `isLabelHidden`
   ดู ASTRYX-PARITY.md §4 (Checkbox→CheckboxInput · RadioGroup→RadioList)
   ───────────────────────────────────────────────────────────────────────────
   ★ ทั้งสองตัวเคยใช้ `errorMessage` / `showOptional` ซึ่งเป็นชื่อเดิมก่อน §8

   📌 ตอนเขียนเทสชุดนี้ (2026-07-28) `CheckboxGroup` **ไม่อยู่ในลิสต์ `same`**
   ของ gate จึงไม่มีอะไรจับได้ถ้าชื่อ prop หลุดกลับ — ตอนนี้มันถูก rename
   เป็น `CheckboxList` (ชื่อของ Astryx คู่กับ `RadioList`) และ**อยู่ใน `same`
   แล้ว** เทสชุดนี้จึงเป็นชั้นที่สองไม่ใช่ชั้นเดียว
   ═══════════════════════════════════════════════════════════════════════════ */

describe('CheckboxInput · status / isOptional', () => {
  it('★ error เท่านั้นที่ตั้ง aria-invalid — warning ยังส่งฟอร์มได้', () => {
    const { unmount } = render(
      <CheckboxInput
        label="ยอมรับเงื่อนไขการใช้งาน"
        status={{ type: 'error', message: 'ต้องยอมรับเงื่อนไขก่อนดำเนินการต่อ' }}
      />,
    );
    expect(screen.getByRole('checkbox').getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByText('ต้องยอมรับเงื่อนไขก่อนดำเนินการต่อ')).toBeTruthy();
    unmount();

    render(
      <CheckboxInput
        label="รับข่าวสารทางอีเมล"
        status={{ type: 'warning', message: 'อีเมลนี้ยังไม่ยืนยัน' }}
      />,
    );
    expect(screen.getByRole('checkbox').getAttribute('aria-invalid')).toBeNull();
    expect(screen.getByText('อีเมลนี้ยังไม่ยืนยัน')).toBeTruthy();
  });

  it('isOptional ต่อท้าย label ด้วยข้อความ ไม่ใช่เครื่องหมาย (SC 1.4.1)', () => {
    render(<CheckboxInput label="รับข่าวสารทางอีเมล" isOptional />);
    /* accessible name ต้องรวมคำว่า "ไม่บังคับ" ไม่ใช่แค่เห็นด้วยตา */
    expect(
      screen.getByRole('checkbox', { name: /รับข่าวสารทางอีเมล.*ไม่บังคับ/ }),
    ).toBeTruthy();
  });
});

describe('CheckboxList · status / isOptional', () => {
  it('★ error ที่กลุ่มทำให้ทั้งกลุ่ม invalid และประกาศข้อความ', async () => {
    const { container } = render(
      <CheckboxList
        label="ใบรับรองที่มี"
        status={{ type: 'error', message: 'เลือกอย่างน้อยหนึ่งรายการ' }}
      >
        <CheckboxInput value="tis" label="มาตรฐานผลิตภัณฑ์อุตสาหกรรม" />
        <CheckboxInput value="halal" label="ฮาลาล" />
      </CheckboxList>,
    );
    const group = screen.getByRole('group', { name: /ใบรับรองที่มี/ });
    /* ★ RAC **ไม่** ใส่ `aria-invalid` ที่ตัวกลุ่ม — ใส่ `data-invalid` ไว้ให้
       CSS แล้ว **ส่ง `aria-invalid` ลงไปที่ checkbox แต่ละตัว** ซึ่งถูกกว่า:
       screen reader ประกาศตอนโฟกัสตัวควบคุม ไม่ใช่ตอนเข้ากลุ่มครั้งเดียว
       (เคยเขียนเทสต์นี้ผิดโดยเดาว่าอยู่ที่กลุ่ม — ตรวจ markup จริงแล้ว) */
    expect(group.getAttribute('data-invalid')).toBe('true');

    const boxes = screen.getAllByRole('checkbox');
    expect(boxes.length).toBe(2);
    for (const box of boxes) {
      expect(box.getAttribute('aria-invalid')).toBe('true');
      /* ข้อความ error ต้องผูกกับทุกตัว ไม่ใช่ลอยอยู่ในหน้า (SC 3.3.1) */
      expect(box.getAttribute('aria-describedby')).toBe(
        screen.getByText('เลือกอย่างน้อยหนึ่งรายการ').id,
      );
    }

    const results = await expectNoViolations(container);
    expect(results.violations).toEqual([]);
  });

  it('isOptional ที่กลุ่มอยู่ในชื่อกลุ่ม', () => {
    render(
      <CheckboxList label="ใบรับรองที่มี" isOptional>
        <CheckboxInput value="tis" label="มอก." />
      </CheckboxList>,
    );
    expect(screen.getByRole('group', { name: /ใบรับรองที่มี.*ไม่บังคับ/ })).toBeTruthy();
  });
});

describe('RadioList · isLabelHidden', () => {
  it('★★ ซ่อนด้วยตาแต่ยังเป็นชื่อของกลุ่ม (SC 4.1.2)', async () => {
    const { container } = render(
      <>
        <h3>วิธีชำระเงิน</h3>
        <RadioList label="วิธีชำระเงิน" isLabelHidden defaultValue="promptpay">
          <Radio value="promptpay">พร้อมเพย์</Radio>
          <Radio value="transfer">โอนผ่านธนาคาร</Radio>
        </RadioList>
      </>,
    );

    /* กลุ่มยังมีชื่อ — ไม่ได้หายไปพร้อมกับการซ่อน */
    const group = screen.getByRole('radiogroup', { name: 'วิธีชำระเงิน' });
    /* ★ label ต้องเป็น sr-only ไม่ใช่ display:none — display:none ตัดออกจาก
       accessibility tree ทำให้ aria-labelledby ชี้ไปที่ว่าง */
    const labelEl = document.getElementById(group.getAttribute('aria-labelledby')!);
    expect(labelEl?.className).toContain('sr-only');

    const results = await expectNoViolations(container);
    expect(results.violations).toEqual([]);
  });

  it('ค่าเริ่มต้นคือไม่ซ่อน', () => {
    render(
      <RadioList label="วิธีชำระเงิน">
        <Radio value="promptpay">พร้อมเพย์</Radio>
      </RadioList>,
    );
    const group = screen.getByRole('radiogroup');
    const labelEl = document.getElementById(group.getAttribute('aria-labelledby')!);
    expect(labelEl?.className).not.toContain('sr-only');
  });
});

describe('CheckboxList · isLabelHidden (เพิ่มทีหลัง 2026-07-29)', () => {
  /* ★★ sweep §8.1 รอบแรกไล่ตาม 13 ตัวที่หัวข้อนั้นระบุ ซึ่ง **ไม่รวมกลุ่ม
     checkbox** จึงได้ `isLabelHidden` บน `RadioList` แต่ไม่ได้บนตัวนี้
     เจอตอน rename เป็น `CheckboxList` แล้ว gate เริ่มเทียบ prop กับ Astryx
     ได้ — ก่อนนั้นมันอยู่นอกสายตาของเกตทั้งหมด (companion ที่คอนฟิกไม่ครอบ) */
  it('★★ ซ่อนด้วยตาแต่ยังเป็นชื่อของกลุ่ม (SC 4.1.2)', () => {
    render(
      <>
        <h3>ใบรับรองที่มี</h3>
        <CheckboxList label="ใบรับรองที่มี" isLabelHidden>
          <CheckboxInput value="tis" label="มอก." />
        </CheckboxList>
      </>,
    );
    const group = screen.getByRole('group', { name: 'ใบรับรองที่มี' });
    const labelEl = document.getElementById(group.getAttribute('aria-labelledby')!);
    expect(labelEl?.className).toContain('sr-only');
  });

  it('ค่าเริ่มต้นคือไม่ซ่อน — เหมือน RadioList', () => {
    render(
      <CheckboxList label="ใบรับรองที่มี">
        <CheckboxInput value="tis" label="มอก." />
      </CheckboxList>,
    );
    const group = screen.getByRole('group');
    const labelEl = document.getElementById(group.getAttribute('aria-labelledby')!);
    expect(labelEl?.className).not.toContain('sr-only');
  });
});
