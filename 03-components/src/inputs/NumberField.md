# NumberField

**`@smego/ui`** · ชั้น 03 · [NumberField.tsx](./NumberField.tsx)

---

## 1 · ภาพรวม

ช่องกรอกตัวเลขที่ต้องคำนวณ — จำนวนสั่งซื้อ · วงเงิน · ราคา · เปอร์เซ็นต์

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน | เหตุผล |
|---|---|---|
| เลขที่ไม่ใช่ปริมาณ (เลขนิติบุคคล · โทรศัพท์) | `<TextField inputMode="numeric">` | ไม่ควรคั่นหลักพัน ไม่ควรมีปุ่มเพิ่ม/ลด |
| ช่วงค่า | `<RangeSlider>` | มีช่องกรอกในตัวอยู่แล้ว |
| รหัส OTP | `<OTPField>` | ต้องวางได้และกระจายลงช่อง |
| เลือกจากค่าที่กำหนดไว้ | `<Select>` | |

**เส้นแบ่งสำคัญ:** เลขนิติบุคคล 13 หลักต้อง **ไม่** คั่นหลักพัน — ถ้าใช้ NumberField จะได้ `0,105,561,234,567`

---

## 2 · React API

```tsx
<NumberField
  label="จำนวนที่สั่ง"
  description="สั่งขั้นต่ำ 1 ชิ้น สูงสุด 9,999 ชิ้น"
  value={qty}
  onChange={setQty}
  minValue={1}
  maxValue={9999}
  suffix="ชิ้น"
/>
```

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `label` | `string` | — | **บังคับ** |
| `description` | `string` | — | **ควรระบุช่วงที่รับได้** — ดู §5 |
| `errorMessage` | `string` | — | |
| `suffix` | `string` | — | หน่วยในช่อง · ได้ `aria-hidden` |
| `hideStepper` | `boolean` | `false` | ใช้กับจำนวนเงินที่ค่ากว้าง |
| `size` | `'md' \| 'lg'` | `'md'` | 46 / 54px |
| `value` / `onChange` / `minValue` / `maxValue` / `step` | | | จาก RAC |
| `formatOptions` | `Intl.NumberFormatOptions` | — | `{ useGrouping: true }` คั่นหลักพัน |

---

## 3 · Variants

ไม่มี variant · `hideStepper` เป็น boolean เพราะจำนวนเงินหลักล้านไม่ควรมีปุ่ม ±1

### ★ RAC จัดการให้ทั้งชุด

- คั่นหลักพัน `1,250,000` ขณะพิมพ์ และถอดกลับเป็นตัวเลขให้ `onChange`
- **บังคับ min/max ตอน blur ไม่ใช่ตอนพิมพ์**
- ลูกศรขึ้น/ลง · PageUp/PageDown · Home/End

ข้อกลางคือที่เขียนเองมักพลาด — ผู้ใช้พิมพ์ "5" ในช่องที่ `minValue={100}` แล้วโดนเด้งเป็น 100 ทันทีจนพิมพ์ 500 ไม่ได้

---

## 4 · States

| state | สิ่งที่เปลี่ยน |
|---|---|
| default | `border-edge-strong` |
| focus-within | `border-edge-brand` |
| invalid | `border-edge-danger` + ข้อความ |
| disabled | `text-fg-disabled` · ปุ่ม ± ปิดด้วย |

### ★★★ ปุ่มเพิ่ม/ลดเรียง **แนวนอน** ไม่ใช่แนวตั้ง — วัดแล้วสองเหตุผล

ตอนแรกผมทำเป็นคอลัมน์ `chevron-up` / `chevron-down` แบบที่ระบบอื่นทำ **วัดจริงแล้วพัง 2 ข้อ**:

| ปัญหา | ค่าที่วัดได้ |
|---|---|
| ปุ่มเล็กเกินเกณฑ์ | **20×16** — ไม่ผ่าน SC 2.5.8 (ต้อง 24×24) |
| ดันความสูงช่อง | คอลัมน์สูง 32px → ช่องเป็น **50px** แทน 46px (ข้อ 30) |

ข้อสองสำคัญกว่าที่คิด — ฟอร์มที่มี `<TextField>` กับ `<NumberField>` เรียงกันจะ **ไม่ตรงแนว** และมองเห็นทันที

**แก้เป็นแนวนอน `minus` / `plus` ขนาด 24×24** · เตี้ยกว่า line box 28px จึงไม่ดันความสูง

**หลังแก้:** ปุ่ม `24×24` ✅ · ช่อง `46px` ✅

