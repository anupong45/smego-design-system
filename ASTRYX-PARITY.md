# ASTRYX-PARITY

การเทียบ `@smego/ui` กับ Astryx design system ของ Meta — mapping, prop diff, token diff และรายการ divergence ที่จงใจไม่ตรง

| | |
|---|---|
| อ้างอิง Astryx | `@astryxdesign/core@0.1.8` (pinned — ไม่ใช่ canary) |
| อ้างอิงเรา | `@smego/ui@0.1.0` · 03-components · 02-tokens |
| วันที่ | 2026-07-27 |
| สถานะ | **อนุมัติแล้ว 2026-07-28** — ดู §8 สำหรับคำตัดสิน 6 ข้อ — **เฟส 3 (rename 14/14) และเฟส 5 (สร้างใหม่ 6/6) เสร็จสมบูรณ์** · เหลือเฉพาะการตัดสิน prop diff (ดู §6.4) |

---

## 0 · วิธีวัด

ตัวเลขทุกตัวในเอกสารนี้อ่านจากของจริง ไม่ได้อ่านจากหน้าเว็บ docs:

- **prop surface** — สร้าง TypeScript program ครอบ `.tsx` ของเราและ `.d.ts` ของ Astryx แล้วเรียก `checker.getPropertiesOfType()` จากนั้นจำแนกทุก prop ตามไฟล์ที่ประกาศมัน เพื่อแยก **design surface** ออกจาก DOM/ARIA attribute ที่สืบทอดมา (ของเรา `Button` มี 116 props แต่เป็น design surface จริง **8** ที่เหลือมาจาก React Aria และ DOM)
- **token** — อ่านจาก `dist/astryx.css` เทียบกับ `02-tokens/src/*.css`
- **control height** — ของ Astryx อ่านจาก StyleX `sizeStyles` ใน `.d.ts` ซึ่ง inline ค่าไว้เป็น literal type ของเราอ่านจากค่าที่วัดไว้ในบันทึกรอบ 2026-07-26

> ⚠️ ข้อจำกัดที่ต้องรู้ก่อนอ่านต่อ: Astryx ใช้ **StyleX** เราใช้ **Tailwind + CSS custom properties** ค่า token ทุกค่าจึงเป็นการ *ถอดมาเขียนใหม่* ไม่ใช่การ import ผลคือ parity script อัตโนมัติจะตรวจได้แค่ **ชื่อ component และชื่อ prop** ส่วน**ค่าตัวเลขต้อง assert ด้วยมือ**ใน allowlist

---

## 1 · Inventory — ภาพรวม

| กลุ่ม | จำนวน |
|---|---|
| ชื่อชนชื่ออยู่แล้ว | 16 |
| ชื่อต่าง แต่เป็นงานเดียวกัน → ต้อง rename | 16 (เสนอลดเหลือ 14 — ดู §5.6, §5.8) |
| ของเรามี Astryx ไม่มี → เก็บไว้เป็น SME.GO extension | ~20 |
| Astryx มี เราขาด → **สร้างเพิ่ม 6** ที่เหลือไม่ทำ | 6 / ~50 |

### 1.1 ชื่อตรงกันแล้ว (16)

`Button` · `IconButton` · `Link` · `Switch` · `Card` · `Badge` · `Dialog` · `Tooltip` · `Toast` · `Skeleton` · `ProgressBar` · `Icon` · `Grid` · `Stack` · `Section` · `Divider`

ชื่อตรงไม่ได้แปลว่า props ตรง — ดู §3

### 1.2 ต้อง rename (15 — หลังคำตัดสิน §8)

| เรา | → Astryx | หมายเหตุ |
|---|---|---|
| `TextField` | `TextInput` | |
| `Textarea` | `TextArea` | ต่างแค่ตัว A ใหญ่ — เสี่ยงพลาดที่สุดในลิสต์ |
| `Checkbox` | `CheckboxInput` | |
| `RadioGroup` | `RadioList` | |
| `CheckboxGroup` | `CheckboxList` | ⚠️ **ทำทีหลัง 2026-07-29** — คู่ Group→List เคยทำแค่ฝั่ง radio เพราะ `CheckboxGroup` เป็น companion ที่คอนฟิกไม่ครอบ ทำให้ระบบมี `RadioList` คู่กับ `CheckboxGroup` อยู่หลายวัน · ความไม่สม่ำเสมอนี้เราสร้างเอง ไม่ใช่ของที่ติดมา |
| `Select` | `Selector` | |
| `ComboBox` | `Typeahead` | |
| `NumberField` | `NumberInput` | |
| ~~`SearchField`~~ | ~~`PowerSearch`~~ | ❌ **ตัดออกแล้ว** (§8.2 · D11) — คนละ component |
| `DatePicker` | `DateInput` | |
| `FileUpload` | `FileInput` | |
| `RangeSlider` | `Slider` | |
| `Chip` | `Token` | |
| `Accordion` | `Collapsible` | |
| ~~`ImageGallery`~~ | ~~`Lightbox`~~ | ❌ **ตัดออกแล้ว** (§8.6 · ดู §5.7) — คนละ component (inline gallery vs overlay) |
| `Alert` | `Banner` | |
| `AppHeader` | `TopNav` | ⚠️ ดู §5.8 |

### 1.3 สร้างเพิ่ม 6 ตัว — ✅ **ครบทั้ง 6 แล้ว (เฟส 5 · 2026-07-28)**

| ตัวใหม่ | ชื่อ Astryx | เหตุผลจากโค้ดจริง |
|---|---|---|
| `EmptyState` | `EmptyState` | ⚠️ **แก้ตัวเลข 2026-07-28** — hand-roll จริง **3 ไฟล์** ไม่ใช่ 8: `Cart.tsx:319` · `Wishlist.tsx:148` · `SearchResult.tsx:93` (โครงเหมือนกันแทบ byte-identical) · `Compare.tsx:115` เป็น `return null` โดยเจตนา ไม่ใช่ empty state · `Checkout` `Payment` `ProductCard` `OrderTimeline` **ไม่มีสาขา empty เลย** |
| `Pagination` | `Pagination` | มี `SearchResult` แต่ **ไม่มี pagination เลยทั้งระบบ** |
| `Avatar` | `Avatar` | ⚠️ **แก้เหตุผล 2026-07-28** — `SellerProfile` **ไม่ได้**วาด avatar เอง (รับ `avatar?: ReactNode` เป็น slot ที่ `SellerProfile.tsx:125`) · เหตุผลจริง: ผู้เรียกต้อง hand-roll `<img className="size-12 rounded-full">` ทุกครั้ง (เห็นใน `SellerProfile.md:248`) โดยไม่มีทางถอยเมื่อรูปพัง และ**ไม่มีตัวย่อที่ถูกต้องสำหรับชื่อไทย** (ดู `Avatar.md` §6) |
| `Spinner` | `Spinner` | เขตแดนกับ `Skeleton` ตัดสินแล้วใน §8.5 · เขียนไว้ทั้ง `Spinner.md` และ `Skeleton.md` อ้างถึงกัน · **แก้บั๊กที่พบตอนสร้าง**: `TextInput` ใช้ `animate-spin` ที่ไม่อยู่ในรายการ ALLOW ของ `base.css §10` ตัวหมุนจึงค้างนิ่งใน reduced motion |
| `Tabs` | `TabList` | สร้างบน RAC เต็มตัว (`Tabs`/`TabList`/`Tab`/`TabPanel`) ไม่ใช่แถบเปล่าแบบ Astryx → **D28** · panel ที่ไม่ได้เลือกไม่อยู่ใน DOM |
| `SegmentedControl` | `SegmentedControl` | ทับซ้อนกับ `TabList`/`RadioList`/`Token` → เขียน **กฎแบ่งเขต 4 ทาง** ไว้ทั้ง `TabList.md` และ `SegmentedControl.md` + cross-link เข้า `RadioList.md`/`Token.md`/`Collapsible.md` |

### 1.4 ❌ ห้ามเพิ่ม — เคยถูกตัดไปแล้ว

Astryx มีสองตัวนี้ แต่รอบ **2026-07-26** ตัดทิ้งไปแล้วโดยมีเหตุผล การที่ Astryx มีไม่ใช่เหตุผลพอที่จะกลับคำ:

| Astryx | ทำไมไม่เอา |
|---|---|
| `Breadcrumbs` | ซ้ำกับ `CategoryBreadcrumb` — ต่างกันแค่ `aria-label` |
| `Token` (ในฐานะ component ใหม่) | คือ `Chip` ของเรา — รับมาเป็น**ชื่อใหม่ของ Chip** เท่านั้น ห้ามสร้างเป็นตัวที่สองข้าง `Chip` เพราะจะได้ capsule สี่ตัว (Badge · Chip · RemovableChip · Token) ซึ่งเป็นความสับสนที่ `Badge.md`/`Chip.md` เขียนขึ้นมาเพื่อกันไว้ |

นอกจากนี้ยังไม่รับ `Chat*` (6 ตัว), `TreeList`, `CommandPalette`, `Markdown`, `CodeBlock`, `Citation`, `Kbd`, `Blockquote`, `Carousel`, `HoverCard`, `Toolbar`, `MoreMenu`, `Outline`, `Resizable`, `AppShell` — ไม่มี template ของ marketplace ที่ต้องใช้

### 1.5 SME.GO extension — ไม่มีคู่เทียบ ไม่แตะ

marketplace 18 ไฟล์ (`GrantCard`, `BuyBox`, `Checkout`, `Payment`, `Compare`, `Deadline`, `SellerProfile`, `OrderTimeline`, …) บวก `OTPField`, `DescriptionList`, `CategoryNav` — Astryx ไม่มีอะไรเทียบได้ งานกับกลุ่มนี้คือ**เปลี่ยนชื่อ primitive ที่มันเรียกใช้ข้างในให้ตาม §1.2 เท่านั้น** ไม่เปลี่ยน API ของตัวมันเอง

---

## 2 · ชั้น token

### 2.1 Radius — ตรงกัน 3 ต่างกัน 2

| step | เรา | Astryx | |
|---|---|---|---|
| xs | 4px | 4px (`inner`) | ✅ |
| sm | **6px** | **4px** (`inner`) | ✗ |
| md | 8px | 8px (`element`) | ✅ |
| lg | 12px | 12px (`container`) | ✅ |
| xl | **16px** | **28px** (`page`) | ✗ |
| 2xl | 24px | — | เกิน |
| full | 9999px | 9999px | ✅ |

Astryx ตั้งชื่อตามบทบาท (`inner` / `element` / `container` / `page`) เรามี alias เชิงบทบาทอยู่แล้ว (`--radius-control` / `--radius-container` / `--radius-overlay` / `--radius-pill-role`) — **โครงความคิดตรงกัน ชื่อไม่ตรง**

