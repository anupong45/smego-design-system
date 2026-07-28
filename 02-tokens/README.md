# 02 · Design Tokens

ชั้น token ของ SME.GO Design System — รูปแบบที่ **เครื่องอ่านได้และใช้งานได้จริง** ของทุกการตัดสินใจในชั้น [01 Foundations](../01-foundations/README.md)

**ชั้นนี้ไม่ตัดสินใจอะไรใหม่** ทุกค่าต้องสืบกลับไปที่ชั้น 01 ได้ ถ้าชั้น 02 ต้องการค่าที่ชั้น 01 ไม่ได้กำหนด นั่นคือข้อบกพร่องของชั้น 01 และต้องแก้ที่นั่นก่อน

---

## ไฟล์

| ไฟล์ | บทบาท |
|---|---|
| [`tokens.json`](tokens.json) | **แหล่งความจริงเดียว** · รูปแบบ DTCG · 310 token · 204 reference |
| [`theme.css`](theme.css) | **จุดเข้าเดียว** — นำเข้าไฟล์นี้ในแอป |
| [`src/primitives.css`](src/primitives.css) | tier 1 · `:root` · `--sme-*` · ที่เดียวที่มี HEX ตายตัวได้ |
| [`src/semantic.css`](src/semantic.css) | tier 2 · `@theme` · สร้าง utility ทั้งหมด |
| [`src/dark.css`](src/dark.css) | tier 2 dark · override **เฉพาะค่าที่เปลี่ยน** 47 ค่า |
| [`src/components.css`](src/components.css) | tier 3 · **ว่างโดยตั้งใจ** พร้อมเกณฑ์รับเข้า |
| [`src/base.css`](src/base.css) | กฎ global ที่บังคับ token ให้ทำงาน |
| [`theme-init.js`](theme-init.js) | script กัน flash · ต้อง **inline synchronous** ใน `<head>` |
| [`figma-variables.md`](figma-variables.md) | ⚙️ **สร้างขึ้น** — ห้ามแก้ตรง ๆ |
| [`validate-tokens.js`](validate-tokens.js) | ตัวตรวจ 11 ข้อ |
| [`gen-figma.js`](gen-figma.js) | generator ของ `figma-variables.md` |

## การใช้งาน

```bash
node 02-tokens/validate-tokens.js   # ตรวจ 11 ข้อ — ต้องผ่านทุกข้อก่อน merge
node 02-tokens/gen-figma.js         # สร้าง figma-variables.md ใหม่จาก tokens.json
```

```css
/* ในแอป — นำเข้าไฟล์เดียว */
@import "@smego/tokens/theme.css";
```

```html
<!-- ⚠️ ทั้งสองบรรทัดนี้เป็นข้อบังคับ ไม่ใช่ทางเลือก -->
<html lang="th">
  <head>
    <meta name="color-scheme" content="light dark">
    <script>/* theme-init inline ที่นี่ — ห้าม defer ห้าม async */</script>
    <link rel="stylesheet" href="/theme.css">
```

`lang="th"` จำเป็นสำหรับ feature `locl` ของ Anuphan และการตัดคำไทย (ภาษาไทยไม่มีช่องว่างระหว่างคำ) · script ต้อง synchronous ไม่เช่นนั้นจะเห็น theme ผิดกระพริบ

---

## สถาปัตยกรรม 3 ชั้น

```
tier 1  primitive   --sme-blue-600: #0077C1           ชื่อบอก "สี"
                            ↓
tier 2  semantic    --color-primary-600: var(…)        ชื่อบอก "หน้าที่"
                    --color-fg-muted
                            ↓
tier 3  component   --btn-bg-hover                     by exception only
```

| ชั้น | ชื่อบอกอะไร | มีค่าตายตัวได้ไหม | component อ้างได้ไหม |
|---|---|---|---|
| 1 primitive | **สี** — `blue` `neutral` `gold` | ✅ ที่เดียวในระบบ | ❌ |
| 2 semantic | **หน้าที่** — `fg` `edge` `surface` | ❌ ต้องเป็น `var()` | ✅ **ชั้นเดียวที่อ้างได้** |
| 3 component | **component + property + state** | ❌ | ✅ |

---

