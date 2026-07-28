import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SmeGoProvider, SearchField, Typeahead } from '../../src/index';

/* ═══════════════════════════════════════════════════════════════════════════
   ★★★ การรับประกันที่ผู้ใช้เห็นจริง: ไทยโดยแอปไม่ต้องทำอะไร
   ───────────────────────────────────────────────────────────────────────────
   ก่อน 2026-07-28 การแปลข้อความภายในของ RAC เป็น **opt-in** — แอปต้องเรียก
   `installRacThaiStrings()` ที่ระดับ module เอง · ถ้าลืม ผู้ใช้ TalkBack ไทย
   จะได้ยินภาษาอังกฤษ และ **ไม่มีอะไรฟ้อง** เพราะทุกอย่างยังทำงานปกติ
   นั่นคือช่องโหว่ที่ค้างนานที่สุดในระบบ และเป็นช่องที่ผู้ใช้ตาบอดรับผลเต็ม ๆ

   `SmeGoProvider` ติดตั้งให้เองแล้ว · ชุดนี้ยืนยันจาก**ปลายทาง** — render
   ผ่าน Provider เปล่า ๆ ต้องได้ชื่อปุ่มเป็นไทย

   ⚠️ แยกไฟล์จาก `rac-i18n.test.tsx` เพราะไฟล์นั้น import `SearchField`
   ของ **RAC** เพื่อทดสอบกลไกดิบ ส่วนไฟล์นี้ใช้ของ **เรา** ชื่อชนกัน
   ═══════════════════════════════════════════════════════════════════════════ */

describe('SmeGoProvider ติดตั้งคำแปล RAC ให้เอง', () => {
  it('★★★ ปุ่มล้างค่าของ SearchField เป็นไทยโดยแอปไม่เรียกอะไรเลย', () => {
    render(
      <SmeGoProvider>
        <SearchField label="ค้นหาสินค้า" defaultValue="เครื่องคั่วกาแฟ" />
      </SmeGoProvider>,
    );
    expect(screen.getByRole('button', { name: 'ล้างคำค้นหา' })).toBeTruthy();
  });

  it('Typeahead ก็ได้ผลเดียวกัน — เป็นสมบัติของ Provider ไม่ใช่ของ component', () => {
    render(
      <SmeGoProvider>
        <Typeahead label="จังหวัด" options={[{ id: 'bkk', label: 'กรุงเทพมหานคร' }]} />
      </SmeGoProvider>,
    );
    /* ปุ่มเปิดรายการของ RAC — ชื่อมาจาก @react-aria/combobox */
    const names = screen.getAllByRole('button').map((b) => b.getAttribute('aria-label'));
    expect(names.some((n) => n && /[ก-๙]/.test(n))).toBe(true);
  });

  it('skipRacStrings ไม่ทำให้พัง (ติดตั้งไปแล้วก่อนหน้า จึงไม่ถอนคืน)', () => {
    /* ★ ตรงไปตรงมาว่านี่คือข้อจำกัด ไม่ใช่ความสามารถ: global ของ RAC
       อ่านครั้งเดียวแล้ว cache ทั้งหน้า การ "ปิด" จึงมีผลเฉพาะตอนที่ยัง
       ไม่มีใครติดตั้ง — เขียนเทสต์ไว้เพื่อให้ข้อจำกัดนี้ไม่ถูกเข้าใจผิด */
    render(
      <SmeGoProvider skipRacStrings>
        <SearchField label="ค้นหา" defaultValue="กาแฟ" />
      </SmeGoProvider>,
    );
    expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
  });
});
