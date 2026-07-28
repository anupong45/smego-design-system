# EntityCard · EntityAmount · EntityMeta

**`@smego/ui`** · ชั้น 03 · [EntityCard.tsx](./EntityCard.tsx)

---

## 1 · ภาพรวม

โครงร่วมของ card ทั้ง 5 ชนิดในมาร์เก็ตเพลส — **ProductCard · ServiceCard · ProgramCard · GrantCard · TrainingCard**

ทั้งห้าแชร์โครงกัน ~80%: media / heading / meta / จำนวนเงิน / trust badge / CTA ถ้าเขียนแยก 5 ตัวจะ **drift ทันทีที่แก้ครั้งแรก** — คนแก้ ProductCard จะไม่รู้ว่าต้องไปแก้อีก 4 ที่

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน | เหตุผล |
|---|---|---|
| ใช้ตรง ๆ ในหน้าแอป | domain wrapper ตัวใดตัวหนึ่ง | wrapper รู้ว่า label ของจำนวนเงินคืออะไร |
| การ์ดที่ไม่ใช่รายการในมาร์เก็ตเพลส | `<Card>` | EntityCard บังคับให้มี `href` และ `title` |
| แถวในตาราง | `<DataTable>` (Pass 5) | ตารางต้องมี `<th>` และ `scope` |
| การ์ดสรุปตัวเลข | `<Stat>` (Pass 5) | ไม่มีปลายทางให้กด |

---

## 2 · React API

```tsx
import { EntityCard, EntityAmount, EntityMeta } from '@smego/ui';
```

### EntityCard

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `href` | `string` | — | **บังคับ** — การ์ดทั้งใบเป็นลิงก์ |
| `title` | `string` | — | **บังคับ** |
| `headingLevel` | `2 \| 3 \| 4 \| 5` | `3` | ต้องตรงกับลำดับจริงในหน้า |
| `media` | `ReactNode` | — | ห่อด้วย `<CardMedia>` ให้แล้ว |
| `eyebrow` | `ReactNode` | — | แถว badge เหนือชื่อ |
| `meta` | `ReactNode` | — | ใช้ `<EntityMeta>` |
| `amount` | `ReactNode` | — | **slot ไม่ใช่ prop `price`** — ดู §3 |
| `footer` | `ReactNode` | — | ปุ่ม CTA · ได้ `z-(--z-raised)` อัตโนมัติ |
| `actions` | `ReactNode` | — | ปุ่มลอยมุมขวาบน · ได้ `z-(--z-raised)` อัตโนมัติ |
| `isSelected` | `boolean` | `false` | เลือกอยู่ในการเปรียบเทียบ |
| `as` | `ElementType` | `'article'` | ใช้ `'li'` ในกริดที่เป็น `<ul>` |

### EntityAmount

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `label` | `string` | — | **บังคับ** — ดู §3 |
| `value` | `number \| null` | — | `null` = ไม่มีตัวเลข ใช้ `note` แทน |
| `unit` | `string` | `'บาท'` | |
| `note` | `string` | — | ต่อท้าย หรือแทนตัวเลขเมื่อ `value` เป็น `null` |

### EntityMeta

| prop | type | หมายเหตุ |
|---|---|---|
| `items` | `{ label: string; value: ReactNode }[]` | ★ `label` **ต้องไม่ว่าง** — `<dt>` ว่างไม่ถูกตาม HTML · ค่าที่อธิบายตัวเองได้ให้วางเป็น `<p>` นอก `<dl>` |

---

## 3 · Variants

EntityCard ไม่มี variant — **ความต่างอยู่ที่ 5 wrapper** ซึ่งเป็นการตัดสินใจเชิงสถาปัตยกรรม ไม่ใช่การละเว้น

variant prop จะทำให้ทุก domain ถูกบีบให้ใช้ชุดค่าเดียวกัน ซึ่งเป็นสิ่งที่ต้องหลีกเลี่ยงพอดี

### ★★★ `amount` เป็น **slot ไม่ใช่ prop `price`**

จำนวนเงินใน 5 บริบทนี้ **ต่างความหมายกันจริง**:

