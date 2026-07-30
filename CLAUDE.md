# CLAUDE.md — SME.GO Design System

ทางเข้าเดียวสำหรับ agent · อ่านไฟล์นี้ก่อนแตะอะไร

---

## 0 · คำเตือนก่อนอื่น

⚠️ **`astryx init --features agents` สร้างไฟล์ที่ขัดกับระบบนี้** — รันแล้วเมื่อ 2026-07-29 และ **ถอนออก** เพราะมันสั่งตรงข้ามกับสิ่งที่ระบบนี้เป็น 6 ข้อ:

| ไฟล์ที่ Astryx สร้างบอกว่า | ระบบนี้จริง ๆ |
|---|---|
| "No StyleX/Tailwind compiler here — don't use utility classes" | **ทั้งระบบเป็น Tailwind v4 CSS-first** |
| "never override `--color-*` in `:root`" | `semantic.css` **นิยาม** `--color-*` ใน `:root` · และ `--color-*: initial` เป็นกลไกที่ตั้งใจ |
| "Full page → `AppShell` · sidebar nav → `SideNav`" | ทั้งคู่ **ปฏิเสธแล้ว** (`notOurConcern`) |
| "Status → `StatusDot`" | ของเราคือ `Dot` ที่บังคับ `label` (SC 1.4.1) |
| "No `<div>` — components do all layout" | เราใช้ `<div>` + utility ตามปกติ |
| "never Card-wrapped list items" | รายการสินค้าใช้ `ProductCard` ในกริด |

**ถ้าใครรันคำสั่งนั้นอีก ให้ถอนด้วย `astryx init --remove-agents` ทันที** — Astryx อยู่ในโปรเจกต์นี้ในฐานะ **ข้อมูลอ้างอิงสำหรับเทียบ API เท่านั้น** ไม่ใช่ไลบรารีที่เราใช้

---

## 1 · โครงสร้าง

```
01-foundations/   11 .md — การตัดสินใจเชิงหลักการ (สี · สเกล · a11y · motion)
02-tokens/        tokens.json (DTCG) + src/*.css + linter ทุกตัว
03-components/    @smego/ui — React + RAC + Tailwind v4 · ~80 .tsx / ~60 .md
04-patterns/      6 .md — รูปแบบการประกอบของ marketplace
```

**ชั้นที่ไม่มีและจะไม่มี:** 05 Templates (แอปประกอบหน้าเอง) · 07 เสร็จโดยปริยายพร้อมชั้น 02
**ชั้นที่ยังไม่มี:** 06 Documentation

---

## 2 · คำสั่งเดียวที่ต้องรู้

```bash
cd 03-components && npm run verify
```

= `typecheck` → `lint` (classes · quality · **parity** · **docs** · **api-comments** · **rsc**) → `vitest` → `playwright` → `gallery:build` → **`check:fonts`** → **`check:bundle`** → `validate-tokens` → **`build`** → **`check:dist`**

⚠️ **ห้ามแก้โค้ดแล้วไม่รัน** — เกตในนี้จับของที่ตาไม่เห็นทั้งนั้น

| เกต | จับอะไร |
|---|---|
| `lint:parity` | ชื่อ/prop ที่ต่างจาก Astryx ต้องถูกตัดสินและบันทึกเหตุผล · **ทุกชื่อของ Astryx 105 ตัว** ต้องอยู่ในลิสต์ใดลิสต์หนึ่ง |
| `lint:docs` | ลิงก์เสีย + ชื่อก่อน rename ค้างในเอกสาร |
| `check:bundle` | เพดาน gzip ต่อรูปแบบหน้า |
| `check:dist` | **`dist/` คือสิ่งที่ผู้ใช้ได้รับ แต่เกตอื่นอ่าน `src/` ทั้งนั้น** · ตรวจว่า `.d.ts` ครบ · `"use client"` **รอดมาถึง dist ครบ 56 และไม่เกิน** · ไม่มี source รั่ว · ทุก path ใน `exports` มีจริง · bundle `dist/index.js` ได้ (ทุก import resolve) |
| `lint:docs` ข้อ 3ก | **`.tsx` ทุกตัวต้องมี `.md` คู่** — กฎเดิมวนจาก `.md` ไปหา `.tsx` ทางเดียว ⇒ `SmeGoProvider.tsx` ไม่มีเอกสารมาตลอดและเกตเขียว · **เกตที่ตรวจทางเดียวคือเกตที่ตรวจครึ่งเดียว** |
| `theme.spec.ts` + `theme-init.test.ts` | **ผู้ใช้เปิดโหมดมืดได้จริง** — contrast sweep ตั้ง `data-theme` เอง จึงพิสูจน์แค่ว่าค่าสีถูก ไม่ได้พิสูจน์ว่าเปิดได้ · ตรวจการจำข้ามรีโหลด · ตั้งก่อน first paint · `THEME_INIT_SCRIPT` ตรงกับต้นฉบับ |
| `lint:rsc` | `"use client"` ต้องมีเมื่อจำเป็น **และต้องไม่มีเมื่อไม่จำเป็น** · ทิศที่เกินพังเงียบ — ถ้าไม่ห้าม ไลบรารีจะกลายเป็น client ทั้งก้อนโดยไม่มี commit ไหนตัดสินใจ · directive ต้องอยู่ **บรรทัดแรก** ไม่งั้นเป็นสตริงลอย ๆ |
| `check:fonts` + `font.spec.ts` | ฟอนต์ต้องถูก **ดึงจากเซิร์ฟเวอร์ของเราจริง** — ฟอนต์ที่โหลดไม่ได้ไม่ throw · จนถึง 2026-07-30 ระบบไม่เคยโหลด Anuphan เลย และไม่มีเกตไหนรู้ |
| contrast sweep (e2e) | ทุกข้อความบน gallery ทั้งสองโหมด |
| `rac-fallback.test.ts` | ตาราง RAC en-US ที่ฝังไว้ต้องไม่เก่า — ถ้าเก่า **หน้าขาวทั้งหน้า** ตอน runtime |