### ⚠️ ต้องมี `shrink-0` ที่ตัวปุ่ม ไม่ใช่แค่ที่กล่องครอบ

ปุ่มเป็น flex item ที่ `flex-shrink: 1` โดยปริยาย — ที่ 320px `<Input className="w-full">` เบียดจนปุ่มถูกบีบเหลือ 16px

`min-w-0` ที่ Input ทำให้ Input ยอมย่อ แต่ปุ่มต้องประกาศ `shrink-0` เอง

---

## 5 · Accessibility

| เรื่อง | ข้อกำหนด |
|---|---|
| **SC 2.5.8** | ปุ่ม ± = 24×24 วัดแล้ว |
| **SC 1.4.11** | ขอบ `edge-strong` = 4.20:1 |
| **SC 3.3.1** | error มีข้อความ |
| ปุ่ม ± | ชื่อมาจาก `@react-aria/numberfield` — แปลไทยแล้ว |

### ★★★ ช่องนี้ **ไม่ใช่ `role="spinbutton"`**

ผมเขียนไว้ตอนแรกว่า RAC ให้ `role="spinbutton"` + `aria-valuenow/min/max` — **ตรวจแล้วไม่จริง**

RAC 1.19 render เป็น:

```
type="text"  inputMode="numeric"  role=null  aria-valuemin=null  aria-valuemax=null
```

เป็นการตัดสินใจของ React Aria เอง เพราะ `role="spinbutton"` ทำให้ screen reader หลายตัว **เข้าโหมดอ่านค่าแทนโหมดแก้ข้อความ** ผู้ใช้จึงพิมพ์ทับไม่ได้

**ผลที่ตามมาที่ต้องรับมือ:** ขอบเขต min/max **ไม่ถูกประกาศให้ screen reader**

→ `description` จึงควร **ระบุช่วงที่รับได้เป็นข้อความ** เสมอ:

```tsx
description="สั่งขั้นต่ำ 1 ชิ้น สูงสุด 9,999 ชิ้น"
```

นี่ไม่ใช่คำแนะนำเชิงสไตล์ แต่เป็นสิ่งเดียวที่บอกขอบเขตให้ผู้ใช้ที่มองไม่เห็น

### ★ `suffix` ได้ `aria-hidden`

หน่วยอยู่ใน `label` หรือ `description` แล้ว — ถ้าไม่ซ่อน screen reader จะอ่าน "ชิ้น" ซ้ำ

---

## 6 · Tailwind implementation

```tsx
{!hideStepper && (
  <div className="flex shrink-0 items-center gap-0.5">
    <RACButton slot="decrement" className={cn(
      'inline-flex size-6 shrink-0 items-center justify-center',   /* 24×24 */
      'rounded-(--radius-xs)',
      'text-fg-muted',
      'transition-colors duration-fast ease-standard',
      'data-hovered:bg-sunken data-hovered:text-fg',
      'data-disabled:text-fg-disabled',
    )}>
      <Icon name="minus" size={16} />
    </RACButton>
    {/* increment เหมือนกัน ใช้ plus */}
  </div>
)}
```

```tsx
<Input className={cn(
  'w-full min-w-0 border-0 bg-transparent p-0 outline-none',
  'text-body text-fg font-numeric tabular-nums',   /* ★ หลักต้องตรงกัน */
  'placeholder:text-fg-muted',
)} />
```

⚠️ **`size-6` บน `<button>` เคยไม่ทำงาน** — `base.css §8` ตั้ง `:where(button) { width: auto }` ไว้นอก `@layer` ซึ่งชนะ utilities แก้แล้วโดยย้ายเข้า `@layer base` และมีเทส Playwright กันไม่ให้หลุดอีก

---

## 7 · Figma Variant

Component set **`NumberField`**

| Property | Values |
|---|---|
| `Stepper` | `True` · `False` |
| `Suffix` | `None` · `Unit` |
| `State` | `Default` · **`Focus`** · `Invalid` · `Disabled` |

**ปุ่ม ± ต้องเรียงแนวนอนและเป็น 24×24 ในทุก frame** — ถ้านักออกแบบวาดเป็นลูกศรซ้อนกันแบบที่คุ้นตา จะได้ปุ่ม 20×16 ที่ไม่ผ่าน SC 2.5.8 และช่องสูง 50px ที่ไม่ตรงกับช่องอื่น

**`description` ต้องมีข้อความช่วงค่าจริงในตัวอย่าง** ไม่ใช่ "Helper text"

---

## 8 · Usage

