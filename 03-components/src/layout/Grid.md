# Grid · Container · Section · Divider

**`@smego/ui`** · ชั้น 03 · [Grid.tsx](./Grid.tsx)

---

## 1 · ภาพรวม

สี่ตัวที่ประกอบเป็น **โครงหน้า** — กริดเนื้อหา · ความกว้างสูงสุด · ระยะแนวตั้งระหว่าง section · เส้นคั่น

ตัวที่สำคัญที่สุดคือ `Grid` เพราะ **จำนวนคอลัมน์ต่อ breakpoint ถูกคำนวณไว้แล้วในข้อ 08 §4.1** และไม่ควรถูกเดาใหม่ทุกหน้า

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน | เหตุผล |
|---|---|---|
| เรียงของเป็นแถวเดียว | `<HStack>` | grid ที่มีคอลัมน์เดียวคือ flex ที่เขียนยากกว่า |
| ตารางข้อมูล | [`<Table>`](../data-display/Table.md) | ตารางต้องมี `<th>` และ `scope` — grid ไม่มีความหมายเชิงตาราง |
| ระยะภายในการ์ด | `padding` ของ `<Card>` | |
| เส้นใต้หัวข้อ | `border-b` บนหัวข้อ | `<hr>` ประกาศเป็น separator ให้ screen reader ซึ่งผิดความหมาย |

---

## 2 · React API

### Grid

```tsx
import { Grid } from '@smego/ui';

<Grid preset="product">
  {products.map((p) => <ProductCard key={p.id} {...p} />)}
</Grid>
```

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `preset` | `'product' \| 'product-filtered' \| 'cards' \| 'split' \| 'sidebar' \| 'none'` | `'product'` | **ใช้ preset ก่อนตั้ง cols เอง** |
| `gutter` | `'responsive' \| '2' \| '3' \| '4' \| '6' \| '8'` | `'responsive'` | `responsive` = 16px → 24px ที่ md |
| `as` | `ElementType` | `'div'` | `'ul'` เมื่อเป็นรายการ |
| `className` | `string` | — | |

### Container

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `size` | `'form' \| 'narrow' \| 'content' \| 'wide' \| 'full'` | `'content'` | 560 / 768 / 1280 / 1440 / ไม่จำกัด |
| `padded` | `boolean` | `true` | 16 → 24 → 32px |

### Section

| prop | type | ค่าเริ่มต้น |
|---|---|---|
| `as` | `ElementType` | `'section'` |

### Divider

