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
