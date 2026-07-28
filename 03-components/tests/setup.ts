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
