# SME.GO Style Guideline

**แนวทางการเขียนโค้ดและเอกสารของ SME.GO Design System**
อ้างอิงสถาปัตยกรรมของ **Astryx** (Meta) · ปรับให้เข้ากับ Tailwind v4 และบริบทภาษาไทย

---

## 0 · ที่มา และการยกเลิกข้อจำกัดที่บันทึกไว้ก่อนหน้า

โจทย์ตั้งต้นระบุให้ใช้ *"Astryx architecture, naming conventions, accessibility principles, component philosophy, token hierarchy and documentation style"* โดย **ไม่ลอก visual language**

ตอนเขียนชั้น 01 ผมบันทึกข้อจำกัดไว้ว่ายังไม่ได้อ่านเอกสารต้นฉบับ จึงเรียกแนวทางว่า *"Astryx-style"* ไม่ใช่การอ้างว่าตรงตามสเปกจริง

**ข้อจำกัดนั้นยกเลิกแล้ว** — ค้นและอ่านเอกสารจริงเมื่อ 25 ก.ค. 2569 ได้ข้อเท็จจริงต่อไปนี้

| เรื่อง | ข้อเท็จจริง |
|---|---|
| Astryx คืออะไร | design system **open-source ของ Meta** เติบโตภายในบริษัท ~8 ปี ใช้กับแอปกว่า 13,000 ตัว ปล่อย beta มิ.ย.–ก.ค. 2569 |
| Stack | **React + StyleX** — นำเข้า CSS ที่ build มาแล้ว ไม่ต้องใช้ build plugin |
| ขอบเขต | **150+ component** · **7 theme** พร้อมใช้ · template · CLI |
| Package | `@astryxdesign/core` · `/cli` · `/build` · `/theme-*` |
| โครงสร้าง repo | `packages/` · `apps/` (docsite + Storybook) · `internal/` (tooling + ESLint plugin) |
| จุดขายหลัก | **agent-ready** — ออกแบบมาให้ AI ใช้ได้ตั้งแต่ต้น ไม่ใช่ดัดของเดิมให้เข้ากับ agent · มี **CLI + MCP server** ที่พิมพ์เอกสาร component แบบเครื่องอ่านได้ |

**หลักการที่เขาประกาศและมีผลต่อเราตรง ๆ**

> ระบบดูแลพฤติกรรม การเข้าถึง และคุณภาพ · theme ดูแลหน้าตา

และ theme ในนิยามของเขาคือ **ชุดของการ override CSS custom property** ไม่ใช่การ fork หรือ wrap source ของ component

---

## 1 · สิ่งที่ SME.GO ตรงกับ Astryx อยู่แล้ว

ไม่ได้ตรงเพราะลอก แต่เพราะเป็นข้อสรุปเดียวกันจากข้อจำกัดเดียวกัน

| หลักของ Astryx | SME.GO ทำอย่างไร | หลักฐาน |
|---|---|---|
| theme = ชุด override CSS custom property | `[data-theme="dark"]` override **tier 2 เท่านั้น** · tier 1 ไม่เคยเปลี่ยน — `--sme-blue-600` เป็น `#0077C1` ทั้งสองโหมด สิ่งที่เปลี่ยนคือ *ขั้นไหนเล่นบทบาทไหน* | [`02-tokens/src/dark.css`](02-tokens/src/dark.css) |
| ระบบดูแลพฤติกรรมและการเข้าถึง · theme ดูแลหน้าตา | `base.css` เป็นเจ้าของ focus ring · reduced motion · reset italic · `scroll-margin` — **component ไม่เคยเขียน focus style เอง** | [`02-tokens/src/base.css`](02-tokens/src/base.css) · [`Button.md §4`](03-components/src/inputs/Button.md) |
| ปรับแต่งที่ระดับ token — color · typography · radius · motion | ตรงกับ 4 กลุ่มของเราพอดี | [`02-tokens/tokens.json`](02-tokens/tokens.json) |
| ประกอบได้ทุกระดับ · building block ที่ต้องใช้ export ตรง ๆ | wrapper เป็นค่าเริ่มต้น + **`@smego/ui/primitives`** เปิด RAC ทั้งชุดเป็นทางหนี | ข้อ 24 |
| ทุก component ใช้กฎการตั้งชื่อ prop และการประกอบเดียวกัน | `.md` 9 หัวข้อเรียงลำดับเดียวกันทั้ง 60 ไฟล์ · CVA pattern เดียว | ข้อ 3 · 6 ของเอกสารนี้ |
| การเข้าถึงต้องไม่กลายเป็นภาระของแต่ละโปรเจกต์ | บังคับผ่าน**โครงสร้าง** ไม่ใช่เอกสาร — `<Icon>` ไม่มี prop ให้ override stroke · `no-restricted-imports` ปิด `lucide-react` · `tsc` strict | [`Icon.tsx`](03-components/src/icon/Icon.tsx) |

