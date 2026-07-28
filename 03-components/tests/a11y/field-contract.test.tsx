import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { CalendarDate } from '@internationalized/date';
import { render } from './render';

import {
  TextInput, TextArea, Selector, Typeahead,
  NumberInput, DateInput, FileInput, Slider,
  CheckboxInput, Switch, ProgressBar,
} from '../../src/index';

/* ═══════════════════════════════════════════════════════════════════════════
   สัญญา §8.1/§3.1 — input ทุกตัวต้องมี `label` `isLabelHidden` `status`
   `isOptional` มาจาก `LabelledFieldProps` ตัวเดียว
   ───────────────────────────────────────────────────────────────────────────
   ★ ทำไมต้องมีเทสต์ชุดนี้

   §8.1 ถูกติด ✅ ไว้ในเอกสารทั้งที่ทำจริงแค่ **4 จาก 13 ตัว** เพราะแต่ละ
   component ประกาศ prop สี่ตัวนี้เองแยกกัน จึงไม่มีที่ไหนที่วัดได้ว่า
   "ครบ" หรือ "ไม่ครบ" ทั้งก้อน — `isLabelHidden` หายไป 9 ตัวโดยไม่มีอะไรฟ้อง

   ตอนนี้ทุกตัว extend `LabelledFieldProps` จึงลืมไม่ได้ในระดับ **type**
   แต่ type ไม่ได้การันตีว่ามัน **ทำงาน** — prop ที่รับแล้วไม่ทำอะไรแย่กว่า
   การไม่มี prop เพราะผู้เรียกเชื่อว่าซ่อน label แล้ว เทสต์นี้จึงยืนยันผลจริง
   ═══════════════════════════════════════════════════════════════════════════ */

/** [ชื่อ, element ที่ใส่ isLabelHidden, accessible name ที่ต้องยังได้] */
const hidden: [string, React.ReactElement, string][] = [
  ['TextInput', <TextInput label="เลขทะเบียนนิติบุคคล" isLabelHidden />, 'เลขทะเบียนนิติบุคคล'],
  ['TextArea', <TextArea label="รายละเอียดธุรกิจ" isLabelHidden />, 'รายละเอียดธุรกิจ'],
  [
    'Selector',
    <Selector label="จังหวัด" isLabelHidden options={[{ id: 'bkk', label: 'กรุงเทพมหานคร' }]} />,
    'จังหวัด',
  ],
  [
    'Typeahead',
    <Typeahead label="หมวดสินค้า" isLabelHidden options={[{ id: 'food', label: 'อาหาร' }]} />,
    'หมวดสินค้า',
  ],
  ['NumberInput', <NumberInput label="จำนวน" isLabelHidden defaultValue={1} />, 'จำนวน'],
  [
    'DateInput',
    <DateInput label="วันปิดรับสมัคร" isLabelHidden value={new CalendarDate(2026, 7, 28)} onChange={() => {}} />,
    'วันปิดรับสมัคร',
  ],
  ['Slider', <Slider label="ช่วงราคา" isLabelHidden value={[0, 100]} onChange={() => {}} min={0} max={100} />, 'ช่วงราคา'],
];

