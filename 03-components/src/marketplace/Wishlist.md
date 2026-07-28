# SaveButton · WishlistGrid · WishlistHeader

**`@smego/ui`** · ชั้น 03 · [Wishlist.tsx](./Wishlist.tsx)

---

## 1 · ภาพรวม

บันทึกรายการไว้ดูภายหลัง — ปุ่มบนการ์ด และหน้ารวมรายการที่บันทึก

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน | เหตุผล |
|---|---|---|
| เพิ่มลงตะกร้า | `<Button icon="shopping-cart">` | ตะกร้าคือความตั้งใจซื้อ ไม่ใช่ความสนใจ |
| เปรียบเทียบ | `<CompareBar>` | เทียบเป็นงานชั่วคราว บันทึกเป็นงานถาวร |
| ติดตามผู้ขาย | ปุ่มติดตามในโปรไฟล์ | คนละ entity |
| ตัวกรอง | `<Chip>` | |

---

## 2 · React API

```tsx
<SaveButton itemName="เครื่องคั่วกาแฟ TR-500" isSaved={saved} onChange={setSaved} />

<WishlistHeader count={items.length} onClearAll={clearAll} />
<WishlistGrid count={items.length}>{cards}</WishlistGrid>
```

### SaveButton

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `itemName` | `string` | — | **บังคับ** — เข้าไปใน `aria-label` |
| `isSaved` | `boolean` | — | controlled |
| `defaultSaved` | `boolean` | `false` | uncontrolled |
| `onChange` | `(isSaved: boolean) => void` | — | |
| `variant` | `'icon' \| 'full'` | `'icon'` | |
| `isDisabled` | `boolean` | `false` | |

### WishlistGrid

| prop | type | หมายเหตุ |
|---|---|---|
| `count` | `number` | `0` = สถานะว่าง |
| `children` | `ReactNode` | การ์ด |
| `emptyAction` | `ReactNode` | ปุ่มในสถานะว่าง |

### WishlistHeader

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `count` | `number` | — | อยู่ใน `aria-live="polite"` |
| `onClearAll` | `() => void` | — | |
| `headingLevel` | `1 \| 2 \| 3` | `1` | ⚠️ ดูด้านล่าง |

### ⚠️ ลำดับหัวข้อ — การ์ดต้องเป็นระดับถัดไปเสมอ

`WishlistHeader` เป็น **`<h1>`** โดยค่าเริ่มต้น ส่วนการ์ดเป็น **`<h3>`** → **ข้ามระดับ 2**

**axe จับได้จริง** (`heading-order`) ตอนรันเทสชุดแรก — และตัวอย่างการใช้งานที่เขียนไว้ในเอกสารนี้ก็ผิดแบบเดียวกัน

ใช้คู่กันแบบนี้:

```tsx
<WishlistHeader count={n} />                       {/* h1 */}
<WishlistGrid count={n}>
  <ProductCard headingLevel={2} … />               {/* h2 — ไม่ใช่ 3 */}
</WishlistGrid>
```

---

## 3 · Variants

| variant | รูปแบบ | ใช้ที่ไหน |
|---|---|---|
| `icon` | ไอคอนหัวใจ · `p-2` → **36×36** | มุมขวาบนของการ์ด |
| `full` | ไอคอน + ข้อความ | หน้ารายละเอียดสินค้า |

### ★★ หัวใจ **ทึบ vs โปร่ง** ไม่ใช่แค่เปลี่ยนสี (SC 1.4.1)

```tsx
className={isSelected ? 'fill-current' : 'fill-none'}
```

ผู้ใช้ที่แยกสีแดงจากเทาไม่ได้ยังบอกได้จากการที่รูปทรงเต็มหรือกลวง

---

## 4 · States

| state | ที่มา |
|---|---|
| default | `aria-pressed="false"` · หัวใจโปร่ง |
| **บันทึกแล้ว** | `aria-pressed="true"` · หัวใจทึบ · `text-danger-icon` |
| hover | `bg-sunken` |
| focus-visible | วงแหวน 2 ชั้น |
| disabled | `text-fg-disabled` · `cursor-not-allowed` |

