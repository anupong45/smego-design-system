# CheckboxInput · CheckboxList

**`@smego/ui`** · ชั้น 03 · [CheckboxInput.tsx](./CheckboxInput.tsx)

> เดิมชื่อ `Checkbox` — เปลี่ยนตาม ASTRYX-PARITY.md §1.2 · `children` → `label: string` บังคับตาม §8.1

---

## 1 · ภาพรวม

เลือกได้ **หลายตัวพร้อมกัน** หรือเปิด/ปิดข้อเดียว

ความต่างเชิงโครงสร้างจาก `RadioList` ที่สำคัญที่สุด: checkbox **ไม่ใช้ roving tabindex** — แต่ละตัวเป็น tab stop ของตัวเอง

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน | เหตุผล |
|---|---|---|
| เลือกได้ข้อเดียว | `<RadioList>` | checkbox บอกผู้ใช้ว่าเลือกหลายข้อได้ |
| เปิด/ปิดที่มีผลทันที | `<Switch>` (Pass 2) | checkbox สื่อ "จะมีผลเมื่อกดบันทึก" |
| ตัวกรองในหน้ารายการ | `<Token>` | ตัวกรองต้องเห็นค้างและลบได้ทีละอัน |
| เลือกจาก 20+ ตัวเลือก | `<Typeahead multiple>` (Pass 2) | รายการยาวเกินกว่าจะสแกนด้วยตา |

---

## 2 · React API

```tsx
import { CheckboxInput, CheckboxList } from '@smego/ui';

<CheckboxList label="ใบรับรองที่มี" description="เลือกได้มากกว่าหนึ่ง">
  <CheckboxInput value="tis" label="มาตรฐานผลิตภัณฑ์อุตสาหกรรม" />
  <CheckboxInput value="halal" label="ฮาลาล" description="สำหรับสินค้าอาหารและเครื่องดื่ม" />
</CheckboxList>
```

### CheckboxInput

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `label` | `string` | — | **บังคับ** — accessible name (§8.1) |
| `isLabelHidden` | `boolean` | `false` | ซ่อน label ด้วยตา ยังอ่านได้ด้วย screen reader |
| `description` | `string` | — | คำอธิบายใต้ข้อความ |
| `value` | `string` | — | จำเป็นเมื่ออยู่ใน group |
| `isSelected` / `defaultSelected` | `boolean` | — | จาก RAC |
| `isIndeterminate` | `boolean` | `false` | ดู §3 |
| `isDisabled` / `isInvalid` | `boolean` | `false` | จาก RAC |
| `status` | `InputStatus` | — | `{ type: "error"\|"warning"\|"success", message? }` · ใช้กับ checkbox เดี่ยวเท่านั้น — ถ้าอยู่ในกลุ่ม ใส่ที่กลุ่ม (SC 3.3.1) |
| `isOptional` | `boolean` | `false` | ต่อท้าย label ว่า "(ไม่บังคับ)" |
| `onChange` | `(isSelected: boolean) => void` | — | |

### CheckboxList

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `label` | `string` | — | **บังคับ** |
| `description` | `string` | — | |
| `status` | `InputStatus` | — | `{ type: "error"\|"warning"\|"success", message? }` — `error` เท่านั้นที่ทำให้กลุ่ม invalid |
| `isOptional` | `boolean` | `false` | |
| `value` / `onChange` | `string[]` | — | จาก RAC |

`validationBehavior` ถอดออกจาก type — `"aria"` ตายตัว

---

## 3 · Variants

CheckboxInput ไม่มี visual variant — มีแค่ **สถานะ** ซึ่งอยู่ใน §4

| ส่วน | ค่า |
|---|---|
| กล่อง | `size-5` (20px) · `rounded-(--radius-sm)` |
| ขอบตอนไม่เลือก | `border-edge-strong` (4.20:1) |
| พื้นตอนเลือก | `bg-primary-600` · `text-on-brand` |
| ข้อความ | `text-body-sm` |
| คำอธิบาย | `text-caption text-fg-muted` |

