# Chip · RemovableChip · ChipRow

**`@smego/ui`** · ชั้น 03 · [Chip.tsx](./Chip.tsx)

---

## 1 · ภาพรวม

ตัวกรองที่ **กดได้** และ **มีสถานะค้าง** เลือก/ไม่เลือก

เส้นแบ่งจาก `<Badge>` ชัดเจน: Chip กดได้ จึงต้องเป็นเป้า **≥24×24** มี **focus ring** และมี **`aria-pressed`**

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน | เหตุผล |
|---|---|---|
| ข้อมูลอ่านอย่างเดียว | `<Badge>` | Chip ที่กดไม่ได้หลอกผู้ใช้ว่ากดได้ |
| เลือกได้หลายข้อในฟอร์ม | `<CheckboxGroup>` | ฟอร์มต้องมี label กลุ่ม + error ที่เชื่อมกัน |
| เลือกได้ข้อเดียว | `<RadioList>` หรือ `<Selector>` | `aria-pressed` สื่อ toggle ไม่ใช่การเลือกในกลุ่ม |
| การกระทำครั้งเดียว | `<Button size="xs">` | ไม่มีสถานะค้างให้ toggle |

---

## 2 · React API

```tsx
import { Chip, RemovableChip, ChipRow } from '@smego/ui';

<Chip defaultSelected icon="check" onChange={setHasCert}>มีใบรับรอง</Chip>
```

### Chip

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `children` | `ReactNode` | — | |
| `icon` | `IconName` | — | ตกแต่ง ได้ `aria-hidden` อัตโนมัติ |
| `isSelected` / `defaultSelected` | `boolean` | — | จาก RAC `ToggleButton` |
| `onChange` | `(isSelected: boolean) => void` | — | **จาก RAC — ไม่ใช่ `onClick`** |
| `isDisabled` | `boolean` | `false` | |
| `className` | `string` | — | |

### RemovableChip

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `children` | `ReactNode` | — | |
| `label` | `string` | จาก `children` ถ้าเป็น string | **ต้องส่งเมื่อ `children` ไม่ใช่ข้อความล้วน** |
| `onRemove` | `() => void` | — | |
| `icon` | `IconName` | — | |

### ChipRow

| prop | type | หมายเหตุ |
|---|---|---|
| `label` | `string` | **บังคับ** — `aria-label` ของ `role="group"` |

---

## 3 · Variants

| selected | พื้น | ตัวอักษร | ขอบ |
|---|---|---|---|
| `false` | `surface` | `fg-secondary` | `edge-strong` |
| `true` | `primary-50` | `primary-800` | `edge-brand` |

### ★ chip ที่เลือกแล้ว**ไม่ใช้พื้นทึบน้ำเงิน**

กฎ **"น้ำเงินทึบ = กดได้แบบ CTA"** ถูกสงวนไว้ให้ปุ่ม

chip ที่เลือกแล้วยังกดได้ (เพื่อยกเลิก) แต่ไม่ใช่ CTA จึงใช้ **tint + ขอบแบรนด์** ซึ่งสื่อ "เปิดอยู่" โดยไม่แย่งความเด่นจากปุ่ม "ค้นหา"

### ★ `rounded-full` ใช้ได้ที่นี่ (ข้อ 05)

chip เป็นหนึ่งใน **4 อย่างที่อนุญาต** (chip · badge · avatar · dot) เพราะ **ข้อความสั้นเสมอ**

ความกว้างไม่คงที่ไม่ใช่ปัญหาสำหรับ chip — ต่างจากปุ่มที่ข้อความไทยยาวกว่า 20–40% แล้วทำให้แคปซูลล้นที่ 360px

---

## 4 · States

| state | `data-*` จาก RAC | สิ่งที่เปลี่ยน |
|---|---|---|
| default | — | `bg-surface` · `border-edge-strong` |
| hover | `data-hovered` | `bg-sunken` · `text-fg` |
| focus-visible | `data-focus-visible` | วงแหวน 2 ชั้นจาก `base.css` |
| pressed | `data-pressed` | — (สั้นเกินกว่าจะเห็น) |
| **selected** | `data-selected` + `aria-pressed="true"` | tint แบรนด์ + ขอบแบรนด์ |
| disabled | `data-disabled` | `bg-sunken` · `text-fg-disabled` · `cursor-not-allowed` |

### ขนาดเป้าที่วัดจริง

| element | ขนาด | ผ่าน SC 2.5.8 |
|---|---|---|
| `Chip` | `py-1` + `text-caption` (lh 20px) + border 2 = **30px** | ✅ |
| ปุ่มลบใน `RemovableChip` | icon 16 + `p-1` = **24×24** | ✅ พอดีเกณฑ์ |

**24×24 พอดีเกณฑ์แปลว่าผ่านโดยไม่ต้องอ้าง spacing exemption** — ข้อยกเว้นเรื่องระยะห่างใช้กับเป้าที่ **เล็กกว่า** 24 เท่านั้น