## ⚠️ กฎการตั้งชื่อ — ยืนยันด้วยการ build จริง

**สิ่งสำคัญที่สุดในเอกสารนี้** ถ้าจำได้ข้อเดียวให้จำข้อนี้

namespace `--color-*` ของ Tailwind v4 เป็น **แบน** และใช้ร่วมกันระหว่าง `bg-` / `text-` / `border-` — **ชื่อ token คือ suffix ของ utility ตรง ๆ ไม่มีการตัดคำ**

```
--color-canvas       →  bg-canvas            ✅
--color-fg-muted     →  text-fg-muted        ✅
--color-edge-strong  →  border-edge-strong   ✅
```

### ผลที่ตามมา: ห้ามใส่ชื่อ property ลงในชื่อ token

| ❌ ชื่อที่ดูสมเหตุสมผล | utility ที่ได้จริง | ที่ต้องการ |
|---|---|---|
| `--color-text-primary` | `text-text-primary` | `text-fg` |
| `--color-border-strong` | `border-border-strong` | `border-edge-strong` |
| `--color-bg-surface` | `bg-bg-surface` | `bg-surface` |

**ทั้งสามข้อนี้เคยอยู่ในเอกสารชั้น 01 และผิดทั้งหมด** พบตอนติดตั้ง Tailwind v4.3.3 แล้ว compile จริง — ไม่ใช่จากการอ่านเอกสาร

> **วิธีตั้งชื่อของระบบนี้: เริ่มจาก "utility ที่ต้องการอ่านใน markup" แล้วย้อนกลับมาเป็นชื่อ variable** ไม่ใช่ทางกลับกัน

### namespace อื่นที่ต้องระวัง

| ต้องการ utility | namespace ที่ถูก | ที่เข้าใจผิดกันบ่อย |
|---|---|---|
| `duration-fast` | **`--transition-duration-fast`** | ~~`--duration-fast`~~ — v4 ไม่มี namespace นี้ ไม่สร้าง utility เลย |
| `ease-emphasized` | `--ease-emphasized` | ถูกอยู่แล้ว |
| `outline-focus-ring` · `ring-focus-ring` | `--color-focus-ring` | ~~`--focus-ring`~~ |
| `text-body` (+ line-height + weight) | `--text-body` · `--text-body--line-height` · `--text-body--font-weight` | |

**ใช้ชื่อเดียวต่อสิ่งหนึ่ง ไม่มี alias** — ระบบไม่มี `--duration-*` เป็นทางลัดของ `--transition-duration-*` เพราะสองชื่อของสิ่งเดียวคือจุดที่นักพัฒนา override ผิดตัว

---

## รูปแบบชื่อแต่ละชั้น

### tier 1 — `--sme-{category}-{step}`

```
--sme-blue-600    --sme-neutral-850    --sme-gold-500
--sme-yellow-500  --sme-green-700      --sme-red-600
```

**category คือชื่อสี ไม่ใช่บทบาท** — `yellow` ไม่ใช่ `warning` · `green` ไม่ใช่ `success` · `red` ไม่ใช่ `danger` เพราะวันหนึ่งอาจเปลี่ยนว่าสถานะไหนใช้สีไหน แต่สีเหลืองยังเป็นสีเหลือง

### tier 2 — namespace ของ Tailwind

| กลุ่ม | รูปแบบ | ตัวอย่าง |
|---|---|---|
| พื้นผิว | `--color-{role}` | `--color-canvas` `--color-surface` `--color-sunken` |
| ตัวอักษร | `--color-fg` · `--color-fg-{variant}` | `--color-fg` `--color-fg-muted` |
| ตัวอักษรบนพื้นสี | `--color-on-{surface}` | `--color-on-brand` `--color-on-accent` |
| ขอบ | `--color-edge` · `--color-edge-{variant}` | `--color-edge-strong` |
| สถานะ | `--color-{status}-{part}` | `--color-warning-icon` `--color-success-fill` |
| ramp | `--color-primary-{step}` | `--color-primary-600` |
| บทบาท (นอก `@theme`) | `--{role}-{variant}` | `--elevation-raised` `--motion-enter` `--radius-control` |

### tier 3 — `--{component}-{property}-{state}`

```
--btn-bg-hover    --input-border-invalid    --card-shadow-selected
```