**เสนอ:** รับ `sm: 6→4` (กระทบน้อย) · **ไม่รับ** `xl: 16→28` เพราะ 28px คือภาษารูปทรงของ Meta ที่มุมโค้งมาก จะเปลี่ยนบุคลิกแบรนด์ทั้งหมด → เข้า allowlist

### 2.2 Spacing — ตรงกันโดยบังเอิญ

ทั้งคู่ใช้ฐาน **4px** Astryx ประกาศเป็น step ตายตัว 0…12 พร้อมครึ่งขั้น (`0.5`=2px, `1.5`=6px) เราใช้ `--sme-space-unit: 0.25rem` แล้ว `calc()` เอา — **ค่าที่ออกมาเท่ากัน** ไม่ต้องแก้อะไร

### 2.3 Type scale — ต่างกันโดยพื้นฐาน และควรต่าง

| | เรา | Astryx |
|---|---|---|
| body size | **16px** | **14px** |
| body line-height | **1.75** (28px) | **1.4286** (20px) |
| font | Anuphan (ไทย) | system stack |

Astryx ตั้งมาสำหรับ UI หนาแน่นบน desktop ของ Meta ส่วนอักษรไทยมีสระบนสระล่างและวรรณยุกต์ซ้อนสองชั้น — line-height 1.43 ทำให้ตัวอักษรชนกัน **ไม่รับทั้งชุด** → เข้า allowlist

### 2.4 Control height — ข้อขัดแย้งหลัก

| size | Astryx | เรา (วัดจริง) |
|---|---|---|
| sm | 28px | 38px |
| md | 32px | **46px** |
| lg | 36px | ยังไม่ได้วัด |
| (xs ของเรา) | — | 30px · pointer-only |

Astryx **ทุกไซส์**ต่ำกว่าเกณฑ์ที่เราตัดสินไว้ว่า touch ใช้ไม่ได้ — โค้ดเรามีคอมเมนต์ระบุว่าแม้แต่ `xs` ที่ 30px ก็ "ห้ามใช้บน viewport ที่เป็น touch" **ไม่รับ** → เข้า allowlist และเป็นข้อที่มีน้ำหนักที่สุดในเอกสารนี้

### 2.5 สี — ไม่แตะ

`--sme-blue/gold/yellow/green/red/neutral` ทั้ง ramp และ `dark.css` คงเดิม 100% ไม่มีรายการใน §2 นี้ที่แตะสี

---

## 3 · ชั้น props

อ่านว่า: **ตรง** = ชื่อเดียวกันอยู่แล้ว · **rename** = งานเดียวกันคนละชื่อ · **เราเกิน** = เรามีเขาไม่มี · **เขาเกิน** = ช่องว่างที่อาจอยากได้

| component | ตรง | rename | เราเกิน | เขาเกิน |
|---|---|---|---|---|
| Button | 11 | — | `fullWidth` `iconPosition` | `label` `href` `as` `isIconOnly` `endContent` `tooltip` `width` `clickAction` `isInterruptible` `target` `rel` |
| IconButton | 0 | `name`→`icon` | `label` `size` `variant` | — |
| Link | 9 | — | `external` `quiet` | `label` `hasUnderline` `isExternalLink` `isStandalone` `maxLines` `weight` `color` `display` `tooltip` |
| TextField→TextInput | ✅ | `errorMessage`→`status` · `showOptional`→`isOptional` · `prefix`→`startIcon` | — | `size` (D1) `width` (D6) `changeAction` (D8) `htmlName` (D15) `labelTooltip` `onEnter` `hasAutoFocus` `disabledMessage` (D16) |
| ⚠️ | | **แถวเดิมผิด 5 ช่อง** — เขียนว่าไม่รับ `isLabelHidden` `isLoading` `hasClear` `startIcon` แต่โค้ดรับทั้งสี่ (`TextInput.tsx` §54–56) และวาง `prefix` ไว้ในช่อง "ของเราเกิน" ทั้งที่ rename เป็น `startIcon` ไปแล้ว · จับได้จาก `propsOursOnly` ที่ทำให้ยืนยันจริง (คำตัดสิน 2026-07-28 ข้อ 3) | | |
| Textarea→TextArea | 13 | เหมือนบน | — | `hasSpellCheck` + ชุดเดียวกับบน |
| Checkbox→CheckboxInput | ✅ | `children`→`label` · +`isLabelHidden` `status` `isOptional` | — | `size` (D1) `isLoading` (D8) `labelIcon` (D35) `width` (D6) `htmlName` (D15) `changeAction` (D8) `disabledMessage` (D16) |
| RadioGroup→RadioList | ✅ | `errorMessage`→`status` · `showOptional`→`isOptional` · +`isLabelHidden` | — | `size` (D1) `width` (D6) `labelTooltip` `disabledMessage` (D16) `htmlName` (D15) |
| Switch | 6 | — | `align` `children` | `label` `labelPosition` `labelSpacing` `isLabelHidden` `status` `width` + 8 |
| Select→Selector | 9 | `errorMessage`→`status` · `showOptional`→`isOptional` | — | `hasSearch` `hasClear` `renderOption` `placement` `startIcon` `isDefaultOpen` + 8 |
| ComboBox→Typeahead | 9 | เหมือนบน | `options` | `searchSource` `debounceMs` `renderItem` `maxMenuItems` `emptySearchResultsText` `onChangeQuery` + 8 |
| NumberField→NumberInput | 11 | เหมือนบน | `hideStepper` `suffix` | `min` `max` `units` `isIntegerOnly` `hasClear` `startIcon` + 10 |
| SearchField→PowerSearch | 8 | `errorMessage`→`status` · `labelHidden`→`isLabelHidden` | `description` | `config` `filters` `components` `resultCount` `maxTokenLength` `timezoneID` + 10 |
| DatePicker→DateInput | 6 | `errorMessage`→`status` · `showOptional`→`isOptional` | — | `min` `max` `dateConstraints` `numberOfMonths` `hasClear` `placeholder` + 7 |
| FileUpload→FileInput | 4 | `files`→`value` · `onSelect`→`onChange` · `multiple`→`isMultiple` · `maxSizeMb`→`maxSize` | `onRemove` | `maxFiles` `mode` `status` `isLoading` + 8 |
| RangeSlider→Slider | 5 | `minValue`→`min` · `maxValue`→`max` | `minLabel` `maxLabel` `unit` | `marks` `valueDisplay` `formatValue` `onChangeEnd` `minStepsBetweenThumbs` `orientation` + 9 |
| Card | 3 | ~~`elevation`+`interactive`→`variant`~~ ❌ **mapping ผิด — ดู D29** | `as` `selected` `elevation` `interactive` | `variant` (แกนสีพื้น · D29) `width` `height` `maxWidth` `minHeight` |
| Badge | 2 | — | `children` `showIcon` | `label` |
| Chip→Token | 3 | — | `children` | `label` `size` `color` `onRemove` `href` `endContent` `description` `isLabelHidden` |
| Accordion→Collapsible | 2 | — | — | `trigger` `isOpen` `defaultIsOpen` `onOpenChange` `value` |
| ~~ImageGallery→Lightbox~~ | ❌ | — | — | **ตัดออกแล้ว** (§8.6) — `Lightbox` เป็น overlay ส่วน `ImageGallery` ของเราเป็น gallery ฝังในหน้า · แถวนี้เคยค้างไว้เป็นเป้า rename ทั้งที่ §1.2 ขีดฆ่าไปแล้ว และ `propsOursOnly` ยังประกาศ `Lightbox` ไว้ทั้งที่ไม่มี component จริง |
| Alert→Banner | 3 | `action`→`endContent` | `isLive` `titleAs` `tone`→`status` | `description` `icon` `isDismissable` `container` `defaultIsExpanded` |
| Dialog | 2 | `hideClose`→`purpose` | `footer` `size` `title` | `isOpen` `onOpenChange` `position` `padding` `width` `maxHeight` `isInline` |
| ProgressBar | 2 | `maxValue`→`max` · `tone`→`variant` · `format`→`formatValueLabel` | `note` `size` `unit` `unknownLabel` | `isIndeterminate` `hasValueLabel` `isLabelHidden` `isDisabled` |
| Skeleton | 1 | `shape`→`radius` | `lines` | `height` |
| Toast | 0 | — | — | `type` `body` `isAutoHide` `autoHideDuration` `onDismiss` `endContent` |
| Tooltip | 4 | — | — | `content` `anchorRef` `delay` `hideDelay` `alignment` `focusTrigger` `isEnabled` + 2 |
| Icon | 2 | `name`→`icon` | — | — |
| Grid | 1 | `gutter`→`gap` · `preset`→`columns` | `as` | `minChildWidth` `rowGap` `columnGap` `align` `justify` `rowHeight` + 4 |
| Section | 1 | — | `as` | `variant` `dividers` `padding` `paddingBlock` + 4 |
| Divider | 1 | — | — | `label` `variant` `isFullBleed` |
| AppHeader→TopNav | 0 | — | ทั้ง 9 ตัว | `heading` `startContent` `centerContent` `endContent` `label` `children` |

### 3.1 รูปแบบซ้ำ ๆ ที่เห็นทั้งตาราง

สี่อย่างนี้โผล่แทบทุกแถว จัดการเป็นกฎเดียวได้ ไม่ต้องคิดทีละตัว:

1. **`className` ↔ `xstyle`** — Astryx รับ `xstyle` (StyleX) แทน `className` ทุกตัว **เราคง `className`** เพราะเป็น Tailwind ทั้งระบบ → allowlist ข้อเดียวครอบทุก component
2. **`errorMessage` → `status`** — Astryx รวม error/warning/success เป็น `status` object ตัวเดียว (11 component)
3. **`showOptional` → `isOptional`** — prefix `is` (8 component)
4. **`label` เป็น prop ไม่ใช่ children** — Astryx บังคับ `label: string` ส่วนเรารับ `children` (6 component) นี่คือความต่างเชิงปรัชญา ไม่ใช่แค่ชื่อ — ดู §5.3

---

## 4 · Divergence allowlist

ทุกบรรทัดคือ "จงใจไม่ตรง" พร้อมเหตุผล parity script ต้องอ่านไฟล์นี้แล้วไม่ fail กับรายการเหล่านี้ และต้อง **fail** ถ้ามี divergence ใหม่ที่ไม่ได้อยู่ในลิสต์

