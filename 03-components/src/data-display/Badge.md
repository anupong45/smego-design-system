# Badge · Dot

**`@smego/ui`** · ชั้น 03 · [Badge.tsx](./Badge.tsx)

---

## 1 · ภาพรวม

ป้ายบอก **สถานะ** หรือ **หมวด** · **กดไม่ได้**

Badge เป็นข้อมูลอ่านอย่างเดียว จึงไม่ต้องเป็นเป้า 24×24 และไม่มี focus — ซึ่งเป็นเส้นแบ่งที่ชัดเจนจาก `<Chip>`

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน | เหตุผล |
|---|---|---|
| กดได้ · ลบได้ · เลือกได้ | `<Chip>` | ต้องเป็นเป้า ≥24×24 และมี focus ring |
| ข้อความแจ้งเตือนเต็มบรรทัด | `<Alert>` (Pass 3) | Badge ไม่มี `role="status"` |
| จำนวนที่เปลี่ยนตลอด (ตะกร้า) | `<Badge>` + `aria-live` ที่ตัวห่อ | Badge เองไม่ประกาศการเปลี่ยนแปลง |
| ป้ายเตือน "ใกล้ปิดรับ" | `variant="warning"` | **ห้ามใช้ `accent` (ทอง)** — ทองไม่ใช่สถานะ |

---

## 2 · React API

```tsx
import { Badge, Dot } from '@smego/ui';

<Badge variant="success">อนุมัติแล้ว</Badge>
<Dot variant="success" label="ออนไลน์" />
```

### Badge

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `children` | `ReactNode` | — | ข้อความสั้น — ไม่ใช่ประโยค |
| `variant` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger' \| 'accent'` | `'neutral'` | |
| `showIcon` | `boolean` | `true` | ⚠️ ตั้ง `false` ได้เฉพาะเมื่อมีตัวชี้ที่ไม่ใช่สีอย่างอื่นแล้ว |
| `icon` | `IconName` | ตาม variant | ทับตัวที่ผูกกับ variant |
| `className` | `string` | — | |

