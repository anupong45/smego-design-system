#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · ตรวจคุณภาพ 4 ข้อที่ตรวจด้วยสายตาไม่ไหว
   ───────────────────────────────────────────────────────────────────────────
   ★★ ทำไมต้องมีไฟล์นี้ แยกจาก `lint-classes.mjs`

   `lint-classes.mjs` ตอบคำถามเดียว: "สีนี้อยู่ในระบบไหม"
   ไฟล์นี้ตอบคำถามที่ **ข้อ 10 · Quality Checklist** ในทุกไฟล์ `.md` ต้องอ้าง

   เอกสารในระบบนี้ไม่เคยติ๊ก ✅ โดยไม่มีหลักฐาน — ตัวเลข contrast ใน
   `Button.md §3` และความกว้างที่วัดจริงใน `EntityCard.md §3` มาจากการวัด
   ไม่ใช่จากความรู้สึก **checklist ที่เขียนด้วยมือจะเป็นเนื้อหาแรกที่ไม่มี
   หลักฐาน** และพอมีข้อเดียวที่ผิด ทั้ง checklist ก็หมดความน่าเชื่อถือ

   ไฟล์นี้คือหลักฐานของ 4 ข้อในนั้น:

     • คุณสมบัติเชิงตรรกะ (Logical properties)  → error
     • โหมดมืด (Dark Mode) — เงาดิบ              → error
     • ประสิทธิภาพ (Performance) — ความสูงตายตัว → warn
     • การเคลื่อนไหว (Animation) — ไม่มีตัวกัน    → warn

   ═══ ทำไม error กับ warn ไม่เท่ากัน ═══
   error = ผิดแน่นอนและแก้ได้เชิงกล (สลับ `ml-` เป็น `ms-`)
   warn  = อาจถูกโดยตั้งใจ ต้องมีคนอ่าน (ความสูงตายตัวใน media ที่กัน CLS)

   `--strict` ทำให้ warn นับเป็น error · `--json` พ่นผลรายไฟล์ให้เครื่องอ่าน
   ═══════════════════════════════════════════════════════════════════════════ */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

/* ═══════════════════════════════════════════════════════════════════════════
   ใช้ได้สองโหมด
   ───────────────────────────────────────────────────────────────────────────
   1 **ในรีโปนี้** — ไม่ส่ง argument · สแกน `03-components/src` เหมือนเดิมเป๊ะ
   2 **ในรีโปแอป** — `npx smego-lint-quality src app` · สแกน path ที่ส่งมา
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

const STRICT = process.argv.includes('--strict');
const AS_JSON = process.argv.includes('--json');

/* ─────────────────────────────────────────────────────────────────────────
   1 · คุณสมบัติเชิงตรรกะ — error
   ─────────────────────────────────────────────────────────────────────────
   ★★★ ระบบนี้ไม่ได้ส่ง locale RTL และจะไม่อ้างว่าส่ง

   สิ่งที่ตรวจคือเรื่องที่ **จริงวันนี้**: `ms-`/`me-`/`ps-`/`pe-`/`start-`/
   `end-`/`text-start` เป็นชุดเดียวที่ใช้ทั้งระบบ ไม่ปนกับ `ml-`/`mr-`

   เหตุผลที่ไม่ใช่แค่ "เผื่ออนาคต": `EntityCard.tsx` ใช้ `end-2 top-2` วาง
   ปุ่มลอย ถ้าอีกไฟล์เขียน `right-2` ทำสิ่งเดียวกัน คนอ่านโค้ดต้องเดาว่า
   สองอันนี้ต่างกันโดยตั้งใจหรือเปล่า — ความไม่สม่ำเสมอมีต้นทุนของมันเอง
   แม้ผลลัพธ์ที่ render จะเหมือนกันเป๊ะในภาษาไทย

   ⚠️ `inset-x-*` `translate-x-*` `overflow-x-*` `space-x-*` **ไม่ผิด**
   เพราะสมมาตรทั้งสองข้าง ไม่ได้เลือกข้างใดข้างหนึ่ง */
const PHYSICAL_SIDE = new RegExp(
  '\\b(?:' +
    'm[lr]-|p[lr]-|' /* ml-4 mr-2 pl-3 pr-3 */ +
    '(?:left|right)-|' /* left-0 right-2 */ +
    'text-(?:left|right)\\b|' /* text-left */ +
    'border-[lr]-|' /* border-l-2 */ +
    'rounded-[lr](?:-|\\b)|' /* rounded-l rounded-r-md */ +
    'scroll-m[lr]-|scroll-p[lr]-' +
    ')' +
    '(?:\\[[^\\]]*\\]|[\\w./]+)?',
  'g',
);