| card | จำนวนเงินคืออะไร |
|---|---|
| `ProductCard` | **ราคา** — จ่ายเท่านี้ |
| `ServiceCard` | **ค่าบริการ** — อาจต่อโครงการ ต่อชั่วโมง หรือขอใบเสนอราคา |
| `ProgramCard` | **ไม่มีจำนวนเงิน** — มีแต่กำหนดปิดรับ |
| `GrantCard` | **วงเงินสูงสุด** — เพดานที่ขอได้ ไม่ใช่ที่ได้รับ |
| `TrainingCard` | **ค่าลงทะเบียน** — หรือ "ไม่มีค่าใช้จ่าย" |

ถ้ารับเป็น `price: number` ทั้งหมดจะถูกบีบให้แสดงเหมือนกัน แล้วผู้ใช้จะอ่าน **"500,000 บาท" บน GrantCard ว่าเป็นเงินที่จะได้รับ** ซึ่งผิด — และเป็นความเข้าใจผิดที่มี **ผลทางการเงินจริง**

`EntityAmount` จึงบังคับ `label` เป็น prop จำเป็น และวาง label **เหนือ** ตัวเลข ไม่ใช่ต่อท้ายที่อาจถูกตัดที่ 136px

> **📌 แก้ความแม่นยำ · ✅ หนี้ที่ปิดแล้ว** — เอกสารเดิมเขียนว่า *"p-3 ที่ 136px เหลือเนื้อหา **112px** — พอสำหรับราคา 7 หลัก"*
>
> **ผิดทั้งสองส่วน** วัดจริงใน browser (`tests/e2e/pass4.spec.ts`):
>
> | ค่า | ที่เขียนไว้ | วัดจริง |
> |---|---|---|
> | เนื้อหาที่เหลือที่ 136px | 112px | **102px** |
> | ความกว้างของ `1,250,000` ที่ `text-title` | "พอ" | **109.47px** |
>
> → **ล้น 7.47px** · `GrantCard.md §3` ที่อ้างว่า "ยืนยันจากการวัดที่ 136px" ยืนยันด้วย **6 หลัก** (`500,000`) ส่วน `ProductCard.md §7` ประกาศว่าเคสจริงคือ **7 หลัก** — สองไฟล์ไม่ตรงกัน และ 7 หลักคือเคสที่ถูก
>
> **แก้แล้วด้วย container query ที่ `EntityAmount`** — ตัวเลขลดจาก `text-title` (24px) เป็น `text-subtitle` (20px) เมื่อ **กล่องของตัวเอง** แคบกว่า `7rem` (112px)
>
> ```tsx
> <div className="@container grid min-w-0 gap-0.5">
>   <span className="text-title @max-[7rem]:text-subtitle …">
> ```
>
> **ทำไมเป็น container query ไม่ใช่ breakpoint** — การ์ดแคบ 136px เกิดที่ viewport 320px *และ* ที่ `preset="cards"` บนจอ xl ด้วย · เงื่อนไขจริงคือ "กล่องนี้กว้างเท่าไร" ไม่ใช่ "จอกว้างเท่าไร"
>
> `1,250,000` ที่ 20px กว้าง ~91px พอดีกล่อง 102px · การ์ดที่กว้างกว่านั้นทั้ง 5 ใบ **ไม่เปลี่ยนน้ำหนักทางสายตาเลย** เพราะเงื่อนไขไม่ติด · `test.fail()` ใน `pass4.spec.ts` ถูกถอดเป็นเทสปกติแล้ว

**ยืนยันจากการวัด:** `"วงเงินสูงสุด → 500,000"` และ `"ราคา → 1,250,000"` render แยกกันถูกต้อง

---

## 4 · States

| state | สิ่งที่เกิด |
|---|---|
| default | ขอบ `--elevation-edge-raised` · ไม่มีเงา |
| hover | เงา `--elevation-floating` (จาก `<Card interactive>`) |
| focus-within | เงาเดียวกับ hover |
| **focus-visible ที่ลิงก์** | **วงแหวนวาดที่การ์ด** — ดูด้านล่าง |
| selected | `border-edge-brand` |

### ★★★ วงแหวน focus อยู่ที่ **การ์ด** ไม่ใช่ที่ลิงก์

ชื่อรายการใช้ `line-clamp-2` ซึ่ง **ต้องมี `overflow: hidden` ตามสเปก** ถ้าวงแหวนวาดรอบตัวลิงก์ (ซึ่งเป็น inline อยู่ใน element ที่ clamp) จะถูกตัด = **ไม่ผ่าน SC 2.4.7**

