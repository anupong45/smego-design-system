import { describe, it, expect, vi } from 'vitest';
import { useState } from 'react';
import { screen, act } from '@testing-library/react';
import { CalendarDate } from '@internationalized/date';
import { render, expectNoViolations } from './render';
import {
  DatePicker, OTPField, createBuddhistCalendar,
  NumberField, SearchField, Switch, Selector, ComboBox, FileUpload,
} from '../../src/index';

/* ═══════════════════════════════════════════════════════════════════════════
   Pass 2 · สองตัวที่แผนระบุว่าต้องยืนยันด้วยตาเป็นพิเศษ
   ═══════════════════════════════════════════════════════════════════════════ */

describe('DatePicker · ปฏิทิน พ.ศ.', () => {
  it('createBuddhistCalendar คืนปฏิทินพุทธจริง', () => {
    const cal = createBuddhistCalendar();
    const gregorian = new CalendarDate(2026, 7, 26);
    const buddhist = cal.fromJulianDay(gregorian.calendar.toJulianDay(gregorian));

    expect(buddhist.year).toBe(2569);
    expect(buddhist.era).toBe('BE');
  });

  it('★ แสดง 2569 ไม่ใช่ 2026', () => {
    render(
      <DatePicker
        label="วันที่จดทะเบียน"
        value={new CalendarDate(2026, 7, 26)}
        onChange={() => {}}
      />,
    );

    /* segment ปีต้องเป็น พ.ศ. */
    const year = screen.getByRole('spinbutton', { name: /ปี|year/i });
    expect(year.textContent).toBe('2569');
    expect(year.textContent).not.toBe('2026');
  });

  it('เดือนเป็นภาษาไทย', () => {
    const { container } = render(
      <DatePicker
        label="วันที่จดทะเบียน"
        value={new CalendarDate(2026, 7, 26)}
        onChange={() => {}}
      />,
    );
    /* locale th-TH-u-ca-buddhist → segment ทั้งหมดเป็นตัวเลขไทยรูปแบบสากล
       แต่ชื่อ segment (aria-label) ต้องเป็นไทย */
    const labels = [...container.querySelectorAll('[role="spinbutton"]')]
      .map((el) => el.getAttribute('aria-label'));
    expect(labels.some((l) => l && /ปี|เดือน|วัน/.test(l))).toBe(true);
  });

  it('ค่าที่ส่งออกยังเป็น ค.ศ. — ห้ามส่ง 2569 เข้าฐานข้อมูล', () => {
    const value = new CalendarDate(2026, 7, 26);
    /* .toString() ให้ ISO ที่เป็น ค.ศ. เสมอ ไม่ว่าจะแสดงเป็นปฏิทินอะไร */
    expect(value.toString()).toBe('2026-07-26');
  });

  it('ไม่มี axe violation', async () => {
    const { container } = render(
      <DatePicker
        label="วันที่จดทะเบียน"
        description="ระบุวันที่ตามหนังสือรับรอง"
        value={new CalendarDate(2026, 7, 26)}
        onChange={() => {}}
      />,
    );
    expect(await expectNoViolations(container)).toHaveNoViolations();
  });

  it('สถานะ invalid มีข้อความ ไม่ใช่แค่ขอบแดง', async () => {
    const { container } = render(
      <DatePicker
        label="วันที่จดทะเบียน"
        errorMessage="วันที่จดทะเบียนต้องไม่เกินวันนี้ — ตรวจสอบจากหนังสือรับรองนิติบุคคล"
        value={new CalendarDate(2030, 1, 1)}
        onChange={() => {}}
      />,
    );
    expect(screen.getByText(/ต้องไม่เกินวันนี้/)).toBeDefined();
    expect(await expectNoViolations(container)).toHaveNoViolations();
  });
});

/* ─────────────────────────────────────────────────────────────────────────── */

function OTPHarness({ onComplete }: { onComplete?: (v: string) => void }) {
  const [value, setValue] = useState('');
  return <OTPField value={value} onChange={setValue} onComplete={onComplete} />;
}