### ★★ RAC รับ `aria-label` เป็น **string เท่านั้น** ไม่ใช่ render function

`className` และ `children` ของ RAC รับ function ได้ แต่ `aria-label` **ไม่รับ** — `tsc` จับข้อนี้ให้ตอน build

ชื่อปุ่มต้องเปลี่ยนตามสถานะ จึงต้องรู้สถานะ **นอก** render prop:

```tsx
const [internal, setInternal] = useState(defaultSaved ?? false);
const selected = isSaved ?? internal;

const handleChange = (next: boolean) => {
  if (isSaved === undefined) setInternal(next);   /* uncontrolled */
  onChange?.(next);
};
```

component จึงรองรับทั้ง controlled และ uncontrolled โดยที่ชื่อปุ่มถูกต้องทั้งสองโหมด

---

## 5 · Accessibility

| เรื่อง | ข้อกำหนด |
|---|---|
| role | `button` + **`aria-pressed`** จาก RAC `ToggleButton` |
| **SC 2.5.3** | `aria-label` รวมชื่อรายการ |
| **SC 1.4.1** | หัวใจทึบ/โปร่ง ไม่ใช่แค่สี |
| **SC 2.5.8** | 20 + `p-2` = **36×36** |
| **SC 4.1.3** | จำนวนใน `WishlistHeader` เป็น `aria-live="polite"` |

### ★★ ต้องเป็น `ToggleButton` ไม่ใช่ `Button`

ปุ่มบันทึกมี **สถานะค้าง** ไม่ใช่การกระทำครั้งเดียว · ถ้าใช้ `<Button>` ธรรมดา ผู้ใช้ screen reader จะ **ไม่รู้ว่ารายการนี้บันทึกไว้แล้วหรือยัง**

**วัดแล้ว:** `aria-pressed="true"` บนปุ่มที่บันทึกแล้ว

### ★★★ `aria-label` เปลี่ยนตามสถานะ และรวมชื่อรายการ

```
ยังไม่บันทึก → "บันทึก เครื่องคั่วกาแฟ TR-500 ไว้ดูภายหลัง"
บันทึกแล้ว   → "นำ เครื่องคั่วกาแฟ TR-500 ออกจากรายการที่บันทึก"
```

**สองเหตุผล:**

1. ในกริดที่มี 20 การ์ด ปุ่มที่ชื่อ "บันทึก" ทั้ง 20 อัน **แยกกันไม่ได้เลย** (SC 2.5.3)
2. ชื่อต้องบอก **สิ่งที่จะเกิดขึ้นเมื่อกด** ไม่ใช่สถานะปัจจุบัน — สถานะมาจาก `aria-pressed` อยู่แล้ว การใส่สถานะซ้ำในชื่อทำให้ผู้ใช้ได้ยินสองรอบและสับสน

**วัดแล้ว:** `"นำ เครื่องคั่วกาแฟกึ่งอัตโนมัติ 5 กิโลกรัม ออกจากรายการที่บันทึก"`

### ★ ปุ่มบนการ์ดที่ทั้งใบเป็นลิงก์ ต้องมี `relative z-(--z-raised)`

`EntityCard` ใส่ให้แล้วผ่าน slot `actions` — ถ้าวางเองนอก slot นั้น link overlay จะกลืนการกด

### ★ จำนวนใน `WishlistHeader` เป็น live region

จำนวนเปลี่ยนเมื่อผู้ใช้นำรายการออก **โดยที่ focus ยังอยู่ที่ปุ่มในการ์ดที่กำลังหายไป** — ถ้าไม่ประกาศ ผู้ใช้ไม่รู้ว่าเกิดอะไร (SC 4.1.3)

**วัดแล้ว:** `polite: "2 รายการ"`

### ★ สถานะว่างต้องบอก **วิธีทำให้ไม่ว่าง**

> "กดปุ่มบันทึกบนรายการที่สนใจ เพื่อกลับมาดูภายหลัง"

