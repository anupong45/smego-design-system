# Select · SelectItem

**`@smego/ui`** · ชั้น 03 · [Select.tsx](./Select.tsx)

---

## 1 · ภาพรวม

เลือกหนึ่งค่าจากชุดปิด — จังหวัด · ประเภทธุรกิจ · การเรียงลำดับ

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน | เหตุผล |
|---|---|---|
| รายการยาวที่ต้องค้นหา | `<ComboBox>` | พิมพ์กรองได้ |
| ไม่เกิน ~7 ตัวและต้องเห็นพร้อมกัน | `<RadioList>` | เปรียบเทียบได้โดยไม่ต้องเปิด |
| เลือกหลายค่า | `<CheckboxGroup>` | |
| เปิด/ปิด | `<Switch>` | |

---

## 2 · React API

```tsx
<Select
  label="จังหวัดที่ตั้งโรงงาน"
  description="ใช้คำนวณค่าขนส่ง"
  options={provinces}
  selectedKey={province}
  onSelectionChange={setProvince}
/>
```

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `label` | `string` | — | **บังคับ** |
| `options` | `SelectOption[]` | — | `{ id, label, description?, isDisabled? }` |
| `description` · `errorMessage` · `showOptional` | | | |
| `placeholder` | `string` | `s.common.selectPlaceholder` | |
| `size` | `'md' \| 'lg'` | `'md'` | |
| `selectedKey` / `onSelectionChange` | | | จาก RAC |

---

## 3 · Variants

ไม่มี variant

| ส่วน | ค่า |
|---|---|
| ปุ่มเปิด | `fieldStyles.control` = **46px** วัดแล้ว |
| popover | `w-(--trigger-width)` — **กว้างเท่าปุ่ม** |
| รายการ | `max-h-64` + `overflow-auto` |
| แต่ละรายการ | `px-3 py-2` = ~40px |

### ★★★ **ห้ามใช้ `<select>` ของ browser** ที่ผู้ใช้เห็น

ไม่ใช่เรื่องความสวยงาม — UI ของ `<select>` **ขึ้นภาษาตาม OS** และ **style ไม่ได้เลยบน Windows/Android**

เหตุผลเดียวกับที่ห้าม `validationBehavior="native"` และ `<input type="file">` ดิบ

**วัดแล้ว:** ตัวที่ผู้ใช้กดเป็น `<button aria-haspopup="listbox">` สูง **46px**

⚠️ **แต่ RAC ยัง render `<select>` ที่ซ่อนไว้** สำหรับการ submit ฟอร์ม — วัดได้ `tabindex="-1"` จึงอยู่นอก tab order

เกณฑ์ที่ถูกต้องคือ **"ตัวที่ผู้ใช้เห็นและกดต้องเป็น button"** ไม่ใช่ "ต้องไม่มี `<select>` เลย" (ผมเขียนเทสผิดครั้งแรกด้วยเกณฑ์หลัง)

### ★ popover กว้างเท่าปุ่ม

`w-(--trigger-width)` — ถ้าไม่ผูก รายการจะกว้างตามข้อความยาวสุดแล้วดูไม่เกี่ยวกับช่อง

---

## 4 · States

| state | สิ่งที่เปลี่ยน |
|---|---|
| default | `border-edge-strong` · placeholder `text-fg-muted` |
| focus-visible | `border-edge-brand` + วงแหวน |
| open | `aria-expanded="true"` |
| invalid | `border-edge-danger` |
| disabled | `cursor-not-allowed` |

### รายการ

| state | สิ่งที่เปลี่ยน |
|---|---|
| focused (คีย์บอร์ด/hover) | `bg-sunken` |
| **selected** | `bg-primary-50` · `text-primary-800` · **+ เครื่องหมายถูก** |
| disabled | `text-fg-disabled` |

### ★★ ตัวที่เลือกอยู่มี **เครื่องหมายถูก** ไม่ใช่แค่พื้นสี (SC 1.4.1)

พื้น `bg-sunken` (hover) กับ `bg-primary-50` (selected) ต่างกันไม่มากพอเมื่อแยกสีไม่ได้ — ไอคอน `check` คือตัวแยกจริง

