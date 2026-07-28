#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════════════
   lint-parity.mjs — เกตกัน drift ระหว่าง @smego/ui กับ Astryx

   ทำไมต้องมี: Astryx ยังเป็น 0.1.x ปล่อย canary วันละหลายครั้ง สิ่งที่ align
   ไว้วันนี้จะเลื่อนออกเองภายในไม่กี่สัปดาห์ ถ้าไม่มีเกต ความพยายามทั้งหมด
   ของรอบนี้จะสลายเงียบ ๆ โดยไม่มีใครรู้

   ตรวจอะไรได้                     | ตรวจไม่ได้
   ────────────────────────────────┼──────────────────────────────────────────
   ชื่อ component                  | ค่าตัวเลข (radius/spacing/height)
   ชื่อ prop                       | เพราะ Astryx ใช้ StyleX เราใช้ Tailwind
   prop ที่หายไป/เกินมา            | ค่าพวกนี้ต้อง assert ด้วยมือใน §2 ของ
   เวอร์ชัน Astryx ที่ pin ไว้     | ASTRYX-PARITY.md

   แหล่งความจริง: บล็อก ```json parity ใน ASTRYX-PARITY.md §4.1
   ═══════════════════════════════════════════════════════════════════════════ */

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const COMPONENTS = path.join(ROOT, '03-components');
const DOC = path.join(ROOT, 'ASTRYX-PARITY.md');

const require_ = createRequire(path.join(COMPONENTS, 'package.json'));

const problems = [];
const notes = [];
const fail = (m) => problems.push(m);

/* ── 1 · อ่าน allowlist จากเอกสาร ─────────────────────────────────────────── */

if (!fs.existsSync(DOC)) {
  console.error(`✗ ไม่พบ ${path.relative(ROOT, DOC)} — parity gate ต้องมีเอกสารเป็นแหล่งความจริง`);
  process.exit(1);
}
const docSrc = fs.readFileSync(DOC, 'utf8');
const block = docSrc.match(/```json parity\n([\s\S]*?)\n```/);
if (!block) {
  console.error('✗ ไม่พบบล็อก ```json parity ใน ASTRYX-PARITY.md §4.1');
  process.exit(1);
}
let cfg;
try {
  /* ★★ ต้องจับ **คีย์ซ้ำ** ด้วย — `JSON.parse` ปกติยอมรับเงียบ ๆ แล้วให้
     อันหลังชนะ ผลคือคำตัดสินที่บันทึกไว้แล้วหายไปโดยไม่มีใครรู้

     เจอจริง 2026-07-28: มี `"Card"` สองครั้งใน `wontAdopt` — อันหลัง
     (`{ variant }`) ทับอันแรก (`{ width, height, maxWidth, minHeight }`)
     ทำให้ D2 ที่เคยบันทึกไว้หลุดหายไปทั้งชุด และ gate กลับมาฟ้องของที่
     ตัดสินไปแล้ว · ไฟล์นี้เป็นแหล่งความจริงของ allowlist การเสียคำตัดสิน
     เงียบ ๆ จึงแย่กว่าการ fail */
  const dupPath = [];
  cfg = JSON.parse(block[1], function reviver(key, value) {
    return value;
  });

  /* reviver ของ JSON.parse ไม่เห็นคีย์ซ้ำ (มันถูกยุบไปก่อนแล้ว)
     จึงต้องนับจากข้อความดิบทีละบล็อกด้วย regex ของคีย์ระดับบนสุดในแต่ละ object */
  const countDupKeys = (text) => {
    const dups = new Set();
    /* ไล่ทีละ object โดยดูคีย์ที่อยู่ในระดับเดียวกัน */
    const stack = [];
    let depth = 0;
    let current = new Map();
    const frames = [current];
    for (const m of text.matchAll(/[{}]|"((?:[^"\\]|\\.)*)"\s*:/g)) {
      if (m[0] === '{') {
        depth++;
        current = new Map();
        frames.push(current);
      } else if (m[0] === '}') {
        depth--;
        frames.pop();
        current = frames[frames.length - 1] ?? new Map();
      } else if (m[1] !== undefined) {
        const k = m[1];
        current.set(k, (current.get(k) ?? 0) + 1);
        if (current.get(k) > 1) dups.add(k);
      }
    }
    return [...dups];
  };

  const dups = countDupKeys(block[1]);
  if (dups.length) {
    console.error(
      '✗ บล็อก json parity มีคีย์ซ้ำ: ' + dups.join(', ') +
        '\n  อันหลังจะทับอันแรกเงียบ ๆ ทำให้คำตัดสินที่บันทึกไว้หาย — ยุบให้เป็นคีย์เดียว',
    );
    process.exit(1);
  }
  void dupPath;
} catch (e) {
  console.error('✗ บล็อก json parity เสีย: ' + e.message);
  process.exit(1);
}