**จุดที่เราเข้มกว่า:** Astryx ไม่ได้ประกาศระดับ WCAG ไว้ต่อสาธารณะ **SME.GO ผูกตัวเองกับ WCAG 2.2 AA เป็นเกณฑ์ผ่าน/ไม่ผ่าน** และวัด contrast ทุกคู่จริง

---

## 2 · สิ่งที่ต่างโดยตั้งใจ — และเหตุผล

| เรื่อง | Astryx | SME.GO | ทำไมต่าง |
|---|---|---|---|
| **Styling** | StyleX | **Tailwind v4** | การตัดสินใจข้อ 18 · ผลคือ **ใช้ `@astryxdesign/core` ไม่ได้** และ build plugin ของเขาใช้ไม่ได้ — เราลอกได้แค่สถาปัตยกรรม ไม่ใช่โค้ด |
| **Headless base** | ของตัวเอง | **React Aria Components** | เหตุผลชี้ขาดคือ **`BuddhistCalendar` สำหรับ *ตัวเลือกวันที่*** — ไม่ใช่การจัดรูปแบบ · ดูหมายเหตุด้านล่าง |
| **ขอบเขต** | 150+ component | ~60 | เราสร้างเฉพาะที่ marketplace ใช้จริง |
| **Theme** | 7 theme พร้อมใช้ | light + dark ของแบรนด์เดียว | tier 1/2 ที่แยกไว้รองรับ co-branding ต่อหน่วยงานได้แล้ว ยังไม่มีความต้องการจริง |
| **ภาษา** | อังกฤษ | **ไทยเป็นหลัก** | ข้อ 1 · 20 — และเป็นเหตุที่กฎหลายข้อของเราไม่มีใน Astryx (ห้าม italic · ห้าม letter-spacing · ห้ามเลขไทยในคอลัมน์ · IME composition) |

### 📌 เหลาเหตุผลของ RAC ให้แม่น — การจัดรูปแบบ พ.ศ. ได้ฟรีทุกที่

ทดสอบใน browser จริงพบว่า **CLDR กำหนดปฏิทินเริ่มต้นของภาษาไทยเป็นพุทธศักราชอยู่แล้ว**

| locale | ปฏิทิน | ผล |
|---|---|---|
| `th-TH` | **buddhist** | 25 กรกฎาคม 2569 |
| `th-TH-u-ca-buddhist` | buddhist | 25 กรกฎาคม 2569 |
| `th-TH-u-ca-gregory` | gregory | 25 กรกฎาคม **ค.ศ. 2026** |

แปลว่า `Intl.DateTimeFormat` ให้ พ.ศ. ได้ฟรีในทุก framework — **ไม่ใช่เหตุผลที่จะเลือก RAC**

