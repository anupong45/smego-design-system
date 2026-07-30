#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════════════
   check-bundle — เพดานขนาด bundle ต่อหน้า
   ───────────────────────────────────────────────────────────────────────────
   ★ ทำไมไฟล์นี้ถึงมี

   รอบ grill 2026-07-26 ตัดสินว่า **"per-page bundle budget ใน verify +
   lazy-load 3 ตัว"** เพราะวัดแล้วพบว่าต้นทุนกระจุกอยู่ไม่กี่ตัว
   (`DateInput` +59 · `Typeahead` +43 · `Selector` +40 KB gzip)

   ผ่านไปสามวัน ของจริงคือ `index.ts:27` มีแต่ **คอมเมนต์แนะนำ** ให้ lazy-load
   ไม่มีเกต และไม่มี `lazy()` ที่ไหนเลย — เจตนาที่ไม่มีหลักฐาน รูปเดียวกับ
   contrast sweep ที่ค้างอยู่สามวันก่อนจะได้ทำ

   ═══ วิธีวัด ═══

   สร้าง entry จำลอง **หนึ่งไฟล์ต่อหนึ่งรูปแบบหน้า** แล้ว bundle ด้วย esbuild
   โหมด production + minify + gzip · เทียบกับเพดานในตาราง `PAGES`

   ★ วัด **gzip** ไม่ใช่ raw — เพราะนั่นคือสิ่งที่เดินผ่านสายจริง
   ★ วัดจาก entry จำลอง ไม่ใช่จาก `gallery.js` เพราะ gallery import ทุกตัว
     และ build ด้วย NODE_ENV=development ซึ่งเป็นตัวเลขที่ไม่มีใครโหลดจริง

   ⚠️ เพดานตั้งจากค่าที่วัดได้ **บวกช่องว่างพอสมควร** ไม่ใช่ตัวเลขกลม ๆ
   ที่คิดเอาเอง · ถ้าเกิน ให้ดูก่อนว่าเป็นของจริงหรือแค่ต้อง lazy-load

   ═══ ★★★ ต้องวัดด้วย `--splitting` ไม่ใช่ `--outfile` ═══

   ฉบับก่อน 2026-07-30 ใช้ `--bundle --outfile` **ไม่มี `--splitting`**
   ⇒ esbuild ยัด dynamic import กลับเข้าไฟล์เดียว · เพดานจึงวัด "ผลรวมของโค้ด
   ทั้งหมดที่หน้านั้นอ้างถึง" ไม่ใช่ "สิ่งที่ผู้ใช้ดาวน์โหลดตอนเปิดหน้า"

   ผลคือเกตนี้ **มองไม่เห็นผลของ lazy-load เลย** — ทำ `lazy()` ไปแล้วตัวเลข
   ไม่ขยับ ซึ่งอ่านได้ว่า "งานนั้นไร้ผล" ทั้งที่ผู้ใช้ได้ประโยชน์จริง
   เกตที่วัดผิดหน่วยแย่กว่าไม่มีเกต เพราะมันชี้ให้เลิกทำสิ่งที่ถูก

   ตอนนี้ bundle ด้วย `--splitting --outdir` + `--metafile` แล้วแยกสองตัวเลข:

     initial — entry chunk + ทุก chunk ที่ **static import** ต่อกันมา
               = สิ่งที่เดินผ่านสายก่อน first paint · **เพดานคุมตัวนี้**
     lazy    — chunk ที่เข้าถึงได้เฉพาะผ่าน `import()` = มาเมื่อผู้ใช้สั่ง

   พิสูจน์แล้วว่าแยกถูก: module ที่โหลดผ่าน `import()` เท่านั้น และมีเนื้อ
   บีบไม่ได้ 90 KB gzip → initial คงที่ 42.9 KB · lazy 88.2 KB

   ⚠️ esbuild ตั้ง `entryPoint` ให้ **chunk ของ dynamic import ด้วย** —
      ต้องจับคู่กับ path ของ entry จำลอง ไม่ใช่ "อันไหนก็ได้ที่มี entryPoint"

   ═══ ★★★ วัดแล้ว: `lazy()` ในไลบรารีนี้ **ไม่ลด initial** (2026-07-30) ═══

   คำตัดสิน grill 2026-07-26 (และย้ำใน 07-30 ข้อ 12) บอกให้ "แยกปฏิทินของ
   `DateInput` เป็น lazy chunk ในรีโปนี้ · 142 → ~85 KB" · **ทำแล้ว วัดแล้ว
   สมมติฐานผิด**:

   1 ของหนักคือ **`DatePicker` เอง ไม่ใช่ `Calendar`** —
     `react-aria-components/dist/private/Calendar.mjs` มีแค่ **4.3 KB**
     ส่วนที่หนักคือ `@internationalized/date` + เลขคณิตวันที่ของ react-stately
     ซึ่ง `DatePicker` ลากมาเองไม่ว่าจะแยกปฏิทินหรือไม่ ⇒ กำไรจริง ~6 KB

   2 **มันทำให้หน้าอื่นแย่ลง** — หน้ารายการสินค้าโต 44.5 → **67.1 KB**
     เพราะ esbuild ยก input ที่ทั้ง entry และ chunk lazy เข้าถึงได้ขึ้นไปอยู่ใน
     shared chunk ที่ entry **static import** · หน้าที่ไม่มี `DateInput` เลย
     ต้องแบกโค้ดปฏิทินด้วย

   3 lazy **ทั้ง `DateInput`** ก็ไม่ช่วย — shared chunk ยัง 137.4 KB
     เพราะ entry import `react-aria-components` สำหรับ `TextInput` อยู่แล้ว
     และ RAC เป็น module graph เดียว

   ตัวเลขที่เชื่อได้ มาจากการ build **แยกกัน**:
       form มี DateInput      142.5 KB
       form ไม่มี DateInput   102.3 KB
   ⇒ 40 KB นั้นประหยัดได้เมื่อหน้านั้น **ไม่อ้างถึง `DateInput` เลย**
     ไม่ใช่เมื่อห่อด้วย `lazy()`

   ⇒ **เจ้าของเรื่องนี้คือรีโปแอป** ผ่าน route-level splitting ที่ Next ทำเอง
     (หน้าที่ไม่ import `DateInput` ไม่ได้รับมัน) ไม่ใช่ wrapper ในไลบรารี
     ⚠️ webpack chunk ต่างจาก esbuild และอาจย้ายออกได้จริง — **แต่พิสูจน์ใน
        รีโปนี้ไม่ได้** จึงไม่อ้าง · ถ้าจะอ้าง ต้องวัดที่รีโปแอป
   ═══════════════════════════════════════════════════════════════════════════ */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';
