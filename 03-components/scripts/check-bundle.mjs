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
    /* ⚠️⚠️ วัดได้ **142.4 KB** — นี่คือหน้าที่คำตัดสิน 2026-07-26 เรื่อง
       lazy-load พูดถึงโดยตรง เพราะมี `DateInput` (+59) กับ `Selector` (+40)
       อยู่ด้วยกัน · สูงเกินเกณฑ์อุปกรณ์ในข้อ 01 (Android ระดับล่าง 4G)

       เพดานตั้งชิด **เพื่อกันการโตต่อ ไม่ใช่เพื่อรับรองค่านี้** — หน้าที่ของ
       เกตคือกัน drift หลักเดียวกับเพดาน parity · ทางแก้จริงคือ lazy-load
       ซึ่งเป็นงานที่กระทบผู้เรียก จึงบันทึกเป็นหนี้ใน QUALITY.md */
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

try {
  for (const page of PAGES) {
    const entry = path.join(ROOT, `__bundle-probe-${rows.length}.tsx`);
    const out = path.join(tmp, `${rows.length}.js`);
    fs.writeFileSync(entry, page.imports);
    try {
      execFileSync(
        'npx',
        [
          'esbuild', entry,
          '--bundle', '--minify', '--format=esm',
          '--loader:.tsx=tsx', '--jsx=automatic',
          '--define:process.env.NODE_ENV="production"',
          `--outfile=${out}`,
          '--log-level=error',
        ],
        { cwd: ROOT, stdio: ['ignore', 'ignore', 'pipe'] },
      );
    } finally {
      fs.rmSync(entry, { force: true });
    }

    const kb = gzipKb(fs.readFileSync(out));
    const over = kb > page.budget;
    if (over) failed = true;
    rows.push({ ...page, kb, over });
  }
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}

const pad = (s, n) => String(s).padEnd(n);
console.log('\nขนาด bundle (gzip · production · minify)\n');
for (const r of rows) {
  const mark = r.over ? '✗' : '✓';
  const pct = Math.round((r.kb / r.budget) * 100);
  console.log(
    `  ${mark} ${pad(r.name, 38)} ${r.kb.toFixed(1).padStart(6)} KB` +
      ` / เพดาน ${String(r.budget).padStart(3)} KB  (${pct}%)`,
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