**เหตุผลจริงคือ UI ของตัวเลือกวันที่** — ปฏิทินที่ผู้ใช้กดเลือกต้องเดินเดือนและปีในระบบ พ.ศ. ซึ่งต้องมี *calendar implementation* ไม่ใช่แค่ formatter · `@internationalized/date` มี `BuddhistCalendar` ให้ ส่วน **Radix ไม่มี date picker เลย** จึงต้องเขียนปฏิทิน พ.ศ. เองทั้งหมด ซึ่งเป็นงานหนักและเสี่ยงพลาด a11y

---

## 3 · สิ่งที่ควรรับมาจาก Astryx — แก้คำวินิจฉัยใหม่ (2026-07-29)

> ⚠️ **ฉบับก่อนของหัวข้อนี้วินิจฉัยผิด** เขียนว่าปัญหาคือ *"เรามีแค่ `.md` ต่อ component ซึ่งคนอ่านได้แต่ **agent ต้องเดาโครงสร้าง**"* แล้วเสนอ `smego docs <Component>` + MCP เป็นชั้น 06

**หลักฐานไม่สนับสนุนคำวินิจฉัยนั้น**

สัปดาห์ 26–29 ก.ค. ทำงานกับเอกสารชุดนี้ทั้งสัปดาห์ด้วย `grep`/อ่านไฟล์ตรง ๆ — **ไม่เคยติดปัญหาหาไม่เจอ** · ที่ติดจริงคือ **เอกสารบอกผิด** นับจากข้อความ commit ได้ **16 จุด** ที่บันทึกคำอ้างผิดหรือค้าง:

| ตัวอย่าง | สภาพจริง |
|---|---|
| §8.1 ติด ✅ | ทำจริง 4 จาก 13 ตัว |
| §4 แถว `~~TextField~~→TextInput` | ผิด 5 ช่องในแถวเดียว |
| ชื่อก่อน rename ในเอกสาร | ค้าง **97 จุด · 31 ไฟล์** + ลิงก์เสีย 9 |
| `propsOursOnly` | ประกาศ prop ผี 2 ตัว + component ผี 1 ตัว |
| `Compare.md` | สัญญา row selection ที่ scope ถอนไปแล้ว |
| `README` ชั้น 05 | ขัดกับ `04-patterns` ที่เขียนว่าไม่ทำ |
| `index.ts` snippet lazy-load | พังสองทาง (subpath ไม่มี + ต้องมี default export) |
| หัวข้อนี้เอง ข้อ 1 ในตารางช่องว่าง | บอกว่า RAC ไทย "ยังไม่ตัดสิน" ทั้งที่ทำเสร็จแล้ว |

**CLI ที่เสิร์ฟเอกสารเร็วขึ้นจึงเสิร์ฟคำตอบผิดเร็วขึ้น** — ต้องแก้ความน่าเชื่อก่อนแก้ความเร็ว

**สิ่งที่ทำแทน (มีผลจริงแล้ว)**

- `lint-docs.mjs` — ลิงก์เสีย + ชื่อก่อน rename · เข้า `verify` แล้ว
- `lint-parity.mjs` — บังคับตัดสินชื่อ Astryx **ทุก 105 ตัว** พร้อมเหตุผล และจับ prop/component ผี
- contrast sweep · RAC drift gate · bundle budget

**รูที่มีจริง และปิดแล้ว**

ไม่มี `CLAUDE.md`/`AGENTS.md` เลย — agent ที่เข้ามาเจอแค่ 3 ไฟล์ที่ราก แล้วต้องเดาว่า 85 ไฟล์ที่เหลืออยู่ไหน · เขียน [`CLAUDE.md`](CLAUDE.md) ที่รากแล้ว **ต้นทุนหนึ่งไฟล์ ไม่ใช่ CLI + MCP server**

⚠️ `astryx init --features agents` รันแล้วและ **ถอนออก** — ไฟล์ที่มันสร้างสั่งตรงข้ามกับระบบนี้ 6 ข้อ (ห้ามใช้ utility class ของ Tailwind · ห้าม override `--color-*` ใน `:root` · ใช้ `AppShell`/`SideNav`/`StatusDot` ที่เราปฏิเสธไว้) และมันวางที่ `.claude/CLAUDE.md` ซึ่งถูกโหลดอัตโนมัติ — เป็นอันตรายจริง ไม่ใช่ทฤษฎี · ดู `CLAUDE.md` ข้อ 0

