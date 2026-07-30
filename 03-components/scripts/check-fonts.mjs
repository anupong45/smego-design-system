/* ═══════════════════════════════════════════════════════════════════════════
   check-fonts — เกตกันฟอนต์ตกไปใช้ตัวสำรองแบบเงียบ
   ───────────────────────────────────────────────────────────────────────────
   ★★★ ทำไมต้องมีเกตนี้

   ฟอนต์ที่โหลดไม่ได้ **ไม่ throw ไม่ error ไม่มี console warning** — browser
   ตกไปใช้ฟอนต์สำรองแล้วหน้ายังดูใช้ได้ · จนถึง 2026-07-30 ระบบนี้ไม่เคยโหลด
   Anuphan เลย และไม่มีเกตไหนรู้ ทั้งที่ `01-foundations/03-typography.md`
   parse ไฟล์ฟอนต์จริงมาเขียนไว้ 400 บรรทัด

   เกตนี้ตรวจ 5 ข้อ · ทุกข้อ exit(1) ได้จริง — พิสูจน์ด้วยการฉีดความผิด
   (ลบ woff2 · ลบ @import ใน theme.css · ลบ font-display · ยุบเป็นไฟล์เดียว)

   ⚠️ ไม่ตรวจ `unicode-range` ว่าตรงกับ Google หรือเปล่า — นั่นต้องยิงเน็ต
      ซึ่งทำให้เกตแดงเพราะเน็ตล่มได้ · ช่วงพวกนี้เปลี่ยนเมื่อ subsetter
      ตัดไฟล์ใหม่ ซึ่งจะมาพร้อมการเปลี่ยนเวอร์ชันฟอนต์ที่ต้องรีวิวด้วยมืออยู่แล้ว
   ═══════════════════════════════════════════════════════════════════════════ */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const TOKENS = path.resolve(here, '../../02-tokens');
const FONTS_CSS = path.join(TOKENS, 'src/fonts.css');
const THEME_CSS = path.join(TOKENS, 'theme.css');

/** CSS ที่ build ออกมาแล้ว → ต้องมี @font-face และมี woff2 วางข้าง ๆ */
const BUILT = [
  { css: path.resolve(here, '../gallery/gallery.css'), by: 'npm run gallery:build' },
  { css: path.resolve(here, '../tests/e2e/fixture/app.css'), by: 'npm run build:fixture' },
];

/** subset ที่ต้องแยกไฟล์ — ยุบรวมกัน = 83 KB แทน 52 KB (typography.md §215) */
const REQUIRED_SUBSETS = ['thai', 'latin', 'latin-ext', 'vietnamese'];

const fail = [];
const note = (m) => fail.push(m);

/* ── 1 · theme.css ต้อง import fonts.css ─────────────────────────────────── */
const theme = fs.readFileSync(THEME_CSS, 'utf8');
if (!/@import\s+["']\.\/src\/fonts\.css["']/.test(theme)) {
  note(
    'theme.css ไม่ได้ @import "./src/fonts.css" — ทุกหน้าจะใช้ฟอนต์สำรอง ' +
      'โดยไม่มี error ใด ๆ',
  );
}

/* ── 2 · fonts.css ต้องมี @font-face ครบทุก subset + font-display: swap ─── */
const css = fs.readFileSync(FONTS_CSS, 'utf8');
const faces = css.match(/@font-face\s*\{[^}]*\}/g) ?? [];

if (faces.length < REQUIRED_SUBSETS.length) {
  note(
    `fonts.css มี @font-face ${faces.length} บล็อก ต้องมีอย่างน้อย ` +
      `${REQUIRED_SUBSETS.length} (หนึ่งต่อ subset) — การยุบเป็นไฟล์เดียว ` +
      'ทำให้หน้าไทยล้วนโหลด 83 KB แทน 52 KB (typography.md §215)',
  );
}