/**
 * ★★ ข้อยกเว้นเดียว — สำนวนจัดกึ่งกลางด้วย `left-1/2` + `-translate-x-1/2`
 *
 * `left-1/2` ในสำนวนนี้ **ไม่ได้เลือกข้าง** มันวางขอบไว้ที่ 50% แล้วดึงกลับ
 * ครึ่งความกว้าง — เป็นการจัดกึ่งกลาง ซึ่งสมมาตรโดยนิยาม
 *
 * และการเปลี่ยนเป็น `start-1/2` จะ **ผิดกว่าเดิม**: Tailwind ไม่มี
 * `translate` เชิงตรรกะ ถ้าจับคู่ `start-1/2` กับ `-translate-x-1/2`
 * ใน RTL ขอบขวาจะไปอยู่ที่ 50% แล้วถูกดึงซ้ายอีกครึ่ง = เยื้องออกนอกกึ่งกลาง
 * คู่ physical ที่เข้าคู่กันถูกต้องกว่าคู่ที่ปนกันครึ่ง ๆ
 *
 * เจอที่ `RangeSlider.tsx` — เป้ากด 24×24 ของ thumb (SC 2.5.8)
 */
const CENTERING_IDIOM = /^(?:left|right)-1\/2$/;

const LOGICAL_SWAP = [
  [/^ml-/, 'ms-'], [/^mr-/, 'me-'],
  [/^pl-/, 'ps-'], [/^pr-/, 'pe-'],
  [/^left-/, 'start-'], [/^right-/, 'end-'],
  [/^text-left/, 'text-start'], [/^text-right/, 'text-end'],
  [/^border-l/, 'border-s'], [/^border-r/, 'border-e'],
  [/^rounded-l/, 'rounded-s'], [/^rounded-r/, 'rounded-e'],
  [/^scroll-ml-/, 'scroll-ms-'], [/^scroll-mr-/, 'scroll-me-'],
  [/^scroll-pl-/, 'scroll-ps-'], [/^scroll-pr-/, 'scroll-pe-'],
];

function suggestLogical(found) {
  for (const [pattern, replacement] of LOGICAL_SWAP) {
    if (pattern.test(found)) return found.replace(pattern, replacement);
  }
  return 'ใช้คู่ start/end แทน left/right';
}

/* ─────────────────────────────────────────────────────────────────────────
   2 · เงาดิบ — error (ข้อ โหมดมืด)
   ─────────────────────────────────────────────────────────────────────────
   ★★ `shadow-md` ติดไปโหมดมืดโดยไม่มีใครสังเกต

   เงาของ Tailwind เป็นสีดำโปร่งใสตายตัว บนพื้นเข้มมัน **มองไม่เห็นเลย**
   แต่ยังกิน paint อยู่ — ผลคือลำดับชั้นที่หายไปเฉพาะโหมดมืด ซึ่งเป็น
   บั๊กที่รอด review ง่ายที่สุด เพราะคนรีวิวดูโหมดสว่าง

   `--elevation-*` ใน `semantic.css` เปลี่ยนเป็นขอบสว่างในโหมดมืดแทนเงา

   ✅ `shadow-[0_0_0_2px_var(--color-focus-contrast)]` **ไม่ผิด**
   เป็น halo ของวงแหวน focus ซึ่งใช้ token และต้องเห็นทั้งสองโหมด */
const RAW_SHADOW = /\bshadow-(?:xs|sm|md|lg|xl|2xl|inner)\b/g;