**ถ้าจะทำ CLI ในอนาคต** เงื่อนไขยังพร้อมจริง: `.md` **55 จาก 60 ไฟล์มี 10 หัวข้อ** เรียงเหมือนกัน (เหลือ 4 ไฟล์ที่หลุด — ฉบับก่อนเขียนว่า "ทั้ง 60 ไฟล์ 9 หัวข้อ" ซึ่งผิดทั้งสองเลข) · `tokens.json` เป็น DTCG อยู่แล้ว · แต่ควรบังคับโครงหัวข้อด้วยเกตก่อน ไม่ใช่หวังว่ามันจะสม่ำเสมอเอง

---

## 4 · กฎการตั้งชื่อ token

**กฎเดียวที่สำคัญที่สุด และเป็นกฎที่ยืนยันด้วยการ build จริง**

namespace `--color-*` ของ Tailwind v4 เป็น **แบน** ใช้ร่วมกันระหว่าง `bg-` / `text-` / `border-` — **ชื่อ token คือ suffix ของ utility ตรง ๆ**

```
--color-canvas       →  bg-canvas            ✅
--color-fg-muted     →  text-fg-muted        ✅
--color-edge-strong  →  border-edge-strong   ✅

--color-text-primary   →  text-text-primary    ❌  ไม่ใช่ text-primary
--color-border-strong  →  border-border-strong ❌  ไม่ใช่ border-strong
```

> **ตั้งชื่อ token โดยเริ่มจาก utility ที่ต้องการอ่านใน markup แล้วย้อนกลับมา** ไม่ใช่ทางกลับกัน

| tier | รูปแบบ | ชื่อบอกอะไร | มีค่าตายตัวได้ไหม |
|---|---|---|---|
| 1 primitive | `--sme-{สี}-{ขั้น}` | **สี** — `blue` `gold` `yellow` | ✅ ที่เดียวในระบบ |
| 2 semantic | namespace ของ Tailwind | **หน้าที่** — `fg` `edge` `surface` | ❌ ต้องเป็น `var()` |
| 3 component | `--{component}-{property}-{state}` | component + property + state | ❌ · by exception only |

**ห้าม** — ชื่อบทบาทใน tier 1 · ชื่อสีใน tier 2 · ชื่อ property ในชื่อ token · ค่า HEX เหนือ tier 1 · alias สองชื่อของสิ่งเดียว

รายละเอียดครบใน [`02-tokens/README.md`](02-tokens/README.md)

---

## 5 · กฎการเขียน component

### 5.1 โครงสร้างที่ทุกตัวต้องเหมือนกัน

```
src/{หมวด}/{Component}.tsx    ← React API + Tailwind implementation
src/{หมวด}/{Component}.md     ← 9 หัวข้อ เรียงลำดับเดียวกัน
```

### 5.2 กฎ API

| กฎ | เหตุผล |
|---|---|
| wrapper เป็นค่าเริ่มต้น · `@smego/ui/primitives` เป็นทางหนี | ฟอร์มขอสินเชื่อมีหลายสิบช่อง การเขียน 5 บรรทัดต่อช่องคือที่มาของความไม่สม่ำเสมอ |
| `...rest` ส่งต่อไป RAC **เสมอ** | wrapper ห้ามกลืน `aria-describedby` ที่ RAC ต่อให้ |
| variant ที่บังคับความถูกต้องได้ **ห้ามมี prop ให้ override** | `<Icon>` ไม่มี prop `strokeWidth` เพราะ stroke ต้องผูกกับขนาด |
| union type ไม่ใช่ `number` / `string` | `IconSize = 16 \| 20 \| 24 \| 32 \| 48` ทำให้ค่าผิด compile ไม่ผ่าน |
| ใช้ `onPress` ของ RAC ไม่ใช่ `onClick` | ครอบ pointer · keyboard · touch ในทางเดียว |
| CVA แยกต่อ slot ไม่ใช่ object เดียว | component หลายส่วนต้องอ่านออกว่า class ไหนของส่วนไหน |

