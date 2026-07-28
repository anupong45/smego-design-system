# Skeleton · SkeletonGroup · SkeletonText

**`@smego/ui`** · ชั้น 03 · [Skeleton.tsx](./Skeleton.tsx)

---

## 1 · ภาพรวม

ตัวแทนเนื้อหาระหว่างรอโหลด — บอก **โครงสร้างที่กำลังจะมา** ไม่ใช่แค่ "รอสักครู่"

ใช้เมื่อ **รู้รูปร่างของสิ่งที่จะมา** เช่นกริดสินค้า 12 ใบ หรือรายละเอียดผู้ขาย

### ★★★ เขตแดนกับ [`<Spinner>`](./Spinner.md) — ตัดสินไว้แล้ว (ASTRYX-PARITY.md §8.5)

| | ใช้เมื่อ |
|---|---|
| **`Skeleton`** | โหลด**เนื้อหาที่รู้รูปร่างล่วงหน้า** — การ์ด รายการ ตาราง |
| [**`Spinner`**](./Spinner.md) | **การกระทำที่รอผลโดยไม่รู้เวลา** — ปุ่มกำลัง submit, ยืนยันการชำระเงิน |

**ห้ามใช้ `Skeleton` กับการกระทำ** และห้ามใช้ `Spinner` แทนการโหลดเนื้อหา

ถ้าเส้นแบ่งนี้หาย จะได้ skeleton ที่ค้างอยู่หลังกดปุ่ม ซึ่งบอกว่า "เนื้อหากำลังมา" ทั้งที่สิ่งที่เกิดขึ้นจริงคือคำสั่งกำลังถูกประมวลผล — ผู้ใช้จะรอของที่ไม่มีอยู่

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน | เหตุผล |
|---|---|---|
| ไม่รู้ว่าจะได้อะไรมา | [`<Spinner>`](./Spinner.md) | skeleton ที่ผิดรูปทำให้ผู้ใช้คาดผิด |
| โหลดเร็วกว่า ~300ms | ไม่ต้องแสดงอะไร | กระพริบเข้า-ออกรบกวนกว่าการรอเงียบ |
| กดปุ่มแล้วรอ | `<Button isLoading>` | สถานะอยู่ที่ปุ่ม ไม่ใช่ที่หน้า |
| งานที่รู้ความคืบหน้า | [`<ProgressBar>`](./ProgressBar.md) | skeleton ไม่บอกว่าเหลืออีกเท่าไร |

---

## 2 · React API

```tsx
import { SkeletonGroup, SkeletonText, Skeleton } from '@smego/ui';

<SkeletonGroup isLoading={isLoading}>
  <Skeleton shape="media" lines="none" className="aspect-4/3" />
  <SkeletonText lines={2} size="body-sm" />
</SkeletonGroup>
```

### Skeleton

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `shape` | `'text' \| 'card' \| 'circle' \| 'media'` | `'text'` | **ต้องตรงกับ radius ของของจริง** |
| `lines` | `'caption' \| 'body-sm' \| 'body' \| 'title' \| 'none'` | `'body'` | ความสูง = line-height ของสเกลนั้น |
| `width` | `string` | `100%` | ใช้ `%` ให้ดูเป็นข้อความจริง |

### SkeletonGroup

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `isLoading` | `boolean` | — | ควบคุม `aria-busy` และการประกาศ |
| `label` | `string` | `s.common.loading` | ข้อความที่ screen reader ได้ยิน |

### SkeletonText

| prop | type | ค่าเริ่มต้น |
|---|---|---|
| `lines` | `number` | `3` |
| `size` | เหมือน `Skeleton.lines` | `'body'` |

---

## 3 · Variants

| shape | radius | แทนอะไร |
|---|---|---|
| `text` | `--radius-control` | บรรทัดข้อความ |
| `card` | `--radius-container` | การ์ดทั้งใบ |
| `circle` | `rounded-full` | avatar |
| `media` | `--radius-container` | รูปภาพ |