**ทางแก้สองส่วน** — ต้องมีทั้งคู่:

```tsx
// 1 · ลิงก์ยกวงแหวนให้คนอื่นวาด
<Link data-focus-ring="deferred" className="line-clamp-2 after:absolute after:inset-0" />

// 2 · การ์ดวาดแทน
'has-[a[data-focus-visible]]:outline-2'
'has-[a[data-focus-visible]]:outline-(--color-focus-ring)'
'has-[a[data-focus-visible]]:outline-offset-2'
'has-[a[data-focus-visible]]:shadow-[0_0_0_2px_var(--color-focus-contrast)]'
```

### ⚠️ ทำไมต้องเป็น attribute ไม่ใช่ `outline-none`

`base.css` ถูก import **นอก `@layer`** (theme.css บรรทัด 31) ส่วน utility ของ Tailwind อยู่ใน `@layer utilities`

**CSS ที่ไม่มี layer ชนะ layer เสมอ ไม่ว่า specificity เท่าไร** ดังนั้น `data-[focus-visible]:outline-none` ที่เขียนใน component **ไม่มีผลเลย**

**พบจริงตอนวัด:** ได้วงแหวนสองวงซ้อนกัน — วงหนึ่งรอบข้อความที่ถูกตัด อีกวงรอบการ์ด

hook `[data-focus-ring='deferred']` จึงอยู่ใน `base.css §5b` ซึ่งเป็นที่เดียวที่ override ได้

### ผลการวัดหลังแก้

| ตรวจ | ค่า |
|---|---|
| วงแหวนที่ลิงก์ | `outline: none` · `box-shadow: none` ✅ |
| วงแหวนที่การ์ด | `2px solid rgb(0, 119, 193)` · offset `2px` · halo ขาว ✅ |
| `scroll-margin-top` ที่ลิงก์ | **64px คงอยู่** (SC 2.4.11) ✅ |
| ancestor ที่ตัด overflow | **ไม่มี** ✅ |

### ★ ได้ผลดีกว่าเดิมด้วย

ผู้ใช้เห็นว่า **ทั้งใบคือเป้า** ไม่ใช่แค่บรรทัดชื่อ ซึ่งตรงกับพฤติกรรมจริงของ link overlay

---

## 5 · Accessibility

| เรื่อง | ข้อกำหนด |
|---|---|
| **SC 2.4.7** | วงแหวนวาดที่การ์ด · ไม่มี ancestor ตัด overflow |
| **SC 2.4.11** | `scroll-margin` ยังทำงานที่ลิงก์ |
| **SC 1.3.1** | `EntityMeta` เป็น `<dl>` · `headingLevel` ตรงลำดับจริง |
| **SC 1.4.10** | `min-w-0` ทุกชั้น · **วัดที่ 320px ได้ scrollWidth 320** |
| **SC 2.5.3** | ชื่อลิงก์ = ชื่อรายการที่แสดงอยู่ |
| **SC 1.4.12** | ไม่มีความสูงตายตัว |

### ★ link overlay ไม่ใช่ `onClick` บนการ์ด

ผู้ใช้ต้อง **เปิดแท็บใหม่ได้ · คัดลอก URL ได้ · screen reader ประกาศเป็นลิงก์** ซึ่ง `onClick` ให้ไม่ได้เลย

`after:absolute after:inset-0` ทำให้พื้นที่กดครอบทั้งใบโดยที่ยังเป็น `<a href>` จริง

ปุ่มอื่นในการ์ด (`actions` · `footer`) ได้ **`relative z-(--z-raised)`** อัตโนมัติ ไม่งั้นกดปุ่มบันทึกแล้วจะเปิดหน้ารายการแทน

### ★ `EntityMeta` เป็น `<dl>` เพราะเป็นคู่จริง ๆ

screen reader ประกาศ **"สั่งขั้นต่ำ, 100 ชิ้น"** เป็นคู่ ไม่ใช่ "สั่งขั้นต่ำ" แล้ว "100 ชิ้น" แยกกันคนละที่

**วัดแล้ว:** 16 การ์ด → 16 `<dl>`

