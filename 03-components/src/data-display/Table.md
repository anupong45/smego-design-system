# Table

> ตารางข้อมูล **อ่าน + เรียงลำดับ + คำสั่งต่อแถว** — ใช้ `<table>` ปกติ ไม่ใช่ RAC `Table`

---

## 1 · ★★★ ทำไมไม่ใช้ RAC `Table` — วัดแล้วตัดสินแล้ว

| | gzip |
|---|---|
| baseline (`Button` ตัวเดียว) | 30.5 KB |
| + RAC `Table` | **74.7 KB** |

**+44 KB gzip คือเกินเท่าตัว** อยู่ในลีกเดียวกับ [`Typeahead`](../inputs/Typeahead.md) (+43) และ [`Selector`](../inputs/Selector.md) (+40) ที่รอบ grill 2026-07-26 ตัดสินว่าต้อง lazy-load

สิ่งที่ได้มาแลกกับ 44 KB คือ **selection · การเดินด้วยลูกศรแบบ 2 มิติ · drag-and-drop** — ซึ่งเป็นของที่ขอบเขตตัดออกไปทั้งชุด (read + sort + row action)

เหตุผลที่หนักกว่าขนาด: RAC ประกาศ `role="grid"` ซึ่งเปลี่ยนพฤติกรรม screen reader เป็นแบบ **application** ผู้ใช้ต้องเรียนรู้การเดินด้วยลูกศร · ตารางอ่านอย่างเดียวที่ใช้ semantic ของ `<table>` จริง screen reader รองรับดีกว่า **และไม่มีต้นทุน**

และ [`CompareTable`](../marketplace/Compare.md) ใช้ `<table>` ปกติอยู่แล้ว — ถ้าตัวนี้ใช้ RAC ระบบจะมีตารางสองแบบที่ผู้ใช้ screen reader เจอคนละโมเดล ซึ่งเป็น "สองวิธีทำสิ่งเดียวกัน" ที่ระบบนี้ปฏิเสธซ้ำ ๆ → **D38**

---

## 2 · เมื่อไหร่ใช้อะไร

| | ใช้ |
|---|---|
| หลายรายการ · หลายคุณสมบัติ · **แต่ละแถวคนละ entity** | `<Table>` |
| เทียบสินค้าไม่กี่ชิ้นแบบคุณสมบัติต่อคุณสมบัติ | [`<CompareTable>`](../marketplace/Compare.md) — สลับแกน |
| คู่ชื่อ/ค่าของ **entity เดียว** | [`<DescriptionList>`](./DescriptionList.md) |
| การ์ดสินค้าในกริด | [`<ProductCard>`](../marketplace/ProductCard.md) + [`<Grid>`](../layout/Grid.md) |

⚠️ `<Grid>` ไม่ใช่ตาราง — ไม่มี `<th>` และ `scope` จึงไม่มีความหมายเชิงตาราง

---

## 3 · การใช้งาน

```tsx
const columns: TableColumn<Order>[] = [
  { key: 'product', header: 'สินค้า', isSortable: true },
  {
    key: 'amount', header: 'ยอดรวม', align: 'end', isSortable: true,
    render: (r) => <span className="font-numeric">{fmt(r.amount)}</span>,
  },
  { key: 'status', header: 'สถานะ', render: (r) => <Badge label={r.status} /> },
];

<Table
  label="คำสั่งซื้อของฉัน"
  columns={columns}
  rows={orders}
  rowKey={(r) => r.id}
  sortBy={sort.key}
  sortDirection={sort.dir}
  onSortChange={(key, dir) => setSort({ key, dir })}
  rowAction={(r) => (
    <DropdownMenuTrigger>
      <IconButton name="more-vertical" label={`คำสั่งสำหรับ ${r.product}`} />
      <DropdownMenu>…</DropdownMenu>
    </DropdownMenuTrigger>
  )}
  emptyState={<EmptyState title="ยังไม่มีคำสั่งซื้อ" />}
/>
```

---

## 4 · Props

| prop | type | หมายเหตุ |
|---|---|---|
| `label` | `string` | **บังคับ** — accessible name · หลายตารางในหน้าเดียวต้องชื่อต่างกัน |
| `columns` | `TableColumn<T>[]` | **บังคับ** |
| `rows` | `T[]` | **บังคับ** |
| `rowKey` | `(row) => string` | **บังคับ** — ต้องไม่ซ้ำ |
| `sortBy` · `sortDirection` | `string` · `'ascending' \| 'descending'` | คอลัมน์ที่กำลังเรียง |
| `onSortChange` | `(key, direction) => void` | ไม่ส่ง = ไม่มีปุ่มเรียงเลย |
| `rowAction` | `(row) => ReactNode` | วางในเซลล์สุดท้าย (ดู §6) |
| `rowActionLabel` | `string` | หัวคอลัมน์คำสั่ง · ค่าเริ่มต้น `"คำสั่ง"` |
| `emptyState` | `ReactNode` | ไม่ส่ง = ไม่ render อะไรเลยเมื่อ `rows` ว่าง |