---

## 5 · Accessibility

| เรื่อง | ข้อกำหนด |
|---|---|
| role | `button` + `aria-haspopup="listbox"` · popover เป็น `listbox` |
| keyboard | Enter/Space/ลูกศรเปิด · พิมพ์ตัวอักษรกระโดด · Esc ปิด |
| **SC 1.4.1** | selected มีเครื่องหมายถูก |
| **SC 2.5.8** | รายการสูง ~40px |
| **SC 1.4.11** | ขอบ `edge-strong` = 4.20:1 |
| **SC 2.4.7** | `p-1` ใน listbox — `overflow-auto` ตัดวงแหวน |

### ★★ รายการยาวต้องเลื่อนในกล่องตัวเอง

`max-h-64` + `overflow-auto` — ถ้าปล่อยยาว popover จะล้นจอบนมือถือ และผู้ใช้จะ **เลื่อนหน้าแทนที่จะเลื่อนรายการ**

⚠️ `overflow-auto` ตัดวงแหวน focus **ทั้งสองแกน** → ต้องมี `p-1` (4px) เหมือน `ChipRow` (ข้อ 05 §5)

### ★ `description` ของแต่ละตัวเลือกอยู่ในบรรทัดที่สอง

ไม่ใช่ `title` attribute — tooltip ของ browser ผู้ใช้ touch เข้าไม่ถึงและ style ไม่ได้

---

## 6 · Tailwind implementation

```tsx
<RACButton className={cn(
  fieldStyles.control({ size }),
  'flex items-center justify-between gap-2 text-start',
  'cursor-pointer',
  'data-focus-visible:border-edge-brand',
  'data-invalid:border-edge-danger',
  'data-disabled:cursor-not-allowed',
)}>
  <SelectValue className="min-w-0 truncate data-placeholder:text-fg-muted" />
  <Icon name="chevron-down" size={20} className="shrink-0 text-fg-muted" />
</RACButton>

<Popover offset={4} className={cn(
  'w-(--trigger-width)',                      /* ★ กว้างเท่าปุ่ม */
  'rounded-(--radius-control)',
  'border border-(--elevation-edge-floating)',
  'bg-(--elevation-surface-floating)',
  'shadow-(--elevation-floating)',
  'data-entering:animate-[fade-in_150ms_ease-out]',
)}>
  <ListBox items={options} className="max-h-64 overflow-auto p-1 outline-none">
```

`SelectItem` ถูก export เพื่อให้ `ComboBox` ใช้ซ้ำ — รายการในสองตัวนี้ต้องหน้าตาเหมือนกัน

---

## 7 · Figma Variant

Component set **`Select`**

| Property | Values |
|---|---|
| `State` | `Default` · **`Focus`** · `Open` · `Invalid` · `Disabled` |
| `Value` | `Placeholder` · `Selected` |

Component set **`SelectItem`** — property `State` = `Default` · `Focused` · **`Selected`** · `Disabled`

**`Selected` ต้องมีเครื่องหมายถูก** ไม่ใช่แค่พื้นสี

**`Open` frame ต้องมีรายการเกิน 8 ตัวเพื่อให้เห็น scroll** — ถ้ามีแค่ 3 ตัว นักพัฒนาจะไม่รู้ว่าต้องจำกัดความสูง

---

## 8 · Usage

```tsx
const PROVINCES = [
  { id: 'bkk', label: 'กรุงเทพมหานคร' },
  { id: 'cnx', label: 'เชียงใหม่', description: 'ภาคเหนือ' },
  { id: 'hkt', label: 'ภูเก็ต', isDisabled: true },
];

<Select
  label="จังหวัดที่ตั้งโรงงาน"
  description="ใช้คำนวณค่าขนส่ง"
  options={PROVINCES}
  selectedKey={province}
  onSelectionChange={(k) => setProvince(String(k))}
  errorMessage={submitted && !province ? 'ยังไม่ได้เลือกจังหวัด — จำเป็นสำหรับการคำนวณค่าขนส่ง' : undefined}
/>
```

