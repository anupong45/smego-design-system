# TextArea

**`@smego/ui`** · ชั้น 03 · [TextArea.tsx](./TextArea.tsx) · แบบบรรทัดเดียวอยู่ที่ [TextInput.md](./TextInput.md)

> **เปลี่ยนชื่อจาก `Textarea` ใน 0.1.0** — ตรงกับ Astryx (ASTRYX-PARITY.md §1.2)
> ต่างกันแค่ **ตัว A ใหญ่** · `TextArea` ยัง import ได้ถึง 0.2.0 แต่เป็น `@deprecated`
> API เปลี่ยนเหมือน `TextInput`: `errorMessage` → `status` · `showOptional` → `isOptional`

---

## 1 · ภาพรวม

ช่องกรอกข้อความหลายบรรทัด — ใช้กับเนื้อหาที่ผู้ใช้เขียนเองเป็นย่อหน้า เช่นรายละเอียดธุรกิจ เหตุผลการขอทุน คำอธิบายสินค้า

**เหตุผลเชิงโครงสร้างทั้งหมดอยู่ที่ [TextInput.md](./TextInput.md)** — `validationBehavior="aria"` · Thai IME · `border-edge-strong` · label เหนือช่อง · การเชื่อม `aria-describedby` ของ RAC ทุกข้อใช้กับ `TextArea` เหมือนกันทุกประการ เอกสารนี้เขียนเฉพาะสิ่งที่ **ต่าง**

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน | เหตุผล |
|---|---|---|
| ข้อความบรรทัดเดียว | [`TextInput`](./TextInput.md) | ช่องสูงหลายบรรทัดสื่อว่า "เขียนยาว ๆ ได้" ถ้าจริง ๆ ต้องการบรรทัดเดียวจะทำให้ผู้ใช้เขียนเกินแล้วโดนตัด |
| ที่อยู่ | `TextInput` หลายช่อง | ที่อยู่ไทยมีโครงสร้าง (แขวง/เขต/จังหวัด/รหัสไปรษณีย์) การรวมเป็นกล่องเดียวทำให้ตรวจสอบและจัดส่งไม่ได้ |
| เนื้อหาที่มีรูปแบบ | ยังไม่มีใน 0.1.0 | rich text ต้องรอ component เฉพาะ |

---

## 2 · React API

```tsx
import { TextArea } from '@smego/ui';

<TextArea
  label="รายละเอียดธุรกิจ"
  description="อธิบายสินค้าหรือบริการหลักของคุณ"
  rows={4}
  isOptional
/>
```

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `label` | `string` | — | **บังคับ** |
| `isLabelHidden` | `boolean` | `false` | ซ่อนจากสายตา ยังอยู่ให้ SR |
| `description` | `string` | — | บอกสิ่งที่อยากให้เขียน **ก่อน** ผู้ใช้เริ่มพิมพ์ |
| `status` | `InputStatus` | — | `{ type: 'error' \| 'warning' \| 'success', message?: string }` |
| `isOptional` | `boolean` | `false` | แสดง "(ไม่บังคับ)" ต่อท้าย label |
| `rows` | `number` | `4` | จำนวนบรรทัดเริ่มต้น |
| `size` | `'md' \| 'lg'` | `'md'` | padding เท่ากับ `TextInput` |
| `placeholder` | `string` | — | **ไม่ใช่ที่แทน label** |
| `value` / `defaultValue` | `string` | — | จาก RAC |
| `onChange` | `(value: string) => void` | — | **กันระหว่าง IME composition แล้ว** |
| `isDisabled` / `isReadOnly` / `isRequired` | `boolean` | `false` | จาก RAC |

`isLoading` · `hasClear` · `startIcon` **ไม่มีใน `TextArea`** — ปุ่มล้างและไอคอนนำออกแบบมาสำหรับช่องบรรทัดเดียว การวางไว้ในกล่องหลายบรรทัดทำให้ตำแหน่งไม่แน่นอนเมื่อผู้ใช้ยืดกล่อง

---

## 3 · สิ่งที่ต่างจาก `TextInput`

### ★ `resize-y` — ยืดได้เฉพาะแนวตั้ง

```
resize-y   ✅  ผู้ใช้ยืดลงได้เมื่อเขียนยาว
resize     ❌  ยืดแนวนอนได้ด้วย → layout พังที่ 320px
resize-none ❌ พรากการควบคุมจากผู้ใช้โดยไม่จำเป็น
```

การยืดแนวนอนทำให้กล่องล้นออกนอก viewport บนมือถือ ซึ่งละเมิด **SC 1.4.10 (Reflow)** ทันทีที่ผู้ใช้ลาก