### `TableColumn<T>`

| field | หมายเหตุ |
|---|---|
| `key` | ใช้อ้างในการเรียง · ต้องไม่ซ้ำ |
| `header` | หัวคอลัมน์ที่เห็นและที่ SR อ่าน · ใช้เป็น `data-label` ที่ <lg ด้วย |
| `align` | `end` สำหรับตัวเลข — ทศนิยมเรียงตรงกันเมื่อชิดขวา |
| `isSortable` | เรียงตามคอลัมน์นี้ได้ |
| `render` | วาดเซลล์ · ค่าเริ่มต้นอ่าน `row[key]` เป็น string |

★ การเรียงเป็น **controlled เท่านั้น** ไม่มี state ในตัว — ข้อมูลจริงมาจาก API ที่เรียงฝั่งเซิร์ฟเวอร์เป็นส่วนใหญ่ การเก็บ state ไว้ในตารางจะเกิดสองแหล่งความจริงทันทีที่ต่อ API

---

## 5 · การเรียงลำดับ

| | อยู่ที่ไหน |
|---|---|
| **สถานะปัจจุบัน** | `aria-sort` บน `<th>` — ARIA กำหนดว่าเป็นคุณสมบัติของหัวคอลัมน์ ใส่ที่ปุ่มข้างในแทน SR จะไม่ประกาศเลย |
| **สิ่งที่จะเกิดเมื่อกด** | `aria-label` ของปุ่ม |
| **ตัวชี้ที่ไม่ใช่สี** | ลูกศรขึ้น/ลง (SC 1.4.1) · ตอนไม่ได้เรียง **ไม่มีไอคอนเลย** จึงไม่ต้องเดาว่าลูกศรจาง ๆ หมายถึงอะไร |

★ ปุ่มบอก *สิ่งที่จะเกิด* ไม่ใช่สถานะ เพราะสถานะอยู่ใน `aria-sort` แล้ว — ถ้าปุ่มบอกซ้ำ ผู้ใช้จะได้ยินสองครั้งแล้วสับสนว่ากดไปจะได้อะไร (หลักเดียวกับ [`Pagination`](../navigation/Pagination.md))

⚠️ **ฉบับแรกคำนวณทิศทางกลับข้าง** — ปุ่มประกาศว่า "จากน้อยไปมาก" ทั้งที่กดแล้วได้มากไปน้อย · ตาเห็นถูกแต่ SR ได้ข้อมูลผิด · จับได้ด้วยเทส แก้แล้วโดยให้ `onClick` กับ `aria-label` ใช้ตัวแปร `next` **ตัวเดียวกัน** เพราะการคำนวณสองที่คือทางที่ทำให้สองอย่างหลุดจากกัน

---

## 6 · ★★ ไม่มีแถวที่กดได้ทั้งแถว

แถวที่กดได้ทั้งแถวเป็นกับดักสามชั้น:

1. ผู้ใช้ screen reader **ไม่รู้ว่ากดได้** — `<tr>` ไม่ประกาศตัวเองว่าเป็นปุ่ม
2. ผู้ใช้คีย์บอร์ดต้อง **Tab ผ่านทุกแถว**
3. การลากเลือกข้อความในเซลล์**กลายเป็นการกด**

`rowAction` จึงรับ element มาวางในเซลล์สุดท้าย ให้เป็นปุ่มหรือ [`DropdownMenu`](../navigation/DropdownMenu.md) จริง — เป้าที่ประกาศตัวเองได้

★ ปุ่มต้องบอกว่าเป็นของแถวไหน: `label={`คำสั่งสำหรับ ${r.product}`}` ไม่ใช่ `"เพิ่มเติม"` ลอย ๆ (SC 2.4.4) · หลักเดียวกับ [`DropdownMenu` §5](../navigation/DropdownMenu.md)

★ หัวคอลัมน์คำสั่งต้องมีข้อความจริง — คอลัมน์ไม่มีชื่อทำให้ SR อ่านว่า "column 4" เปล่า ๆ

---

## 7 · ที่ <lg แต่ละแถวกลายเป็นการ์ด

**ไม่ใช่การสลับแกนแบบ `CompareTable`** — แถวของตารางข้อมูลเป็น **คนละ entity** ส่วนแถวของ CompareTable เป็นค่าของคุณสมบัติเดียวกัน (คำตัดสิน 2026-07-26)