/* ── 2 · เวอร์ชัน Astryx ต้องตรงกับที่เอกสารอ้าง ─────────────────────────── */

const pkg = JSON.parse(fs.readFileSync(path.join(COMPONENTS, 'package.json'), 'utf8'));
const pinned = (pkg.devDependencies || {})['@astryxdesign/core'];
if (!pinned) {
  fail('@astryxdesign/core ไม่ได้อยู่ใน devDependencies — parity ตรวจไม่ได้');
} else if (/[\^~]/.test(pinned)) {
  fail(`@astryxdesign/core pin ด้วย range "${pinned}" — ต้อง pin เวอร์ชันตายตัว มิฉะนั้น parity จะเลื่อนเองโดยไม่มีใครเห็น`);
} else if (pinned !== cfg.astryxVersion) {
  fail(`เวอร์ชันไม่ตรง: package.json = ${pinned} แต่ ASTRYX-PARITY.md อ้าง ${cfg.astryxVersion} — อ่าน diff แล้วอัปเดตเอกสารก่อน`);
}

/* อ่าน package.json ตรงจาก node_modules ไม่ผ่าน require เพราะ exports map
   ของ Astryx ไม่ได้เปิด "./package.json" ให้ resolve */
const AX_DIR = path.join(COMPONENTS, 'node_modules', '@astryxdesign', 'core');
let axInstalled = null;
try {
  axInstalled = JSON.parse(fs.readFileSync(path.join(AX_DIR, 'package.json'), 'utf8')).version;
} catch {
  fail('ติดตั้ง @astryxdesign/core ไม่สำเร็จ — รัน npm install ใน 03-components');
}
if (axInstalled && pinned && axInstalled !== pinned) {
  fail(`ตัวที่ติดตั้งจริงคือ ${axInstalled} แต่ pin ไว้ ${pinned}`);
}

/* ── 3 · ชื่อ component ─────────────────────────────────────────────────── */

const axDist = axInstalled ? path.join(AX_DIR, 'dist') : null;

const axHas = (name) =>
  axDist && fs.existsSync(path.join(axDist, name)) &&
  fs.readdirSync(path.join(axDist, name)).some((f) => f.endsWith('.d.ts'));

const barrel = fs.readFileSync(path.join(COMPONENTS, 'src', 'index.ts'), 'utf8');
const exported = new Set(
  [...barrel.matchAll(/^\s*(?:export\s*\{)?\s*([A-Z][A-Za-z0-9]*)\s*,?\s*$/gm)].map((m) => m[1]),
);
for (const m of barrel.matchAll(/export\s*\{([^}]*)\}/g)) {
  for (const raw of m[1].split(',')) {
    const n = raw.replace(/\btype\b/, '').trim().split(/\s+as\s+/).pop();
    if (/^[A-Z][A-Za-z0-9]*$/.test(n)) exported.add(n);
  }
}

const expectAstryxName = { ...cfg.rename, ...(cfg.renameNewBuild || {}) };
const targets = new Set([
  ...Object.values(expectAstryxName),
  ...(cfg.same || []),
]);

