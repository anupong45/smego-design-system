# SegmentedControl · SegmentedControlItem

**`@smego/ui`** · ชั้น 03 · [SegmentedControl.tsx](./SegmentedControl.tsx)

> สร้างใหม่ในเฟส 5 ตาม ASTRYX-PARITY.md §1.3

---

## 1 · ภาพรวม

สลับ **มุมมองของเนื้อหาเดิม** — ข้อมูลชุดเดียวกัน แสดงคนละแบบ

### ★★★ กฎแบ่งเขต 4 ทาง

ฉบับเดียวกับที่ [`TabList.md`](./TabList.md) เขียนไว้ — **แก้ทั้งคู่เสมอ**

| | ทำอะไร | ARIA |
|---|---|---|
| [**`TabList`**](./TabList.md) | สลับ **panel คนละชุด** — เนื้อหาต่างกันจริง | `tablist` / `tab` / `tabpanel` |
| **`SegmentedControl`** | สลับ **มุมมองของเนื้อหาเดิม** — ตาราง/รายการ · เรียงตามราคา/ตามใหม่ | `radiogroup` / `radio` |
| [**`RadioList`**](../inputs/RadioList.md) | **ค่าในฟอร์ม** ที่รอกดส่ง | `radiogroup` + `label` ที่เห็นได้ |
| [**`Token`**](../data-display/Token.md) | **ตัวกรอง** ที่เลือกได้หลายอัน | `button` + `aria-pressed` |

**คำถามที่แยกได้เร็วที่สุด:**

```
"เนื้อหาที่ไม่ได้เลือกยังต้องอยู่ใน DOM ไหม"  → ไม่  = TabList
"มีผลเมื่อกดบันทึกไหม"                       → ใช่  = RadioList
"เลือกได้หลายอันไหม"                         → ใช่  = Token
ที่เหลือ                                      →       SegmentedControl
```

### ★★ ต่างจาก `RadioList` ที่ระดับ API ไม่ใช่ระดับ ARIA

ทั้งคู่เป็น `radiogroup` เหมือนกัน — ความต่างอยู่ที่**บทบาทในหน้า**:

| | `RadioList` | `SegmentedControl` |
|---|---|---|
| `label` | **เห็นได้** — เป็นคำถาม | **ไม่เห็น** — เป็นชื่อ accessible |
| มีผลเมื่อไร | กดบันทึก | **ทันที** |
| `status` / `isOptional` | มี (เป็นช่องกรอก) | ไม่มี |
| ตัวเลือกยาว | ได้ (`layout="card"`) | ไม่ — ข้อความสั้นเท่านั้น |

เส้นแบ่งเดียวกับ `Switch` ↔ `CheckboxInput` ที่ [`Switch.tsx`](../inputs/Switch.md) ตั้งไว้แล้ว: **มีผลทันที ≠ รอกดบันทึก**

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน | เหตุผล |
|---|---|---|
| เนื้อหาแต่ละตัวเลือกต่างกันจริง | [`<TabList>`](./TabList.md) | ต้องมี `tabpanel` |
| ค่าในฟอร์มที่รอกดส่ง | [`<RadioList>`](../inputs/RadioList.md) | ต้องมี label ที่เห็นได้ + error |
| เลือกได้หลายอัน | [`<Token>`](../data-display/Token.md) | `radiogroup` เลือกได้อันเดียว |
| ตัวเลือกเกิน 4–5 อัน | [`<Selector>`](../inputs/Selector.md) | รางจะล้นจอที่ 320px |
| เปิด/ปิดสิ่งเดียว | [`<Switch>`](../inputs/Switch.md) | สองตัวเลือกที่ไม่มีชื่อ |

---

## 2 · React API

```tsx
import { SegmentedControl, SegmentedControlItem } from '@smego/ui';

<SegmentedControl value={view} onChange={setView} label="รูปแบบการแสดงผล">
  <SegmentedControlItem value="grid" label="ตาราง" icon={<Icon name="layout-grid" size={20} />} />
  <SegmentedControlItem value="list" label="รายการ" icon={<Icon name="list" size={20} />} />
</SegmentedControl>
```

### SegmentedControl

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `value` | `string` | — | **บังคับ** |
| `onChange` | `(value: string) => void` | — | **บังคับ** · มีผลทันที |
| `label` | `string` | — | **บังคับ** · เป็น `aria-label` **ไม่แสดงด้วยตา** |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 36 / **44** / 48px |
| `layout` | `'hug' \| 'fill'` | `'hug'` | |
| `isDisabled` | `boolean` | `false` | |

### SegmentedControlItem

| prop | type | หมายเหตุ |
|---|---|---|
| `value` | `string` | จับคู่กับ `value` ของพ่อแม่ |
| `label` | `string` | **บังคับ** (§8.1) |
| `isLabelHidden` | `boolean` | เหลือแต่ไอคอน — ยังเป็น accessible name |
| `icon` | `ReactNode` | |
| `isDisabled` | `boolean` | |