### ★ `mt-auto` ทำให้ราคาตรงแนวกันทั้งแถว

การ์ดที่ชื่อยาวไม่เท่ากันจะมีราคาอยู่คนละความสูง ซึ่งทำให้สแกนกริดเปรียบเทียบราคายาก — `mt-auto` ดัน amount + footer ลงล่างเสมอ

---

## 6 · Tailwind implementation

```tsx
<Card
  as={as}
  interactive
  selected={isSelected}
  padding="none"                   /* padding อยู่ที่ส่วนเนื้อหา เพื่อให้รูปชนขอบ */
  className={cn(
    'relative flex flex-col',
    'has-[a[data-focus-visible]]:outline-2',
    'has-[a[data-focus-visible]]:outline-(--color-focus-ring)',
    'has-[a[data-focus-visible]]:outline-offset-2',
    'has-[a[data-focus-visible]]:shadow-[0_0_0_2px_var(--color-focus-contrast)]',
  )}
>
  {media && <CardMedia>{media}</CardMedia>}
  {actions && <div className="absolute end-2 top-2 z-(--z-raised) flex gap-1">{actions}</div>}

  {/* p-3 ที่ 136px เหลือเนื้อหา 102px — EntityAmount ลดสเกลเองที่นี่ ดู §5 */}
  <div className="flex min-w-0 flex-1 flex-col gap-2 p-3 md:gap-3 md:p-4">
    …
    <div className="mt-auto flex min-w-0 flex-col gap-2 pt-1">
      {amount}
      {footer && <div className="relative z-(--z-raised)">{footer}</div>}
    </div>
  </div>
</Card>
```

---

## 7 · Figma Variant

Component set **`EntityCard`** — เป็น **base component ที่ 5 domain card instance ทับ**

| Property | Values |
|---|---|
| `Media` | `True` · `False` |
| `State` | `Default` · `Hover` · **`Focus`** · `Selected` |
| `Actions` | `None` · `1 button` · `2 buttons` |
| `Footer` | `None` · `Button` |

**`Focus` variant ต้องวาดวงแหวนรอบ *ทั้งใบ* ไม่ใช่รอบบรรทัดชื่อ** — ถ้า Figma วาดรอบชื่อ นักพัฒนาจะ implement ตามแล้วตก SC 2.4.7

**ต้องมี frame ทุก card ที่ความกว้าง 136px** — ถ้าอ่านไม่ออกที่ความกว้างนี้ แปลว่า design ยังไม่เสร็จ ไม่ใช่ว่า breakpoint ผิด

---

## 8 · Usage

**ใช้ผ่าน wrapper เป็นปกติ** — เรียก `EntityCard` ตรง ๆ เฉพาะเมื่อสร้าง domain card ใหม่

```tsx
// สร้าง domain card ใหม่ เช่น SupplierCard
export function SupplierCard({ href, name, province, categoryCount, ...rest }: Props) {
  const s = useStrings();
  return (
    <EntityCard
      href={href}
      title={name}
      eyebrow={<Badge variant="success" label={s.seller.verified} />}
      meta={
        <EntityMeta
          items={[
            { label: s.seller.location, value: province },
            { label: 'หมวดสินค้า', value: `${categoryCount} หมวด` },
          ]}
        />
      }
      /* ไม่ส่ง amount — ผู้ผลิตไม่มีราคา */
      {...rest}
    />
  );
}
```

```tsx
// ในกริด — as="li" เพราะ Grid เป็น <ul>
<Grid as="ul" preset="product">
  {products.map((p) => <ProductCard key={p.id} as="li" {...p} />)}
</Grid>
```

---

## 9 · Anti-patterns

