/* ═══════════════════════════════════════════════════════════════════════════
   copy-fonts — วาง woff2 ไว้ข้าง CSS ที่ build ออกมา
   ───────────────────────────────────────────────────────────────────────────
   `02-tokens/src/fonts.css` เขียน `url('./fonts/…')` แบบ relative โดยเจตนา
   เพื่อให้ bundler ของแอปแก้ path ให้เองตอน build (Next/webpack ทำได้)

   แต่ **Tailwind CLI ไม่แก้ url()** — มันคัดลอกสตริงออกมาตรง ๆ
   ดังนั้น CSS ที่ output ไป `gallery/gallery.css` จะหา
   `gallery/fonts/anuphan-thai.woff2` ซึ่งไม่มีอยู่ ถ้าไม่คัดลอก

   ผลถ้าลืม: หน้าตกไปใช้ฟอนต์สำรอง **โดยไม่มี error ใด ๆ** — และนั่นคือ
   สภาพที่ระบบนี้อยู่มาตลอดจนถึง 2026-07-30
   ═══════════════════════════════════════════════════════════════════════════ */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(here, '../../02-tokens/src/fonts');

/** ทุกที่ที่มี CSS build ออกมาแล้วอ้าง `./fonts/` */
export const FONT_DESTS = [
  path.resolve(here, '../gallery/fonts'),
  path.resolve(here, '../tests/e2e/fixture/fonts'),
];

export const FONT_FILES = fs
  .readdirSync(SRC)
  .filter((f) => f.endsWith('.woff2'))
  .sort();

if (FONT_FILES.length === 0) {
  console.error('❌ ไม่มี .woff2 ใน 02-tokens/src/fonts — ฟอนต์หายไปจากรีโป');
  process.exit(1);
}

for (const dest of FONT_DESTS) {
  fs.mkdirSync(dest, { recursive: true });
  for (const f of FONT_FILES) {
    fs.copyFileSync(path.join(SRC, f), path.join(dest, f));
  }
}

console.log(
  `✅ copy:fonts — ${FONT_FILES.length} ไฟล์ → ${FONT_DESTS.length} ปลายทาง`,
);