"ยังไม่มีรายการที่บันทึกไว้" อย่างเดียวไม่ช่วยอะไร — ผู้ใช้ที่เพิ่งเปิดหน้านี้ครั้งแรกไม่รู้ว่าปุ่มบันทึกอยู่ตรงไหน

---

## 6 · Tailwind implementation

```tsx
<RACToggleButton
  isSelected={selected}
  onChange={handleChange}
  aria-label={selected ? s.wishlist.removeItem(itemName) : s.wishlist.saveItem(itemName)}
  className={({ isSelected }) => cn(
    'inline-flex items-center justify-center gap-2',
    'rounded-(--radius-control) border',
    'transition-colors duration-fast ease-standard',
    'data-disabled:cursor-not-allowed data-disabled:text-fg-disabled',
    variant === 'icon'
      ? ['p-2', 'bg-surface border-edge-strong', 'data-hovered:bg-sunken']   /* 36×36 */
      : ['px-4 py-2 text-body-sm', 'bg-surface border-edge-strong text-fg',
         'data-hovered:bg-sunken'],
    isSelected && 'text-danger-icon',
  )}
>
  {({ isSelected }) => (
    <>
      <Icon name="heart" size={20} className={isSelected ? 'fill-current' : 'fill-none'} />
      {variant === 'full' && <span>{isSelected ? s.wishlist.saved : s.wishlist.save}</span>}
    </>
  )}
</RACToggleButton>
```

`WishlistGrid` ใช้ `preset="product"` **เดียวกับหน้ารายการ** — ผู้ใช้เห็นการ์ดขนาดเดิมในตำแหน่งเดิม ไม่ต้องเรียนรู้ layout ใหม่

---

## 7 · Figma Variant

Component set **`SaveButton`**

| Property | Values |
|---|---|
| `Variant` | `Icon` · `Full` |
| `Saved` | `True` · `False` |
| `State` | `Default` · `Hover` · **`Focus`** · `Disabled` |

**`Saved = True` ต้องใช้หัวใจทึบ ไม่ใช่หัวใจโปร่งสีแดง** — ถ้า Figma เปลี่ยนแค่สี นักพัฒนาจะทำตามและตก SC 1.4.1

Component set **`WishlistGrid`** — property `State` = `Filled` · **`Empty`**

**`Empty` frame ต้องมีข้อความบอกวิธีและปุ่ม** ไม่ใช่แค่ไอคอนหัวใจกับคำว่า "ว่าง"

---

## 8 · Usage

```tsx
// บนการ์ด — ผ่าน slot actions ที่ได้ z-(--z-raised) อัตโนมัติ
<ProductCard
  href={`/products/${p.id}`}
  name={p.name}
  price={p.price}
  sellerName={p.seller.name}
  actions={
    <SaveButton
      itemName={p.name}
      isSaved={saved.has(p.id)}
      onChange={(next) => toggleSave(p.id, next)}
    />
  }
/>
```

```tsx
// หน้ารายละเอียด — มีข้อความ
<SaveButton itemName={product.name} variant="full" isSaved={saved} onChange={setSaved} />
```

```tsx
// หน้ารายการที่บันทึก — การ์ดเป็น h2 เพราะหัวข้อเป็น h1
<WishlistHeader count={items.length} onClearAll={clearAll} />
<WishlistGrid
  count={items.length}
  emptyAction={<Button variant="secondary" size="sm" onPress={browse}>เลือกดูสินค้า</Button>}
>
  {items.map((p) => (
    <ProductCard key={p.id} as="li" headingLevel={2} {...p}
      actions={<SaveButton itemName={p.name} isSaved onChange={() => remove(p.id)} />} />
  ))}
</WishlistGrid>
```

---

## 9 · Anti-patterns