### Dot

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `variant` | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` | |
| `label` | `string` | — | **บังคับ** — จุดสีอย่างเดียวสื่อความหมายไม่ได้ |

---

## 3 · Variants

| variant | พื้น | ตัวอักษร | ขอบ | ไอคอนอัตโนมัติ |
|---|---|---|---|---|
| `neutral` | `sunken` | `fg-secondary` | `edge` | — |
| `info` | `info-surface` | `info-icon` | `info-edge` | `info` (วงกลม + i) |
| `success` | `success-surface` | `success-icon` | `success-edge` | `circle-check` (วงกลม) |
| `warning` | `warning-surface` | `warning-icon` | `warning-edge` | **`triangle-alert` (สามเหลี่ยม)** |
| `danger` | `danger-surface` | `danger-icon` | `danger-edge` | `circle-x` (วงกลม + กากบาท) |
| `accent` | `accent-surface` | `accent-fg` | `accent-edge` | — |

### ★★ ไอคอนถูกผูกกับ variant โดยอัตโนมัติ — SC 1.4.1 ผ่านโดยโครงสร้าง

ทอง (hue 36) กับเหลืองเตือน (hue 48) ห่างกันเพียง **1.43:1 ทางความสว่าง** และ **12° ทาง hue** ซึ่งไม่ใช่การแยกที่แข็งแรง โดยเฉพาะภายใต้ deuteranopia

**รูปทรงจึงเป็นตัวแยกจริง** — `triangle-alert` เป็นสามเหลี่ยม ในขณะที่ทุก variant อื่นเป็นวงกลม

ไอคอนถูก map ในโค้ด **ไม่ใช่ปล่อยให้นักพัฒนาจำใส่เอง** เพราะกฎที่ต้องจำคือกฎที่จะถูกลืม

### ★ Badge เป็น tint ทั้งหมด ไม่มีพื้นทึบ

กฎ **"พื้นทึบ = กดได้"** ในข้อ 01 ต้องเป็นจริงทุกที่ ถ้า Badge มีพื้นทึบสีน้ำเงิน ผู้ใช้จะพยายามกดมัน

### ★ ทองห้ามเป็นสถานะ (ข้อ 02 §9)

`variant="accent"` มีไว้สำหรับ **ป้ายแบรนด์** เท่านั้น — "แนะนำ" "ใหม่" "คัดสรร"

**ห้ามใช้แทน `warning`** แม้จะดูคล้ายกัน เพราะทองในระบบนี้แปลว่า "แหล่งทุน/แบรนด์" ไม่ใช่ "ระวัง"

### ค่า contrast ที่วัดจริง (ตัวอักษรบนพื้น tint)

| variant | สว่าง | มืด | หมายเหตุ |
|---|---|---|---|
| `success` | **5.65** | **7.30** | ✅ AA |
| `warning` | 5.54 | — | `warning-icon` = yellow-800 · **ไม่ใช่ yellow-500 ที่ได้เพียง 1.66** |
| `accent` | 6.74 | — | `accent-fg` = gold-800 |
| `neutral` | 5.74 | 7.27 | ✅ AA |

---

## 4 · States

Badge **ไม่มี state** — ไม่ hover ไม่ focus ไม่ active

**นี่คือความแตกต่างที่ทำให้ผู้ใช้แยก Badge ออกจาก Chip ได้โดยไม่ต้องอ่านคำอธิบาย** ของที่ไม่ตอบสนองต่อ hover คือของที่กดไม่ได้

ถ้า component ที่คุณกำลังเขียนต้องการ `hover` แปลว่ามันไม่ใช่ Badge

---

## 5 · Accessibility

| เรื่อง | ข้อกำหนด |
|---|---|
| role | ไม่มี — เป็น `<span>` |
| **SC 1.4.1** | ไอคอนตาม variant คือกลไกที่ทำให้ผ่าน · `showIcon={false}` ทำให้ตกทันที |
| **SC 1.4.3** | ตัวอักษรทุก variant วัดแล้ว ≥4.5 บนพื้น tint ของตัวเอง |
| **SC 1.4.12** | `w-auto max-w-full` — ยืดตามที่ผู้ใช้บังคับระยะตัวอักษร ไม่ตัดข้อความทิ้ง |
| ไอคอน | ได้ `aria-hidden` จาก `<Icon>` — ความหมายอยู่ที่ข้อความ |
| `Dot` | `label` บังคับ · จุดได้ `aria-hidden` |

### ★ `Dot` ไม่มีทางใช้ผิด

`label` เป็น required prop ไม่ใช่ optional — จุดสีอย่างเดียวสื่อความหมายไม่ได้ทั้งกับ **SC 1.4.1** และกับ **screen reader ที่มองไม่เห็นสีเลย**

ถ้าต้องการจุดล้วนจริง ๆ (เช่นในตารางที่มีหัวคอลัมน์อธิบายอยู่แล้ว) ให้ใช้ `<span aria-hidden className="size-2 rounded-full bg-success-icon" />` ตรง ๆ และ **รับผิดชอบเองว่าความหมายมาจากที่อื่น**

---

## 6 · Tailwind implementation

```ts
const badgeStyles = cva(
  [
    'inline-flex items-center gap-1',
    'text-caption',
    'rounded-full',   /* 1 ใน 4 อย่างที่อนุญาต — chip · badge · avatar · dot */
    'border',
    'px-2 py-0.5',
    'w-auto max-w-full',   /* SC 1.4.12 */
  ],
  {
    variants: {
      variant: {
        neutral: 'bg-sunken text-fg-secondary border-edge',
        info:    'bg-info-surface text-info-icon border-info-edge',
        success: 'bg-success-surface text-success-icon border-success-edge',
        warning: 'bg-warning-surface text-warning-icon border-warning-edge',
        danger:  'bg-danger-surface text-danger-icon border-danger-edge',
        accent:  'bg-accent-surface text-accent-fg border-accent-edge',
      },
    },
    defaultVariants: { variant: 'neutral' },
  },
);