| lines | ความสูง | ตรงกับ |
|---|---|---|
| `caption` | `h-5` (20px) | `text-caption` / `text-label` |
| `body-sm` | `h-6` (24px) | `text-body-sm` |
| `body` | `h-7` (28px) | `text-body` |
| `title` | `h-8` (32px) | `text-title` |

### ★ radius และความสูงต้องตรงกับของจริง

ถ้า skeleton มี radius หรือความสูงต่างจาก element ที่จะมาแทน จะเห็น **มุมกระตุกและ layout ขยับ** ตอน content โหลดเสร็จ

ความสูงจึงอิงจาก `line-height` ของสเกลตัวอักษร **ไม่ใช่ค่าลอย ๆ** — `h-7` ไม่ได้เลือกเพราะดูดี แต่เพราะ `text-body` มี line-height 28px

### ★ บรรทัดสุดท้ายของ `SkeletonText` สั้นกว่า (62%)

ข้อความจริงมักไม่เต็มบรรทัดสุดท้าย ทำให้ skeleton **ดูเป็นข้อความ** ไม่ใช่แถบสีเรียงกัน

---

## 4 · States

| state | พฤติกรรม |
|---|---|
| กำลังโหลด | `motion-safe:animate-pulse` · `aria-busy="true"` |
| **reduced motion** | **พื้นนิ่ง** — ไม่ใช่ชะลอ |
| โหลดเสร็จ | ผู้เรียกเปลี่ยน `isLoading` แล้ว render เนื้อหาจริง |

### ★★ ต้องปรากฏ **ทันที ไม่ fade เข้า** (ข้อ 07 §7.3)

การ fade เข้าของ skeleton คือ **การหน่วงสัญญาณว่ากำลังโหลด** ซึ่งกลับหัวกลับหางกับหน้าที่ของมัน

component จึงไม่มี `data-entering:animate-*` เลย และ **ห้ามเพิ่ม**

### ★★ reduced motion → พื้นนิ่ง ไม่ใช่ชะลอ

`base.css` มีกฎอยู่แล้ว:

```css
.skeleton {
  animation: none;
  background-image: none;
  background-color: var(--color-sunken);
}
```

การเคลื่อนไหวแบบแถบไล่สีที่เลื่อนเป็น **การตกแต่ง** ไม่ได้สื่อข้อมูลที่หาจากที่อื่นไม่ได้ จึงอยู่ในรายการ **DENY** ของข้อ 17 ไม่ใช่ ALLOW

**ต่างจาก spinner และ progress bar** ซึ่งอยู่ใน ALLOW เพราะการหยุดหมุนของ spinner = ไม่มีอะไรบอกว่ายังทำงานอยู่

class `skeleton` มีไว้ให้ `base.css` จับได้ — **ห้ามลบ**

---

## 5 · Accessibility

| เรื่อง | ข้อกำหนด |
|---|---|
| `Skeleton` | `aria-hidden="true"` — ไม่มีความหมายกับ screen reader |
| `SkeletonGroup` | `aria-busy` + `aria-live="polite"` ประกาศ **ครั้งเดียว** |
| **SC 4.1.3** | สถานะโหลดถูกประกาศโดยไม่ต้องย้าย focus |
| **SC 2.3.3** | reduced motion → พื้นนิ่ง |
| **SC 2.3.1** | `animate-pulse` เป็น opacity ที่ช้ากว่า 3 ครั้ง/วินาที มาก |

### ★★ `aria-hidden` + ข้อความใน live region

skeleton เป็นภาพแทนที่**ไม่มีความหมาย**กับ screen reader

สิ่งที่ผู้ใช้ที่มองไม่เห็นต้องได้ยินคือ **"กำลังโหลด" ครั้งเดียว** ไม่ใช่ **กล่องเปล่า 20 กล่อง**

