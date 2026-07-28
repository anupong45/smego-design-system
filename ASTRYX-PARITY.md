# ASTRYX-PARITY

การเทียบ `@smego/ui` กับ Astryx design system ของ Meta — mapping, prop diff, token diff และรายการ divergence ที่จงใจไม่ตรง

| | |
|---|---|
| อ้างอิง Astryx | `@astryxdesign/core@0.1.8` (pinned — ไม่ใช่ canary) |
| อ้างอิงเรา | `@smego/ui@0.1.0` · 03-components · 02-tokens |
| วันที่ | 2026-07-27 |
| สถานะ | **อนุมัติแล้ว 2026-07-28** — ดู §8 สำหรับคำตัดสิน 5 ข้อ |

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
| `Select` | `Selector` | |
| `ComboBox` | `Typeahead` | |
| `NumberField` | `NumberInput` | |
| ~~`SearchField`~~ | ~~`PowerSearch`~~ | ❌ **ตัดออกแล้ว** (§8.2 · D11) — คนละ component |
| `DatePicker` | `DateInput` | |
| `FileUpload` | `FileInput` | |
| `RangeSlider` | `Slider` | |
| `Chip` | `Token` | |
| `Accordion` | `Collapsible` | |
| `ImageGallery` | `Lightbox` | ⚠️ ดู §5.7 |
| `Alert` | `Banner` | |
| `AppHeader` | `TopNav` | ⚠️ ดู §5.8 |

### 1.3 สร้างเพิ่ม 6 ตัว

| ตัวใหม่ | ชื่อ Astryx | เหตุผลจากโค้ดจริง |
|---|---|---|
| `EmptyState` | `EmptyState` | empty state ถูก hand-roll ใน **8 ไฟล์** (Cart, Wishlist, SearchResult, Checkout, Payment, ProductCard, OrderTimeline, Compare) |
| `Pagination` | `Pagination` | มี `SearchResult` แต่ **ไม่มี pagination เลยทั้งระบบ** |
| `Avatar` | `Avatar` | `SellerProfile` วาด avatar เอง |
| `Spinner` | `Spinner` | ⚠️ ต้องนิยามเขตแดนกับ `Skeleton` ก่อน — ดู §5.9 |
| `Tabs` | `TabList` | |
| `SegmentedControl` | `SegmentedControl` | |

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
| TextField→TextInput | 10 | `errorMessage`→`status` · `showOptional`→`isOptional` | `prefix` | `isLabelHidden` `isLoading` `hasClear` `startIcon` `width` `labelTooltip` `onEnter` `htmlName` `changeAction` `disabledMessage` `hasAutoFocus` |
| Textarea→TextArea | 13 | เหมือนบน | — | `hasSpellCheck` + ชุดเดียวกับบน |
| Checkbox→CheckboxInput | 8 | — | `children` | `label` `isLabelHidden` `size` `status` `labelIcon` `width` `isOptional` `isLoading` `htmlName` `changeAction` `disabledMessage` |
| RadioGroup→RadioList | 8 | `errorMessage`→`status` · `showOptional`→`isOptional` | — | `isLabelHidden` `size` `width` `labelTooltip` `htmlName` `disabledMessage` |
| Switch | 6 | — | `align` `children` | `label` `labelPosition` `labelSpacing` `isLabelHidden` `status` `width` + 8 |
| Select→Selector | 9 | `errorMessage`→`status` · `showOptional`→`isOptional` | — | `hasSearch` `hasClear` `renderOption` `placement` `startIcon` `isDefaultOpen` + 8 |
| ComboBox→Typeahead | 9 | เหมือนบน | `options` | `searchSource` `debounceMs` `renderItem` `maxMenuItems` `emptySearchResultsText` `onChangeQuery` + 8 |
| NumberField→NumberInput | 11 | เหมือนบน | `hideStepper` `suffix` | `min` `max` `units` `isIntegerOnly` `hasClear` `startIcon` + 10 |
| SearchField→PowerSearch | 8 | `errorMessage`→`status` · `labelHidden`→`isLabelHidden` | `description` | `config` `filters` `components` `resultCount` `maxTokenLength` `timezoneID` + 10 |
| DatePicker→DateInput | 6 | `errorMessage`→`status` · `showOptional`→`isOptional` | — | `min` `max` `dateConstraints` `numberOfMonths` `hasClear` `placeholder` + 7 |
| FileUpload→FileInput | 4 | `files`→`value` · `onSelect`→`onChange` · `multiple`→`isMultiple` · `maxSizeMb`→`maxSize` | `onRemove` | `maxFiles` `mode` `status` `isLoading` + 8 |
| RangeSlider→Slider | 5 | `minValue`→`min` · `maxValue`→`max` | `minLabel` `maxLabel` `unit` | `marks` `valueDisplay` `formatValue` `onChangeEnd` `minStepsBetweenThumbs` `orientation` + 9 |
| Card | 3 | `elevation`+`interactive`→`variant` | `as` `selected` | `width` `height` `maxWidth` `minHeight` |
| Badge | 2 | — | `children` `showIcon` | `label` |
| Chip→Token | 3 | — | `children` | `label` `size` `color` `onRemove` `href` `endContent` `description` `isLabelHidden` |
| Accordion→Collapsible | 2 | — | — | `trigger` `isOpen` `defaultIsOpen` `onOpenChange` `value` |
| ImageGallery→Lightbox | 0 | `images`→`media` | `itemName` | `isOpen` `index` `defaultIndex` `onIndexChange` `onOpenChange` `hasZoom` `hasAutoPlay` |
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
| D22 | layout layer แยกทาง — ไม่รับ props ที่ขาดทั้งหมดของ `Grid` (11) `Section` (7) `Divider` (3) และคง `gutter`/`preset` ของเราไว้ | เหตุผลเดียวกับที่ปฏิเสธ control height ใน §2.4: ชั้น layout คือภาษารูปทรงของเรา ไม่ใช่ของ Meta · Astryx ให้ `columns`/`gap` ดิบให้ call site ตัดสินเอง เราให้ `preset` ที่ตัดสินใจแทนไปแล้ว การรับทั้งสองแบบพร้อมกันคือการมีสองวิธีทำสิ่งเดียวกัน |