---

## 3 · Variants

| `layout` | ผล |
|---|---|
| `hug` | กว้างตามเนื้อหา — วางในแถบเครื่องมือ |
| `fill` | แบ่งเท่ากันเต็มความกว้าง — บนมือถือ |

ขนาดกำหนดจาก **พ่อแม่ผ่าน child selector** — item ทุกอันในรางเดียวกันสูงเท่ากันเสมอ ถ้าให้ item รับ `size` เองจะเปิดช่องให้สูงไม่เท่ากันแล้วรางเบี้ยว

---

## 4 · States

| state | ผล |
|---|---|
| ที่เลือกอยู่ | `checked` + พื้น `bg-surface` **ยกขึ้นจากราง** + เงา `elevation-raised` |
| hover | `text-fg` |
| focus-visible | วงแหวน 2 ชั้นจาก `base.css` |
| disabled | `text-fg-disabled` · กดไม่ได้จริง |

---

## 5 · Accessibility

| เรื่อง | ข้อกำหนด |
|---|---|
| role | `radiogroup` / `radio` จาก RAC |
| keyboard | กลุ่มกิน **หนึ่ง tab stop** · ลูกศรเลื่อน**แล้วเลือกทันที** |
| **SC 2.5.8** | เป้ากดต่ำสุด 36px ทุกขนาด |
| **SC 1.4.12** | `min-h-*` ไม่ใช่ `h-*` |
| **SC 1.4.1** | ที่เลือกมี `checked` ไม่พึ่งพื้นสีเป็นตัวบอกเดียว |

### ★★ เป็น `radiogroup` ไม่ใช่ `tablist` (ตาม Astryx)

เพราะ **ไม่มี panel ให้ควบคุม** — มันคือการเลือกหนึ่งจากหลายตัวที่มีผลทันที

ใช้ RAC `RadioList` ซึ่งให้ roving tabindex + ลูกศรเลื่อนแล้วเลือกทันที (pattern เดียวกับ [`RadioList`](../inputs/RadioList.md) ในระดับ ARIA)

### ⚠️ สถานะอยู่ที่ `checked` ไม่ใช่ `aria-checked`

RAC `Radio` render เป็น **`<input type="radio">` จริง** ไม่ใช่ `<div role="radio">` — สถานะจึงอยู่ที่ property `checked` และ **ไม่มี** `aria-checked` (native input ไม่ต้องมี)

เรื่องเดียวกันกับ [`Switch`](../inputs/Switch.md) ในระบบนี้ · เทสที่ assert `aria-checked` จะได้ `null` แล้วดูเหมือน component พัง ทั้งที่ถูก

**และ `className` ไปอยู่ที่ `<label>` ที่ห่อ input** ไม่ใช่ที่ตัว input — RAC ซ่อน input ไว้ข้างในแล้วให้ label เป็นตัวที่มองเห็น

### ★ `label` ไม่แสดงด้วยตา — ต่างจาก `RadioList`

`RadioList` แสดง `label` เป็นข้อความเพราะเป็น **คำถามในฟอร์ม** ที่รอคำตอบ · ตัวนี้เป็น **ตัวควบคุมมุมมอง** ผู้ใช้เห็นผลทันทีจากเนื้อหาที่เปลี่ยน จึงไม่ต้องมีคำถามค้างอยู่บนจอ

แต่ **ยังต้องมีชื่อ** สำหรับผู้ใช้ screen reader ที่ไม่เห็นว่ารางนี้คุมอะไร — เทส `"label เป็น aria-label ที่ไม่แสดงด้วยตา"` ล็อกทั้งสองฝั่ง

---

## 6 · Tailwind implementation

```tsx
/* ราง — พื้นจม */
'rounded-(--radius-control) border border-edge bg-sunken p-1'

/* item ที่เลือก — ยกขึ้นจากราง */
'data-selected:bg-surface data-selected:text-fg data-selected:font-medium'
'data-selected:shadow-(--elevation-raised)'
```

### ★ ตัวที่เลือกไม่ใช้พื้นทึบน้ำเงิน

"พื้นทึบน้ำเงิน = CTA" ถูกสงวนไว้ให้ปุ่มหลัก (ข้อ 05) · ตัวที่เลือกใช้ `bg-surface` **ยกตัวขึ้นจากราง** ที่เป็น `bg-sunken` — สำนวนเดียวกับ segmented control ของ iOS/macOS ที่ผู้ใช้คุ้นอยู่แล้ว และเป็นสำนวนเดียวกับที่ [`Token`](../data-display/Token.md) ที่เลือกอยู่ใช้ tint แทนพื้นทึบ

---

## 7 · Figma Variant

Component set **`SegmentedControl`**

| Property | Values |
|---|---|
| `Size` | `sm (36)` · **`md (44)`** · `lg (48)` |
| `Layout` | **`Hug`** · `Fill` |
| `Items` | **`2`** · `3` · `4` |

