#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · ตรวจ class ที่ใช้สีนอกระบบ
   ───────────────────────────────────────────────────────────────────────────
   ★★ ทำไมต้องมีทั้งไฟล์นี้ **และ** `--color-*: initial`

   `--color-*: initial` ใน `semantic.css` ทำให้ `bg-red-500` ไม่ถูกสร้างเป็น CSS
   — **แต่ build ยังผ่าน `exit 0` ไม่มี warning เลย** (วัดแล้ว)

   ผลคือ `<div className="text-white">` จะ render โดยไม่มีสีที่เขียนไว้
   ซึ่งเงียบกว่าการเขียนผิดแบบเดิมเสียอีก

   ไฟล์นี้คือตัวที่ **ฟ้องจริง** พร้อม file:line และชื่อ token ที่ควรใช้แทน
   `--color-*: initial` เป็นตาข่ายกันของที่หลุดสายตา (เช่น class ที่ประกอบ
   ตอน runtime ซึ่ง grep จับไม่ได้)

   ═══ ทำไมไม่ใช้ ESLint ═══
   `className` เป็นสตริง — ESLint เห็นเป็น literal ไม่ใช่ AST ของ class
   ปลั๊กอินที่อ่าน Tailwind ต้องตั้งค่าเยอะและช้ากว่า grep มาก
   สำหรับกฎข้อเดียวที่ชัดเจนแบบนี้ การสแกนข้อความตรง ๆ อ่านง่ายและเร็วกว่า
   ═══════════════════════════════════════════════════════════════════════════ */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

/* ═══════════════════════════════════════════════════════════════════════════
   ใช้ได้สองโหมด
   ───────────────────────────────────────────────────────────────────────────
   1 **ในรีโปนี้** — ไม่ส่ง argument · สแกน `03-components/src` เหมือนเดิมเป๊ะ
   2 **ในรีโปแอป** — `npx smego-lint-classes src app` · สแกน path ที่ส่งมา
     เทียบกับ cwd

   ★★★ ทำไมต้องให้แอปรันได้

   กฎ 11 ข้อใน `theme.css` (ห้ามสีดิบ · ห้าม `shadow-md` · ห้าม `rounded-full`
   บนปุ่ม · scroll container ต้องมี `relative` ฯลฯ) **พังเหมือนกันไม่ว่าจะเขียน
   ที่รีโปไหน** — hex ดิบในโค้ดหน้าเว็บทำให้โหมดมืดเสียเท่ากับ hex ในไลบรารี
   แต่เกตพวกนี้เคยรันเฉพาะในรีโปนี้ ⇒ ทีมแอปคนละรีโปเขียนอะไรก็ได้

   รีโปนี้มีหลักฐานว่า **กฎที่ไม่มีเกตบังคับจะกลายเป็นเท็จภายในสัปดาห์เดียว
   และคนที่ทำให้เป็นเท็จมักคือคนที่เขียนกฎนั้น** (`lint-docs.mjs` หัวไฟล์)
   การหวังว่าทีมที่ไม่เคยอ่าน CLAUDE.md จะจำกฎ 11 ข้อได้ คือการเดิมพันที่
   รีโปนี้แพ้มาแล้วในทีมตัวเอง
   ═══════════════════════════════════════════════════════════════════════════ */
const ARGS = process.argv.slice(2).filter((a) => !a.startsWith('--'));

/** ไม่มี argument = โหมดในรีโปนี้ · root คือรากของ repo ไม่ใช่ cwd
    เพื่อให้เลขบรรทัดและ path ที่รายงานเหมือนเดิมทุกตัวอักษร */
const ROOT = ARGS.length
  ? process.cwd()
  : join(fileURLToPath(new URL('.', import.meta.url)), '..');
const SCAN_DIRS = ARGS.length ? ARGS : ['03-components/src'];

/* palette เริ่มต้นของ Tailwind ที่ถูกลบไปแล้ว */
const PALETTE = [
  'slate', 'gray', 'zinc', 'neutral', 'stone',
  'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal',
  'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose',
];

/* utility prefix ที่กินสี */
const PREFIXES = [
  'bg', 'text', 'border', 'fill', 'stroke', 'ring', 'outline', 'shadow',
  'decoration', 'divide', 'accent', 'caret', 'placeholder', 'from', 'to', 'via',
];

/**
 * `transparent` · `current` · `inherit` · `none` **ไม่ถูกลบ** โดย
 * `--color-*: initial` — ยืนยันด้วยการ build แล้ว จึงไม่ต้องห้าม
 */