| # | รายการ | เหตุผล |
|---|---|---|
| D1 | control height 28/32/36 → คงของเรา 38/46 | Astryx ทุกไซส์ต่ำกว่าเกณฑ์ touch ที่ระบบนี้ตัดสินไว้ ผู้ใช้เป็น SME ไทยบนมือถือ ไม่ใช่พนักงาน Meta บน desktop |
| D2 | `radius-xl` 28px → คง 16px | 28px คือภาษารูปทรงของ Meta เปลี่ยนแล้วบุคลิกแบรนด์เปลี่ยน |
| D3 | type scale 14px/1.43 → คง 16px/1.75 | สระบน–ล่างของอักษรไทยชนกันที่ line-height 1.43 |
| D4 | font system stack → คง Anuphan | ไทยเป็นภาษาหลัก |
| D5 | สีทั้งระบบ | แบรนด์ SME.GO |
| D6 | `className` แทน `xstyle` | Tailwind ไม่ใช่ StyleX |
| D7 | variant `accent` (ทอง) และ `success` | Astryx ไม่มี แต่เปิดทางไว้เองผ่าน `ButtonVariantMap` module augmentation → ใช้ pattern ของเขา |
| D8 | `isSelected` / `onChange(boolean)` แบบ RAC | Astryx ใช้ DOM `ChangeEvent` การเปลี่ยนตามจะพัง React Aria ทั้งชั้นเพื่อแลกความเหมือนผิวเผิน |
| D9 | `Breadcrumbs` และ `Token` ไม่สร้างเป็นตัวใหม่ | ตัดไปแล้วรอบ 2026-07-26 ด้วยเหตุผลเรื่องความซ้ำซ้อน |
| D10 | `OTPField` `DescriptionList` `Deadline` + marketplace 18 | ไม่มีคู่เทียบ |
| D11 | `SearchField` ไม่ rename เป็น `PowerSearch` | `PowerSearch` เป็น query builder มี operator/filter คนละ component กัน (§5.6) |
| D12 | `TopNav` มี 9 props ของ marketplace เกินจาก Astryx | Astryx `TopNav` เป็น shell เปล่า ของเรารู้เรื่องตะกร้า/เข้าสู่ระบบ (§5.8, §8.3) |
| D13 | `Banner` ไม่รับ `defaultIsExpanded` / `container` | Banner ที่ยุบ error ได้ ขัดกับกฎ "errors ใช้ Alert ไม่ใช่ Toast" (§8.4) |
| D14 | `ToastRegion` คงชื่อและไม่รับ `autoHideDuration` | คนละชั้นกับ `Toast` ของ Astryx และ 6 วินาทีถูกตรึงโดยเจตนา (§8.4) |
| D15 | ไม่รับ `htmlName` | RAC ให้ `name` อยู่แล้ว การมีสองชื่อสำหรับสิ่งเดียวกันแย่กว่าการต่างจาก Astryx |
| D16 | ไม่รับ `labelTooltip` `disabledMessage` `onEnter` `hasAutoFocus` | ไม่มี use case ใน marketplace · `labelTooltip` ยังลาก SC 1.4.13 เข้ามาโดยไม่จำเป็น (ระบบผลัก hard case ของ Tooltip ไป `Popover` อยู่แล้ว) · `hasAutoFocus` เป็นอันตรายบนมือถือ ถ้าจำเป็นจริงใช้ `autoFocus` ของ RAC · `onEnter` ทำได้ด้วย `onKeyDown` |
| D17 | `TextArea` ไม่รับ `startIcon` `isLoading` `hasSpellCheck` | ไอคอนนำและตัวหมุนออกแบบมาสำหรับช่องบรรทัดเดียว ตำแหน่งจะไม่แน่นอนเมื่อผู้ใช้ยืดกล่อง · `hasSpellCheck` ใช้ `spellCheck` ของ DOM ได้ตรง ๆ |
| D18 | `label: string` บังคับทุก input (§8.1) แต่เพิ่ม `labelContent?: ReactNode` เฉพาะ `CheckboxInput` และ `RadioList` — ไม่ขยายไปตัวอื่น | ป้ายของสองตัวนี้เป็นประโยคจริงที่ต้องฝังลิงก์ได้ (consent: "ยอมรับ [เงื่อนไขการใช้งาน]") ซึ่ง `label: string` เขียนไม่ได้ · ที่เหลือไม่มีเคสนี้ · accessible name ยังมาจาก `label` ที่เป็น string เสมอ เพื่อให้ a11y test assert ชื่อได้ตรง ๆ ไม่ต้องเดินผ่าน ReactNode |
| D19 | ไม่รับ `tooltip` บน `Button` `IconButton` `Link` | `IconButton.md` §5 และ `Tooltip.md` §5 เขียนตรงกันว่า `aria-describedby` **ไม่ใช่** accessible name — prop ชื่อ `tooltip` บนปุ่มเชิญให้ทำ anti-pattern ที่สองไฟล์นั้นกันไว้เอง (ใช้ `label` ตั้งชื่อ แล้วครอบด้วย `TooltipTrigger` ถ้าต้องการคำอธิบายเสริม) |
| D20 | เส้นแบ่ง link/button — ไม่รับ `Button.href/target/rel` (และ `IconButton.href/target/rel` ด้วยเหตุผลเดียวกัน) และไม่รับ `Link.label/color/weight/display/type/maxLines/hasUnderline` | `Link.md` §1 ตั้งกฎไว้ว่า "เปลี่ยน URL = ลิงก์ · เปลี่ยนข้อมูล = ปุ่ม" · `Button.href` ลบเส้นนั้นทิ้ง ส่วน `Link.color/weight/display/type/maxLines` เปิดทางให้ลิงก์แต่งตัวเป็นปุ่ม · `hasUnderline` คือปุ่มปิด SC 1.4.1 (สีอย่างเดียวไม่พอ) ที่ `base.css` บังคับขีดเส้นใต้ด้วย `:where(a[href])` อยู่แล้ว |
| D21 | props ที่ขัด SC หรือขัดคำตัดสินเดิม — `IconButton.isLoading/clickAction/isInterruptible` · `Tooltip.focusTrigger/alignment/anchorRef/hasHoverIndication` · `ProgressBar.isIndeterminate` · `Dialog.isInline` | `IconButton` เป็นไอคอนล้วน ไม่มีที่ให้ spinner โดยไม่บังไอคอน — `IconButton.md` §10 สั่งให้ใช้ `Button isLoading` แทนอยู่แล้ว · `clickAction`/`isInterruptible` เป็น event model ของ Astryx (เหตุผลเดียวกับ D8) · `focusTrigger` เปิดช่องปิดการแสดงตอน focus = ตก SC 1.4.13 · `alignment`/`anchorRef`/`hasHoverIndication` ขัด offset 8px ที่ตรึงไว้โดยเจตนา · `isIndeterminate` ทับเขต `Spinner` ตามกฎ §8.5 · `Dialog.isInline` คือ dialog ที่ไม่ใช่ overlay ซึ่งเป็นงานของ `Card`/`Section` |
| D38 | `Table` ใช้ `<table>` ปกติ ไม่ใช่ RAC `Table` และ API ต่างจาก Astryx เกือบทั้งชุด | วัดแล้ว RAC `Table` เพิ่ม **+44 KB gzip** บน baseline 30.5 KB (เกินเท่าตัว · ลีกเดียวกับ `Typeahead` +43 และ `Selector` +40) · สิ่งที่ได้มาแลกคือ selection · การเดินด้วยลูกศร 2 มิติ · drag-and-drop ซึ่งเป็น **ของที่ขอบเขตตัดออกทั้งชุด** (คำตัดสิน 2026-07-26: read + sort + row action) · และ RAC ประกาศ `role="grid"` ซึ่งเปลี่ยน screen reader เป็นโหมด application ทั้งที่ตารางอ่านอย่างเดียวได้ประโยชน์จาก semantic ของ `<table>` มากกว่า · `CompareTable` ใช้ `<table>` ปกติอยู่แล้ว การใช้ RAC จะทำให้ระบบมีตารางสองแบบที่ SR เจอคนละโมเดล (หลักเดียวกับ D15 · D22 · D33) · prop จึงเป็นชุด `columns`/`rows`/`rowKey` แบบ data-driven ไม่ใช่ compound component ของเขา |
| D37 | `Icon` ไม่รับชื่อ `icon` ของ Astryx — คง `name` | ของ Astryx รับ **`ReactNode`** ส่วนของเรารับ **key ของ registry** (`IconName`) ซึ่งเป็นสิ่งที่ทำให้การันตีชุดไอคอนที่ผ่านการตรวจ stroke/ขนาดได้ · `name` สื่อ "อ้างถึงรายการในทะเบียน" ตรงกว่า `icon` ที่สื่อ "ยัดอะไรก็ได้" · รับชื่อเขาแต่คงชนิดเราจะได้ชื่อเดียวกันชนิดต่างกัน (กับดักเดียวกับ D34) และจ่าย **247 call site** เพื่อความสับสน (ยืนยันคำตัดสิน 2026-07-28) |
| D36 | `Banner` ไม่รับ `status` — คง `tone` | ⚠️ **ชื่อชนกันแต่รูปร่างคนละอย่าง** · `status` ของ Astryx คือ `BannerStatus` (string enum ที่ theme ขยายได้) ส่วน `status` ในระบบนี้คือ `InputStatus` = `{ type, message }` ที่ใช้เหมือนกันทั้ง 13 input · รับชื่อเขาจะทำให้ prop ชื่อเดียวกันมีสองรูปร่างในระบบเดียว ซึ่งเป็นกับดักที่ **D34 ปฏิเสธไปแล้วตรง ๆ** · `tone` เป็นชื่อที่ถูกของแกนนี้ และ §8.4/D13 ตัดสินไว้แล้วว่า `Alert`→`Banner` รับแค่ชื่อ component ไม่รับ API |
| D35 | ไม่รับ `labelIcon` ทุกตัว (`CheckboxInput` `NumberInput` `Switch` ฯลฯ) | ไอคอนข้างป้ายเป็นการตกแต่งที่ไม่มีทางประกาศความหมายให้ screen reader ได้ — ถ้าไอคอนสื่อความหมายจริง ข้อความต้องพูดสิ่งนั้นออกมา และถ้าไม่สื่อ ก็เป็น noise ที่กินพื้นที่ป้ายซึ่งข้อความไทยยาวกว่าอังกฤษ 20–40% อยู่แล้ว · เคสที่อ้างกันบ่อยคือ "ไอคอนช่วยอธิบาย" ซึ่งระบบนี้ตอบด้วย `description` (มีทุกตัว) ไม่ใช่ภาพ · หลักเดียวกับ D16 แต่แยกรหัสเพราะ D16 แจกแจง prop ไว้ตายตัวแล้ว |
| D34 | `Link` ไม่รับ `isExternalLink` / `isStandalone` — **รับ `newTabLabel`** | ⚠️ **§4 เดิมเขียนผิดทั้งสองข้อ** (ตรวจกับ `Link.d.ts` แล้ว) · **`isExternalLink`**: เอกสารเดิมว่า "rename จาก `external` งานเดียวกัน" — **ไม่จริง** · ของ Astryx **ตั้ง `target="_blank"` + `rel="noopener noreferrer"` ให้อัตโนมัติ** ส่วน `external` ของเราตั้งใจไม่ตั้ง (คอมเมนต์ใน `Link.tsx` ระบุว่า "การเปิดแท็บใหม่เป็นการตัดสินใจระดับผลิตภัณฑ์ ไม่ใช่ผลข้างเคียงของการมีไอคอน" — สอดคล้อง WCAG G200) · ถ้ารับชื่อเขาแต่คงพฤติกรรมเราจะได้ **ชื่อเดียวกันพฤติกรรมต่างกัน** ซึ่งเป็นกับดักที่แย่กว่าการต่างชื่อ · **`isStandalone`**: เอกสารเดิมว่า "ต้องการ hit area ของตัวเอง" — **ไม่จริง** · `.d.ts` ระบุว่า "Applies base font sizing" คือเรื่อง**ขนาดตัวอักษร** ซึ่งซ้ำกับ `size` ของเราที่มี `inherit`/`body` อยู่แล้ว (หลักเดียวกับ D22: ไม่มีสองวิธีทำสิ่งเดียวกัน) · **`newTabLabel` รับเข้ามาแล้ว** — ข้อความ SR ต้องแปลไทยได้ต่อ call site |
| D33 | `Button` ไม่รับ `label` · `isIconOnly` · `endContent` | **`label`**: §8.1 จำกัดขอบเขต `label: string` ไว้ที่ input + `Badge` + `Chip` และ**จงใจไม่รวม `Button`** — ปุ่มต้องรับ `ReactNode` เพราะมี composition จริงในระบบ (ไอคอน + ข้อความ + จำนวน) และมี 71 call site (ยืนยันคำตัดสิน 2026-07-28) · **`isIconOnly`**: เรามี `IconButton` เป็น component แยกอยู่แล้ว — เอกสารของ Astryx เองก็บอกให้ใช้ `IconButton` แทน `<Button isIconOnly>` การมีทั้งสองทางคือสองวิธีทำสิ่งเดียวกัน (หลักเดียวกับ D15) · **`endContent`**: ซ้ำกับ `icon` + `iconPosition="end"` ที่อยู่ใน `propsOursOnly` แล้ว |
| D32 | `Dialog` ไม่รับ `purpose` · `padding` · `maxHeight` · `position` | `purpose` ของ Astryx พ่วงความหมายอื่นมาด้วย ส่วนของเราคุมแค่ปุ่มปิด (`hideClose` — เขียนไว้ใน propsOursOnly อยู่แล้ว) · `padding`/`maxHeight` เป็นเรื่องเดียวกับ D2 (ขนาดกล่องมาจาก `variant` ไม่ใช่ค่าดิบ) · `position` — `Dialog.md` §3 ตรึงเรขาคณิตต่อ variant ไว้แล้ว (modal กลางจอ · sheet ก้นจอ · drawer ชิดขอบ) เหตุผลเดียวกับ D21 ที่ปฏิเสธ `isInline` |
| D31 | `Token` ไม่รับ `description` · `endContent` · `isLabelHidden` | `Token.md` §1 นิยามว่าเป็น **คำกรองสั้นคำเดียว** — คำอธิบายและเนื้อหาท้ายทำให้มันกลายเป็นการ์ดเล็ก และ **token ที่ซ่อน label คือแคปซูลเปล่า** ที่ผู้ใช้เดาไม่ได้ว่ากรองอะไร (ต่างจากปุ่มไอคอนที่รูปสื่อความหมายได้เอง) |
| D30 | `Skeleton` ไม่รับ `height` · `index` | `height` — ความสูงของเรามาจาก `lines` ที่อิง line-height ของสเกลตัวอักษร (`Skeleton.md` §3) การรับค่าดิบเปิดทาง D3 กลับมา · `index` มีไว้ทำ stagger แต่ `Skeleton.md` §4 ตรึงไว้ว่า **ปรากฏทันที ไม่ fade เข้า** และ `base.css §10` บังคับให้เป็นพื้นนิ่งใน reduced motion — การไล่ลำดับจึงไม่มีที่ยืน · ส่วนจำนวนแถบเป็นหน้าที่ของ `SkeletonGroup` |
| D29 | `Card` ไม่รับ `variant` | ⚠️ **แก้ความเข้าใจผิดใน §3** — ตาราง §3 เขียนว่า `elevation`+`interactive` → `variant` ราวกับเป็นแกนเดียวกัน **ซึ่งไม่จริง**: `variant` ของ Astryx เป็น **แกนสีพื้น** (`default`/`transparent`/`muted` + tint 10 สีจาก `--color-background-*`) ไม่ใช่แกนความสูง · แกนสีจึงอยู่ใต้ D5 (ไม่แตะสี) ส่วนความสูงของเรามาจาก `--elevation-*` ที่ผูก surface+edge+shadow เข้าด้วยกันในหนึ่ง token (`Card.md` §3) และสองแกน `elevation`/`interactive` ถูกตัดสินให้แยกกันไว้แล้วใน §5.4 |
| D28 | `TabList` — เพิ่ม `label` (บังคับ) และ `isDisabled` เกินจาก Astryx · และ **export `Tab` / `TabPanel` เพิ่ม** ทั้งที่ Astryx ให้ `TabList` เป็นแถบเปล่า | **`label`**: Astryx ให้ส่ง `aria-label` ผ่าน `BaseProps` ดิบ ๆ · ระบบนี้ใช้ prop ชื่อ `label` ที่บังคับทุกที่ที่ต้องมีชื่อ (`IconButton` · `TopNav` · `SegmentedControl`) — แถบ tab ที่ไม่มีชื่อคือ landmark ที่ผู้ใช้ screen reader ข้ามไปหาไม่ได้ · **`Tab`/`TabPanel`**: ARIA บังคับให้ `role="tab"` มี `aria-controls` ชี้ `tabpanel` และ panel มี `aria-labelledby` ย้อนกลับ · แถบเปล่าแบบ Astryx ผลักภาระต่อ id ไปที่ call site ซึ่งจะถูกลืมแล้ว tab กลายเป็นปุ่มเฉย ๆ **โดยไม่มี error** · จึงสร้างบน RAC `Tabs`/`TabList`/`Tab`/`TabPanel` ที่ต่อให้ครบ (เหตุผลเดียวกับ D8) · ผลพลอยได้: panel ที่ไม่ได้เลือก**ไม่อยู่ใน DOM** ต่างจากการซ่อนด้วย CSS ที่ SR ยังอ่านเจอ |
| D27 | `Pagination` ไม่รับ `pageSizeOptions` / `onPageSizeChange` (ตัวเลือกจำนวนรายการต่อหน้า) และไม่รับ `variant="dots"` | ไม่มี template ของ marketplace ที่ต้องใช้ตัวเลือกจำนวนต่อหน้า — เหตุผลเดียวกับที่ §1.4 ตัด `Carousel`/`CommandPalette` ออก · `pageSize` **ยังรับ** เพราะจำเป็น ต่อการคำนวณจำนวนหน้าจาก `totalItems` · ส่วน `dots` เป็นจุดที่เล็กกว่าเกณฑ์ touch มากและเป็น สำนวนของ carousel ซึ่งถูกตัดไปแล้ว (เป็นค่าของ `variant` ไม่ใช่ชื่อ prop จึงไม่ปรากฏใน gate) |
| D26 | `EmptyState` — `role="status"` เป็น opt-in ชื่อ `isLive` (Astryx ตั้งตายตัว) และ `title` **ไม่**เป็นหัวข้อโดยค่าเริ่มต้น (Astryx ตั้ง `headingLevel: 3`) | `SearchResult.tsx` มีคอมเมนต์กำกับไว้ก่อนหน้านี้แล้วว่า "ไม่ใช่ live region — ข้อความจำนวนด้านบนประกาศไปแล้ว ถ้าประกาศซ้ำผู้ใช้จะได้ยินสองรอบ" — `role="status"` ตายตัวจะทำให้ regress · ปัญหารูปเดียวกับ `role="alert"` ของ `Banner` (§8.4) และตอบเหมือนกัน · ส่วนหัวข้อ: ที่ว่างสามอันในหน้าเดียวจะฉีด `<h3>` สามอันปนโครงของเนื้อหาจริง (เหตุผลเดียวกับ `Banner.titleAs`) · ⚠️ **หนี้คำศัพท์ที่รู้ตัว**: `Banner` ใช้ `titleAs` ส่วนตัวนี้ใช้ `headingLevel` — หมายถึงสิ่งเดียวกัน ควรรวมเป็นชื่อเดียวในรอบถัดไป |
| D25 | `Avatar.alt` **ไม่** ถอยไปใช้ `name` อัตโนมัติ (ค่าเริ่มต้นเป็น `''` = ของตกแต่ง) | เคสที่พบจริงเกือบทั้งหมดคือ avatar วางข้างชื่อที่เป็นข้อความอยู่แล้ว (`SellerProfile` · `CartSellerGroup`) — ถ้า `alt` = ชื่อ ผู้ใช้ screen reader จะได้ยินชื่อผู้ขายสองครั้งติดกัน · ระบบนี้ตัดสินเรื่องเดียวกันมาแล้วสามที่และเลือก "ประกาศครั้งเดียว" ทุกครั้ง (จำนวนตะกร้าใน `TopNav` · ปุ่มปิด `Banner` · ปุ่มลบ `RemovableChip`) · ⚠️ gate ตรวจข้อนี้ไม่ได้เพราะเป็นความต่างของ **ค่าเริ่มต้น** ไม่ใช่ชื่อ prop |
| D24 | `Spinner` มี `isLabelHidden` เกินจาก Astryx (เขาใช้ `aria-label` แทน) | `isLabelHidden` เป็นคำศัพท์ที่ระบบนี้ตั้งไว้แล้วใน `TextInput` `TextArea` `CheckboxInput` `RadioList` (§8.1) — การให้ `Spinner` ใช้ `aria-label` ตามเขาคือการมีสองวิธีทำสิ่งเดียวกันในระบบเดียว · และ `aria-label` ดิบเลี่ยงการตัดสินใจว่าข้อความควรเห็นด้วยตาหรือไม่ ซึ่งเป็นคำถามที่ `Spinner` ต้องบังคับให้ผู้เรียกตอบ (ดู `Spinner.md` §5) |
| D22 | layout layer แยกทาง — ไม่รับ props ที่ขาดทั้งหมดของ `Grid` (11) `Section` (7) `Divider` (3) และคง `gutter`/`preset` ของเราไว้ | เหตุผลเดียวกับที่ปฏิเสธ control height ใน §2.4: ชั้น layout คือภาษารูปทรงของเรา ไม่ใช่ของ Meta · Astryx ให้ `columns`/`gap` ดิบให้ call site ตัดสินเอง เราให้ `preset` ที่ตัดสินใจแทนไปแล้ว การรับทั้งสองแบบพร้อมกันคือการมีสองวิธีทำสิ่งเดียวกัน |

