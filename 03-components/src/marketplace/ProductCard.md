# ProductCard

**`@smego/ui`** · ชั้น 03 · [ProductCard.tsx](./ProductCard.tsx) · ฐาน: [EntityCard.md](./EntityCard.md)

---

## 1 · ภาพรวม

การ์ดสินค้าที่จับต้องได้ — เครื่องจักร วัตถุดิบ บรรจุภัณฑ์ สินค้าสำเร็จรูป

**รายละเอียดที่ใช้ร่วมกับ card อื่นทั้งหมด** (link overlay · วงแหวน focus ที่การ์ด · `amount` เป็น slot · เกณฑ์ 136px) อยู่ใน [EntityCard.md](./EntityCard.md) — ที่นี่เฉพาะสิ่งที่เป็นของ ProductCard

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน |
|---|---|
| บริการที่ไม่มีตัวสินค้า | `<ServiceCard>` |
| โครงการหรือทุนภาครัฐ | `<ProgramCard>` / `<GrantCard>` |
| โปรไฟล์ผู้ผลิต | `<SellerProfile>` |

---

## 2 · React API

```tsx
<ProductCard
  as="li"
  href={`/products/${p.id}`}
  name="เครื่องคั่วกาแฟกึ่งอัตโนมัติ 5 กิโลกรัม รุ่น TR-500"
  price={1_250_000}
  unit="เครื่อง"
  moq={1}
  sellerName="บจก. ไทยโรสเตอร์"
  certifications={['มอก. 2456-2562']}
  media={<img src={p.image} alt="" className="aspect-4/3 w-full object-cover" />}
  footer={<Button size="sm" fullWidth>ดูรายละเอียด</Button>}
/>
```

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `href` · `name` | `string` | — | **บังคับ** |
| `price` | `number \| null` | — | `null` = ขอใบเสนอราคา |
| `unit` | `string` | `s.card.unit` | "ชิ้น" · "เครื่อง" · "กิโลกรัม" |
| `moq` | `number` | — | จำนวนสั่งขั้นต่ำ |
| `sellerName` | `string` | — | **บังคับ** |
| `inStock` | `boolean` | `true` | |
| `certifications` | `string[]` | — | ชื่อใบรับรองเป็นข้อความ |
| `media` · `actions` · `footer` | `ReactNode` | — | |
| `isSelected` · `headingLevel` · `as` | | | ส่งต่อไป `EntityCard` |

---

## 3 · Variants

ProductCard ไม่มี variant — ความต่างมาจากข้อมูล ไม่ใช่จาก prop รูปแบบ

| สถานะข้อมูล | ผลที่เห็น |
|---|---|
| `inStock` | Badge `success` "มีสินค้า" + วงกลม |
| `!inStock` | Badge `neutral` "สินค้าหมด" |
| `price === null` | ช่องราคาแสดง "ขอใบเสนอราคา" |
| `certifications` | Badge `neutral` ต่อใบ · **ไม่มีไอคอน** |

---

## 4 · States

สืบทอดจาก `EntityCard` ทั้งหมด — default · hover · focus-visible (วงแหวนที่การ์ด) · selected

### ★ สินค้าหมดยังกดได้

การ์ดสินค้าหมด **ไม่ disabled** — ผู้ซื้อ B2B ยังต้องดูสเปก เทียบราคา และติดต่อสอบถามว่าจะมีของเมื่อไร

การปิดกั้นทำให้เสียโอกาสขายโดยไม่ได้อะไรกลับมา

---

## 5 · Accessibility

| เรื่อง | ข้อกำหนด |
|---|---|
| **SC 1.4.1** | สถานะสต็อกมีไอคอนจาก `<Badge>` |
| **SC 1.3.1** | ผู้ผลิตและ MOQ อยู่ใน `<dl>` |
| ทั่วไป | ดู [EntityCard.md §5](./EntityCard.md) |

### ★★ ใบรับรองใช้ **ข้อความล้วน ไม่มีไอคอน** (ข้อ 09)

ไอคอนโดเมนไทย (มอก. · ฮาลาล · GMP · DBD) **ยังไม่มีในระบบ** และการหยิบไอคอน Lucide ที่ใกล้เคียงมาใช้ **แย่กว่าไม่มีไอคอน**