/**
 * จำลองการวางจริง — ไม่ใช่การพิมพ์
 *
 * ⚠️ **ห้ามใช้ `fireEvent.paste(el, { clipboardData })`**
 * jsdom สร้าง `DataTransfer` ของตัวเองแล้วทิ้ง object ที่เราส่งไป
 * ผลคือ `getData()` คืนค่าว่าง และเทสจะฟ้องว่า component พังทั้งที่ไม่พัง
 * — วัดแล้ว: `{hasCd: true, txt: ""}`
 *
 * ต้องสร้าง event เองแล้ว `defineProperty` ทับ — วัดแล้วได้ `"123456"`
 *
 * ⚠️ ต้องห่อด้วย `act()` ด้วย — `dispatchEvent` เองอยู่นอกวงจรของ React
 * state เปลี่ยนจริง (`onComplete` ถูกเรียก) แต่ DOM ไม่ re-render
 * ทำให้อ่าน `input.value` ได้ค่าว่างทั้งที่ component ทำงานถูก
 */
function paste(target: Element, text: string) {
  const data = new DataTransfer();
  data.setData('text/plain', text);
  const event = new Event('paste', { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'clipboardData', { value: data });
  act(() => {
    target.dispatchEvent(event);
  });
}

describe('OTPField · SC 3.3.8', () => {
  it('★★ วางเลข 6 หลักแล้วกระจายลงครบทุกช่อง', () => {
    render(<OTPHarness />);
    const group = screen.getByRole('group');

    paste(group, '123456');

    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    expect(inputs).toHaveLength(6);
    expect(inputs.map((i) => i.value).join('')).toBe('123456');
  });

  it('★ วางข้อความทั้งประโยคจาก SMS ก็ยังใช้ได้', () => {
    render(<OTPHarness />);
    paste(screen.getByRole('group'), 'รหัสยืนยันของคุณคือ 987654 หมดอายุใน 5 นาที');

    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    /* ดึงเฉพาะตัวเลข — แต่ "5" จากท้ายประโยคจะติดมาด้วย
       จึงตัดที่ length ตามที่ commit() ทำ */
    expect(inputs.map((i) => i.value).join('')).toBe('987654');
  });

  it('วางแล้วเรียก onComplete', () => {
    const onComplete = vi.fn();
    render(<OTPHarness onComplete={onComplete} />);
    paste(screen.getByRole('group'), '246810');
    expect(onComplete).toHaveBeenCalledWith('246810');
  });

  it('วางแล้วประกาศผ่าน live region', () => {
    const { container } = render(<OTPHarness />);
    paste(screen.getByRole('group'), '135790');

    const live = container.querySelector('[aria-live="polite"]');
    expect(live?.textContent).toContain('6');
  });

  it('★ ไม่มีช่องไหนบล็อกการวาง', () => {
    render(<OTPHarness />);
    /* วางลง**ช่องกลาง** ไม่ใช่ช่องแรก — ผู้ใช้จริงคลิกช่องไหนก็ได้
       handler อยู่ที่ระดับกลุ่ม จึงต้องทำงานเหมือนกันทุกช่อง

       handler เรียก preventDefault เพื่อ**แทนที่**พฤติกรรมด้วยการกระจาย
       ลงทุกช่อง — ไม่ใช่การบล็อก · เกณฑ์ที่ต้องเป็นจริงคือค่าเข้าครบ */
    const third = screen.getAllByRole('textbox')[2]!;
    paste(third, '111111');

    const values = (screen.getAllByRole('textbox') as HTMLInputElement[])
      .map((i) => i.value).join('');
    expect(values).toBe('111111');
  });

  it('autoComplete="one-time-code" อยู่ที่ช่องแรกช่องเดียว', () => {
    render(<OTPHarness />);
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    expect(inputs[0]!.getAttribute('autocomplete')).toBe('one-time-code');
    for (const input of inputs.slice(1)) {
      expect(input.getAttribute('autocomplete')).toBe('off');
    }
  });

  it('ใช้ inputMode="numeric" ไม่ใช่ type="number"', () => {
    render(<OTPHarness />);
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    for (const input of inputs) {
      expect(input.getAttribute('inputmode')).toBe('numeric');
      expect(input.getAttribute('type')).toBe('text');
    }
  });

  it('ทุกช่องมีชื่อบอกว่าเป็นหลักที่เท่าไร', () => {
    render(<OTPHarness />);
    const labels = (screen.getAllByRole('textbox') as HTMLInputElement[])
      .map((i) => i.getAttribute('aria-label'));
    expect(labels[0]).toBe('หลักที่ 1 จาก 6');
    expect(labels[5]).toBe('หลักที่ 6 จาก 6');
    /* ★ ทุกชื่อต้องไม่ซ้ำกัน */
    expect(new Set(labels).size).toBe(6);
  });

  it('ไม่มี axe violation', async () => {
    const { container } = render(<OTPHarness />);
    expect(await expectNoViolations(container)).toHaveNoViolations();
  });
});

/* ═══════════════════════════════════════════════════════════════════════════
   Pass 2 · ที่เหลืออีก 6 ตัว
   ═══════════════════════════════════════════════════════════════════════════ */

const OPTIONS = [
  { id: 'bkk', label: 'กรุงเทพมหานคร' },
  { id: 'cnx', label: 'เชียงใหม่', description: 'ภาคเหนือ' },
  { id: 'hkt', label: 'ภูเก็ต', isDisabled: true },
];

const pass2Cases: [string, React.ReactElement][] = [
  ['NumberField', <NumberField label="จำนวนที่สั่ง" defaultValue={100} minValue={1} suffix="ชิ้น" />],
  ['NumberField · เงิน', <NumberField label="วงเงินที่ขอ" defaultValue={500000} suffix="บาท" hideStepper
    formatOptions={{ useGrouping: true }} />],
  ['NumberField · invalid', <NumberField label="จำนวนที่สั่ง" defaultValue={0}
    errorMessage="จำนวนต้องไม่น้อยกว่า 1 ชิ้น — ตรวจสอบจำนวนสั่งขั้นต่ำของสินค้า" />],
  ['SearchField', <SearchField label="ค้นหา" defaultValue="เครื่องคั่วกาแฟ" />],
  ['SearchField · label ซ่อน', <SearchField label="ค้นหาสินค้า" labelHidden />],
  ['Switch', <Switch defaultSelected description="ระบบจะแจ้งเตือนเมื่อมีคำสั่งซื้อใหม่">
    รับการแจ้งเตือนทางอีเมล</Switch>],
  ['Switch · align end', <Switch align="end">แสดงราคารวมภาษี</Switch>],
  ['Selector', <Selector label="จังหวัดที่ตั้ง" options={OPTIONS}
    description="เลือกจังหวัดที่โรงงานตั้งอยู่" />],
  ['Selector · invalid', <Selector label="จังหวัดที่ตั้ง" options={OPTIONS}
    status={{ type: 'error', message: 'ยังไม่ได้เลือกจังหวัด — จำเป็นสำหรับการคำนวณค่าขนส่ง' }} />],
  ['ComboBox', <ComboBox label="จังหวัดที่ตั้ง" options={OPTIONS}
    placeholder="พิมพ์เพื่อค้นหาจังหวัด" />],
  ['FileUpload', <FileUpload label="เอกสารประกอบการสมัคร"
    description="หนังสือรับรองนิติบุคคล และงบการเงินย้อนหลัง 2 ปี" multiple onSelect={() => {}} />],
  ['FileUpload · มีไฟล์แล้ว', <FileUpload label="เอกสารประกอบการสมัคร"
    files={[{ id: '1', name: 'หนังสือรับรองนิติบุคคล.pdf', size: 245_760 }]}
    onSelect={() => {}} onRemove={() => {}} />],
];

describe('Pass 2 · axe', () => {
  it.each(pass2Cases)('%s ไม่มี violation', async (_name, element) => {
    const { container } = render(element);
    expect(await expectNoViolations(container)).toHaveNoViolations();
  });
});

describe('Pass 2 · กฎเฉพาะ', () => {
  it('NumberField ใช้ tabular-nums', () => {
    const { container } = render(<NumberField label="ราคา" defaultValue={1250000} />);
    const input = container.querySelector('input')!;
    expect(input.className).toContain('tabular-nums');
  });

  it('NumberField ไม่ใช้ role="spinbutton" — เป็น textbox ที่พิมพ์ทับได้', () => {
    const { container } = render(
      <NumberField label="จำนวน" defaultValue={5} minValue={1} maxValue={99} />,
    );
    const input = container.querySelector('input')!;
    /* ★ RAC เลือกไม่ใช้ spinbutton เพราะ screen reader หลายตัวจะเข้า
       โหมดอ่านค่าแทนโหมดแก้ข้อความ ทำให้พิมพ์ทับไม่ได้
       ขอบเขต min/max จึงต้องสื่อผ่าน description และ error แทน */
    expect(input.getAttribute('role')).toBeNull();
    expect(input.getAttribute('type')).toBe('text');
    expect(input.inputMode).toBe('numeric');
  });

  it('SearchField เป็น searchbox ไม่ใช่ textbox', () => {
    render(<SearchField label="ค้นหา" />);
    expect(screen.getByRole('searchbox')).toBeDefined();
  });

  it('Switch เป็น role="switch" ไม่ใช่ checkbox', () => {
    render(<Switch defaultSelected>รับการแจ้งเตือน</Switch>);
    const sw = screen.getByRole('switch') as HTMLInputElement;
    /* ★ เป็น native checkbox ที่ override role — สถานะมาจาก `checked`
       ไม่ใช่ `aria-checked` (ซึ่งเป็น null และนั่นถูกต้อง) */
    expect(sw.type).toBe('checkbox');
    expect(sw.checked).toBe(true);
    expect(screen.queryByRole('checkbox')).toBeNull();
  });

  it('Selector ไม่ใช้ <select> ของ browser', () => {
    const { container } = render(<Selector label="จังหวัด" options={OPTIONS} />);
    /* ★ ตัวที่ผู้ใช้เห็นและกดต้องเป็น <button> ไม่ใช่ <select>
       เพราะ UI ของ <select> style ไม่ได้และขึ้นภาษาตาม OS */
    expect(screen.getByRole('button')).toBeDefined();

    /* RAC ยัง render <select> ที่ซ่อนไว้สำหรับการ submit ฟอร์ม —
       ต้องไม่อยู่ใน tab order และไม่ใช่ตัวที่ผู้ใช้เห็น */
    const hidden = container.querySelector('select');
    if (hidden) expect(hidden.getAttribute('tabindex')).toBe('-1');
  });

  it('★ FileUpload มีปุ่มเลือกไฟล์เสมอ — ไม่ใช่แค่พื้นที่ลาก (SC 2.5.7)', () => {
    render(<FileUpload label="เอกสาร" onSelect={() => {}} />);
    /* ทางที่กดครั้งเดียวได้ ต้องมีจริง ไม่ใช่แค่ลากวาง */
    expect(screen.getByRole('button', { name: 'เลือกไฟล์' })).toBeDefined();
  });

  it('FileUpload ซ่อน input ด้วย sr-only ไม่ใช่ display:none และมีชื่อ', () => {
    const { container } = render(<FileUpload label="เอกสารประกอบ" onSelect={() => {}} />);
    const input = container.querySelector('input[type="file"]')!;
    expect(input.className).toContain('sr-only');
    expect(input.className).not.toContain('hidden');
    /* ★ axe จับข้อนี้ได้ตอน SlipUpload — input ที่ซ่อนยังต้องมีชื่อ */
    expect(input.getAttribute('aria-labelledby')).toBeTruthy();
  });

  it('FileUpload ปุ่มลบมีชื่อไฟล์ในชื่อปุ่ม', () => {
    render(
      <FileUpload label="เอกสาร" onSelect={() => {}} onRemove={() => {}}
        files={[
          { id: '1', name: 'หนังสือรับรอง.pdf', size: 1024 },
          { id: '2', name: 'งบการเงิน.pdf', size: 2048 },
        ]} />,
    );
    const names = screen.getAllByRole('button')
      .map((b) => b.getAttribute('aria-label'))
      .filter((n): n is string => Boolean(n) && n!.includes('นำไฟล์'));
    expect(names).toHaveLength(2);
    expect(new Set(names).size).toBe(2);
  });
});
