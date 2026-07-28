# SearchField

**`@smego/ui`** · ชั้น 03 · [SearchField.tsx](./SearchField.tsx)

---

## 1 · ภาพรวม

ช่องค้นหา — ต่างจาก `<TextField>` ที่ **role · Escape · ปุ่มล้าง**

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน | เหตุผล |
|---|---|---|
| ค้นหาพร้อมคำแนะนำ | `<ComboBox>` | ต้องมี listbox + `aria-autocomplete` |
| กรอกข้อความทั่วไป | `<TextField>` | `role="searchbox"` สื่อผิด |
| กรองรายการที่เห็นอยู่ | `<SearchField>` ก็ได้ | แต่ต้องประกาศจำนวนผลผ่าน `<SearchResult>` |

---

## 2 · React API

```tsx
<SearchField
  label="ค้นหาสินค้า"
  labelHidden
  value={query}
  onChange={setQuery}
/>
```

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `label` | `string` | `s.common.search` | |
| `labelHidden` | `boolean` | `false` | ซ่อนด้วยสายตา ยังอยู่ให้ screen reader |
| `placeholder` | `string` | `s.search.placeholder` | |
| `description` · `errorMessage` | `string` | — | |
| `size` | `'md' \| 'lg'` | `'md'` | |
| `value` / `onChange` | `string` | — | **กัน IME composition แล้ว** |

---

## 3 · Variants

ไม่มี variant · `labelHidden` เป็น boolean

### ★ RAC `SearchField` ให้สิ่งที่ `<TextField>` ให้ไม่ได้

| สิ่งที่ได้ | ทำไมสำคัญ |
|---|---|
| `type="search"` → **role `searchbox`** | screen reader ประกาศต่างจาก textbox |
| **Escape ล้างค่า** | พฤติกรรมมาตรฐานที่ผู้ใช้คีย์บอร์ดคาดหวัง |
| ปุ่มล้างโผล่เมื่อมีค่า | ไม่ต้องเช็คเอง |
| ชื่อปุ่มล้างจาก RAC | "ล้างคำค้นหา" หลัง `installRacThaiStrings` |

**วัดแล้ว:** input เป็น `type="search"` · role เป็น **implicit** (ไม่มี attribute `role`) ซึ่งถูกต้อง — `getByRole('searchbox')` หาเจอเพราะใช้ computed role

⚠️ ถ้าเช็คด้วย `querySelector('[role=searchbox]')` จะไม่เจอ — นั่นเป็นข้อจำกัดของ selector ไม่ใช่บั๊ก

---

## 4 · States

| state | สิ่งที่เปลี่ยน |
|---|---|
| default | `border-edge-strong` · ไม่มีปุ่มล้าง |
| มีค่า | ปุ่มล้างปรากฏ (RAC ควบคุมเอง) |
| focus-within | `border-edge-brand` |
| invalid | `border-edge-danger` |

### ★★ Thai IME — ปัญหาเดียวกับ TextField แต่ **หนักกว่า**

ช่องค้นหามักผูกกับการยิง API ทุก keystroke · ถ้าไม่กันช่วง composition ผู้ใช้ที่พิมพ์ **"ที่"** จะยิง API **3 ครั้ง** ด้วยคำที่ยังประกอบไม่เสร็จ:

```
ท → ที → ที่
```

เปลืองและทำให้ผลกระพริบ

component กัน `onChange` ระหว่าง composition ให้แล้ว — **แต่การ debounce ยังเป็นหน้าที่ของผู้เรียก** เพราะจังหวะที่เหมาะขึ้นกับว่า API เร็วแค่ไหน

### ★ ซ่อนปุ่มกากบาทของ browser

```
[&::-webkit-search-cancel-button]:appearance-none
```

`type="search"` ทำให้ Chrome/Safari ใส่ปุ่ม × ของตัวเองมา ซึ่ง **style ไม่ได้และไม่มีชื่อภาษาไทย** — เราซ่อนแล้วใช้ปุ่มของ RAC แทน

---

## 5 · Accessibility

