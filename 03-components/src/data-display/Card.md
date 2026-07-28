# Card · CardMedia

**`@smego/ui`** · ชั้น 03 · [Card.tsx](./Card.tsx)

---

## 1 · ภาพรวม

พื้นผิวที่ **ยกเนื้อหาขึ้นจากพื้นหลัง** และรวมของที่เกี่ยวข้องกันไว้เป็นหน่วยเดียว

Card เป็นฐานของทุก card ในชั้น Marketplace (`EntityCard` → Product / Service / Program / Grant / Training) จึงเป็นจุดที่กฎเรื่องเงา · radius · และ `overflow` ต้องถูกต้องครั้งเดียว

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน | เหตุผล |
|---|---|---|
| แค่จัดกลุ่มระยะ | `<VStack>` | Card วาดพื้น+ขอบ ซึ่งเพิ่มน้ำหนักสายตาโดยไม่จำเป็น |
| ข้อความแจ้งเตือน | `<Alert>` (Pass 3) | ต้องมี `role="status"`/`"alert"` และไอคอนตามระดับ |
| ของที่ลอยทับเนื้อหา | `<Dialog>` | ต้องมี focus management และปิดด้วย Esc |
| ทุกแถวในรายการยาว | ตาราง หรือรายการเปล่า | 60 card × ขอบ+พื้น = น้ำหนักสายตาที่อ่านไม่ออกว่าอะไรสำคัญ |

---

## 2 · React API

```tsx
import { Card, CardMedia } from '@smego/ui';

<Card as="article" interactive>
  <CardMedia><img src={src} alt="" className="aspect-4/3 w-full object-cover" /></CardMedia>
  …
</Card>
```

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `elevation` | `'flat' \| 'raised' \| 'floating' \| 'overlay'` | `'raised'` | `raised` **ไม่มีเงา** — ดู §3 |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | `md` = 16px → 24px ที่ md |
| `interactive` | `boolean` | `false` | เงาโผล่ตอน hover **และ focus-within** |
| `selected` | `boolean` | `false` | ขอบเป็นสีแบรนด์ |
| `as` | `ElementType` | `'div'` | `'article'` สำหรับ card สินค้า · `'li'` ในรายการ |
| `className` | `string` | — | |

### CardMedia

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `position` | `'top' \| 'full'` | `'top'` | กำหนดว่ามุมไหนโค้ง |

### ทางหนีเมื่อ wrapper ไม่พอ

```tsx
import { cardStyles } from '@smego/ui';
<article className={cardStyles({ padding: 'lg', interactive: true })}>…</article>
```

---

## 3 · Variants

| elevation | พื้น | ขอบ | เงา | ใช้เมื่อไร |
|---|---|---|---|---|
| `flat` | `--elevation-surface-raised` | `--elevation-edge-raised` | **ไม่มี** | อยู่ในกระแสของหน้า |
| `raised` | `--elevation-surface-raised` | `--elevation-edge-raised` | **ไม่มี** | card ตอนพัก (ค่าเริ่มต้น) |
| `floating` | `--elevation-surface-floating` | `--elevation-edge-floating` | `--elevation-floating` | dropdown · popover |
| `overlay` | `--elevation-surface-overlay` | `--elevation-edge-overlay` | `--elevation-overlay` | ของที่ลอยทับเนื้อหา |

### ★★ `raised` ไม่มีเงา — เป็นการตัดสินใจ ไม่ใช่การลืม

เกณฑ์อุปกรณ์ในข้อ 01 คือ **Android ระดับล่างบนเน็ต 4G ต่างจังหวัด**

หน้ารายการแสดง card 20–60 ใบ · เงา 2 ชั้นต่อใบ = **blur 40–120 ครั้งต่อ repaint** ซึ่งเห็นผลจริงตอน scroll ไม่ใช่ทฤษฎี

และได้ประโยชน์ด้านการออกแบบด้วย — การเปลี่ยนจาก **"ไม่มีเงา" → "มีเงา"** ตาอ่านชัดกว่าการเปลี่ยนจาก `sm` → `md` มาก (ข้อ 06 §5) เงาจึงถูกเก็บไว้เป็น **สัญญาณ** ไม่ใช่การตกแต่ง