```tsx
// จำนวนสั่งซื้อ — มีปุ่ม ± เพราะปรับทีละน้อย
<NumberField
  label="จำนวนที่สั่ง"
  description="สั่งขั้นต่ำ 1 ชิ้น สูงสุด 9,999 ชิ้น"
  value={qty} onChange={setQty}
  minValue={1} maxValue={9999} suffix="ชิ้น"
/>
```

```tsx
// จำนวนเงิน — ซ่อนปุ่ม เพราะ ±1 บาทไม่มีความหมายกับหลักล้าน
<NumberField
  label="วงเงินที่ขอ"
  description="ไม่เกินวงเงินสูงสุดของโครงการ"
  hideStepper
  suffix="บาท"
  formatOptions={{ useGrouping: true }}
/>
```

```tsx
// ❌ ห้ามใช้กับเลขนิติบุคคล
// <NumberField label="เลขทะเบียนนิติบุคคล" />  → 0,105,561,234,567
// ✅
<TextField label="เลขทะเบียนนิติบุคคล" inputMode="numeric" />
```

---

## 9 · Anti-patterns

| ❌ | ✅ | ทำไม |
|---|---|---|
| ใช้กับเลขนิติบุคคล/โทรศัพท์ | `<TextField inputMode="numeric">` | คั่นหลักพันทำให้เลขผิด |
| ปุ่ม ± เรียงแนวตั้ง | แนวนอน 24×24 | ได้ 20×16 (ตก SC 2.5.8) และช่องสูง 50px |
| ปุ่มไม่มี `shrink-0` | มี | ถูกบีบเหลือ 16px ที่ 320px |
| ไม่มี `description` บอกช่วง | ระบุช่วงเป็นข้อความ | ไม่ใช่ spinbutton — min/max ไม่ถูกประกาศ |
| หวังพึ่ง `aria-valuemin/max` | `description` | RAC ไม่ใส่ให้ — ตรวจแล้ว |
| ไม่มี `tabular-nums` | `font-numeric tabular-nums` | หลักไม่ตรง → อ่านผิดหลัก |
| `suffix` ไม่มี `aria-hidden` | มี | screen reader อ่านหน่วยซ้ำ |
| บังคับ min ตอนพิมพ์ | ปล่อยให้ RAC ทำตอน blur | พิมพ์ 500 ไม่ได้เพราะโดนเด้งที่ 5 |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง ไม่มีแถวไหนอธิบายพฤติกรรมซ้ำ (นั่นคืองานของ §4 และ §5)

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · axe ผ่านใน `a11y/pass2.test.tsx` · เทส "ไม่ใช้ `role="spinbutton"` — เป็น textbox ที่พิมพ์ทับได้" |
| ตอบสนอง (Responsive) | ✅ | `min-w-0` · §4 บันทึกไว้ว่าปุ่มเพิ่ม/ลด**ไม่ดันความสูงช่อง** จึงไม่พังเมื่อผู้ใช้ขยายตัวอักษร |
| โหมดมืด (Dark Mode) | ✅ | `lint-classes.mjs` 0 จุด — ทุกสีมาจาก token ที่ override ในโหมดมืดแล้ว |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | `lint-quality.mjs` 0 จุด — ไม่มี `ml-`/`pl-`/`left-` ในไฟล์นี้ |
| คีย์บอร์ด (Keyboard) | ✅ | §4 `focus-within` · ลูกศรขึ้น/ลงเปลี่ยนค่า · พิมพ์ทับได้โดยตรง |
| กำลังโหลด (Loading) | — | ค่าคำนวณในเครื่อง |
| ข้อผิดพลาด (Error) | ✅ | §4 `invalid` · `errorMessage` (SC 3.3.1) · ค่านอกช่วงบอกเกณฑ์จริง |
| ว่างเปล่า (Empty) | — | ช่องว่าง = ยังไม่กรอก ซึ่งต่างจาก 0 และถูกจัดการที่ระดับฟอร์ม |
| Skeleton | — | ช่องกรอกไม่ใช่เนื้อหาที่ต้องมีตัวแทนระหว่างโหลด |
| การเคลื่อนไหว (Animation) | ✅ | `base.css §10` ครอบ `*` ด้วย `!important` — ไม่มีการเคลื่อนไหวที่หลุดตัวกัน (`lint-quality.mjs` 0 จุด) |
| ประสิทธิภาพ (Performance) | ✅ | เทส "NumberField ใช้ `tabular-nums`" — ตัวเลขไม่ขยับตอนพิมพ์จึงไม่เกิด reflow ทุกคีย์ |