#### รับเข้ามา — ยังไม่ลงมือ (ไม่เข้า allowlist)

ห้าตัวนี้ **รับ** แล้วในเชิงคำตัดสิน แต่โค้ดยังไม่แก้ จึงยังฟ้องอยู่ใน `lint:parity` ตามเจตนา — ห้ามใส่ใน `wontAdopt` เพราะจะกลบงานที่ยังไม่ได้ทำ:

| prop | สถานะ | หมายเหตุ |
|---|---|---|
| `IconButton`: `name` → `icon` | รับ — ยังไม่ลงมือ | rename ชุดเดียวกับ `Icon.name` → `icon` (§3) ทำพร้อมกันทีเดียว |
| ~~`Link.isStandalone`~~ | ❌ **กลับคำ → ไม่รับ (D34)** | เหตุผลเดิมผิด — `.d.ts` บอกว่าเป็นเรื่องขนาดตัวอักษร ไม่ใช่ hit area และซ้ำกับ `size` ของเรา |
| ~~`Link.isExternalLink`~~ | ❌ **กลับคำ → ไม่รับ (D34)** | เหตุผลเดิมผิด — ไม่ใช่ "งานเดียวกัน" · ของเขาบังคับ `target="_blank"` ส่วนของเราตั้งใจไม่ทำ |
| `Link.newTabLabel` | ✅ **ลงมือแล้ว** | คู่กับ `external` ของเรา — override `s.common.opensInNewTab` ต่อ call site |
| `Tooltip.content` (แทน `children`) | ✅ **ลงมือแล้ว** | แยกเนื้อ tooltip ออกจาก trigger — `TooltipTrigger` มี `children` ของตัวเองอยู่แล้ว |

