import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { CalendarDate } from '@internationalized/date';
import { render } from './render';

import {
  TextInput, TextArea, Selector, Typeahead,
  NumberInput, DateInput, FileInput, Slider,
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
