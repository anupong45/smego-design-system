# DatePicker

**`@smego/ui`** · ชั้น 03 · [DatePicker.tsx](./DatePicker.tsx)

---

## 1 · ภาพรวม

ช่องเลือกวันที่แบบ **พ.ศ.** — พิมพ์ได้ตรง ๆ หรือเปิดปฏิทิน

**นี่คือเหตุผลที่ระบบเลือก React Aria แทน Radix** (ข้อ 21) — `BuddhistCalendar` จาก `@internationalized/date` ทำให้ พ.ศ. ได้มาฟรี ทั้งการแสดงผล การพิมพ์ และการนำทางในปฏิทิน

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน | เหตุผล |
|---|---|---|
| ช่วงวันที่ | `<DateRangePicker>` | สองช่องแยกกันทำให้เลือกช่วงผิดลำดับได้ |
| เดือน/ปี อย่างเดียว | `<Selector>` สองช่อง | ปฏิทินรายวันสื่อว่าต้องเลือกวัน |
| เวลา | `<TimeField>` | |
| แสดงวันที่อย่างเดียว | `<DeadlineText>` | นี่คือช่องกรอก ไม่ใช่การแสดงผล |

---

## 2 · React API

```tsx
import { DatePicker } from '@smego/ui';
import { CalendarDate } from '@internationalized/date';

<DatePicker
  label="วันที่จดทะเบียนนิติบุคคล"
  description="ระบุตามหนังสือรับรอง DBD"
  value={date}
  onChange={setDate}
/>
```

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `label` | `string` | — | **บังคับ** |
| `description` | `string` | — | |
| `errorMessage` | `string` | — | มีค่า = invalid |
| `showOptional` | `boolean` | `false` | |
| `value` / `defaultValue` | `DateValue` | — | จาก RAC |
| `onChange` | `(v: DateValue \| null) => void` | — | |
| `minValue` / `maxValue` | `DateValue` | — | จำกัดช่วง |
| `isDisabled` / `isReadOnly` / `isRequired` | `boolean` | `false` | |

`validationBehavior` และ `createCalendar` ถูก **ถอดออกจาก type** — ตั้งไว้ตายตัว

---

## 3 · Variants

ไม่มี variant — วันที่มีรูปแบบเดียว

| ส่วน | ค่า |
|---|---|
| กล่อง | `fieldStyles.control({ size: 'md' })` = **46px** ตรงกับ TextField |
| segment ที่ focus | `bg-primary-600` · `text-on-brand` |
| segment ที่ยังไม่กรอก | `text-fg-muted` (6.05:1) |
| ช่องในปฏิทิน | **36×36** |
| วันที่เลือก | `bg-primary-600` · `text-on-brand` |
| วันนี้ | **ขอบ** `border-edge-brand` |

### ★★★ `createCalendar` บังคับ `BuddhistCalendar` — ไม่รับ override

```tsx
function createBuddhistCalendar() {
  return new BuddhistCalendar();
}
```

ถ้าปล่อยให้ `I18nProvider` ตัดสินเอง จะได้ปฏิทินตาม locale string ซึ่งเราตั้งเป็น `th-TH-u-ca-buddhist` อยู่แล้ว **แต่**พึ่งค่าเริ่มต้นของ CLDR ไม่ได้

⚠️ **ห้ามส่ง `createCalendar` ที่คืน Gregorian มาทับ** — ผู้ใช้ไทยจะเห็น ค.ศ. ในบริบทเอกสารราชการซึ่งอ่านผิดทันที

### ★ วันนี้ต่างด้วย **ขอบ** ไม่ใช่แค่สี (SC 1.4.1)

`data-[today]:border data-[today]:border-edge-brand` — ถ้าใช้พื้นอ่อน ๆ อย่างเดียว วันนี้กับวันที่เลือกจะแยกไม่ออกสำหรับผู้ใช้ที่แยกสีไม่ได้

---

## 4 · States

| state | `data-*` | สิ่งที่เปลี่ยน |
|---|---|---|
| default | — | `border-edge-strong` |
| focus-within | `:focus-within` | `border-edge-brand` |
| segment focused | `data-focused` | พื้น `primary-600` |
| placeholder | `data-placeholder` | `text-fg-muted` |
| invalid | `data-invalid` | `border-edge-danger` + ข้อความ |
| disabled | `data-disabled` | `text-fg-disabled` |

### ★★ segment แยก focus ได้ — พิมพ์ `26/07/2569` ได้ตรง ๆ

สำคัญมาก เพราะการกรอก **วันจดทะเบียน** หรือ **วันเกิด** ด้วยปฏิทินคือการคลิกย้อนหลัง 30+ ครั้ง

แต่ละ segment เป็น `role="spinbutton"` ที่รับลูกศรขึ้น/ลงและตัวเลข