// 3a — ชื่อที่เราต้อง export หลัง rename
const toBuild = new Set([
  ...Object.values(cfg.renameNewBuild || {}),
  ...(cfg.same || []).filter((n) => !exported.has(n)),
]);
for (const name of targets) {
  if (exported.has(name)) continue;
  const ours = Object.entries(cfg.rename).find(([, v]) => v === name)?.[0];
  if (ours) fail(`ยังไม่ได้ rename: barrel ยังไม่ export "${name}" (เดิมคือ "${ours}")`);
  else if (toBuild.has(name)) fail(`ยังไม่ได้สร้าง: barrel ยังไม่ export "${name}"`);
  else fail(`barrel ไม่ export "${name}"`);
}

/* 3b — ชื่อเก่าต้องหายไปจากบาร์เรล

   เดิมกฎนี้ยอมให้ชื่อเก่าอยู่ต่อได้ถ้า mark `@deprecated` แล้วค่อยตัดใน 0.2.0
   **คำตัดสิน 2026-07-28 กลับกฎนี้** — rename หักดิบ ไม่มี alias แล้วขยับเป็น
   0.2.0 เลย เหตุผล: ยังไม่มี consumer นอกรีโป (04-patterns เป็น .md ล้วน)
   0.x จึงหัก API ได้ตามกติกา semver และนี่คือหน้าต่างสุดท้ายที่ราคาเป็นศูนย์

   ถ้าเก็บ alias ไว้ บาร์เรลจะมี 15 ชื่อคู่ และจะได้ capsule สี่ตัวโผล่พร้อมกัน
   ในออโต้คอมพลีต (Badge · Chip · RemovableChip · Token) ซึ่งเป็นความสับสน
   ตัวเดียวกับที่ §1.4 อุตส่าห์กันไว้ */
for (const [ours, theirs] of Object.entries(cfg.rename)) {
  if (exported.has(ours)) {
    fail(`"${ours}" ยัง export อยู่ — rename เป็น "${theirs}" แบบหักดิบ ไม่มี alias (§8 · 0.2.0)`);
  }
}

// 3c — ชื่อที่เราอ้างว่าตรงกับ Astryx ต้องมีจริงฝั่งเขา
if (axDist) {
  for (const name of targets) {
    if (!axHas(name)) {
      fail(`ASTRYX-PARITY.md อ้างว่า "${name}" มีใน Astryx แต่ ${cfg.astryxVersion} ไม่มี — mapping ค้างยุค`);
    }
  }
}

/* ── 4 · ชื่อ prop ──────────────────────────────────────────────────────── */

let ts = null;
try {
  ts = require_('typescript');
} catch {
  notes.push('ไม่พบ typescript — ข้ามการตรวจ prop ตรวจแค่ชื่อ component');
}