Component set **`SegmentedControlItem`** — property `State` = `Default` · `Hover` · **`Selected`** · `Focus` · `Disabled` · property `Content` = `Label` · `Icon + label` · `Icon only`

**ห้ามสร้าง variant ที่มี 5+ item** — รางจะล้นจอที่ 320px · ถ้ามีคนขอ ให้ชี้ไปที่ §1 (ใช้ `Selector` แทน)

---

## 8 · Usage

```tsx
// สลับมุมมองผลการค้นหา — ข้อมูลชุดเดิม แสดงคนละแบบ
const [view, setView] = useState<'grid' | 'list'>('grid');

<SearchResult
  count={total}
  toolbar={
    <SegmentedControl value={view} onChange={(v) => setView(v as 'grid' | 'list')} label="รูปแบบการแสดงผล">
      <SegmentedControlItem value="grid" label="ตาราง" isLabelHidden icon={<Icon name="layout-grid" size={20} />} />
      <SegmentedControlItem value="list" label="รายการ" isLabelHidden icon={<Icon name="list" size={20} />} />
    </SegmentedControl>
  }
>
  {view === 'grid' ? <Grid preset="product">…</Grid> : <ul>…</ul>}
</SearchResult>
```

```tsx
// กรองประเภทในหน้ารายการ — เนื้อหาชุดเดิมที่กรองแล้ว
<SegmentedControl value={kind} onChange={setKind} label="ประเภท" layout="fill">
  <SegmentedControlItem value="all" label="ทั้งหมด" />
  <SegmentedControlItem value="product" label="สินค้า" />
  <SegmentedControlItem value="service" label="บริการ" />
</SegmentedControl>
```

---

## 9 · Anti-patterns

| ❌ | ✅ | ทำไม |
|---|---|---|
| ใช้แทน [`<TabList>`](./TabList.md) | `TabList` | เนื้อหาต่างกันจริงต้องมี `tabpanel` |
| ใช้แทน [`<RadioList>`](../inputs/RadioList.md) ในฟอร์ม | `RadioList` | ต้องมี label ที่เห็นได้ + `status` |
| 5+ item | [`<Selector>`](../inputs/Selector.md) | รางล้นจอที่ 320px |
| ตัวเลือกเป็นประโยคยาว | `RadioList layout="card"` | ข้อความไทยยาวทำรางล้น |
| ไม่ส่ง `label` | ส่งเสมอ | ผู้ใช้ SR ไม่รู้ว่ารางคุมอะไร |
| แสดง `label` เป็นข้อความเอง | ปล่อยให้เป็น `aria-label` | ตัวควบคุมมุมมองไม่ใช่คำถาม |
| `bg-primary-600` ที่ตัวเลือก | `bg-surface` ยกจากราง | น้ำเงินทึบสงวนให้ CTA |
| assert `aria-checked` ในเทส | assert `.checked` | RAC ใช้ native input |
| `h-11` | `min-h-11` | ตัดข้อความเมื่อขยายตัวอักษร |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · axe ผ่านใน `a11y/tabs.test.tsx` · เทส "เป็น radiogroup ไม่ใช่ tablist" · "label เป็น aria-label ที่ไม่แสดงด้วยตา" |
| ตอบสนอง (Responsive) | ✅ | `layout="fill"` สำหรับจอแคบ · `min-w-0` ที่ราง · จำกัดจำนวน item ไว้ที่ 4 (§7) |
| โหมดมืด (Dark Mode) | ✅ | `lint-classes.mjs` 0 จุด — `bg-sunken`/`bg-surface`/`border-edge` override ในโหมดมืดแล้ว |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | `lint-quality.mjs` 0 จุด — ไม่มี `ml-`/`left-` |
| คีย์บอร์ด (Keyboard) | ✅ | §5 · เทส "ลูกศรเลื่อนแล้วเลือกทันที" · roving tabindex จาก RAC |
| กำลังโหลด (Loading) | ✅ | `isDisabled` ปิดรางระหว่างโหลดมุมมองใหม่ — เทส "item ที่ปิดใช้งานกดไม่ได้" |
| ข้อผิดพลาด (Error) | — | ตัวควบคุมมุมมองไม่มีสถานะผิดพลาด · ถ้าต้องมี error นั่นคือ `RadioList` |
| ว่างเปล่า (Empty) | — | รางที่มี item เดียวไม่ควรมีอยู่ |
| Skeleton | — | รางสั้น ความสูงคงที่ ไม่ทำให้ CLS |
| การเคลื่อนไหว (Animation) | ✅ | `transition-colors` เท่านั้น — อยู่ในรายการ ALLOW ของ `base.css §10` |
| ประสิทธิภาพ (Performance) | ✅ | ไม่มีความสูงตายตัว (`min-h-*`) · เงาใช้ token `--elevation-raised` ไม่ใช่เงาดิบ |
