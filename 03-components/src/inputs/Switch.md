# Switch

**`@smego/ui`** · ชั้น 03 · [Switch.tsx](./Switch.tsx)

---

## 1 · ภาพรวม

สลับเปิด/ปิดที่ **มีผลทันที**

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน | เหตุผล |
|---|---|---|
| ค่าในฟอร์มที่รอกดบันทึก | `<CheckboxInput>` | switch สื่อว่ามีผลแล้ว |
| ยอมรับเงื่อนไข | `<CheckboxInput>` | เป็นค่าที่ส่งไปกับฟอร์ม |
| **ตัวกรอง** | `<Token>` | ตัวกรองไม่ได้ "เปิด/ปิด" ระบบ |
| เลือกจาก 2 ตัวเลือกที่มีชื่อ | `<RadioList>` | เปิด/ปิด ≠ ก/ข |

---

## 2 · React API

```tsx
<Switch
  isSelected={notify}
  onChange={setNotify}
  description="ระบบจะแจ้งเตือนเมื่อมีคำสั่งซื้อใหม่"
>
  รับการแจ้งเตือนทางอีเมล
</Switch>
```

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| ~~`children`~~ | — | — | เปลี่ยนเป็น `label: string` (§8.1) |
| ~~`align`~~ | — | — | แยกเป็น `labelPosition` + `labelSpacing` |
| | ข้อความกำกับ |
| `description` | `string` | — | **บอกผลของการเปิด** |
| `label` | `string` | — | **บังคับ** — accessible name (§8.1) |
| `isLabelHidden` | `boolean` | `false` | ซ่อน label ด้วยตา แต่ยังประกาศให้ screen reader |
| `status` | `InputStatus` | — | ใช้รายงานว่า**สลับไม่สำเร็จ** ไม่ใช่ validation แบบฟอร์ม (SC 4.1.3) |
| `isOptional` | `boolean` | `false` | ต่อท้าย label ว่า "(ไม่บังคับ)" |
| `labelPosition` | `'start' \| 'end'` | `'end'` | ป้ายอยู่ฝั่งไหนของปุ่ม |
| `labelSpacing` | `'compact' \| 'spread'` | `'compact'` | `spread` ดันป้ายกับปุ่มไปสุดสองฝั่ง |
| `isSelected` / `defaultSelected` / `onChange` / `isDisabled` | | | จาก RAC |

---

## 3 · Variants

| align | รูปแบบ | ใช้ที่ไหน |
|---|---|---|
| `start` | ปุ่มซ้าย ข้อความขวา | ในฟอร์ม · รายการสั้น |
| `end` | ข้อความซ้าย ปุ่มขวา | **รายการตั้งค่า** — ปุ่มเรียงตรงแนวกัน |

| ส่วน | ค่า |
|---|---|
| ราง | `h-6 w-11` = **44×24** |
| ปุ่มเลื่อน | `size-5` = **20×20** |
| ระยะเลื่อน | `translate-x-5` (20px) |
| เป้ากด | ทั้งแถว — วัดได้ **56px** สูง |

### ★ `rounded-full` ใช้ได้ที่นี่

เป็นรูปทรงมาตรฐานสากลของ switch เหมือนที่ radio เป็นวงกลม (ข้อ 05) — การทำ switch เป็นสี่เหลี่ยมทำให้ผู้ใช้ไม่รู้ว่ามันคืออะไร

---

## 4 · States

| state | สิ่งที่เปลี่ยน |
|---|---|
| off | ราง `bg-sunken` · `border-edge-strong` · ปุ่มซ้าย |
| **on** | ราง `bg-primary-600` · `border-primary-outline` · **ปุ่มขวา** |
| hover (off) | `border-fg-muted` |
| focus-visible | วงแหวน 2 ชั้น |
| disabled | ราง `bg-sunken` · ปุ่ม `bg-fg-disabled` |

### ★★ สถานะอ่านได้จาก **ตำแหน่งของปุ่ม** ไม่ใช่แค่สีราง (SC 1.4.1)

ปุ่มเลื่อนซ้าย/ขวาคือตัวชี้ที่ไม่ใช่สี — จึงไม่ต้องมีข้อความ "เปิด/ปิด" กำกับเหมือน badge

### ★ `transform` ถูกตัดใน reduced motion — และนั่นไม่เป็นไร