### ★★ indeterminate ต้องมี **รูปทรง** ต่างจาก checked (SC 1.4.1)

```
checked        →  Icon "check"  (เครื่องหมายถูก)
indeterminate  →  Icon "minus"  (ขีดกลาง)
```

**ไม่ใช่แค่สีอ่อนกว่า** — ผู้ใช้ที่แยกสีไม่ได้ต้องบอกความต่างได้

---

## 4 · States

| state | ที่มา | กล่อง |
|---|---|---|
| default | — | `border-edge-strong` · `bg-surface` |
| hover | `group-data-hovered` | `border-fg-muted` (เฉพาะตอนยังไม่เลือก) |
| focus-visible | `data-focus-visible` | วงแหวน 2 ชั้นจาก `base.css` |
| **selected** | `isSelected` | `bg-primary-600` + ✓ |
| **indeterminate** | `isIndeterminate` | `bg-primary-600` + − |
| invalid | `isInvalid` | `border-edge-danger` |
| disabled | `isDisabled` | `border-edge` · `bg-sunken` · `text-fg-disabled` |

### ★ hover เปลี่ยนเฉพาะตอนยังไม่เลือก

ตอนเลือกแล้วพื้นเป็นสีแบรนด์อยู่ การเปลี่ยนขอบไม่มีใครเห็น — และการเปลี่ยนพื้นให้เข้มขึ้นจะดูเหมือนสถานะที่สามที่ไม่มีอยู่จริง

---

## 5 · Accessibility

| เรื่อง | ข้อกำหนด |
|---|---|
| role | `checkbox` จาก RAC (native input ที่ visually-hidden) |
| keyboard | **Space** สลับสถานะ · **Tab เข้าทุกตัว** ไม่ใช่ roving |
| **SC 2.5.8** | เป้ารวม = ทั้งแถว — วัดได้ **44–68px สูง** |
| **SC 1.4.11** | ขอบกล่อง `edge-strong` = 4.20:1 ✅ |
| **SC 1.4.1** | indeterminate ต่างที่รูปทรง |
| **SC 3.3.1** | error มีข้อความ ไม่ใช่แค่ขอบแดง |
| **SC 1.3.1** | `CheckboxList` → `role="group"` + `aria-labelledby` จาก RAC |

### ★★ เป้ากดคือ **ทั้งแถว** ไม่ใช่แค่กล่อง 20px

`<label>` ครอบทั้งกล่องและข้อความ ดังนั้นพื้นที่กดคือทั้งแถว

**วัดจริงในเบราว์เซอร์:** 600×44px (บรรทัดเดียว) และ 600×68px (มีคำอธิบาย) — ผ่าน SC 2.5.8 อย่างสบาย

### ⚠️ checkbox โดด ๆ ไม่มีข้อความ

เช่นในหัวตารางเพื่อ "เลือกทั้งหมด" เป้าจะเหลือ **20×20** ซึ่งต่ำกว่าเกณฑ์

component ใส่ **`p-1` เสมอ** (ไม่ใช่เฉพาะเคสนี้) → **28×28** ✓

ใส่เสมอเพราะกฎที่ต้องจำว่า "เคสไหนต้องเพิ่ม" คือกฎที่จะถูกลืม

`CheckboxList` ชดเชยด้วย `-ms-1` เพื่อให้กล่องตรงแนวกับ label ด้านบน

### ★★ checkbox ไม่ใช้ roving tabindex — ต่างจาก radio

แต่ละตัวเป็น **tab stop ของตัวเอง** เพราะเลือกได้หลายตัวพร้อมกัน (ข้อ 10 §1.2)

ถ้าใช้ roving ผู้ใช้คีย์บอร์ดจะเลือกตัวที่ 3 และ 5 ไม่ได้โดยไม่ผ่านตัวที่ 4

RAC จัดการให้ถูกอยู่แล้ว — **ห้ามใส่ `tabIndex` เอง**

