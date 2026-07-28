# IconButton

**`@smego/ui`** · ชั้น 03 · [IconButton.tsx](./IconButton.tsx)

---

## 1 · ภาพรวม

ปุ่มไอคอนล้วน — ไม่มีข้อความที่มองเห็น

**ใช้ได้กับ 6 ไอคอนเท่านั้น** และ `label` เป็น prop บังคับ ทั้งสองข้อบังคับด้วย TypeScript ไม่ใช่ด้วยเอกสาร

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน | เหตุผล |
|---|---|---|
| ไอคอนอื่นนอกจาก 6 ตัว | `<Button icon="…">ข้อความ</Button>` | TypeScript ปฏิเสธอยู่แล้ว — ดู §3 |
| นำทาง | `<Link>` + ไอคอน | ต้องเปิดแท็บใหม่ได้ |
| เปิดเมนู | `<MenuTrigger>` (Pass 4) | ต้องมี `aria-expanded` + `aria-haspopup` |
| toggle ค้าง (บันทึก/ถูกใจ) | `<SaveButton>` (Pass B) | ต้องมี `aria-pressed` |

---

## 2 · React API

```tsx
import { IconButton } from '@smego/ui';

<IconButton name="search" label="ค้นหา" variant="solid" />
```

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `name` | `AllowedIconOnlyName` | — | **6 ค่าเท่านั้น** |
| `label` | `string` | — | **บังคับ** · ภาษาไทย · ดู §5 |
| `variant` | `'ghost' \| 'outline' \| 'solid'` | `'ghost'` | |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | ขนาดไอคอนตามมาเอง |
| `isDisabled` | `boolean` | `false` | จาก RAC |
| `onPress` | `(e) => void` | — | จาก RAC |
| `className` | `string` | — | |

```ts
export type AllowedIconOnlyName =
  | 'search' | 'x' | 'menu' | 'arrow-left'
  | 'more-vertical' | 'more-horizontal';
```

`aria-label` **ถูกถอดออกจาก type ของ RAC** (`Omit<…, 'aria-label'>`) เพื่อบังคับให้ผ่าน `label` ทางเดียว — ไม่มีทางตั้งสองที่แล้วขัดกัน

### ทางหนีเมื่อ wrapper ไม่พอ

```tsx
import { iconButtonStyles } from '@smego/ui';
import { Button as RACButton } from '@smego/ui/primitives';

<RACButton aria-label="…" className={iconButtonStyles({ variant: 'outline' })}>…</RACButton>
```

**ใช้ทางหนีนี้แล้วคุณรับผิดชอบเองว่า `aria-label` มีจริงและไอคอนสื่อความหมายได้**

---

## 3 · Variants

| variant | พื้น | ตัวอักษร | ขอบ | ใช้เมื่อไร |
|---|---|---|---|---|
| `ghost` | โปร่งใส | `fg` | โปร่งใส | toolbar · หัว modal |
| `outline` | `surface` | `fg` | `edge-strong` | เมื่อต้องให้เห็นว่ากดได้ชัดเจน |
| `solid` | `primary-600` | `on-brand` | `primary-outline` | ปุ่มค้นหาในแถบค้นหา |

### ★★ 6 ไอคอนเท่านั้น (ข้อ 09 §6.2)

```
search · x · menu · arrow-left · more-vertical · more-horizontal
```

เนื้อหาของ SME.GO — **เอกสาร ภาษี การรับรอง แหล่งทุน** — **ไม่มีสัญลักษณ์สากลอยู่แล้ว**

ไอคอนสำหรับ "ใบกำกับภาษีอิเล็กทรอนิกส์" ไม่มีทางสื่อความหมายได้เอง ไม่ว่าจะวาดดีแค่ไหน