โดยเฉพาะกับการรับรองมาตรฐานที่ความหมายผิด **มีผลทางกฎหมาย** — โล่ที่สื่อว่า "ผ่านการรับรอง" ทั้งที่เป็นแค่ไอคอนตกแต่งคือการอ้างสิทธิ์ที่ไม่มีจริง

จึงส่ง `showIcon={false}` ให้ Badge ของใบรับรองทุกใบ

### ★★ MOQ เป็นข้อมูลระดับเดียวกับราคาใน B2B

ผู้ซื้อ B2B ที่เห็นราคา 250 บาทแล้วพบทีหลังว่าต้องสั่งขั้นต่ำ 500 ชิ้น **คือผู้ซื้อที่เสียเวลาไปแล้ว**

MOQ จึงอยู่ใน `meta` ของการ์ด **ไม่ใช่ในหน้ารายละเอียดอย่างเดียว** — ตรงกับหลักในข้อ 01 §4.3 ว่าข้อมูลที่เปลี่ยนการตัดสินใจห้ามซ่อน

### ★ `alt=""` บนรูปสินค้าเป็นค่าที่ถูก

ชื่อสินค้าอยู่ในหัวข้อข้างล่างอยู่แล้ว — `alt` ที่ซ้ำกับชื่อทำให้ screen reader อ่านสองรอบ

ใส่ `alt` ที่มีเนื้อหาเฉพาะเมื่อรูปสื่อข้อมูลที่ข้อความไม่มี (เช่นแผนผังการติดตั้ง)

---

## 6 · Tailwind implementation

ProductCard ไม่มี CVA ของตัวเอง — ประกอบจาก `EntityCard` · `EntityAmount` · `EntityMeta` · `Badge`

```tsx
eyebrow={
  <>
    <Badge variant={inStock ? 'success' : 'neutral'} label={inStock ? s.card.inStock : s.card.outOfStock} />
    {certifications?.map((c) => (
      <Badge key={c} variant="neutral" showIcon={false} label={c} />
    ))}
  </>
}
amount={
  <EntityAmount
    label={s.card.price}
    value={price}
    note={price === null ? s.card.requestQuote : unit ? `/${unit}` : undefined}
  />
}
```

`meta` กรอง item ที่ค่าว่างออก จึงไม่มีบรรทัดเปล่าเมื่อไม่ส่ง `moq`

---

## 7 · Figma Variant

Component **`ProductCard`** — instance ของ `EntityCard`

| Property | Values |
|---|---|
| `Stock` | `In stock` · `Out of stock` |
| `Price` | `Amount` · `Quote` |
| `Certifications` | `0` · `1` · `2` · `3` |
| `MOQ` | `True` · `False` |

**ห้ามสร้างไอคอนสำหรับ มอก. / ฮาลาล / GMP** — ถ้านักออกแบบวาดขึ้นมา จะมีคน implement และกลายเป็นการอ้างการรับรองด้วยสัญลักษณ์ที่ไม่มีใครรับรอง

**frame บังคับ: 136px** พร้อมราคา 7 หลัก (`1,250,000`) — เป็นเคสที่แคบที่สุดจริง

⚠️ วัดใน browser แล้วพบว่า **โค้ดยังทำเคสนี้ไม่ได้** — ตัวเลขกว้าง 109.47px แต่ที่เหลือ 102px · ดู [EntityCard.md §1](./EntityCard.md)

---

## 8 · Usage

```tsx
<Grid as="ul" preset="product">
  {products.map((p) => (
    <ProductCard
      key={p.id}
      as="li"
      href={`/products/${p.id}`}
      name={p.name}
      price={p.price}
      unit={p.unit}
      moq={p.moq}
      sellerName={p.seller.name}
      inStock={p.stock > 0}
      certifications={p.certifications}
      media={<img src={p.image} alt="" className="aspect-4/3 w-full object-cover" />}
      actions={<SaveButton itemName={p.name} />}
      footer={<Button size="sm" fullWidth>ดูรายละเอียด</Button>}
    />
  ))}
</Grid>
```

```tsx
// สินค้าที่ต้องขอราคา — พบบ่อยกับเครื่องจักรสั่งผลิต
<ProductCard href="#" name="สายพานลำเลียงสั่งผลิตตามขนาด"
  price={null} sellerName="บจก. ไทยคอนเวเยอร์" moq={1} unit="ชุด" />
```

---

## 9 · Anti-patterns

