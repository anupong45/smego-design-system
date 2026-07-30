'use client';

import { useEffect, useState } from 'react';
import {
  SegmentedControl,
  SegmentedControlItem,
} from '../navigation/SegmentedControl';
import { useStrings } from './SmeGoProvider';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · ThemeToggle
   ───────────────────────────────────────────────────────────────────────────
   ★★★ ทำไมปุ่มนี้ต้องอยู่ในไลบรารี ไม่ใช่ในแอป

   `data-theme` กับ `localStorage['smego-theme']` เป็น **สถานะร่วม** ถ้าปล่อยให้
   แอปเขียนเอง แอปที่สองจะเขียนคนละ key หรือเขียน attribute ตรง ๆ โดยไม่ผ่าน
   localStorage แล้วผู้ใช้จะเห็น theme ไม่ตรงกันข้ามหน้า — **last-writer-wins**
   ซึ่งเป็นรูปแบบเดียวกับที่ `CLAUDE.md §4` ห้าม `body.style.padding*` ไว้

   ★★ และจนถึง 2026-07-30 `theme-init.js` (9.9 KB) **ไม่มี call site แม้แต่ที่เดียว**
   ทั้งไฟล์ · ไม่มีอะไรอ่านหรือเขียน `smego-theme` เลย ⇒ โหมดมืดถูกพิสูจน์ว่า
   **ค่าสีถูก** (contrast sweep ทั้งสองโหมด) แต่ **ยังไม่เคยมีใครเปิดใช้ได้**
   ไฟล์นี้คือปลายข้างที่หายไป

   ═══ ตรรกะทั้งหมดอยู่ที่ `window.smegoTheme` ไม่ใช่ที่นี่ ═══

   component นี้เป็น **แค่หน้าตา** — อ่าน/เขียนผ่าน API ที่ `theme-init.js`
   ติดตั้งไว้ เพราะตรรกะ resolve `'system'` · การกัน exception ของ localStorage
   (Safari private mode · iOS ที่ปิดคุกกี้ · iframe ที่ถูกบล็อก) · การฟัง
   `matchMedia` · การซิงก์ข้ามแท็บ **มีอยู่แล้วครบใน script นั้น**
   การเขียนซ้ำที่นี่จะได้ตรรกะสองชุดที่หลุดจากกัน

   ⚠️ **ถ้าแอปไม่ inline `THEME_INIT_SCRIPT`** ปุ่มนี้จะไม่มี API ให้เรียก
      → แสดงเป็น disabled และ log คำอธิบายใน dev · เลือกทางนี้เพราะการ
      fallback ไปเขียน localStorage เองคือการสร้างตรรกะชุดที่สองเงียบ ๆ
      ซึ่งแย่กว่าการบอกตรง ๆ ว่าติดตั้งไม่ครบ

   ═══ hydration ═══

   ห้ามอ่าน `localStorage` ตอน render ครั้งแรก — server ไม่รู้ค่า จะได้
   HTML ไม่ตรงกับ client (`theme-init.js` เขียนกฎนี้ไว้เองที่ท้ายไฟล์)
   จึงเริ่มที่ `'system'` เสมอ แล้ว sync ใน `useEffect` · การกระพริบของ
   **ตัวเลือกที่ถูกไฮไลต์** ยอมรับได้ เพราะ **สีของหน้าไม่กระพริบ** —
   script ตั้ง `data-theme` ไปแล้วก่อน paint
   ═══════════════════════════════════════════════════════════════════════════ */

/** ค่าที่ผู้ใช้เลือกได้ — `'system'` ถูก resolve เป็น light/dark ตอนใช้งาน */
export type ThemePreference = 'light' | 'dark' | 'system';

/** API ที่ `THEME_INIT_SCRIPT` ติดตั้งไว้บน `window` */
export interface SmegoThemeApi {
  get(): ThemePreference;
  resolved(): 'light' | 'dark';
  set(pref: ThemePreference): void;
  toggle(): void;
}

declare global {
  interface Window {
    smegoTheme?: SmegoThemeApi;
  }
}

const ORDER: ThemePreference[] = ['light', 'dark', 'system'];