#### prop ที่เราเกิน — `propsOursOnly` รอบนี้

| component | prop | ทำไมเก็บไว้ |
|---|---|---|
| `Switch` | `align` | ⚠️ **เหตุผลเดิมเขียนผิด — ระบุว่าเป็นแกนบน/ล่าง ซึ่งไม่จริง** · โค้ดจริง (`Switch.tsx:55,62`) ทำสองอย่างพร้อมกันคือสลับลำดับ label/หัวสวิตช์ **และ** ใส่ `justify-between` — จึงเป็น **แกนเดียวกับ `labelPosition` + `labelSpacing` ของ Astryx รวมกัน** ไม่ใช่คนละแกน · `align` ของเรายุบสองแกนเป็นหนึ่งและเปิดได้แค่ 2 ใน 4 ชุดค่า → **ยังไม่ตัดสิน** ว่าจะแยกเป็นสอง prop ตาม Astryx หรือคง `align` ไว้ (ดู §6.5) |
| `Card` | `elevation` · `interactive` | สองแกนอิสระตาม §5.4 · `variant` ตัวเดียวของ Astryx เขียน "ยกสูงแต่กดไม่ได้" ไม่ได้ ซึ่งขัดกฎ "พื้นทึบ = กดได้" ของระบบ |
| `Skeleton` | `shape` | คู่กับ `lines` — รูปทรงของ placeholder ผูกกับ `--radius-*` ของเรา ไม่ใช่ `radius` ดิบแบบ Astryx (D2) |
| `ProgressBar` | `format` · `maxValue` · `tone` | ชื่อเดิมของเราสำหรับสิ่งที่ Astryx เรียก `formatValueLabel` / `max` / `variant` (§3) ยังไม่ rename จึงยังนับเป็นเกิน |
| `Grid` | `gutter` · `preset` | D22 — `preset` คือการตัดสินใจเรื่องคอลัมน์ที่ทำแทน call site ไปแล้ว `gutter` ผูกกับ `--sme-space-unit` |
| `Dialog` | `hideClose` | ชื่อเดิมของเราสำหรับสิ่งที่ Astryx เรียก `purpose` (§3) — `purpose` ของเขาพ่วงความหมายอื่นมาด้วย ของเราคุมแค่ปุ่มปิด |

`Icon.name` ไม่ใส่ในลิสต์นี้ เพราะจะหายไปเองตอน rename เป็น `icon`

> **หมายเหตุ `Tooltip`** — `delay` `hideDelay` `isDefaultOpen` `isEnabled` ที่ `lint:parity` ฟ้องว่าขาดเป็น **false positive** เรามีครบแล้วแต่อยู่บน `TooltipTrigger` (RAC ให้ `delay` / `closeDelay` / `isDisabled` / `defaultOpen`) เป็น**ความต่างเชิงชั้น** ไม่ใช่ prop ที่ขาด — ตรวจที่ `TooltipTrigger` ไม่ใช่ที่ `Tooltip` · ไม่ใส่ใน `wontAdopt` เพราะนั่นแปลว่า "มีแล้วไม่เอา" ส่วนนี่คือ "มีแล้ว แต่คนละที่" (แก้ที่ `layerDiff` ของ linter)

### 4.1 · รูปแบบที่เครื่องอ่าน

`lint/lint-parity.mjs` อ่านบล็อกนี้ ไม่ได้อ่านตารางข้างบน — ตารางไว้ให้คนอ่าน บล็อกนี้ไว้ให้เครื่อง **แก้ทั้งคู่เสมอ**

- `rename` — ชื่อของเรา → ชื่อ Astryx ที่ต้องตรงกันหลังเฟส 3
- `extension` — component ของเราที่ไม่มีคู่เทียบ script จะไม่บ่นถึง
- `propsOursOnly` — prop ที่เราจงใจมีเกิน แยกตาม component
- `propsSkipAll` — prop ที่ยกเว้นทุก component
- `wontAdopt` — prop ของ Astryx ที่จงใจไม่รับ พร้อมรหัส D
- `layerDiff` — prop ที่ Astryx วางบน component เดียว แต่เราแยกตาม RAC · ต่างจาก `wontAdopt` ตรงที่นั่นคือ "มีแล้วไม่เอา" ส่วนนี่คือ **"มีแล้ว แต่คนละที่"** · รายงานเป็น note ไม่ใช่ fail
- `maxProblems` — **เพดานนับถอยหลัง** ดูด้านล่าง

#### เพดานนับถอยหลัง (`maxProblems`)

งาน parity เปิดค้างหลายสัปดาห์ ถ้าเกต fail ทันทีที่มี problem ข้อเดียว `npm run verify` จะแดงยาวตลอดทางจนหมดความหมาย เกตจึงเทียบกับเพดานแทน:

| ผล | |
|---|---|
| เกินเพดาน | ✗ มี drift ใหม่เข้ามา |
| **ต่ำกว่า**เพดาน | ✗ ปิดงานได้แล้ว **ต้องลดตัวเลขนี้ลง** ไม่งั้นเพดานจะค้างสูงแล้วเปิดช่องให้ drift ใหม่แอบเข้ามาแทนที่ปัญหาเก่าที่เพิ่งปิด |
| เท่ากัน | ✓ |

เพดานปัจจุบัน **53** (เริ่มที่ 51 จาก baseline `d4f3ecd` · ขึ้นเป็น 53 หลังกลับกฎ 3b เป็นหักดิบ ซึ่งทำให้ชื่อเก่าที่ยังไม่ได้ rename ถูกนับเพิ่ม) — พอถึง `0` ให้ลบกลไกนี้ทิ้งทั้งในไฟล์นี้และใน `lint-parity.mjs` แล้วกลับไปเป็น fail ทันทีที่มี problem

