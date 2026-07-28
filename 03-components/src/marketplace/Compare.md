# CompareBar · CompareTable

**`@smego/ui`** · ชั้น 03 · [Compare.tsx](./Compare.tsx)

---

## 1 · ภาพรวม

การเปรียบเทียบสินค้า — แถบลอยที่ก้นจอเก็บรายการที่เลือก และตารางที่แสดงคุณสมบัติเทียบกัน

**ตารางที่ 320px สลับเป็นแนวตั้ง** ซึ่งเป็นการตัดสินใจที่ต้องอธิบายให้ตรง (ดู §3)

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน | เหตุผล |
|---|---|---|
| แสดงสเปกของสินค้าเดียว | [`<DescriptionList>`](../data-display/DescriptionList.md) | ไม่มีอะไรให้เทียบ |
| ตารางข้อมูลทั่วไป | [`<Table>`](../data-display/Table.md) | อ่าน + **เรียงลำดับ** + คำสั่งต่อแถว · ⚠️ แถวเดิมเขียนว่า "เลือกแถวได้" ซึ่งขอบเขตถอนไปแล้วตั้งแต่คำตัดสิน 2026-07-26 |
| เทียบเกิน ~4 รายการ | จำกัดที่ 4 | คอลัมน์แคบเกินกว่าจะอ่าน |

---

## 2 · React API

```tsx
<CompareBar items={selected} onRemove={remove} onClearAll={clear} onOpen={open} />
<CompareTable items={selected} rows={rows} onRemove={remove} />
```

### CompareBar

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `items` | `CompareItem[]` | — | `{ id, name }` |
| `onRemove` · `onClearAll` · `onOpen` | `() => void` | — | **บังคับทั้งสาม** |
| `maxItems` | `number` | `4` | แสดงข้อความเตือนเมื่อถึงเพดาน |

### CompareTable

| prop | type | หมายเหตุ |
|---|---|---|
| `items` | `CompareItem[]` | คอลัมน์ |
| `rows` | `CompareRow[]` | `{ label, values }` · `values` เรียงตรงกับ `items` |
| `onRemove` | `(id) => void` | ปุ่ม × ในหัวคอลัมน์ |

---

## 3 · Variants

ไม่มี variant — layout เปลี่ยนตาม breakpoint เท่านั้น

| breakpoint | `<thead>` | `<tr>` | `<td>` |
|---|---|---|---|
| `< lg` | `display: none` | `grid` (บล็อกต่อคุณสมบัติ) | `grid` + `::before` = ชื่อสินค้า |
| `≥ lg` | `table-header-group` | `table-row` | `table-cell` |

**วัดจริงทั้งสองฝั่ง:**

| | 320px | 1280px |
|---|---|---|
| `thead` | `none` | `table-header-group` |
| `tr` | `grid` | `table-row` |
| `td` | `grid` | `table-cell` |
| `::before` | `"เครื่องคั่วกาแฟ TR-500"` | `none` |

### ★★★ ที่ 320px สลับเป็นแนวตั้ง — **เหตุผลคือการใช้งาน ไม่ใช่การผ่านเกณฑ์**

⚠️ **ต้องพูดให้ตรง: SC 1.4.10 ยกเว้นตาราง**

ตัวบทเขียนว่า *"except for parts of the content which require two-dimensional layout"* — ตารางข้อมูลเข้าข่ายข้อยกเว้นนั้น ดังนั้น **ตารางที่เลื่อนแนวนอนในกล่องตัวเองไม่ได้ผิดเกณฑ์**

เหตุผลจริงที่เลือกแนวตั้งคือ: การเทียบสินค้า 3 ตัวโดยเลื่อนแนวนอนบนจอ 320px แปลว่า **ไม่มีทางเห็นสองค่าพร้อมกันเลย** ซึ่งทำลายเหตุผลทั้งหมดของการเปรียบเทียบ

