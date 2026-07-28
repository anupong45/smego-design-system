# TextInput

**`@smego/ui`** · ชั้น 03 · [TextInput.tsx](./TextInput.tsx) · แบบหลายบรรทัดอยู่ที่ [TextArea.md](./TextArea.md)

> **เปลี่ยนชื่อจาก `TextField` ใน 0.1.0** — ตรงกับ Astryx (ASTRYX-PARITY.md §1.2)
> `TextField` ยัง import ได้ถึง 0.2.0 แต่เป็น `@deprecated` และ **API เปลี่ยนแล้ว**:
> `errorMessage` → `status` · `showOptional` → `isOptional` · `prefix` → `startIcon`

---

## 1 · ภาพรวม

ช่องกรอกข้อความบรรทัดเดียว แบบหลายบรรทัดใช้ [`TextArea`](./TextArea.md)

เป็น component ที่ **ข้อจำกัดภาษาไทยกระทบมากที่สุด** — การประกอบตัวอักษรผ่าน IME ทำให้การ validate แบบทุก keystroke ใช้ไม่ได้

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน | เหตุผล |
|---|---|---|
| ตัวเลขที่ต้องคำนวณ | `<NumberField>` (Pass 2) | ต้องมี stepper และ `inputMode="numeric"` |
| ค้นหาพร้อม suggestion | `<ComboBox>` (Pass 2) | ต้องมี `aria-autocomplete` + listbox |
| วันที่ | `<DatePicker>` (Pass 2) | ต้องเป็น พ.ศ. ผ่าน `BuddhistCalendar` |
| OTP | `<OTPField>` (Pass 2) | ต้องวางเลข 6 หลักได้ (SC 3.3.8) |
| เลือกจากรายการปิด | `<Select>` (Pass 2) | พิมพ์เองทำให้ข้อมูลไม่สม่ำเสมอ |

---

## 2 · React API

```tsx
import { TextInput } from '@smego/ui';

<TextInput
  label="เลขทะเบียนนิติบุคคล"
  description="ตัวเลข 13 หลักจากหนังสือรับรอง DBD"
  placeholder="0105561234567"
  value={taxId}
  onChange={setTaxId}
  status={{ type: 'error', message: error }}
/>
```

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `label` | `string` | — | **บังคับ** · อยู่เหนือ input เสมอ |
| `isLabelHidden` | `boolean` | `false` | ซ่อนจากสายตา ยังอยู่ให้ SR |
| `description` | `string` | — | บอกรูปแบบ **ก่อน** ผู้ใช้กรอกผิด |
| `status` | `InputStatus` | — | `{ type: 'error' \| 'warning' \| 'success', message?: string }` |
| `isOptional` | `boolean` | `false` | แสดง "(ไม่บังคับ)" ต่อท้าย label |
| `size` | `'md' \| 'lg'` | `'md'` | 46px / 54px |
| `placeholder` | `string` | — | **ไม่ใช่ที่แทน label** |
| `startIcon` | `ReactNode` | — | เช่นไอคอนค้นหา |
| `isLoading` | `boolean` | `false` | กำลังตรวจค่าเบื้องหลัง — **ไม่ปิดการพิมพ์** |
| `hasClear` | `boolean` | `false` | ปุ่มล้างค่า คืน focus ที่ input |
| `value` / `defaultValue` | `string` | — | จาก RAC |
| `onChange` | `(value: string) => void` | — | **กันระหว่าง IME composition แล้ว** |
| `isDisabled` / `isReadOnly` / `isRequired` | `boolean` | `false` | จาก RAC |

### ★ `status` มีสามระดับ ไม่ใช่แค่ error

`error` เท่านั้นที่ตั้ง `aria-invalid` และกันการส่งฟอร์ม `warning` กับ `success` เป็นข้อมูลประกอบ — ช่องยัง valid อยู่