if (ts && axDist) {
  const srcDir = path.join(COMPONENTS, 'src');
  const walk = (d) =>
    fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
      e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);

  const ourFiles = walk(srcDir).filter((f) => f.endsWith('.tsx'));
  const axFiles = walk(axDist).filter((f) => f.endsWith('.d.ts'));

  const findIface = (files, iface) =>
    files.find((f) => new RegExp(`(?:interface|type)\\s+${iface}\\b`).test(fs.readFileSync(f, 'utf8')));

  const wanted = [];
  for (const name of targets) {
    const ourFile = findIface(ourFiles, `${name}Props`);
    const axFile = findIface(axFiles, `${name}Props`);
    if (ourFile && axFile) wanted.push({ name, ourFile, axFile });
  }

  if (wanted.length) {
    const program = ts.createProgram(
      [...new Set(wanted.flatMap((w) => [w.ourFile, w.axFile]))],
      {
        jsx: ts.JsxEmit.ReactJSX,
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.ESNext,
        moduleResolution: ts.ModuleResolutionKind.Bundler,
        strict: true,
        skipLibCheck: true,
        esModuleInterop: true,
        noEmit: true,
      },
    );
    const checker = program.getTypeChecker();

    /* prop ที่สืบทอดมาจาก DOM/React/RAC ไม่ใช่ design surface — ตัดออกก่อนเทียบ
       มิฉะนั้น Button จะมี 116 props แทนที่จะเป็น 8 ตัวที่เราออกแบบเอง */
    const isDesignSurface = (file) =>
      !!file &&
      !/[\\/]typescript[\\/]lib[\\/]lib\./.test(file) &&
      !/node_modules[\\/]@types[\\/]react[\\/]/.test(file) &&
      !/node_modules[\\/](react-aria|react-aria-components|react-stately|@react-aria|@react-stately|@react-types)[\\/]/.test(file);

    const surfaceOf = (file, iface, ownOnly) => {
      const sf = program.getSourceFile(file);
      if (!sf) return null;
      let type = null;
      ts.forEachChild(sf, (n) => {
        if ((ts.isInterfaceDeclaration(n) || ts.isTypeAliasDeclaration(n)) && n.name.text === iface) {
          type = checker.getTypeAtLocation(n.name);
        }
      });
      if (!type) return null;
      const out = new Set();
      for (const p of checker.getPropertiesOfType(type)) {
        const decl = p.declarations?.[0];
        const from = decl?.getSourceFile().fileName;
        if (ownOnly && !isDesignSurface(from)) continue;
        const n = p.getName();
        if (/^aria-|^data-/.test(n)) continue;
        if (['dir', 'lang', 'hidden', 'inert', 'id', 'slot', 'key'].includes(n)) continue;
        out.add(n);
      }
      return out;
    };

    const skipAll = new Set(cfg.propsSkipAll || []);
    const wontAll = cfg.wontAdopt?._all || {};

    for (const { name, ourFile, axFile } of wanted) {
      /* สองฝั่งใช้เกณฑ์ต่างกันโดยตั้งใจ:

         ขาด  → เทียบกับ surface **เต็ม** ของเรา เพราะ `isDisabled` `value`
                `onChange` สืบทอดมาจาก RAC แต่ก็เป็น API สาธารณะของเราจริง
                ถ้าเทียบกับเฉพาะที่เราประกาศเอง จะฟ้องว่าขาดทั้งที่มีอยู่
         เกิน  → เทียบกับเฉพาะที่เรา**ประกาศเอง** เพราะ prop ที่ RAC แถมมา
                (onAnimationEnd · crossOffset) ไม่ใช่การตัดสินใจออกแบบของเรา
                จึงไม่ใช่ divergence ที่ต้องอธิบาย

         ฝั่ง Astryx กรอง design surface เสมอ — BaseProps ของเขาก็สืบทอด
         HTMLAttributes มาเหมือนกัน ถ้าไม่กรองจะได้ onDragExit ปนมาเป็นร้อย */
      const oursFull = surfaceOf(ourFile, `${name}Props`, false);
      const ours = surfaceOf(ourFile, `${name}Props`, true);
      const theirs = surfaceOf(axFile, `${name}Props`, true);
      if (!ours || !theirs || !oursFull) {
        notes.push(`${name}: อ่าน props ไม่ได้ ข้ามไป`);
        continue;
      }
      const allowedExtra = new Set(cfg.propsOursOnly?.[name] || []);
      const wont = { ...wontAll, ...(cfg.wontAdopt?.[name] || {}) };

      /* ── ความต่างเชิงชั้น ไม่ใช่ prop ที่ขาด ────────────────────────────
         Astryx รวมทุกอย่างไว้ใน component เดียว เราแยกตาม RAC เช่น
         `Tooltip` ของเขามี `delay`/`hideDelay` อยู่บนตัว tooltip เอง
         ส่วนของเราอยู่บน `TooltipTrigger` (RAC ให้ `delay`/`closeDelay`)

         ก่อนหน้านี้ 4 ตัวนั้นถูกฟ้องว่า "ขาด" ทั้งที่ **มีครบ** ถ้ารับตาม
         คำฟ้องจะได้ prop ซ้ำสองชั้น ซึ่งแย่กว่าการต่างจาก Astryx

         `layerDiff` จึงประกาศว่า prop กลุ่มนี้อยู่ที่ component คู่ตัวไหน
         แล้วรายงานเป็น note ไม่ใช่ fail — ต่างจาก `wontAdopt` ตรงที่นั่นคือ
         "มีแล้วไม่เอา" ส่วนนี่คือ "มีแล้ว แต่คนละที่" */
      const layer = cfg.layerDiff?.[name];
      const onCompanion = new Set(layer?.props || []);
      if (onCompanion.size) {
        const found = [...theirs].filter((p) => onCompanion.has(p));
        if (found.length) {
          notes.push(
            `${name}: ${found.sort().join(' ')} อยู่บน <${layer.companion}> ไม่ใช่ <${name}> ` +
              `— ความต่างเชิงชั้น ตรวจที่นั่นแทน`,
          );
        }
      }

      /* ── ขอบเขตของ parity (คำตัดสิน 2026-07-28 ข้อ 1) ───────────────────
         เดิม gate ฟ้อง prop ของ Astryx **ทุกตัว**ที่เราไม่มี ซึ่งบังคับให้
         ต้องเขียน D-code ต่อ prop · วัดผลแล้วได้ **ปฏิเสธ 92 : รับ ~20**
         พร้อม D-code 34 ข้อ — ปลายทางคือเอกสารรับรองว่าเราต่างจาก Astryx
         อย่างมีเหตุผล 34 แบบ ไม่ใช่ระบบที่เข้ากันได้

         ขอบเขตจึงหุบมาที่ **ชื่อ + ชุด prop ของ §8.1/§3.1** (`parityScope`)
         ที่เหลือประกาศว่าอยู่นอกขอบเขต **รวมครั้งเดียว** รายงานเป็น note
         ไม่ใช่ fail — ต่างจาก `wontAdopt` ("มีแล้วไม่เอา มีเหตุผลเฉพาะตัว")
         และ `layerDiff` ("มีแล้ว แต่อยู่คนละชั้น")

         ⚠️ D1–D35 ที่เขียนไว้แล้วยังอยู่ในเอกสารเป็นประวัติการตัดสิน
         แค่ไม่ใช่สิ่งที่ gate บังคับอีก */
      const scope = new Set(cfg.parityScope || []);
      const notOurs = [...theirs].filter(
        (p) =>
          !oursFull.has(p) && !skipAll.has(p) && !(p in wont) && !onCompanion.has(p),
      );
      const missing = notOurs.filter((p) => scope.has(p));
      const beyond = notOurs.filter((p) => !scope.has(p));
      const extra = [...ours].filter(
        (p) => !theirs.has(p) && !skipAll.has(p) && !allowedExtra.has(p),
      );

      /* ★★ `propsOursOnly` ต้อง **ยืนยัน** ไม่ใช่แค่ยกเว้น (คำตัดสินข้อ 3)
         เดิมมันแค่ปิดเสียงเตือน จึงรับผีได้เงียบ ๆ — `labelContent` ถูก
         ประกาศไว้ทั้ง `CheckboxInput`/`RadioList` ตาม D18 โดยที่โค้ดไม่มีเลย
         ทั้งสองที่ และไม่มีอะไรจับได้ เพราะการยกเว้นย่อมไม่ตรวจว่ามีจริง */
      const ghosts = [...allowedExtra].filter((p) => !ours.has(p));
      if (ghosts.length) {
        fail(`${name}: propsOursOnly ประกาศ prop ที่โค้ดไม่มี — ${ghosts.sort().join(' ')}\n` +
             `    สร้างขึ้นจริง หรือลบออกจาก propsOursOnly.${name}`);
      }

      if (beyond.length) {
        notes.push(
          `${name}: ${beyond.length} prop ของ Astryx อยู่นอกขอบเขต parity ` +
            `(${beyond.sort().join(' ')})`,
        );
      }
      if (missing.length) {
        fail(`${name}: ขาด prop ที่อยู่**ในขอบเขต** parity — ${missing.sort().join(' ')}\n` +
             `    §8.1/§3.1 ตัดสินว่ารับแล้ว จึงต้องมี — ดู parityScope`);
      }
      if (extra.length) {
        fail(`${name}: มี prop เกินที่ Astryx ไม่มี — ${extra.sort().join(' ')}\n` +
             `    ถ้าตั้งใจ ใส่ใน propsOursOnly.${name}`);
      }
    }
  }
}

