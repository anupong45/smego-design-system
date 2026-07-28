# RadioList · Radio

**`@smego/ui`** · ชั้น 03 · [RadioList.tsx](./RadioList.tsx)

> เดิมชื่อ `RadioGroup` — เปลี่ยนตาม ASTRYX-PARITY.md §1.2 · `errorMessage`→`status` · `showOptional`→`isOptional` · รับ `isLabelHidden` ตาม §8

---

## 1 · ภาพรวม

เลือกได้ **ข้อเดียว** จากตัวเลือกที่เห็นทั้งหมดพร้อมกัน

`layout="card"` มีไว้สำหรับตัวเลือกที่ต้องอธิบายยาว — ซึ่งในระบบนี้คือ **การเลือกวิธีชำระเงิน** (พร้อมเพย์ / โอน / เครดิตเทอม)

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน | เหตุผล |
|---|---|---|
| เลือกได้หลายข้อ | `<CheckboxGroup>` | วงกลมสื่อ "เลือกได้อันเดียว" |
| ตัวเลือกเกิน ~7 ข้อ | `<Selector>` (Pass 2) | สแกนด้วยตายากและกินพื้นที่แนวตั้งมาก |
| เปิด/ปิดสองสถานะ | `<Switch>` (Pass 2) | radio 2 ตัวสำหรับ ใช่/ไม่ใช่ กินที่โดยไม่จำเป็น |
| ตัวกรอง | `<Token>` | ตัวกรองต้องยกเลิกได้ — radio ยกเลิกไม่ได้ |
| สลับมุมมองที่มีผลทันที | [`<SegmentedControl>`](../navigation/SegmentedControl.md) | ไม่ใช่คำถามในฟอร์ม — `label` ไม่ต้องแสดง และไม่มี `status` (ดูกฎแบ่งเขต 4 ทาง) |

**⚠️ radio ยกเลิกการเลือกไม่ได้** — ถ้าผู้ใช้ต้องมีสิทธิ์ไม่เลือก ต้องมีตัวเลือก "ไม่ระบุ" ในกลุ่ม

---

## 2 · React API

```tsx
import { RadioList, Radio } from '@smego/ui';

<RadioList label="วิธีชำระเงิน" value={method} onChange={setMethod}>
  <Radio value="promptpay" layout="card" description="สแกน QR ด้วยแอปธนาคาร">
    พร้อมเพย์
  </Radio>
</RadioList>
```

### Radio

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `children` | `ReactNode` | — | |
| `value` | `string` | — | **บังคับ** |
| `description` | `string` | — | คำอธิบายใต้ข้อความ |
| `endSlot` | `ReactNode` | — | เช่น QR หรือโลโก้ธนาคาร |
| `layout` | `'inline' \| 'card'` | `'inline'` | |
| `isDisabled` | `boolean` | `false` | |

### RadioList

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `label` | `string` | — | **บังคับ** |
| `description` | `string` | — | |
| `status` | `InputStatus` | — | `{ type: "error"\|"warning"\|"success", message? }` |
| `isOptional` | `boolean` | `false` | |
| `isLabelHidden` | `boolean` | `false` | ซ่อน label ด้วยตา แต่ยังประกาศให้ screen reader — ใช้เมื่อหัวข้อรอบข้างบอกอยู่แล้วว่ากลุ่มนี้ถามอะไร |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | |
| `value` / `defaultValue` / `onChange` | `string` | — | จาก RAC |

---

## 3 · Variants

| layout | รูปแบบ | ใช้เมื่อไร |
|---|---|---|
| `inline` | แถวธรรมดา · `p-1` | ตัวเลือกสั้น — เพศ, ประเภทธุรกิจ |
| `card` | กล่องมีขอบ · `p-4` · ทั้งกล่องกดได้ | ตัวเลือกที่ต้องอธิบาย — วิธีชำระเงิน, แผนบริการ |

### `card` — สีตามสถานะ

| สถานะ | ขอบ | พื้น |
|---|---|---|
| ไม่เลือก | `border-edge-strong` | `bg-surface` (hover → `bg-sunken`) |
| **เลือก** | `border-edge-brand` | `bg-primary-50` |
| invalid | `border-edge-danger` | |
| disabled | `border-edge` | `bg-sunken` |