การประกาศ `aria-invalid` ทั้งที่ผู้ใช้ส่งฟอร์มได้ จะทำให้ screen reader บอกความจริงคนละอย่างกับที่ตาเห็น จึงต้องแยก

```tsx
// ใกล้หมดเขต — เตือน แต่ไม่กัน
<TextInput label="วันปิดรับสมัคร" status={{ type: 'warning', message: 'เหลืออีก 2 วัน' }} />
```

`validationBehavior` ถูก **ถอดออกจาก type** — ตั้งเป็น `"aria"` ตายตัว เปลี่ยนไม่ได้

### ทางหนีเมื่อ wrapper ไม่พอ

```tsx
import { TextField as RACTextField, Input, Label } from '@smego/ui/primitives';
import { fieldStyles } from '@smego/ui';

<RACTextField validationBehavior="aria" className={fieldStyles.root}>
  <Label className={fieldStyles.label}>เลขนิติบุคคล</Label>
  <Input className={fieldStyles.control({ size: 'md' })} />
</RACTextField>
```

⚠️ ใช้ทางหนีแล้ว **คุณรับผิดชอบเองเรื่อง IME composition** — wrapper ไม่ได้ทำให้

---

## 3 · Variants

| size | padding | ความสูงจริง | ตรงกับ |
|---|---|---|---|
| `md` | `px-3 py-2` | **46px** | `Button size="md"` |
| `lg` | `px-4 py-3` | **54px** | ฟอร์มสำคัญ · หน้ามือถือ |

ความสูงคิดจาก `text-body` (line-height 28px) + padding + border 2px

### ★ ไม่ตั้ง `height` ตายตัว

ความสูงมาจาก **line-height + padding** เพื่อให้ยืดตามเนื้อหาเมื่อผู้ใช้บังคับระยะตัวอักษร (**SC 1.4.12**)

ถ้าตั้ง `h-11` ข้อความจะถูกตัดทันทีที่ผู้ใช้เพิ่ม `line-height` ผ่าน user stylesheet

### ★ `startIcon` ทำให้ขอบเขตย้ายไปที่กล่องนอก

เมื่อมี `startIcon` ตัว `<Input>` จริงถูกถอดขอบออก (`border-0 bg-transparent p-0 outline-none`) และกล่องนอกเป็นขอบเขตแทน

จึงต้องใช้ **`focus-within:border-edge-brand`** ไม่ใช่ `focus:` — ผู้ใช้คีย์บอร์ดต้องเห็นว่ากล่องทั้งกล่องกำลังถูก focus

---

## 4 · States

| state | `data-*` จาก RAC | สิ่งที่เปลี่ยน |
|---|---|---|
| default | — | `border-edge-strong` |
| hover | `data-hovered` | `border-fg-muted` |
| focus | `:focus` / `:focus-within` | `border-edge-brand` + วงแหวน 2 ชั้น |
| **invalid** | `data-invalid` | `border-edge-danger` + ข้อความ error |
| disabled | `data-disabled` | `bg-sunken` · `text-fg-disabled` · `cursor-not-allowed` |
| readonly | `data-readonly` | ขอบคงเดิม · ยัง focus ได้ · คัดลอกได้ |

### ★★ Thai IME — ห้าม validate กลาง composition

ผู้ใช้ไทยพิมพ์ผ่าน input method ที่ประกอบหลาย code point เป็นหนึ่งตัว:

```
ที่  =  ท  +  ี  +  ่
```

ระหว่างประกอบ `onChange` ยิงหลายครั้งด้วยค่าที่ยังไม่สมบูรณ์ ถ้าตรวจทันทีทุก keystroke ผู้ใช้จะเห็น **error กระพริบขึ้นระหว่างพิมพ์คำที่ถูกต้อง**

ซึ่งบั่นทอนความมั่นใจในระบบ และขัดหลัก **"ความน่าเชื่อถือมาก่อนความสวยงาม"** ในข้อ 01 โดยตรง

component จัดการให้แล้ว:

