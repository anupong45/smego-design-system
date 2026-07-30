import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { ThemeToggle } from '../../src/provider/ThemeToggle';
import { THEME_INIT_SCRIPT } from '../../src/lib/theme-init.generated';

/* ═══════════════════════════════════════════════════════════════════════════
   ThemeToggle — ปลายข้างที่หายไปของโหมดมืด
   ───────────────────────────────────────────────────────────────────────────
   จนถึง 2026-07-30 `theme-init.js` ไม่มี call site แม้แต่ที่เดียว ⇒ โหมดมืด
   ถูกพิสูจน์ว่า **ค่าสีถูก** (contrast sweep ทั้งสองโหมด) แต่ **ยังไม่เคยมีใคร
   เปิดใช้ได้** · เทสนี้ล็อกเส้นทางทั้งเส้น: กด → localStorage → data-theme

   ★ สองสภาพที่ต้องแยกให้ชัด
     1 แอป inline THEME_INIT_SCRIPT แล้ว → ปุ่มทำงาน
     2 แอปลืม → ปุ่ม **ปิด** ไม่ใช่กดแล้วเงียบ (ผู้ใช้ไม่ควรกดของที่ไม่ทำอะไร)
   ═══════════════════════════════════════════════════════════════════════════ */

function installStorage() {
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
}

describe('ThemeToggle', () => {
  let themeBefore: string | null = null;

  beforeEach(() => {
    themeBefore = document.documentElement.getAttribute('data-theme');
    installStorage();
  });

  afterEach(() => {
    Reflect.deleteProperty(window, 'localStorage');
    Reflect.deleteProperty(window, 'smegoTheme');
    document.documentElement.style.colorScheme = '';
    if (themeBefore === null) document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', themeBefore);
  });

  const boot = () => new Function(THEME_INIT_SCRIPT)();

  it('axe ผ่าน', async () => {
    boot();
    const { container } = render(<ThemeToggle />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('★ เป็น radiogroup ที่มีชื่อ — ไม่ใช่ปุ่มลอย ๆ (SC 1.3.1)', () => {
    boot();
    render(<ThemeToggle />);
    const group = screen.getByRole('radiogroup', { name: 'ธีมการแสดงผล' });
    expect(group).toBeTruthy();
    /* 3 ตัวเลือกต้องอ่านออกด้วยข้อความ ไม่ใช่ด้วยสีหรือไอคอน (SC 1.4.1) */
    for (const name of ['สว่าง', 'มืด', 'ตามระบบ']) {
      expect(screen.getByRole('radio', { name }), name).toBeTruthy();
    }
  });

  it('★★★ กดแล้วเปลี่ยน data-theme และเก็บค่าไว้จริง', async () => {
    localStorage.setItem('smego-theme', 'light');
    boot();
    render(<ThemeToggle />);

    await userEvent.click(screen.getByRole('radio', { name: 'มืด' }));

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('smego-theme')).toBe('dark');
  });

  it('★★ เลือก "ตามระบบ" แล้วค่าที่เก็บเป็น system ไม่ใช่ค่าที่ resolve แล้ว', async () => {
    localStorage.setItem('smego-theme', 'dark');
    boot();
    render(<ThemeToggle />);

    await userEvent.click(screen.getByRole('radio', { name: 'ตามระบบ' }));

    /* ต้องเก็บ 'system' ไว้ ไม่ใช่ 'light' — ถ้าเก็บค่าที่ resolve แล้ว
       ผู้ใช้จะหลุดจากโหมดตามระบบโดยไม่ได้สั่ง และ OS ที่เปลี่ยนทีหลังจะไม่มีผล */
    expect(localStorage.getItem('smego-theme')).toBe('system');
    expect(document.documentElement.getAttribute('data-theme')).toMatch(
      /^(light|dark)$/,
    );
  });

  it('★★ ตัวเลือกที่ไฮไลต์ตรงกับค่าที่เก็บไว้ หลัง effect รอบแรก', async () => {
    localStorage.setItem('smego-theme', 'dark');
    boot();
    render(<ThemeToggle />);

    /* ห้ามอ่าน localStorage ตอน render ครั้งแรก (hydration) — ค่าจริงมาหลัง effect
       จึงต้องรอ ไม่ใช่ assert ทันที */
    /* RAC ใช้ `<input type="radio">` จริง — สถานะอยู่ที่ property `checked`
       ไม่ใช่ `aria-checked` (ดู memory `smego-rac-verified`) */
    const dark = (await screen.findByRole('radio', {
      name: 'มืด',
    })) as HTMLInputElement;
    await waitFor(() => expect(dark.checked).toBe(true));
    expect(
      (screen.getByRole('radio', { name: 'สว่าง' }) as HTMLInputElement).checked,
    ).toBe(false);
  });

  it('★★★ แอปไม่ inline script → ปุ่มปิด ไม่ใช่กดแล้วเงียบ', () => {
    /* ไม่เรียก boot() — window.smegoTheme ไม่มี */
    render(<ThemeToggle />);
    for (const name of ['สว่าง', 'มืด', 'ตามระบบ']) {
      const radio = screen.getByRole('radio', { name });
      expect(
        radio.hasAttribute('disabled') || radio.getAttribute('aria-disabled') === 'true',
        `${name} ต้องปิด เมื่อไม่มี window.smegoTheme`,
      ).toBe(true);
    }
  });
});