| prop | type | ค่าเริ่มต้น |
|---|---|---|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` |

---

## 3 · Variants

### preset — ค่าที่คำนวณไว้แล้ว ไม่ใช่ค่าที่เลือกตามความรู้สึก

| preset | คลาสจริง | ใช้เมื่อไร |
|---|---|---|
| `product` | `grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5` | กริดสินค้าเต็มความกว้าง |
| `product-filtered` | `grid-cols-2 lg:grid-cols-3 xl:grid-cols-4` | มีแถบตัวกรองด้านข้าง |
| `cards` | `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` | card ใหญ่ — โครงการรัฐ แหล่งทุน |
| `split` | `grid-cols-1 lg:grid-cols-2` | สองคอลัมน์ที่ยุบบนมือถือ |
| `sidebar` | `grid-cols-1 lg:grid-cols-[17.5rem_1fr]` | เนื้อหา + แถบข้าง 280px |

### ตารางความกว้าง card ที่คำนวณไว้ (ข้อ 08 §4.1)

| viewport | ไม่มีตัวกรอง | มีตัวกรอง 280px | ความกว้าง card |
|---|---|---|---|
| **320px** | 2 | 2 (drawer) | **136px** ← แคบสุดที่ต้องรองรับ |
| 360px | 2 | 2 (drawer) | 156px |
| 768px | 3 | 2 (drawer) | 224px |
| 1024px | 4 | 3 | 202px |
| 1280px | 5 | 4 | 210px |

**136px เป็นเกณฑ์ผ่าน/ไม่ผ่านของทุก card** ไม่ใช่เป้าหมายที่ดีจะมี

### ★ ตัวกรองเป็น drawer จนถึง `lg` (1024px) ไม่ใช่ `md`

ที่ 768px การหั่น 720px เป็นตัวกรอง 280 + เนื้อหา 416 ทำให้ card เหลือ **196px ต่อ 2 ใบ** ซึ่ง **แคบกว่า** ตอนไม่มีตัวกรองที่ได้ 3 ใบ 224px

**เสียทั้งจำนวนและขนาดพร้อมกัน** — จึงไม่ทำ

---

## 4 · States

ทั้งสี่ตัวไม่มี state · ไม่รับ focus · ไม่มี `data-*`

### ★ `min-w-0` บนทั้ง grid **และทุกลูก**

```
['grid', 'min-w-0', '[&>*]:min-w-0']
```

`[&>*]:min-w-0` เป็นสิ่งที่ Stack ไม่ต้องมีแต่ Grid ต้องมี — ลูกของ grid มี `min-width: auto` เหมือนกัน แต่ต่างจาก flex ตรงที่ **grid item ไม่มีทางกำหนดจากภายนอกได้** ถ้าไม่ประกาศที่ตัว grid

ถ้าไม่มีบรรทัดนี้ card ที่มีชื่อสินค้ายาวไม่มีช่องว่างจะดันคอลัมน์ให้กว้างเกิน `1fr` และดัน body ให้เลื่อนแนวนอน = **ไม่ผ่าน SC 1.4.10**

**ยืนยันแล้วด้วยการวัดจริง:** `documentElement.scrollWidth` = 320 ที่ viewport 320

### ★ `Section` เป็นระยะเดียวในระบบที่เปลี่ยนตาม breakpoint

`py-(--space-section)` — 48 → 64 → 80px

เหตุผลที่ต้อง responsive ต่างจากระยะอื่น: **80px บนจอ 360px กินความสูงไปกว่า 20%** ส่วน **48px บนจอ 1920px ทำให้ section ดูเชื่อมกันเป็นก้อนเดียว** ไม่มีค่าเดียวที่ถูกทั้งสองฝั่ง

---

## 5 · Accessibility

| เรื่อง | ข้อกำหนด |
|---|---|
| **SC 1.4.10** | `min-w-0` ทั้งบน grid และลูก — ห้ามลบ |
| **SC 1.3.2** | ลำดับ DOM = ลำดับที่อ่าน · **ห้ามใช้ `order-*` หรือ `grid-row-start` จัดตำแหน่งใหม่** |
| **SC 1.3.1** | `Divider` render เป็น `<hr>` ซึ่งได้ `role="separator"` มาเอง |
| `aria-orientation` | ใส่ให้เมื่อเป็นแนวตั้ง — `<hr>` ไม่ประกาศเอง |
| **SC 1.4.11** | `Divider` เป็น **ขอบตกแต่ง** จึงได้รับยกเว้นจาก 3:1 · ใช้ `edge-subtle` ได้ |
| `as="ul"` | ต้องมี `<li>` เป็นลูกตรงเท่านั้น ไม่งั้นโครงสร้างรายการพัง |

### ⚠️ `preset="sidebar"` กับลำดับการอ่าน

`grid-cols-[17.5rem_1fr]` วางแถบข้าง**ก่อน**เนื้อหา ซึ่งหมายความว่าผู้ใช้คีย์บอร์ดต้อง Tab ผ่านตัวกรองทั้งหมดก่อนถึงผลการค้นหา

**ต้องมี skip link** ไปที่เนื้อหาหลัก — เป็นเงื่อนไข ไม่ใช่ทางเลือก (SC 2.4.1)

[`<TopNav>`](../navigation/TopNav.md) render ลิงก์ให้แล้ว และ [`<Main>`](./Main.md) เป็นเป้าของมัน — ใช้คู่กันแล้วผ่านข้อนี้เอง

> ⚠️ บรรทัดนี้เคยเขียนว่า "จะถูกจัดการที่ระดับ Template ในชั้น 05" ซึ่งผิดสองชั้น: ลิงก์มีอยู่ใน `TopNav` ตั้งแต่ต้น และ**ชั้น 05 ไม่ทำ** (คำตัดสิน 2026-07-29) · ภาระ SC 2.4.1 ที่ฝากไว้กับชั้นที่ไม่เกิดคือภาระที่ไม่มีเจ้าของ

---

## 6 · Tailwind implementation

```ts
const gridStyles = cva(['grid', 'min-w-0', '[&>*]:min-w-0'], {
  variants: {
    preset: {
      product: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
      'product-filtered': 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      cards: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      split: 'grid-cols-1 lg:grid-cols-2',
      sidebar: 'grid-cols-1 lg:grid-cols-[17.5rem_1fr]',
      none: '',
    },
    gutter: { responsive: 'gap-4 md:gap-6', '2': 'gap-2', /* … */ '8': 'gap-8' },
  },
  defaultVariants: { preset: 'product', gutter: 'responsive' },
});