**วิธีที่ใช้:** `<tr>` = **คุณสมบัติหนึ่งข้อ** · บนมือถือแต่ละแถวกลายเป็นบล็อกที่มีหัวข้อคุณสมบัติแล้วเรียงค่าของทุกสินค้าใต้กัน

→ เทียบ "ราคา" ของ 3 ตัวได้ **ในสายตาเดียว**

---

## 4 · States

`CompareBar` **ไม่ render เลยเมื่อ `items` ว่าง** — แถบเปล่าที่ก้นจอกินพื้นที่โดยไม่ให้อะไร

ปุ่ม "ดูการเปรียบเทียบ" `isDisabled` เมื่อมีน้อยกว่า 2 รายการ — เทียบของชิ้นเดียวไม่มีความหมาย

### ★ เข้าด้วย opacity เท่านั้น

`animate-[fade-in_150ms_ease-out] motion-reduce:animate-none` — ไม่มี transform ที่กระตุ้นระบบทรงตัว (ข้อ 07)

---

## 5 · Accessibility

| เรื่อง | ข้อกำหนด |
|---|---|
| `CompareBar` | `role="region"` + `aria-label` — **วัดแล้ว** |
| จำนวนที่เลือก | `aria-live="polite"` |
| **SC 2.5.3** | ปุ่ม × มีชื่อสินค้าในชื่อปุ่ม |
| **SC 2.4.11** | แถบ fixed → ประกาศ `--compare-bar-height` (ดูล่าง) |
| **SC 1.3.1** | role ของตารางประกาศชัดเจน (ดูล่าง) |
| **SC 2.4.7** | `p-1` ในรายการที่เลื่อนได้ |

### ★★★ เปลี่ยน `display` แล้วต้อง **ใส่ role กลับเอง**

Safari + VoiceOver **ทิ้ง semantic ของตาราง** เมื่อ `display` ไม่ใช่ `table` / `table-row` / `table-cell` — เป็นบั๊กที่รู้กันมานานและยังไม่หาย

component จึงประกาศไว้ทุกตัว:

```tsx
role="table" · role="rowgroup" · role="row" · role="cell"
role="rowheader" · role="columnheader"
```

**ห้ามลบ** — ถ้าลบ ตารางบนมือถือจะกลายเป็น `<div>` กองหนึ่งสำหรับผู้ใช้ VoiceOver

**วัดแล้ว:** ทุก role ยังอยู่ครบหลัง `display` เปลี่ยนเป็น `grid`

### ★★★ แถบ fixed ทับ focus — SC 2.4.11

แถบที่ลอยอยู่ก้นจอ **ทับ element ที่ถูก focus ได้** เหมือน sticky header

**เรื่องนี้แก้ผิดมาแล้วสองรอบ** — บันทึกทั้งสองไว้เพราะแต่ละรอบดูเหมือนพอแล้ว

#### รอบที่ 1 · ประกาศความสูงจริง — จำเป็นแต่ไม่พอ

ค่าเริ่มต้นของตัวแปรความสูงคือ 56px แต่แถบนี้วัดจริงได้ **77px** ที่ 1280px และ **201px** ที่ 320px (ซ้อนสามบรรทัด) · ถ้าไม่วัดจริง ผู้ใช้คีย์บอร์ดที่ Tab ไปปุ่มท้ายหน้าจะเห็นปุ่มโผล่ครึ่งเดียว

#### รอบที่ 2 · `scroll-margin` อย่างเดียวไม่พอ — Playwright พิสูจน์

`scroll-margin` ช่วยเฉพาะตอนที่ browser **ต้องเลื่อน** · element ที่อยู่ท้ายเอกสารพอดี **ไม่มีที่ให้เลื่อนต่อ** browser จึงถือว่า "เห็นแล้ว" และปล่อยให้จมใต้แถบ

เทส `Tab ทั้งหน้าที่ 320px` จับได้ 3 element ที่ถูกบังจนมิด:

```
BUTTON "ดูรายละเอียด"       top=593 bottom=631
BUTTON "ดูรายละเอียด"       top=593 bottom=631
A      "ลิงก์สุดท้ายของหน้า"  top=644 bottom=672
```

ต้อง **จองพื้นที่จริง** ท้ายเอกสารด้วย

#### รอบที่ 3 · แต่การเขียน global เองพังเมื่อมีแถบที่สอง ← โครงปัจจุบัน

สองรอบแรกแก้ด้วยการให้ component เขียน `--bottom-nav-height` และ `body.style.paddingBottom` เอง **ซึ่งพังทันทีที่ `BottomNav` อยู่บนจอด้วย**:

```
BottomNav 56px + CompareBar 201px  → ต้องจอง 257px
แต่ทั้งคู่เขียนตัวแปรเดียวกัน last-writer-wins → จองแค่ 201px
```

เป็นบั๊กที่ **มองไม่เห็นจนกว่าทั้งคู่จะอยู่บนจอพร้อมกัน**

**โครงปัจจุบัน — แต่ละแถบเขียนเฉพาะตัวแปรของตัวเอง:**

```tsx
useLayoutEffect(() => {
  const publish = () => {
    root.style.setProperty('--compare-bar-height', `${el.offsetHeight}px`);
  };
  publish();
  const observer = new ResizeObserver(publish);
  observer.observe(el);
  return () => {
    observer.disconnect();
    /* คืนเป็น 0px ไม่ใช่ removeProperty — ให้ calc() ยังคำนวณได้ */
    root.style.setProperty('--compare-bar-height', '0px');
  };
}, [items.length, reserveSpace]);
```

ส่วนที่รวมและจองอยู่ในชั้น token ที่เดียว:

```css
/* semantic.css */
--bottom-inset: calc(
  var(--bottom-nav-height) + var(--compare-bar-height) + var(--action-bar-height)
);

/* base.css §5a */
@layer base { body { padding-bottom: var(--bottom-inset); } }
```

**⚠️ กฎที่ linter บังคับ** — component **ห้าม**แตะ `body.style.padding*` และ **ห้าม**เขียน `--bottom-inset` หรือตัวแปรของแถบอื่น

**วัดจริงหลังแก้** (จำลอง BottomNav 56px คู่กับ CompareBar ที่ 320px):

| | ค่า |
|---|---|
| `--bottom-nav-height` | 56px |
| `--compare-bar-height` | 201px |
| `body` padding-bottom | **257px** ← ตรงกับผลรวม |
| ลิงก์ท้ายหน้าตอนเลื่อนสุด | 567–595 · ขอบแถบ 699 → **ไม่ถูกบัง** |

`reserveSpace` ปิดได้ (`false`) เฉพาะเมื่อหน้าจัดการเองแล้ว · Playwright 3 เคสใน `Regression · --bottom-inset` กันไม่ให้ถอยกลับ

### ★ z-index มาจาก token

`z-(--z-bar)` = 30 · ชั้นเดียวกับ `BottomNav` เพราะทั้งคู่ **ซ้อนกันทางกายภาพ ไม่ใช่ทางสายตา** — ไม่มีทางทับกันเมื่อ `--bottom-inset` จองพื้นที่ถูก

### ★ `::before` เป็นการตกแต่งล้วน

ชื่อสินค้าที่กลับมาบนมือถือผ่าน `content: attr(data-item)` **ไม่ใช่** ช่องทางความหมาย — screen reader ได้ความสัมพันธ์จาก `scope="col"` / `scope="row"` อยู่แล้ว จึงไม่อ่านซ้ำ

---

## 6 · Tailwind implementation