---

## ❌ รูปแบบที่ห้ามใช้

| ห้าม | เหตุผล |
|---|---|
| ชื่อบทบาทใน tier 1 — `--sme-primary-600` | ผูกสีกับบทบาทถาวร ทำให้เปลี่ยนสีแบรนด์ต้องแก้ทุกที่ |
| ชื่อสีใน tier 2 — `--color-blue-600` | ผูกบทบาทกับสีถาวร |
| ชื่อ property ในชื่อ token — `--color-text-primary` | ได้ `text-text-primary` |
| ค่า HEX ที่ไหนก็ตามเหนือ tier 1 | ทำให้ธีมและการเปลี่ยนแบรนด์พังเงียบ ๆ |
| `!important` | ยกเว้นเดียว: block `prefers-reduced-motion` ใน `base.css` |
| alias สองชื่อของสิ่งเดียว | นักพัฒนาจะ override ผิดตัว |
| ค่า arbitrary — `p-[13px]` `rounded-[10px]` | ถ้า scale ไม่มี แปลว่าออกแบบผิด ไม่ใช่ scale ผิด |

---

## เกณฑ์รับเข้า tier 3

tier 3 **ว่างตั้งแต่ต้นโดยตั้งใจ** ไม่ใช่เพราะยังไม่ได้ทำ

token จะเข้า tier 3 ได้ต้องเข้าเงื่อนไข **ทั้งสองข้อ**

1. component ต้องการค่าที่ **ไม่มี semantic token ใดแสดงได้** หรือต้องเปลี่ยน theme **แยกจาก component อื่นทุกตัว**
2. ความต้องการนั้นมาจาก **งานออกแบบจริงที่มีอยู่แล้ว** ไม่ใช่การคาดการณ์

| เข้าเงื่อนไข | ทำอะไร |
|---|---|
| ทั้งสองข้อ | เพิ่มเข้า tier 3 พร้อม `$description` อธิบายว่าเข้าเงื่อนไขอย่างไร |
| ข้อเดียว | ใช้ semantic token |
| ไม่เข้าเลย | ใช้ Tailwind utility จาก tier 2 |

**⚠️ ถ้า `components.css` เริ่มยาวขึ้นเรื่อย ๆ นั่นเป็นสัญญาณว่า tier 2 ยังไม่ครบ** ให้แก้ที่ tier 2 ไม่ใช่เติมที่ tier 3

---

## Dark mode

`data-theme="light|dark"` บน `<html>` · ค่าที่ผู้ใช้เลือกมี **3 สถานะ** `light` `dark` `system` โดย `system` ถูก resolve เป็นค่าใดค่าหนึ่งก่อน first paint จึงทำให้ **CSS ไม่ต้องรู้เรื่อง `system` เลย**

```
--sme-blue-600 = #0077C1 ทั้งสองโหมด        ← primitive ไม่เคยเปลี่ยน
--color-link   = blue-700 (สว่าง) → blue-400 (มืด)   ← บทบาทเปลี่ยน
```

### ค่าที่วัดได้ในโหมดมืด

| token | สว่าง | มืด |
|---|---|---|
| `--color-canvas` | `#F8F9FB` | `#12141A` |
| `--color-fg` | `#1D2128` | `#F1F3F6` |
| `--color-link` | `#00619E` | `#50AAE2` |
| `--color-focus-ring` | `#0077C1` | `#50AAE2` |
| **`--elevation-edge-modal`** | `#E1E4EA` ตกแต่ง | **`#747C8B` รับน้ำหนักจริง** |

แถวสุดท้ายคือหัวใจของโหมดมืดในระบบนี้ — **ขั้นพื้นผิวห่างกันเพียง ~1.14:1 ซึ่งต่ำกว่าเกณฑ์ 3:1 มาก ดังนั้นขอบคือตัวแยกจริง ไม่ใช่พื้นผิว** สถาปัตยกรรมเดิมวางไว้กลับกัน และผลวัดเป็นตัวแก้

### ข้อจำกัดที่รู้ตัว 2 ข้อ

**1 · การสลับ theme เป็นทิศทางเดียว** (พบจากการทดสอบใน browser จริง)