describe('§8.1 · isLabelHidden ซ่อนด้วยตาแต่ไม่ทิ้ง accessible name', () => {
  it.each(hidden)('%s', (_n, element, name) => {
    render(element);
    /* ★ `Slider` มีสอง element ที่มีข้อความนี้ — ตัว `<Label>` ของกลุ่ม
       และ `<span class="sr-only">` ที่ RAC สร้างให้ช่องกรอกต้นทาง/ปลายทาง
       จึงเจาะที่ป้ายของระบบเราเอง (คลาส `text-label`) ไม่ใช้ getByText เปล่า */
    const matches = screen.getAllByText(name);
    const labelEl =
      matches.find((e) => e.classList.contains('text-label')) ?? matches[0]!;

    /* ★ ต้องเป็น sr-only ไม่ใช่ `display:none` — display:none ตัดออกจาก
       accessibility tree ทำให้ control กลายเป็นไม่มีชื่อ (SC 4.1.2) */
    expect(labelEl.className).toContain('sr-only');
    /* และต้องยังอยู่ในเอกสารจริง ไม่ได้ถูกถอดออก */
    expect(document.body.contains(labelEl)).toBe(true);
  });

  it('FileInput (ไม่ใช่ RAC — ใช้ labelId เอง)', () => {
    render(<FileInput label="อัปโหลดหนังสือรับรอง" isLabelHidden onChange={() => {}} />);
    expect(screen.getByText('อัปโหลดหนังสือรับรอง').className).toContain('sr-only');
  });

  it('ค่าเริ่มต้นคือไม่ซ่อน', () => {
    render(<TextInput label="เลขทะเบียนนิติบุคคล" />);
    expect(screen.getByText('เลขทะเบียนนิติบุคคล').className).not.toContain('sr-only');
  });
});