ถ้าไม่ห่อด้วย `SkeletonGroup` ผู้ใช้จะเจอกล่องเปล่าจำนวนมากโดยไม่รู้ว่าเกิดอะไร หรือแย่กว่านั้นคือ **ไม่ได้ยินอะไรเลย**

`aria-live="polite"` **ไม่ใช่ `assertive`** เพราะการโหลดไม่ใช่เรื่องด่วน และ `assertive` จะขัดสิ่งที่ผู้ใช้กำลังฟังอยู่

---

## 6 · Tailwind implementation

```ts
const skeletonStyles = cva(
  [
    'skeleton',            /* ← ให้ base.css จับได้สำหรับกฎ reduced-motion */
    'block',
    'bg-sunken',
    'motion-safe:animate-pulse',
  ],
  {
    variants: {
      shape: {
        text:   'rounded-(--radius-control)',
        card:   'rounded-(--radius-container)',
        circle: 'rounded-full',
        media:  'rounded-(--radius-container)',
      },
      lines: {
        caption:   'h-5',   /* line-height ของ text-caption */
        'body-sm': 'h-6',
        body:      'h-7',
        title:     'h-8',
        none:      '',
      },
    },
    defaultVariants: { shape: 'text', lines: 'body' },
  },
);
```

⚠️ `bg-sunken` **ต้องอยู่บน `bg-surface` ไม่ใช่บน `bg-canvas`** — ในโหมดมืด `--color-sunken` กับ `--color-canvas` มี ratio **1.000** (เท่ากันพอดี) skeleton จะหายไปสนิท

---

## 7 · Figma Variant

Component set **`Skeleton`**

| Property | Values |
|---|---|
| `Shape` | `Text` · `Card` · `Circle` · `Media` |
| `Size` | `Caption` · `Body SM` · `Body` · `Title` |

**ต้องสร้างคู่กับ component จริง** — ทุก card ที่มีในไลบรารีต้องมี frame `… / Loading` ที่ใช้ skeleton ที่ **radius และความสูงตรงกันพอดี**

ถ้า Figma มี skeleton ที่รูปร่างไม่ตรงกับของจริง นักพัฒนาจะ copy ค่าผิดและได้ layout shift

**ห้ามใส่ animation ใน Figma prototype** ให้ระบุใน description ว่า `animate-pulse` ถูกปิดใน reduced motion

---

## 8 · Usage

```tsx
// กริดสินค้าระหว่างโหลด
<SkeletonGroup isLoading={isLoading} label="กำลังโหลดรายการสินค้า">
  <Grid preset="product">
    {Array.from({ length: 12 }, (_, i) => (
      <Card key={i}>
        <Skeleton shape="media" lines="none" className="aspect-4/3" />
        <VStack gap="2" className="mt-4">
          <Skeleton lines="title" width="80%" />
          <SkeletonText lines={2} size="body-sm" />
        </VStack>
      </Card>
    ))}
  </Grid>
</SkeletonGroup>
```

```tsx
// โปรไฟล์ผู้ขาย
<SkeletonGroup isLoading={isLoading}>
  <HStack gap="3">
    <Skeleton shape="circle" lines="none" className="size-12" width="3rem" />
    <VStack gap="2" className="flex-1">
      <Skeleton lines="body" width="45%" />
      <Skeleton lines="caption" width="70%" />
    </VStack>
  </HStack>
</SkeletonGroup>
```

---

## 9 · Anti-patterns