และผู้ใช้กลุ่มหลักคือ **เจ้าของกิจการอายุ 40–60 ปีที่ไม่ได้คุ้นเคยดิจิทัล** ซึ่งมีคลังสัญลักษณ์ในหัวเล็กกว่าผู้ใช้แอปทั่วไป

TypeScript บังคับผ่าน `AllowedIconOnlyName` — ถ้าจำเป็นต้องใช้ไอคอนอื่นจริง **ต้องใช้ `<Button icon>` ที่มีข้อความ** ไม่มีทางหลบ

### ★ ขนาดเป้าคิดจาก **ไอคอน + padding** ไม่ใช่ค่าตายตัว

| size | ไอคอน | padding | เป้ารวม | SC 2.5.8 |
|---|---|---|---|---|
| `sm` | 16 | `p-1` | **24×24** | ✅ พอดีเกณฑ์ |
| `md` | 20 | `p-2` | **36×36** | ✅ |
| `lg` | 24 | `p-2` | **40×40** | ✅ |

**ไม่มีตัวเลือกที่ต่ำกว่า 24 — เลือกผิดไม่ได้**

ขนาดไอคอนไม่ใช่ prop แยก แต่ผูกกับ `size` ผ่าน `ICON_FOR_SIZE` เพราะถ้าแยกได้ จะมีคนตั้ง `size="sm"` + ไอคอน 24 แล้วได้ 32×32 ที่ padding เป็น 4 ซึ่งดูอัด

---

## 4 · States

| state | `data-*` จาก RAC | ghost | outline | solid |
|---|---|---|---|---|
| default | — | โปร่งใส | `surface` | `primary-600` |
| hover | `data-hovered` | `bg-sunken` | `bg-sunken` | `primary-700` |
| focus-visible | `data-focus-visible` | วงแหวน 2 ชั้นจาก `base.css` | | |
| pressed | `data-pressed` | `bg-sunken` | `bg-sunken` | `primary-800` |
| disabled | `data-disabled` | `text-fg-disabled` · `border-edge` · `cursor-not-allowed` | | |

### ★ ขอบมีอยู่ทุก variant แม้ตอนโปร่งใส

`border` อยู่ใน base class ของ CVA แล้ว `ghost` ตั้งเป็น `border-transparent`

เหตุผลเดียวกับ Button: **ถ้าขอบโผล่มาตอน hover ปุ่มจะขยับ 2px** — ขอบที่มีอยู่ตลอดแต่โปร่งใสแก้ปัญหานี้ และทำให้ `solid` ใช้ `primary-outline` ได้โดยไม่ต้องคำนวณขนาดใหม่

---

## 5 · Accessibility

| เรื่อง | ข้อกำหนด |
|---|---|
| role | `button` จาก RAC |
| ชื่อ | `aria-label` จาก `label` — **บังคับด้วย type** |
| keyboard | Enter **และ** Space |
| **SC 2.5.8** | ทุก size ≥24×24 วัดแล้ว |
| **SC 2.5.3** | `label` ต้องรวมข้อความที่แสดงอยู่ — ดูด้านล่าง |
| **SC 1.4.11** | `solid` มีขอบ `primary-outline` แยกจากพื้น |
| **SC 4.1.2** | ไอคอนได้ `aria-hidden` จาก `<Icon>` — ไม่มีชื่อซ้อนสองชั้น |

### ★★ `label` ต้องรวมข้อความที่มองเห็น (SC 2.5.3)

```
❌ label="ลบ"
✅ label="ลบ เครื่องคั่วกาแฟ 5 กก."
```

ในตารางรายการสินค้าที่มี 20 แถว ปุ่มที่ชื่อ "ลบ" ทั้ง 20 อัน **แยกกันไม่ได้เลย** สำหรับผู้ใช้ที่ฟังรายการปุ่ม

และผู้ใช้ที่สั่งด้วยเสียงพูดว่า "กดลบ" จะไม่รู้ว่าระบบจะเลือกอันไหน

### ★ `label` ต้องเป็นภาษาไทย