/* ── 5 · รายงาน ─────────────────────────────────────────────────────────── */

for (const n of notes) console.log(`  · ${n}`);

/* ── เพดานนับถอยหลัง ────────────────────────────────────────────────────────

   งาน parity รอบนี้เปิดค้างไว้หลายสัปดาห์ (rename 15 ชื่อ · label: string
   ทั้งระบบ · สร้างเพิ่ม 6) ถ้าเกตนี้ fail ทันทีที่มี problem ข้อเดียว
   `npm run verify` จะแดงยาวตลอดทาง แล้วเกตเขียวเดียวของโปรเจกต์จะหมด
   ความหมาย — ทีมจะชินกับแดงแล้วมองข้ามของจริงที่พังปนมา

   จึงเทียบกับ `maxProblems` ใน §4.1 แทน:

     เกินเพดาน  → แดง  drift ใหม่ถูกจับทันที ซึ่งคือเหตุผลที่ไฟล์นี้มีอยู่
     ต่ำกว่า    → แดง  บังคับให้ลดเพดานลง ไม่งั้นเพดานจะค้างสูงแล้วเปิดช่อง
                       ให้ drift ใหม่แอบเข้ามาแทนที่ปัญหาเก่าที่เพิ่งปิดไป
     เท่ากัน    → เขียว

   พอถึง 0 ให้ลบบล็อกนี้ทิ้งแล้วกลับไปเป็น `if (problems.length) exit(1)`
   ───────────────────────────────────────────────────────────────────────── */