const ICON_FOR_VARIANT: Partial<Record<BadgeVariant, IconName>> = {
  info: 'info',
  success: 'circle-check',
  warning: 'triangle-alert',   /* ← ตัวแยกจริง */
  danger: 'circle-x',
};
```

---

## 7 · Figma Variant

Component set **`Badge`**

| Property | Values |
|---|---|
| `Variant` | `Neutral` · `Info` · `Success` · `Warning` · `Danger` · `Accent` |
| `Icon` | `True` · `False` |

**ไอคอนต้องต่างกันจริงในแต่ละ variant** — ถ้านักออกแบบใช้วงกลมทุกตัวแล้วเปลี่ยนแค่สี Figma จะดูโอเคแต่ implement แล้วไม่ผ่าน SC 1.4.1

**ห้ามสร้าง variant `Gold Warning`** — ถ้ามีคนขอ ให้ชี้ไปที่ข้อ 02 §9

Badge **ไม่มี** `State` property เพราะไม่มี state — ถ้าใน Figma มี Hover แปลว่าออกแบบผิดตัว

---

## 8 · Usage

```tsx
// สถานะโครงการรัฐ — ต้องมีทั้งรูปทรงและข้อความ
<Badge variant="success">เปิดรับสมัคร</Badge>
<Badge variant="warning">ใกล้ปิดรับ · เหลือ 5 วัน</Badge>
<Badge variant="danger">ปิดรับแล้ว</Badge>
```

```tsx
// ป้ายแบรนด์ — ทองใช้ได้เฉพาะกรณีนี้
<Badge variant="accent">แนะนำ</Badge>
```

```tsx
// สถานะผู้ขาย
<Dot variant="success" label="ตอบกลับภายใน 1 ชั่วโมง" />
<Dot variant="warning" label="ไม่ว่าง" />
```

```tsx
// ใบรับรอง — ไม่มีไอคอนโดเมนไทย จึงใช้ข้อความล้วน (ข้อ 09)
<Badge variant="neutral" showIcon={false}>มอก. 2456-2562</Badge>
```

---

## 9 · Anti-patterns

| ❌ | ✅ | ทำไม |
|---|---|---|
| `<Badge onClick={filter}>` | `<Chip>` | Badge ไม่มี focus ring และไม่รับประกัน 24×24 |
| `<Badge variant="accent">ใกล้ปิดรับ</Badge>` | `variant="warning"` | ทองห้ามเป็นสถานะ (ข้อ 02 §9) |
| `<Badge variant="warning" showIcon={false}>` | ปล่อย `showIcon` | ทองกับเหลืองห่างกัน 1.43:1 — สีอย่างเดียวแยกไม่ออก |
| `<span className="text-warning-500">` | `text-warning-icon` | yellow-500 บนขาวได้ **1.66:1** |
| `<span className="size-2 rounded-full bg-success-icon" />` ลอย ๆ | `<Dot label="…">` | จุดสีล้วนไม่มีความหมายสำหรับ screen reader |
| `<Badge className="truncate">` | ปล่อยให้ยืด | ตัดข้อความทิ้ง = ไม่ผ่าน SC 1.4.12 |
| `<Badge>สินค้านี้ผ่านการรับรองมาตรฐาน…</Badge>` | ข้อความในหน้า | Badge เป็นคำ ไม่ใช่ประโยค |
| `<Badge className="bg-primary-600 text-on-brand">` | `variant="info"` | พื้นทึบ = กดได้ ในระบบนี้ ผู้ใช้จะพยายามกด |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง ไม่มีแถวไหนอธิบายพฤติกรรมซ้ำ (นั่นคืองานของ §4 และ §5)

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · axe ผ่านใน `a11y/primitives.test.tsx` ทั้ง `success` และ `warning` · `SC 1.4.1` ความหมายมาจาก**ข้อความ** ไม่ใช่สีอย่างเดียว |
| ตอบสนอง (Responsive) | ✅ | `SC 1.4.12` ไม่มีความสูงตายตัว — ป้ายยืดตามเมื่อผู้ใช้บังคับระยะตัวอักษร |
| โหมดมืด (Dark Mode) | ✅ | `lint-classes.mjs` 0 จุด — ทุกสีมาจาก token ที่ override ในโหมดมืดแล้ว |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | `lint-quality.mjs` 0 จุด — ไม่มี `ml-`/`pl-`/`left-` ในไฟล์นี้ |
| คีย์บอร์ด (Keyboard) | — | ป้ายเป็นข้อความ ไม่ใช่ตัวควบคุม — ไม่อยู่ใน tab order โดยตั้งใจ · ถ้าต้องกดได้ให้ใช้ [`<Chip>`](./Chip.md) |
| กำลังโหลด (Loading) | — | ป้ายแสดงค่าที่รู้แล้ว |
| ข้อผิดพลาด (Error) | — | ป้ายไม่ถือความถูกต้องของข้อมูล |
| ว่างเปล่า (Empty) | — | ป้ายที่ไม่มีข้อความคือป้ายที่ไม่ควร render |
| Skeleton | — | ข้อความสั้นคำเดียว |
| การเคลื่อนไหว (Animation) | — | ไม่มี `transition` หรือ `animate` ในไฟล์นี้เลย — ป้ายเป็นของนิ่ง |
| ประสิทธิภาพ (Performance) | ✅ | ไม่มีสถานะ ไม่มี JS · ไม่มีความสูงตายตัว |