const srcUrls = [];
for (const face of faces) {
  const url = face.match(/url\(\s*['"]?([^'")]+)['"]?\s*\)/)?.[1];
  if (!url) {
    note('มี @font-face ที่ไม่มี url() — บล็อกนั้นไม่โหลดอะไรเลย');
    continue;
  }
  srcUrls.push(url);

  if (!/font-display:\s*swap/.test(face)) {
    note(
      `@font-face ของ ${url} ไม่มี font-display: swap — ค่าปริยาย (block) ` +
        'ทำให้ข้อความหายบนเน็ตช้า (typography.md §157)',
    );
  }
  if (!/unicode-range:/.test(face)) {
    note(
      `@font-face ของ ${url} ไม่มี unicode-range — browser จะโหลดทุก subset ` +
        'ทั้งที่หน้าไทยล้วนใช้แค่ thai + latin',
    );
  }

  /* ไฟล์ต้องมีอยู่จริง และเป็น woff2 จริง ไม่ใช่ HTML error page ที่ curl ได้มา */
  const abs = path.resolve(path.dirname(FONTS_CSS), url);
  if (!fs.existsSync(abs)) {
    note(`ไฟล์ฟอนต์ไม่มีอยู่: ${path.relative(TOKENS, abs)}`);
  } else if (fs.readFileSync(abs).subarray(0, 4).toString('latin1') !== 'wOF2') {
    note(
      `${path.basename(abs)} ไม่ใช่ woff2 — magic ไม่ใช่ 'wOF2' ` +
        '(น่าจะเป็นหน้า error ที่ดาวน์โหลดมาแทนไฟล์ฟอนต์)',
    );
  }
}

for (const s of REQUIRED_SUBSETS) {
  if (!srcUrls.some((u) => path.basename(u, '.woff2').endsWith(`-${s}`))) {
    note(`ไม่พบ subset '${s}' ใน fonts.css`);
  }
}

/* ── 3 · CSS ที่ build แล้วต้องมี @font-face และมี woff2 วางข้าง ๆ ───────── */
for (const { css: out, by } of BUILT) {
  if (!fs.existsSync(out)) {
    note(`ยังไม่ได้ build ${path.basename(out)} — รัน ${by} ก่อน`);
    continue;
  }
  const built = fs.readFileSync(out, 'utf8');

  if (!/@font-face/.test(built) || !/Anuphan/.test(built)) {
    note(
      `${path.basename(out)} ไม่มี @font-face ของ Anuphan — ` +
        'CSS entry ของ build นั้นไม่ได้ import theme.css หรือ Tailwind ทิ้งบล็อกไป',
    );
    continue;
  }

  /* url ใน built CSS resolve เทียบกับที่ไฟล์ CSS นั้นอยู่ (Tailwind ไม่แก้ path)
     ⚠️ **Tailwind ตอน `--minify` ถอด quote ออกจาก `url()`** ⇒ ต้องรับทั้ง
        `url('./fonts/x.woff2')` และ `url(./fonts/x.woff2)`
        ฉบับแรกดึงค่าด้วยการ match ซ้ำบนสตริงที่จับได้ ซึ่ง `[^'")]` ไม่กัน `(`
        ⇒ ได้ `url(./fonts/x.woff2` ติดคำว่า url( มาด้วย แล้วรายงานว่าไฟล์หาย
        ทั้งที่ไฟล์อยู่ครบ — false positive ที่โผล่ตอน build แบบ minify เท่านั้น
        ตอนนี้ใช้ capture group จาก matchAll ตรง ๆ ไม่ match ซ้ำ */
  for (const m of built.matchAll(/url\(\s*['"]?([^'")\s]+\.woff2)['"]?\s*\)/g)) {
    const rel = m[1];
    const abs = path.resolve(path.dirname(out), rel);
    if (!fs.existsSync(abs)) {
      note(
        `${path.basename(out)} อ้าง ${rel} แต่ไฟล์ไม่อยู่ที่ ` +
          `${path.relative(path.resolve(here, '..'), abs)} — ลืม npm run copy:assets`,
      );
    }
  }
}

/* ── รายงาน ─────────────────────────────────────────────────────────────── */
if (fail.length) {
  console.error('\n❌ check:fonts — พบ ' + fail.length + ' ข้อ\n');
  for (const m of fail) console.error('  · ' + m);
  console.error(
    '\nฟอนต์ที่โหลดไม่ได้ไม่ throw — มันเปลี่ยนความกว้างทุกอย่างเงียบ ๆ\n',
  );
  process.exit(1);
}

console.log(
  `✅ check:fonts — @font-face ${faces.length} บล็อก · woff2 ครบ · ` +
    `built CSS ${BUILT.length} ไฟล์อ้าง path ที่มีจริง`,
);