`motion-reduce:transition-none` ทำให้ปุ่มกระโดดแทนที่จะเลื่อน · **ตำแหน่งสุดท้ายยังต่างกัน** สถานะจึงยังอ่านได้

---

## 5 · Accessibility

| เรื่อง | ข้อกำหนด |
|---|---|
| role | **`switch`** จาก RAC |
| keyboard | Space สลับ |
| **SC 2.5.8** | เป้า = ทั้งแถว วัดได้ 56px |
| **SC 1.4.1** | ตำแหน่งปุ่มคือตัวชี้ที่ไม่ใช่สี |
| **SC 4.1.3** | ⚠️ ผลทันทีต้องมี feedback — ดูล่าง |

### ★★ สถานะมาจาก `checked` **ไม่ใช่ `aria-checked`**

**วัดแล้ว:** RAC render เป็น `<input type="checkbox" role="switch">` — `aria-checked` เป็น **null** และนั่นถูกต้อง เพราะ native checkbox เปิดเผยสถานะผ่าน `checked` property อยู่แล้ว

⚠️ เทสที่ assert `aria-checked === 'true'` จะ fail — ต้องเช็ค `input.checked` แทน (ผมเขียนผิดครั้งแรกและ vitest จับได้)

### ★★★ มีผลทันที **ต้องมี feedback ทันที**

Switch สื่อว่าเปลี่ยนแล้วมีผลเลย — ถ้าไม่มีอะไรยืนยัน ผู้ใช้จะไม่แน่ใจว่าบันทึกหรือยัง แล้วกดซ้ำ

`Switch` เองไม่ประกาศอะไร — **ผู้เรียกต้องแสดง toast หรือข้อความสถานะ** (SC 4.1.3)

ถ้าการเปลี่ยนต้องรอ API ให้ใช้ `isDisabled` ระหว่างรอ และคืนค่าเดิมถ้าล้มเหลว

### ★ `description` ควรบอก **ผลของการเปิด** ไม่ใช่ทวนชื่อ

```
❌ "เปิดการแจ้งเตือนทางอีเมล"
✅ "ระบบจะแจ้งเตือนเมื่อมีคำสั่งซื้อใหม่"
```

---

## 6 · Tailwind implementation

```tsx
<span className={cn(
  'flex h-6 w-11 shrink-0 items-center rounded-full border p-0.5',
  'transition-colors duration-fast ease-standard',
  isSelected ? 'border-primary-outline bg-primary-600'
             : 'border-edge-strong bg-sunken',
  isDisabled && 'border-edge bg-sunken',
  !isSelected && !isDisabled && 'group-data-hovered:border-fg-muted',
)}>
  <span className={cn(
    'size-5 rounded-full bg-surface',
    'transition-transform duration-fast ease-standard',
    'motion-reduce:transition-none',
    isSelected ? 'translate-x-5' : 'translate-x-0',
    isDisabled && 'bg-fg-disabled',
  )} />
</span>
```

ใช้ **render prop** ไม่ใช่ `data-selected:` เพราะต้องสลับ `translate-x-*` ซึ่ง Tailwind ทำผ่าน variant ได้แต่อ่านยากกว่ามาก

---

## 7 · Figma Variant

Component set **`Switch`**

| Property | Values |
|---|---|
| `Selected` | `True` · `False` |
| `Align` | `Start` · `End` |
| `State` | `Default` · `Hover` · **`Focus`** · `Disabled` |
| `Description` | `True` · `False` |

**ปุ่มต้องอยู่คนละตำแหน่งจริงใน `True` / `False`** — ถ้านักออกแบบเปลี่ยนแค่สีราง จะตก SC 1.4.1

**ต้องเขียนใน description ว่า "มีผลทันที"** เพื่อไม่ให้ถูกใช้แทน checkbox ในฟอร์ม

---

## 8 · Usage

```tsx
// ตั้งค่าที่มีผลทันที — มี toast ยืนยัน
<Switch
  isSelected={notify}
  onChange={async (next) => {
    setNotify(next);
    await saveSetting('emailNotify', next);
    toast(next ? 'เปิดการแจ้งเตือนแล้ว' : 'ปิดการแจ้งเตือนแล้ว');
  }}
  description="ระบบจะแจ้งเตือนเมื่อมีคำสั่งซื้อใหม่"
>
  รับการแจ้งเตือนทางอีเมล
</Switch>
```