| เรื่อง | ข้อกำหนด |
|---|---|
| role | `searchbox` (implicit จาก `type="search"`) |
| keyboard | **Escape ล้างค่า** |
| **SC 2.5.8** | ปุ่มล้าง = **24×24** วัดแล้ว |
| **SC 1.4.11** | ขอบ `edge-strong` = 4.20:1 |
| **SC 3.3.2** | `label` บังคับมีเสมอ |

### ★★ label ต้องมีเสมอ แม้จะซ่อนด้วยสายตา

ช่องค้นหาที่มีแต่ `placeholder` คือช่องที่ screen reader อ่านว่า **"searchbox"** เฉย ๆ — ผู้ใช้ไม่รู้ว่าค้นหาอะไร

ใช้ `labelHidden` เมื่อบริบทชัดจากไอคอนแว่นขยายและตำแหน่งอยู่แล้ว — label ยังอยู่ใน DOM ผ่าน `sr-only`

⚠️ **`placeholder` ไม่ใช่ label** — หายตอนพิมพ์ และ contrast ต่ำกว่าเกณฑ์ข้อความปกติ

### ★ ผลการค้นหาต้องประกาศแยก

`SearchField` ไม่ประกาศจำนวนผลลัพธ์ — นั่นเป็นหน้าที่ของ [`<SearchResult>`](../marketplace/SearchResult.md) ผ่าน `aria-live="polite"` (SC 4.1.3)

ใช้คู่กันเสมอในหน้าค้นหา

---

## 6 · Tailwind implementation

```tsx
<Group className={cn(
  fieldStyles.control({ size }),
  'flex items-center gap-2',
  'focus-within:border-edge-brand',
  'data-invalid:border-edge-danger',
)}>
  <Icon name="search" size={20} className="shrink-0 text-fg-muted" />

  <Input
    onCompositionStart={() => setComposing(true)}
    onCompositionEnd={() => setComposing(false)}
    onChange={(e) => { if (!isComposing) onChange?.(e.target.value); }}
    className={cn(
      'w-full min-w-0 border-0 bg-transparent p-0 outline-none',
      'text-body text-fg placeholder:text-fg-muted',
      '[&::-webkit-search-cancel-button]:appearance-none',
    )}
  />

  {/* RAC ซ่อนปุ่มนี้เองเมื่อค่าว่าง */}
  <RACButton className={cn(
    'inline-flex shrink-0 items-center justify-center',
    'rounded-full p-1',        /* 16 + p-1 = 24×24 */
    'text-fg-muted',
    'data-hovered:bg-sunken data-hovered:text-fg',
  )}>
    <Icon name="x" size={16} />
  </RACButton>
</Group>
```

`rounded-full` ใช้ได้กับปุ่มล้างเพราะเป็นปุ่มไอคอนกลม ๆ ในช่อง ไม่ใช่ปุ่มที่มีข้อความ (ข้อ 05)

---

## 7 · Figma Variant

Component set **`SearchField`**

| Property | Values |
|---|---|
| `Label` | `Visible` · `Hidden` |
| `Value` | `Empty` · **`Filled (มีปุ่มล้าง)`** |
| `State` | `Default` · **`Focus`** · `Disabled` |

**`Filled` frame ต้องมีปุ่มล้าง · `Empty` ต้องไม่มี** — ถ้ามีทั้งสอง frame เหมือนกัน นักพัฒนาจะแสดงปุ่มตลอดเวลาซึ่งกดแล้วไม่มีอะไรเกิด

**ต้องเขียนใน description ว่ากัน IME composition** — มองไม่เห็นใน Figma แต่ห้ามลบ

---

## 8 · Usage

```tsx
// ในหน้าค้นหา — คู่กับ SearchResult ที่ประกาศจำนวน
const [query, setQuery] = useState('');
const debounced = useDebounce(query, 300);   /* debounce ที่ผู้เรียก */

<SearchField label="ค้นหาสินค้า" labelHidden value={query} onChange={setQuery} />

<SearchResult count={results.length} query={debounced}>
  <Grid as="ul" preset="product">…</Grid>
</SearchResult>
```