### ★★ radio เป็น **ข้อยกเว้นเดียว** ของ `rounded-full` นอกเหนือจาก 4 อย่าง

ข้อ 05 สงวน `rounded-full` ให้ **chip · badge · avatar · dot**

radio ได้รับยกเว้นเพราะ **วงกลมคือรูปทรงมาตรฐานสากล** ที่แยก radio (เลือกได้อันเดียว) ออกจาก checkbox (เลือกได้หลายอัน)

การทำ radio เป็นสี่เหลี่ยม **จะทำให้ผู้ใช้เข้าใจพฤติกรรมผิด** ซึ่งเสียหายมากกว่าความสม่ำเสมอของ radius

### ★ จุดกลางต่างที่ **ขนาด** ไม่ใช่แค่สี

วงนอก `size-5` (20px) · จุดกลาง `size-2.5` (10px) — ต่างกันครึ่งหนึ่ง เห็นชัดแม้ไม่แยกสี

---

## 4 · States

| state | ที่มา | สิ่งที่เปลี่ยน |
|---|---|---|
| default | — | `border-edge-strong` · ไม่มีจุด |
| hover | `group-data-hovered` | `border-fg-muted` (เฉพาะตอนยังไม่เลือก) |
| focus-visible | `data-focus-visible` | วงแหวน 2 ชั้นจาก `base.css` |
| **selected** | `isSelected` | `border-edge-brand` + จุด `bg-primary-600` |
| invalid | `isInvalid` | `border-edge-danger` |
| disabled | `isDisabled` | `bg-sunken` · จุดเป็น `bg-fg-disabled` |

### ★★ roving tabindex — ต่างจาก checkbox

ทั้งกลุ่มกิน **หนึ่ง tab stop**:

1. Tab เข้าที่ตัวที่เลือกไว้ (หรือตัวแรกถ้ายังไม่เลือก)
2. **ลูกศรเลื่อน และเลือกทันที** — ไม่ต้องกด Space
3. Tab ออกจากกลุ่มทั้งกลุ่ม

(ข้อ 10 §1.2) RAC จัดการให้ทั้งหมด — **ถ้าเขียนเองมักพลาดข้อนี้**

⚠️ ผลข้างเคียงที่ต้องรู้: ผู้ใช้คีย์บอร์ด **ไม่สามารถเลื่อนดูตัวเลือกโดยไม่เลือก** ได้ ถ้าตัวเลือกมีผลข้างเคียงทันที (เช่นโหลดฟอร์มใหม่) จะรบกวนมาก — ให้หน่วงผลจนกว่าจะกด "ถัดไป"

### ขนาดเป้าที่วัดจริง

| layout | ขนาด |
|---|---|
| `inline` | ทั้งแถว · ≥28px สูง |
| `card` | ทั้งกล่อง · วัดได้ **596×82px** |

---

## 5 · Accessibility

| เรื่อง | ข้อกำหนด |
|---|---|
| role | `radiogroup` + `radio` จาก RAC |
| keyboard | Tab เข้ากลุ่ม · **ลูกศรเลือก** · Space ยืนยัน |
| **SC 2.5.8** | เป้ารวม = ทั้งแถว/ทั้งกล่อง วัดแล้ว |
| **SC 1.4.11** | ขอบ `edge-strong` = 4.20:1 ✅ |
| **SC 1.4.1** | จุดกลางต่างที่ขนาด ไม่ใช่แค่สี |
| **SC 1.3.1** | `Label` เชื่อมกับ group ด้วย `aria-labelledby` โดย RAC |
| **SC 3.3.1** | `FieldError` เชื่อมด้วย `aria-describedby` |

### ★ `orientation="horizontal"` ต้อง wrap

```
orientation === 'horizontal' && 'flex flex-wrap items-start gap-4'
```

ข้อความไทยยาวกว่าอังกฤษ **20–40%** ถ้าไม่ wrap จะล้นที่ 360px

**แต่ระวัง:** แนวนอนทำให้ความสัมพันธ์ระหว่างวงกลมกับข้อความอ่านยากขึ้นเมื่อ wrap เป็นสองแถว — ใช้แนวตั้งเป็นค่าเริ่มต้นด้วยเหตุผลนี้