```tsx
const [isComposing, setComposing] = useState(false);

onCompositionStart={() => setComposing(true)}
onCompositionEnd={() => setComposing(false)}
onChange={(e) => { if (!isComposing) onChange?.(e.target.value); }}
```

⚠️ **ปัญหานี้ไม่ปรากฏเลยเมื่อทดสอบด้วยภาษาอังกฤษ** — การทดสอบต้องพิมพ์ภาษาไทยจริง

ชั้น form ยังใช้ `mode: 'onBlur'` ของ react-hook-form (ข้อ 25) ซึ่งเลี่ยงปัญหานี้ได้อีกชั้น

### ★ ข้อความ error ตามสูตร อะไรผิด → ทำไม → แก้อย่างไร (SC 3.3.3)

```
❌ "ไม่ถูกต้อง"
❌ "Invalid tax ID"
✅ "เลขนิติบุคคลไม่ถูกต้อง — ต้องเป็นตัวเลข 13 หลัก ตรวจสอบได้จากหนังสือรับรองนิติบุคคล"
```

---

## 5 · Accessibility

| เรื่อง | ข้อกำหนด |
|---|---|
| `validationBehavior` | **`"aria"` ตายตัว** — ดูด้านล่าง |
| **SC 1.4.11** | ขอบ `edge-strong` = **4.20:1** ✅ |
| **SC 1.4.3** | placeholder `fg-muted` = **6.05:1** ✅ · error `danger-icon` = **5.97:1** ✅ |
| **SC 1.4.12** | ไม่ตั้ง height — ยืดตามระยะตัวอักษร |
| **SC 3.3.1** | error มีข้อความ ไม่ใช่แค่ขอบแดง |
| **SC 3.3.2** | `label` บังคับ · `description` บอกรูปแบบล่วงหน้า |
| **SC 3.3.3** | error บอกวิธีแก้ |
| **SC 1.3.5** | ใส่ `autoComplete` เองตามความหมายของช่อง |
| **SC 2.4.6** | `label` ต้องบอกว่าต้องกรอกอะไร ไม่ใช่ "ช่อง 1" |

### ★★ `validationBehavior="aria"` — ห้าม `"native"` (ข้อ 25)

โหมด `native` ใช้ constraint validation ของ browser ซึ่งแสดง **tooltip ของ browser เอง**:
- **style ไม่ได้**
- **ขึ้นภาษาตาม OS ไม่ใช่ภาษาไทย** — ผู้ใช้ที่ตั้งเครื่องเป็นอังกฤษจะเห็น "Please fill out this field" กลางฟอร์มไทย
- หายเองหลังไม่กี่วินาที ผู้ใช้ที่อ่านช้าอ่านไม่ทัน

สำหรับแพลตฟอร์มภาษาไทย **มีทางเลือกเดียว**

### ★★ ขอบต้องเป็น `border-edge-strong` (SC 1.4.11)

ขอบ input คือ **ขอบเขตของ UI component** ต้องผ่าน 3:1

`neutral-300` ที่ **1.56:1** ใช้ไม่ได้ — เป็นความผิดพลาดที่ระบบส่วนใหญ่พลาดแบบเงียบ ๆ เพราะมันดู "นุ่มพอดี"

### ★ label อยู่ **เหนือ** input ทุก breakpoint (ข้อ 08 §7)

ไม่ใช่แค่บนมือถือ เพราะ:
- label ไทยยาว — "เลขทะเบียนนิติบุคคล 13 หลัก"
- การวางข้างจะบีบ input ให้แคบลงอย่างคาดเดาไม่ได้

### ★ RAC ต่อ `aria-describedby` ให้เอง — wrapper ห้ามกลืน

`<Text slot="description">` และ `<FieldError>` ถูกเชื่อมกับ input ด้วย `aria-describedby` โดย RAC