#### รับเข้ามา — ยังไม่ลงมือ (ไม่เข้า allowlist)

ห้าตัวนี้ **รับ** แล้วในเชิงคำตัดสิน แต่โค้ดยังไม่แก้ จึงยังฟ้องอยู่ใน `lint:parity` ตามเจตนา — ห้ามใส่ใน `wontAdopt` เพราะจะกลบงานที่ยังไม่ได้ทำ:

| prop | สถานะ | หมายเหตุ |
|---|---|---|
| `IconButton`: `name` → `icon` | รับ — ยังไม่ลงมือ | rename ชุดเดียวกับ `Icon.name` → `icon` (§3) ทำพร้อมกันทีเดียว |
| `Link.isStandalone` | รับ — ยังไม่ลงมือ | ลิงก์ที่ยืนเดี่ยวนอกย่อหน้าต้องการ hit area ของตัวเอง เป็นข้อมูลที่ call site รู้เท่านั้น |
| `Link.isExternalLink` | รับ — ยังไม่ลงมือ | rename จาก `external` ของเรา งานเดียวกัน คนละชื่อ |
| `Link.newTabLabel` | รับ — ยังไม่ลงมือ | คู่กับ `isExternalLink` — คำเตือน "เปิดในแท็บใหม่" ต้องแปลไทยได้ |
| `Tooltip.content` (แทน `children` ที่เป็นเนื้อ tooltip) | รับ — ยังไม่ลงมือ | แยกเนื้อ tooltip ออกจาก trigger ชัดกว่าเดิม |

#### prop ที่เราเกิน — `propsOursOnly` รอบนี้