```html
<body>                       <!-- สว่าง -->
  <aside data-theme="dark">  <!-- ✅ มืดจริง -->

<html data-theme="dark">     <!-- มืด -->
  <aside data-theme="light"> <!-- ❌ ยังมืด -->
```

เพราะค่าโหมดสว่างประกาศบน `:root` (ผ่าน `@theme`) ไม่ได้ประกาศบน `[data-theme="light"]` การแก้ต้องคัดลอกค่าทั้งชุดออกมา ซึ่งจะไม่ตรงกันตั้งแต่การแก้ครั้งถัดไป **ไม่กระทบ SME.GO** เพราะสลับ theme ระดับทั้งหน้า

**2 · ไม่มี fallback เมื่อปิด JavaScript** — ผู้ใช้จะได้โหมดสว่างแม้ตั้งค่าระบบเป็นมืด เพราะ CSS รวม selector กับ media query ในกฎเดียวไม่ได้ สิ่งที่ยังได้คือ `color-scheme` ผ่าน meta tag ทำให้ scrollbar และ native control ตรงกับ OS

---

## Tailwind v4 — ไม่มี `tailwind.config.ts`

v4 เป็น **CSS-first** บล็อก `@theme` ทำหน้าที่เป็น config เอง

### ⚠️ ข้อยกเว้นเดียวของสถาปัตยกรรม 2 ชั้น

**`--breakpoint-*` และ `--container-*` ต้องเป็นค่าตายตัว ห้ามชี้ไปที่ `var(--sme-*)`**

Tailwind อ่านค่าไปสร้าง media query ตอน build และ `@media (width >= var(--x))` เป็น CSS ที่ใช้ไม่ได้ — ถ้าทำจะทำให้ **responsive utility ทั้งระบบพังเงียบ ๆ** โดยไม่มี error

ค่าเป็น `rem` เพื่อให้ขยายตามการตั้งค่าขนาดตัวอักษรของผู้ใช้ — ผู้ใช้ที่ตั้งฟอนต์ระบบใหญ่ขึ้นจะได้ layout มือถือบนจอที่กว้างขึ้น ซึ่งเป็นพฤติกรรมที่ถูก

---

## ลำดับ import — ห้ามสลับ

```css
@import "tailwindcss";
@import "./src/primitives.css";   /* tier 1                              */
@import "./src/semantic.css";     /* tier 2 · @theme                     */
@import "./src/dark.css";         /* tier 2 dark · ต้องมาหลัง semantic   */
@import "./src/components.css";   /* tier 3                              */
@import "./src/base.css";         /* กฎ global                           */

@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));
```

`dark.css` อยู่นอก `@layer` โดยตั้งใจ · ตรวจจาก output จริงแล้วพบว่าอยู่ใน `@layer utilities` ส่วน `@theme` อยู่ใน `@layer theme` → **utilities ชนะ theme** จึง override ได้ถูกต้อง

---

## ตัวตรวจ 11 ข้อ

```bash
node 02-tokens/validate-tokens.js
```

| # | ตรวจอะไร |
|---|---|
| 1 | JSON ถูกต้อง |
| 2 | ทุก `{reference}` resolve ได้ (0 broken จาก 204) |
| 3 | tier 2 ไม่มีค่าสีตายตัว (ยกเว้น `#00000000` ที่ระบุเหตุผล) |
| 4 | ไม่มี font-size ต่ำกว่า 13px |
| 5 | ทุก typography มีอัตราส่วน line-height ≥ 1.333 |
| 6 | line-height ทุกค่าอยู่บน 4px grid |
| 7 | spacing = ชุดที่อนุมัติ 15 ค่า ไม่ขาดไม่เกิน |
| 8 | ทุกขนาดไอคอนมี stroke ผูกไว้ |
| 9 | dark override มีคู่ใน light ทุกตัว (ไม่มี orphan) |
| 10 | **`tokens.json` ↔ `semantic.css` ตรงกัน** (52/52) |
| 11 | tier 3 ว่าง |

**ข้อ 10 จับ drift ได้จริงแล้วครั้งหนึ่ง** — พบว่า `--color-primary-*` 11 ตัวมีใน CSS แต่หายไปจาก `tokens.json`

### สิ่งที่ตัวตรวจนี้ตรวจไม่ได้ — ต้องทำมือ

