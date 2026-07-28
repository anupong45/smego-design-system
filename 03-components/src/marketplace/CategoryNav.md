# CategoryNav · CategoryBreadcrumb

**`@smego/ui`** · ชั้น 03 · [CategoryNav.tsx](./CategoryNav.tsx)

---

## 1 · ภาพรวม

การนำทางระหว่างหมวดหมู่ และเส้นทางที่บอกว่าผู้ใช้อยู่ตรงไหน

**หมวดหมู่ไม่ใช่ตัวกรอง** — เป็น **ตำแหน่งที่อยู่** ซึ่งเปลี่ยนทุกอย่างเกี่ยวกับ markup ที่ถูกต้อง

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน | เหตุผล |
|---|---|---|
| เลือกหลายหมวดพร้อมกัน | `<CheckboxGroup>` ใน `<FilterPanel>` | นั่นคือตัวกรอง ไม่ใช่การนำทาง |
| สลับมุมมองของข้อมูลเดียวกัน | `<Tabs>` (Pass 4) | Tab ไม่เปลี่ยน URL |
| หมวดเกิน ~12 หมวด | `<CategoryNav layout="list">` ในแถบข้าง | แถวเลื่อนที่ยาวเกินไปหาไม่เจอ |
| ตัวกรองที่ยกเลิกได้ | `<Token>` | หมวด "ยกเลิก" ไม่ได้ — ต้องกลับหมวดแม่ |

---

## 2 · React API

```tsx
<CategoryBreadcrumb items={[
  { name: 'หน้าแรก', href: '/' },
  { name: 'เครื่องจักรและอุปกรณ์อุตสาหกรรม', href: '/c/machinery' },
  { name: 'เครื่องแปรรูปอาหารและเครื่องดื่ม' },
]} />

<CategoryNav currentId="roast" allHref="/c/food" items={categories} />
```

### CategoryNav

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `items` | `CategoryItem[]` | — | `{ id, name, href, count? }` |
| `currentId` | `string` | — | หมวดที่อยู่ตอนนี้ |
| `allHref` | `string` | — | เพิ่มลิงก์ "ทุกหมวดหมู่" นำหน้า |
| `layout` | `'scroll' \| 'list'` | `'scroll'` | แถวเลื่อน / รายการแนวตั้ง |

### CategoryBreadcrumb

| prop | type | หมายเหตุ |
|---|---|---|
| `items` | `BreadcrumbItem[]` | `{ name, href? }` · **ตัวสุดท้ายไม่มี `href`** |

---

## 3 · Variants

| layout | รูปแบบ | ใช้เมื่อไร |
|---|---|---|
| `scroll` | แถวแนวนอน เลื่อนได้ + snap | เหนือผลลัพธ์ · มือถือ |
| `list` | รายการแนวตั้ง | แถบข้างบนเดสก์ท็อป |

| สถานะ | สี |
|---|---|
| ปกติ | `text-fg-secondary` · hover `bg-sunken` |
| **ปัจจุบัน** | `bg-primary-50 text-primary-800` + `aria-current="page"` |

### ★ บนมือถือเลื่อนแนวนอน **ไม่ใช่ตัดบรรทัด**

ชื่อหมวดไทยยาว — "เครื่องจักรและอุปกรณ์อุตสาหกรรม" คือ 31 ตัวอักษร

การตัดบรรทัดจะกินความสูง **4–5 แถว** ก่อนถึงเนื้อหาจริง ซึ่งบนจอ 320px คือครึ่งหน้าจอ

`layout="list"` **ไม่** ใช้ `whitespace-nowrap` เพราะในแถบข้างชื่อต้องอ่านครบ — ห้าม truncate

---

## 4 · States

| state | สิ่งที่เปลี่ยน |
|---|---|
| default | `text-fg-secondary` |
| hover | `bg-sunken` · `text-fg` |
| focus-visible | วงแหวน 2 ชั้น (มีที่ให้ล้นจาก `p-1` ของ `<ul>`) |
| **current** | `bg-primary-50` · `text-primary-800` · `aria-current="page"` |

### ★ เป้ากด ≥40px

`px-3 py-2` บน `text-body-sm` (line-height 24px) = **40px สูง** ผ่าน SC 2.5.8 สบาย ๆ ทั้งสอง layout

---

## 5 · Accessibility

| เรื่อง | ข้อกำหนด |
|---|---|
| landmark | `<nav aria-label="หมวดหมู่">` และ `<nav aria-label="ตำแหน่งที่อยู่ในเว็บไซต์">` |
| **SC 1.3.1** | `<ul>` / `<ol>` จริง |
| **SC 2.4.8** | breadcrumb บอกตำแหน่งในโครงสร้าง |
| **SC 2.4.7** | `p-1` บน `<ul>` เผื่อวงแหวนใน scroll container |
| **SC 2.5.8** | เป้า 40px |

