# CHANGELOG — @smego/ui

รูปแบบตาม [Keep a Changelog](https://keepachangelog.com/) · เวอร์ชันตาม semver (0.x หัก API ได้ในเวอร์ชัน minor)

---

## ยังไม่ปล่อย / Unreleased — เตรียมขึ้นเว็บจริง

เริ่มจากรอบ grill 2026-07-30 ที่ถามว่า *"design system พร้อมขึ้น marketplace จริงไหม"*
คำตอบคือ **ยังไม่พร้อม** และของที่ขาดคือ **ชั้นส่งมอบทั้งชั้น** ไม่ใช่คุณภาพ component
— เพราะระบบนี้ยังไม่เคยมี consumer นอกรีโปเลย (`git remote` ว่าง · `git tag` ว่าง)

### Breaking — dependency ที่แอปต้องเป็นเจ้าของเอง

| แพ็กเกจ | เดิม | ใหม่ |
|---|---|---|
| `react-aria-components` | `dependencies` `^1.19.0` | **`peerDependencies` `>=1.19.0 <1.20.0`** |
| `@internationalized/date` | `dependencies` `^3.12.0` | **`peerDependencies` `^3.12.2`** |
| `@internationalized/string` | `dependencies` `^3.2.0` | **ถอดออก** — ประกาศไว้แต่ **0 ไฟล์ import** |

**ทำไมต้องหัก** — `RAC_EN_FALLBACK` เป็นตารางที่ฝังไว้ในไลบรารี ถ้า RAC เพิ่ม key
ใหม่ ตารางจะขาด แล้ว `LocalizedStringDictionary` **throw = หน้าขาวทั้งหน้า**
`tests/a11y/rac-fallback.test.ts` จับได้ **แต่จับได้เฉพาะกับ RAC ที่ติดตั้งในรีโปนี้**
· caret `^1.19.0` เปิดทางให้รีโปแอปได้ 1.20 ขณะที่ CI ของเรายังเขียว
⇒ ช่วงแคบทำให้ล้มเหลว **ตอน `npm install`** ไม่ใช่ตอนผู้ใช้เปิดหน้า

และการเป็น peer ทำให้แอปมี RAC **สำเนาเดียว** — สองสำเนาหมายถึง global symbol ที่
`installRacThaiStrings` เขียนอยู่คนละอัน = คำแปลไทยหายเงียบ ๆ

### Fixed — ★★★ `sr-only` หลุดออกจากกล่องที่เลื่อน ทำให้ทั้งหน้าเลื่อนแนวนอน (SC 1.4.10)

`QUALITY.md` บันทึกไว้เองว่า **"gallery เองเลื่อนแนวนอนที่ 320px (`scrollWidth 549`)"**
แล้วใช้ข้อเท็จจริงนั้นเป็น *เหตุผลให้ย้ายเทส tooltip ไปวัดบน fixture* — คือ **รู้ว่ามี
แล้วเดินเลี่ยง ไม่ได้แก้** · ระบบที่ประกาศว่า WCAG 2.2 AA เป็น pass/fail จึงมีหน้า
แสดงตัวเองที่ตก 1.4.10 มาตลอด · และเอกสารเดาต้นเหตุผิดด้วย (เดาว่าเป็น `Table`)

ต้นเหตุจริงมีสองชั้น:

**① gallery `Group` เป็น `grid` ที่ไม่ประกาศคอลัมน์** ⇒ implicit track เป็น `auto`
= `minmax(min-content, max-content)` · specimen ที่ max-content กว้าง (แถวของ
`CategoryNav` ที่ `[&>li]:shrink-0`) ดัน track ไป **540px** แล้วล้นออกนอก container
288px ทั้งที่ container กว้างถูกต้อง → `grid-cols-[minmax(0,1fr)]` · **556 → 443**

**② ★★ บั๊กของ component ไม่ใช่ของ gallery** — `sr-only` ของ Tailwind คือ
`position: absolute` · span `"54 รายการ"` ใน `CategoryNav` อยู่ในกล่องที่เลื่อนแนวนอน
**แต่ไม่มีบรรพบุรุษที่ positioned** ⇒ containing block กลายเป็น viewport
span หลุดไปอยู่ที่ **x=442** และดันความกว้างของ `html`
⇒ **ทุกแอปที่ใช้ `CategoryNav` แบบ scroll จะได้หน้าที่เลื่อนแนวนอน = SC 1.4.10 แดง**

ทั้งระบบมี scroll container **14 จุด** และตอนนั้น **ไม่มีจุดไหนเป็น `relative` เลย**
เติม `relative` **10 จุด**: `CategoryNav` ×2 · `TabList` · `Compare` · `Token` ·
`ImageGallery` · `DropdownMenu` · `Dialog` · `Typeahead` · `Selector` · **443 → 320**

- **กฎใหม่ `lint:quality` ข้อ `scroll`** — `overflow-*-auto|scroll` ต้องมี `relative`
  ในสตริงคลาสเดียวกัน (ตรวจบรรทัดเดียวกันเพื่อไม่ต้องวิเคราะห์ AST และอ่านง่ายกว่า)
- **`tests/e2e/reflow-320.spec.ts`** — 320 และ 360px × fixture และ gallery
  พร้อม guard ว่า viewport ถูกใช้จริง และ **ชี้ตัวการในข้อความ fail** ไม่ใช่บอกแค่ว่าล้น
- พิสูจน์แดงได้ทั้งสองต้นเหตุ ได้ตัวเลขประวัติศาสตร์ตรงเป๊ะ (443 · 556) แล้วคืนค่า

> ⚠️ **บล็อกชี้ตัวการเองก็เคยตาบอด** — ฉบับแรกเช็ค `offsetParent === null`
> ซึ่งผิด: absolute ที่ไม่มี positioned ancestor ได้ `offsetParent === body`
> ไม่ใช่ `null` ⇒ บล็อกไม่พิมพ์อะไรเลยตอนที่ควรพิมพ์ · ยืนยันด้วยการฉีดความผิด
> แล้วแก้เป็น "containing block อยู่นอกกล่องที่เลื่อนหรือเปล่า"

### Changed — `check:bundle` วัด initial แยกจาก lazy · และ **ถอนคำแนะนำ `lazy()` ออก**

เกตเดิม bundle ด้วย `--outfile` **ไม่มี `--splitting`** ⇒ esbuild ยัด dynamic import
กลับเข้าไฟล์เดียว · เกตจึงวัด "ผลรวมของโค้ดที่หน้าอ้างถึง" แต่ **รายงานเหมือนเป็น
สิ่งที่ผู้ใช้ดาวน์โหลดตอนเปิดหน้า** — เกตที่วัดผิดหน่วยแย่กว่าไม่มีเกต เพราะมันชี้ให้
เลิกทำสิ่งที่ถูก (หรือในกรณีนี้ ให้ทำสิ่งที่ไม่ช่วย)

- ใช้ `--splitting --outdir` + `--metafile` แยก **initial** (entry + ทุก chunk ที่
  static import ต่อกันมา · เพดานคุมตัวนี้) จาก **lazy**
- พิสูจน์ว่าแยกถูก: module ที่โหลดผ่าน `import()` เท่านั้น เนื้อบีบไม่ได้ 90 KB gzip
  → initial คงที่ 42.9 KB · lazy 88.2 KB
- ⚠️ **บั๊กที่เจอตอนเขียน** — esbuild ตั้ง `entryPoint: true` ให้ **chunk ของ
  dynamic import ด้วย** ⇒ `find(o => outputs[o].entryPoint)` คืน chunk ผิดตัวได้
  ต้องจับคู่กับ path ของ entry จำลอง

> ★★★ **คำตัดสินข้อ 12 ("แยกปฏิทินเป็น lazy chunk ในรีโปนี้ · 142 → ~85 KB")
> ยืนอยู่บนสมมติฐานที่ผิด — ทำแล้ว วัดแล้ว ถอนออก**
>
> ① ของหนักคือ **`RACDatePicker` เอง ไม่ใช่ `Calendar`** — `Calendar.mjs` = **4.3 KB**
> ส่วนที่หนักคือ `@internationalized/date` + เลขคณิตวันที่ของ react-stately ซึ่ง
> `RACDatePicker` ลากมาเองไม่ว่าจะแยกปฏิทินหรือไม่ ⇒ กำไรจริง ~6 KB ไม่ใช่ 57 KB
>
> ② **มันทำให้หน้าอื่นแย่ลง** — หน้ารายการสินค้าโต **44.5 → 67.1 KB** เพราะ esbuild
> ยก input ที่ทั้ง entry และ chunk lazy เข้าถึงได้ขึ้นไปอยู่ใน shared chunk ที่ entry
> **static import** · หน้าที่ไม่มี `DateInput` เลยต้องแบกโค้ดปฏิทิน
>
> ③ lazy **ทั้ง `DateInput`** ก็ไม่ช่วย — shared chunk ยัง 137.4 KB เพราะ entry
> import RAC สำหรับ `TextInput` อยู่แล้ว และ RAC เป็น module graph เดียว
>
> ตัวเลขที่เชื่อได้ (build แยกกัน): form มี `DateInput` **142.5** · ไม่มี **102.3**
> ⇒ 40 KB หายได้เฉพาะเมื่อหน้านั้น **ไม่อ้างถึง `DateInput` เลย** = route-level
> splitting ที่ Next ทำเอง ⇒ **เจ้าของคือรีโปแอป ไม่ใช่ไลบรารี**
>
> ⚠️ webpack chunk ต่างจาก esbuild และ **อาจ** ย้ายออกได้จริง — **แต่พิสูจน์ในรีโปนี้
> ไม่ได้ จึงไม่อ้าง** · ถ้าจะอ้าง ต้องวัดที่รีโปแอป

- **ถอนคำแนะนำ `lazy()` ออกจากหัว `src/index.ts`** — มันเป็นเจตนาที่ไม่มีหลักฐาน
  มาตั้งแต่ 2026-07-26 และตอนนี้มีหลักฐานว่ามันไม่ช่วย · แทนด้วยผลการวัดและคำสั่ง
  ห้ามใส่กลับโดยไม่วัดใหม่ทั้งสามหน้า
- แก้ตัวเลขค้างในหัว `index.ts`: หน้ารายการสินค้า **33 KB → 44.5 KB** (ค้างมานาน)
  · `DateInput` **+59 → +58.6 KB** (ฐานเปล่า 42.7 → 101.3)
- `QUALITY.md §2.6` เปลี่ยนจาก "ฝั่งไลบรารี ✅ ปิดแล้ว" เป็น **ปิดแบบ "ทำไม่ได้"**
  พร้อมหลักฐาน — คำอ้างเดิมว่า "พิสูจน์แล้วว่า dynamic import แยก chunk ได้จริง"
  **จริงแค่ครึ่ง**: แยก chunk ได้ แต่ initial ไม่ลด

### Added — โหมดมืดใช้ได้เป็นครั้งแรก (`ThemeToggle` · `useTheme` · `THEME_INIT_SCRIPT`)

> ★★★ **`theme-init.js` (9.9 KB) ไม่มี call site แม้แต่ที่เดียวมาตลอดอายุของมัน**
>
> ไม่มีไฟล์ไหนอ่านหรือเขียน `smego-theme` · `gallery/index.html` hardcode
> `data-theme="light"` ⇒ โหมดมืดถูกพิสูจน์ว่า **ค่าสีถูก** (contrast sweep วัดทั้งสอง
> โหมด พร้อม guard `>150` element) แต่ **เส้นทางจาก "ผู้ใช้กด" ถึง `data-theme`
> ไม่มีปลายทั้งสองข้าง**

- **`ThemeToggle`** — 3 ตัวเลือก `สว่าง` `มืด` `ตามระบบ` บน `SegmentedControl`
  ใช้ **ข้อความไม่ใช้ไอคอน** (Lucide ไม่มี sun/moon ในทะเบียน และข้อ 09 ห้ามหยิบตัวใกล้เคียง)
- **`useTheme()`** — `preference` · `resolved` · `isReady` · `setPreference`
- **`THEME_INIT_SCRIPT`** — **generate** จาก `02-tokens/theme-init.js` ด้วย `gen:theme-init`
- `stringsTh.theme` 4 คำใหม่
- `gallery` เลิกใช้ toggle ของตัวเอง และโหลด `theme-init.js` ใน `<head>` แบบไม่มี `defer`

**ตรรกะไม่ถูกเขียนซ้ำ** — component เป็นแค่หน้าตา อ่าน/เขียนผ่าน `window.smegoTheme`
เพราะการ resolve `'system'` · การกัน exception ของ localStorage (Safari private mode ·
iOS ที่ปิดคุกกี้ · iframe ที่ถูกบล็อก) · การฟัง `matchMedia` · การซิงก์ข้ามแท็บ
**มีอยู่แล้วครบใน script นั้น**

> ⚠️ **gallery มี anti-pattern ที่เอกสารเราเองห้ามไว้**
>
> `gallery.tsx` มี `ThemeToggle` ของตัวเองที่เขียน `document.documentElement.dataset.theme`
> ตรง ๆ โดยไม่ผ่าน localStorage ⇒ theme **ไม่ถูกจำข้ามการรีโหลด** และ `useState(false)`
> ทำให้เริ่มที่ light เสมอแม้ OS เป็นมืด · ถอดออกแล้ว

> ★★★ **เกตตาบอดตัวที่ 5 — และเกิดจากเทสที่เพิ่งเขียนเอง**
>
> `theme-init.test.ts` import `extractIife` จาก `gen-theme-init.mjs` เพื่อไม่ให้มีตรรกะ
> การตัด IIFE สองชุด · แต่ฉบับแรกของสคริปต์ไม่มี guard `isMain`
> ⇒ **การ import รันสคริปต์ทั้งไฟล์แล้วเขียนไฟล์ที่ generate ใหม่ก่อนเทียบ**
> เทส "ตรงกัน" จึงไม่มีทางแดงได้เลย · แก้แล้วและพิสูจน์ว่าแดงได้
>
> และอีกสองตัวในไฟล์เดียวกัน: **`typeof localStorage` ในสภาพ jsdom ของรีโปนี้คือ
> `undefined`** ⇒ เทส "ตั้ง data-theme" มี `finally` ที่ throw ทับ error จริง และเทส
> "localStorage โยน exception" **ผ่านโดยไม่ได้ทดสอบอะไร** เพราะ getter ที่วางไว้ไม่เคย
> ถูกเรียก · แก้ด้วย stub ที่ทำงานได้จริง + assert ว่า getter ถูกแตะ

- เทสใหม่ **12 ข้อ** — unit 6 (`theme-init`) + 6 (`theme-toggle`) · e2e **4 ข้อ**
  ตรวจการจำข้ามรีโหลด · ตั้งก่อน first paint (บล็อก `gallery.js` แล้วยังต้องมืด) ·
  `'system'` ตามค่า OS ที่เปลี่ยนทีหลัง · ปุ่มไม่ถูกปิด
- พิสูจน์ว่าแดงได้: แก้ต้นฉบับแล้วไม่ regenerate · ถอน `theme-init.js` ออกจาก `<head>`

### Fixed — `lint:docs` ตรวจทางเดียว

กฎ ".tsx ทุกตัวต้องมี .md คู่" วนจาก `.md` ไปหา `.tsx` เท่านั้น ⇒ `.tsx` ที่ **ไม่มี
`.md` เลย** มองไม่เห็น · `provider/SmeGoProvider.tsx` ไม่มีเอกสารมาตลอดและเกตเขียว
เพิ่มกฎข้อ 3ก + เขียน `SmeGoProvider.md` · **เกตที่ตรวจทางเดียวคือเกตที่ตรวจครึ่งเดียว**

### Changed — `copy:fonts` → `copy:assets`

สคริปต์เดิมคัดลอกแค่ woff2 · ตอนนี้คัดลอก `theme-init.js` ไปให้ gallery ด้วย
ชื่อเดิมจึงไม่ตรงกับสิ่งที่มันทำ — เปลี่ยนชื่อ ไม่ปล่อยให้ชื่อค้าง

### Breaking — `exports` ชี้ `dist/` ไม่ใช่ `src/` อีกแล้ว

ก่อนหน้านี้แพ็กเกจ export `.tsx` ดิบ ⇒ แอปต้อง transpile ในนโมดูลเอง

| | เดิม | ใหม่ |
|---|---|---|
| `.` | `./src/index.ts` | `./dist/index.js` + `types` |
| `./inputs/*` ฯลฯ | `./src/inputs/*.tsx` | `./dist/inputs/*.js` + `types` |
| `./theme.css` | — | **`./dist/theme.css`** (ใหม่) |
| `types` · `files` | ไม่มีทั้งคู่ | `./dist/index.d.ts` · `["dist"]` |

- **`npm run build`** = `tsc -p tsconfig.build.json` + `build:css` — ไม่เพิ่ม dependency
- `dist/` มี `.js` + `.d.ts` + sourcemap ต่อไฟล์ · `theme.css` + `src/*.css` + `src/fonts/*.woff2` + `theme-init.js`
- **`check:dist`** เข้า `verify` — ตรวจ 6 ข้อ พิสูจน์ว่าแดงได้ทั้ง 5 แบบที่ฉีด

> ★★★ **ห้าม bundle — ต้อง transpile ต่อไฟล์**
>
> ถ้ารวมเป็นไฟล์เดียว 55 ไฟล์ client จะรวมกับ 17 ไฟล์ server เป็นโมดูลเดียวที่มี
> `"use client"` บนสุด ⇒ **ทุกอย่างกลายเป็น client และ `lint:rsc` ยังเขียว**
> เพราะมันอ่าน `src/` · `check:dist` มีอยู่เพื่อปิดช่องนี้โดยเฉพาะ — ข้อที่สำคัญที่สุด
> ของมันคือ "`'use client'` ที่ `src` มี ต้องมีใน `dist` ด้วย"
>
> `tsc` รักษา directive prologue ไว้บรรทัดแรกจริง — ยืนยันแล้ว 55/55

⚠️ **import ที่ emit เป็น extensionless** (`'./EntityCard'`) เพราะ `moduleResolution: bundler`
⇒ **Node ESM ล้วน resolve ไม่ได้** แต่ Next/webpack/esbuild ได้ · ผู้ใช้ปลายทางคือ
Next App Router จึงยอมรับได้ · `check:dist` ตรวจด้วยการ bundle จริงไม่ใช่ `node --import`

⚠️ **ยังไม่มีเกตที่บังคับว่า "หัก API ⇒ ต้องขยับเวอร์ชัน"** — ช่องเดิมที่ทำให้ 0.2.0
ค้างอยู่ที่ `0.1.0` หลายวัน · ตอนนี้ยังไม่มี consumer และยังไม่มี tag จึงยังไม่เจ็บ
แต่ต้องตัด **0.3.0** ก่อน publish ครั้งแรก

### Added — RSC boundary (`"use client"` 55 ไฟล์ + เกต `lint:rsc`)

แอปปลายทางเป็น Next.js App Router ⇒ ไฟล์ที่เรียก hook · ใช้ context · หรือผูก
event handler เข้า DOM ต้องประกาศตัวเป็น client ไม่งั้น build ของแอปตายตอน import

- `"use client"` **55 ไฟล์** (54 `.tsx` + `primitives.ts` ที่ re-export ของ RAC ซึ่ง ship มาพร้อม `client-only`)
- server ได้ **17 ไฟล์** — `Badge` `Card` `DescriptionList` `EmptyState` `Spinner` `Icon` `Grid` `Main` `Stack` + `.ts` ทั้ง 8 ตัวรวม `index.ts` ที่ต้องคง server-importable
- **`lint:rsc`** ตรวจ **สองทิศ** — ขาด=แดง · **เกิน=แดง** · directive ไม่อยู่บรรทัดแรก=แดง
  พิสูจน์แล้วทั้ง 3 ทิศด้วยการฉีดความผิด แล้วคืนค่า

> ⚠️ **ตัวเลขชุดแรกที่รายงานคือ 42 / 21 ซึ่งผิด**
>
> `useStrings()` คือ `useContext(SmeGoContext)?.strings ?? stringsTh` และถูกเรียกใน
> **47 ไฟล์ รวมการ์ด marketplace ทั้ง 20 ไฟล์** · การนับครั้งแรก grep หาเฉพาะชื่อ
> hook ของ React จึงไม่เห็น hook ของเราเอง (`useStrings` `useMoney` `useDebounce`
> `useSmeGoLocale`) ⇒ เกตจึงจับ `use[A-Z]…(` ทุกตัว **ไม่ใช่ลิสต์ชื่อที่ต้องมาเติมเอง**
> เพราะลิสต์แบบนั้นคือสิ่งที่ทำให้นับพลาด 12 ไฟล์ตั้งแต่ต้น
>
> **ผลต่อสถาปัตยกรรม** — ประโยชน์ของ RSC เหลือแค่ 9 ใบเล็กที่พ่อแม่เป็น client อยู่แล้ว
> ทางเลือกที่จะกู้คืนได้คือ `setStrings()` แบบ global ซึ่ง **ปฏิเสธ** เพราะเป็น
> last-writer-wins บนสถานะร่วม — รูปแบบเดียวกับที่ `CLAUDE.md §4` ห้าม `body.style.padding*`
> ⇒ **payload ต้องแก้ด้วย lazy chunk** (`DateInput` +59 KB) ไม่ใช่ด้วย RSC
>
> `"use client"` **ไม่ปิด SSR** — HTML ยังครบบนเซิร์ฟเวอร์ SEO ไม่กระทบ

### Added — ฟอนต์ถูกโหลดจริงเป็นครั้งแรก

> ★★★ **จนถึง 2026-07-30 ระบบนี้ไม่เคยโหลด Anuphan เลย** — ไม่มี `@font-face`
> ไม่มี `<link>` ทั้งที่ `01-foundations/03-typography.md` parse ไฟล์ฟอนต์จริงมา
> เขียนไว้ 400 บรรทัด · ทุกหน้าและ **ทุกเทสที่วัดความกว้าง** รันบนฟอนต์สำรอง

- **self-host Anuphan v6 แยก 4 subset** พร้อม `unicode-range` ที่ [`02-tokens/src/fonts.css`](../02-tokens/src/fonts.css) — หน้าไทยดึงจริงแค่ `thai` (18.5 KB) + `latin` (34.3 KB) · `latin-ext`/`vietnamese` สถานะ `unloaded` ⇒ **52 KB ไม่ใช่ 83 KB** ตามที่ `typography.md §215` วัดไว้
- **`check:fonts`** เกต static — `@import` หลุด · woff2 หาย · magic ไม่ใช่ `wOF2` · ไม่มี `font-display`/`unicode-range` · subset ไม่ครบ 4
- **`tests/e2e/font.spec.ts`** เกตในเบราว์เซอร์จริง 5 ข้อ — ยืนยันจาก **network response** ว่า woff2 ของเราถูกดึง ทั้ง fixture และ gallery
- **`copy:fonts`** ผูกไว้ใน `gallery:build` + `build:fixture` — Tailwind CLI ไม่แก้ `url()` ที่เป็น relative
- `check:fonts` เข้า `npm run verify` ตาม §2 (แหล่งความจริงเดียว CI ได้ไปเอง)

**วัดเทียบ** Chromium · `400 16px` · `"ขอสินเชื่อธุรกิจ 1,234,567 บาท"`
Anuphan **205.47 px** vs Noto Sans Thai **200.90 px** ⇒ **Anuphan กว้างกว่า 2.3%**
— 2.3% คือเหตุผลที่เทสความกว้างเดิมทั้ง 46 ตัวยังผ่าน **แต่ตอนนี้ผ่านด้วยเหตุผลที่ถูก**

**เกตทั้งสองถูกพิสูจน์ว่า fail ได้** ด้วยการฉีดความผิด 6 แบบ แล้วคืนค่า
· รวม e2e 46 → **51** · unit 402 ไม่เปลี่ยน · bundle ไม่เปลี่ยน (ฟอนต์ไม่อยู่ใน JS)

---

## 0.2.0 — 2026-07-29

**หักดิบทั้งชุด ไม่มี `@deprecated` alias** ตามที่ `ASTRYX-PARITY.md` §8 ตกลงไว้

> ⚠️ **เวอร์ชันนี้ควรออกไปหลายวันแล้ว** — การ rename ทั้งหมดเสร็จตั้งแต่ 2026-07-28
> และเอกสารก็ติด ✅ ว่า "หักดิบ … (§8 · 0.2.0)" แต่ `package.json` **ค้างอยู่ที่ `0.1.0`**
> จนถึง 2026-07-29 · ไม่มีเกตไหนตรวจว่าการหัก API ต้องมาพร้อมการขยับเวอร์ชัน
> เหตุผลที่เลือกหักดิบตอนนั้น ("ยังไม่มี consumer นอกรีโป จึงเป็นหน้าต่างที่ราคา
> เป็นศูนย์") **ถูก** แต่มันทำให้การขยับเวอร์ชัน **จำเป็นกว่าเดิม** ไม่ใช่น้อยลง —
> เพราะ `0.1.0` บอกผู้ใช้ว่าไม่มีอะไรเปลี่ยน

### Breaking — ชื่อ component

| เดิม | ใหม่ | เหตุผล |
|---|---|---|
| `TextField` | `TextInput` | ชื่อของ Astryx (§1.2) |
| `Textarea` | `TextArea` | ชื่อของ Astryx |
| `Checkbox` | `CheckboxInput` | ชื่อของ Astryx |
| `CheckboxGroup` | `CheckboxList` | ชื่อของ Astryx · **ทำทีหลัง 2026-07-29** เพราะเป็น companion ที่คอนฟิก parity ไม่ครอบ ทำให้ระบบมี `RadioList` คู่กับ `CheckboxGroup` อยู่หลายวัน |
| `RadioGroup` | `RadioList` | ชื่อของ Astryx |
| `Select` | `Selector` | ชื่อของ Astryx |
| `ComboBox` | `Typeahead` | ชื่อของ Astryx |
| `NumberField` | `NumberInput` | ชื่อของ Astryx |
| `DatePicker` | `DateInput` | ชื่อของ Astryx |
| `FileUpload` | `FileInput` | ชื่อของ Astryx |
| `RangeSlider` | `Slider` | ชื่อของ Astryx |
| `Chip` | `Token` | ชื่อของ Astryx |
| `Accordion` | `Collapsible` | ชื่อของ Astryx |
| `Alert` | `Banner` | ชื่อของ Astryx · **ไม่รับ API** (D13) |
| `AppHeader` | `TopNav` | ชื่อของ Astryx + รับ slot props (D12) |

**ไม่ rename โดยเจตนา:** `SearchField` (D11 — `PowerSearch` ของเขาเป็น query builder คนละอย่าง) · `ImageGallery` (§8.6 — `Lightbox` ของเขาเป็น overlay คนละอย่าง)

### Breaking — prop

| component | เดิม | ใหม่ |
|---|---|---|
| ทุก input | `errorMessage` | `status: { type, message }` |
| ทุก input | `showOptional` | `isOptional` |
| `TextInput` | `prefix` | `startIcon` |
| `Badge` | `children` | `label: ReactNode` |
| `Token` | `children` | `label: string` |
| `Switch` | `children` | `label: string` |
| `Switch` | `align` | `labelPosition` + `labelSpacing` (แยกสองแกนที่เคยรวมกัน) |
| `Tooltip` | `children` | `content` |
| `CheckboxInput` | `children` | `label: string` |
| `Slider` | `minValue` / `maxValue` | `min` / `max` |
| `FileInput` | `files` · `onSelect` · `multiple` · `maxSizeMb` | `value` · `onChange` · `isMultiple` · `maxSize` |

### Breaking — prop ที่ถอดออกจาก type

| component | prop | เหตุผล |
|---|---|---|
| `Icon` | `strokeWidth` · `stroke` · `fill` · `width` · `height` | stroke ผูกกับ `size` โดยบังคับ — ตั้งเองไม่ได้ |
| `DropdownMenu` | `aria-label` · `aria-labelledby` | RAC ให้ `aria-labelledby` (ชี้ไปปุ่ม) ชนะเสมอ · prop ที่รับแล้วทิ้งเงียบ ๆ แย่กว่าไม่รับ |
| `Button` | `label` · `isIconOnly` · `endContent` | D33 |

### เพิ่ม

- **`label: string` บังคับ + `isLabelHidden` + `status` + `isOptional`** บน input ทุกตัว — ย้ายไปอยู่ใน `LabelledFieldProps` ที่เดียว (§8.1)
- component ใหม่: `Spinner` · `Avatar` · `EmptyState` · `Pagination` · `TabList` · `SegmentedControl` · `BottomNav` · `DropdownMenu` · `Table` · `Main`
- **`SmeGoProvider` ติดตั้งคำแปลไทยของ RAC ให้เอง** — เดิมเป็น opt-in และแอปที่ลืมเรียกทำให้ผู้ใช้ TalkBack ไทยได้ยินภาษาอังกฤษโดยไม่มีอะไรฟ้อง
- **subpath exports** (`@smego/ui/inputs/*` ฯลฯ) — ทำให้ lazy-load ต่อ component เป็นไปได้จริง เดิมเอกสารแนะนำ subpath ที่ **ไม่มีอยู่**

### เกตที่เพิ่มในรอบนี้

`lint:parity` (บังคับตัดสินชื่อ Astryx ครบ 105 ตัว) · `lint:docs` (ลิงก์ · ชื่อก่อน rename · §Quality Checklist 11 แถว) · `lint:api-comments` · contrast sweep ทั้งสองโหมด · RAC drift gate · `check:bundle`

### อ้างอิง Astryx

`0.1.8` → **`0.1.9`** · pin ตายตัวเท่ากันทั้ง `core` · `theme-neutral` · `cli`

---

## 0.1.0

รุ่นแรก — ชั้น 01 Foundations · 02 Tokens · 03 Components (Pass A/B/2)
