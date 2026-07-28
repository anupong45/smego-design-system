import type { ReactElement } from 'react';
import { render as rtlRender } from '@testing-library/react';
import { axe } from 'jest-axe';
import { SmeGoProvider } from '../../src/provider/SmeGoProvider';

/**
 * ทุก component ต้อง render ใน `SmeGoProvider` — ถ้าไม่มี `useStrings()`
 * จะพัง และนั่นคือพฤติกรรมที่ถูก (component ไม่ควรมี fallback ภาษาอังกฤษเงียบ ๆ)
 */
export function render(ui: ReactElement) {
  return rtlRender(<SmeGoProvider>{ui}</SmeGoProvider>);
}

/**
 * รัน axe แล้วคืนผล
 *
 * ⚠️ **axe จับได้แค่สิ่งที่อยู่ใน markup** — ไม่จับ:
 *   • ตำแหน่งจริงหลัง scroll (SC 2.4.11)
 *   • พฤติกรรมการวาง (SC 3.3.8)
 *   • ทางเลือกที่ไม่ต้องลาก (SC 2.5.7)
 *   • ลำดับเหตุการณ์ของ modal (SC 2.1.2 · 2.4.3)
 *
 * สี่ข้อนั้นอยู่ใน `tests/e2e` ด้วย Playwright
 *
 * ปิด `color-contrast` เพราะ jsdom ไม่คำนวณสีจริงจาก CSS —
 * contrast ถูกตรวจด้วยการวัดใน browser จริงแทน (ดู `.md` ของแต่ละ component)
 */
export async function expectNoViolations(container: HTMLElement) {
  const results = await axe(container, {
    rules: { 'color-contrast': { enabled: false } },
  });
  return results;
}