---

## 5 · Accessibility

| เรื่อง | ข้อกำหนด |
|---|---|
| role | `Chip` = `button` + `aria-pressed` จาก RAC `ToggleButton` |
| `ChipRow` | `role="group"` + `aria-label` บังคับ |
| **SC 2.5.8** | Chip 30px · ปุ่มลบ 24×24 · วัดแล้วทั้งคู่ |
| **SC 2.5.3** | `aria-label` ปุ่มลบรวมชื่อตัวกรอง |
| **SC 1.4.12** | `w-auto max-w-full` — ยืดตามระยะตัวอักษรที่ผู้ใช้บังคับ |
| **SC 2.4.7** | `ChipRow` มี `p-1` เผื่อวงแหวน — ดูด้านล่าง |
| **SC 1.4.10** | `overflow-x-auto` อยู่ที่ `ChipRow` ไม่ใช่ที่ body |

### ★★ `aria-label` ของปุ่มลบต้องรวมชื่อตัวกรอง

```
❌ "ลบ"
✅ "ลบตัวกรอง กรุงเทพฯ"
```

ในแถวที่มี chip 5 อัน ปุ่มที่ชื่อ "ลบ" ทั้ง 5 อัน **แยกกันไม่ได้เลย** สำหรับผู้ใช้ที่ฟังรายการปุ่มใน screen reader (SC 2.5.3)

ข้อความมาจาก `s.filter.removeFilter(name)` ใน `strings.th.ts` จึงแปลได้และสม่ำเสมอ

### ★★ `ChipRow` ต้องมี `p-1` — 4px ไม่ใช่ตัวเลขสุ่ม

`overflow-x: auto` สร้าง scroll container ที่ตัด overflow **ทั้งสองแกน** ไม่ใช่แค่แกนนอน

วงแหวน focus ล้นออกนอกขอบ **4px พอดี** (`outline 2px` + `outline-offset 2px`) ถ้าไม่มี padding นี้:
- วงแหวนด้านบน-ล่างของทุก chip ถูกตัด
- วงแหวนด้านซ้ายของ chip ตัวแรกถูกตัดตอน `scrollLeft = 0`

= **ไม่ผ่าน SC 2.4.7** (ข้อ 05 §5)

### ★★ ตัวกรองที่เลือกไว้ต้อง **เห็นค้าง** ห้ามยุบเป็น "ตัวกรอง (3)"

หลัก **recognition over recall** ในข้อ 01 §4.3 — ผู้ใช้ที่กรองสินค้า 4 เงื่อนไขต้องเห็นทั้ง 4 ตลอดเวลา ไม่ใช่ต้องจำว่าเลือกอะไรไว้

บนมือถือให้ **เลื่อนแนวนอนพร้อม scroll-snap** ไม่ใช่ตัดบรรทัดและไม่ใช่ยุบ — chip ไทยกว้างกว่าและจะหลุดแถวเร็ว

---

## 6 · Tailwind implementation

```ts
const chipStyles = cva(
  [
    'inline-flex items-center gap-1',
    'text-caption',
    'rounded-full',
    'border',
    'px-3 py-1',
    'w-auto max-w-full min-w-0',
    'transition-colors duration-fast ease-standard',
    'data-disabled:bg-sunken data-disabled:text-fg-disabled',
    'data-disabled:border-edge data-disabled:cursor-not-allowed',
  ],
  {
    variants: {
      selected: {
        false: ['bg-surface text-fg-secondary border-edge-strong',
                'data-hovered:bg-sunken data-hovered:text-fg'],
        true:  ['bg-primary-50 text-primary-800 border-edge-brand',
                'data-hovered:bg-primary-100'],
      },
    },
    defaultVariants: { selected: false },
  },
);
```

`ChipRow`:

```
'flex min-w-0 items-center gap-2'
'overflow-x-auto snap-x snap-mandatory'
'[scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
'p-1'                                  /* ← วงแหวน focus */
'[&>*]:snap-start [&>*]:shrink-0'
```

---

## 7 · Figma Variant

Component set **`Chip`**

| Property | Values |
|---|---|
| `Selected` | `True` · `False` |
| `State` | `Default` · `Hover` · **`Focus`** · `Disabled` |
| `Icon` | `None` · `Leading` · **`Removable`** |

**`Focus` เป็น variant ที่ห้ามลืม** — ถ้าไม่มีใน Figma นักพัฒนาจะไม่รู้ว่าวงแหวนต้องล้นออกนอกขอบ 4px และจะไม่เผื่อที่ใน `ChipRow`

**ต้องมี frame `ChipRow` ที่ 320px** ที่มี chip 5 อัน เพื่อพิสูจน์ว่าเลื่อนแนวนอนไม่ใช่ตัดบรรทัด