`thead` ถูกซ่อน (`max-lg:hidden`) ชื่อคอลัมน์กลับมาผ่าน `::before` ที่อ่านจาก `data-label` — ถ้าไม่มี การ์ดจะเหลือแต่ตัวเลขลอย ๆ ที่ไม่บอกว่าเป็นอะไร

### ★★★ `role` ต้องเขียนครบทุกชั้น — ห้ามลบ

Safari/VoiceOver **ทิ้ง semantic ของตาราง** เมื่อ `display` ถูกเปลี่ยน ซึ่งเกิดขึ้นจริงที่ <lg ตอนแถวกลายเป็นการ์ด (`max-lg:grid`) · `role="table"` `rowgroup` `row` `columnheader` `cell` ที่เขียนไว้จึงเป็นสิ่งเดียวที่ทำให้ตารางยังเป็นตาราง

เหตุผลเดียวกับที่ `CompareTable` เขียน role ไว้ทุกตัว · ล็อกด้วยเทสแล้ว

---

## 8 · กับดัก

| อย่าทำ | ทำแบบนี้ | เพราะ |
|---|---|---|
| ลบ `role` เพราะ "`<table>` มีอยู่แล้ว" | คงไว้ | Safari/VoiceOver ทิ้ง semantic เมื่อ display เปลี่ยน (§7) |
| `<tr onClick>` | `rowAction` | กับดักสามชั้น (§6) |
| `label="ตาราง"` | ระบุว่าตารางอะไร | หลายตารางในหน้าเดียวแยกไม่ออก |
| `rowAction` แล้ว label ว่า "เพิ่มเติม" | ระบุแถว | SC 2.4.4 |
| เก็บ state การเรียงในตาราง | controlled | สองแหล่งความจริงเมื่อต่อ API (§4) |
| `rows={[]}` แล้วปล่อยหัวตารางลอย | ส่ง `emptyState` | ผู้ใช้รอว่าโหลดอยู่หรือไม่มีจริง |
| ตัวเลขชิด `start` | `align="end"` + `font-numeric` | ทศนิยมไม่เรียงกัน อ่านเทียบยาก |

---

## 9 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 §6 §7 · axe ผ่านใน `a11y/table.test.tsx` · เทส "role ครบทุกชั้น" · "scope=col" · "aria-sort อยู่ที่ th" · "ชื่อปุ่มบอกสิ่งที่จะเกิด" · "คำสั่งอยู่ในเซลล์ ไม่ใช่ทั้งแถว" |
| ตอบสนอง (Responsive) | ✅ | §7 ที่ <lg แถวเป็นการ์ด + `data-label` — เทส "ชื่อคอลัมน์กลับมาผ่าน data-label" · ไม่เลื่อนแนวนอน (SC 1.4.10) |
| โหมดมืด (Dark Mode) | ✅ | `lint-classes.mjs` 0 จุด — ทุกสีมาจาก token ที่ override แล้ว · อยู่ใน contrast sweep ทั้งสองโหมด |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | `lint-quality.mjs` 0 จุด — `text-start`/`text-end` · `px-3` ไม่มีข้าง |
| คีย์บอร์ด (Keyboard) | ✅ | ปุ่มเรียงเป็น `<button>` จริง → tab stop ตามลำดับเอกสาร · **ไม่มี** grid navigation โดยเจตนา (§1) · เป้า `min-h-11` = 44px |
| กำลังโหลด (Loading) | — | ตารางไม่มีสถานะโหลดของตัวเอง · ใช้ [`Skeleton`](../feedback/Skeleton.md) แทนทั้งก้อนตาม §8.5 (รู้รูปร่างล่วงหน้า) |
| ข้อผิดพลาด (Error) | — | ไม่มีสถานะผิดพลาดของตัวเอง · โหลดไม่สำเร็จใช้ [`Banner`](../feedback/Banner.md) |
| ว่างเปล่า (Empty) | ✅ | `emptyState` · ไม่ส่ง = ไม่ render อะไรเลย — เทสทั้งสองทาง |
| Skeleton | — | ความสูงขึ้นกับจำนวนแถว จึงเป็นหน้าที่ผู้เรียกจอง |
| การเคลื่อนไหว (Animation) | ✅ | `transition-colors` ที่ปุ่มเรียงเท่านั้น — อยู่ในรายการ ALLOW ของ reduced motion |
| ประสิทธิภาพ (Performance) | ✅ | §1 — **ไม่เพิ่ม bundle เลย** (ไม่ import RAC) · เกต `check:bundle` ยืนยันว่าหน้า listing ยังอยู่ที่ 44.4 KB หลังเพิ่ม component นี้ |