### ★ ต้องใช้ `--elevation-*` ห้าม `shadow-*` ตรง

component ที่เขียน `shadow-md` จะได้เงาติดไปในโหมดมืด **ซึ่งมองไม่เห็น** และเท่ากับ **ไม่มีกลไกแยกตัวเองจากพื้นหลังในโหมดมืดเลย**

`--elevation-*` กำหนด **ทั้งเงา (สว่าง) และพื้นผิว+ขอบ (มืด)** พร้อมกันในโทเคนเดียว — ยืนยันแล้วใน browser: โหมดมืด card แยกจากพื้นด้วยขอบ ไม่ใช่เงา

---

## 4 · States

| state | ที่มา | สิ่งที่เปลี่ยน |
|---|---|---|
| default | — | ขอบ `--elevation-edge-raised` · ไม่มีเงา |
| hover | `interactive` + `hover:` | `shadow-(--elevation-floating)` |
| **focus-within** | `interactive` + `focus-within:` | เงาเดียวกับ hover |
| selected | prop `selected` | `border-edge-brand` |

### ★ `focus-within` จำเป็น ไม่ใช่ทางเลือก

ผู้ใช้คีย์บอร์ดต้องได้สัญญาณเดียวกับผู้ใช้เมาส์ ถ้ามีแค่ `hover:` ผู้ใช้ Tab เข้าไปในการ์ดจะเห็นแค่วงแหวนรอบลิงก์ **แต่ไม่เห็นว่าการ์ดทั้งใบคือหน่วยเดียวกัน**

### ★ ค่า contrast ของขอบตอน `selected`

| ธีม | ขอบ vs พื้น card | ผ่าน 3:1 (SC 1.4.11) |
|---|---|---|
| สว่าง | **4.76** | ✅ |
| มืด | **3.86** | ✅ |

---

## 5 · Accessibility

| เรื่อง | ข้อกำหนด |
|---|---|
| role | ไม่มี — ใช้ `as="article"` ให้ความหมาย |
| **SC 2.4.7** | ⚠️ **ห้าม `overflow-hidden` บน Card ที่มีลิงก์** ดูด้านล่าง |
| **SC 1.4.11** | ขอบ `selected` วัดแล้วผ่านทั้งสองธีม |
| **SC 1.4.10** | `min-w-0` ติดมาโดยค่าเริ่มต้น |
| **SC 2.5.3** | ถ้าทั้งใบกดได้ ชื่อที่ประกาศต้องมีข้อความที่แสดงอยู่รวมด้วย |
| heading | หัวข้อในการ์ดต้องอยู่ในลำดับที่ถูก — `<h3>` ในหน้าที่มี `<h2>` |

### ★★ ห้าม `overflow-hidden` บน Card ที่มีลิงก์ข้างใน

วงแหวน focus ล้นออกนอกขอบ **4px** (`outline 2px` + `offset 2px`) จะถูกตัด = **ไม่ผ่าน SC 2.4.7**

ใส่ radius ที่ตัว `<img>` เองแทน ผ่าน `<CardMedia>` — ได้ **concentric radius ถูกต้อง** ด้วย:

```
radius ใน = radius นอก − padding
12 − 8 = 4 = xs        (ข้อ 05 §5)
```

`CardMedia` วาง `overflow-hidden` ไว้ที่ **ตัวห่อรูปเท่านั้น** ไม่ใช่ที่ Card จึงตัดเฉพาะรูป ไม่ตัดวงแหวนของลิงก์ในส่วนเนื้อหา

### card ที่กดได้ทั้งใบ

ใช้ **link overlay** ไม่ใช่ `onClick` บน Card:

```tsx
<Card as="article" interactive className="relative">
  <h3><Link href={url} className="after:absolute after:inset-0">{title}</Link></h3>
  {/* ปุ่มอื่นต้องมี z-index สูงกว่า overlay */}
  <Button className="relative z-(--z-raised)">บันทึก</Button>
</Card>
```