```tsx
// รายการตั้งค่า — ปุ่มเรียงตรงแนวขวา
<VStack gap="2">
  <Switch labelPosition="start" labelSpacing="spread" defaultSelected label="แสดงราคารวมภาษีมูลค่าเพิ่ม" />
  <Switch labelPosition="start" labelSpacing="spread" label="แสดงเฉพาะสินค้าที่มีใบรับรอง" />
</VStack>
```

```tsx
// ❌ ในฟอร์มที่มีปุ่มบันทึก
// <Switch label="ยอมรับเงื่อนไข" />
// ✅
<CheckboxInput value="terms">ข้าพเจ้ายอมรับข้อกำหนดการใช้งาน</CheckboxInput>
```

---

## 9 · Anti-patterns

| ❌ | ✅ | ทำไม |
|---|---|---|
| Switch ในฟอร์มที่มีปุ่มบันทึก | `<CheckboxInput>` | ผู้ใช้คิดว่ามีผลแล้ว |
| Switch เป็นตัวกรอง | `<Token>` | ตัวกรองไม่ได้เปิด/ปิดระบบ |
| เปลี่ยนแล้วไม่มี feedback | toast หรือข้อความสถานะ | ผู้ใช้กดซ้ำเพราะไม่แน่ใจ |
| เปลี่ยนแค่สีราง | ปุ่มต้องเลื่อนจริง | SC 1.4.1 |
| assert `aria-checked` | เช็ค `input.checked` | native checkbox ไม่ตั้ง `aria-checked` |
| `description` ทวนชื่อ | บอกผลของการเปิด | ไม่ได้ข้อมูลเพิ่ม |
| switch สี่เหลี่ยม | `rounded-full` | ผู้ใช้ไม่รู้ว่าคืออะไร |
| Switch สำหรับ ก/ข | `<RadioList>` | เปิด/ปิด ≠ สองตัวเลือกที่มีชื่อ |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง ไม่มีแถวไหนอธิบายพฤติกรรมซ้ำ (นั่นคืองานของ §4 และ §5)

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · axe ผ่านใน `a11y/pass2.test.tsx` · เทส "เป็น `role="switch"` ไม่ใช่ `checkbox`" — screen reader ประกาศ "เปิด/ปิด" ไม่ใช่ "ติ๊ก/ไม่ติ๊ก" |
| ตอบสนอง (Responsive) | ✅ | `min-w-0` ที่ label · เป้ากด ≥24×24 (SC 2.5.8) ทุก breakpoint |
| โหมดมืด (Dark Mode) | ✅ | `lint-classes.mjs` 0 จุด — ทุกสีมาจาก token ที่ override ในโหมดมืดแล้ว |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | `lint-quality.mjs` 0 จุด — ไม่มี `ml-`/`pl-`/`left-` ในไฟล์นี้ |
| คีย์บอร์ด (Keyboard) | ✅ | §4 `focus-visible` · `Space` สลับค่า |
| กำลังโหลด (Loading) | — | §1 สวิตช์มีผลทันที — ถ้าผลต้องรอเครือข่าย สิ่งนั้นควรเป็นปุ่มยืนยัน ไม่ใช่สวิตช์ |
| ข้อผิดพลาด (Error) | — | สวิตช์มีสองค่าที่ถูกต้องเสมอ |
| ว่างเปล่า (Empty) | — | สวิตช์มีค่าเริ่มต้นเสมอ |
| Skeleton | — | กล่องสวิตช์เป็นโครงคงที่ |
| การเคลื่อนไหว (Animation) | ✅ | `base.css §10` ครอบ `*` ด้วย `!important` — ไม่มีการเคลื่อนไหวที่หลุดตัวกัน (`lint-quality.mjs` 0 จุด) · `transition-transform` ของหัวสวิตช์ถูก `base.css §10` ตัดออกจาก `transition-property` ให้อัตโนมัติ — หัวสวิตช์ยัง**ย้ายตำแหน่ง**ทันที เพราะเป็นตัวบอกสถานะ ไม่ใช่การตกแต่ง |
| ประสิทธิภาพ (Performance) | ✅ | animate เฉพาะ transform ของกล่อง 20px ซึ่งอยู่บน compositor · ไม่มีความสูงตายตัว |