| ❌ | ✅ | ทำไม |
|---|---|---|
| `<Skeleton className="animate-[fade-in_300ms]">` | ปรากฏทันที | หน่วงสัญญาณว่ากำลังโหลด = กลับหัวกับหน้าที่ (ข้อ 07 §7.3) |
| `<Skeleton className="motion-reduce:[animation-duration:3s]">` | พื้นนิ่ง | ชะลอยังเป็นการเคลื่อนไหว — ข้อ 17 ระบุ DENY |
| `<Skeleton className="rounded-none">` แทนการ์ด | `shape="card"` | radius ไม่ตรง = มุมกระตุกตอนโหลดเสร็จ |
| `<Skeleton className="h-4">` | `lines="caption"` | 16px ไม่ตรงกับ line-height ใดเลย = layout shift |
| skeleton 20 ชิ้นโดยไม่ห่อ | `<SkeletonGroup>` | screen reader เจอกล่องเปล่าหรือไม่ได้ยินอะไรเลย |
| `aria-live="assertive"` | `"polite"` | การโหลดไม่ด่วน — ขัดสิ่งที่ผู้ใช้กำลังฟัง |
| `<Skeleton>` บน `bg-canvas` ในโหมดมืด | บน `bg-surface` | `sunken` = `canvas` พอดี (ratio 1.000) — หายสนิท |
| `<Skeleton className="skeleton-x">` (ลบ `skeleton`) | ปล่อยไว้ | `base.css` จับ class นี้เพื่อปิด animation |
| skeleton สำหรับงานที่โหลด 100ms | ไม่แสดงอะไร | กระพริบเข้า-ออกรบกวนกว่ารอเงียบ |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง ไม่มีแถวไหนอธิบายพฤติกรรมซ้ำ (นั่นคืองานของ §4 และ §5)

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · axe ผ่านใน `a11y/primitives.test.tsx` · `SC 4.1.3` `<SkeletonGroup>` ประกาศสถานะโหลด**ครั้งเดียว** ไม่ใช่ประกาศทีละแถบ |
| ตอบสนอง (Responsive) | ✅ | `min-w-0` · `<SkeletonText>` ความยาวบรรทัดไม่เท่ากันเพื่อให้ดูเป็นข้อความ จึงยืดตามกล่องได้ทุกความกว้าง |
| โหมดมืด (Dark Mode) | ✅ | `lint-classes.mjs` 0 จุด — ทุกสีมาจาก token ที่ override ในโหมดมืดแล้ว |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | `lint-quality.mjs` 0 จุด — ไม่มี `ml-`/`pl-`/`left-` ในไฟล์นี้ |
| คีย์บอร์ด (Keyboard) | — | skeleton ไม่มีอะไรให้กด · `aria-hidden` ไม่อยู่ใน tab order โดยตั้งใจ |
| กำลังโหลด (Loading) | ✅ | **นี่คือหน้าที่หลักของ component นี้** — `isLoading` สลับระหว่าง skeleton กับเนื้อหาจริง |
| ข้อผิดพลาด (Error) | — | โหลดไม่สำเร็จให้เปลี่ยนไปเป็น [`<Banner tone="danger">`](./Banner.md) — skeleton ที่ค้างอยู่คือคำโกหกว่ายังโหลดอยู่ |
| ว่างเปล่า (Empty) | — | ไม่มีอะไรจะโหลด = ไม่ต้องมี skeleton ให้ไปที่ empty state ของกริดโดยตรง |
| Skeleton | ✅ | **component นี้คือรายการนั้นเอง** · §1 อธิบายว่าทำไมไม่ fade เข้า |
| การเคลื่อนไหว (Animation) | ✅ | `base.css §10` มี `.skeleton { animation: none; background-image: none }` ใน**รายการ DENY** โดยเจาะจง — คลาส `skeleton` ถูกใส่ไว้ที่ [Skeleton.tsx:30](./Skeleton.tsx) เพื่อให้กฎนั้นจับได้ (SC 2.3.3 · 2.3.1) |
| ประสิทธิภาพ (Performance) | ✅ | ไม่มี JS วัดขนาด · `animate-pulse` เป็น opacity ล้วนซึ่งอยู่บน compositor และถูกตัดทิ้งเมื่อผู้ใช้ขอ reduced motion |