| ❌ | ✅ | ทำไม |
|---|---|---|
| `<Button>` ธรรมดา | `ToggleButton` | ไม่มี `aria-pressed` — ไม่รู้ว่าบันทึกแล้วหรือยัง |
| `aria-label="บันทึก"` | รวมชื่อรายการ | 20 ปุ่มชื่อเดียวกันในกริด (SC 2.5.3) |
| `aria-label` บอกสถานะปัจจุบัน | บอกสิ่งที่จะเกิดขึ้น | ซ้ำกับ `aria-pressed` — ได้ยินสองรอบ |
| หัวใจเปลี่ยนแค่สี | ทึบ vs โปร่ง | SC 1.4.1 |
| `aria-label` เป็น function | คำนวณจาก state ภายนอก | RAC รับ string เท่านั้น — `tsc` จับให้ |
| ปุ่มบนการ์ดไม่มี `z-(--z-raised)` | ผ่าน slot `actions` | link overlay กลืนการกด |
| จำนวนไม่อยู่ใน live region | `aria-live="polite"` | ผู้ใช้ไม่รู้ว่ารายการหายไปแล้ว |
| "ยังไม่มีรายการ" เฉย ๆ | + วิธีบันทึก + ปุ่ม | ผู้ใช้ใหม่ไม่รู้ว่าปุ่มอยู่ไหน |
| กริดคนละ preset กับหน้ารายการ | `preset="product"` | ต้องเรียนรู้ layout ใหม่โดยไม่จำเป็น |
| ใช้แทนปุ่มเพิ่มลงตะกร้า | แยกกัน | ความสนใจ ≠ ความตั้งใจซื้อ |
| `WishlistHeader` (h1) + การ์ดค่าเริ่มต้น (h3) | `headingLevel={2}` ที่การ์ด | ข้ามระดับ 2 — axe จับได้ (`heading-order`) |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง ไม่มีแถวไหนอธิบายพฤติกรรมซ้ำ (นั่นคืองานของ §4 และ §5)

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · axe ผ่านใน `a11y/marketplace.test.tsx` ทั้ง `SaveButton` (2 variant) และ `WishlistGrid` (รวมกรณีว่าง) · เทส **"`SaveButton` มี `aria-pressed` และชื่อรวมชื่อรายการ"** (SC 2.5.3) |
| ตอบสนอง (Responsive) | ✅ | `min-w-0` · ปุ่มบันทึกเป็นเป้า ≥24×24 (SC 2.5.8) แม้เป็น variant ไอคอนที่ลอยอยู่มุมการ์ด |
| โหมดมืด (Dark Mode) | ✅ | `lint-classes.mjs` 0 จุด — ทุกสีมาจาก token ที่ override ในโหมดมืดแล้ว |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | `lint-quality.mjs` 0 จุด — ไม่มี `ml-`/`pl-`/`left-` ในไฟล์นี้ |
| คีย์บอร์ด (Keyboard) | ✅ | §4 `focus-visible` · ปุ่มบันทึกได้ `z-(--z-raised)` อัตโนมัติผ่าน `actions` ของ [`EntityCard`](./EntityCard.md) จึงกดถึงจริงโดยไม่ถูก link overlay กลืน |
| กำลังโหลด (Loading) | — | `SC 4.1.3` ผลการบันทึกประกาศทันทีผ่าน `aria-pressed` — ไม่มีช่วงรอที่ต้องแสดง |
| ข้อผิดพลาด (Error) | — | บันทึกไม่สำเร็จแจ้งด้วย [`<Alert>`](../feedback/Alert.md) ที่ระดับหน้า |
| ว่างเปล่า (Empty) | ✅ | axe ผ่านกรณี `WishlistGrid count={0}` พร้อม `emptyAction` ("เลือกดูสินค้า") — รายการที่บันทึกว่างต้องมีทางออก |
| Skeleton | — | รายการที่บันทึกอ่านจาก store ในเครื่อง |
| การเคลื่อนไหว (Animation) | ✅ | `base.css §10` ครอบ `*` ด้วย `!important` — ไม่มีการเคลื่อนไหวที่หลุดตัวกัน (`lint-quality.mjs` 0 จุด) — ปุ่มบันทึกเปลี่ยนเฉพาะสีและไอคอน ไม่มีหัวใจเต้น |
| ประสิทธิภาพ (Performance) | ✅ | §4 `disabled` มีจริงเพราะปุ่มนี้เป็นปุ่ม ไม่ใช่ลิงก์ · animate เฉพาะสี · ไม่มีความสูงตายตัว |