/**
 * อ่านค่า theme ที่ผู้ใช้เลือก และค่าที่ใช้จริง
 *
 * คืน `preference: 'system'` ตอน render ครั้งแรกเสมอเพื่อไม่ให้ hydration
 * ไม่ตรงกัน — ค่าจริงมาหลัง effect รอบแรก · `isReady` บอกว่า sync แล้วหรือยัง
 */
export function useTheme(): {
  preference: ThemePreference;
  resolved: 'light' | 'dark';
  isReady: boolean;
  setPreference: (pref: ThemePreference) => void;
} {
  const [preference, setPreference] = useState<ThemePreference>('system');
  const [resolved, setResolved] = useState<'light' | 'dark'>('light');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const sync = () => {
      const api = window.smegoTheme;
      if (!api) return;
      setPreference(api.get());
      setResolved(api.resolved());
      setIsReady(true);
    };
    sync();

    /* `smego:themechange` ยิงเมื่อปุ่มใดก็ตามในหน้าเปลี่ยนค่า ·
       `storage` ยิงเมื่อ **แท็บอื่น** เปลี่ยน — script จัดการ attribute เองแล้ว
       ที่นี่แค่ทำให้ตัวเลือกที่ไฮไลต์ตามไปด้วย */
    addEventListener('smego:themechange', sync);
    addEventListener('storage', sync);
    return () => {
      removeEventListener('smego:themechange', sync);
      removeEventListener('storage', sync);
    };
  }, []);

  return {
    preference,
    resolved,
    isReady,
    setPreference: (pref) => {
      const api = window.smegoTheme;
      if (!api) {
        if (process.env.NODE_ENV !== 'production') {
          console.error(
            '[@smego/ui] window.smegoTheme ไม่มี — แอปยังไม่ได้ inline ' +
              'THEME_INIT_SCRIPT ใน <head> · ดู THEME_INIT_SCRIPT ใน @smego/ui',
          );
        }
        return;
      }
      api.set(pref);
    },
  };
}

export interface ThemeToggleProps {
  /**
   * ป้ายของกลุ่มตัวเลือก — บังคับ (SC 1.3.1)
   *
   * ค่าเริ่มต้นมาจาก dictionary ไทย · ส่งเองได้เมื่อบริบทต้องการคำอื่น
   */
  label?: string;

  /** ซ่อนป้ายจากตา แต่ยังอยู่กับ screen reader */
  isLabelHidden?: boolean;

  size?: 'sm' | 'md' | 'lg';

  /** `'fill'` ให้เต็มความกว้าง — ใช้ในเมนูบนจอแคบ */
  layout?: 'hug' | 'fill';

  className?: string;
}

/**
 * ตัวสลับโหมดสว่าง/มืด — 3 ตัวเลือก `สว่าง` `มืด` `ตามระบบ`
 *
 * ใช้ข้อความไม่ใช้ไอคอน: Lucide ไม่มี sun/moon ในทะเบียนของเรา และตามข้อ 09
 * การหยิบไอคอนใกล้เคียงมาใช้เป็นสิ่งที่ห้าม · คำไทยสามคำนี้สั้นและตรงกว่า
 * ไอคอนอยู่แล้ว และไม่ทำให้ bundle โตขึ้นเลย
 */
export function ThemeToggle({
  label,
  isLabelHidden,
  size = 'md',
  layout = 'hug',
  className,
}: ThemeToggleProps) {
  const s = useStrings();
  const { preference, isReady, setPreference } = useTheme();

  return (
    <SegmentedControl
      value={preference}
      onChange={(v) => setPreference(v as ThemePreference)}
      label={label ?? s.theme.label}
      {...(isLabelHidden === undefined ? {} : { isLabelHidden })}
      size={size}
      layout={layout}
      /* ยังไม่ sync = ยังไม่รู้ค่าจริง หรือแอปไม่ได้ inline script
         ปิดไว้ก่อนดีกว่าให้กดแล้วไม่เกิดอะไรโดยไม่มีคำอธิบาย */
      isDisabled={!isReady}
      {...(className === undefined ? {} : { className })}
    >
      {ORDER.map((pref) => (
        <SegmentedControlItem key={pref} value={pref} label={s.theme[pref]} />
      ))}
    </SegmentedControl>
  );
}