### ★ line-height 1.75 สำคัญกว่าที่นี่มากกว่าช่องบรรทัดเดียว

`text-body` ให้ line-height 28px บนตัวอักษร 16px

ในช่องบรรทัดเดียวเรื่องนี้แทบไม่มีผล แต่ในข้อความหลายบรรทัด **สระบนของบรรทัดล่างจะชนวรรณยุกต์ของบรรทัดบน** ถ้า line-height แน่นกว่านี้:

```
เชี่ยวชาญ     ← ไม้เอกอยู่ชั้นสองเหนือสระอี
ที่ปรึกษา     ← สระอีของบรรทัดนี้ชนไม้เอกด้านบน
```

นี่คือเหตุผลที่ **ไม่รับ type scale ของ Astryx** (14px / line-height 1.4286) — ดู ASTRYX-PARITY.md D3

### ★ ไม่จำกัดความยาวโดยพลการ

ถ้าต้องจำกัด ให้ใช้ `maxLength` จาก RAC พร้อม `description` ที่บอกจำนวนล่วงหน้า **ห้ามตัดข้อความเงียบ ๆ** ตอน submit — ผู้ใช้ที่เขียนย่อหน้ายาวแล้วโดนตัดจะไม่รู้ว่าข้อมูลหาย

---

## 4 · States

เหมือน [`TextInput` §4](./TextInput.md) ทุกสถานะ — `data-hovered` · `:focus` · `data-invalid` · `data-disabled` · `data-readonly`

`TextArea` **ไม่ใช้ `focus-within`** เพราะไม่มีกล่องนอก ตัว `<textarea>` เป็นขอบเขตเอง จึงใช้ `focus:border-edge-brand` ตรง ๆ

---

## 5 · Accessibility

ตาราง SC ทั้งหมดเหมือน [`TextInput` §5](./TextInput.md) เพิ่มอีกหนึ่งข้อ:

| เรื่อง | ข้อกำหนด |
|---|---|
| **SC 1.4.10** | `resize-y` เท่านั้น — การยืดแนวนอนทำให้เนื้อหาล้นที่ 320px |

---

## 6 · Usage

```tsx
// รายละเอียดธุรกิจในหน้าโปรไฟล์ผู้ขาย
<TextArea
  label="รายละเอียดธุรกิจ"
  description="อธิบายสินค้าหรือบริการหลักของคุณ ผู้ซื้อจะเห็นข้อความนี้ในหน้าร้าน"
  rows={4}
  isOptional
/>
```

```tsx
// เหตุผลการขอทุน — บังคับกรอก มีขีดจำกัดที่บอกล่วงหน้า
<TextArea
  label="เหตุผลที่ขอรับทุน"
  description="ไม่เกิน 500 ตัวอักษร"
  maxLength={500}
  rows={6}
  isRequired
  status={
    reason.length === 0 && submitted
      ? { type: 'error', message: 'ยังไม่ได้กรอกเหตุผล — กรุณาอธิบายว่าจะนำทุนไปใช้อย่างไร' }
      : undefined
  }
/>
```

---

## 7 · Anti-patterns

| ❌ | ✅ | เหตุผล |
|---|---|---|
| `resize-none` | `resize-y` | พรากการควบคุมจากผู้ใช้ที่เขียนยาว |
| `rows={2}` สำหรับย่อหน้า | `rows={4}` ขึ้นไป | กล่องเตี้ยบอกผู้ใช้ว่า "เขียนสั้น ๆ" โดยไม่ได้ตั้งใจ |
| ใช้แทนที่อยู่ | `TextInput` แยกช่อง | ที่อยู่ไทยมีโครงสร้าง ต้องตรวจสอบรายส่วน |
| ตัดข้อความตอน submit | `maxLength` + `description` | ผู้ใช้ต้องรู้ขีดจำกัด**ก่อน**เขียน |
| `placeholder` แทน `label` | `label` เสมอ | placeholder หายทันทีที่พิมพ์ |

---

## 8 · Quality Checklist

| เกณฑ์ | ผ่าน | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | axe ผ่านใน `a11y/primitives.test.tsx` (`TextArea`) |
| ความสม่ำเสมอ (Consistency) | ✅ | ใช้ `fieldStyles` ชุดเดียวกับ `TextInput` ทุก token |
| ภาษาไทย | ✅ | line-height 1.75 · IME composition guard · ดู §3 |
| Astryx parity | ✅ | ชื่อและ props ตรงตาม §3 ของ ASTRYX-PARITY.md ยกเว้นที่บันทึกใน D1 · D6 · D8 |