### ★★★ เกตทุกตัวต้องพิสูจน์ว่า **fail ได้** ก่อนจะเชื่อว่ามันเขียว

บทเรียนที่แพงที่สุดของสัปดาห์นี้ — เจอ **เกตที่ตาบอดสองตัว**:

| เกต | อาการ |
|---|---|
| `validate-tokens.js` | มี `process.exit(1)` **ที่เดียว** คือตอน JSON พัง · เช็คทั้ง 10 ข้อพิมพ์ ❌ แล้ว **exit 0** — เป็นของประดับมาตลอดอายุของมัน ทั้งที่ CLAUDE.md · README · memory อ้างว่าเป็นส่วนของ `verify` |
| `lint-api-comments` (ฉบับแรก) | เขียวทั้งที่ฉีดบั๊กเดิมกลับเข้าไป เพราะอ่าน prop ที่ประกาศเองแต่ไม่อ่าน prop ที่สืบทอด |

**วิธีเดียวที่เชื่อได้: ฉีดความผิดเข้าไปจริง ๆ แล้วดูว่ามันแดง** จากนั้นคืนค่า
sweep ที่ตรวจ 0 element ก็เขียว · เกตที่อ่านไฟล์ผิดที่ก็เขียว · **เขียวไม่ใช่หลักฐาน**

**2026-07-30 — บทเรียนนี้เกิดซ้ำสด ๆ ตอนเขียน `font.spec.ts`** เทสตัวใหม่เขียวทั้งที่
ถอน `@import` ของฟอนต์ออกแล้ว เพราะ **`baseURL` ของ playwright คือ fixture :4321
ไม่ใช่ gallery :4400** — ผมตั้งชื่อค่าคงที่ว่า `GALLERY` แล้วมันโหลด fixture · ตอนฉีด
ความผิดจึง rebuild แค่ gallery ส่วน `app.css` ยังมี `@font-face` เก่าอยู่
⇒ **ตอนฉีดความผิด ต้อง rebuild ทุก artifact ที่เทสอ่าน ไม่ใช่แค่ตัวที่คิดว่าอ่าน**

และอีกชั้น: `document.fonts.check()` คืน `true` จากฟอนต์ที่ **ติดตั้งในเครื่อง** ได้ —
เทสจะเขียวบนเครื่องที่ลงฟอนต์ไว้ ขณะที่เว็บจริงตกไปฟอนต์สำรอง · ต้องยืนยันจาก
**network response** ว่าไฟล์ของเราถูกดึงจริง

⚠️ และเวลาวัด ให้ระวัง `$?` หลัง pipe — `node x.mjs | tail` ให้ exit ของ `tail`
ไม่ใช่ของ node · ผมเกือบรายงานว่า `lint-classes` ไม่ fail เพราะเรื่องนี้

### CI รัน `npm run verify` ทั้งก้อน — ห้ามไล่เรียกเกตทีละตัว

[`.github/workflows/verify.yml`](.github/workflows/verify.yml) เคยไล่เรียกเอง 5 ขั้น แล้วไม่ถูกอัปเดตอีกเลยตั้งแต่ commit baseline ⇒ เกตที่สร้างหลังจากนั้น (`quality` · `parity` · `docs` · `api-comments` · `check:bundle` · `gallery:build`) **ไม่อยู่ใน CI เลย** — CI เขียวโดยตรวจแค่ครึ่งเดียว