const containerStyles = cva(['mx-auto', 'w-full', 'min-w-0'], {
  variants: {
    size: {
      form:    'max-w-(--container-form)',     /*  560px */
      narrow:  'max-w-(--container-narrow)',   /*  768px */
      content: 'max-w-(--container-content)',  /* 1280px */
      wide:    'max-w-(--container-wide)',     /* 1440px */
      full:    'max-w-none',
    },
    padded: { true: 'px-4 md:px-6 lg:px-8', false: '' },
  },
  defaultVariants: { size: 'content', padded: true },
});
```

`Section` ไม่ใช้ CVA เพราะมี class เดียว: `py-(--space-section)`

---

## 7 · Figma Variant

| Component | Figma |
|---|---|
| `Grid` | **ไม่เป็น component** — เป็น Auto Layout แนวนอน + Wrap ที่ผูก gap กับ `Scale/space/*` |
| `Container` | Frame ที่มี Max width ผูกกับ `Scale/container/*` |
| `Section` | ระยะแนวตั้งผูกกับ `Scale/space/section` (มี 3 mode ตาม breakpoint) |
| `Divider` | Component `Divider` · property `Orientation = Horizontal \| Vertical` |

**ต้องสร้าง 5 frame ตัวอย่างของ `preset="product"`** ที่ความกว้าง 320 / 360 / 768 / 1024 / 1280 พร้อมชื่อระบุความกว้าง card ที่ได้ — เพื่อให้นักออกแบบเห็นว่า **136px คือของจริง** ไม่ใช่ตัวเลขในเอกสาร

---

## 8 · Usage

```tsx
<Container size="content">
  <Section>
    <h1 className="text-heading-lg text-fg">สินค้าจากผู้ผลิตไทย</h1>
    <Grid preset="product" className="mt-6">
      {products.map((p) => <ProductCard key={p.id} {...p} />)}
    </Grid>
  </Section>
</Container>
```

```tsx
// หน้าที่มีตัวกรองด้านข้าง
<Grid preset="sidebar" gutter="6">
  <FilterPanel />
  <Grid preset="product-filtered">…</Grid>
</Grid>
```

```tsx
// เส้นคั่นราคาออกจากรายละเอียด
<Divider />
<HStack gap="2" justify="between">
  <span className="text-title text-fg font-numeric">1,250,000</span>
  <span className="text-caption text-fg-muted">บาท</span>
</HStack>
```

---

## 9 · Anti-patterns

| ❌ | ✅ | ทำไม |
|---|---|---|
| `<Grid className="grid-cols-4">` | `preset="product"` | จำนวนคอลัมน์ถูกคำนวณจากความกว้าง card ขั้นต่ำ 136px — เดาใหม่แล้วพัง |
| ตัวกรองเป็นคอลัมน์ที่ `md` | drawer จนถึง `lg` | ที่ 768px เสียทั้งจำนวน card และขนาด |
| `<Grid className="[&>*]:min-w-fit">` | ปล่อยตามค่าเริ่มต้น | `min-w-fit` = `min-width: auto` กลับมา = SC 1.4.10 พัง |
| `<Container size="wide">` ทุกหน้า | `content` (1280) | 1440 สงวนไว้สำหรับ dashboard และตารางหนาแน่นเท่านั้น (ข้อ 08) |
| `<div className="py-20">` แทน Section | `<Section>` | 80px บนจอ 360px กินความสูงกว่า 20% |
| `<hr>` เป็นเส้นใต้หัวข้อ | `border-b` บน `<h2>` | `<hr>` ประกาศ separator ให้ screen reader — หัวข้อไม่ใช่การแบ่งเนื้อหา |
| `order-last` ย้าย card เด่นไปท้าย | เรียง array ก่อน render | ลำดับที่เห็น ≠ ลำดับที่อ่าน = ไม่ผ่าน SC 1.3.2 |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง ไม่มีแถวไหนอธิบายพฤติกรรมซ้ำ (นั่นคืองานของ §4 และ §5)

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · axe ผ่านใน `a11y/primitives.test.tsx` และ `a11y/marketplace.test.tsx` · `SC 1.3.1` `as="ul"` ทำให้ screen reader ประกาศจำนวนรายการ |
| ตอบสนอง (Responsive) | ✅ | `e2e/pass4.spec.ts:123` ไม่มี scroll แนวนอนที่ 320px (SC 1.4.10) · §3 `preset` กำหนดจำนวนคอลัมน์ต่อ breakpoint ไว้แล้ว **2 ใบที่ 320px คือของจริง** |
| โหมดมืด (Dark Mode) | ✅ | `lint-classes.mjs` 0 จุด — ทุกสีมาจาก token ที่ override ในโหมดมืดแล้ว |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | `lint-quality.mjs` 0 จุด — ไม่มี `ml-`/`pl-`/`left-` ในไฟล์นี้ |
| คีย์บอร์ด (Keyboard) | — | Grid เป็นภาชนะที่ไม่มีตัวควบคุมของตัวเอง — ลำดับ `Tab` เป็นของรายการข้างใน · `SC 1.3.2` ลำดับที่อ่านตรงกับลำดับที่เห็น |
| กำลังโหลด (Loading) | — | สถานะโหลดของชุดรายการเป็นของ [`SearchResult`](../marketplace/SearchResult.md) |
| ข้อผิดพลาด (Error) | — | Grid ไม่ยิง request เอง |
| ว่างเปล่า (Empty) | — | กริดว่างคือกริดที่ไม่ควร render — ผู้เรียกแสดง empty state แทน (ดู `SearchResult` และ `WishlistGrid`) |
| Skeleton | — | ตัวแทนระหว่างโหลดคือการ์ด skeleton ที่ใส่**เป็นลูก**ของกริด ไม่ใช่ตัวกริดเอง |
| การเคลื่อนไหว (Animation) | — | ไม่มี `transition` หรือ `animate` ในไฟล์นี้เลย — การจัดวางเป็นของนิ่ง |
| ประสิทธิภาพ (Performance) | ✅ | ใช้ CSS Grid ล้วน ไม่มี JS วัดขนาด · ไม่มีความสูงตายตัวจึงไม่ตัดเนื้อหาการ์ดที่ยาวไม่เท่ากัน |