| ❌ | ✅ | ทำไม |
|---|---|---|
| `price: number` เป็น prop ร่วม | slot `amount` + `label` บังคับ | "วงเงินสูงสุด" ถูกอ่านเป็น "เงินที่จะได้รับ" |
| `<EntityAmount label="">` | label ที่มีความหมาย | ตัวเลขลอย ๆ ในกริดเทียบกันไม่ได้ |
| `outline-none` ที่ลิงก์ | `data-focus-ring="deferred"` | `base.css` นอก layer ชนะ utility — ได้วงแหวนสองวง |
| `data-focus-ring="deferred"` โดยไม่มี `has-[…]` ที่ ancestor | ต้องมีทั้งคู่ | ลบวงแหวนเฉย ๆ = ไม่ผ่าน SC 2.4.7 ทันที |
| `<Card onClick={goToProduct}>` | link overlay | เปิดแท็บใหม่ไม่ได้ คัดลอก URL ไม่ได้ |
| ปุ่มบันทึกไม่มี `z-(--z-raised)` | ผ่าน `actions` (ได้อัตโนมัติ) | link overlay กลืนการกด |
| `<div>` แทน `<dl>` ใน meta | `<EntityMeta>` | คู่ชื่อ/ค่าถูกอ่านแยกกัน |
| `headingLevel={2}` ทุกการ์ด | ตรงกับลำดับจริง | โครงหัวข้อกระโดด |
| การ์ดสูงเท่ากันด้วย `h-64` | `mt-auto` | ตัดเนื้อหาเมื่อผู้ใช้เพิ่ม line-height |
| ทดสอบที่ 375px แล้วจบ | ทดสอบที่ **136px** | 2 ใบที่ viewport 320 คือของจริง |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง ไม่มีแถวไหนอธิบายพฤติกรรมซ้ำ (นั่นคืองานของ §4 และ §5)

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · axe ผ่านผ่าน wrapper ทั้ง 5 ใน `a11y/marketplace.test.tsx` และ `a11y/pass4.test.tsx` · เทสเจาะจง "EntityCard ยกวงแหวน focus ให้การ์ดวาดแทน" |
| ตอบสนอง (Responsive) | ✅ | `e2e/pass4.spec.ts:106` เลข 7 หลักอยู่ในกล่องที่ **136px** · `:123` ไม่มี scroll แนวนอนที่ 320px (SC 1.4.10) |
| โหมดมืด (Dark Mode) | ✅ | เงามาจาก `--elevation-*` ผ่าน `<Card>` ไม่ใช่ `shadow-*` ตรง (ดูคอมเมนต์หัวไฟล์ [Card.tsx](../data-display/Card.tsx)) · `lint-classes.mjs` และ `lint-quality.mjs` 0 จุด |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | `actions` ใช้ `end-2 top-2` อยู่แล้ว (§6) · `lint-quality.mjs` 0 จุด |
| คีย์บอร์ด (Keyboard) | ✅ | §5 link overlay เป็น `<a href>` จริงจึงอยู่ใน tab order ตามธรรมชาติ · `e2e/wcag22.spec.ts:44` focus ไม่ถูกบังที่ 320px และ 1280px |
| กำลังโหลด (Loading) | — | การ์ดรับข้อมูลที่ resolve แล้วเสมอ · สถานะโหลดของ**กริด**เป็นของ [`SearchResult`](./SearchResult.md) ไม่ใช่ของการ์ดแต่ละใบ |
| ข้อผิดพลาด (Error) | — | การ์ดไม่ยิง request เอง · ข้อผิดพลาดของรายการเป็นของหน้าที่โหลดกริด |
| ว่างเปล่า (Empty) | — | "ไม่มีการ์ดเลย" เป็นสถานะของกริด — [`SearchResult`](./SearchResult.md) และ `WishlistGrid` ถือ `emptyAction` ไว้ · การ์ดที่ว่างคือการ์ดที่ไม่ควร render |
| Skeleton | — | placeholder ของกริดใช้ [`<SkeletonGroup>`](../feedback/Skeleton.md) ที่ระดับ `SearchResult` · การ์ดที่รู้จัก skeleton ของตัวเองจะทำให้มีสองที่ที่ตัดสินใจเรื่องเดียวกัน |
| การเคลื่อนไหว (Animation) | ✅ | `transition-shadow` จาก `<Card interactive>` · `box-shadow` อยู่ในรายการ **ALLOW** ของ `base.css §10` โดยตั้งใจ — ไม่มีการเคลื่อนที่ให้ตัด |
| ประสิทธิภาพ (Performance) | ✅ | ราคาตรงแนวด้วย `mt-auto` ไม่ใช่การวัดความสูงด้วย JS (§5) · ตัวเลขลดขนาดด้วย **container query** ไม่ใช่ ResizeObserver (§3) · ไม่มีความสูงตายตัว |