/* ─────────────────────────────────────────────────────────────────────────
   3 · ความสูงตายตัว — warn (ข้อ ประสิทธิภาพ + SC 1.4.12)
   ─────────────────────────────────────────────────────────────────────────
   ★ `Button.md §6` ตัดสินใจไว้แล้วว่า **ไม่มี `h-*` บนปุ่ม**

   "ความสูงมาจาก line-height + padding" — เหตุผลคือ SC 1.4.12 ผู้ใช้ที่
   บังคับ line-height ของตัวเองต้องไม่โดนตัดข้อความ และข้อความไทยที่ยาว
   กว่าอังกฤษ 20–40% ทำให้เคสนี้เกิดจริงบ่อยกว่าที่คิด

   ต่ำกว่า `h-9` (36px) ปล่อยผ่าน — เป็นขนาดไอคอนและเส้นคั่น ไม่ใช่กล่อง
   ข้อความ · `h-full` `h-auto` `h-px` `h-screen` ไม่แตะ

   ⚠️ `max-h-*` และ `min-h-*` **ไม่ผิด** — เป็นเพดานและพื้น ไม่ใช่ความสูงตาย
   `max-h-64` บน listbox ของ `Select`/`ComboBox` ยังยืดตามเนื้อหาได้เต็มที่
   ก่อนถึงเพดาน (จับผิดมาแล้วตอนรันครั้งแรก) */
const FIXED_HEIGHT = /(?<![\w-])h-(?:9|1[0-9]|2[0-9]|[3-9][0-9]|\[[^\]]*\])\b/g;

/* ─────────────────────────────────────────────────────────────────────────
   4 · การเคลื่อนไหวที่หลุดตัวกัน — warn (SC 2.3.3)
   ─────────────────────────────────────────────────────────────────────────
   ★★★ กฎนี้เขียนใหม่หลังอ่าน `base.css §10` — ฉบับแรกฟ้องแต่ของที่ปลอดภัย

   ฉบับแรกฟ้อง `animate-*` ทุกตัว ได้ 12 จุด (Dialog · Toast · Tooltip ·
   ComboBox · DatePicker · Select · Skeleton) — **false positive ทั้งหมด**

   `base.css §10` ครอบด้วย `*, *::before, *::after` + `!important` อยู่แล้ว:
     • `animation-duration: 1ms` ตัด keyframe ทุกตัวทั้งระบบ
     • `.animate-pulse` `.animate-bounce` `.animate-ping` → `animation: none`
     • `.skeleton` → `animation: none` + พื้นนิ่ง
     • `transition-property` ถูกตั้งใหม่ให้เหลือเฉพาะ opacity/สี → แปลว่า
       `transition-transform` **หยุดเป็น transition โดยอัตโนมัติ** (Switch ·
       Accordion ยังกระโดดไปตำแหน่งใหม่ทันที ซึ่งถูกต้อง — ตัวบอกสถานะต้องขยับ)

   ช่องโหว่จริงมีข้อเดียว: block `❌ DENY` ที่ตัด transform เป็นแบบ **opt-in**
   ผูกกับ `[data-motion="transform"]` `.motion-slide` `.motion-scale`
   การเคลื่อนไหว **ขาเข้า/ขาออก** ที่เลื่อนหรือซูมจริง (`slide-in` `zoom-in`
   `translate-y` ตอน `data-entering`) จะยังเคลื่อนที่ ถ้าไม่ติดป้ายไว้

   fade เข้า/ออกไม่เข้าข่าย — `@keyframes fade-in/out` เป็น opacity ล้วน
   และอยู่ในรายการ ALLOW โดยตั้งใจ (`base.css` บรรทัด 230) */
const MOTION_RISK =
  /\b(?:transition-all|(?:data-\[?(?:entering|exiting)\]?:)[\w-]*(?:translate|scale|rotate|slide|zoom)[\w./[\]-]*|animate-\[[^\]]*(?:slide|zoom|translate|scale)[^\]]*\])/g;
