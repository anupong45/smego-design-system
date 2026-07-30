/* ═══════════════════════════════════════════════════════════════════════════
   build-css — คัดลอกชั้น 02 เข้า `dist` ให้แพ็กเกจใช้ได้จริง
   ───────────────────────────────────────────────────────────────────────────
   แพ็กเกจที่ไม่มี CSS ใช้ไม่ได้ — `@theme` ใน `semantic.css` **คือ** config ของ
   Tailwind v4 (ไม่มี `tailwind.config.ts`) ถ้าแอป import ไม่ได้ ก็ไม่มี utility

   ★ **คัดลอกโดยรักษาโครง path ไว้** ไม่เขียน `@import`/`url()` ใหม่

       dist/theme.css              →  @import "./src/primitives.css"  ✓
       dist/src/*.css
       dist/src/fonts.css          →  url('./fonts/anuphan-thai.woff2')  ✓
       dist/src/fonts/*.woff2

   การเขียน path ใหม่คือการทำสำเนาความจริงชุดที่สอง ซึ่งจะหลุดจากต้นฉบับ
   วันหนึ่ง — รูปแบบเดียวกับที่ CI เคยไล่รายการเกตเองแล้วค้าง (§2)

   ผู้ใช้ปลายทางเขียนบรรทัดเดียว:

       @import "@smego/ui/theme.css";
       @source "../node_modules/@smego/ui/dist/…/*.js";   ← ห้ามลืม (คำตัดสินข้อ 5)
                            (glob จริงคือ dist ตามด้วย double-star ตามด้วย /*.js
                             เขียนเต็มในคอมเมนต์นี้ไม่ได้ เพราะมันปิดบล็อกคอมเมนต์)
   ═══════════════════════════════════════════════════════════════════════════ */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const TOKENS = path.resolve(here, '../../02-tokens');
const DIST = path.resolve(here, '../dist');

if (!fs.existsSync(DIST)) {
  console.error('❌ ยังไม่มี dist/ — ต้องรัน tsc ก่อน build:css');
  process.exit(1);
}

/** theme.css อยู่ราก · ที่เหลืออยู่ใต้ src/ ตามโครงเดิม */
fs.copyFileSync(path.join(TOKENS, 'theme.css'), path.join(DIST, 'theme.css'));

const srcOut = path.join(DIST, 'src');
fs.mkdirSync(srcOut, { recursive: true });

const css = fs
  .readdirSync(path.join(TOKENS, 'src'))
  .filter((f) => f.endsWith('.css'))
  .sort();

for (const f of css) {
  fs.copyFileSync(path.join(TOKENS, 'src', f), path.join(srcOut, f));
}

const fontOut = path.join(srcOut, 'fonts');
fs.mkdirSync(fontOut, { recursive: true });
const fonts = fs
  .readdirSync(path.join(TOKENS, 'src/fonts'))
  .filter((f) => f.endsWith('.woff2'))
  .sort();

for (const f of fonts) {
  fs.copyFileSync(path.join(TOKENS, 'src/fonts', f), path.join(fontOut, f));
}

/* theme-init ต้องไปด้วย — แอปต้อง inline IIFE นี้ใน <head> แบบ synchronous
   ก่อน first paint ไม่งั้นเห็น theme ผิดกระพริบ (ดูหัวไฟล์ของมัน) */
fs.copyFileSync(
  path.join(TOKENS, 'theme-init.js'),
  path.join(DIST, 'theme-init.js'),
);

console.log(
  `✅ build:css — theme.css + ${css.length} css + ${fonts.length} woff2 + theme-init.js → dist`,
);