```json parity
{
  "astryxVersion": "0.1.9",
  "maxProblems": 0,
  "rename": {
    "TextField": "TextInput",
    "Textarea": "TextArea"
  },
  "same": [
    "Button", "IconButton", "Link", "Switch", "Card", "Badge", "Dialog",
    "Tooltip", "Skeleton", "ProgressBar", "Icon", "Grid", "Stack",
    "Section", "Divider", "EmptyState", "Pagination", "Avatar", "Spinner",
    "SegmentedControl", "DropdownMenu", "Table", "CheckboxList",
    "HStack", "VStack",
    "CheckboxInput", "RadioList", "Selector", "Typeahead",
    "NumberInput", "DateInput", "FileInput", "Slider", "Token", "Collapsible",
    "Banner", "TopNav"
  ],
  "renameNewBuild": { "Tabs": "TabList" },
  "extension": [
    "ImageGallery",
    "SearchField", "OTPField", "DescriptionList", "ToastRegion",
    "CategoryNav", "CategoryBreadcrumb", "Deadline", "GrantCard", "BuyBox",
    "Checkout", "Payment", "Compare", "SellerProfile", "OrderTimeline",
    "ProductCard", "ProgramCard", "ServiceCard", "TrainingCard",
    "FundingCard", "BusinessCard", "EntityCard", "SearchResult",
    "FilterPanel", "Cart", "Wishlist", "Container", "SmeGoProvider"
  ],
  "notOurConcern": {
      "Chat": "ไม่มี use case — marketplace ไม่มีแชทในผลิตภัณฑ์ (§1.4)",
      "TreeList": "ไม่มีข้อมูลเชิงลำดับชั้นในระบบ — หมวดสินค้าใช้ CategoryNav (§1.4)",
      "CommandPalette": "เครื่องมือสำหรับ power user ของแอปเครื่องมือ ไม่ใช่ผู้ซื้อ SME (§1.4)",
      "Markdown": "เนื้อหาในระบบมาจาก CMS ที่ส่ง HTML แล้ว ไม่ใช่ markdown (§1.4)",
      "CodeBlock": "ไม่มีโค้ดให้แสดงในผลิตภัณฑ์ marketplace (§1.4)",
      "Citation": "ไม่มีการอ้างอิงแหล่งข้อมูลแบบวิชาการ (§1.4)",
      "Kbd": "ไม่มีคีย์ลัดที่ต้องสอนผู้ใช้ (§1.4)",
      "Blockquote": "ไม่มีการยกคำพูด — รีวิวผู้ซื้อใช้การ์ดของตัวเอง (§1.4)",
      "Carousel": "เลื่อนอัตโนมัติขัดกับ SC 2.2.2 · แกลเลอรีสินค้าใช้ ImageGallery (§1.4)",
      "HoverCard": "hover-only ใช้บนมือถือไม่ได้ ซึ่งเป็นอุปกรณ์หลักของระบบ (§1.4)",
      "Toolbar": "ไม่มีแถบเครื่องมือแบบแอปเครื่องมือ — คำสั่งอยู่ในการ์ดหรือเมนู (§1.4)",
      "MoreMenu": "ซ้ำกับ DropdownMenu + IconButton ที่มีอยู่ (§1.4)",
      "Outline": "สารบัญของเอกสารยาว ไม่มีในผลิตภัณฑ์ (§1.4)",
      "Resizable": "ไม่มีแผงที่ผู้ใช้ปรับขนาดได้ (§1.4)",
      "AppShell": "โครงหน้าเป็นหน้าที่ของแอป — ชั้น 05 Templates ไม่ทำ (คำตัดสิน 2026-07-29)",
      "Popover": "ตัดโดยเจตนา — Dialog ให้ที่เก็บเนื้อหาที่เปิดด้วยการกดและคุม focus ครบแล้ว (Tooltip.md §1)",
      "PowerSearch": "query builder แบบมี operator คนละอย่างกับช่องค้นหาของเรา — คง SearchField (D11)",
      "Lightbox": "overlay คนละอย่างกับ ImageGallery ที่ฝังในหน้า — ตัดแล้ว (§8.6)",
      "Toast": "ของเขาเป็นตัวข้อความ ส่วนของเราคุมที่ระดับ ToastRegion + 6 วินาทีที่ตรึงไว้ (D14)",
      "Text": "ข้อความในระบบใช้ utility `text-*` จากสเกลในชั้น 02 — การห่อเป็น component เพิ่มชั้นที่ไม่ตัดสินอะไร",
      "Heading": "หัวข้อใช้ `<h1>`–`<h6>` จริงพร้อม utility — component ที่รับ level เปิดทางให้ลำดับหัวข้อผิดง่ายกว่าเดิม",
      "Code": "ไม่มีโค้ดในผลิตภัณฑ์ (ดู CodeBlock)",
      "List": "รายการใช้ `<ul>`/`<ol>` จริง — ไม่มีการตัดสินใจเชิงออกแบบให้ห่อ",
      "Center": "จัดกึ่งกลางทำด้วย Stack/Grid ที่มีอยู่ — D22 ระบุว่าชั้น layout เป็นของเรา",
      "AspectRatio": "สัดส่วนภาพผูกกับ CardMedia และ utility `aspect-*` แล้ว (D22)",
      "Layout": "โครงหน้าเป็นหน้าที่ของแอป (ดู AppShell)",
      "Field": "สัญญาของช่องกรอกอยู่ใน LabelledFieldProps ที่ input ทุกตัว extend — ไม่ต้องมี wrapper",
      "FieldStatus": "สถานะเป็น prop `status` บนตัว input เอง ไม่ใช่ component แยก (§3.1)",
      "FormLayout": "การจัดวางฟอร์มใช้ Stack/Grid — ฟอร์มในระบบมีสองรูปแบบเท่านั้นและอยู่ใน 04-patterns",
      "InputGroup": "การรวมช่องกรอกทำด้วย Stack — ของเขาผูกกับ addon แบบที่ระบบนี้ไม่มี",
      "MultiSelector": "ยังไม่มี use case — ตัวกรองใช้ Token หลายตัว ซึ่งเห็นสิ่งที่เลือกทั้งหมดพร้อมกัน",
      "Tokenizer": "ช่องกรอกที่แปลงข้อความเป็น token ยังไม่มีที่ใช้ — ตัวกรองมาจากรายการที่กำหนดไว้",
      "ToggleButton": "สลับสองสถานะใช้ Switch (มีผลทันที) หรือ Token (ตัวกรอง) ตามเส้นแบ่งใน Switch.md",
      "SelectableCard": "การ์ดที่เลือกได้ทำด้วย Card `selected` + RadioList layout=card ที่มีอยู่",
      "ClickableCard": "การ์ดที่กดได้ทำด้วย Card `interactive` ที่มีอยู่",
      "Calendar": "ปฏิทินเปล่าไม่มีที่ใช้ — DateInput ใช้ BuddhistCalendar ของ RAC อยู่ข้างในแล้ว",
      "DateRangeInput": "ยังไม่มี use case — ตัวกรองวันใช้ค่าเดียว (วันปิดรับสมัคร)",
      "DateTimeInput": "ยังไม่มี use case — เวลาไม่มีผลกับกำหนดการรับสมัคร",
      "TimeInput": "ยังไม่มี use case (ดู DateTimeInput)",
      "Timestamp": "วันเวลาในระบบต้องเป็น พ.ศ. และมีความหมายเชิงกำหนดการ — DeadlineText คุมทั้งรูปแบบและสถานะ",
      "MobileNav": "drawer เลื่อนออกข้างคู่กับ SideNav — ของเราใช้แถบแท็บก้นจอ (BottomNav) ซึ่ง Astryx ไม่มี",
      "SideNav": "แถบข้างถาวรเป็นรูปแบบของแอปเครื่องมือ — marketplace ใช้ TopNav + CategoryNav",
      "NavItem": "ส่วนประกอบภายในของ SideNav/MobileNav ที่ไม่รับ",
      "NavIcon": "ส่วนประกอบภายในของ SideNav/MobileNav ที่ไม่รับ",
      "NavMenu": "ส่วนประกอบภายในของ SideNav/MobileNav ที่ไม่รับ",
      "Breadcrumbs": "รอบ grill 2026-07-26 ตัดออกเพราะซ้ำกับ CategoryBreadcrumb ที่ต่างกันแค่ aria-label",
      "OverflowList": "รายการที่ยุบเมื่อไม่พอที่ — ChipRow กับ CategoryNav จัดการกรณีของตัวเองอยู่แล้ว",
      "StatusDot": "ของเราคือ Dot ซึ่งบังคับ `label` เพราะจุดสีเดียวสื่อความหมายไม่ได้ (SC 1.4.1) — ชื่อเขาสื่อว่าสถานะอยู่ที่จุด",
      "Thumbnail": "ภาพย่อผูกกับ CardMedia และ Avatar ที่คุมสัดส่วนและ fallback ไว้แล้ว",
      "MetadataList": "ของเราแยกเป็น EntityMeta (ในการ์ด) กับ DescriptionList (ระดับหน้า) ตามคำตัดสิน 2026-07-26",
      "AvatarGroup": "ยังไม่มี use case — ผู้ขายแสดงทีละราย ไม่มีการซ้อนรูปหลายคน",
      "AlertDialog": "Dialog + footer ที่กำหนดปุ่มเองครอบคลุมแล้ว · การแยกชนิดเปิดทางให้ปุ่มยืนยันไม่สม่ำเสมอ",
      "ContextMenu": "เมนูคลิกขวาใช้บนมือถือไม่ได้ — คำสั่งต่อแถวใช้ DropdownMenu ที่กดได้จริง (Table.md §6)",
      "ButtonGroup": "ปุ่มที่อยู่ด้วยกันใช้ Stack — ของเขาผูกขอบปุ่มติดกันซึ่งลดเป้ากดที่ระบบนี้ตรึงไว้ (D1)",
      "VisuallyHidden": "ซ่อนด้วยตาแต่ให้ SR อ่านทำด้วยคลาส `sr-only` ที่ base.css คุมไว้ — และทุก component ที่ต้องใช้มี prop `isLabelHidden` ของตัวเองแล้ว (§8.1)"
  },
  "propsSkipAll": ["className", "as", "children"],
  "// parityScope": "ขอบเขตที่ gate บังคับ = ชื่อ component + prop สี่ตัวนี้เท่านั้น · ชื่อ prop นอกชุดนี้อยู่นอกขอบเขต (Icon.name vs icon → D37) — ถ้อยคำคำตัดสินข้อ 1 แก้ให้ตรงกับที่ทำจริงแล้ว",
  "parityScope": ["label", "isLabelHidden", "status", "isOptional"],
  "layerDiff": {
    "Tooltip": {
      "companion": "TooltipTrigger",
      "props": ["delay", "hideDelay", "isDefaultOpen", "isEnabled"]
    },
    "Dialog": {
      "companion": "DialogTrigger",
      "props": ["isOpen", "onOpenChange"]
    },
    "Token": {
      "companion": "RemovableChip",
      "props": ["onRemove"]
    },
    "DropdownMenu": {
      "companion": "DropdownMenuTrigger",
      "props": ["isMenuOpen", "onOpenChange", "button"]
    }
  },
  "propsOursOnly": {
    "Button": ["fullWidth", "iconPosition"],
    "IconButton": ["label", "size", "variant"],
    "Link": ["external", "quiet"],
    "FileInput": ["onRemove"],
    "Slider": ["minLabel", "maxLabel", "unit"],
    "Spinner": ["isLabelHidden"],
    "EmptyState": ["isLive"],
    "TabList": ["label", "isDisabled"],
    "DropdownMenu": ["width"],
    "CheckboxList": ["isOptional"],
    "Table": [
      "label", "rows", "rowKey", "columns", "sortBy", "sortDirection",
      "onSortChange", "rowAction", "rowActionLabel", "emptyState"
    ],
    "Card": ["selected", "elevation", "interactive"],
    "Badge": ["showIcon"],
    "Icon": ["name"],
    "Banner": ["isLive", "titleAs", "action", "tone"],
    "Dialog": ["footer", "size", "title", "hideClose"],
    "ProgressBar": ["note", "size", "unit", "unknownLabel", "format", "maxValue", "tone"],
    "Skeleton": ["lines", "shape"],
    "Grid": ["gutter", "preset"],
    "Typeahead": ["options"],
    "NumberInput": ["hideStepper", "suffix"],
    "TopNav": [
      "account", "cartCount", "homeHref", "logo", "mainId",
      "onOpenCart", "search", "signInHref"
    ]
  },
  "wontAdopt": {
    "_all": {
      "xstyle": "D6", "ref": "D6", "style": "D6", "width": "D6",
      "htmlName": "D15", "changeAction": "D8",
      "labelTooltip": "D16", "disabledMessage": "D16",
      "onEnter": "D16", "hasAutoFocus": "D16",
      "labelIcon": "D35"
    },
    "CheckboxInput": { "size": "D1", "isLoading": "D8" },
    "RadioList": { "size": "D1" },
    "TextArea": { "startIcon": "D17", "isLoading": "D17", "hasSpellCheck": "D17" },
    "Banner": { "defaultIsExpanded": "D13", "container": "D13", "status": "D36" },
    "Button": {
      "clickAction": "D8", "isInterruptible": "D8", "tooltip": "D19",
      "href": "D20", "target": "D20", "rel": "D20",
      "label": "D33", "isIconOnly": "D33", "endContent": "D33"
    },
    "IconButton": {
      "tooltip": "D19", "href": "D20", "target": "D20", "rel": "D20",
      "isLoading": "D21", "clickAction": "D21", "isInterruptible": "D21"
    },
    "Link": {
      "tooltip": "D19", "label": "D20", "color": "D20", "weight": "D20",
      "display": "D20", "type": "D20", "maxLines": "D20", "hasUnderline": "D20",
      "isExternalLink": "D34", "isStandalone": "D34"
    },
    "Tooltip": {
      "focusTrigger": "D21", "alignment": "D21",
      "anchorRef": "D21", "hasHoverIndication": "D21"
    },
    "ProgressBar": { "isIndeterminate": "D21" },
    "Grid": {
      "align": "D22", "columnGap": "D22", "columns": "D22", "gap": "D22",
      "height": "D22", "justify": "D22", "maxWidth": "D22",
      "minChildWidth": "D22", "minHeight": "D22", "rowGap": "D22",
      "rowHeight": "D22"
    },
    "Section": {
      "dividers": "D22", "height": "D22", "maxWidth": "D22",
      "minHeight": "D22", "padding": "D22", "paddingBlock": "D22",
      "variant": "D22"
    },
    "Divider": { "isFullBleed": "D22", "label": "D22", "variant": "D22" },
    "Card": {
      "width": "D2", "height": "D2", "maxWidth": "D2", "minHeight": "D2",
      "variant": "D29"
    },
    "Pagination": { "pageSizeOptions": "D27", "onPageSizeChange": "D27" },
    "Skeleton": { "radius": "D2", "height": "D30", "index": "D30" },
    "Token": {
      "href": "D20", "size": "D1", "color": "D5",
      "description": "D31", "endContent": "D31", "isLabelHidden": "D31"
    },
    "Dialog": {
      "isInline": "D21", "purpose": "D32", "padding": "D2",
      "maxHeight": "D2", "position": "D21"
    }
  }
}
```