### ★★ เป็น **ลิงก์ ไม่ใช่ปุ่ม** — หมวดหมู่คือ URL

ผู้ใช้ต้อง **bookmark หมวดได้ · แชร์ลิงก์หมวดให้เพื่อนร่วมงานได้ · กด Back กลับหมวดก่อนหน้าได้ · เปิดหลายหมวดในหลายแท็บเพื่อเทียบได้**

ทั้งหมดนี้ `onClick` ให้ไม่ได้เลย — และการเปิดหลายแท็บคือพฤติกรรมจริงของผู้ซื้อ B2B ที่เปรียบเทียบข้ามหมวด

### ★★ `aria-current="page"` ไม่ใช่ `aria-pressed`

`aria-pressed` สื่อ **toggle ที่กดซ้ำเพื่อปิดได้** ซึ่งไม่ตรงกับหมวด

หมวดเลือกได้ทีละอัน และ "ยกเลิก" หมายถึง **กลับไปหมวดแม่** ไม่ใช่ปิดสถานะ

### ★★ ตัวเลขจำนวนต้องมีคำกำกับสำหรับ screen reader

**ข้อบกพร่องที่วัดเจอจริง:** ชื่อ accessible ออกมาเป็น

```
"เครื่องคั่วและอบ128"
```

ไม่มีช่องว่างระหว่าง element และ **"128" เฉย ๆ ไม่บอกว่า 128 อะไร**

แก้โดยซ่อนตัวเลขที่มองเห็นจาก screen reader แล้วเพิ่มข้อความเต็ม:

```tsx
<span aria-hidden="true" className="text-caption text-fg-muted font-numeric">
  {item.count.toLocaleString('en-US')}
</span>
<span className="sr-only">{` ${s.category.itemCount(item.count)}`}</span>
```

**วัดหลังแก้:** `"เครื่องคั่วและอบ 128 รายการ"` ✅

### ★ รายการสุดท้ายของ breadcrumb ไม่ใช่ลิงก์

ลิงก์ที่ชี้มาที่ตัวเองทำให้ผู้ใช้ screen reader สับสน — render เป็น `<span aria-current="page">`

### ★ ตัวคั่นอยู่ใน `aria-hidden`

screen reader ได้โครงสร้างจาก `<ol>` อยู่แล้ว — ถ้าไม่ซ่อน ผู้ใช้จะได้ยิน "มากกว่า" ทุกขั้น

### ★ breadcrumb ห้ามยุบเป็น "…" ตรงกลาง

ผู้ใช้ต้องเห็นว่าตัวเองอยู่ตรงไหนของโครงสร้าง (ข้อ 01 §4.3) — เลื่อนแนวนอนได้แทน

---

## 6 · Tailwind implementation

```tsx
<nav aria-label={s.category.title}>
  <ul className={cn('flex min-w-0',
    isScroll ? [
      'items-center gap-2',
      'overflow-x-auto snap-x',
      '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
      'p-1',                                 /* วงแหวน focus 4px */
      '[&>li]:shrink-0 [&>li]:snap-start',
    ] : 'flex-col gap-0.5',
  )}>
    …
    <Link href={item.href} quiet size="body-sm"
      aria-current={isCurrent ? 'page' : undefined}
      className={cn(
        'flex items-center gap-1.5',
        'rounded-(--radius-control) px-3 py-2',       /* เป้า 40px */
        'transition-colors duration-fast ease-standard',
        isCurrent ? 'bg-primary-50 text-primary-800'
                  : 'text-fg-secondary data-hovered:bg-sunken data-hovered:text-fg',
        isScroll ? 'whitespace-nowrap' : 'min-w-0',
      )}
    >
```

`quiet` ใช้ได้ที่นี่เพราะ **บริบทเป็น `<nav>` ที่บอกอยู่แล้วว่าเป็นลิงก์** (ดู [Link.md §3](../inputs/Link.md))

---

## 7 · Figma Variant

Component set **`CategoryNav`**

| Property | Values |
|---|---|
| `Layout` | `Scroll` · `List` |
| `State` | `Default` · `Hover` · **`Focus`** · **`Current`** |
| `Count` | `True` · `False` |

Component set **`CategoryBreadcrumb`** — property `Depth` = `2` · `3` · `4`

**`Scroll` frame ต้องอยู่ที่ 320px และมีหมวด 5 หมวดที่ชื่อยาวจริง** เพื่อพิสูจน์ว่าเลื่อนแนวนอนไม่ใช่ตัดบรรทัด

**ต้องระบุใน description ว่าจำนวนมี `sr-only` ต่อท้ายว่า "รายการ"** ไม่งั้นนักพัฒนาจะลบทิ้งเพราะไม่เห็นในดีไซน์