describe('§3.1 · status / isOptional บนตัวที่เพิ่งรับเข้ามา', () => {
  it('★★ FileInput มี error สองทาง — validation ภายใน + status จากผู้เรียก', () => {
    render(
      <FileInput
        label="อัปโหลดสลิป"
        status={{ type: 'error', message: 'เซิร์ฟเวอร์ปฏิเสธไฟล์นี้' }}
        onChange={() => {}}
      />,
    );
    const msg = screen.getByText('เซิร์ฟเวอร์ปฏิเสธไฟล์นี้');
    expect(msg.getAttribute('role')).toBe('alert');
    /* ★ ข้อความต้องผูกกับ input ไม่ใช่ลอยในหน้า (SC 3.3.1) */
    const input = document.querySelector('input[type=file]')!;
    expect(input.getAttribute('aria-describedby')).toContain(msg.id);
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('FileInput · warning ไม่ตั้ง aria-invalid และไม่ใช้ role=alert', () => {
    render(
      <FileInput
        label="อัปโหลดสลิป"
        status={{ type: 'warning', message: 'ไฟล์ความละเอียดต่ำ อ่านตัวเลขอาจไม่ชัด' }}
        onChange={() => {}}
      />,
    );
    const msg = screen.getByText('ไฟล์ความละเอียดต่ำ อ่านตัวเลขอาจไม่ชัด');
    expect(msg.getAttribute('role')).toBeNull();
    expect(document.querySelector('input[type=file]')!.getAttribute('aria-invalid')).toBeNull();
  });

  it('Slider · isOptional ต่อท้ายด้วยข้อความ ไม่ใช่เครื่องหมาย (SC 1.4.1)', () => {
    render(
      <Slider label="ช่วงราคา" isOptional value={[0, 100]} onChange={() => {}} min={0} max={100} />,
    );
    expect(screen.getByText('(ไม่บังคับ)')).toBeTruthy();
  });
});

/* ═══════════════════════════════════════════════════════════════════════════
   ★★★ accessible name ต้องเป็น **label เท่านั้น**
   ───────────────────────────────────────────────────────────────────────────
   RAC ครอบ input ด้วย `<label>` ทั้งก้อน — ถ้าไม่ชี้ `aria-labelledby` เอง
   เบราว์เซอร์จะคำนวณชื่อจาก**ข้อความทุกอย่างในแถวต่อกัน**

   วัดจริงก่อนแก้ (2026-07-28):
     CheckboxInput → "ยอมรับเงื่อนไขอ่านก่อนติ๊กต้องยอมรับก่อน"
     Switch        → "รับการแจ้งเตือนเมื่อมีคำสั่งซื้อใหม่บันทึกไม่สำเร็จ"

   คำอธิบายและข้อความ error กลายเป็นส่วนหนึ่งของ**ชื่อ** ซึ่งผิดบทบาท
   (SC 4.1.2 คู่กับ SC 3.3.1) และไม่มีเทสต์ไหนจับได้ เพราะเทสต์ที่มีใช้
   regex `/label.*ไม่บังคับ/` ซึ่ง **ผ่านเพราะบั๊กนี้เอง**
   ═══════════════════════════════════════════════════════════════════════════ */

describe('accessible name = label เท่านั้น', () => {
  const nameOf = (el: Element) => {
    const ref = el.getAttribute('aria-labelledby');
    expect(ref).toBeTruthy();
    return document.getElementById(ref!)?.textContent;
  };
  const descOf = (el: Element) =>
    (el.getAttribute('aria-describedby') ?? '')
      .split(' ')
      .filter(Boolean)
      .map((id) => document.getElementById(id)?.textContent)
      .join(' / ');

  it('★★★ CheckboxInput — description/status ไปอยู่ describedby ไม่ใช่ชื่อ', () => {
    render(
      <CheckboxInput
        label="ยอมรับเงื่อนไข"
        description="อ่านก่อนติ๊ก"
        status={{ type: 'error', message: 'ต้องยอมรับก่อน' }}
      />,
    );
    const cb = screen.getByRole('checkbox');
    expect(nameOf(cb)).toBe('ยอมรับเงื่อนไข');
    expect(descOf(cb)).toBe('อ่านก่อนติ๊ก / ต้องยอมรับก่อน');
  });

  it('★★★ Switch — เหมือนกัน', () => {
    render(
      <Switch
        label="รับการแจ้งเตือน"
        description="เมื่อมีคำสั่งซื้อใหม่"
        status={{ type: 'error', message: 'บันทึกไม่สำเร็จ' }}
      />,
    );
    const sw = screen.getByRole('switch');
    expect(nameOf(sw)).toBe('รับการแจ้งเตือน');
    expect(descOf(sw)).toBe('เมื่อมีคำสั่งซื้อใหม่ / บันทึกไม่สำเร็จ');
  });

  it('"(ไม่บังคับ)" อยู่ใน**ชื่อ** โดยเจตนา — เป็นส่วนของสิ่งที่ถาม', () => {
    render(<CheckboxInput label="รับข่าวสาร" isOptional />);
    expect(nameOf(screen.getByRole('checkbox'))).toBe('รับข่าวสาร (ไม่บังคับ)');
  });
});

describe('Switch · labelPosition / labelSpacing แยกกันได้จริง', () => {
  /* ★ `align="end"` เดิมทำสองอย่างพร้อมกัน — ย้ายป้าย **และ** ดันสองฝั่ง
     ผู้เรียกที่อยากได้อย่างเดียวทำไม่ได้ เทสต์นี้ล็อกว่าตอนนี้แยกได้ */
  const rowOf = () => document.querySelector('label')!;

  it('spread ดันสองฝั่งโดยไม่ต้องย้ายป้าย', () => {
    render(<Switch label="แสดงราคารวมภาษี" labelSpacing="spread" />);
    expect(rowOf().className).toContain('justify-between');
  });

  it('ย้ายป้ายไปหน้าแถวโดยไม่ต้องดันสองฝั่ง', () => {
    render(<Switch label="แสดงราคารวมภาษี" labelPosition="start" />);
    const row = rowOf();
    expect(row.className).not.toContain('justify-between');
    /* ป้ายต้องมาก่อนราง — เทียบลำดับใน DOM จริง */
    const label = screen.getByText('แสดงราคารวมภาษี');
    const track = row.querySelector('.rounded-full')!;
    expect(label.compareDocumentPosition(track) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});

describe('ProgressBar · isLabelHidden', () => {
  it('ซ่อนป้ายด้วยตาแต่ยังเป็นชื่อของแถบ', () => {
    render(<ProgressBar label="ความคืบหน้าการยื่นเอกสาร" value={40} isLabelHidden />);
    const bar = screen.getByRole('progressbar', { name: 'ความคืบหน้าการยื่นเอกสาร' });
    const labelEl = document.getElementById(bar.getAttribute('aria-labelledby')!);
    expect(labelEl?.className).toContain('sr-only');
  });
});
