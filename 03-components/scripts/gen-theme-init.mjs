/* ═══════════════════════════════════════════════════════════════════════════
   gen-theme-init — ทำ `02-tokens/theme-init.js` ให้ import ได้จาก React
   ───────────────────────────────────────────────────────────────────────────
   แอป Next ต้อง inline IIFE นี้ใน `<head>` แบบ synchronous ก่อน first paint
   (ถ้าโหลดเป็นไฟล์แยก network request จะทำให้ paint เกิดก่อน = เห็น theme
   ผิดกระพริบ) วิธีเดียวใน Next คือ

       <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />

   ★★★ ทำไมต้อง generate ไม่ใช่พิมพ์สตริงลงไปเอง

   ถ้าคัดลอกโค้ดมาเป็นสตริงในไฟล์ `.ts` จะมีตรรกะเดียวกันอยู่ **สองที่**
   แล้ววันหนึ่งสองที่จะหลุดจากกัน — CLAUDE.md §2 บันทึกไว้แล้วว่านั่นคือ
   **กลไก** ที่ทำให้ CI ตรวจแค่ครึ่งเดียวโดยไม่มีใครรู้ · `theme-init.js`
   เป็นแหล่งความจริงเดียว ไฟล์ที่ generate ออกมาห้ามแก้มือ และมีเทสยืนยันว่าตรงกัน

   รูปแบบเดียวกับ `gen-rac-fallback.mjs` ที่มีอยู่แล้วในรีโปนี้

       npm run gen:theme-init
   ═══════════════════════════════════════════════════════════════════════════ */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const SOURCE = path.resolve(here, '../../02-tokens/theme-init.js');
const OUT = path.resolve(here, '../src/lib/theme-init.generated.ts');

/** ตัดเอาเฉพาะ IIFE หลัก — คอมเมนต์อธิบายรอบ ๆ ไม่ต้องส่งไปกับ HTML ทุกหน้า */
export function extractIife(src) {
  const lines = src.split('\n');
  const start = lines.findIndex((l) => l.trim() === '(function () {');
  if (start === -1) throw new Error('หาจุดเริ่ม IIFE ไม่เจอใน theme-init.js');
  const end = lines.findIndex((l, i) => i > start && l.trim() === '})();');
  if (end === -1) throw new Error('หาจุดจบ IIFE ไม่เจอใน theme-init.js');
  return lines.slice(start, end + 1).join('\n');
}

/* ★★★ ห้ามรันเป็นผลข้างเคียงของการ import
   `theme-init.test.ts` import `extractIife` จากไฟล์นี้เพื่อไม่ให้มีตรรกะการตัด
   IIFE สองชุด — แต่ฉบับแรกไม่มี guard นี้ ⇒ **การ import รันสคริปต์ทั้งไฟล์
   แล้วเขียนไฟล์ที่ generate ใหม่ก่อนเทียบ** เทส "ตรงกัน" จึงไม่มีทางแดงได้เลย
   เกตตาบอดตัวที่ 5 ของรีโปนี้ และเกิดจากการ export ฟังก์ชันจากสคริปต์ที่รันเอง */
const isMain =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (!isMain) {
  /* ถูก import — ให้แค่ฟังก์ชัน ไม่แตะไฟล์ */
} else {
  main();
}

function main() {
const iife = extractIife(fs.readFileSync(SOURCE, 'utf8'));

/* ต้องฝังใน template literal — ถ้ามี backtick หรือ ${ อยู่ในโค้ดจะพัง
   ตรวจแล้วหยุด ดีกว่าปล่อยไฟล์ที่ compile ไม่ผ่าน */
if (iife.includes('`') || iife.includes('${')) {
  console.error('❌ theme-init.js มี ` หรือ ${ — ฝังใน template literal ไม่ได้');
  process.exit(1);
}

/* `</script>` ใน HTML จะปิด tag ก่อนเวลาถ้าหลุดเข้าไปในโค้ด */
if (/<\/script/i.test(iife)) {
  console.error('❌ theme-init.js มี </script — จะปิด tag ก่อนเวลาเมื่อ inline');
  process.exit(1);
}

const banner = `/* ไฟล์นี้ถูกสร้างด้วยสคริปต์ ห้ามแก้มือ
   สร้างด้วย:  npm run gen:theme-init
   แหล่งความจริง: 02-tokens/theme-init.js
   ตรงกันหรือไม่ ถูกยืนยันด้วย tests/a11y/theme-init.test.ts */`;

const out = `${banner}

/**
 * IIFE ที่ต้อง inline ใน \`<head>\` **แบบ synchronous ก่อน first paint**
 *
 * Next.js App Router — \`app/layout.tsx\`:
 *
 * \`\`\`tsx
 * import { THEME_INIT_SCRIPT } from '@smego/ui';
 *
 * <html lang="th" suppressHydrationWarning>
 *   <head>
 *     <meta name="color-scheme" content="light dark" />
 *     <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
 *   </head>
 * \`\`\`
 *
 * ⚠️ \`lang="th"\` เป็นข้อบังคับ — feature \`locl\` ของ Anuphan และการตัดคำไทย
 * ⚠️ \`suppressHydrationWarning\` บน \`<html>\` จำเป็น เพราะ script แก้ attribute
 *    ก่อน React hydrate
 * ⚠️ ห้าม \`defer\` ห้าม \`async\` ห้ามแยกเป็นไฟล์ — paint จะเกิดก่อน
 */
export const THEME_INIT_SCRIPT = ${JSON.stringify(iife)};
`;

fs.writeFileSync(OUT, out);
console.log(
  `✅ gen:theme-init — ${iife.split('\n').length} บรรทัด · ` +
    `${Buffer.byteLength(iife)} bytes → src/lib/theme-init.generated.ts`,
);
}