wrapper ใช้ slot ของ RAC ตรง ๆ **ไม่สร้าง id เอง** เพราะการสร้างเองจะทับของ RAC และทำให้ผู้ใช้ screen reader ไม่ได้ยินคำอธิบาย

---

## 6 · Tailwind implementation

```ts
const fieldStyles = {
  root:  'grid min-w-0 gap-2',
  label: 'text-label text-fg-secondary',

  control: cva(
    [
      'w-full min-w-0',
      'rounded-(--radius-control)',
      'border',
      'bg-surface text-fg',
      'text-body',
      'placeholder:text-fg-muted',          /* 6.05:1 ไม่ใช่ fg-disabled 2.53:1 */
      'transition-colors duration-fast ease-standard',
      'border-edge-strong',                 /* 4.20:1 — SC 1.4.11 */
      'data-hovered:border-fg-muted',
      'data-invalid:border-edge-danger',
      'data-disabled:bg-sunken data-disabled:text-fg-disabled',
      'data-disabled:border-edge data-disabled:cursor-not-allowed',
      /* ⚠️ ไม่ตั้ง height — SC 1.4.12 */
    ],
    {
      variants: {
        size: {
          md: 'px-3 py-2',   /* 28 + 16 + 2 = 46px */
          lg: 'px-4 py-3',   /* 28 + 24 + 2 = 54px */
        },
      },
      defaultVariants: { size: 'md' },
    },
  ),

  description: 'text-caption text-fg-muted',
  error:       'text-caption text-danger-icon',   /* red-600 = 5.97:1 */
};
```

[`TextArea`](./TextArea.md) ใช้ `fieldStyles` ชุดเดียวกันนี้ แล้วเพิ่ม `resize-y`

---

## 7 · Figma Variant

Component set **`TextInput`**

| Property | Values |
|---|---|
| `Size` | `MD (46)` · `LG (54)` |
| `State` | `Default` · `Hover` · **`Focus`** · `Invalid` · `Disabled` · `Read-only` |
| `Description` | `True` · `False` |
| `Error` | `True` · `False` |
| `Prefix` | `None` · `Icon` |

**ข้อความในตัวอย่างต้องเป็นภาษาไทยจริง** — label อังกฤษสั้นกว่า 20–40% ทำให้ layout ที่ดูพอดีใน Figma ล้นตอน implement

**`Invalid` variant ต้องมีข้อความ error จริง 2 บรรทัด** ไม่ใช่ "Error message" บรรทัดเดียว เพราะข้อความตามสูตร SC 3.3.3 ยาวกว่าที่นักออกแบบคาด

---

## 8 · Usage

```tsx
<TextInput
  label="เลขทะเบียนนิติบุคคล"
  description="ตัวเลข 13 หลักจากหนังสือรับรอง DBD"
  placeholder="0105561234567"
  isRequired
  autoComplete="off"
  inputMode="numeric"
  value={taxId}
  onChange={setTaxId}
  status={
    taxId.length > 0 && taxId.length !== 13
      ? {
          type: 'error',
          message:
            'เลขนิติบุคคลไม่ถูกต้อง — ต้องเป็นตัวเลข 13 หลัก ตรวจสอบได้จากหนังสือรับรองนิติบุคคล',
        }
      : undefined
  }
/>
```

```tsx
// ช่องค้นหาพร้อมไอคอนนำ
<TextInput
  label="ค้นหา"
  placeholder="ค้นหาสินค้า บริการ หรือโครงการ"
  startIcon={<Icon name="search" size={20} />}
/>
```


---

## 9 · Anti-patterns