**การเขียนรายการเกตไว้สองที่คือกลไกที่ทำให้สองที่หลุดจากกัน** · ตอนนี้มีแหล่งความจริงเดียว เพิ่มเกตใน `package.json` แล้ว CI ได้ไปด้วยเอง

---

### การส่งมอบ — `dist/` ต้อง **transpile ต่อไฟล์ ห้าม bundle**

`npm run build` = `tsc -p tsconfig.build.json` + `build:css` · ไม่มี bundler ไม่มี dep เพิ่ม

★★★ **ถ้า bundle รวมเป็นไฟล์เดียว ขอบเขต client/server พังทั้งหมด** — 56 ไฟล์ client
จะรวมกับ 18 ไฟล์ server เป็นโมดูลเดียวที่มี `"use client"` บนสุด ⇒ ทุกอย่างเป็น client
**และ `lint:rsc` ยังเขียว** เพราะมันอ่าน `src/` · `check:dist` มีอยู่เพื่อปิดช่องนี้

`dist/` มี: `.js` + `.d.ts` + sourcemap ต่อไฟล์ · `theme.css` + `src/*.css` + `src/fonts/*.woff2`
(รักษาโครง path เดิมไว้ให้ `@import` และ `url()` resolve เอง ไม่เขียนใหม่) · `theme-init.js`

⚠️ import ที่ emit เป็น **extensionless** ⇒ **Node ESM ล้วน resolve ไม่ได้** แต่ Next/webpack/esbuild ได้
`check:dist` จึงตรวจด้วยการ bundle จริง ไม่ใช่ `node --import`

แอปเขียนสองบรรทัด: `@import "@smego/ui/theme.css";` + `@source` ชี้ `dist` (ห้ามลืม — ไม่งั้น purge เกลี้ยงเงียบ ๆ)

---

## 3 · สถาปัตยกรรมที่ตรึงไว้แล้ว — อย่าตั้งคำถามใหม่

- **Tailwind v4 CSS-first** — ไม่มี `tailwind.config.ts` · `@theme` **คือ** config
- **token 3 ชั้น** primitive `--sme-*` → semantic (namespace ของ Tailwind) → component (ว่างโดยเจตนา)
- **React Aria Components** เป็นฐาน headless (เลือกเพราะ `BuddhistCalendar`)
- **CVA + tailwind-merge** · `cn()` จาก `lib/cn`
- **WCAG 2.2 AA เป็น pass/fail** ไม่ใช่เป้าหมาย
- แบรนด์ `primary-600 = #0077C1`
- **ไทยล้วน** — `th-TH-u-ca-buddhist` · วันที่เป็น พ.ศ.
- **theme เป็นของไลบรารี ไม่ใช่ของแอป** — `ThemeToggle` + `useTheme()` + `THEME_INIT_SCRIPT`
  ตรรกะทั้งหมดอยู่ใน `02-tokens/theme-init.js` (แหล่งความจริงเดียว) · สตริงที่ React ใช้
  **generate** ด้วย `npm run gen:theme-init` ห้ามพิมพ์เอง
  ⚠️ แอปเขียน `data-theme` เองไม่ได้ — last-writer-wins เหมือนกฎ `body.style.padding*` (§4)
- **ผู้ใช้ปลายทางเป็น Next.js App Router** ⇒ `"use client"` **56 ไฟล์** · server ได้ **18 ไฟล์** (9 `.tsx` + 9 `.ts`)
  ★ **`useStrings()` = `useContext(...)` ที่ห่อไว้ และถูกเรียกใน 47 ไฟล์ รวมการ์ด marketplace ทั้ง 20**
  ⇒ ทุกไฟล์ที่อ่านข้อความไทยผ่าน context **ต้องเป็น client** ไม่มีทางเลี่ยง
  นี่คือราคาที่ยอมจ่ายเพื่อให้แอป override ข้อความได้ (คำตัดสิน 2026-07-30 ข้อ 14)
  ทางเลือก `setStrings()` แบบ global ถูก **ปฏิเสธ** เพราะเป็น last-writer-wins บนสถานะร่วม
  ซึ่ง §4 ห้ามไว้แล้วในกรณี `body.style.padding*`
  ⚠️ **`"use client"` ไม่ปิด SSR** — HTML ยังครบบนเซิร์ฟเวอร์ SEO ไม่กระทบ
  ที่เสียคือ JS payload ที่ RSC เคยช่วยตัด ⇒ payload ต้องแก้ด้วย lazy chunk ไม่ใช่ RSC