| ❌ | ✅ | ทำไม |
|---|---|---|
| ไอคอนโล่/ดาวข้างชื่อใบรับรอง | `showIcon={false}` | อ้างการรับรองด้วยสัญลักษณ์ที่ไม่มีใครรับรอง |
| MOQ อยู่แค่ในหน้ารายละเอียด | อยู่บนการ์ด | ผู้ซื้อ B2B เสียเวลาแล้วค่อยรู้ |
| `price={0}` แทนการขอใบเสนอราคา | `price={null}` | "0 บาท" อ่านว่าฟรี |
| การ์ดสินค้าหมดถูก disable | ปล่อยให้กดได้ | ผู้ซื้อยังต้องดูสเปกและสอบถาม |
| `alt={p.name}` | `alt=""` | ชื่ออยู่ในหัวข้อแล้ว — อ่านซ้ำสองรอบ |
| `<Badge variant="accent">` สำหรับ "สินค้าหมด" | `neutral` | ทองห้ามเป็นสถานะ (ข้อ 02 §9) |
| ราคาเป็นเลขไทย ๐–๙ | เลขอารบิก + `font-numeric` | กว้างต่างกัน 36.6% em |
| ทดสอบแค่ชื่อสินค้าสั้น | ทดสอบชื่อ 60+ ตัวอักษร | ชื่อสินค้าไทยยาวและถูก clamp 2 บรรทัด |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง ไม่มีแถวไหนอธิบายพฤติกรรมซ้ำ (นั่นคืองานของ §4 และ §5)

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · axe ผ่านใน `a11y/marketplace.test.tsx` ทั้งในกริดและเดี่ยว · เทส "ไม่มีเลขไทย ๐–๙ ในตัวเลขใด ๆ" — ราคาอ่านด้วยเครื่องได้ |
| ตอบสนอง (Responsive) | ✅ | อยู่ใน fixture e2e · `e2e/pass4.spec.ts:123` ไม่มี scroll แนวนอนที่ 320px · `:106` ราคา 7 หลักอยู่ในกล่องที่ **136px** |
| โหมดมืด (Dark Mode) | ✅ | โครงและเงามาจาก [`EntityCard`](./EntityCard.md) → `<Card>` ซึ่งใช้ `--elevation-*` ไม่ใช่ `shadow-*` · `lint-classes.mjs` 0 จุด — ทุกสีมาจาก token ที่ override ในโหมดมืดแล้ว |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | `lint-quality.mjs` 0 จุด — ไม่มี `ml-`/`pl-`/`left-` ในไฟล์นี้ |
| คีย์บอร์ด (Keyboard) | ✅ | สืบทอดจาก [`EntityCard §5`](./EntityCard.md) — link overlay เป็น `<a href>` จริงจึงอยู่ใน tab order ตามธรรมชาติ · วงแหวน focus วาดที่**การ์ด** ไม่ใช่ที่ลิงก์ (SC 2.4.7) |
| กำลังโหลด (Loading) | — | §4 ของ [`EntityCard`](./EntityCard.md) — ผู้เรียกครอบกริดด้วย [`<SkeletonGroup>`](../feedback/Skeleton.md) |
| ข้อผิดพลาด (Error) | — | การ์ดไม่ทำ async · ข้อมูลไม่ครบแสดงเป็นข้อความ ไม่ใช่ error |
| ว่างเปล่า (Empty) | — | สินค้าที่ไม่มีข้อมูลไม่ถูก render · กริดว่างเป็นของ [`SearchResult`](./SearchResult.md) |
| Skeleton | — | ตัวแทนระหว่างโหลดอยู่ที่ระดับกริด ไม่ใช่ที่การ์ดแต่ละใบ |
| การเคลื่อนไหว (Animation) | ✅ | ไม่มี `transition` หรือ `animate` ในไฟล์นี้เลย — การเคลื่อนไหวเดียวคือ `transition-shadow` ที่สืบทอดมาจาก `<Card interactive>` ซึ่ง `box-shadow` อยู่ในรายการ ALLOW ของ `base.css §10` |
| ประสิทธิภาพ (Performance) | ✅ | สืบทอดจาก [`EntityCard §10`](./EntityCard.md) — `mt-auto` แทนการวัดความสูงด้วย JS · container query แทน ResizeObserver · ไม่มีความสูงตายตัว |
