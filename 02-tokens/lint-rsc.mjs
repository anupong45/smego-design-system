/* ═══════════════════════════════════════════════════════════════════════════
   lint-rsc — `"use client"` ต้องมีเมื่อจำเป็น และ **ต้องไม่มีเมื่อไม่จำเป็น**
   ───────────────────────────────────────────────────────────────────────────
   แอปเป็น Next.js App Router (คำตัดสิน grill 2026-07-30 ข้อ 2) ⇒ ไฟล์ที่เรียก
   hook · ใช้ context · หรือผูก event handler เข้า DOM **ต้องประกาศตัวเป็น
   client** ไม่งั้น build ของแอปตายตอน import

   ★★★ ทำไมต้องตรวจ **สองทิศ**

   ทิศที่ขาดชัดเจนอยู่แล้ว — build แดง · แต่ทิศที่ **เกิน** พังเงียบ:
   ถ้าไม่มีใครห้าม ทุกไฟล์จะค่อย ๆ ติด directive ทีละตัวเพราะ "เติมไว้ก่อน
   กันพลาด" แล้ววันหนึ่งไลบรารีทั้งก้อนเป็น client โดยไม่มี commit ไหนตัดสินใจ
   เรื่องนั้นเลย — เหมือน `Icon.md` ที่ไม่มี checklist ตอนที่กฎเพิ่งถูกเขียน

   ★★ นับจริงเมื่อ 2026-07-30: **54 ต้องมี · 9 ต้องไม่มี** (จาก 63 `.tsx`)
   ไฟล์ `.ts` ทั้ง 9 ตัวไม่ต้องมีเลย — รวม `index.ts` ที่ต้องคง server-importable

   ⚠️ ตัวเลขชุดแรกที่รายงานคือ **42 / 21** ซึ่ง **ผิด** เพราะ grep หาเฉพาะชื่อ
      hook ของ React จึงไม่เห็น hook ของเราเอง — `useStrings` `useMoney`
      `useDebounce` `useSmeGoLocale` · `useStrings()` คือ `useContext(...)`
      ที่ห่อไว้ และถูกเรียกใน 47 ไฟล์ รวมการ์ด marketplace **ทั้ง 20 ไฟล์**
      ⇒ กฎด้านล่างจึงจับ `use[A-Z]…(` ทุกตัว ไม่ใช่ลิสต์ชื่อ hook ที่ต้องมาเติมเอง

   หมายเหตุ: `"use client"` **ไม่ปิด SSR** — component ยัง render เป็น HTML ครบ
   บนเซิร์ฟเวอร์ SEO ไม่กระทบ · ที่เสียคือ JS payload ที่ RSC เคยช่วยตัด
   payload จึงต้องแก้ด้วย lazy chunk (คำตัดสินข้อ 12) ไม่ใช่ด้วย RSC
   ═══════════════════════════════════════════════════════════════════════════ */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(here, '../03-components/src');

const DIRECTIVE = /^(['"])use client\1;?\s*$/;

/** ทางหนีเมื่อไฟล์ต้องเป็น client ด้วยเหตุที่ heuristic มองไม่เห็น
 *  ต้องเขียนเหตุผลกำกับ — N/A ที่ไม่มีเหตุผลคือที่ซ่อนที่ง่ายที่สุดของช่องโหว่จริง */
const ESCAPE = /\/\*\s*rsc-client:\s*\S+/;

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return walk(p);
    return /\.tsx?$/.test(e.name) ? [p] : [];
  });

/** เหตุผลที่ไฟล์หนึ่ง **ต้อง** เป็น client — คืนลิสต์ว่างถ้าไม่ต้อง */
function clientReasons(code) {
  const why = [];
  if (/from\s+['"]react-aria-components['"]/.test(code)) why.push('import RAC');

  /* hook ทุกตัว ทั้งของ React และของเราเอง — ห้ามเป็นลิสต์ชื่อที่ต้องมาเติมเอง
     เพราะลิสต์แบบนั้นคือสิ่งที่ทำให้นับพลาด 12 ไฟล์ในรอบแรก */
  const hooks = [...code.matchAll(/\b(use[A-Z][A-Za-z]*)\s*\(/g)].map((m) => m[1]);
  if (hooks.length) why.push(`เรียก hook: ${[...new Set(hooks)].sort().join(' ')}`);

  if (/\bcreateContext\s*\(/.test(code)) why.push('createContext');
  if (/^\s+on(Click|Change|Input|Submit|KeyDown|KeyUp|Focus|Blur|Press)=\{/m.test(code))
    why.push('ผูก event handler เข้า DOM');
  return why;
}

const missing = [];
const extra = [];
const misplaced = [];
let needCount = 0;
let pureCount = 0;

for (const file of walk(SRC).sort()) {
  const code = fs.readFileSync(file, 'utf8');
  const rel = path.relative(SRC, file);
  const lines = code.split('\n');

  const at = lines.findIndex((l) => DIRECTIVE.test(l.trim()));
  const has = at !== -1;
  const why = clientReasons(code);
  const escaped = ESCAPE.test(code);

  if (why.length || escaped) needCount++;
  else pureCount++;

  /* directive ต้องเป็น statement แรกของไฟล์ — ถ้าอยู่ใต้ import
     bundler จะไม่ถือว่าเป็น directive แต่เป็นสตริงลอย ๆ ที่ไม่ทำอะไรเลย */
  if (has) {
    const before = lines.slice(0, at).join('\n').trim();
    if (before !== '') {
      misplaced.push(
        `${rel}:${at + 1} — 'use client' อยู่บรรทัดที่ ${at + 1} ไม่ใช่บรรทัดแรก ` +
          'มันจะกลายเป็นสตริงลอย ๆ ที่ไม่ทำอะไรเลย',
      );
    }
  }

  if (why.length && !has) missing.push(`${rel} — ${why.join(' · ')}`);
  if (!why.length && has && !escaped) {
    extra.push(
      `${rel} — ไม่มีเหตุผลต้องเป็น client · ถอด directive ออก ` +
        'หรือใส่ /* rsc-client: <เหตุผล> */ ถ้าจำเป็นจริง',
    );
  }
}

const fail = [...missing, ...extra, ...misplaced];

if (fail.length) {
  if (missing.length) {
    console.error(`\n❌ ขาด 'use client' — ${missing.length} ไฟล์`);
    console.error('   build ของแอป Next จะตายตอน import ไฟล์เหล่านี้\n');
    for (const m of missing) console.error('  · ' + m);
  }
  if (extra.length) {
    console.error(`\n❌ มี 'use client' เกิน — ${extra.length} ไฟล์`);
    console.error(
      '   ถ้าปล่อยไว้ ไลบรารีจะกลายเป็น client ทั้งก้อนโดยไม่มีใครตัดสินใจ\n',
    );
    for (const m of extra) console.error('  · ' + m);
  }
  if (misplaced.length) {
    console.error(`\n❌ directive วางผิดที่ — ${misplaced.length} ไฟล์\n`);
    for (const m of misplaced) console.error('  · ' + m);
  }
  console.error('');
  process.exit(1);
}

console.log(
  `✓ RSC boundary ถูกต้อง — client ${needCount} ไฟล์ · server ${pureCount} ไฟล์`,
);
