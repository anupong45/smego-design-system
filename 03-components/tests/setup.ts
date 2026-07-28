import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);
afterEach(cleanup);

/* jsdom ไม่มี ResizeObserver — CompareBar ใช้เพื่อประกาศความสูงเข้า
   `--bottom-nav-height` (SC 2.4.11) · stub ให้ test ผ่าน */
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver;

/* jsdom ไม่มี DataTransfer — จำเป็นสำหรับเทส paste (SC 3.3.8)
   ⚠️ ต้อง normalize `'text'` → `'text/plain'` ตามสเปก
   stub ที่ไม่ทำข้อนี้จะทำให้เทสฟ้องว่า component พัง ทั้งที่ตัว stub เองผิด
   — เจอมาแล้วตอนเขียนเทส OTPField */
const normalizeFormat = (format: string) => {
  const f = format.toLowerCase();
  if (f === 'text') return 'text/plain';
  if (f === 'url') return 'text/uri-list';
  return f;
};

globalThis.DataTransfer ??= class {
  #data = new Map<string, string>();
  setData(format: string, value: string) {
    this.#data.set(normalizeFormat(format), value);
  }
  getData(format: string) {
    return this.#data.get(normalizeFormat(format)) ?? '';
  }
} as unknown as typeof DataTransfer;

/* RAC เรียก matchMedia สำหรับ reduced motion */
globalThis.matchMedia ??= ((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener() {},
  removeListener() {},
  addEventListener() {},
  removeEventListener() {},
  dispatchEvent: () => false,
})) as unknown as typeof matchMedia;

/* jsdom ไม่มี `CSS.escape` — react-aria เรียกมันใน selection utils ตอน focus
   ของ collection (Tabs · ListBox · Menu) แล้วโยน
   `TypeError: Cannot read properties of undefined (reading 'escape')`
   ซึ่ง**อ่านไม่ออกเลยว่าเกี่ยวกับอะไร** — เจอตอนเขียนเทส TabList

   ⚠️ อาการหลอก: เทสที่ล้มคือเทสที่ **กด/เลื่อน focus** ส่วนเทสที่อ่าน
   markup เฉย ๆ ผ่านหมด ทำให้ดูเหมือน component พังเฉพาะตอน interact */
globalThis.CSS ??= {} as unknown as typeof CSS;
globalThis.CSS.escape ??= ((value: string) =>
  String(value).replace(/[^\w-]/g, (ch) => `\\${ch}`)) as typeof CSS.escape;