---

## 4 · กฎที่เจ็บมาแล้ว

| กฎ | เพราะ |
|---|---|
| `.tsx` ทุกตัวต้องมี `.md` คู่ พร้อม §Quality Checklist | เอกสารคือส่วนของงาน ไม่ใช่ของแถม |
| **ห้าม** `import { X } from 'lucide-react'` | ต้องผ่าน `<Icon name>` ไม่งั้น bundler ลากไอคอน ~1,600 ตัวเข้ามา |
| **ห้าม** เขียน `body.style.padding*` หรือตัวแปรของแถบอื่น | last-writer-wins → ปุ่มท้ายหน้าจมใต้แถบ (SC 2.4.11) |
| **ห้าม** สีดิบ · hex · `z-<number>` · ramp 50/100/200 เป็นพื้น | `lint-classes.mjs` ปฏิเสธ |
| ตรวจ `base.css` **ก่อน** เมื่อคลาสหนึ่ง "ไม่ทำงาน" | ไฟล์นั้นไม่อยู่ใน layer จึงชนะทุก utility (เจอมา 3 ครั้ง) |
| ข้อความไทยยาวกว่าอังกฤษ 20–40% | ทดสอบด้วยข้อความไทยจริง ไม่ใช่ lorem ipsum |
| วัด contrast **ที่ composite แล้ว** | โหมดมืด override ramp — ค่าที่คอมเมนต์ไว้มักเป็นของโหมดสว่าง |

---

## 5 · ★★★ เอกสารในรีโปนี้เคยผิด และผิดบ่อย

สัปดาห์ 2026-07-26 → 29 พบคำอ้างผิด/ค้างในเอกสาร **16 จุดที่บันทึกไว้ใน commit** เช่น §8.1 ติด ✅ ทั้งที่ทำจริง 4/13 · §4 แถวหนึ่งผิด 5 ช่อง · ชื่อก่อน rename ค้าง 97 จุด · `propsOursOnly` ประกาศ prop และ component ที่ไม่มีจริง

**ดังนั้น: ตรวจกับโค้ดก่อนเชื่อเอกสาร** — `.d.ts` และไฟล์จริงคือแหล่งความจริง เอกสารคือความตั้งใจ

เกต `lint:docs` กับ `lint:parity` มีอยู่เพื่อลดช่องนี้ แต่ไม่ได้ปิดหมด — prose ยังตรวจไม่ได้

---

## 6 · Astryx ใช้ยังไงในโปรเจกต์นี้

`@astryxdesign/core` `theme-neutral` `cli` ติดตั้งเป็น **devDependency** pin ที่ **0.1.9 เท่ากันทั้งสาม** · ใช้เพื่อ **เทียบ API เท่านั้น** ไม่ import ลง bundle

`ASTRYX-PARITY.md` เป็นแหล่งความจริงของการเทียบ · ขอบเขตคือ **ชื่อ component + prop สี่ตัวของ §8.1/§3.1** (`label` `isLabelHidden` `status` `isOptional`) เท่านั้น · ที่เหลืออยู่นอกขอบเขตโดยประกาศไว้

คำสั่งที่ใช้หา API ของเขาได้ (อ่านอย่างเดียว ปลอดภัย):

```bash
cd 03-components && npx astryx component <Name>   # props + ตัวอย่างของเขา
cd 03-components && npx astryx search "<query>"
```

⚠️ **อย่าเชื่อคำแนะนำเชิงสไตล์จาก CLI ของเขา** — ดูข้อ 0

---

## 7 · เจอปัญหาแล้วอ่านที่ไหน

| อยากรู้ | ไปที่ |
|---|---|
| หนี้ที่รู้ตัวและยังไม่ปิด | [`03-components/QUALITY.md`](03-components/QUALITY.md) |
| เหตุผลของการต่างจาก Astryx (D1–D38) | [`ASTRYX-PARITY.md`](ASTRYX-PARITY.md) §4 |
| กฎการตัดสินใจเชิงผลิตภัณฑ์ | [`DESIGN-PRINCIPLES.md`](DESIGN-PRINCIPLES.md) |
| กฎการตั้งชื่อ token · ช่องว่างที่รู้ตัว | [`STYLE-GUIDELINE.md`](STYLE-GUIDELINE.md) |
| component ตัวหนึ่งใช้ยังไง | `.md` ที่อยู่ข้าง `.tsx` ของมัน |
| ดูของจริงทุกตัวพร้อมกัน | `cd 03-components && npm run gallery` → :4400 |
