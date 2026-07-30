#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════════════
   lint-api-comments — บล็อก "รับ / ไม่รับ" ในหัวไฟล์ต้องตรงกับ prop จริง
   ───────────────────────────────────────────────────────────────────────────
   ★ ทำไมไฟล์นี้ถึงมี

   `.tsx` 15 ไฟล์ที่โดน rename หรือแตะ parity มีบล็อกในหัวไฟล์ที่ประกาศว่า
   **รับ**อะไรจาก Astryx และ **ไม่รับ**อะไร · เป็นคำอ้างเชิง API ที่ตรวจได้
   ด้วยเครื่อง แต่ไม่มีเกตไหนตรวจ — `lint-docs` ดูแค่ `.md`

   วัดเมื่อ 2026-07-29: `FileInput.tsx` เขียนว่า "ไม่รับ … `status` …" ค้างอยู่
   **หนึ่งวัน**หลังจาก `status` ถูกเพิ่มเข้ามาจริงจาก sweep §8.1

   ⚠️ ครั้งแรกที่ลองหาด้วยสคริปต์หยาบ ๆ ได้ **false positive 7 จาก 8** เพราะ
   ตัดขอบบล็อกไม่ถูก แล้วไปกินหมายเหตุ `★★` ด้านล่างที่เอ่ยชื่อ prop ซ้ำ
   ไฟล์นี้จึงตัดที่เส้น `───` หรือ `═══` เท่านั้น และตรวจเฉพาะบรรทัดในบล็อก

   ═══ ขอบเขต — เหลือทิศเดียวโดยเจตนา ═══

   ✅ prop ใต้ `ไม่รับ` **ต้องไม่ถูกประกาศ** ใน `<Component>Props` ของตัวเอง
   ❌ **ไม่ตรวจทิศ `รับ`** — ฉบับแรกตรวจทั้งสองทิศแล้วได้ 36 ข้อ ซึ่งเป็น
      false positive แทบทั้งหมด จากสามสาเหตุ:
        · `รับ \`status\` (เดิมชื่อ \`errorMessage\`)` → ชื่อเก่าในวงเล็บถูกนับ
        · prop ที่สืบทอดจาก `BaseFieldProps` ไม่ได้ประกาศในไฟล์
        · `Token` เขียน "ไม่รับ \`onRemove\`" โดยที่ `onRemove` อยู่บน
          `RemovableChipProps` คนละ interface ในไฟล์เดียวกัน

      และทิศ `รับ` **อันตรายน้อยกว่า**: อ้างว่ารับแล้วไม่มีจริง `tsc` จับให้
      ทันทีที่มีคนใช้ · ส่วนทิศ `ไม่รับ` ไม่มีอะไรจับเลย ซึ่งเป็นทิศที่บั๊กจริง
      (`FileInput` "ไม่รับ \`status\`") อยู่

   ❌ ไม่ตรวจ 48 ไฟล์ที่ไม่มีบล็อกนี้ — ไม่มีคำอ้างให้ตรวจ
      (ต่างจาก §Quality Checklist ที่บังคับครบ 62/62 เพราะเป็นสัญญาของทุกไฟล์)
   ═══════════════════════════════════════════════════════════════════════════ */

import fs from 'node:fs';
import path from 'node:path';

const SRC = path.join(import.meta.dirname, '..', '03-components', 'src');

const walk = (d) =>
  fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(d, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });

/* prop ของ base type ที่ input ทุกตัว extend — อ่านจากแหล่งจริง ไม่ hardcode
   `BaseFieldProps extends LabelledFieldProps` จึงต้องรวมของชั้นล่างเข้าไปด้วย */
const FIELD_BASE = (() => {
  const f = path.join(SRC, 'inputs', 'fieldStyles.ts');
  const src = fs.readFileSync(f, 'utf8');
  const grab = (name) => {
    const m = src.match(new RegExp(`export interface ${name}[\\s\\S]*?\\n\\}`));
    return m ? [...m[0].matchAll(/^\s{2}([a-z][a-zA-Z0-9]*)\??:/gm)].map((x) => x[1]) : [];
  };
  const labelled = grab('LabelledFieldProps');
  return { LabelledFieldProps: labelled, BaseFieldProps: [...labelled, ...grab('BaseFieldProps')] };
})();