---

## 6 · Tailwind implementation

```ts
const boxBase = [
  'flex shrink-0 items-center justify-center',
  'size-5',
  'rounded-(--radius-sm)',
  'border',
  'transition-colors duration-fast ease-standard',
].join(' ');
```

```tsx
<RACCheckbox className={cn(
  'group flex min-w-0 items-start gap-2',
  'p-1',                                  /* ← 20 + 8 = 28×28 แม้ไม่มีข้อความ */
  'cursor-pointer data-disabled:cursor-not-allowed',
)}>
  {({ isSelected, isIndeterminate, isDisabled, isInvalid }) => (
    <span className={cn(
      boxBase,
      !isSelected && !isIndeterminate && 'border-edge-strong bg-surface',
      (isSelected || isIndeterminate) && 'border-primary-outline bg-primary-600 text-on-brand',
      isInvalid && 'border-edge-danger',
      isDisabled && 'border-edge bg-sunken text-fg-disabled',
      !isSelected && !isDisabled && 'group-data-hovered:border-fg-muted',
    )}>
      {isIndeterminate ? <Icon name="minus" size={16} />
        : isSelected ? <Icon name="check" size={16} /> : null}
    </span>
  )}
</RACCheckbox>
```

ใช้ **render prop** ไม่ใช่ `data-*` class เพราะต้องสลับ **ไอคอน** ตามสถานะ ซึ่ง CSS ทำไม่ได้

---

## 7 · Figma Variant

Component set **`CheckboxInput`**

| Property | Values |
|---|---|
| `State` | `Default` · `Hover` · **`Focus`** · `Disabled` |
| `Checked` | `Unchecked` · `Checked` · **`Indeterminate`** |
| `Label` | `True` · `False` |
| `Description` | `True` · `False` |
| `Invalid` | `True` · `False` |

**`Indeterminate` ต้องใช้ขีดกลาง ไม่ใช่เครื่องหมายถูกสีจาง** — ถ้า Figma ใช้สีจาง นักพัฒนาจะทำตามและตก SC 1.4.1

**ต้องมี frame ที่แสดงพื้นที่กด** (overlay สีโปร่ง) ครอบทั้งแถว เพื่อให้เห็นว่าเป้าไม่ใช่แค่กล่อง 20px

Component set **`CheckboxList`** แยกต่างหาก — property `Error`, `Description`, `Optional`

---

## 8 · Usage

```tsx
<CheckboxList
  label="ใบรับรองที่มี"
  description="เลือกได้มากกว่าหนึ่ง"
  value={certs}
  onChange={setCerts}
  status={certs.length === 0 ? { type: 'error', message: 'กรุณาเลือกอย่างน้อยหนึ่งรายการ — ใบรับรองเป็นข้อมูลที่ผู้ซื้อใช้ตัดสินใจ' } : undefined}
>
  <CheckboxInput value="tis" label="มาตรฐานผลิตภัณฑ์อุตสาหกรรม (มอก.)" />
  <CheckboxInput value="halal" label="ฮาลาล" description="สำหรับสินค้าอาหารและเครื่องดื่ม" />
  <CheckboxInput value="gmp" label="จีเอ็มพี — ต้องยืนยันตัวตนก่อน" isDisabled />
</CheckboxList>
```

```tsx
// เลือกทั้งหมดในหัวตาราง — ไม่มีข้อความที่มองเห็น ต้องมี label + isLabelHidden
<CheckboxInput
  label="เลือกสินค้าทั้งหมดในหน้านี้"
  isLabelHidden
  isSelected={allSelected}
  isIndeterminate={someSelected && !allSelected}
  onChange={toggleAll}
/>
```

```tsx
// ยอมรับเงื่อนไข — label เป็นข้อความยาวที่มีลิงก์ได้
<CheckboxInput
  value="terms"
  isRequired
  label="ข้าพเจ้ายอมรับข้อกำหนดการใช้งานและนโยบายความเป็นส่วนตัว"
/>
{/* ข้อความยาวที่มีลิงก์ฝังอยู่ ให้วาง <Link> แยกไว้ข้าง CheckboxInput แทนการฝังใน label (label เป็น string ล้วน) */}
```