| component | prop | ทำไมเก็บไว้ |
|---|---|---|
| `Switch` | `align` | ป้ายของ switch ในฟอร์ม marketplace ยาวหลายบรรทัด ต้องเลือกได้ว่าหัวสวิตช์ชิดบนหรือกึ่งกลาง — Astryx ให้แต่ `labelPosition` ซึ่งเป็นแกนซ้าย/ขวา คนละแกนกัน |
| `Card` | `elevation` · `interactive` | สองแกนอิสระตาม §5.4 · `variant` ตัวเดียวของ Astryx เขียน "ยกสูงแต่กดไม่ได้" ไม่ได้ ซึ่งขัดกฎ "พื้นทึบ = กดได้" ของระบบ |
| `Skeleton` | `shape` | คู่กับ `lines` — รูปทรงของ placeholder ผูกกับ `--radius-*` ของเรา ไม่ใช่ `radius` ดิบแบบ Astryx (D2) |
| `ProgressBar` | `format` · `maxValue` · `tone` | ชื่อเดิมของเราสำหรับสิ่งที่ Astryx เรียก `formatValueLabel` / `max` / `variant` (§3) ยังไม่ rename จึงยังนับเป็นเกิน |
| `Grid` | `gutter` · `preset` | D22 — `preset` คือการตัดสินใจเรื่องคอลัมน์ที่ทำแทน call site ไปแล้ว `gutter` ผูกกับ `--sme-space-unit` |
| `Dialog` | `hideClose` | ชื่อเดิมของเราสำหรับสิ่งที่ Astryx เรียก `purpose` (§3) — `purpose` ของเขาพ่วงความหมายอื่นมาด้วย ของเราคุมแค่ปุ่มปิด |

`Icon.name` ไม่ใส่ในลิสต์นี้ เพราะจะหายไปเองตอน rename เป็น `icon`

> **หมายเหตุ `Tooltip`** — `delay` `hideDelay` `isDefaultOpen` `isEnabled` ที่ `lint:parity` ฟ้องว่าขาดเป็น **false positive** เรามีครบแล้วแต่อยู่บน `TooltipTrigger` (RAC ให้ `delay` / `closeDelay` / `isDisabled` / `defaultOpen`) เป็น**ความต่างเชิงชั้น** ไม่ใช่ prop ที่ขาด — ตรวจที่ `TooltipTrigger` ไม่ใช่ที่ `Tooltip` · ไม่ใส่ใน `wontAdopt` เพราะนั่นแปลว่า "มีแล้วไม่เอา" ส่วนนี่คือ "มีแล้ว แต่คนละที่" (แก้ที่ `layerDiff` ของ linter)

### 4.1 · รูปแบบที่เครื่องอ่าน