### 5.3 กฎที่บังคับด้วย lint หรือ type ไม่ใช่ด้วยเอกสาร

| ห้าม | ใช้แทน | บังคับอย่างไร |
|---|---|---|
| `shadow-{xs..2xl}` ใน component | `shadow-(--elevation-*)` | lint |
| `border-neutral-*` บน input | `border-edge-strong` | lint |
| `text-white` บนพื้นทอง/เหลือง | `text-on-accent` | lint |
| `import { X } from 'lucide-react'` | `<Icon name="x" />` | `no-restricted-imports` |
| `overflow-hidden` บน ancestor ของ focusable | ใส่ radius ที่ `<img>` | lint |
| `rounded-full` บนปุ่ม | `radius-control` | lint |
| spacing/radius นอกชุดที่อนุมัติ · arbitrary value | ชุดที่อนุมัติ | lint |
| `!important` | — | lint · ยกเว้น block `prefers-reduced-motion` เดียว |
| `italic` · `uppercase` · `tracking-*` บนข้อความไทย | น้ำหนัก 600 | lint |
| เลขไทย ๐–๙ ในตาราง/ราคา | เลขอารบิก | lint ตรวจ U+0E50–U+0E59 |

### 5.4 กฎบริบทที่ค้นพบจากการ render — ไม่ใช่จากการอ่าน token

| กฎ | ค่าที่วัดได้ | ที่มา |
|---|---|---|
| **`bg-sunken` ต้องอยู่บน `bg-surface` ห้ามอยู่บน `bg-canvas`** | โหมดมืด `sunken` = `canvas` เป๊ะ (**ratio 1.000**) · โหมดสว่างต่าง 1.055 | พบตอน render เอกสารนี้ — หัวตารางและพื้น inline code **หายไปทั้งหมด**ในโหมดมืด |
| **ลูกของ grid/flex ต้องมี `min-width: 0`** ถ้าข้างในมีกล่อง `overflow-x: auto` | ก่อนแก้ที่ 320px: `documentScrollWidth` = **653** · หลังแก้ = 320 | ลูกของ grid มี `min-width: auto` เป็นค่าเริ่มต้น จึงไม่ยอมย่อ → body เลื่อนแนวนอน = **ไม่ผ่าน SC 1.4.10** |
| **ตารางต้องอยู่ในกล่อง `overflow-x: auto` ของตัวเอง** | — | body ห้ามเลื่อนแนวนอน · ตารางเลื่อนในตัวเองได้ |

**สองข้อแรกเป็น bug ที่ `tsc` · lint · และการคำนวณ contrast จับไม่ได้เลย** เห็นได้เฉพาะเมื่อ render จริงและวัด computed style — เป็นเหตุผลที่ pipeline ในหัวข้อ 7 บังคับขั้น render

---

**ข้อเสนอที่ยังไม่ได้ทำ:** ใส่ `--color-*: initial` ใน `@theme` จะลบ palette เริ่มต้นของ Tailwind ทิ้ง ทำให้ `text-white` และ `bg-red-500` กลายเป็น **compile error ไม่ใช่ lint warning** — บังคับกฎ 2 ข้อผ่านโครงสร้างแทนความจำ

---

## 6 · โครงสร้างเอกสารต่อ component — 9 หัวข้อ

เรียงลำดับเดียวกันทั้ง 60 ไฟล์ · คำอธิบายภาษาไทย · โค้ดและชื่อ token ภาษาอังกฤษ