const ceiling = cfg.maxProblems;
if (typeof ceiling !== 'number') {
  console.error('✗ ไม่พบ "maxProblems" ในบล็อก json parity — ดู §4.1');
  process.exit(1);
}

/* อยู่ที่เพดานพอดี = ผ่าน จึงไม่ถ่ม 51 บรรทัดใส่ `npm run verify` ทุกครั้ง
   ที่มันเขียว — ใช้ `npm run lint:parity -- --list` เพื่อดูรายการเต็ม */
const wantList = process.argv.includes('--list') || problems.length !== ceiling;

if (problems.length && wantList) {
  console.error(`\n✗ parity: ${problems.length} ข้อ (เพดาน ${ceiling})\n`);
  for (const p of problems) console.error(`  ✗ ${p}`);
  console.error(`\nแก้โค้ด หรือถ้าเป็นการต่างโดยตั้งใจ บันทึกลง ASTRYX-PARITY.md §4`);
  console.error(`อ้างอิง Astryx ${cfg.astryxVersion}\n`);
}

if (problems.length > ceiling) {
  console.error(`✗ เกินเพดาน ${problems.length} > ${ceiling} — มี drift ใหม่เข้ามา\n`);
  process.exit(1);
}

if (problems.length < ceiling) {
  console.error(
    `✗ ต่ำกว่าเพดาน ${problems.length} < ${ceiling} — ปิดงานได้แล้ว ` +
      `ให้แก้ "maxProblems" ใน ASTRYX-PARITY.md §4.1 เป็น ${problems.length}\n`,
  );
  process.exit(1);
}

if (ceiling > 0) {
  console.log(`✓ parity คงที่ที่เพดาน ${ceiling} — เทียบกับ Astryx ${cfg.astryxVersion}`);
} else {
  console.log(`✓ parity ผ่าน — เทียบกับ Astryx ${cfg.astryxVersion}`);
}