const MOTION_GUARD = /data-motion=["']transform["']|motion-slide|motion-scale|motion-reduce:/;

/* ★★★ scroll container ต้องเป็น positioned ancestor
   `sr-only` ของ Tailwind คือ `position: absolute` · ถ้าอยู่ในกล่องที่เลื่อน
   แนวนอนแต่ **ไม่มีบรรพบุรุษที่ positioned** containing block จะกลายเป็น
   viewport ⇒ span หลุดออกจากกล่องที่เลื่อน ไปดันความกว้างของ `html`
   **หน้าทั้งหน้าเลื่อนแนวนอน = SC 1.4.10 แดง** โดยที่ตาไม่เห็นอะไรผิด

   วัดเจอจริง 2026-07-30: gallery ที่ 320px `scrollWidth 443` ต้นเหตุคือ span
   `sr-only` ("54 รายการ") ของ `CategoryNav` อยู่ที่ x=442 · ทั้งระบบมี scroll
   container 14 จุด และ **ไม่มีจุดไหนเป็น relative เลย**

   ⚠️ กฎนี้ตรวจ **บรรทัดเดียวกัน** — ต้องเขียน `relative` ไว้ในสตริงคลาส
      เดียวกับ `overflow-*` ไม่ใช่คนละบรรทัดของ `cn()` เพราะอ่านง่ายกว่า
      และทำให้กฎบังคับได้จริงโดยไม่ต้องวิเคราะห์ AST */
const SCROLL_BOX = /\boverflow(?:-[xy])?-(?:auto|scroll)\b/g;

/* ═══ 5 กฎจาก `theme.css` ที่ประกาศว่า "lint ต้องบังคับ" แต่ไม่เคยถูกบังคับจริง ═══
   วัดเมื่อ 2026-07-30: บล็อกนั้นไล่ 11 ข้อ · linter บังคับจริง **1 ข้อ**
   (ข้อ 1 เงาดิบ) ส่วนที่ linter บังคับจริงอีกชุดกลับ **ไม่อยู่ในลิสต์ 11 ข้อ**
   นั่นคือรูปแบบ §5 — เอกสารอ้างการบังคับที่ไม่มีอยู่ · และมันแพงขึ้นมาก
   ตอน publish เป็น `@smego/lint` ให้ทีมแอป เพราะพวกเขาจะเชื่อว่าถูกคุ้มครอง 11 ข้อ

   ⚠️ **ข้อ 5 (`p-0.5`/`gap-0.5`) ไม่ถูกเขียนที่นี่โดยเจตนา** — มันขัดกับข้อ 4
   ของ `theme.css` เอง ซึ่งระบุ `0.5` อยู่ในชุด spacing ที่อนุมัติ และโค้ดใช้จริง
   8+ จุดโดยมีเหตุผลกำกับ (จัดไอคอนให้ตรงบรรทัดแรก · ระยะ label สองบรรทัด)
   การบังคับกฎที่ขัดกับตัวเองต้องแก้เอกสารก่อน ไม่ใช่แก้โค้ด 8 จุดตามกฎที่ผิด */

/** ข้อ 6 — ไอคอนต้องผ่าน `<Icon name>` ไม่งั้น bundler ลาก Lucide ~1,600 ตัว */
const LUCIDE_DIRECT = /from\s+['"]lucide-react['"]/g;

/** ข้อ 8 — ห้ามบนข้อความไทย · ระบบนี้ไทยล้วน จึงห้ามทั้งระบบ */
const THAI_HOSTILE_TYPE = /\b(?:italic|uppercase|capitalize|tracking-[\w.[\]/-]+)\b/g;

/** ข้อ 9 — `!important` · ข้อยกเว้นเดียวคือบล็อก prefers-reduced-motion ใน base.css */
const BANG_IMPORTANT = /!important/g;

/** ข้อ 10 — ปุ่มข้อความไทยยาวกว่าอังกฤษ 20–40% · ปุ่มแคปซูลพังที่ 360px */
const CAPSULE_BUTTON = /\brounded-full\b/g;

/** ข้อ 11 — เลขไทย ๐–๙ กว้างต่างกันถึง 36.6% em ⇒ คอลัมน์ราคาเบี้ยว */
const THAI_DIGIT = /[\u0E50-\u0E59]/g;

const RULES = [
  {
    id: 'logical',
    label: 'คุณสมบัติเชิงตรรกะ (Logical properties)',
    severity: 'error',
    pattern: PHYSICAL_SIDE,
    suggest: suggestLogical,
    files: /\.tsx?$/,
  },
  {
    id: 'shadow',
    label: 'โหมดมืด (Dark Mode) — เงาดิบ',
    severity: 'error',
    pattern: RAW_SHADOW,
    suggest: () =>
      'shadow-(--elevation-raised) · shadow-(--elevation-floating) · ' +
      'shadow-(--elevation-overlay) — เปลี่ยนเป็นขอบสว่างในโหมดมืดให้แล้ว',
    files: /\.(tsx?|css)$/,
  },
  {
    id: 'scroll',
    label: 'การเข้าถึง (Accessibility) — scroll container ไม่เป็น positioned',
    severity: 'error',
    pattern: SCROLL_BOX,
    guard: (line) => /\brelative\b/.test(line),
    suggest: () =>
      'เติม `relative` ในสตริงคลาสเดียวกัน — ไม่งั้น `sr-only` (position: absolute) ' +
      'หลุดออกจากกล่องที่เลื่อน ไปดันความกว้างของ html ทั้งหน้าเลื่อนแนวนอน (SC 1.4.10)',
    files: /\.tsx?$/,
  },
  {
    id: 'icon',
    label: 'ประสิทธิภาพ (Performance) — import lucide-react ตรง ๆ (theme.css ข้อ 6)',
    severity: 'error',
    pattern: LUCIDE_DIRECT,
    exempt: /icon[/\\]registry\.ts$/,
    suggest: () =>
      'ใช้ `<Icon name size />` — import ตรงทำให้ bundler ลากไอคอน ~1,600 ตัวเข้ามา · ' +
      'ทะเบียนไอคอนต้องเป็น static import map ที่ icon/registry.ts ที่เดียว',
    files: /\.tsx?$/,
  },
  {
    id: 'thaitype',
    label: 'ตัวอักษร (Typography) — utility ที่ทำร้ายข้อความไทย (theme.css ข้อ 8)',
    severity: 'error',
    pattern: THAI_HOSTILE_TYPE,
    suggest: (m) =>
      m.startsWith('tracking')
        ? 'ห้าม letter-spacing บนไทย — วรรณยุกต์และสระลอยจะหลุดตำแหน่ง'
        : 'ไทยไม่มี italic/uppercase/capitalize — Anuphan ไม่มี italic face เลย ' +
          '(ยืนยันจากไฟล์ฟอนต์) เบราว์เซอร์จะเอียงด้วยการ skew ซึ่งทำให้รูปอักษรผิด',
    files: /\.tsx?$/,
  },
  {
    id: 'important',
    label: 'ลำดับความสำคัญ (Specificity) — !important (theme.css ข้อ 9)',
    severity: 'error',
    pattern: BANG_IMPORTANT,
    exempt: /base\.css$/,
    suggest: () =>
      '!important ทำให้ layer ของ Tailwind ไร้ความหมายและแก้ตามไม่ได้ · ' +
      'ข้อยกเว้นเดียวคือบล็อก prefers-reduced-motion ใน base.css (SC 2.3.3)',
    files: /\.(tsx?|css)$/,
  },
  {
    id: 'capsule',
    label: 'ตอบสนอง (Responsive) — ปุ่มแคปซูล (theme.css ข้อ 10)',
    severity: 'error',
    pattern: CAPSULE_BUTTON,
    only: /inputs[/\\]Button\.tsx$/,
    suggest: () =>
      'ข้อความปุ่มไทยยาวกว่าอังกฤษ 20–40% — ปุ่มแคปซูลพังที่ 360px · ' +
      'ใช้ rounded-(--radius-control) · chip/badge/avatar/dot/หัวจับ slider กลมได้',
    files: /\.tsx?$/,
  },
  {
    id: 'thainum',
    label: 'ตัวเลข (Numerals) — เลขไทยในข้อมูล (theme.css ข้อ 11)',
    severity: 'error',
    pattern: THAI_DIGIT,
    suggest: () =>
      'เลขไทย ๐–๙ กว้างต่างกันถึง 36.6% em ⇒ คอลัมน์ราคาและตารางเบี้ยว · ' +
      'ใช้เลขอารบิกทุกที่ที่เป็นตัวเลข',
    files: /\.tsx?$/,
  },
  {
    id: 'height',
    label: 'ประสิทธิภาพ (Performance) — ความสูงตายตัว',
    severity: 'warn',
    pattern: FIXED_HEIGHT,
    suggest: () =>
      'ให้ความสูงมาจาก line-height + padding (SC 1.4.12) · ' +
      'ถ้าเป็นกล่องรูปที่กัน CLS ให้ใช้ aspect-* แทน',
    files: /\.(tsx?|css)$/,
  },
];

/**
 * ลบเนื้อหาในคอมเมนต์ออกก่อนสแกน โดย**คงจำนวนบรรทัดไว้เท่าเดิม**
 * เพื่อให้เลขบรรทัดที่รายงานยังตรง
 *
 * ⚠️ จำเป็นกว่าใน `lint-classes.mjs` เสียอีก — ไฟล์ `.tsx` ในระบบนี้
 * อธิบาย anti-pattern ไว้ในคอมเมนต์เยอะมาก (`ไม่ใช้ ml-4 เพราะ…`)
 * ถ้าไม่ลบก่อน linter จะฟ้องเอกสารของตัวเอง
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
    const rel = relative(ROOT, file);
    const stripped = stripComments(readFileSync(file, 'utf8'));
    const lines = stripped.split('\n');

    for (const rule of RULES) {
      if (!rule.files.test(file)) continue;
      /* ยกเว้น/จำกัดระดับไฟล์ — เทียบกับ path ที่เห็นจาก root ไม่ใช่ path
         เต็มของเครื่อง เพื่อให้ผลเหมือนกันทุกเครื่อง */
      const relForRule = relative(ROOT, file);
      if (rule.exempt && rule.exempt.test(relForRule)) continue;
      if (rule.only && !rule.only.test(relForRule)) continue;
      lines.forEach((line, i) => {
        if (rule.guard && rule.guard(line)) return;
        for (const match of line.matchAll(rule.pattern)) {
          if (rule.id === 'logical' && CENTERING_IDIOM.test(match[0])) continue;
          findings.push({
            rule: rule.id,
            label: rule.label,
            severity: rule.severity,
            file: rel,
            line: i + 1,
            found: match[0],
            suggest: rule.suggest(match[0]),
          });
        }
      });
    }

    /* ★ กฎการเคลื่อนไหวเป็นระดับไฟล์ — ตัวกันอยู่คนละบรรทัดกับตัวที่เสี่ยง */
    if (/\.tsx?$/.test(file) && !MOTION_GUARD.test(stripped)) {
      lines.forEach((line, i) => {
        for (const match of line.matchAll(MOTION_RISK)) {
          findings.push({
            rule: 'motion',
            label: 'การเคลื่อนไหว (Animation) — หลุดตัวกัน',
            severity: 'warn',
            file: rel,
            line: i + 1,
            found: match[0],
            suggest:
              'การเคลื่อนที่จริงต้องติดป้ายให้ base.css §10 จับได้ — ' +
              'เติม data-motion="transform" หรือ class motion-slide / motion-scale · ' +
              'ถ้าเป็นแค่ crossfade ให้ใช้ animate-[fade-in…] ซึ่งอยู่ในรายการ ALLOW แล้ว',
          });
        }
      });
    }
  }
}