---

## 5 · Accessibility

| เรื่อง | ข้อกำหนด |
|---|---|
| role | `group` + `spinbutton` ต่อ segment · `application` สำหรับ grid ปฏิทิน |
| keyboard | ลูกศรเปลี่ยนค่า · Tab ข้าม segment · Enter เปิดปฏิทิน |
| **SC 1.4.3** | segment ที่ว่าง `fg-muted` = 6.05:1 |
| **SC 1.4.11** | ขอบ `edge-strong` = 4.20:1 |
| **SC 1.4.1** | วันนี้ต่างด้วยขอบ |
| **SC 2.5.8** | ช่องปฏิทิน 36×36 · ปุ่มปฏิทิน 28×28 |
| **SC 3.3.1** | error มีข้อความ |

### ★★★ ผลการวัดในเบราว์เซอร์จริง

| ตรวจ | ผล |
|---|---|
| segment ปี | **`2569`** ไม่ใช่ 2026 ✅ |
| หัวปฏิทิน | **`กรกฎาคม 2569`** ✅ |
| หัวคอลัมน์วัน | `อา จ อ พ พฤ ศ ส` ✅ |
| `aria-label` ของ segment | `วัน,` · `เดือน,` · `ปี,` ✅ |
| ช่องที่เลือก | `rgb(0,119,193)` บนขาว · **36×36** ✅ |
| **ค่าที่ส่ง API** | **`2026-07-26`** — ยังเป็น ค.ศ. ✅ |

### ★★★ ค่าที่เก็บยังเป็น **ค.ศ.** เสมอ

`DateValue` ที่ `onChange` ส่งออกอยู่ในปฏิทินที่ผู้ใช้เห็น (พ.ศ.) แต่ `.toString()` ให้ **ISO ที่เป็น ค.ศ.**

```
แสดง:      26 / 7 / 2569
.toString(): "2026-07-26"
```

**ส่งค่านั้นขึ้น API** — ห้ามส่งเลข 2569 เข้าฐานข้อมูล ไม่งั้นข้อมูลจะคลาด 543 ปีและตรวจไม่เจอจนกว่าจะมีคนคำนวณอายุ

### ★ ปุ่มปฏิทิน 28×28

ไอคอน 20 + `p-1` = 28 — เกิน 24 แต่ไม่ใหญ่จนดันความสูงของช่องเกิน 46px

---

## 6 · Tailwind implementation

```tsx
<DateInput className="flex flex-1 items-center gap-0.5">
  {(segment) => (
    <DateSegment segment={segment} className={cn(
      'rounded-(--radius-xs) px-0.5 tabular-nums',
      'text-body text-fg',
      'outline-none',
      'data-placeholder:text-fg-muted',
      'data-focused:bg-primary-600 data-focused:text-on-brand',
      'data-disabled:text-fg-disabled',
    )} />
  )}
</DateInput>
```

```tsx
<CalendarCell date={date} className={cn(
  'flex size-9 cursor-pointer items-center justify-center',   /* 36×36 */
  'rounded-(--radius-control)',
  'text-body-sm text-fg tabular-nums',
  'transition-colors duration-fast ease-standard',
  'data-hovered:bg-sunken',
  'data-selected:bg-primary-600 data-selected:text-on-brand',
  'data-[today]:border data-[today]:border-edge-brand',        /* ★ รูปทรง */
  'data-disabled:cursor-not-allowed data-disabled:text-fg-disabled',
  'data-outside-month:text-fg-disabled',
)} />
```

`tabular-nums` บนทั้ง segment และช่องปฏิทิน — ตัวเลขต้องไม่ขยับเวลาเปลี่ยนค่า

Popover ใช้ opacity เท่านั้น ไม่มี transform (ข้อ 07)

---

## 7 · Figma Variant

Component set **`DatePicker`**

| Property | Values |
|---|---|
| `State` | `Default` · `Hover` · **`Focus`** · `Invalid` · `Disabled` |
| `Calendar` | `Closed` · **`Open`** |
| `Description` | `True` · `False` |

**ทุกตัวอย่างต้องใช้ปี พ.ศ.** — ถ้ามี 2026 ในไฟล์ออกแบบแม้แต่ที่เดียว จะมีคนคัดลอกไปใส่โค้ด

**`Open` frame ต้องมีชื่อเดือนไทยเต็ม** ("กรกฎาคม" ไม่ใช่ "July") และหัวคอลัมน์ `อา จ อ พ พฤ ศ ส`

**ต้องเขียนใน description ว่าค่าที่ส่ง API เป็น ค.ศ.** — นักพัฒนาที่เห็นแต่ Figma จะคิดว่าเก็บ 2569

---

## 8 · Usage

