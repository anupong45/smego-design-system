import { describe, it, expect } from 'vitest';
import { createRequire } from 'node:module';
import { RAC_EN_FALLBACK } from '../../src/lib/rac-en-fallback';

/* ═══════════════════════════════════════════════════════════════════════════
   ตาราง RAC en-US ที่ฝังไว้ ต้องตรงกับ RAC ที่ติดตั้งอยู่จริง
   ───────────────────────────────────────────────────────────────────────────
   ★★★ ทำไมเทสต์นี้สำคัญกว่าที่หน้าตาบอก

   `SmeGoProvider` ตั้ง global `react-aria.i18n.strings` ให้เองแล้ว (2026-07-28)
   ซึ่งทำให้ TalkBack ไทยได้ยินภาษาไทยเป็นค่าเริ่มต้น — แต่แลกมากับกฎข้อหนึ่ง
   ของ RAC ที่โหดผิดคาด:

     **ถ้า global มีแล้ว แต่ package ที่ component ขอไม่อยู่ในนั้น → `throw`**
     (`@internationalized/string` · `private/LocalizedStringDictionary.js:41`)

   ไม่ใช่ fallback เป็นอังกฤษ ไม่ใช่ warning — **พังทั้งหน้า**

   ดังนั้นถ้าอัปเกรด `react-aria-components` แล้วเขาเพิ่ม package ใหม่
   ตารางที่ฝังไว้จะขาด และแอปจะขาวทั้งหน้าตอน runtime โดยที่ typecheck
   กับ unit test อื่นผ่านหมด

   เทสต์นี้จึงเทียบตารางกับของจริงทุกครั้งที่ `verify` รัน — ย้ายความพัง
   จาก runtime ของผู้ใช้ มาเป็นความแดงบนเครื่องคนแก้โค้ด

   ★ ดัก Proxy ไม่ได้: RAC อ่าน global ด้วย `for...in` **ครั้งเดียว** แล้ว
   snapshot เป็น plain object (บรรทัด 36) การค้นหาภายหลังจึงเกิดบน snapshot
   ไม่ใช่บนตัวที่เราส่งให้ — ตารางต้องครบจริง ไม่มีทางลัด
   ═══════════════════════════════════════════════════════════════════════════ */

const require_ = createRequire(import.meta.url);
const { dictionary } = require_('react-aria-components/i18n');
const live: Record<string, Record<string, string>> = dictionary.strings['en-US'];

describe('RAC en-US fallback ต้องไม่เก่า', () => {
  it('★★★ ครบทุก package ที่ RAC รู้จัก', () => {
    const missing = Object.keys(live).filter((p) => !(p in RAC_EN_FALLBACK));
    expect(
      missing,
      `RAC เพิ่ม package ใหม่ ${missing.join(' ')} — รัน \`npm run gen:rac-fallback\`\n` +
        `ถ้าไม่ทำ หน้าจะพังทั้งหน้าตอน runtime ไม่ใช่ fallback เป็นอังกฤษ`,
    ).toEqual([]);
  });

  it('ครบทุก key ในแต่ละ package', () => {
    const missing: string[] = [];
    for (const [pkg, msgs] of Object.entries(live)) {
      for (const k of Object.keys(msgs)) {
        if (!(k in (RAC_EN_FALLBACK[pkg] ?? {}))) missing.push(`${pkg}.${k}`);
      }
    }
    expect(
      missing,
      `key ใหม่ ${missing.join(' ')} — รัน \`npm run gen:rac-fallback\``,
    ).toEqual([]);
  });

  it('ไม่มี package ส่วนเกินที่ RAC ไม่รู้จักแล้ว', () => {
    /* ส่วนเกินไม่ทำให้พัง แต่แปลว่าตารางค้างของที่ถูกถอดออกไปแล้ว
       ซึ่งทำให้คนอ่านเข้าใจผิดว่ายังต้องรองรับ */
    const extra = Object.keys(RAC_EN_FALLBACK).filter((p) => !(p in live));
    expect(extra).toEqual([]);
  });

  it('★★ ชนิดของทุกค่าตรงกัน — string ต่อ string · function ต่อ function', () => {
    /* ★★★ เทสต์ข้อนี้จับบั๊กจริงในตัว generator ทันทีที่เขียน

       37 จาก 146 key ของ RAC เป็น **ฟังก์ชัน** (ICU plural/interpolation)
       ไม่ใช่ string · generator ฉบับแรกใช้ `JSON.stringify` จึง **ทิ้งทั้ง 37
       ตัวเงียบ ๆ** → global ขาด key → RAC throw → หน้าขาวทั้งหน้า
       โดยที่ typecheck กับเทสต์อื่นผ่านหมด

       เก็บไว้เป็นกฎถาวร เพราะ RAC เปลี่ยน string เป็นฟังก์ชันได้ทุกเวอร์ชัน
       เมื่อเพิ่ม interpolation เข้าไปในข้อความที่เคยคงที่ */
    const mismatched: string[] = [];
    for (const [pkg, msgs] of Object.entries(live)) {
      for (const [k, v] of Object.entries(msgs)) {
        const ours = RAC_EN_FALLBACK[pkg]?.[k];
        if (typeof ours !== typeof v) {
          mismatched.push(`${pkg}.${k}: ของจริง ${typeof v} · ของเรา ${typeof ours}`);
        }
      }
    }
    expect(
      mismatched,
      `ชนิดไม่ตรง — รัน \`npm run gen:rac-fallback\`\n${mismatched.join('\n')}`,
    ).toEqual([]);
  });

  it('ฟังก์ชัน ICU ที่ emit เป็นซอร์สยังเรียกได้จริง', () => {
    /* emit ด้วย `toString()` จะพังถ้าฟังก์ชันปิดทับตัวแปรนอก —
       ตรวจด้วยการเรียกจริงหนึ่งตัวที่ใช้ทั้ง plural และ number */
    const fn = RAC_EN_FALLBACK['@react-aria/toast']?.notifications;
    expect(typeof fn).toBe('function');
    const fmt = {
      plural: (n: number, o: Record<string, () => string>) =>
        (n === 1 ? o.one : o.other)!(),
      number: (n: number) => String(n),
    };
    // @ts-expect-error — เรียกด้วยรูปที่ RAC ใช้จริง (args เป็น never[] ในชนิด)
    expect(fn(({ count: 2 }), fmt)).toBe('2 notifications.');
  });
});