const ALLOWED_KEYWORDS = ['transparent', 'current', 'inherit', 'none', 'auto'];

const prefixGroup = PREFIXES.join('|');
const paletteGroup = PALETTE.join('|');

/* bg-red-500 · text-white · border-neutral-300 · bg-white/50 */
const RAW_COLOR = new RegExp(
  `\\b(${prefixGroup})-(${paletteGroup}|white|black)(-\\d{1,3})?(\\/\\d{1,3})?\\b`,
  'g',
);

/** สีที่เขียนตรง ๆ ใน className — #fff · rgb() · hsl() */
const LITERAL_COLOR = /\b(?:bg|text|border|fill|stroke)-\[(?:#|rgb|hsl|oklch)[^\]]*\]/g;

/**
 * ★★★ ขั้นอ่อนของ ramp ใช้เป็น **พื้น** ไม่ได้
 *
 * ramp `primary-*` **ไม่ถูก override ในโหมดมืดโดยตั้งใจ** (ปุ่มเปลี่ยนสีไม่ได้)
 * ดังนั้น `primary-50` = #F0F9FE ยังขาวจัดในโหมดมืด ขณะที่ `--color-fg`
 * = #F1F3F6 → **1.04:1 มองไม่เห็นเลย**
 *
 * เจอจริง: `Radio layout="card"` ที่เลือกอยู่ ซึ่งใช้ใน `PaymentMethodSelect`
 * ผู้ใช้โหมดมืดเลือกวิธีชำระเงินแล้วอ่านไม่ออก — หลุด review ด้วยตามาได้
 * เพราะการตรวจ contrast เป็นแบบสุ่มจุด
 *
 * ใช้ `bg-selected-surface` / `bg-info-surface` / `bg-sunken` แทน
 * (ทุกตัว override ในโหมดมืดแล้ว)
 */
const PALE_RAMP_AS_SURFACE =
  /\b(?:bg|border)-(primary|success|warning|danger|accent|info)-(50|100|200)\b/g;

/**
 * ★★ `z-<number>` ดิบ — ต้องใช้ `z-(--z-*)` เท่านั้น
 *
 * ก่อนมี z-index scale ระบบใช้ `z-10` `z-40` `z-50` กระจัดกระจาย
 * ไม่มีใครรู้ว่าตัวเลขไหนหมายถึงชั้นอะไร และการเพิ่มของใหม่ต้องเดา
 * (Toast · BottomNav · Popover กำลังจะมาใน Pass 3–4)
 */
const RAW_Z_INDEX = /\bz-\d+\b/g;

/**
 * ★★★ component ห้ามเขียนตัวแปรของแถบอื่น หรือแตะ body
 *
 * เคยเจอ: `CompareBar` เขียน `--bottom-nav-height` (ของ BottomNav) และ
 * `body.style.paddingBottom` → พังทันทีที่มีสองแถบ (last-writer-wins)
 * แต่ละแถบต้องเขียน **ตัวแปรของตัวเอง** แล้วให้ `calc()` รวม
 */
/* ═══ ข้อ 4 ของ theme.css — spacing/radius ต้องอยู่ในสเกลที่อนุมัติ ═══
   ★★★ คำตัดสิน 2026-07-30: **ข้อ 4 ถูก · ข้อ 5 ผิด**

   เดิม `theme.css` ขัดกันเอง — ข้อ 4 ระบุ `0.5` อยู่ในชุดที่อนุมัติ ขณะที่ข้อ 5
   ห้าม `p-0.5`/`gap-0.5` · เจ้าของระบบตัดสินว่า **ห้ามเฉพาะค่าที่อยู่นอกสเกล**
   `0.5` ใช้ได้เพราะอยู่ในสเกล ⇒ ข้อ 5 ถูกถอน และข้อ 4 ถูกบังคับด้วยกฎนี้

   วัดก่อนเขียน (2026-07-30) พบค่านอกสเกล **9 จุด**:
     · `1.5` (6px) 7 จุด — `-me-1.5 -mt-1.5` ของปุ่มปิด 3 ที่ + `gap-1.5` 1 ที่
       แก้แล้ว: ปุ่มปิด → `-me-2 -mt-2` (8px = `p-2` ของ IconButton md เป๊ะ
       ⇒ ขอบไอคอนตรงกับขอบเนื้อหา · 6px เดิมเป็นค่าประมาณ) · gap → `gap-1`
     · `env(safe-area-inset-bottom)` 2 จุด — **ยกเว้น** ดูด้านล่าง

   ⚠️ ยกเว้น `env()` โดยเจตนา — safe-area ของ iOS เป็นค่าที่ **อุปกรณ์บอก**
      ไม่ใช่ค่าที่นักออกแบบเลือก จึงไม่มีทางอยู่ในสเกลใด ๆ · การบังคับให้ใช้
      ค่าคงที่แทนจะทำให้แถบล่างทับ home indicator บน iPhone รุ่นมีรอยบาก
      (ข้อยกเว้นอื่นห้ามเพิ่มโดยไม่เขียนเหตุผลไว้ที่นี่) */
const APPROVED_SPACE = new Set([
  '0', '0.5', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20', '24', '32',
  'px',   /* 1px hairline — ใช้กับเส้นคั่นและขอบ */
]);

/** utility ที่กินค่า spacing · `w-`/`h-` ไม่รวมเพราะเป็นขนาด ไม่ใช่ระยะห่าง */
const SPACE_UTIL =
  /(?<![\w-])(-?)(p|m|gap|space)(x|y|s|e|t|b|l|r|-x|-y)?-((?:\[[^\]]*\])|[0-9.]+|px)(?![\w-])/g;

/** radius: คำในสเกล · `full`/`none` · หรือรูป token `(--radius-*)` */
const RADIUS_UTIL =
  /(?<![\w-])rounded(?:-(?:ss|se|es|ee|s|e|t|b|l|r|tl|tr|bl|br))?(?:-([\w.[\]()-]+))?(?![\w-])/g;
const APPROVED_RADIUS = new Set(['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', 'full']);

const FORBIDDEN_GLOBAL_WRITE =
  /(?:body|documentElement)\.style\.(?:paddingBottom|padding|scrollPaddingBottom)\s*=|setProperty\(\s*['"]--bottom-inset['"]/g;

const SUGGESTIONS = {
  white: 'text-on-brand (บนพื้นทึบ) · bg-surface · bg-scannable (เฉพาะ QR)',
  black: 'text-fg · bg-inverse',
  gray: 'text-fg-muted · border-edge · bg-sunken',
  slate: 'text-fg-muted · border-edge · bg-sunken',
  neutral: 'text-fg-secondary · border-edge-strong',
  red: 'text-danger-icon · bg-danger-surface · border-edge-danger',
  green: 'text-success-icon · bg-success-surface',
  yellow: 'text-warning-icon · bg-warning-surface',
  amber: 'text-warning-icon · bg-warning-surface',
  blue: 'text-link · bg-primary-600 · border-edge-brand',
  sky: 'bg-primary-600 · text-link',
};

/**
 * ลบเนื้อหาในคอมเมนต์ออกก่อนสแกน โดย**คงจำนวนบรรทัดไว้เท่าเดิม**
 * เพื่อให้เลขบรรทัดที่รายงานยังตรง
 *
 * ⚠️ การเช็คทีละบรรทัดว่าขึ้นต้นด้วย `*` ไม่พอ — คอมเมนต์ JSX หลายบรรทัด
 * ที่อธิบาย anti-pattern (`ใช้ token ไม่ใช่ \`bg-white\``) จะถูกจับผิด
 * เจอมาแล้วตอนรันครั้งแรก
 */
function stripComments(source) {
  let out = '';
  let mode = 'code'; // code | line | block | single | double | template
  for (let i = 0; i < source.length; i++) {
    const c = source[i];
    const next = source[i + 1];

    if (mode === 'code') {
      if (c === '/' && next === '/') { mode = 'line'; out += '  '; i++; continue; }
      if (c === '/' && next === '*') { mode = 'block'; out += '  '; i++; continue; }
      if (c === "'") mode = 'single';
      else if (c === '"') mode = 'double';
      else if (c === '`') mode = 'template';
      out += c;
      continue;
    }

    if (mode === 'line') {
      if (c === '\n') { mode = 'code'; out += c; } else out += ' ';
      continue;
    }

    if (mode === 'block') {
      if (c === '*' && next === '/') { mode = 'code'; out += '  '; i++; continue; }
      out += c === '\n' ? '\n' : ' ';
      continue;
    }

    /* ในสตริง — เก็บไว้ตามเดิม เพราะ className อยู่ในนี้ */
    if ((mode === 'single' && c === "'") ||
        (mode === 'double' && c === '"') ||
        (mode === 'template' && c === '`')) {
      mode = 'code';
    }
    out += c;
  }
  return out;
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(tsx?|css)$/.test(entry)) out.push(full);
  }
  return out;
}

const findings = [];

for (const scanDir of SCAN_DIRS) {
  const abs = join(ROOT, scanDir);
  for (const file of walk(abs)) {
    /* ★ ลบคอมเมนต์ก่อน — เอกสารต้องยกตัวอย่างสิ่งที่ห้ามทำได้
       โดยไม่ทำให้ linter ฟ้อง */
    const lines = stripComments(readFileSync(file, 'utf8')).split('\n');

    lines.forEach((line, i) => {
      for (const match of line.matchAll(RAW_COLOR)) {
        const colour = match[2];
        if (ALLOWED_KEYWORDS.includes(colour)) continue;
        findings.push({
          file: relative(ROOT, file),
          line: i + 1,
          found: match[0],
          suggest: SUGGESTIONS[colour] ?? 'ใช้ token จาก semantic.css',
        });
      }

      for (const match of line.matchAll(LITERAL_COLOR)) {
        findings.push({
          file: relative(ROOT, file),
          line: i + 1,
          found: match[0],
          suggest: 'สีดิบห้ามอยู่นอก primitives.css — ประกาศเป็น token ก่อน',
        });
      }

      for (const match of line.matchAll(PALE_RAMP_AS_SURFACE)) {
        findings.push({
          file: relative(ROOT, file),
          line: i + 1,
          found: match[0],
          suggest:
            'ramp ไม่ถูก override ในโหมดมืด → ขั้น 50/100/200 เป็นพื้นแล้วได้ ~1.04:1 · ' +
            'ใช้ bg-selected-surface · bg-info-surface · bg-sunken',
        });
      }

      for (const match of line.matchAll(RAW_Z_INDEX)) {
        findings.push({
          file: relative(ROOT, file),
          line: i + 1,
          found: match[0],
          suggest:
            'ใช้ z-(--z-raised) · z-(--z-sticky) · z-(--z-bar) · ' +
            'z-(--z-overlay) · z-(--z-modal) · z-(--z-toast)',
        });
      }

      for (const match of line.matchAll(SPACE_UTIL)) {
        const value = match[4];
        /* ค่าที่อุปกรณ์บอก ไม่ใช่ค่าที่เลือก — ดูเหตุผลที่หัว APPROVED_SPACE */
        if (value.startsWith('[') && value.includes('env(')) continue;
        if (APPROVED_SPACE.has(value)) continue;
        findings.push({
          file: relative(ROOT, file),
          line: i + 1,
          found: match[0],
          suggest:
            `ค่า \`${value}\` อยู่นอกสเกลที่อนุมัติ — ใช้ได้เฉพาะ ` +
            `${[...APPROVED_SPACE].join(' ')} (theme.css ข้อ 4)`,
        });
      }

      for (const match of line.matchAll(RADIUS_UTIL)) {
        const value = match[1];
        if (value === undefined) continue;          /* `rounded-ss` เฉย ๆ = ค่าปริยาย */
        if (value.startsWith('(--radius-')) continue; /* รูป token ที่ระบบใช้จริง */
        if (APPROVED_RADIUS.has(value)) continue;
        findings.push({
          file: relative(ROOT, file),
          line: i + 1,
          found: match[0],
          suggest:
            `radius \`${value}\` อยู่นอกสเกล — ใช้ ` +
            `${[...APPROVED_RADIUS].join(' ')} หรือรูป token \`rounded-(--radius-*)\` ` +
            '(theme.css ข้อ 4)',
        });
      }

      for (const match of line.matchAll(FORBIDDEN_GLOBAL_WRITE)) {
        findings.push({
          file: relative(ROOT, file),
          line: i + 1,
          found: match[0],
          suggest:
            'แถบที่ยึดก้นจอเขียนได้เฉพาะตัวแปรของตัวเอง (เช่น --compare-bar-height) · ' +
            'base.css §5a จองพื้นที่จาก --bottom-inset ให้แล้ว',
        });
      }
    });
  }
}

if (findings.length === 0) {
  console.log(
  '✅ ผ่าน — สีนอกระบบ · สีดิบ · ramp เป็นพื้น · z-index ดิบ · ' +
    'สเกล spacing/radius · การเขียนตัวแปรของแถบอื่น',
);
  process.exit(0);
}

console.error(`\n❌ พบ class ที่ผิดกฎ ${findings.length} จุด\n`);
console.error(
  '   สีเหล่านี้ถูกลบไปแล้วด้วย `--color-*: initial` ใน semantic.css',
);
console.error('   จะไม่ถูกสร้างเป็น CSS และจะไม่มีผลใด ๆ ตอน render\n');

for (const f of findings) {
  console.error(`   ${f.file}:${f.line}`);
  console.error(`     พบ:     ${f.found}`);
  console.error(`     ใช้แทน: ${f.suggest}\n`);
}

process.exit(1);
