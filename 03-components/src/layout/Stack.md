# Stack · VStack · HStack

**`@smego/ui`** · ชั้น 03 · [Stack.tsx](./Stack.tsx)

---

## 1 · ภาพรวม

เรียงของต่อกันด้วย **`gap`** ตามชุดระยะที่อนุมัติในข้อ 04 — ไม่ใช่ `margin`

`gap` ไม่มี margin collapse และไม่ต้องมี `:last-child { margin-bottom: 0 }` ซึ่งเป็นบั๊กที่กลับมาทุกครั้งที่มีคนสลับลำดับลูก

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน | เหตุผล |
|---|---|---|
| กริดที่ต้องคุมจำนวนคอลัมน์ | `<Grid>` | `flex-wrap` ให้แถวสุดท้ายไม่เต็ม จำนวนต่อแถวเดาไม่ได้ |
| ความกว้างสูงสุด + padding ของหน้า | `<Container>` | เป็นคนละหน้าที่ |
| ระยะระหว่าง section | `<Section>` | ระยะ section เปลี่ยนตาม breakpoint · Stack ไม่เปลี่ยน |
| ระยะภายใน card | `padding` ของ `<Card>` | Stack คุม gap ระหว่างลูก ไม่ใช่ขอบใน |

---

## 2 · React API

```tsx
import { VStack, HStack } from '@smego/ui';

<VStack gap="3">
  <h3 className="text-subtitle text-fg">เครื่องคั่วกาแฟ 5 กก.</h3>
  <p className="text-body-sm text-fg-muted">ผู้ผลิต บจก. ไทยโรสเตอร์</p>
</VStack>
```

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `children` | `ReactNode` | — | |
| `direction` | `'column' \| 'row' \| 'column-reverse' \| 'row-reverse'` | `'column'` | `column-reverse` = ปุ่มคู่บนมือถือ |
| `gap` | `'0'\|'1'\|'2'\|'3'\|'4'\|'5'\|'6'\|'8'\|'10'\|'12'\|'16'\|'20'\|'24'\|'32'` | `'4'` | **ชุดที่อนุมัติเท่านั้น** — ไม่มี 7 9 11 14 18 28 |
| `align` | `'start'\|'center'\|'end'\|'stretch'\|'baseline'` | `'stretch'` | |
| `justify` | `'start'\|'center'\|'end'\|'between'` | `'start'` | |
| `wrap` | `boolean` | `false` (Stack) · `true` (HStack) | |
| `as` | `ElementType` | `'div'` | ใช้ `ul` `nav` `section` ให้ความหมายถูก |
| `className` | `string` | — | merge ด้วย `cn()` |

**`VStack`** = `direction="column"` · **`HStack`** = `direction="row" align="center" wrap`

`HStack` เปิด `wrap` มาให้เพราะ **ข้อความไทยยาวกว่าอังกฤษ 20–40%** (ข้อ 03) — แถวปุ่มที่พอดีในภาษาอังกฤษล้นในภาษาไทยเป็นเรื่องปกติ ไม่ใช่ข้อยกเว้น

### ทางหนีเมื่อ wrapper ไม่พอ

```tsx
import { stackStyles } from '@smego/ui';
<ul className={stackStyles({ gap: '2' })}>…</ul>
```

---

## 3 · Variants

Stack ไม่มี visual variant — เป็น layout primitive ที่ไม่วาดอะไรเลย ไม่มีพื้น ไม่มีขอบ ไม่มีเงา

**นี่เป็นการตัดสินใจ ไม่ใช่ความไม่ครบ** — ถ้า Stack วาดพื้นได้ มันจะกลายเป็น Card ที่สอง และทีมจะเลือกผิดตัว

| combination ที่ใช้บ่อย | ความหมาย |
|---|---|
| `<VStack gap="2">` | ข้อความซ้อนข้อความ (ดู §4 เรื่องระยะเชิงสายตา) |
| `<VStack gap="4">` | บล็อกเนื้อหาในการ์ด |
| `<VStack gap="6">` | กลุ่มฟอร์ม |
| `<HStack gap="2">` | badge หลายใบ · meta |
| `<HStack gap="3" justify="between">` | ราคา ↔ หน่วย |
| `<Stack direction="column-reverse" gap="3" className="md:flex-row md:justify-end">` | **ปุ่มคู่** — หลักอยู่บนบนมือถือ อยู่ขวาบนจอกว้าง |

---

## 4 · States

Stack **ไม่มี state** — ไม่รับ focus ไม่รับ pointer ไม่มี `data-*`

### ★ `min-w-0` ติดมาโดยค่าเริ่มต้น — ลบไม่ได้

ลูกของ flex มี `min-width: auto` ทำให้ไม่ยอมย่อต่ำกว่าความกว้างเนื้อหา ถ้าข้างในมีตารางที่ `overflow-x: auto` หรือข้อความยาวที่ไม่มีช่องว่าง จะดัน body ให้เลื่อนแนวนอน = **ไม่ผ่าน SC 1.4.10**