ทำแบบนี้ผู้ใช้ยัง **เปิดแท็บใหม่ได้ · คัดลอก URL ได้ · screen reader ประกาศเป็นลิงก์** ซึ่ง `onClick` ให้ไม่ได้เลย

---

## 6 · Tailwind implementation

```ts
const cardStyles = cva(
  [
    'min-w-0',
    'rounded-(--radius-container)',
    'border',
    'bg-(--elevation-surface-raised)',
    'border-(--elevation-edge-raised)',
  ],
  {
    variants: {
      elevation: {
        flat: 'shadow-none',
        raised: 'shadow-none',
        floating: ['shadow-(--elevation-floating)',
                   'bg-(--elevation-surface-floating)',
                   'border-(--elevation-edge-floating)'],
        overlay: ['shadow-(--elevation-overlay)',
                  'bg-(--elevation-surface-overlay)',
                  'border-(--elevation-edge-overlay)'],
      },
      padding: { none: 'p-0', sm: 'p-3', md: 'p-4 md:p-6', lg: 'p-6 md:p-8' },
      interactive: {
        true: ['transition-shadow duration-fast ease-standard',
               'hover:shadow-(--elevation-floating)',
               'focus-within:shadow-(--elevation-floating)'],
        false: '',
      },
      selected: { true: 'border-edge-brand', false: '' },
    },
    defaultVariants: {
      elevation: 'raised', padding: 'md', interactive: false, selected: false,
    },
  },
);
```

---

## 7 · Figma Variant

Component set **`Card`**

| Property | Values |
|---|---|
| `Elevation` | `Flat` · `Raised` · `Floating` · `Overlay` |
| `Padding` | `None` · `SM` · `MD` · `LG` |
| `State` | `Default` · `Hover` · **`Focus-within`** · `Selected` |

**variant ที่ห้ามลืมคือ `Focus-within`** — นักออกแบบมักสร้างแค่ Hover แล้วนักพัฒนาไม่รู้ว่าต้องทำ

**ต้องมี frame ตัวอย่างที่ 136px** — ถ้า card ที่ออกแบบไว้อ่านไม่ออกที่ความกว้างนี้ แปลว่า design ยังไม่เสร็จ ไม่ใช่ว่า breakpoint ผิด

**ห้ามใส่ Drop shadow บน `Raised`** — ให้ผูก effect กับตัวแปร `Semantic/elevation/*` ซึ่งเป็น none ในโหมด Raised ทั้งสอง mode

---

## 8 · Usage

```tsx
<Card as="article" interactive>
  <CardMedia>
    <img src={p.image} alt="" className="aspect-4/3 w-full object-cover" />
  </CardMedia>
  <VStack gap="3" className="mt-4">
    <HStack gap="2">
      <Badge variant="success">มีสินค้า</Badge>
    </HStack>
    <h3 className="text-subtitle text-fg">เครื่องคั่วกาแฟ 5 กก.</h3>
    <p className="text-body-sm text-fg-muted">ผู้ผลิต บจก. ไทยโรสเตอร์</p>
    <Divider />
    <HStack gap="2" justify="between">
      <span className="text-title text-fg font-numeric">1,250,000</span>
      <span className="text-caption text-fg-muted">บาท</span>
    </HStack>
    <Button size="sm" fullWidth>ดูรายละเอียด</Button>
  </VStack>
</Card>
```

```tsx
// card ที่เลือกอยู่ในการเปรียบเทียบ
<Card as="li" selected={isComparing} interactive>…</Card>
```

---

## 9 · Anti-patterns