const problems = [];
let checked = 0;

for (const abs of walk(SRC).filter((f) => f.endsWith('.tsx'))) {
  const rel = path.relative(path.join(SRC, '..', '..'), abs);
  const src = fs.readFileSync(abs, 'utf8');
  if (!/^\s*ไม่รับ\s/m.test(src)) continue;
  checked++;

  /* ── เก็บชื่อ prop ใต้ `ไม่รับ` — จบบล็อกที่เส้น ─── หรือ ═══ ───────────
     ★ ตัดข้อความในวงเล็บออกก่อน เพราะ "(เดิมชื่อ `x`)" และ "(D16)" ไม่ใช่
       การประกาศว่ารับ/ไม่รับ prop นั้น */
  const lines = src.split('\n');
  const refused = new Set();
  let inBlock = false;

  for (const raw of lines) {
    if (/[─═]{5,}/.test(raw)) { inBlock = false; continue; }
    if (/^\s*ไม่รับ\s/.test(raw)) inBlock = true;
    else if (/^\s*(รับ|คงไว้)\s/.test(raw)) inBlock = false;
    else if (inBlock && !/^\s{9,}\S/.test(raw)) inBlock = false;
    if (!inBlock) continue;

    const line = raw.replace(/\([^)]*\)/g, ' ');
    for (const m of line.matchAll(/`([a-z][a-zA-Z0-9]*)`/g)) refused.add(m[1]);
  }
  if (!refused.size) continue;

  /* ── prop ของ component **หลัก** ของไฟล์นี้เท่านั้น ────────────────────
     ★★ ต้องจำกัดที่ interface ที่ตรงชื่อไฟล์ · ไฟล์เดียวมีได้หลาย component
     และบล็อก "ไม่รับ" หมายถึงตัวหลักเสมอ

     เคสที่สอนเรื่องนี้: `Token.tsx` เขียนว่า "ไม่รับ `onRemove` — มีอยู่แล้ว
     ใน `RemovableChip` แยกต่างหาก ไม่ใช่ prop ของ `Token`" ซึ่ง**ถูกต้อง**
     แต่ฉบับก่อนของเกตกวาดทุก interface ในไฟล์แล้วฟ้องผิด */
  const main = path.basename(abs, '.tsx');
  const iface = src.match(
    new RegExp(`export interface ${main}Props[\\s\\S]*?\\n\\}`),
  );
  if (!iface) continue;
  const own = new Set(
    [...iface[0].matchAll(/^\s{2}([a-z][a-zA-Z0-9]*)\??:/gm)].map((m) => m[1]),
  );

  /* ★★★ ต้องรวม prop ที่ **สืบทอด** มาด้วย ไม่ใช่แค่ที่ประกาศเอง

     ฉบับก่อนเขียวทั้งที่ฉีดบั๊กเดิมกลับเข้าไป (`FileInput` "ไม่รับ status")
     เพราะ `status` มาจาก `LabelledFieldProps` จึงไม่อยู่ในเนื้อ interface
     ⇒ **เกตเขียวเพราะตาบอด ไม่ใช่เพราะถูก** — รูปเดียวกับ sweep ที่ตรวจ
     0 element แล้วก็เขียวเหมือนกัน จึงต้องพิสูจน์ว่า fail ได้ทุกครั้ง */
  for (const base of iface[0].match(/\b(LabelledFieldProps|BaseFieldProps)\b/g) ?? []) {
    for (const p of FIELD_BASE[base] ?? []) own.add(p);
  }

  for (const p of refused) {
    if (own.has(p)) {
      problems.push(
        `${rel}: หัวไฟล์เขียนว่า **ไม่รับ** \`${p}\` แต่ prop นั้นถูกประกาศจริงในไฟล์นี้`,
      );
    }
  }
}

if (problems.length) {
  console.error(`\n✗ คอมเมนต์ API: ${problems.length} ข้อ\n`);
  for (const p of problems) console.error(`  ✗ ${p}`);
  console.error('\nแก้คอมเมนต์ให้ตรงกับ prop จริง — คำอ้างเชิง API ที่ผิดพาคนอ่านไปทางที่ผิด\n');
  process.exit(1);
}

console.log(`✓ คอมเมนต์ API ตรงกับโค้ด — ตรวจ ${checked} ไฟล์`);