พบจริงตอน render เอกสารยาว: **วัดได้ `documentElement.scrollWidth` = 653px ที่ viewport 320px** หลังใส่ `min-w-0` วัดได้ 320 = 320

### ★ ระยะเชิงกล่อง ≠ ระยะเชิงสายตา (ข้อ 04 §5)

`text-body` มี `line-height` 28px บนตัวอักษร 16px = **half-leading 6px ในกล่องเอง ทั้งบนและล่าง**

ดังนั้น `gap="2"` (8px) ระหว่างข้อความสองบล็อก **ตาเห็นเป็น ~20px**

| ระยะที่ต้องการให้ตาเห็น | `gap` ที่ต้องใส่ (ข้อความ↔ข้อความ) | `gap` ที่ต้องใส่ (กล่อง↔กล่อง) |
|---|---|---|
| ~12px | `gap="0"` | `gap="3"` |
| ~20px | `gap="2"` | `gap="5"` |
| ~28px | `gap="4"` | `gap="7"` ✗ ไม่มี → ใช้ `"6"` หรือ `"8"` |

**ข้อความซ้อนข้อความจึงใช้ระยะน้อยกว่าที่รู้สึกเสมอ** — ถ้าดูห่างไป ให้ลด `gap` ก่อนเพิ่ม

---

## 5 · Accessibility

| เรื่อง | ข้อกำหนด |
|---|---|
| role | ไม่มี — เป็น `<div>` เปล่า **โดยตั้งใจ** |
| `as` | ใช้ `ul`/`ol` เมื่อเป็นรายการจริง แล้วลูกต้องเป็น `<li>` |
| **SC 1.4.10** | `min-w-0` บังคับติดมา — ห้ามลบด้วย `className="min-w-[…]"` |
| **SC 1.4.12** | `gap` เป็น `rem` ทั้งชุด ยืดตามที่ผู้ใช้บังคับระยะตัวอักษร |
| **SC 1.3.2** | ⚠️ `column-reverse` / `row-reverse` **เปลี่ยนลำดับที่ตาเห็น แต่ไม่เปลี่ยนลำดับ DOM** |

### ⚠️ `*-reverse` กับลำดับการอ่าน

`flex-col-reverse` ทำให้ปุ่มหลักที่อยู่ **หลัง** ใน DOM ปรากฏ **บน** จอ ผู้ใช้ screen reader และผู้ใช้คีย์บอร์ดยังเจอ "ยกเลิก" ก่อน "ยืนยัน"

**นี่เป็นพฤติกรรมที่ต้องการ** สำหรับปุ่มคู่ — ปุ่มทำลายควรถูกเจอก่อนโดยคีย์บอร์ด แต่ไม่ควรเด่นทางสายตา

**ห้ามใช้ `*-reverse` กับเนื้อหาที่ลำดับมีความหมาย** เช่นขั้นตอน ผลการค้นหา หรือรายการที่เรียงตามเวลา ให้เรียง DOM ใหม่แทน

---

## 6 · Tailwind implementation

```ts
const stackStyles = cva(['flex', 'min-w-0'], {
  variants: {
    direction: {
      column: 'flex-col',
      row: 'flex-row',
      'column-reverse': 'flex-col-reverse',
      'row-reverse': 'flex-row-reverse',
    },
    gap: { '0': 'gap-0', '1': 'gap-1', /* … ชุดที่อนุมัติ … */ '32': 'gap-32' },
    align: { start: 'items-start', center: 'items-center', end: 'items-end',
             stretch: 'items-stretch', baseline: 'items-baseline' },
    justify: { start: 'justify-start', center: 'justify-center',
               end: 'justify-end', between: 'justify-between' },
    wrap: { true: 'flex-wrap', false: 'flex-nowrap' },
  },
  defaultVariants: {
    direction: 'column', gap: '4', align: 'stretch', justify: 'start', wrap: false,
  },
});
```

`gap` ถูกเขียนเป็น literal map **ไม่ใช่** `` gap-${n} `` เพราะ Tailwind v4 สแกนไฟล์เป็นข้อความ — class ที่ประกอบขึ้นตอน runtime จะไม่ถูกสร้าง

---

## 7 · Figma Variant

Stack ไม่เป็น component ใน Figma — เป็น **Auto Layout**

| Stack prop | Figma Auto Layout |
|---|---|
| `direction="column"` | Vertical |
| `direction="row"` | Horizontal |
| `direction="*-reverse"` | ไม่มีในตรง ๆ → สลับลำดับเลเยอร์ + **ใส่หมายเหตุว่า DOM สลับกัน** |
| `gap` | Gap between items · ผูกกับตัวแปร `Scale/space/{n}` |
| `align` | Alignment (cross axis) |
| `justify="between"` | Space between |
| `wrap` | Wrap |

**ห้ามพิมพ์ตัวเลข gap มือ** — ต้องผูกกับตัวแปร `Scale/space/*` ไม่เช่นนั้นระยะจะ drift จากโค้ดทันทีที่มีคนลากปรับ