| ❌ | ✅ | ทำไม |
|---|---|---|
| `<Card className="overflow-hidden">` | `<CardMedia>` | ตัดวงแหวน focus 4px = ไม่ผ่าน SC 2.4.7 |
| `<Card className="shadow-md">` | `elevation="floating"` | `shadow-*` ตรงมองไม่เห็นในโหมดมืด และไม่มีขอบมาแทน |
| `elevation="raised"` แล้วเพิ่มเงาเอง | ปล่อยไม่มีเงา | 60 ใบ × 2 ชั้น = 120 blur ต่อ repaint บน Android ระดับล่าง |
| `<Card onClick={goToProduct}>` | link overlay ด้วย `after:absolute` | `onClick` ทำให้เปิดแท็บใหม่ไม่ได้ คัดลอก URL ไม่ได้ |
| `interactive` แต่มีแค่ `hover:` | ใช้ prop `interactive` | ผู้ใช้คีย์บอร์ดไม่ได้สัญญาณ |
| `<Card>` ทุกแถวของรายการ 60 รายการ | ตาราง หรือรายการเปล่า | ทุกอย่างเด่นเท่ากัน = ไม่มีอะไรเด่น |
| `<Card><h1>` ในหน้าที่มี h1 อยู่แล้ว | `<h3>` ตามลำดับจริง | ผู้ใช้ screen reader สำรวจหน้าด้วยโครงหัวข้อ (SC 1.3.1) |
| `padding="none"` แล้วใส่ `p-5` เอง | `padding="md"` | 20px ทำให้ concentric radius ผิด (12−20 < 0) |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง ไม่มีแถวไหนอธิบายพฤติกรรมซ้ำ (นั่นคืองานของ §4 และ §5)

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · axe ผ่านใน `a11y/primitives.test.tsx` · `SC 2.4.7` วงแหวน focus ไม่ถูกตัด |
| ตอบสนอง (Responsive) | ✅ | `min-w-0` ทุกชั้น · `SC 1.4.10` ยืดได้ถึง 136px ตามที่ [`EntityCard`](../marketplace/EntityCard.md) วัดไว้ |
| โหมดมืด (Dark Mode) | ✅ | §4 ตาราง "ธีม สว่าง/มืด" · หัวไฟล์ [Card.tsx](./Card.tsx) ระบุว่า**ห้ามใช้ `shadow-*` ตรง** เพราะเงาจะติดไปในโหมดมืดซึ่งมองไม่เห็น — ใช้ `--elevation-*` ที่เปลี่ยนเป็นขอบสว่างแทน |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | `lint-quality.mjs` 0 จุด — ไม่มี `ml-`/`pl-`/`left-` ในไฟล์นี้ |
| คีย์บอร์ด (Keyboard) | ✅ | §4 `focus-within` ให้เงาเดียวกับ `hover` — ผู้ใช้ `Tab` เห็นสิ่งเดียวกับผู้ใช้เมาส์ (คอมเมนต์ [Card.tsx:67](./Card.tsx)) |
| กำลังโหลด (Loading) | — | Card เป็นภาชนะ · สถานะโหลดเป็นของเนื้อหาข้างใน |
| ข้อผิดพลาด (Error) | — | ข้อผิดพลาดใช้ [`<Alert>`](../feedback/Alert.md) วางในเนื้อหา |
| ว่างเปล่า (Empty) | — | การ์ดที่ไม่มีเนื้อหาคือการ์ดที่ไม่ควร render |
| Skeleton | — | ตัวแทนระหว่างโหลดใช้ [`<Skeleton>`](../feedback/Skeleton.md) วางแทนเนื้อหาข้างใน ไม่ใช่แทนทั้งใบ |
| การเคลื่อนไหว (Animation) | ✅ | `transition-shadow` เท่านั้น · `box-shadow` อยู่ในรายการ **ALLOW** ของ `base.css §10` โดยตั้งใจ ไม่มีการเคลื่อนที่ให้ตัด · `base.css §10` ครอบ `*` ด้วย `!important` — ไม่มีการเคลื่อนไหวที่หลุดตัวกัน (`lint-quality.mjs` 0 จุด) |
| ประสิทธิภาพ (Performance) | ✅ | พักอยู่**ไม่มีเงา มีแค่ขอบ** (คอมเมนต์ [Card.tsx:8](./Card.tsx)) — เงาเกิดเฉพาะตอน hover/focus จึงไม่มีต้นทุน paint ในกริดที่มีการ์ดหลายสิบใบ |