import { execFileSync } from 'node:child_process';

const ROOT = path.join(import.meta.dirname, '..');

/** หนึ่งแถว = หนึ่งรูปแบบหน้าจริงในระบบ · `budget` เป็น KB gzip */
const PAGES = [
  {
    name: 'listing — หน้ารายการสินค้า',
    /* วัดได้ 44.4 · เพดานให้ช่องว่างพอเพิ่ม component เล็ก ๆ ได้ไม่กี่ตัว */
    budget: 50,
    imports: `
      import { SmeGoProvider, TopNav, BottomNav, Container, Section, Grid,
        ProductCard, Token, ChipRow, Pagination, EmptyState, Skeleton,
        Badge, Card, Button, IconButton, Link, Icon } from './src/index';
      export const use = [SmeGoProvider, TopNav, BottomNav, Container, Section,
        Grid, ProductCard, Token, ChipRow, Pagination, EmptyState, Skeleton,
        Badge, Card, Button, IconButton, Link, Icon];
    `,
  },
  {
    name: 'form — หน้าขอสินเชื่อ (input หนัก)',
    /* ⚠️⚠️ วัดได้ **142.5 KB** — สูงเกินเกณฑ์อุปกรณ์ในข้อ 01 (Android ระดับล่าง 4G)
       เพดานตั้งชิด **เพื่อกันการโตต่อ ไม่ใช่เพื่อรับรองค่านี้**

       ★ **`lazy()` ในไลบรารีแก้ข้อนี้ไม่ได้ — วัดแล้ว 2026-07-30** ดูหัวไฟล์
       `DateInput` คิดเป็น 40.2 KB ของหน้านี้ (102.3 → 142.5) และหายได้เฉพาะเมื่อ
       หน้านั้น **ไม่อ้างถึงมันเลย** ⇒ เป็นเรื่องของ route-level splitting
       ในรีโปแอป ไม่ใช่ของ component · ห้ามเพิ่ม `lazy()` กลับมาโดยไม่วัดใหม่
       เพราะครั้งก่อนมันทำให้หน้ารายการสินค้าโต 44.5 → 67.1 KB */
    budget: 148,
    imports: `
      import { SmeGoProvider, TextInput, TextArea, CheckboxInput, CheckboxList,
        RadioList, Radio, Selector, NumberInput, DateInput, FileInput, Switch,
        Slider, Button, Banner } from './src/index';
      export const use = [SmeGoProvider, TextInput, TextArea, CheckboxInput,
        CheckboxList, RadioList, Radio, Selector, NumberInput, DateInput,
        FileInput, Switch, Slider, Button, Banner];
    `,
  },
  {
    name: 'full — import ทุกตัว (เพดานสูงสุด)',
    /* วัดได้ 186.3 · ไม่มีหน้าไหนโหลดทั้งหมดจริง แถวนี้เป็นเพดานของระบบ */
    budget: 200,
    imports: `
      import * as all from './src/index';
      export const use = all;
    `,
  },
];