`02-tokens/lint-parity.mjs` อ่านบล็อกนี้ ไม่ได้อ่านตารางข้างบน — ตารางไว้ให้คนอ่าน บล็อกนี้ไว้ให้เครื่อง **แก้ทั้งคู่เสมอ**

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
  "astryxVersion": "0.1.8",
  "maxProblems": 43,
  "rename": {
    "TextField": "TextInput",
    "Textarea": "TextArea",
    "RadioGroup": "RadioList",
    "Select": "Selector",
    "ComboBox": "Typeahead",
    "NumberField": "NumberInput",
    "DatePicker": "DateInput",
    "FileUpload": "FileInput",
    "RangeSlider": "Slider",
    "Chip": "Token",
    "Accordion": "Collapsible",
    "ImageGallery": "Lightbox",
    "Alert": "Banner",
    "AppHeader": "TopNav"
  },
  "same": [
    "Button", "IconButton", "Link", "Switch", "Card", "Badge", "Dialog",
    "Tooltip", "Skeleton", "ProgressBar", "Icon", "Grid", "Stack",
    "Section", "Divider", "EmptyState", "Pagination", "Avatar", "Spinner",
    "SegmentedControl", "CheckboxInput"
  ],
  "renameNewBuild": { "Tabs": "TabList" },
  "extension": [
    "SearchField", "OTPField", "DescriptionList", "ToastRegion",
    "CategoryNav", "CategoryBreadcrumb", "Deadline", "GrantCard", "BuyBox",
    "Checkout", "Payment", "Compare", "SellerProfile", "OrderTimeline",
    "ProductCard", "ProgramCard", "ServiceCard", "TrainingCard",
    "FundingCard", "BusinessCard", "EntityCard", "SearchResult",
    "FilterPanel", "Cart", "Wishlist", "Container", "SmeGoProvider"
  ],
  "propsSkipAll": ["className", "as", "children"],
  "layerDiff": {
    "Tooltip": {
      "companion": "TooltipTrigger",
      "props": ["delay", "hideDelay", "isDefaultOpen", "isEnabled"]
    }
  },
  "propsOursOnly": {
    "Button": ["fullWidth", "iconPosition"],
    "IconButton": ["label", "size", "variant"],
    "Link": ["external", "quiet"],
    "TextInput": ["prefix"],
    "FileInput": ["onRemove"],
    "Slider": ["minLabel", "maxLabel", "unit"],
    "Switch": ["align"],
    "CheckboxInput": ["labelContent"],
    "RadioList": ["labelContent"],
    "Card": ["selected", "elevation", "interactive"],
    "Badge": ["showIcon"],
    "Banner": ["isLive", "titleAs"],
    "Dialog": ["footer", "size", "title", "hideClose"],
    "ProgressBar": ["note", "size", "unit", "unknownLabel", "format", "maxValue", "tone"],
    "Skeleton": ["lines", "shape"],
    "Grid": ["gutter", "preset"],
    "Typeahead": ["options"],
    "NumberInput": ["hideStepper", "suffix"],
    "Lightbox": ["itemName"],
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
      "onEnter": "D16", "hasAutoFocus": "D16"
    },
    "TextArea": { "startIcon": "D17", "isLoading": "D17", "hasSpellCheck": "D17" },
    "Banner": { "defaultIsExpanded": "D13", "container": "D13" },
    "Button": {
      "clickAction": "D8", "isInterruptible": "D8", "tooltip": "D19",
      "href": "D20", "target": "D20", "rel": "D20"
    },
    "IconButton": {
      "tooltip": "D19", "href": "D20", "target": "D20", "rel": "D20",
      "isLoading": "D21", "clickAction": "D21", "isInterruptible": "D21"
    },
    "Link": {
      "tooltip": "D19", "label": "D20", "color": "D20", "weight": "D20",
      "display": "D20", "type": "D20", "maxLines": "D20", "hasUnderline": "D20"
    },
    "Tooltip": {
      "focusTrigger": "D21", "alignment": "D21",
      "anchorRef": "D21", "hasHoverIndication": "D21"
    },
    "ProgressBar": { "isIndeterminate": "D21" },
    "Dialog": { "isInline": "D21" },
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
    "Card": { "width": "D2", "height": "D2", "maxWidth": "D2", "minHeight": "D2" }
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
| 1 | pin `@astryxdesign/core@0.1.8` (exact) + เขียน `02-tokens/lint-parity.mjs` + `npm run lint:parity` | ✅ เสร็จ |
| 2 | token: `radius-sm` 6→4 | ✅ เสร็จ |
| 3 | rename 15 ตัว + prop rename ตาม §3 + `label: string` (§8.1) + `@deprecated` alias | 🔄 2/15 |
| 4 | อัปเดต `.md` คู่ + 04-patterns (5 ไฟล์) + gallery + e2e fixture | ⬜ |
| 5 | สร้าง 6 component ใหม่ + `.md` + a11y test | ⬜ |
| 6 | **ต่อ `lint:parity` เข้า `npm run verify`** + รัน verify ทั้งชุด | ⬜ |