```tsx
<tr role="row" className={cn(
  'border-b border-edge-subtle last:border-b-0',
  /* มือถือ: แถว = บล็อกของคุณสมบัติหนึ่งข้อ */
  'max-lg:grid max-lg:min-w-0 max-lg:gap-1 max-lg:rounded-(--radius-container)',
  'max-lg:border max-lg:border-edge-subtle max-lg:p-3',
)}>
  <th role="rowheader" scope="row"
      className="p-3 text-start align-top text-label text-fg-muted max-lg:p-0 max-lg:pb-1">
    {row.label}
  </th>
  {row.values.map((v, i) => (
    <td role="cell" key={items[i]?.id ?? i} data-item={items[i]?.name}
      className={cn(
        'min-w-0 p-3 align-top text-fg',
        'max-lg:grid max-lg:grid-cols-[8rem_1fr] max-lg:gap-2 max-lg:p-0 max-lg:py-1',
        'max-lg:before:content-[attr(data-item)] max-lg:before:min-w-0',
        'max-lg:before:text-caption max-lg:before:text-fg-muted',
      )}
    >
      <span className="min-w-0">{v}</span>
    </td>
  ))}
</tr>
```

`pb-[env(safe-area-inset-bottom)]` บน `CompareBar` — กันชนขอบล่างบนมือถือที่มีแถบระบบ

---

## 7 · Figma Variant

Component set **`CompareBar`**

| Property | Values |
|---|---|
| `Count` | `1` · `2` · `4 (max)` |
| `Breakpoint` | `Mobile (stacked)` · `Desktop (row)` |

Component set **`CompareTable`**

| Property | Values |
|---|---|
| `Layout` | **`Stacked (< lg)`** · `Table (≥ lg)` |
| `Items` | `2` · `3` · `4` |

**`Stacked` frame ต้องเป็นการจัดกลุ่มตาม *คุณสมบัติ* ไม่ใช่ตาม *สินค้า*** — ถ้านักออกแบบวาดเป็นการ์ดต่อสินค้า จะเสียความสามารถในการเทียบ ซึ่งเป็นทั้งหมดของ component นี้

**ต้องเขียนใน description ว่าแถบประกาศ `--compare-bar-height` ของตัวเอง** และชั้น token จองพื้นที่ให้อัตโนมัติ — หน้าที่ใช้ไม่ต้องทำอะไร

---

## 8 · Usage

```tsx
const rows = [
  { label: 'ราคา',          values: items.map((i) => fmtBaht(i.price)) },
  { label: 'กำลังการผลิต',   values: items.map((i) => i.capacity) },
  { label: 'สั่งขั้นต่ำ',      values: items.map((i) => `${i.moq} ${i.unit}`) },
  { label: 'ใบรับรอง',       values: items.map((i) => i.certifications.join(', ') || 'ไม่มี') },
];

<CompareTable items={items} rows={rows} onRemove={remove} />
```

```tsx
// แถบลอย — หน้าต้องเว้น padding ล่าง
<div className="pb-40">
  …
  <CompareBar items={selected} onRemove={remove}
    onClearAll={() => setSelected([])} onOpen={() => setOpen(true)} />
</div>
```

---

## 9 · Anti-patterns

