/* ═══════════════════════════════════════════════════════════════════════════
   check-dist — `dist/` คือสิ่งที่ผู้ใช้ได้รับ ต้องถูกตรวจเท่ากับ `src/`
   ───────────────────────────────────────────────────────────────────────────
   ★★★ ทำไมเกตนี้ต้องมีตั้งแต่วันแรกที่มี build step

   รีโปนี้เจ็บจากเกตตาบอดมา 4 ครั้ง และรูปแบบร่วมของทั้ง 4 คือ
   **เกตตรวจของที่ไม่ใช่ของที่ผู้ใช้ได้รับ** · การเพิ่ม artifact ใหม่ (`dist/`)
   ที่ไม่มีเกตคุมคือการเปิดช่องเดิมอีกรอบ — `lint:rsc` อ่าน `src/` เท่านั้น
   ถ้า build ทำ directive หายไป **ทุกเกตยังเขียวและแอปตายตอน import**

   ตรวจ 6 ข้อ:
     1 ทุกไฟล์ใน src มี .js คู่ใน dist
     2 ทุกไฟล์มี .d.ts (ไม่มี = แอปได้ `any` เงียบ ๆ)
     3 **`"use client"` รอดมาถึง dist ครบ 55 และไม่เกิน** ← ข้อที่สำคัญที่สุด
     4 ไม่มี source (.ts/.tsx) รั่วไปใน dist
     5 ทุก path ใน `exports` ของ package.json ชี้ไฟล์ที่มีจริง
     6 bundle `dist/index.js` ด้วย esbuild ได้จริง — พิสูจน์ว่าทุก import resolve
       (ใช้ bundler ไม่ใช่ `node --import` เพราะ tsc emit เป็น extensionless
        ซึ่ง Node ESM ล้วน resolve ไม่ได้ แต่ Next/webpack/esbuild ได้)
   ═══════════════════════════════════════════════════════════════════════════ */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, '..');
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');

const fail = [];
const note = (m) => fail.push(m);

if (!fs.existsSync(DIST)) {
  console.error('\n❌ ไม่มี dist/ — รัน `npm run build` ก่อน\n');
  process.exit(1);
}

const walk = (dir, ext) =>
  fs.existsSync(dir)
    ? fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) return walk(p, ext);
        return ext.test(e.name) ? [p] : [];
      })
    : [];

const DIRECTIVE = /^(['"])use client\1;?\s*$/;
const hasDirective = (file) =>
  DIRECTIVE.test(fs.readFileSync(file, 'utf8').split('\n')[0]?.trim() ?? '');

/* ── 1 + 2 + 3 · เทียบ src ↔ dist ทีละไฟล์ ──────────────────────────────── */
const sources = walk(SRC, /\.tsx?$/).sort();
let clientSrc = 0;
let clientDist = 0;

for (const s of sources) {
  const rel = path.relative(SRC, s).replace(/\.tsx?$/, '');
  const js = path.join(DIST, rel + '.js');
  const dts = path.join(DIST, rel + '.d.ts');

  if (!fs.existsSync(js)) {
    note(`ไม่มี dist/${rel}.js — build ไม่ครบ`);
    continue;
  }
  if (!fs.existsSync(dts)) {
    note(`ไม่มี dist/${rel}.d.ts — ผู้ใช้จะได้ any โดยไม่มีอะไรเตือน`);
  }

  const inSrc = hasDirective(s);
  const inDist = hasDirective(js);
  if (inSrc) clientSrc++;
  if (inDist) clientDist++;

  if (inSrc && !inDist) {
    note(
      `dist/${rel}.js **เสีย 'use client' ที่ src มี** — build ทำ directive หาย ` +
        'แอป Next จะตายตอน import และ lint:rsc มองไม่เห็นเพราะอ่านแค่ src/',
    );
  }
  if (!inSrc && inDist) {
    note(`dist/${rel}.js มี 'use client' ที่ src ไม่มี — build เพิ่มเข้ามาเอง`);
  }
}

if (clientSrc !== clientDist) {
  note(`จำนวน client ไม่ตรง — src ${clientSrc} · dist ${clientDist}`);
}

/* ── 4 · source ต้องไม่รั่วไป dist ──────────────────────────────────────── */
const leaked = walk(DIST, /\.tsx?$/).filter((f) => !/\.d\.ts$/.test(f));
if (leaked.length) {
  note(
    `มี source รั่วไปใน dist ${leaked.length} ไฟล์ (เช่น ` +
      `${path.relative(ROOT, leaked[0])}) — ผู้ใช้จะ transpile เอง`,
  );
}

/* ── 5 · exports ทุก path ต้องชี้ไฟล์ที่มีจริง ───────────────────────────── */
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));