### ★ `label` ของ group ต้องเป็นคำถามหรือชื่อสิ่งที่เลือก

```
❌ label="ตัวเลือก"
✅ label="วิธีชำระเงิน"
```

screen reader ประกาศชื่อกลุ่มก่อนอ่านตัวเลือกแต่ละตัว — ถ้าชื่อกลุ่มไม่มีความหมาย ผู้ใช้ไม่รู้ว่ากำลังเลือกอะไร

---

## 6 · Tailwind implementation

```tsx
<RACRadio className={({ isSelected, isDisabled, isInvalid }) => cn(
  'group flex min-w-0 items-start gap-2 cursor-pointer',
  'data-disabled:cursor-not-allowed',
  layout === 'inline' && 'p-1',
  layout === 'card' && [
    'rounded-(--radius-container) border p-4',
    'transition-colors duration-fast ease-standard',
    isSelected ? 'border-edge-brand bg-primary-50'
               : 'border-edge-strong bg-surface data-hovered:bg-sunken',
    isInvalid && 'border-edge-danger',
    isDisabled && 'border-edge bg-sunken',
  ],
)}>
  {({ isSelected, isDisabled, isInvalid }) => (
    <span className={cn(
      'flex size-5 shrink-0 items-center justify-center rounded-full border',
      'transition-colors duration-fast ease-standard',
      isSelected ? 'border-edge-brand' : 'border-edge-strong',
      isInvalid && 'border-edge-danger',
      isDisabled ? 'bg-sunken' : 'bg-surface',
      !isSelected && !isDisabled && 'group-data-hovered:border-fg-muted',
    )}>
      {isSelected && (
        <span className={cn('size-2.5 rounded-full',
          isDisabled ? 'bg-fg-disabled' : 'bg-primary-600')} />
      )}
    </span>
  )}
</RACRadio>
```

---

## 7 · Figma Variant

Component set **`Radio`**

| Property | Values |
|---|---|
| `Layout` | `Inline` · `Card` |
| `Selected` | `True` · `False` |
| `State` | `Default` · `Hover` · **`Focus`** · `Disabled` |
| `Description` | `True` · `False` |
| `End slot` | `None` · `Slot` |

Component set **`RadioList`** — property `Orientation`, `Error`, `Optional`

**ต้องมีตัวอย่างจริงของ `PaymentMethodSelect`** ที่ใช้ `layout="card"` ครบ 4 ตัวเลือกเรียงตามลำดับของจริง (พร้อมเพย์ → โอน → เครดิตเทอม → บัตร) เพื่อไม่ให้ใครเรียงแบบ B2C ตะวันตก

**ห้ามวาด radio เป็นสี่เหลี่ยม** แม้จะดูเข้ากับ radius ของระบบมากกว่า

---

## 8 · Usage

```tsx
// วิธีชำระเงิน — ลำดับตามที่ SME ไทยใช้จริง ไม่ใช่บัตรขึ้นก่อน
<RadioList label="วิธีชำระเงิน" value={method} onChange={setMethod}>
  <Radio value="promptpay" layout="card" description="สแกน QR ด้วยแอปธนาคาร">
    พร้อมเพย์
  </Radio>
  <Radio value="transfer" layout="card" description="โอนแล้วอัปโหลดสลิปเพื่อยืนยัน">
    โอนผ่านธนาคาร
  </Radio>
  <Radio value="credit" layout="card" description="ชำระภายใน 30 / 60 / 90 วัน">
    เครดิตเทอม
  </Radio>
  <Radio value="card" layout="card" description="วีซ่า มาสเตอร์การ์ด">
    บัตรเครดิต
  </Radio>
</RadioList>
```

```tsx
// ตัวเลือกสั้น — inline
<RadioList label="ประเภทผู้ประกอบการ" orientation="horizontal">
  <Radio value="person">บุคคลธรรมดา</Radio>
  <Radio value="juristic">นิติบุคคล</Radio>
  <Radio value="community">วิสาหกิจชุมชน</Radio>
</RadioList>
```