```tsx
const [date, setDate] = useState<CalendarDate | null>(null);

<DatePicker
  label="วันที่จดทะเบียนนิติบุคคล"
  description="ระบุตามหนังสือรับรอง DBD"
  value={date}
  onChange={setDate}
  maxValue={today(SMEGO_TIMEZONE)}
  errorMessage={
    date && date.compare(today(SMEGO_TIMEZONE)) > 0
      ? 'วันที่จดทะเบียนต้องไม่เกินวันนี้ — ตรวจสอบจากหนังสือรับรองนิติบุคคล'
      : undefined
  }
/>
```

```tsx
// ส่งขึ้น API — ค.ศ. เสมอ
await submit({ registeredAt: date?.toString() });   // "2026-07-26"
```

```tsx
// รับจาก API — parseDate อ่าน ISO (ค.ศ.) แล้วแสดงเป็น พ.ศ. เอง
import { parseDate } from '@internationalized/date';
setDate(parseDate(record.registeredAt));
```

---

## 9 · Anti-patterns

| ❌ | ✅ | ทำไม |
|---|---|---|
| ส่ง `createCalendar` ที่คืน Gregorian | ปล่อยตามค่าตายตัว | ค.ศ. ในเอกสารราชการอ่านผิดทันที |
| เก็บ `2569` ในฐานข้อมูล | `.toString()` = ค.ศ. | ข้อมูลคลาด 543 ปี ตรวจไม่เจอจนคำนวณอายุ |
| เขียนตัวแปลงปี +543 เอง | `BuddhistCalendar` | พังที่ขอบปี 31 ธ.ค. / 1 ม.ค. เสมอ |
| ปฏิทินอย่างเดียว พิมพ์ไม่ได้ | segment พิมพ์ได้ | วันเกิดต้องคลิกย้อนหลัง 30+ ครั้ง |
| วันนี้ต่างแค่พื้นอ่อน | + ขอบ | แยกจากวันที่เลือกไม่ออก (SC 1.4.1) |
| `validationBehavior="native"` | `"aria"` (บังคับแล้ว) | tooltip browser ขึ้นภาษาตาม OS |
| ช่องปฏิทิน 24×24 | 36×36 | ช่องชิดกันมาก กดพลาดง่ายบนมือถือ |
| `type="text"` เขียน `26/07/2569` เอง | `<DatePicker>` | ไม่มี validation ไม่มี keyboard ไม่มี screen reader |
| 2026 ในตัวอย่าง Figma | 2569 | มีคนคัดลอกไปใส่โค้ด |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง ไม่มีแถวไหนอธิบายพฤติกรรมซ้ำ (นั่นคืองานของ §4 และ §5)

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · axe ผ่านใน `a11y/pass2.test.tsx` · เทส "สถานะ invalid มีข้อความ ไม่ใช่แค่ขอบแดง" |
| ตอบสนอง (Responsive) | ✅ | `min-w-0` ที่ช่อง · ปฏิทินเป็น popover จึงไม่ดันความกว้างฟอร์มที่ 320px |
| โหมดมืด (Dark Mode) | ✅ | ปฏิทินใช้ `--elevation-*` · `lint-classes.mjs` 0 จุด — ทุกสีมาจาก token ที่ override ในโหมดมืดแล้ว |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | `lint-quality.mjs` 0 จุด — ไม่มี `ml-`/`pl-`/`left-` ในไฟล์นี้ |
| คีย์บอร์ด (Keyboard) | ✅ | §4 `segment focused` — เลื่อนระหว่าง วัน/เดือน/ปี ด้วยลูกศรซ้าย-ขวา และพิมพ์ทับได้โดยไม่ต้องเปิดปฏิทิน |
| กำลังโหลด (Loading) | — | ปฏิทินคำนวณในเครื่อง ไม่รอเครือข่าย |
| ข้อผิดพลาด (Error) | ✅ | §4 `invalid` · `errorMessage` (SC 3.3.1) · วันที่นอกช่วงบอกเป็นข้อความ |
| ว่างเปล่า (Empty) | ✅ | §4 `placeholder` — ช่องที่ยังไม่เลือกแสดงรูปแบบที่ต้องกรอก ไม่ใช่ช่องเปล่า |
| Skeleton | — | ตารางปฏิทินเป็นโครงคงที่ที่วาดได้ทันที ไม่ต้องรอข้อมูล |
| การเคลื่อนไหว (Animation) | ✅ | `base.css §10` ครอบ `*` ด้วย `!important` — ไม่มีการเคลื่อนไหวที่หลุดตัวกัน (`lint-quality.mjs` 0 จุด) |
| ประสิทธิภาพ (Performance) | ✅ | ปฏิทิน render เฉพาะเดือนที่เปิดอยู่ · ไม่มีความสูงตายตัว |