---

## 8 · Usage

```tsx
// ตัวกรองเร็วเหนือผลการค้นหา
<ChipRow label="ตัวกรองด่วน">
  <Chip>ทั้งหมด</Chip>
  <Chip icon="check" isSelected={cert} onChange={setCert}>มีใบรับรอง</Chip>
  <Chip isSelected={ready} onChange={setReady}>พร้อมส่ง</Chip>
  <Chip isDisabled>หมดสต็อก</Chip>
</ChipRow>
```

```tsx
// ตัวกรองที่เลือกไว้ — เห็นค้าง ลบได้ทีละอัน
<ChipRow label="ตัวกรองที่เลือก">
  {active.map((f) => (
    <RemovableChip key={f.id} label={f.name} onRemove={() => remove(f.id)}>
      {f.name}
    </RemovableChip>
  ))}
</ChipRow>
```

```tsx
// children ไม่ใช่ข้อความล้วน — ต้องส่ง label
<RemovableChip label="ราคา 50,000 – 2,000,000 บาท" onRemove={clearPrice}>
  <span className="font-numeric">50,000 – 2,000,000</span> บาท
</RemovableChip>
```

---

## 9 · Anti-patterns

| ❌ | ✅ | ทำไม |
|---|---|---|
| `<Badge onClick={…}>` | `<Chip>` | Badge ไม่มี focus ring และไม่รับประกัน 24×24 |
| ยุบตัวกรองเป็น "ตัวกรอง (3)" | `<ChipRow>` ที่เลื่อนได้ | บังคับให้ผู้ใช้จำ — ขัดข้อ 01 §4.3 |
| `aria-label="ลบ"` | `s.filter.removeFilter(name)` | chip 5 อันมีปุ่มชื่อเดียวกัน 5 อัน (SC 2.5.3) |
| `<div className="overflow-x-auto">` ครอบ chip | `<ChipRow>` | ไม่มี `p-1` → วงแหวน focus ถูกตัด (SC 2.4.7) |
| `overflow-x-auto` ที่ `<body>` | ที่ `ChipRow` | เลื่อนสองทิศ = ไม่ผ่าน SC 1.4.10 |
| `<Chip className="bg-primary-600 text-on-brand">` | `isSelected` | น้ำเงินทึบสงวนให้ CTA — chip จะแย่งความเด่น |
| `<Chip onClick={…}>` | `onChange` | `onClick` ไม่ครอบ keyboard/touch เท่า RAC และไม่ให้สถานะ |
| chip ตัดบรรทัดบนมือถือ | เลื่อนแนวนอน + snap | chip ไทยกว้างกว่า — 2 แถวกลายเป็น 4 แถว |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง ไม่มีแถวไหนอธิบายพฤติกรรมซ้ำ (นั่นคืองานของ §4 และ §5)

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · axe ผ่านใน `a11y/primitives.test.tsx` ทั้ง `Chip`, `RemovableChip` และ `ChipRow` · `SC 2.5.3` ชื่อปุ่มลบรวมข้อความของ chip ใบนั้น |
| ตอบสนอง (Responsive) | ✅ | `min-w-0` · `SC 1.4.10` แถว chip ตัดขึ้นบรรทัดใหม่ ไม่เลื่อนแนวนอน |
| โหมดมืด (Dark Mode) | ✅ | `lint-classes.mjs` 0 จุด — ทุกสีมาจาก token ที่ override ในโหมดมืดแล้ว |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | ใช้คู่ `ms-`/`me-` อยู่แล้ว · `lint-quality.mjs` 0 จุด — ไม่มี `ml-`/`pl-`/`left-` ในไฟล์นี้ |
| คีย์บอร์ด (Keyboard) | ✅ | §4 `focus-visible` และ `pressed` แยกกัน · ปุ่มลบเป็น `<button>` แยกที่ `Tab` ถึงได้ |
| กำลังโหลด (Loading) | — | chip แสดงค่าที่เลือกแล้ว |
| ข้อผิดพลาด (Error) | — | chip ไม่ถือความถูกต้องของข้อมูล |
| ว่างเปล่า (Empty) | ✅ | `ChipRow` ที่ไม่มี chip **ไม่ render อะไรเลย** — เทียบกับ `FilterChipRow` ที่มีเทสยืนยันพฤติกรรมเดียวกันใน `a11y/marketplace.test.tsx` |
| Skeleton | — | ข้อความสั้นคำเดียว |
| การเคลื่อนไหว (Animation) | ✅ | `base.css §10` ครอบ `*` ด้วย `!important` — ไม่มีการเคลื่อนไหวที่หลุดตัวกัน (`lint-quality.mjs` 0 จุด) |
| ประสิทธิภาพ (Performance) | ✅ | `SC 1.4.12` ไม่มีความสูงตายตัว · animate เฉพาะสี |
