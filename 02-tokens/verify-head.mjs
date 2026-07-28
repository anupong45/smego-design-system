#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════════════
   verify-head.mjs — รัน `npm run verify` กับ **commit** ไม่ใช่ working tree

   ทำไมต้องมี: ตอนงาน Astryx parity เดินอยู่ มีมากกว่าหนึ่ง session แก้
   รีโปเดียวกันพร้อมกัน การรัน `npm run verify` ตรง ๆ จึงวัดสถานะครึ่ง ๆ
   กลาง ๆ ของคนอื่น — เคยได้ exit 2 เพราะไฟล์ถูก rename แล้วแต่ `index.ts`
   ยังชี้ชื่อเก่าอยู่ ทั้งที่ commit ล่าสุดเขียวสนิท

   วิธีทำ: กาง `git worktree` แยกที่ ref ที่ระบุ · symlink `node_modules`
   ทั้งสองที่เข้าไป (ไม่ต้อง `npm install` ใหม่) · รัน verify · ลบทิ้งเสมอ
   ไม่แตะ working tree ของใครเลยแม้แต่ไฟล์เดียว

       npm run verify:head              # HEAD
       npm run verify:head -- e326f5c   # commit ไหนก็ได้

   ⚠️ ตามนิยามแล้วมันจะ **ไม่เห็นงานที่ยังไม่ commit** ถ้ามีของค้างอยู่
   สคริปต์จะเตือนพร้อมจำนวนไฟล์ ไม่ใช่เงียบ ๆ แล้วรายงานเขียว
   ═══════════════════════════════════════════════════════════════════════════ */

import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import url from 'node:url';

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');

const git = (...args) =>
  execFileSync('git', ['-C', ROOT, ...args], { encoding: 'utf8' }).trim();

try {
  git('rev-parse', '--is-inside-work-tree');
} catch {
  console.error('✗ ยังไม่ได้ git init — verify:head วัดที่ commit จึงต้องมี git ก่อน');
  process.exit(1);
}

const ref = process.argv[2] || 'HEAD';
let sha;
try {
  sha = git('rev-parse', '--short', ref);
} catch {
  console.error(`✗ ไม่รู้จัก ref "${ref}"`);
  process.exit(1);
}

const dirty = git('status', '--porcelain').split('\n').filter(Boolean);
if (dirty.length) {
  console.log(
    `⚠️  มีไฟล์ที่ยังไม่ commit ${dirty.length} ไฟล์ — **ไม่ถูกวัด**ในรอบนี้\n` +
      dirty.slice(0, 10).map((l) => `      ${l}`).join('\n') +
      (dirty.length > 10 ? `\n      … อีก ${dirty.length - 10}` : '') +
      '\n',
  );
}

const wt = fs.mkdtempSync(path.join(os.tmpdir(), 'smego-verify-'));
const links = [
  [path.join(ROOT, 'node_modules'), path.join(wt, 'node_modules')],
  [
    path.join(ROOT, '03-components', 'node_modules'),
    path.join(wt, '03-components', 'node_modules'),
  ],
];

const cleanup = () => {
  for (const [, to] of links) {
    try {
      fs.unlinkSync(to);
    } catch {}
  }
  try {
    git('worktree', 'remove', '--force', wt);
  } catch {}
  try {
    fs.rmSync(wt, { recursive: true, force: true });
  } catch {}
};

process.on('SIGINT', () => {
  cleanup();
  process.exit(130);
});

let code = 1;
try {
  /* mkdtemp สร้างโฟลเดอร์ไว้แล้ว worktree add จึงต้องมี --force */
  git('worktree', 'add', '-q', '--detach', '--force', wt, sha);

  for (const [from, to] of links) {
    if (!fs.existsSync(from)) {
      console.error(
        `✗ ไม่พบ ${path.relative(ROOT, from)} — รัน npm install ที่นั่นก่อน\n` +
          '  (tailwindcss ต้องอยู่ที่ root ด้วย ดูคอมเมนต์ใน .gitignore)',
      );
      cleanup();
      process.exit(1);
    }
    fs.symlinkSync(from, to);
  }

  console.log(`▶ verify ที่ ${sha} (${ref})\n`);
  code = spawnSync('npm', ['run', 'verify'], {
    cwd: path.join(wt, '03-components'),
    stdio: 'inherit',
    env: process.env,
  }).status ?? 1;
} finally {
  cleanup();
}

console.log(code === 0 ? `\n✓ ${sha} เขียวทั้งชุด` : `\n✗ ${sha} ไม่ผ่าน (exit ${code})`);
process.exit(code);
