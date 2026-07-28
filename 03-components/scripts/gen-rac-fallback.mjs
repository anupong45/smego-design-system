#!/usr/bin/env node
/* สร้าง src/lib/rac-en-fallback.ts จาก RAC ที่ติดตั้งอยู่
   รันเมื่ออัปเกรด react-aria-components:  npm run gen:rac-fallback
   ดูเหตุผลว่าทำไมต้องฝังตารางนี้ ในหัวไฟล์ที่มันสร้าง */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require_ = createRequire(import.meta.url);
const { dictionary } = require_('react-aria-components/i18n');
const racVersion = require_('react-aria-components/package.json').version;

const en = dictionary.strings['en-US'];

/* ★★ 37 จาก 146 key เป็น **ฟังก์ชัน** (ICU plural/interpolation) ไม่ใช่ string
   ฉบับแรกของสคริปต์นี้ใช้ `JSON.stringify` ตรง ๆ → ทิ้งทั้ง 37 ตัวเงียบ ๆ
   ซึ่งแปลว่า global จะขาด key แล้ว RAC **throw พังทั้งหน้า** ตอน runtime
   จับได้เพราะเทสต์ข้อ 4 ใน rac-fallback.test.ts (เขียนไว้เผื่อกรณีนี้พอดี)

   ฟังก์ชันพวกนี้เป็น arrow ที่ไม่ปิดทับตัวแปรนอก (อ้างแค่พารามิเตอร์ตัวเอง)
   เช่น  e=>`sorted by column ${e.columnName} in ascending order`
   จึง emit `toString()` เป็นซอร์สได้ตรง ๆ อย่างปลอดภัย */
const emit = (v) =>
  typeof v === 'function' ? v.toString() : JSON.stringify(v);

const body = Object.keys(en)
  .sort()
  .map((pkg) => {
    const inner = Object.keys(en[pkg])
      .sort()
      .map((k) => `    ${JSON.stringify(k)}: ${emit(en[pkg][k])},`)
      .join('\n');
    return `  ${JSON.stringify(pkg)}: {\n${inner}\n  },`;
  })
  .join('\n');

const sorted = en;

const keyCount = Object.values(sorted).reduce((n, o) => n + Object.keys(o).length, 0);
const bytes = JSON.stringify(en).length;

const header = `/* ═══════════════════════════════════════════════════════════════════════════
   RAC en-US fallback — **ไฟล์นี้ถูกสร้างด้วยสคริปต์ ห้ามแก้มือ**
   ───────────────────────────────────────────────────────────────────────────
   สร้างด้วย:  npm run gen:rac-fallback   ·  react-aria-components ${racVersion}
   ตอนนี้: ${Object.keys(sorted).length} package · ${keyCount} key · ${bytes} bytes (gzip ~1.3 KB)

   ★★ ทำไมต้องฝังตารางนี้ไว้ในไลบรารี

   \`installRacThaiStrings\` ต้องเติม **ทุก package** ที่ RAC รู้จัก ไม่ใช่แค่
   ตัวที่เราแปล เพราะถ้า global มีแล้วแต่ package ไหนขาด
   \`LocalizedStringDictionary\` จะ **throw แล้วพังทั้งหน้า** ไม่ใช่ fallback เงียบ
   (ดู \`private/LocalizedStringDictionary.js:41\`)

   เดิมจึงบังคับให้แอปส่ง \`dictionary.strings['en-US']\` เข้ามาเอง — แต่ import
   \`react-aria-components/i18n\` ลาก **ทั้ง 34 locale** วัดแล้ว
   **355 KB raw / 59 KB gzip** ซึ่งใหญ่กว่าไลบรารีทั้งก้อน (35 KB gzip) เกือบ
   1.7 เท่า จึงถูกทำเป็น opt-in — และผลคือผู้ใช้ TalkBack ไทยได้ยินภาษาอังกฤษ
   ตลอดมาถ้าแอปลืมเรียก

   ★ แต่ **locale เดียวเล็กมาก** (ตัวเลขด้านบน) การฝังไว้จึงเกือบฟรี และทำให้
   \`SmeGoProvider\` เรียกให้เองเป็นค่าเริ่มต้นได้ — เอกสารเดิมสรุปผิดเพราะเอา
   ขนาดของ 34 locale มาตัดสินแทนขนาดของ locale เดียว

   ⚠️ ถ้า RAC เพิ่ม package/key ใหม่ ตารางนี้จะเก่า และหน้าจะพังตอน runtime
   \`tests/a11y/rac-fallback.test.ts\` เทียบตารางนี้กับ RAC ที่ติดตั้งจริง
   จึงเปลี่ยนความพังตอน runtime เป็นความแดงตอน build
   ═══════════════════════════════════════════════════════════════════════════ */

`;

/* ค่าอาจเป็น string หรือฟังก์ชัน ICU — ต้องประกาศชนิดให้ครอบทั้งสอง
   ไม่เช่นนั้น TS จะบ่นตอนฟังก์ชันถูก emit ลงไป */
const out = `${header}/* ฟังก์ชัน ICU ของ RAC รับ shape ต่างกันทุกตัว (e.date · e.count · e.columnName)
   การไล่ประกาศชนิดจริงต้อง mirror ทั้ง 37 ตัว และจะเก่าทุกครั้งที่ RAC เปลี่ยน
   จึงปล่อยพารามิเตอร์เป็น any — ค่าคืนยังผูกเป็น string อยู่ */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RacMessage = string | ((...args: any[]) => string);

export const RAC_EN_FALLBACK: Record<string, Record<string, RacMessage>> = {
${body}
};
`;

const target = path.join(import.meta.dirname, '..', 'src', 'lib', 'rac-en-fallback.ts');
fs.writeFileSync(target, out);
console.log(`✓ rac-en-fallback.ts — ${Object.keys(sorted).length} package · ${keyCount} key · RAC ${racVersion}`);