| # | หัวข้อ | ต้องมีอะไร |
|---|---|---|
| 1 | **ภาพรวม** | component แก้ปัญหาอะไร **และเมื่อไรที่ไม่ควรใช้** พร้อมทางเลือก |
| 2 | **React API** | ตาราง prop + type + ค่าเริ่มต้น + ทางหนี `@smego/ui/primitives` |
| 3 | **Variants** | ทุกคู่ variant × size + token ที่ใช้ + **ค่า contrast ที่วัดจริง** |
| 4 | **States** | ครบ 8 แมปกับ `data-*` ที่ RAC ปล่อย + ความสูงจริงที่วัดจาก render |
| 5 | **Accessibility** | role · ARIA · keyboard · **SC ที่เกี่ยวข้องพร้อมหมายเลข** |
| 6 | **Tailwind implementation** | สรุปการตัดสินใจของ CVA ไม่ใช่ copy โค้ดมาวาง |
| 7 | **Figma Variant** | property/value ที่ต้องสร้าง + variant ที่ห้ามลืม (`focus`) |
| 8 | **Usage** | ตัวอย่างที่ใช้**ข้อความไทยจริง** ไม่ใช่ lorem ipsum |
| 9 | **Anti-patterns** | ❌ → ✅ → **ทำไม** โดยอ้าง SC หรือค่าที่วัดได้ |

### กฎการเขียนที่ทำให้เอกสารนี้ต่างจากเอกสารทั่วไป

1. **ทุกตัวเลขต้องวัด ไม่ใช่ประมาณ** — เขียน `2.25:1` ไม่ใช่ "contrast ต่ำ"
2. **หัวข้อ 9 ต้องบอกทำไม** — "❌ `text-white` บนทอง → ✅ `text-on-accent` → ได้แค่ **2.37:1**" ไม่ใช่ "ใช้ token ที่ถูกต้อง"
3. **ข้อจำกัดที่ค้นพบต้องแยกจากการออกแบบ** — ใช้หัวข้อ *"ข้อจำกัดที่ค้นพบจากการวัด ไม่ใช่การออกแบบ"*
4. **การแก้ตัวเองต้องเขียนไว้ ไม่ลบทิ้ง** — ใช้ `📌 แก้ความแม่นยำ` พร้อมค่าเดิม ค่าใหม่ และเหตุผล
5. **ห้าม lorem ipsum** — ปุ่มไทยยาวกว่าอังกฤษ 20–40% ตัวอย่างที่ใช้ข้อความปลอมจะซ่อนปัญหา layout

---

## 7 · Definition of Done

component ถือว่าเสร็จเมื่อผ่านทุกข้อ

### ตรวจอัตโนมัติ

```bash
cd 03-components && npx tsc --noEmit    # 0 error
npx vitest run                          # jest-axe ทุก component
node ../02-tokens/validate-tokens.js    # 11 ข้อ · token ไม่ drift
```

### ตรวจด้วยการ render จริง — ขั้นที่ห้ามข้าม

**pipeline นี้จับ error ที่ `tsc` และการคำนวณจับไม่ได้ · พิสูจน์แล้วกับ Button**

```
เขียน → tsc → build Tailwind → render ใน browser → วัด computed style
```

| ตรวจอะไร | ทำไมขั้นก่อนหน้าจับไม่ได้ |
|---|---|
| utility ทุกตัว generate จริง | `tsc` ไม่รู้จัก Tailwind · ชื่อ token ผิดจะเงียบ |
| ความสูงจริงตรงกับที่เขียนในเอกสาร | **Button พบว่าเอกสารผิด +2px ทุกขนาด** เพราะไม่ได้นับ border |
| contrast จาก computed style ตรงกับที่คำนวณ | ยืนยันว่าค่าที่คำนวณไปถึงหน้าจอจริง |
| ทั้งสองโหมด | โหมดมืดมีกลไกคนละอย่างกับโหมดสว่าง |
| a11y tree ตอน loading/disabled | `opacity-0` เก็บ label ไว้ · `visibility:hidden` ไม่เก็บ |

### ตรวจด้วยมือ