ผู้ใช้ TalkBack/VoiceOver ภาษาไทยที่ได้ยิน "search" จะไม่เข้าใจ — และเสียงอ่านภาษาอังกฤษในเครื่องที่ตั้งภาษาไทยฟังยากกว่าที่คิด

ข้อความที่ใช้ซ้ำควรมาจาก `strings.th.ts` (`s.common.close`, `s.search.submit`) ไม่ใช่พิมพ์ตรง

### ★ ไม่ใส่ `label` ที่ `<Icon>` ด้วย

ถ้าใส่ทั้งสองที่ screen reader จะอ่าน **ชื่อซ้อนกันสองชั้น** — `<Icon>` จึงถูกเรียกโดยไม่มี label และได้ `aria-hidden` มาเอง

---

## 6 · Tailwind implementation

```ts
const iconButtonStyles = cva(
  [
    'relative inline-flex items-center justify-center',
    'rounded-(--radius-control)',
    'border',                       /* มีตลอด — กันปุ่มขยับตอน hover */
    'transition-colors duration-fast ease-standard',
    'data-disabled:text-fg-disabled data-disabled:border-edge',
    'data-disabled:cursor-not-allowed',
  ],
  {
    variants: {
      variant: {
        ghost: ['bg-transparent text-fg border-transparent',
                'data-hovered:bg-sunken', 'data-pressed:bg-sunken'],
        outline: ['bg-surface text-fg border-edge-strong',
                  'data-hovered:bg-sunken', 'data-pressed:bg-sunken'],
        solid: ['bg-primary-600 text-on-brand border-primary-outline',
                'data-hovered:bg-primary-700', 'data-pressed:bg-primary-800'],
      },
      size: { sm: 'p-1', md: 'p-2', lg: 'p-2' },
    },
    defaultVariants: { variant: 'ghost', size: 'md' },
  },
);

const ICON_FOR_SIZE = { sm: 16, md: 20, lg: 24 } as const;
```

`rounded-(--radius-control)` **ไม่ใช่ `rounded-full`** — ข้อ 05 สงวน `rounded-full` ให้ chip · badge · avatar · dot เท่านั้น

---

## 7 · Figma Variant

Component set **`IconButton`**

| Property | Values |
|---|---|
| `Icon` | `Search` · `Close` · `Menu` · `Back` · `More vertical` · `More horizontal` |
| `Variant` | `Ghost` · `Outline` · `Solid` |
| `Size` | `SM (24)` · `MD (36)` · `LG (40)` |
| `State` | `Default` · `Hover` · **`Focus`** · `Pressed` · `Disabled` |

**`Icon` property ต้องเป็น enum 6 ค่า ไม่ใช่ instance swap แบบเปิด** — ถ้าเปิดให้สลับไอคอนอะไรก็ได้ Figma จะขัดกับ TypeScript ทันที และนักออกแบบจะส่งงานที่ implement ไม่ได้

**ชื่อ size ต้องมีตัวเลขในวงเล็บ** เพื่อให้เห็นว่าเป็นเป้ากดกี่พิกเซล ไม่ใช่ขนาดไอคอน

---

## 8 · Usage

```tsx
// แถบค้นหา
<HStack gap="0">
  <TextField label="ค้นหา" placeholder="ค้นหาสินค้า บริการ หรือโครงการ" />
  <IconButton name="search" label="ค้นหา" variant="solid" size="lg" />
</HStack>
```

```tsx
// ปุ่มปิดใน modal — ข้อความจาก strings.th.ts
<IconButton name="x" label={s.common.close} variant="ghost" size="sm" />
```

```tsx
// เมนูในแถวตาราง — label รวมชื่อรายการ (SC 2.5.3)
<IconButton
  name="more-vertical"
  label={`ตัวเลือกเพิ่มเติมสำหรับ ${product.name}`}
  size="sm"
/>
```