```tsx
// ต้องมีทางไม่เลือก
<RadioList label="ขนาดกิจการ" isOptional>
  <Radio value="micro">รายย่อย</Radio>
  <Radio value="small">ขนาดเล็ก</Radio>
  <Radio value="unspecified">ไม่ระบุ</Radio>
</RadioList>
```

---

## 9 · Anti-patterns

| ❌ | ✅ | ทำไม |
|---|---|---|
| `<Radio>` เดี่ยวนอก `<RadioList>` | อยู่ในกลุ่มเสมอ | ไม่มี `role="radiogroup"` = roving ไม่ทำงาน |
| radio 2 ตัวสำหรับ ใช่/ไม่ใช่ | `<Switch>` หรือ `<Checkbox>` | กินพื้นที่แนวตั้งโดยไม่ได้อะไรกลับมา |
| radio เป็นสี่เหลี่ยม | `rounded-full` | ผู้ใช้เข้าใจพฤติกรรมผิด |
| จุดกลางต่างแค่สี | ต่างที่ขนาด (20 vs 10) | SC 1.4.1 |
| ไม่มีตัวเลือก "ไม่ระบุ" ในกลุ่มที่ไม่บังคับ | เพิ่มตัวเลือกนั้น | radio ยกเลิกไม่ได้ |
| `orientation="horizontal"` โดยไม่ wrap | wrap เปิดอยู่แล้ว | ข้อความไทยล้นที่ 360px |
| radio 12 ตัว | `<Selector>` | สแกนยากและกินที่ |
| บัตรเครดิตเป็นตัวเลือกแรก | พร้อมเพย์ก่อน | สมมติฐาน B2C ตะวันตกไม่ตรงกับ B2B ไทย |
| `label="ตัวเลือก"` | `label="วิธีชำระเงิน"` | screen reader ประกาศชื่อกลุ่มก่อน |
| เลือกแล้วโหลดฟอร์มใหม่ทันที | หน่วงจนกด "ถัดไป" | roving เลือกทุกครั้งที่กดลูกศร = โหลด 4 ครั้ง |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง ไม่มีแถวไหนอธิบายพฤติกรรมซ้ำ (นั่นคืองานของ §4 และ §5)

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · axe ผ่านใน `a11y/primitives.test.tsx` ทั้ง `layout="inline"` และ `card` |
| ตอบสนอง (Responsive) | ✅ | §3 `layout` — `inline` สำหรับตัวเลือกสั้น · `card` ซ้อนแนวตั้งเสมอจึงไม่บีบที่ 320px |
| โหมดมืด (Dark Mode) | ✅ | `lint-classes.mjs` 0 จุด — ทุกสีมาจาก token ที่ override ในโหมดมืดแล้ว · การ์ดที่เลือกใช้ `bg-selected-surface` ซึ่ง override ในโหมดมืดแล้ว (ไม่ใช่ ramp ขั้น 50/100 ที่ `lint-classes.mjs` ห้ามไว้) |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | `lint-quality.mjs` 0 จุด — ไม่มี `ml-`/`pl-`/`left-` ในไฟล์นี้ |
| คีย์บอร์ด (Keyboard) | ✅ | §4 `focus-visible` · ลูกศรเลื่อนภายในกลุ่ม · `Tab` ข้ามทั้งกลุ่มเป็นหน่วยเดียว (roving tabindex ของ RAC) |
| กำลังโหลด (Loading) | — | ตัวเลือกมาพร้อมหน้า |
| ข้อผิดพลาด (Error) | ✅ | §4 `invalid` · `status` ที่ระดับกลุ่ม ไม่ใช่รายตัวเลือก (SC 3.3.1) |
| ว่างเปล่า (Empty) | — | กลุ่มที่ไม่มีตัวเลือกคือกลุ่มที่ไม่ควร render |
| Skeleton | — | ตัวเลือกเป็นข้อความสั้น ไม่ต้องมีตัวแทนระหว่างโหลด |
| การเคลื่อนไหว (Animation) | ✅ | `base.css §10` ครอบ `*` ด้วย `!important` — ไม่มีการเคลื่อนไหวที่หลุดตัวกัน (`lint-quality.mjs` 0 จุด) |
| ประสิทธิภาพ (Performance) | ✅ | animate เฉพาะสี · ไม่มีความสูงตายตัว |