---

## 8 · Usage

```tsx
<CategoryBreadcrumb items={[
  { name: 'หน้าแรก', href: '/' },
  { name: 'เครื่องจักรและอุปกรณ์อุตสาหกรรม', href: '/c/machinery' },
  { name: 'เครื่องแปรรูปอาหารและเครื่องดื่ม' },   /* ไม่มี href = หน้าปัจจุบัน */
]} />

<CategoryNav currentId="roast" allHref="/c/food" items={[
  { id: 'roast', name: 'เครื่องคั่วและอบ', href: '/c/food/roast', count: 128 },
  { id: 'mix',   name: 'เครื่องผสมและนวด', href: '/c/food/mix',   count: 64 },
  { id: 'pack',  name: 'เครื่องบรรจุและซีล', href: '/c/food/pack', count: 212 },
]} />
```

```tsx
// แถบข้างบนเดสก์ท็อป — ชื่อเต็ม ไม่ truncate
<CategoryNav layout="list" currentId={current} items={categories} />
```

---

## 9 · Anti-patterns

| ❌ | ✅ | ทำไม |
|---|---|---|
| `<button onClick={setCategory}>` | `<Link href>` | bookmark ไม่ได้ · เปิดหลายแท็บเทียบไม่ได้ |
| `aria-pressed` | `aria-current="page"` | หมวดคือตำแหน่ง ไม่ใช่ toggle |
| ตัวเลขลอย ๆ ไม่มีคำกำกับ | + `sr-only` "N รายการ" | ชื่ออ่านว่า "เครื่องคั่วและอบ128" |
| หมวดตัดบรรทัดบนมือถือ | เลื่อนแนวนอน | ชื่อหมวดไทยยาว — กินครึ่งจอ |
| `truncate` ใน `layout="list"` | ปล่อยให้ wrap | ชื่อหมวดต้องอ่านครบในแถบข้าง |
| breadcrumb ตัวสุดท้ายเป็นลิงก์ | `<span aria-current="page">` | ลิงก์ชี้มาที่ตัวเองทำให้สับสน |
| breadcrumb ยุบเป็น "…" | เลื่อนแนวนอน | ผู้ใช้ต้องเห็นว่าอยู่ตรงไหน |
| ตัวคั่นไม่มี `aria-hidden` | มี | ได้ยิน "มากกว่า" ทุกขั้น |
| `<div>` แทน `<nav>` | `<nav aria-label>` | ข้ามการนำทางไม่ได้ |
| ใช้ `<Token>` แทนหมวด | `<CategoryNav>` | chip สื่อว่าเลือกหลายอันและยกเลิกได้ |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง ไม่มีแถวไหนอธิบายพฤติกรรมซ้ำ (นั่นคืองานของ §4 และ §5)

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · axe ผ่านใน `a11y/marketplace.test.tsx` ทั้ง `CategoryNav` และ `CategoryBreadcrumb` · `SC 1.3.1` เป็น `<nav>` + `<ul>` จริง |
| ตอบสนอง (Responsive) | ✅ | `min-w-0` — ชื่อหมวดไทยยาวตัดบรรทัดแทนดันแถวล้น |
| โหมดมืด (Dark Mode) | ✅ | `lint-classes.mjs` 0 จุด — ทุกสีมาจาก token ที่ override ในโหมดมืดแล้ว |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | `lint-quality.mjs` 0 จุด — ไม่มี `ml-`/`pl-`/`left-` ในไฟล์นี้ |
| คีย์บอร์ด (Keyboard) | ✅ | §4 `focus-visible` และ `current` แยกกัน · `SC 2.4.8` ตำแหน่งปัจจุบันประกาศด้วย `aria-current` ไม่ใช่แค่ตัวหนา · `SC 2.4.7` วงแหวนไม่ถูกตัด |
| กำลังโหลด (Loading) | — | หมวดหมู่มาพร้อมหน้า |
| ข้อผิดพลาด (Error) | — | เมนูนำทางไม่ถือความถูกต้องของข้อมูล |
| ว่างเปล่า (Empty) | — | หมวดที่ไม่มีรายการยังต้องแสดง — `count` เป็น `0` บอกความจริงได้ดีกว่าการซ่อนหมวดทิ้ง |
| Skeleton | — | รายการหมวดสั้นและมาพร้อมหน้า |
| การเคลื่อนไหว (Animation) | ✅ | `base.css §10` ครอบ `*` ด้วย `!important` — ไม่มีการเคลื่อนไหวที่หลุดตัวกัน (`lint-quality.mjs` 0 จุด) |
| ประสิทธิภาพ (Performance) | ✅ | animate เฉพาะสี · ไม่มีความสูงตายตัว |