const gzipKb = (buf) => zlib.gzipSync(buf, { level: 9 }).length / 1024;

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'smego-bundle-'));
const rows = [];
let failed = false;

/** chunk ที่เข้าถึงได้จาก entry โดย **ไม่ผ่าน** `import()` — คือของที่มาก่อน paint */
function initialChunks(meta, entryOut) {
  const seen = new Set([entryOut]);
  const queue = [entryOut];
  while (queue.length) {
    const cur = queue.pop();
    for (const imp of meta.outputs[cur]?.imports ?? []) {
      /* kind: 'import-statement' = static · 'dynamic-import' = โหลดเมื่อสั่ง */
      if (imp.kind !== 'import-statement') continue;
      if (seen.has(imp.path)) continue;
      seen.add(imp.path);
      queue.push(imp.path);
    }
  }
  return seen;
}

try {
  for (const page of PAGES) {
    const i = rows.length;
    const entry = path.join(ROOT, `__bundle-probe-${i}.tsx`);
    const outdir = path.join(tmp, String(i));
    const metaPath = path.join(tmp, `meta-${i}.json`);
    fs.writeFileSync(entry, page.imports);
    try {
      execFileSync(
        'npx',
        [
          'esbuild', entry,
          '--bundle', '--minify', '--format=esm', '--splitting',
          '--loader:.tsx=tsx', '--jsx=automatic',
          '--define:process.env.NODE_ENV="production"',
          `--outdir=${outdir}`,
          `--metafile=${metaPath}`,
          '--log-level=error',
        ],
        { cwd: ROOT, stdio: ['ignore', 'ignore', 'pipe'] },
      );
    } finally {
      fs.rmSync(entry, { force: true });
    }

    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    /* ⚠️ esbuild ตั้ง `entryPoint` ให้ **chunk ของ dynamic import ด้วย** —
       `Object.keys(...).find(o => outputs[o].entryPoint)` จึงคืน chunk ผิดตัวได้
       ต้องจับคู่กับ path ของ entry จำลองที่เราเขียนเอง ไม่ใช่ "อันไหนก็ได้ที่มี
       entryPoint" · เจอบั๊กนี้ตอนวัดการแยกปฏิทินเมื่อ 2026-07-30 */
    const entryRel = path.relative(ROOT, entry);
    const entryOut = Object.keys(meta.outputs).find(
      (o) => meta.outputs[o].entryPoint === entryRel,
    );
    if (!entryOut) {
      console.error(`❌ หา entry chunk ของ "${page.name}" ไม่เจอใน metafile`);
      process.exit(1);
    }

    const initial = initialChunks(meta, entryOut);
    const kbOf = (rel) =>
      gzipKb(fs.readFileSync(path.join(ROOT, rel)));

    let initialKb = 0;
    let lazyKb = 0;
    let lazyCount = 0;
    for (const out of Object.keys(meta.outputs)) {
      if (!out.endsWith('.js')) continue;
      if (initial.has(out)) initialKb += kbOf(out);
      else {
        lazyKb += kbOf(out);
        lazyCount++;
      }
    }

    const over = initialKb > page.budget;
    if (over) failed = true;
    rows.push({ ...page, kb: initialKb, lazyKb, lazyCount, over });
  }
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}

const pad = (s, n) => String(s).padEnd(n);
console.log(
  '\nขนาด bundle (gzip · production · minify · --splitting)\n' +
    '  initial = ก่อน first paint (เพดานคุมตัวนี้) · lazy = มาเมื่อผู้ใช้สั่ง\n',
);
for (const r of rows) {
  const mark = r.over ? '✗' : '✓';
  const pct = Math.round((r.kb / r.budget) * 100);
  const lazy =
    r.lazyCount > 0
      ? `  + lazy ${r.lazyKb.toFixed(1)} KB (${r.lazyCount} chunk)`
      : '';
  console.log(
    `  ${mark} ${pad(r.name, 38)} ${r.kb.toFixed(1).padStart(6)} KB` +
      ` / เพดาน ${String(r.budget).padStart(3)} KB  (${pct}%)${lazy}`,
  );
}

if (failed) {
  console.error(
    '\n✗ เกินเพดาน — ตรวจก่อนว่าเป็นของจริงหรือแค่ต้อง lazy-load\n' +
      '  ต้นทุนกระจุกอยู่ไม่กี่ตัว: DateInput · Typeahead · Selector (ดู index.ts §bundle)\n' +
      '  ถ้าเพิ่มจริงและรับได้ ให้ขยับเพดานใน scripts/check-bundle.mjs พร้อมเหตุผล\n',
  );
  process.exit(1);
}

console.log('\n✓ ทุกหน้าอยู่ในเพดาน\n');