```tsx
// ในแถบหัวเว็บ — label ซ่อนเพราะมีไอคอนแว่นขยายอยู่แล้ว
<SearchField
  label="ค้นหาสินค้า บริการ หรือโครงการ"
  labelHidden
  placeholder="ค้นหา…"
  size="lg"
/>
```

---

## 9 · Anti-patterns

| ❌ | ✅ | ทำไม |
|---|---|---|
| `<TextField>` สำหรับช่องค้นหา | `<SearchField>` | ไม่มี role searchbox · Escape ไม่ล้าง |
| มีแต่ `placeholder` ไม่มี `label` | `labelHidden` | screen reader อ่านว่า "searchbox" เฉย ๆ |
| ยิง API ทุก keystroke | debounce + กัน IME | "ที่" ยิง 3 ครั้งด้วยคำที่ยังไม่เสร็จ |
| ปล่อยปุ่ม × ของ browser | `appearance-none` | style ไม่ได้ ไม่มีชื่อไทย |
| แสดงปุ่มล้างตลอดเวลา | ปล่อยให้ RAC จัดการ | กดแล้วไม่มีอะไรเกิดเมื่อค่าว่าง |
| ไม่มี `<SearchResult>` คู่กัน | ใช้คู่กัน | จำนวนผลไม่ถูกประกาศ (SC 4.1.3) |
| ทดสอบด้วยภาษาอังกฤษอย่างเดียว | พิมพ์ไทยจริง | ปัญหา IME ไม่ปรากฏเลย |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง ไม่มีแถวไหนอธิบายพฤติกรรมซ้ำ (นั่นคืองานของ §4 และ §5)

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · axe ผ่านใน `a11y/pass2.test.tsx` และ `a11y/rac-i18n.test.tsx` · เทส "เป็น `searchbox` ไม่ใช่ `textbox`" |
| ตอบสนอง (Responsive) | ✅ | `min-w-0` · อยู่ใน fixture e2e ที่ Tab ทั้งหน้าที่ 320px แล้ว focus ไม่ถูกบัง (`wcag22.spec.ts:44`) |
| โหมดมืด (Dark Mode) | ✅ | `lint-classes.mjs` 0 จุด — ทุกสีมาจาก token ที่ override ในโหมดมืดแล้ว |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | `lint-quality.mjs` 0 จุด — ไม่มี `ml-`/`pl-`/`left-` ในไฟล์นี้ |
| คีย์บอร์ด (Keyboard) | ✅ | §4 `focus-within` · `Esc` ล้างค่า · `Enter` ส่งคำค้น (RAC จัดการ) · ปุ่มล้างเข้าถึงด้วย `Tab` ได้ |
| กำลังโหลด (Loading) | — | ผลการค้นหาเป็นของ [`SearchResult`](../marketplace/SearchResult.md) ซึ่งถือ `isLoading` ไว้ |
| ข้อผิดพลาด (Error) | ✅ | §4 `invalid` · `errorMessage` (SC 3.3.1) |
| ว่างเปล่า (Empty) | ✅ | §4 "มีค่า" กับ default แยกกัน — ปุ่มล้างโผล่เฉพาะตอนมีค่า ไม่ใช่ปุ่มเทาค้างไว้ |
| Skeleton | — | ช่องค้นหาเป็นโครงคงที่ที่ต้องกดได้ทันที · แทนด้วยแถบสีเทาจะทำให้พิมพ์ไม่ได้ทั้งที่พิมพ์ได้ |
| การเคลื่อนไหว (Animation) | ✅ | `base.css §10` ครอบ `*` ด้วย `!important` — ไม่มีการเคลื่อนไหวที่หลุดตัวกัน (`lint-quality.mjs` 0 จุด) |
| ประสิทธิภาพ (Performance) | ✅ | `SC 4.1.3` ประกาศจำนวนผลลัพธ์แบบ polite — ไม่ยิงประกาศทุกตัวอักษร |
