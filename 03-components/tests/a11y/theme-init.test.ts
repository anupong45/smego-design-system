import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { THEME_INIT_SCRIPT } from '../../src/lib/theme-init.generated';
import { extractIife } from '../../scripts/gen-theme-init.mjs';

/* ═══════════════════════════════════════════════════════════════════════════
   THEME_INIT_SCRIPT ต้องตรงกับ 02-tokens/theme-init.js เสมอ
   ───────────────────────────────────────────────────────────────────────────
   ★★★ ไฟล์ที่ generate ไว้แล้วไม่มีเทสคุม = สำเนาที่ค้างได้เงียบ ๆ

   ถ้ามีคนแก้ `theme-init.js` แล้วลืมรัน `gen:theme-init` แอปจะได้ script เก่า
   ไปวางใน `<head>` — และ **ไม่มีอะไรพัง** จนกว่าจะเจอเคสที่ตรรกะใหม่แก้ไว้
   นี่คือรูปแบบเดียวกับ `rac-en-fallback.ts` ที่มี `rac-fallback.test.ts` คุมอยู่แล้ว

   ⚠️ เทสนี้ import `extractIife` จากตัว generator เอง — จงใจ **ไม่** เขียน
      ตรรกะการตัด IIFE ซ้ำที่นี่ เพราะการมีตรรกะสองชุดคือสิ่งที่กำลังกันอยู่
      ถ้า generator ตัดผิด เทสข้อ 2–4 จะจับได้จากรูปร่างของผลลัพธ์
   ═══════════════════════════════════════════════════════════════════════════ */

const SOURCE = path.resolve(__dirname, '../../../02-tokens/theme-init.js');

interface SmegoThemeApiShape {
  get(): string;
  resolved(): string;
  set(pref: string): void;
  toggle(): void;
}

/* ⚠️ **`typeof localStorage` ในสภาพ jsdom ของรีโปนี้คือ `undefined`**
   ฉบับแรกของไฟล์นี้จึงมีเทสสองตัวที่วัดผิด:
     · เทส "ตั้ง data-theme" — `setItem` throw แล้ว `finally` throw ซ้ำ ปิดทับ error จริง
     · เทส "localStorage โยน exception" — **ผ่านโดยไม่ได้ทดสอบอะไร** เพราะ
       localStorage เป็น undefined อยู่แล้ว getter ที่วางไว้ไม่เคยถูกเรียก
   ทั้งสองต้องมี stub ที่ทำงานได้จริงก่อน ไม่งั้นวัดสภาพที่ไม่ใช่ของเบราว์เซอร์ */
function installStorage(): { store: Map<string, string> } {
  const store = new Map<string, string>();
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: {
      getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
      setItem: (k: string, v: string) => void store.set(k, String(v)),
      removeItem: (k: string) => void store.delete(k),
      clear: () => store.clear(),
    },
  });
  return { store };
}

describe('THEME_INIT_SCRIPT', () => {
  let themeBefore: string | null = null;

  beforeEach(() => {
    themeBefore = document.documentElement.getAttribute('data-theme');
    installStorage();
  });

  afterEach(() => {
    Reflect.deleteProperty(window, 'localStorage');
    document.documentElement.style.colorScheme = '';
    if (themeBefore === null) document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', themeBefore);
  });

  it('★★★ ตรงกับ 02-tokens/theme-init.js — ถ้าไม่ตรง ให้รัน npm run gen:theme-init', () => {
    const fresh = extractIife(fs.readFileSync(SOURCE, 'utf8'));
    expect(
      THEME_INIT_SCRIPT,
      'ไฟล์ที่ generate ค้างอยู่ — แอปจะได้ script เก่าไปวางใน <head>',
    ).toBe(fresh);
  });

  it('เป็น IIFE ที่รันเองได้ ไม่ใช่โมดูลที่ต้อง import', () => {
    expect(THEME_INIT_SCRIPT.trimStart()).toMatch(/^\(function \(\) \{/);
    expect(THEME_INIT_SCRIPT.trimEnd()).toMatch(/\}\)\(\);$/);
    /* import/export ใน <script> ธรรมดาจะ throw ทันที */
    expect(THEME_INIT_SCRIPT).not.toMatch(/^\s*(import|export)\s/m);
  });

  it('★★ inline ใน HTML ได้อย่างปลอดภัย — ไม่มี </script และไม่มี backtick', () => {
    expect(THEME_INIT_SCRIPT, 'จะปิด tag ก่อนเวลา').not.toMatch(/<\/script/i);
    expect(THEME_INIT_SCRIPT).not.toContain('`');
  });

  it('★★★ ทำสิ่งที่มันมีอยู่เพื่อทำ — ตั้ง data-theme และให้ API ครบ 4 ตัว', () => {
    /* ไม่ได้เช็คว่า "มีสตริงนี้อยู่" เฉย ๆ — รันจริงแล้วดูผลบน document */
    localStorage.setItem('smego-theme', 'dark');
    new Function(THEME_INIT_SCRIPT)();

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');

    const api = (window as unknown as { smegoTheme?: Record<string, unknown> })
      .smegoTheme;
    expect(api, 'ปุ่ม ThemeToggle เรียก API นี้ — ถ้าไม่มี ปุ่มจะปิดตาย').toBeDefined();
    for (const fn of ['get', 'resolved', 'set', 'toggle']) {
      expect(typeof api?.[fn], `smegoTheme.${fn} ต้องเป็นฟังก์ชัน`).toBe('function');
    }

    /* set ต้องเปลี่ยนทั้ง attribute และค่าที่เก็บ */
    (api as unknown as { set(p: string): void }).set('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(localStorage.getItem('smego-theme')).toBe('light');
  });

  it('★★ toggle สลับ light ↔ dark และออกจากโหมด system', () => {
    localStorage.setItem('smego-theme', 'light');
    new Function(THEME_INIT_SCRIPT)();
    const api = (window as unknown as { smegoTheme: SmegoThemeApiShape }).smegoTheme;

    api.toggle();
    expect(api.resolved()).toBe('dark');
    expect(api.get(), 'toggle ต้องเก็บค่าที่ชัดเจน ไม่ใช่ค้างที่ system').toBe('dark');

    api.toggle();
    expect(api.resolved()).toBe('light');
  });

  it('★★★ localStorage ที่โยน exception ต้องไม่ทำให้ script ตายทั้งตัว', () => {
    /* Safari private mode · iOS ที่ปิดคุกกี้ · iframe ที่ถูกบล็อก —
       ถ้า script ตาย attribute จะไม่ถูกตั้งและผู้ใช้เห็นโหมดสว่างเสมอ */
    let touched = false;
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() {
        touched = true;
        throw new DOMException('blocked');
      },
    });

    expect(() => new Function(THEME_INIT_SCRIPT)()).not.toThrow();
    /* ★ ยืนยันว่า getter ถูกเรียกจริง — ไม่งั้นเทสนี้ผ่านโดยไม่ได้ทดสอบอะไร
         ซึ่งเป็นสิ่งที่ฉบับแรกของไฟล์นี้ทำ */
    expect(touched, 'script ไม่ได้แตะ localStorage เลย — เทสนี้ไม่ได้ทดสอบอะไร').toBe(
      true,
    );
    expect(document.documentElement.getAttribute('data-theme')).toMatch(
      /^(light|dark)$/,
    );
  });
});