---

## 8 · Usage

```tsx
// เนื้อหาในการ์ดสินค้า
<VStack gap="3">
  <HStack gap="2">
    <Badge variant="success" label="มีสินค้า" />
    <Badge variant="neutral" label="มอก." />
  </HStack>
  <h3 className="text-subtitle text-fg">เครื่องคั่วกาแฟ 5 กก.</h3>
  <p className="text-body-sm text-fg-muted">ผู้ผลิต บจก. ไทยโรสเตอร์</p>
  <Divider />
  <HStack gap="2" justify="between">
    <span className="text-title text-fg font-numeric">1,250,000</span>
    <span className="text-caption text-fg-muted">บาท</span>
  </HStack>
</VStack>
```

```tsx
// ปุ่มคู่ — ปุ่มหลักอยู่บนบนมือถือ อยู่ขวาบนจอกว้าง (ข้อ 08 §7)
<Stack direction="column-reverse" gap="3" className="md:flex-row md:justify-end">
  <Button variant="secondary">ยกเลิก</Button>
  <Button variant="primary">ยื่นคำขอสินเชื่อ</Button>
</Stack>
```

```tsx
// รายการจริง — ต้องเป็น ul/li ไม่ใช่ div
<VStack as="ul" gap="2">
  {orders.map((o) => <li key={o.id}>…</li>)}
</VStack>
```

---

## 9 · Anti-patterns

| ❌ | ✅ | ทำไม |
|---|---|---|
| `<div className="space-y-4">` | `<VStack gap="4">` | `space-y-*` ใช้ `margin` ที่ลูก — พังเมื่อลูกมี `wrap` หรือมี element ที่ซ่อนอยู่ |
| `<VStack className="gap-7">` | `gap="6"` หรือ `"8"` | 28px ไม่อยู่ในชุดที่อนุมัติ (ข้อ 04) |
| `<VStack className="min-w-[200px]">` | `<VStack>` ครอบด้วยตัวที่กว้างขั้นต่ำ | ลบ `min-w-0` = เสี่ยง SC 1.4.10 กลับมา |
| `<HStack>` แล้วหวังว่าไม่ล้น | `<HStack>` (wrap เปิดอยู่แล้ว) หรือ `<Grid>` | ข้อความไทยยาวกว่า 20–40% — มันจะล้น |
| `<Stack direction="column-reverse">` กับผลการค้นหา | เรียง DOM ใหม่ | ลำดับที่เห็นต่างจากลำดับที่ประกาศ = ไม่ผ่าน SC 1.3.2 |
| `<VStack className="bg-surface p-4 border">` | `<Card>` | Stack ที่วาดพื้นได้จะกลายเป็น Card ตัวที่สองที่ drift แยกกัน |
| `<VStack gap="4">` ระหว่างสองย่อหน้า | `gap="2"` | half-leading 6px×2 ทำให้ 16px ตาเห็นเป็น 28px |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง ไม่มีแถวไหนอธิบายพฤติกรรมซ้ำ (นั่นคืองานของ §4 และ §5)

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · axe ผ่านใน `a11y/primitives.test.tsx` รวมกรณี "ปุ่มคู่" |
| ตอบสนอง (Responsive) | ✅ | §1 `SC 1.4.10` ปุ่มคู่ซ้อนแนวตั้งที่จอแคบและเรียงแนวนอนที่จอกว้าง — ตรงกับที่ [`Button §8`](../inputs/Button.md) ใช้ `flex-col-reverse` |
| โหมดมืด (Dark Mode) | ✅ | `lint-classes.mjs` 0 จุด — ทุกสีมาจาก token ที่ override ในโหมดมืดแล้ว |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | `lint-quality.mjs` 0 จุด — ไม่มี `ml-`/`pl-`/`left-` ในไฟล์นี้ |
| คีย์บอร์ด (Keyboard) | — | Stack เป็นภาชนะที่ไม่มีตัวควบคุมของตัวเอง · `SC 1.3.2` ลำดับที่อ่านตรงกับลำดับที่เห็น |
| กำลังโหลด (Loading) | — | ไม่มีข้อมูลของตัวเอง |
| ข้อผิดพลาด (Error) | — | ไม่มีข้อมูลของตัวเอง |
| ว่างเปล่า (Empty) | — | Stack ที่ไม่มีลูกไม่กินพื้นที่อยู่แล้ว (`gap` ไม่สร้างระยะเมื่อไม่มีของ) |
| Skeleton | — | ตัวแทนระหว่างโหลดใส่เป็นลูกของ Stack |
| การเคลื่อนไหว (Animation) | — | ไม่มี `transition` หรือ `animate` ในไฟล์นี้เลย |
| ประสิทธิภาพ (Performance) | ✅ | `gap` ล้วน ไม่มี margin ที่ยุบรวมกัน · `SC 1.4.12` ไม่มีความสูงตายตัว |