```tsx
// ย้อนกลับบนมือถือ
<IconButton name="arrow-left" label="ย้อนกลับ" variant="ghost" />
```

---

## 9 · Anti-patterns

| ❌ | ✅ | ทำไม |
|---|---|---|
| `<IconButton name="file-text" …>` | `<Button icon="file-text">ใบกำกับภาษี</Button>` | ไม่มีสัญลักษณ์สากลสำหรับเอกสารไทย — TypeScript ปฏิเสธอยู่แล้ว |
| `label="ลบ"` ในตาราง 20 แถว | `label="ลบ ${ชื่อสินค้า}"` | ปุ่ม 20 อันชื่อเดียวกัน (SC 2.5.3) |
| `label="Search"` | `label="ค้นหา"` | ผู้ใช้ TalkBack ไทยไม่เข้าใจ |
| `<IconButton className="p-0">` | ใช้ `size` | เป้าจะเหลือ 20×20 = ไม่ผ่าน SC 2.5.8 |
| `<IconButton className="rounded-full">` | ปล่อยตามค่าเริ่มต้น | `rounded-full` สงวนไว้ 4 อย่าง (ข้อ 05) |
| `<Icon name="x" onClick={close} />` | `<IconButton>` | `<Icon>` ไม่ใช่ปุ่ม — ไม่มี focus ไม่มี keyboard ไม่มีชื่อ |
| `<IconButton name="more-vertical">` เปิดเมนู | `<MenuTrigger>` | ขาด `aria-expanded` + `aria-haspopup` |
| `<IconButton>` + `<Icon label="…">` | ปล่อย Icon ไม่มี label | ชื่อซ้อนสองชั้น screen reader อ่านซ้ำ |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง ไม่มีแถวไหนอธิบายพฤติกรรมซ้ำ (นั่นคืองานของ §4 และ §5)

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · axe ผ่านใน `a11y/primitives.test.tsx` · `label` เป็น prop **บังคับ** จึงไม่มีทางสร้างปุ่มไร้ชื่อได้ (SC 4.1.2) |
| ตอบสนอง (Responsive) | ✅ | §4 ทุกขนาดเป็นเป้า ≥24×24 (SC 2.5.8) · ไม่เปลี่ยนตาม breakpoint จึงไม่มีจุดที่เล็กลงจนพลาด |
| โหมดมืด (Dark Mode) | ✅ | `lint-classes.mjs` 0 จุด — ทุกสีมาจาก token ที่ override ในโหมดมืดแล้ว |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | `lint-quality.mjs` 0 จุด — ไม่มี `ml-`/`pl-`/`left-` ในไฟล์นี้ |
| คีย์บอร์ด (Keyboard) | ✅ | §4 `focus-visible` · `Enter`/`Space` เหมือน `<button>` จริง |
| กำลังโหลด (Loading) | — | ระหว่างรอให้ใช้ [`<Button isLoading>`](./Button.md) ซึ่งคงความกว้างและ focus ไว้ — ปุ่มไอคอนล้วนไม่มีที่ให้ spinner อยู่โดยไม่บังไอคอน |
| ข้อผิดพลาด (Error) | — | ปุ่มไม่ถือความถูกต้องของข้อมูล |
| ว่างเปล่า (Empty) | — | `label` บังคับ · ไม่มีสถานะไร้เนื้อหา |
| Skeleton | — | ไอคอน 20–24px ไม่ใช่เนื้อหาที่ต้องมีตัวแทนระหว่างโหลด |
| การเคลื่อนไหว (Animation) | ✅ | `base.css §10` ครอบ `*` ด้วย `!important` — ไม่มีการเคลื่อนไหวที่หลุดตัวกัน (`lint-quality.mjs` 0 จุด) |
| ประสิทธิภาพ (Performance) | ✅ | animate เฉพาะสี · ไม่มีความสูงตายตัว |