**เกตเดียว:** `npm run verify` (typecheck · lint · test · e2e · validate-tokens · **parity ใหม่ในเฟส 6**)

### 6.1 · หนี้ที่ต้องปิดในเฟส 6

`lint:parity` **ยังไม่ได้ต่อเข้า `verify`** โดยตั้งใจ — ตอนนี้มันฟ้อง 57 ข้อซึ่งคือ worklist ของเฟส 3–5 พอดี ถ้าต่อเข้า verify ตอนนี้ build จะแดงตลอดทางจนไม่มีใครอ่านมัน ต้องต่อเมื่อเฟส 5 จบ บรรทัดที่ต้องแก้:

```
"verify": "... && node ../02-tokens/validate-tokens.js && npm run lint:parity"
```

### 6.1a · ความคืบหน้าเฟส 3

| # | rename | สถานะ | หมายเหตุ |
|---|---|---|---|
| 1 | `TextField` → `TextInput` | ✅ | + `status` · `isLabelHidden` · `startIcon` · `isLoading` · `hasClear` |
| 2 | `Textarea` → `TextArea` | ✅ | แยกเป็นไฟล์ของตัวเอง + `TextArea.md` ใหม่ |
| 3 | `Checkbox` → `CheckboxInput` | ✅ | `children` → `label: string` บังคับ + `isLabelHidden` (§8.1) — `CheckboxGroup` คงเดิม (มี `label` อยู่แล้ว) |
| 4–15 | ที่เหลือ | ⬜ | `RadioGroup` `Select` `ComboBox` `NumberField` `DatePicker` `FileUpload` `RangeSlider` `Chip` `Accordion` `ImageGallery` `Alert` `AppHeader` |

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

---

## 7 · ความเสี่ยงที่ต้องรับรู้

1. **Astryx เป็น 0.1.x** — break ได้ทุก minor และปล่อย canary วันละหลายครั้ง สิ่งที่เรา align วันนี้คือ snapshot ที่ pin ไว้ ไม่ใช่มาตรฐานที่นิ่ง การ upgrade แต่ละครั้งจะกลายเป็น diff ที่ต้องอ่านและตัดสินใหม่ — parity script ทำให้ diff นั้นมองเห็นได้ แต่ไม่ได้ทำให้มันหายไป
2. **StyleX vs Tailwind** — ค่าตัวเลขทุกค่าต้อง assert ด้วยมือ automation ครอบได้แค่ชื่อ
3. **rename 14 ตัวพร้อมกัน** — `Textarea` → `TextArea` ต่างแค่ case เป็นจุดที่ tooling บน macOS (case-insensitive filesystem) พลาดได้เงียบ ๆ ต้องเช็คเป็นพิเศษ
4. **ประโยชน์ที่ได้จริง** ควรพูดตรง ๆ: เราไม่ได้ใช้โค้ด Astryx เลยสักบรรทัด สิ่งที่ได้คือ**คำศัพท์ร่วม** — คนที่เคยใช้ Astryx อ่านโค้ดเราออกเร็วขึ้น และเวลาถกกันเรื่อง component จะอ้างอิงชื่อกลางได้ ส่วนที่**ไม่ได้**คือความถูกต้องเพิ่มขึ้นหรือบั๊กน้อยลง งานนี้จึงคุ้มถ้าเป้าหมายคือ vocabulary ไม่คุ้มถ้าคาดหวังคุณภาพโค้ด

---

## 8 · คำตัดสิน (2026-07-28)

**8.1 · §5.3 — รับ `label: string` บังคับ** ✅

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

### 8.6 · สรุปผลต่อขอบเขต

| | ก่อน | หลัง |
|---|---|---|
| rename | 16 | **15** (ตัด `SearchField`) |
| divergence | D1–D10 | **D1–D14** |
| งานเพิ่มที่ไม่ได้อยู่ในประมาณการเดิม | — | `label: string` ทั่วทั้งระบบ + a11y test ซ้ำทุก control |