const checkTarget = (key, target) => {
  /* subpath pattern — แทน * ด้วยชื่อจริงหนึ่งตัวที่มีอยู่ เพื่อพิสูจน์ว่า pattern ถูก */
  if (target.includes('*')) {
    const dir = path.join(ROOT, path.dirname(target.replace('*', 'x')));
    if (!fs.existsSync(dir)) {
      note(`exports "${key}" ชี้โฟลเดอร์ที่ไม่มี: ${path.dirname(target)}`);
      return;
    }
    const suffix = target.endsWith('.d.ts') ? '.d.ts' : '.js';
    if (!fs.readdirSync(dir).some((f) => f.endsWith(suffix))) {
      note(`exports "${key}" ไม่มีไฟล์ ${suffix} เลยใน ${path.dirname(target)}`);
    }
    return;
  }
  if (!fs.existsSync(path.join(ROOT, target))) {
    note(`exports "${key}" ชี้ไฟล์ที่ไม่มี: ${target}`);
  }
};

for (const [key, val] of Object.entries(pkg.exports ?? {})) {
  if (typeof val === 'string') checkTarget(key, val);
  else for (const t of Object.values(val)) checkTarget(key, t);
}

if (pkg.types && !fs.existsSync(path.join(ROOT, pkg.types))) {
  note(`"types" ชี้ไฟล์ที่ไม่มี: ${pkg.types}`);
}

/* CSS ที่แอปต้อง import — ถ้าหาย แอปไม่มี utility เลยแม้แต่ตัวเดียว */
for (const f of ['theme.css', 'src/semantic.css', 'src/fonts.css', 'theme-init.js']) {
  if (!fs.existsSync(path.join(DIST, f))) {
    note(`dist/${f} หาย — รัน build:css`);
  }
}
if (!walk(path.join(DIST, 'src/fonts'), /\.woff2$/).length) {
  note('dist/src/fonts ไม่มี woff2 — แพ็กเกจไม่มีฟอนต์ไปด้วย');
}

/* ── 6 · ทุก import ใน dist ต้อง resolve ได้ในสายตา bundler ─────────────── */
if (fs.existsSync(path.join(DIST, 'index.js'))) {
  try {
    execFileSync(
      'npx',
      [
        'esbuild',
        path.join(DIST, 'index.js'),
        '--bundle',
        '--outfile=/dev/null',
        '--jsx=automatic',
        '--external:react',
        '--external:react-dom',
        '--external:react/jsx-runtime',
        '--external:react-aria-components',
        '--external:@internationalized/date',
        '--log-level=error',
      ],
      { cwd: ROOT, stdio: 'pipe' },
    );
  } catch (e) {
    note(
      'bundle dist/index.js ไม่ผ่าน — มี import ที่ resolve ไม่ได้:\n    ' +
        String(e.stderr ?? e.message).trim().split('\n').slice(0, 4).join('\n    '),
    );
  }
}

/* ── รายงาน ─────────────────────────────────────────────────────────────── */
if (fail.length) {
  console.error(`\n❌ check:dist — พบ ${fail.length} ข้อ\n`);
  for (const m of fail) console.error('  · ' + m);
  console.error('\ndist/ คือสิ่งที่ผู้ใช้ได้รับ — เกตอื่นอ่าน src/ ทั้งนั้น\n');
  process.exit(1);
}

console.log(
  `✓ dist ถูกต้อง — ${sources.length} โมดูล · .d.ts ครบ · ` +
    `'use client' ${clientDist} ไฟล์ตรงกับ src · ทุก import resolve ได้`,
);