const errors = findings.filter((f) => f.severity === 'error');
const warnings = findings.filter((f) => f.severity === 'warn');

if (AS_JSON) {
  const byFile = {};
  for (const f of findings) {
    (byFile[f.file] ??= []).push({
      rule: f.rule, severity: f.severity, line: f.line, found: f.found,
    });
  }
  console.log(JSON.stringify({
    total: findings.length,
    errors: errors.length,
    warnings: warnings.length,
    byFile,
  }, null, 2));
  process.exit(0);
}

if (findings.length === 0) {
  console.log(
    `✅ ผ่านทั้ง ${RULES.length + 1} ข้อ — logical properties · เงา · ` +
      'scroll container · lucide · ตัวอักษรไทย · !important · ปุ่มแคปซูล · ' +
      'เลขไทย · ความสูง · การเคลื่อนไหว',
  );
  process.exit(0);
}

/* ★★★ ลำดับการพิมพ์ต้องมาจาก RULES เอง ไม่ใช่ลิสต์ที่พิมพ์ไว้ซ้ำ —
   ถ้าพิมพ์ซ้ำ กฎใหม่จะนับเข้า exit code แต่ไม่ถูกพิมพ์ = แดงแบบไม่บอกเหตุ
   ซึ่งเป็นเกตตาบอดอีกชนิด · `motion` ไม่ได้อยู่ใน RULES จึงต่อท้ายด้วยมือ */
for (const rule of [...RULES.map((r) => r.id), 'motion']) {
  const group = findings.filter((f) => f.rule === rule);
  if (group.length === 0) continue;

  const mark = group[0].severity === 'error' ? '❌' : '⚠️ ';
  console.error(`\n${mark} ${group[0].label} — ${group.length} จุด\n`);

  for (const f of group) {
    console.error(`   ${f.file}:${f.line}`);
    console.error(`     พบ:     ${f.found}`);
    console.error(`     ใช้แทน: ${f.suggest}\n`);
  }
}

console.error(`สรุป — error ${errors.length} · warn ${warnings.length}\n`);

const failed = STRICT ? findings.length : errors.length;
process.exit(failed > 0 ? 1 : 0);