| ❌ | ✅ | ทำไม |
|---|---|---|
| `validationBehavior="native"` | `"aria"` (บังคับแล้ว) | tooltip ของ browser style ไม่ได้ ขึ้นภาษาตาม OS |
| validate ทุก keystroke | `onBlur` + กัน composition | error กระพริบระหว่างพิมพ์ "ที่" |
| ทดสอบด้วยภาษาอังกฤษอย่างเดียว | พิมพ์ภาษาไทยจริง | ปัญหา IME ไม่ปรากฏเลยในภาษาอังกฤษ |
| `placeholder` แทน `label` | ทั้งคู่ | placeholder หายตอนพิมพ์ = ผู้ใช้ลืมว่ากรอกอะไรอยู่ |
| `border-neutral-300` | `border-edge-strong` | 1.56:1 — ไม่ผ่าน SC 1.4.11 |
| `placeholder:text-fg-disabled` | `text-fg-muted` | 2.53:1 อ่านไม่ออก |
| `className="h-11"` | ปล่อยตาม padding | ตัดข้อความเมื่อผู้ใช้เพิ่ม line-height (SC 1.4.12) |
| `status={{type:'error',message:'ไม่ถูกต้อง'}}` | สูตร อะไรผิด→ทำไม→แก้อย่างไร | ไม่ผ่าน SC 3.3.3 |
| ขอบแดงอย่างเดียว | ขอบแดง + ข้อความ | สีเดียวไม่พอ (SC 1.4.1 · 3.3.1) |
| label อยู่ข้างซ้าย input | เหนือ input | label ไทยยาว บีบ input แคบลงคาดเดาไม่ได้ |
| สร้าง `aria-describedby` เอง | ใช้ `slot` ของ RAC | ทับของ RAC = ผู้ใช้ไม่ได้ยินคำอธิบาย |
| `resize` (ทั้งสองแกน) | `resize-y` | ยืดแนวนอนทำให้ layout พังที่ 320px |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง ไม่มีแถวไหนอธิบายพฤติกรรมซ้ำ (นั่นคืองานของ §4 และ §5)

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · axe ผ่านใน `a11y/primitives.test.tsx` ทั้ง `TextInput` และ `TextArea` · `e2e/wcag22.spec.ts:107` วางเลข 13 หลักได้ครบ (SC 3.3.8) |
| ตอบสนอง (Responsive) | ✅ | `min-w-0` · `SC 1.4.12` ไม่ตั้งความสูงตายตัว ช่องยืดตามเมื่อผู้ใช้บังคับระยะตัวอักษร |
| โหมดมืด (Dark Mode) | ✅ | `lint-classes.mjs` 0 จุด — ทุกสีมาจาก token ที่ override ในโหมดมืดแล้ว |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | `lint-quality.mjs` 0 จุด — ไม่มี `ml-`/`pl-`/`left-` ในไฟล์นี้ |
| คีย์บอร์ด (Keyboard) | ✅ | §4 `focus` และ `readonly` แยกจาก `disabled` · `e2e/wcag22.spec.ts:137` ไม่มี component ไหนบล็อกการวาง |
| กำลังโหลด (Loading) | — | การส่งฟอร์มเป็นของปุ่ม — ระหว่างรอให้ใช้ [`<Button isLoading>`](./Button.md) ไม่ใช่ปิดช่องกรอก |
| ข้อผิดพลาด (Error) | ✅ | §4 `invalid` · `status.message` เป็นข้อความที่บอกวิธีแก้ (SC 3.3.1 · 3.3.3) |
| ว่างเปล่า (Empty) | — | ช่องว่าง = ยังไม่กรอก ซึ่งเป็นสถานะปกติของฟอร์ม ไม่ใช่ empty state ที่ต้องออกแบบ |
| Skeleton | — | ช่องกรอกต้องกดได้ทันทีที่เห็น · แถบสีเทาแทนที่จะทำให้ผู้ใช้รอทั้งที่พิมพ์ได้แล้ว |
| การเคลื่อนไหว (Animation) | ✅ | `base.css §10` ครอบ `*` ด้วย `!important` — ไม่มีการเคลื่อนไหวที่หลุดตัวกัน (`lint-quality.mjs` 0 จุด) |
| ประสิทธิภาพ (Performance) | ✅ | animate เฉพาะสี · ไม่มีความสูงตายตัว |