---

## 9 · Anti-patterns

| ❌ | ✅ | ทำไม |
|---|---|---|
| `<CheckboxInput>` สำหรับเลือกข้อเดียว | `<RadioList>` | รูปทรงสี่เหลี่ยมสื่อ "เลือกหลายข้อได้" |
| `<CheckboxInput>` ที่มีผลทันที | `<Switch>` | checkbox สื่อว่าต้องกดบันทึก |
| indeterminate = ✓ สีจาง | `Icon "minus"` | ไม่ผ่าน SC 1.4.1 |
| `<CheckboxInput className="p-0">` | ปล่อยตามค่าเริ่มต้น | checkbox โดด ๆ จะเหลือ 20×20 |
| `tabIndex={-1}` บน checkbox ในกลุ่ม | ปล่อยให้ RAC จัดการ | roving ทำให้เลือกข้ามตัวไม่ได้ |
| `border-neutral-300` | `border-edge-strong` | 1.56:1 ไม่ผ่าน SC 1.4.11 |
| `label=""` ว่างเปล่า | ใส่ข้อความจริงเสมอ | screen reader อ่านว่า "ช่องทำเครื่องหมาย" เฉย ๆ |
| `<CheckboxInput>` เป็นตัวกรองในหน้ารายการ | `<Token>` | ตัวกรองต้องเห็นค้างและลบทีละอันได้ |
| ขอบแดงอย่างเดียวตอน invalid | + `status={{ type: 'error', message }}` | SC 3.3.1 |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง ไม่มีแถวไหนอธิบายพฤติกรรมซ้ำ (นั่นคืองานของ §4 และ §5)

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · axe ผ่านใน `a11y/primitives.test.tsx` และ `a11y/marketplace.test.tsx` |
| ตอบสนอง (Responsive) | ✅ | `min-w-0` ที่ label — ข้อความยินยอมยาว ๆ ตัดบรรทัดแทนดันกล่อง · เป้ากด ≥24×24 ทุก breakpoint (SC 2.5.8) |
| โหมดมืด (Dark Mode) | ✅ | `lint-classes.mjs` 0 จุด — ทุกสีมาจาก token ที่ override ในโหมดมืดแล้ว |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | ใช้คู่ `ms-`/`me-` อยู่แล้ว · `lint-quality.mjs` 0 จุด — ไม่มี `ml-`/`pl-`/`left-` ในไฟล์นี้ |
| คีย์บอร์ด (Keyboard) | ✅ | §4 `focus-visible` · `Space` สลับค่า · `Tab` เข้า/ออกทีละช่อง |
| กำลังโหลด (Loading) | — | ช่องติ๊กไม่รอ API · สถานะกำลังส่งอยู่ที่ปุ่มยืนยันของฟอร์ม |
| ข้อผิดพลาด (Error) | ✅ | §4 `invalid` · `status.message` เป็นข้อความ ไม่ใช่แค่ขอบแดง (SC 3.3.1) |
| ว่างเปล่า (Empty) | — | ช่องติ๊กมีค่าเสมอ (ติ๊ก/ไม่ติ๊ก/indeterminate) — ไม่มีสถานะ "ไม่มีข้อมูล" |
| Skeleton | — | กล่องติ๊ก 24px ไม่ใช่เนื้อหาที่ต้องมีตัวแทนระหว่างโหลด |
| การเคลื่อนไหว (Animation) | ✅ | `base.css §10` ครอบ `*` ด้วย `!important` — ไม่มีการเคลื่อนไหวที่หลุดตัวกัน (`lint-quality.mjs` 0 จุด) |
| ประสิทธิภาพ (Performance) | ✅ | animate เฉพาะสี · ไม่มีความสูงตายตัว |