```tsx
// การเรียงลำดับในหน้าค้นหา
<Select
  label="เรียงตาม"
  options={[
    { id: 'relevant', label: 'ตรงกับคำค้นมากที่สุด' },
    { id: 'price-asc', label: 'ราคาต่ำไปสูง' },
    { id: 'newest', label: 'ใหม่ล่าสุด' },
  ]}
  selectedKey={sort}
  onSelectionChange={setSort}
/>
```

---

## 9 · Anti-patterns

| ❌ | ✅ | ทำไม |
|---|---|---|
| `<select>` ของ browser ที่ผู้ใช้เห็น | `<Select>` | UI ขึ้นภาษาตาม OS · style ไม่ได้ |
| assert "ต้องไม่มี `<select>` เลย" | assert ตัวที่เห็นเป็น `button` | RAC ใช้ `<select>` ซ่อนสำหรับ submit |
| selected ต่างแค่พื้นสี | + เครื่องหมายถูก | hover กับ selected แยกไม่ออก |
| รายการยาวไม่จำกัดความสูง | `max-h-64 overflow-auto` | ล้นจอ ผู้ใช้เลื่อนหน้าแทน |
| `overflow-auto` ไม่มี `p-1` | มี | วงแหวน focus ถูกตัด (SC 2.4.7) |
| popover กว้างตามข้อความ | `w-(--trigger-width)` | ดูไม่เกี่ยวกับช่อง |
| `description` เป็น `title` | บรรทัดที่สองในรายการ | tooltip ผู้ใช้ touch เข้าไม่ถึง |
| Select กับ 3 ตัวเลือกในฟอร์มสั้น | `<RadioList>` | ต้องเปิดถึงจะเห็น |
| Select กับ 50 จังหวัด | `<ComboBox>` | สแกนหาไม่เจอ |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง ไม่มีแถวไหนอธิบายพฤติกรรมซ้ำ (นั่นคืองานของ §4 และ §5)

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · axe ผ่านใน `a11y/pass2.test.tsx` · เทส "ไม่ใช้ `<select>` ของ browser" จึงคุม focus ring และ contrast ได้จริง |
| ตอบสนอง (Responsive) | ✅ | `min-w-0` · listbox ใช้ `max-h-64` เป็นเพดาน แล้วเลื่อนภายใน ไม่ล้นจอที่ 320px |
| โหมดมืด (Dark Mode) | ✅ | popover ใช้ `--elevation-*` · `lint-classes.mjs` 0 จุด — ทุกสีมาจาก token ที่ override ในโหมดมืดแล้ว |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | `lint-quality.mjs` 0 จุด — ไม่มี `ml-`/`pl-`/`left-` ในไฟล์นี้ |
| คีย์บอร์ด (Keyboard) | ✅ | §4 `open` · ลูกศรเปิดและเลื่อน · พิมพ์ตัวอักษรเพื่อกระโดด · `Esc` ปิดแล้วคืน focus ที่ตัวเปิด |
| กำลังโหลด (Loading) | — | ตัวเลือกมาพร้อมหน้า · ถ้าต้องค้นหาให้ใช้ [`<ComboBox>`](./ComboBox.md) |
| ข้อผิดพลาด (Error) | ✅ | §4 `invalid` · `errorMessage` (SC 3.3.1) |
| ว่างเปล่า (Empty) | — | select ที่ไม่มีตัวเลือกคือ select ที่ไม่ควรแสดง — ให้ซ่อนทั้งช่องพร้อมเหตุผล |
| Skeleton | — | ตัวเลือกเป็นข้อความสั้น |
| การเคลื่อนไหว (Animation) | ✅ | `base.css §10` ครอบ `*` ด้วย `!important` — ไม่มีการเคลื่อนไหวที่หลุดตัวกัน (`lint-quality.mjs` 0 จุด) · เข้า/ออกด้วย `fade` opacity ล้วน |
| ประสิทธิภาพ (Performance) | ✅ | popover ถูก portal ออกไปจึงไม่ทำให้ฟอร์ม reflow ตอนเปิด |