| ต้องตรวจ | วิธี |
|---|---|
| utility สร้างออกมาจริงครบ | build ด้วย Tailwind CLI แล้วเทียบกับ probe |
| dark override ชนะ cascade จริง | อ่าน computed value ใน browser จริง |
| ไม่มี theme กระพริบ | โหลดโดยตั้ง OS เป็นโหมดมืด + throttle เน็ต |
| contrast ทุกคู่ | ดู [`02-color.md`](../01-foundations/02-color.md) |

---

## ⚠️ หมายเหตุเรื่องรูปแบบ DTCG

`tokens.json` ใช้ **string form** สำหรับ dimension (`"1rem"`) ไม่ใช่ object form ที่ DTCG draft ล่าสุดกำหนด (`{"value":1,"unit":"rem"}`)

**เหตุผล:** Style Dictionary และ Tokens Studio รับ string ทั้งคู่ในวันนี้ ส่วนรูปแบบ object ยังไม่เสถียรในเครื่องมือจริง — ถ้าเพิ่ม consumer ที่บังคับ strict DTCG ต้องมี build transform แปลง

เป็นข้อจำกัดที่รู้ตัว บันทึกไว้ใน `$description` ระดับบนสุดของไฟล์

---

## ชั้นถัดไป

| Layer | ขอบเขต | สิ่งที่ต้องพร้อมก่อน |
|---|---|---|
| **03 React UI Library** | Inputs · Navigation · Feedback · Data Display · Marketplace · Layout | ✅ ชั้น 01 และ 02 เสร็จ |
| 04 Marketplace Pattern | ค้นหา · กรอง · เปรียบเทียบ · ติดต่อ | ชั้น 03 |
| ~~05 Templates~~ | ❌ **ไม่ทำ** — แอปประกอบหน้าเอง (คำตัดสิน 2026-07-29) ดูหมายเหตุใต้ตาราง | — |
| 06 Documentation | คู่มือและ governance | ทั้งหมด |
| 07 Tailwind Theme | preset พร้อมใช้ | ✅ `theme.css` เป็นตัวมันเองอยู่แล้ว |

**ชั้น 05 Templates — ไม่ทำ** (คำตัดสิน 2026-07-29)

`04-patterns/05-cart-and-checkout.md` เขียนไว้แต่แรกว่า "ไม่ทำ — แอปประกอบหน้าเอง" ขณะที่ตารางนี้เคยลิสต์ไว้ว่าจะทำ · **ตารางผิด** และความขัดแย้งนี้ทำให้ภาระ SC 2.4.1 (skip link) ถูกฝากไว้กับชั้นที่ไม่เกิดใน `Grid.md` และ `FilterPanel.md`

เหตุผลที่ไม่ทำ:

- ชั้น 04 เป็น **เอกสารรูปแบบ** ที่บอกวิธีประกอบอยู่แล้ว การเพิ่มโค้ดหน้าตั้งต้นทับลงไปคือแหล่งความจริงที่สอง
- `@astryxdesign/cli` มี page template ~20 แบบ แต่**ไม่มีหน้า marketplace เลย** (`ide` · `kanban-board` · `incident-console` · `dashboard`) — ชั้นนี้ของ Astryx เล็งผลิตภัณฑ์คนละประเภท ไม่มีอะไรให้รับมา
- สิ่งที่ template ควรเป็นเจ้าของจริง ๆ ถูกย้ายมาเป็น component ในชั้น 03 แล้ว: [`<Main>`](../03-components/src/layout/Main.md) เป็นเป้าของ skip link

⚠️ หนี้ที่ยังผูกกับชั้นนี้: `QUALITY.md` ข้อ 2.6 (lazy-load หน้า form 142 KB) เคยเขียนว่า "รอ layer 05" — ต้องหาเจ้าของใหม่ เพราะ 05 ไม่มา

**ชั้น 07 เสร็จไปพร้อมชั้น 02 แล้วโดยปริยาย** เพราะ Tailwind v4 เป็น CSS-first — `theme.css` **คือ** Tailwind theme ไม่มี config แยกให้สร้าง สิ่งที่เหลือของชั้น 07 คือการ package เป็น npm module ถ้าต้องแชร์ข้ามหลาย repo