| ❌ | ✅ | ทำไม |
|---|---|---|
| เลื่อนตารางแนวนอนที่ 320px | สลับเป็นแนวตั้ง | เห็นสองค่าพร้อมกันไม่ได้ = เทียบไม่ได้ |
| อ้างว่า "ตารางเลื่อนแนวนอนไม่ผ่าน 1.4.10" | อ้างเหตุผลด้านการใช้งาน | ตัวบทยกเว้นตารางไว้ชัดเจน |
| เปลี่ยน `display` โดยไม่ใส่ role | ประกาศ role ทุกตัว | Safari/VoiceOver ทิ้ง semantic ของตาราง |
| แนวตั้งจัดกลุ่มตามสินค้า | จัดกลุ่มตามคุณสมบัติ | เสียความสามารถในการเทียบ |
| แถบ fixed โดยไม่ประกาศความสูง | `--compare-bar-height` จากค่าที่วัดได้ | ปุ่มท้ายหน้าโผล่ครึ่งเดียวใต้แถบ (SC 2.4.11) |
| เขียน `--bottom-nav-height` หรือ `body.style.paddingBottom` | ตัวแปรของตัวเองเท่านั้น | last-writer-wins เมื่อมีสองแถบ — linter ปฏิเสธ |
| `z-40` ดิบ | `z-(--z-bar)` | linter ปฏิเสธ · ไม่มีใครรู้ว่า 40 หมายถึงชั้นอะไร |
| `useEffect` ตั้งความสูง | `useLayoutEffect` | มีหนึ่งเฟรมที่ค่ายังผิด |
| `aria-label="นำออก"` | รวมชื่อสินค้า | 4 ปุ่มชื่อเดียวกัน (SC 2.5.3) |
| ปุ่ม "ดูการเปรียบเทียบ" กดได้ตอนมี 1 รายการ | `isDisabled` | เทียบของชิ้นเดียวไม่มีความหมาย |
| แถบเปล่าเมื่อไม่มีรายการ | `return null` | กินพื้นที่ก้นจอโดยไม่ให้อะไร |
| ให้เทียบ 8 รายการ | จำกัด 4 | คอลัมน์แคบเกินกว่าจะอ่าน |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง ไม่มีแถวไหนอธิบายพฤติกรรมซ้ำ (นั่นคืองานของ §4 และ §5)

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · axe ผ่านใน `a11y/marketplace.test.tsx` ทั้ง `CompareBar` และ `CompareTable` · เทส **"`CompareTable` ประกาศ `role` ครบ เพื่อกันการเปลี่ยน `display`"** — `display: grid` ทำให้ตารางหลุด semantics ถ้าไม่ประกาศ (SC 1.3.1) |
| ตอบสนอง (Responsive) | ✅ | `min-w-0` · `SC 1.4.10` ตารางเลื่อนแนวนอนได้ในกล่องของตัวเองโดยไม่ทำให้ทั้งหน้าเลื่อน |
| โหมดมืด (Dark Mode) | ✅ | แถบใช้ `--elevation-*` · `lint-classes.mjs` 0 จุด — ทุกสีมาจาก token ที่ override ในโหมดมืดแล้ว |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | ใช้คู่ `ms-`/`me-` อยู่แล้ว · `lint-quality.mjs` 0 จุด — ไม่มี `ml-`/`pl-`/`left-` ในไฟล์นี้ |
| คีย์บอร์ด (Keyboard) | ✅ | `SC 2.4.11` `e2e/wcag22.spec.ts:44` `Tab` ทั้งหน้าแล้วไม่มีอะไรถูกแถบเปรียบเทียบบังจนมิด · `SC 2.5.3` ปุ่มลบแต่ละตัวมีชื่อรายการกำกับ |
| กำลังโหลด (Loading) | — | รายการที่เปรียบเทียบถูกเลือกมาจากกริดที่โหลดเสร็จแล้ว |
| ข้อผิดพลาด (Error) | — | การเปรียบเทียบไม่ยิง request |
| ว่างเปล่า (Empty) | ✅ | เทส **"`CompareBar` ไม่ render เมื่อว่าง"** — ไม่มีแถบเปล่าค้างอยู่ก้นจอ |
| Skeleton | — | ข้อมูลมาจากการ์ดที่ผู้ใช้เลือกไว้แล้ว |
| การเคลื่อนไหว (Animation) | ✅ | `base.css §10` ครอบ `*` ด้วย `!important` — ไม่มีการเคลื่อนไหวที่หลุดตัวกัน (`lint-quality.mjs` 0 จุด) |
| ประสิทธิภาพ (Performance) | ✅ | `e2e/wcag22.spec.ts:369` **`CompareBar` ไม่แตะ `--bottom-nav-height` ของแถบอื่น** และ `:347` สองแถบพร้อมกันจองพื้นที่เท่าผลรวม — ไม่มีการเขียนทับ `body.style` ที่ทำให้ layout กระตุก |