- [ ] ใช้งานครบด้วยคีย์บอร์ดล้วน · ไม่มีกับดัก focus
- [ ] focus ring เห็นได้บน**ทุก variant** รวมพื้นสีอิ่มตัว
- [ ] ทดสอบที่ **320px** ไม่มี horizontal scroll (SC 1.4.10)
- [ ] ทดสอบที่ตัวอักษร **200%**
- [ ] เปิด `prefers-reduced-motion` แล้วไม่มีการเคลื่อนที่เหลือ
- [ ] ทุกอย่างที่ลากได้มีทางเลือกกดครั้งเดียว (SC 2.5.7)
- [ ] วางลงช่อง OTP และรหัสผ่านได้ (SC 3.3.8)
- [ ] `aria-label` เป็นไทยและมีข้อความที่แสดงอยู่รวมด้วย (SC 2.5.3)
- [ ] ทดสอบด้วยข้อความไทยที่ยาวจริง
- [ ] TalkBack + Chrome บน Android ด้วยเสียงไทย

---

## 8 · ช่องว่างที่รู้ตัว

| # | ช่องว่าง | สถานะ |
|---|---|---|
| 1 | **React Aria ไม่มี `th-TH`** ใน 34 locale | ✅ **ปิดแล้ว 2026-07-29** — `SmeGoProvider` ติดตั้งคำแปลให้เองเป็นค่าเริ่มต้น (เดิมเป็น opt-in และแอปที่ลืมเรียกจะให้ผู้ใช้ TalkBack ไทยได้ยินอังกฤษโดยไม่มีอะไรฟ้อง) · ฝัง en-US fallback ทั้ง 22 package ไว้ในไลบรารี (~1.3 KB gzip) เพราะ import `react-aria-components/i18n` ลากทั้ง 34 locale = **59 KB gzip** · มีเกต drift คู่กันที่ `tests/a11y/rac-fallback.test.ts` |
| 2 | **ไม่มี CLI / MCP** ให้ agent อ่านเอกสาร | ข้อเสนอในหัวข้อ 3 · ชั้น 06 |
| 3 | **ไอคอนโดเมนไทย 14 ตัว** (มอก. · ฮาลาล · GMP · DBD · ThaID · PromptPay) | สัญญาการวาดเขียนไว้แล้ว · **ยังไม่วาด** · ใช้ข้อความแทน ห้ามหยิบ Lucide ที่ใกล้เคียง |
| 4 | **ทองกับเหลืองห่างกัน 1.43:1** | ลดความเสี่ยงด้วยกฎ "ทองไม่ใช่สถานะ" + ทุกสถานะมีรูปทรงและข้อความ · **สีอย่างเดียวไม่พอ** |
| 5 | **Touch target 24×24** ต่ำกว่าที่ผู้ใช้ไทยคุ้น | ลดลงมากเพราะความสูง control เริ่มต้นเป็น **46px** · 24 ยังเป็นพื้นข้อกำหนด |

---

## แหล่งข้อมูล

- [Astryx Design System](https://astryx.atmeta.com/)
- [facebook/astryx · GitHub](https://github.com/facebook/astryx)
- [Introducing Astryx by Meta](https://astryx.atmeta.com/blog/introducing-astryx)
- [Meta Open-Sources Astryx · MarkTechPost](https://www.marktechpost.com/2026/07/21/meta-open-sources-astryx-an-agent-ready-react-design-system-with-150-accessible-components-seven-themes-and-a-cli/)

*ข้อเท็จจริงในหัวข้อ 0 ดึงจากแหล่งข้างต้นเมื่อ 25 ก.ค. 2569 · หน้า `/components/*` ของ docsite ตอบ 404 จึงยังไม่ได้เห็นโครงสร้างเอกสารต่อ component ของเขาโดยตรง — หัวข้อ 6 เป็นโครงสร้างของ SME.GO เอง ไม่ได้อ้างว่าลอกจาก Astryx*