---

## 5 · จุดที่ mapping ไม่สะอาด — ต้องตัดสินก่อนลงมือ

ต่อไปนี้คือที่ที่ "ชื่อคล้าย" หลอกตา ผมไม่ได้ตัดสินเอง ต้องการคำตอบก่อนแก้:

**5.1 `Alert` → `Banner` ไม่ใช่การ rename เฉย ๆ**
Astryx `Banner` มี `defaultIsExpanded` และ `container` — มันเป็น banner ระดับหน้าที่ยุบ/กางได้ ส่วน `Alert` ของเราถูกตัดสินไว้ว่าเป็น**ที่อยู่ของ error** (จากกฎ Toast รอบก่อน: "errors ใช้ Alert ไม่ใช่ Toast") ถ้ารับ `Banner` มาทั้งก้อนจะได้ component ที่ยุบข้อความ error ได้ ซึ่งขัดกับเหตุผลที่มันมีอยู่

**5.2 `Toast` ตรงกันแค่ชื่อ**
ของเรา export `ToastRegion` (มี prop เดียวคือ `className`) ส่วนของเขาเป็น `Toast` ตัวข้อความ (`body`, `isAutoHide`, `autoHideDuration`) คนละชั้นกันคนละเรื่อง และ `autoHideDuration` ของเขาเป็นอิสระ ส่วนเราตรึงไว้ที่ 6 วินาทีโดยเจตนา

**5.3 `label: string` บังคับ กับ `children`**
Astryx บังคับ `label` เป็น string เกือบทุก input (เพื่อการันตี a11y) เรารับ `children` เป็น ReactNode ซึ่งยืดหยุ่นกว่าแต่ปล่อยให้ผู้ใช้ลืม label ได้ — **ของเขาดีกว่าในแง่ a11y** แต่กระทบ call site ทุกจุดในระบบ ควรรับหรือไม่?

**5.4 `Card`: `elevation` + `interactive` → `variant` ตัวเดียว**
เรามีสองแกนอิสระ เขายุบเป็นแกนเดียว การยุบทำให้แสดง "card ที่ยกสูงแต่กดไม่ได้" ไม่ได้ ซึ่งขัดกับกฎในระบบเราที่ว่า "พื้นทึบ = กดได้" ต้องเช็คว่ามี call site ไหนใช้ combination ที่ variant เดียวแทนไม่ได้

**5.5 `Badge`: `label` string กับ `children`**
เหมือน 5.3 แต่เล็กกว่า — `Badge` ของเรามี `showIcon` ที่เขาไม่มี

**5.6 `SearchField` → `PowerSearch` — mapping นี้น่าจะผิด**
`PowerSearch` มี `config` `filters` `tokenOverflowBehavior` `maxOperatorMenuItems` `timezoneID` — เป็น query builder แบบมี operator ไม่ใช่ search field ธรรมดา ของเราคือช่องค้นหาเรียบ ๆ **ข้อเสนอ:** ไม่ map เข้า `PowerSearch` แต่คง `SearchField` ไว้เป็น SME.GO extension (เพิ่ม D11)

**5.7 `ImageGallery` → `Lightbox` ครึ่งเดียว**
`Lightbox` คือ overlay ที่เปิด/ปิด (`isOpen`, `onOpenChange`) ส่วน `ImageGallery` ของเราคือ gallery ฝังในหน้า ของเขาที่ใกล้กว่าคือ `Carousel` ซึ่ง §1.4 ไม่รับไว้ อาจต้องแยกเป็นสองตัว หรือคง `ImageGallery` เป็น extension

**5.8 `AppHeader` → `TopNav` prop ไม่ตรงเลยสักตัว**
`TopNav` เป็น shell เปล่า (`startContent`/`centerContent`/`endContent`) ส่วน `AppHeader` ของเรารู้เรื่อง marketplace (`cartCount`, `signInHref`, `search`) **ข้อเสนอ:** rename เป็น `TopNav` ไม่ได้ ควรคง `AppHeader` ไว้แล้วให้มัน *compose* จาก `TopNav` ถ้าจะสร้าง `TopNav` — แต่ §1.3 ไม่ได้รวม `TopNav` ไว้ในตัวที่จะสร้าง จึงเสนอ: ตัด `AppHeader→TopNav` ออกจาก §1.2

**5.9 `Spinner` กับ `Skeleton` ทับกัน**
รอบก่อนตัดสินว่า `Skeleton` คือ loading pattern หลัก การเพิ่ม `Spinner` ต้องมาพร้อมกฎแบ่งเขต (เสนอ: Skeleton = โหลดเนื้อหาที่รู้รูปร่าง · Spinner = การกระทำที่รอผลโดยไม่รู้เวลา เช่นปุ่มกำลัง submit) มิฉะนั้นจะได้ปัญหาเดียวกับ capsule สี่ตัว

---

## 6 · ขนาดงานถ้าอนุมัติ

| เฟส | งาน | สถานะ |
|---|---|---|
| 1 | pin `@astryxdesign/core@0.1.8` (exact) + เขียน `lint/lint-parity.mjs` + `npm run lint:parity` | ✅ เสร็จ |
| 2 | token: `radius-sm` 6→4 | ✅ เสร็จ |
| 3 | rename 14 ตัว (`SearchField`, `ImageGallery` ตัดออก) + prop rename ตาม §3 + `label: string` (§8.1) — **หักดิบ ไม่มี `@deprecated` alias** (§8 · 0.2.0) | ✅ เสร็จ 14/14 · **ขยับเป็น 0.2.0 แล้วเมื่อ 2026-07-29** พร้อม [CHANGELOG](03-components/CHANGELOG.md) ⚠️ ครึ่งหลังของข้อตกลงนี้ค้างอยู่หลายวัน — เอกสารติด ✅ ว่าหักดิบแล้วแต่ `package.json` ยัง 0.1.0 และไม่มีเกตไหนตรวจว่าการหัก API ต้องมาพร้อมการขยับเวอร์ชัน |
| 4 | อัปเดต `.md` คู่ + gallery + e2e fixture | ✅ เสร็จควบคู่กับเฟส 3 ทีละตัว |
| 5 | สร้าง 6 component ใหม่ + `.md` + a11y test | ✅ เสร็จ 6/6 |
| 6 | **ต่อ `lint:parity` เข้า `npm run verify`** + รัน verify ทั้งชุด | ✅ เสร็จ — เพดานนับถอยหลัง (ดู §4.1) |

**เกตเดียว:** `npm run verify` (typecheck · lint · test · e2e · validate-tokens · **lint:parity ที่เพดานนับถอยหลัง**) — ผ่านทั้งหมดหลังเฟส 3/4/6

### 6.1a · ความคืบหน้าเฟส 3

| # | rename | สถานะ | หมายเหตุ |
|---|---|---|---|
| 1 | `TextField` → `TextInput` | ✅ | + `status` · `isLabelHidden` · `startIcon` · `isLoading` · `hasClear` |
| 2 | `Textarea` → `TextArea` | ✅ | แยกเป็นไฟล์ของตัวเอง + `TextArea.md` ใหม่ |
| 3 | `Checkbox` → `CheckboxInput` | ✅ | `children` → `label: string` บังคับ + `isLabelHidden` (§8.1) — `CheckboxList` คงเดิม (มี `label` อยู่แล้ว) |
| 4 | `RadioGroup` → `RadioList` | ✅ | `errorMessage`→`status` · `showOptional`→`isOptional` — `Radio` (item) คงเดิม `children` ไม่เปลี่ยน · `Payment.tsx` ตามไปแก้ internal call site |
| 5 | `Select` → `Selector` | ✅ | `errorMessage`→`status` · `showOptional`→`isOptional` — `SelectItem`/`SelectOption` คงชื่อเดิม (ใช้ร่วมกับ `Typeahead`) |
| 6 | `ComboBox` → `Typeahead` | ✅ | `errorMessage`→`status` · `showOptional`→`isOptional` — `options` คงเป็น ours-only (ไม่รับ `searchSource` async ของ Astryx) |
| 7 | `NumberField` → `NumberInput` | ✅ | `errorMessage`→`status` · `showOptional`→`isOptional` — `hideStepper`/`suffix` คงเป็น ours-only · `Cart.tsx`/`BuyBox.tsx` ตามไปแก้ internal call site |
| 8 | `DatePicker` → `DateInput` | ✅ | `errorMessage`→`status` · `showOptional`→`isOptional` — ชื่อชนกับ `DateInput` ของ RAC เอง (segment ภายใน) → alias เป็น `RACDateInput` ในโค้ด |
| 9 | `FileUpload` → `FileInput` | ✅ | `files`→`value` · `onSelect`→`onChange` · `multiple`→`isMultiple` · `maxSizeMb`→`maxSize` — `onRemove` คงเป็น ours-only |
| 10 | `RangeSlider` → `Slider` | ✅ | `minValue`→`min` · `maxValue`→`max` — `minLabel`/`maxLabel`/`unit` คงเป็น ours-only · e2e fixture (`app.tsx`) ตามไปแก้ |
| 11 | `Chip` → `Token` | ✅ | `children`→`label: string` บังคับ (§8.1) — ไม่ใช่ component ใหม่ข้าง Chip (§1.4 D9) · `RemovableChip`/`ChipRow` คงเดิม |
| 12 | `Accordion` → `Collapsible` | ✅ | เฉพาะกลุ่ม — ไม่มี prop rename · `AccordionItem` คงชื่อเดิม |
| 13 | `Alert` → `Banner` | ✅ | เปลี่ยนชื่ออย่างเดียว (§8.4/D13) — ไม่รับ `defaultIsExpanded`/`container` · `alert.test.tsx`→`banner.test.tsx`, `alert.spec.ts`→`banner.spec.ts` |
| 14 | `AppHeader` → `TopNav` | ✅ | เพิ่ม slot props ของ Astryx (`heading` `startContent` `centerContent` `endContent` `label`) เป็นส่วนเสริม (§8.3 · D12) — คง 9 props เดิมไว้ทั้งหมด |
| 15 | ~~`ImageGallery` → `Lightbox`~~ | ✅ **ตัดออก** | คนละ component (§8.6 · D23) — คง `ImageGallery` เป็น SME.GO extension แทน |

**งานข้างเคียงที่เกิดขึ้นจริงในสองตัวแรก** (คาดว่าจะซ้ำกับตัวที่เหลือ):
`fieldStyles` ย้ายออกจาก `TextField.tsx` มาเป็น `inputs/fieldStyles.ts` — เดิม Select · ComboBox · NumberField · DatePicker · SearchField ทั้งห้าตัว `import { fieldStyles } from './TextField'` ซึ่งผูกกับไฟล์ของ component อื่นโดยไม่มีเหตุผล

### 6.2 · baseline ตอนจบเฟส 2

```
lint:parity   ✗ 57 ข้อ  (= worklist เฟส 3–5 · 15 rename · 6 สร้างใหม่ · 24 prop diff)
typecheck     ✓
lint          ✓ error 0 · warn 1 (h-12 ใน OTPField — มีอยู่ก่อนแล้ว)
test          ✓ 207/207
test:e2e      ✓ 40/40
validate-tokens ✓ ทุกข้อ
```

### 6.4 · baseline ตอนจบเฟส 5 (สร้างครบ 6/6)

```
lint:parity   ✓ คงที่ที่เพดาน 23 — เทียบกับ Astryx 0.1.8
typecheck     ✓
lint          ✓ error 0 · warn 1 (h-12 ใน OTPField — มีอยู่ก่อนแล้ว)
test          ✓ 307/307  (เพิ่ม 99 ข้อจากเฟส 5)
test:e2e      ✓ 40/40
validate-tokens ✓ ทุกข้อ
```

component ใหม่ทั้ง 6 ตัว: `Spinner` · `Avatar` · `EmptyState` · `Pagination` ·
`TabList` (+`Tab`/`TabPanel`) · `SegmentedControl` (+`SegmentedControlItem`)

#### ⚠️ ทำไมเพดานยังลบทิ้งไม่ได้

§4.1 บอกว่าพอเพดานถึง `0` ให้ลบกลไกนี้ — **ยังไม่ถึง** เพราะ 23 ข้อที่เหลือ
**ไม่ใช่ component ที่ขาด** แต่เป็น *"ขาด prop ที่ Astryx มี"* บน component
เดิม 23 ตัว (`Button` `Switch` `Selector` `Typeahead` …) รวมประมาณ 100 prop

นั่นคือ **การตัดสินใจว่าจะรับ prop ไหนบ้าง** ไม่ใช่งานเขียนโค้ด — ต้องอ่าน
ทีละตัวแล้วเลือกระหว่าง "รับเข้ามา" กับ "ใส่ `wontAdopt` พร้อมรหัส D"
เป็นงานคนละก้อนกับเฟส 5 และควรทำเป็นรอบของตัวเอง

### 6.3 · baseline ตอนจบเฟส 3/4/6 (rename ครบ 14/14)

```
lint:parity   ✓ คงที่ที่เพดาน 29 — เทียบกับ Astryx 0.1.8 (ต่อเข้า verify แล้ว)
typecheck     ✓
lint          ✓
test          ✓ 208/208
test:e2e      ✓ 40/40
validate-tokens ✓ ทุกข้อ
```

เพดานลดจาก 51 (baseline `d4f3ecd`) → **29** ตลอดรอบ rename — เหลือแต่งาน**เฟส 5** (สร้าง 6 component ใหม่: `EmptyState` `Pagination` `Avatar` `Spinner` `Tabs` `SegmentedControl`) ก่อนจะลบกลไกเพดานทิ้งได้ตาม §4.1

---

## 7 · ความเสี่ยงที่ต้องรับรู้

1. **Astryx เป็น 0.1.x** — break ได้ทุก minor และปล่อย canary วันละหลายครั้ง สิ่งที่เรา align วันนี้คือ snapshot ที่ pin ไว้ ไม่ใช่มาตรฐานที่นิ่ง การ upgrade แต่ละครั้งจะกลายเป็น diff ที่ต้องอ่านและตัดสินใหม่ — parity script ทำให้ diff นั้นมองเห็นได้ แต่ไม่ได้ทำให้มันหายไป
2. **StyleX vs Tailwind** — ค่าตัวเลขทุกค่าต้อง assert ด้วยมือ automation ครอบได้แค่ชื่อ
3. **rename 14 ตัวพร้อมกัน** — `Textarea` → `TextArea` ต่างแค่ case เป็นจุดที่ tooling บน macOS (case-insensitive filesystem) พลาดได้เงียบ ๆ ต้องเช็คเป็นพิเศษ
4. **ประโยชน์ที่ได้จริง** ควรพูดตรง ๆ: เราไม่ได้ใช้โค้ด Astryx เลยสักบรรทัด สิ่งที่ได้คือ**คำศัพท์ร่วม** — คนที่เคยใช้ Astryx อ่านโค้ดเราออกเร็วขึ้น และเวลาถกกันเรื่อง component จะอ้างอิงชื่อกลางได้ ส่วนที่**ไม่ได้**คือความถูกต้องเพิ่มขึ้นหรือบั๊กน้อยลง งานนี้จึงคุ้มถ้าเป้าหมายคือ vocabulary ไม่คุ้มถ้าคาดหวังคุณภาพโค้ด

---

## 8 · คำตัดสิน (2026-07-28)

**8.1 · §5.3 — รับ `label: string` บังคับ** ✅ *(ทำครบจริง 2026-07-28)*

> ⚠️ **หมายเหตุ**: หัวข้อนี้ติด ✅ ไว้ตั้งแต่แรกทั้งที่ทำจริงแค่ **4 จาก 13 ตัว**
> — `isLabelHidden` มีอยู่แค่ `TextInput` `TextArea` `CheckboxInput` `RadioList`
> ส่วน `Switch` ยังรับ `children` โดยไม่มี `label` เลย · สาเหตุคือแต่ละ component
> ประกาศ prop สี่ตัวนี้เองแยกกัน จึงไม่มีที่ไหนที่วัดได้ว่าครบทั้งก้อน
> (D24 ยังเคยอ้างหัวข้อนี้เป็นเหตุผลตอนที่มันจริงแค่ 2 ตัว)
>
> แก้เชิงโครงสร้างแล้ว: prop สี่ตัวนี้อยู่ใน **`LabelledFieldProps` ที่เดียว**
> (`fieldStyles.ts`) และ input ทุกตัว extend ชั้นนั้น — ลืมไม่ได้ในระดับ type
> ส่วน `parityScope` ใน §4.1 ทำให้ gate ฟ้องถ้าตัวไหนยังขาด

input ทุกตัวเปลี่ยนจาก `children: ReactNode` เป็น `label: string` บังคับ พร้อม `isLabelHidden?: boolean` สำหรับกรณีที่ต้องซ่อนด้วยตา แต่ยังต้องมีให้ screen reader — เป็นการรับกฎของ Astryx ที่ **a11y ดีกว่าของเดิมจริง** ไม่ใช่แค่การเปลี่ยนชื่อ

กระทบ: `TextField` `Textarea` `Checkbox` `RadioGroup` `Switch` `Select` `ComboBox` `NumberField` `DatePicker` `FileUpload` `RangeSlider` `Badge` `Chip` — และ call site ทุกจุดในกลุ่ม marketplace 18 ไฟล์ ต้องรัน a11y test ซ้ำหลังแก้ เพราะนี่คือการเปลี่ยน accessible name ของทุก control ในระบบ

**8.2 · §5.6 — ตัด `SearchField` ออกจาก rename** ✅

`PowerSearch` เป็น query builder คนละอย่างกัน `SearchField` คงชื่อเดิมเป็น SME.GO extension → **D11**

**8.3 · §5.8 — `AppHeader` → `TopNav` ยังคง rename** ✅ (ไม่ตัด)

ใช้กฎเดียวกับ variant (rename ที่ตรง เก็บส่วนเกิน): `TopNav` **รับ slot props ของ Astryx** — `heading` `startContent` `centerContent` `endContent` `label` — เพิ่มเข้ามา และ **คง 9 props ของ marketplace ไว้ทั้งหมด** (`cartCount` `search` `signInHref` `account` `homeHref` `logo` `onOpenCart` `mainId` `className`) ในฐานะ extension ไม่ใช่การทิ้ง API เดิมแล้วเหลือ shell เปล่า → **D12**

**8.4 · §5.1 / §5.2 — รับแค่ชื่อ ไม่รับ API** ✅

- `Alert` → `Banner`: rename อย่างเดียว **ไม่รับ** `defaultIsExpanded` และ `container` เพราะ Banner ที่ยุบข้อความ error ได้ขัดกับกฎ "errors ใช้ Alert ไม่ใช่ Toast" ที่ตัดสินไว้รอบ 2026-07-26 → **D13**
- `Toast`: `ToastRegion` **คงชื่อและ API เดิม** ไม่รับ `autoHideDuration` เพราะ 6 วินาทีถูกตรึงไว้โดยเจตนา และของเขาเป็นคนละชั้น (ตัวข้อความ ไม่ใช่ region) → **D14**

**8.5 · §5.9 — กฎแบ่งเขต Spinner / Skeleton** ✅

| | ใช้เมื่อ |
|---|---|
| `Skeleton` | โหลดเนื้อหาที่**รู้รูปร่างล่วงหน้า** — การ์ด รายการ ตาราง |
| `Spinner` | การกระทำที่**รอผลโดยไม่รู้เวลา** — ปุ่มกำลัง submit, ยืนยันการชำระเงิน |

ห้ามใช้ `Spinner` แทนการโหลดเนื้อหา และห้ามใช้ `Skeleton` กับการกระทำ กฎนี้ต้องเขียนลงทั้ง `Skeleton.md` และ `Spinner.md` แบบอ้างถึงกัน เหมือนที่ `Badge.md`/`Chip.md` ทำ

**8.6 · §5.7 — ตัด `ImageGallery` ออกจาก rename** ✅

`ImageGallery` **ไม่ rename** เป็น `Lightbox` — คนละ component กันจริง: `Lightbox` ของ Astryx เป็น overlay ที่เปิด/ปิด (`isOpen`/`onOpenChange`) ส่วน `ImageGallery` ของเราคือ gallery ที่ฝังอยู่ในหน้า ไม่มี concept เปิด/ปิด ตัวที่ใกล้เคียงกว่าคือ `Carousel` ของ Astryx ซึ่ง §1.4 ตัดสินไปแล้วว่าไม่รับเข้าระบบ (ไม่มี template ที่ต้องใช้) → คง `ImageGallery` เป็น **SME.GO extension** แทนการสร้าง `Lightbox` ใหม่แยกต่างหากหรือบังคับ rename แบบผิดความหมาย → **D23**

### 8.7 · สรุปผลต่อขอบเขต

| | ก่อน | หลัง |
|---|---|---|
| rename | 16 | **14** (ตัด `SearchField`, `ImageGallery`) |
| divergence | D1–D10 | **D1–D18** |
| งานเพิ่มที่ไม่ได้อยู่ในประมาณการเดิม | — | `label: string` ทั่วทั้งระบบ + a11y test ซ้ำทุก control |
