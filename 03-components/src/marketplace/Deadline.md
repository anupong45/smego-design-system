# DeadlineBadge · DeadlineText

**`@smego/ui`** · ชั้น 03 · [Deadline.tsx](./Deadline.tsx)

---

## 1 · ภาพรวม

กำหนดปิดรับและสถานะ — ใช้ร่วมกันโดย **ProgramCard · GrantCard · TrainingCard**

แยกออกมาเป็นไฟล์เดียวเพราะการแสดงปี **พ.ศ.** ต้องถูกต้องเหมือนกันทุกที่ ถ้าเขียนซ้ำ 3 ที่จะมีที่หนึ่งลืมและแสดง ค.ศ.

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน | เหตุผล |
|---|---|---|
| วันที่ทั่วไปที่ไม่ใช่กำหนดปิด | `<time>` + `Intl` โดยตรง | ชื่อ component จะทำให้เข้าใจผิด |
| ให้ผู้ใช้เลือกวันที่ | `<DateInput>` (Pass 2) | นี่เป็นการแสดงผลอย่างเดียว |
| นับถอยหลังแบบวินาที | ไม่ทำ | รบกวนและไม่จำเป็นกับกำหนดที่นับเป็นวัน |

---

## 2 · React API

```tsx
import { DeadlineBadge, DeadlineText } from '@smego/ui';

<DeadlineBadge status="closing-soon" daysLeft={5} />
<DeadlineText date="2026-09-30" />   {/* → 30 ก.ย. 2569 */}
```

### DeadlineBadge

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `status` | `'open' \| 'closing-soon' \| 'closed'` | — | **prop ไม่ใช่ค่าที่คำนวณ** — ดู §4 |
| `daysLeft` | `number` | — | แสดงต่อท้ายเมื่อ `closing-soon` |

### DeadlineText

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `date` | `string` | — | ISO `YYYY-MM-DD` — **เป็น ค.ศ.** |
| `format` | `'short' \| 'long'` | `'short'` | `30 ก.ย. 2569` / `30 กันยายน 2569` |

---

## 3 · Variants

| status | Badge variant | ไอคอน (อัตโนมัติ) | ข้อความ |
|---|---|---|---|
| `open` | `success` | `circle-check` (วงกลม) | เปิดรับสมัคร |
| `closing-soon` | `warning` | **`triangle-alert` (สามเหลี่ยม)** | ใกล้ปิดรับ · เหลือ N วัน |
| `closed` | `danger` | `circle-x` (วงกลม + กากบาท) | ปิดรับแล้ว |

### ★ สถานะต้องมี **รูปทรง + ข้อความ** ไม่ใช่แค่สี (SC 1.4.1)

`<Badge>` ผูกไอคอนกับ variant ให้อยู่แล้ว จึงไม่มีทางที่ใครจะใช้สีเขียว/เหลือง/แดงโดยไม่มีรูปทรงกำกับ

สำคัญเป็นพิเศษที่นี่เพราะ **ทอง (hue 36) กับเหลืองเตือน (hue 48) ห่างกันเพียง 1.43:1 ทางความสว่าง**

---

## 4 · States

`DeadlineBadge` และ `DeadlineText` ไม่มี state — เป็นการแสดงผลล้วน

### ★★ `status` เป็น **prop ไม่ใช่ค่าที่คำนวณในนี้**

**สองเหตุผล:**

**1 · SSR hydration** — ถ้าคำนวณจาก `Date.now()` ตอน render ค่าที่ server กับ client ได้อาจต่างกัน (คนละวินาที · คนละ timezone ของเครื่อง) ทำให้ React เตือนและ DOM กระพริบ

**2 · "ใกล้ปิดรับ" คือกฎธุรกิจ ไม่ใช่กฎ UI** — บางโครงการนับ **7 วัน** บางทุนนับ **30 วัน** เพราะเตรียมเอกสารนานกว่า

component ไม่ควรตัดสินแทน · ผู้เรียกรู้ว่าโครงการนี้ใช้เกณฑ์ไหน

---

## 5 · Accessibility

| เรื่อง | ข้อกำหนด |
|---|---|
| **SC 1.4.1** | สถานะมีรูปทรงจาก `<Badge>` |
| **SC 1.3.1** | `<time dateTime>` ให้ค่าที่เครื่องอ่านได้ |
| **SC 3.1.2** | ข้อความไทยทั้งหมด |

### ★★ วันที่ต้องเป็น **พ.ศ.** — 2569 ไม่ใช่ 2026

`th-TH` resolve เป็น calendar `buddhist` อยู่แล้ว — **ตรวจในเบราว์เซอร์จริง:**

```js
new Intl.DateTimeFormat('th-TH').format(new Date())
// → "25 กรกฎาคม 2569"
```

ระบบยังระบุ `th-TH-u-ca-buddhist` ให้ชัดเจนเพื่อไม่ต้องพึ่งค่าเริ่มต้นของ CLDR ที่อาจเปลี่ยน

⚠️ **ห้ามใช้ `th-TH-u-ca-gregory`** — จะได้ ค.ศ. ซึ่งผู้ใช้ไทยอ่านผิดทันทีในบริบทเอกสารราชการ

### ★★ `<time dateTime>` เก็บ ISO (ค.ศ.) · ข้อความแสดง พ.ศ.

**ต้องมีทั้งสองอย่าง:**

```html
<time datetime="2026-09-30">30 ก.ย. 2569</time>
```

ถ้าเก็บ พ.ศ. ใน `dateTime` จะ **ผิดมาตรฐาน HTML** และเครื่องมืออื่น (ปฏิทิน · ตัวช่วยอ่าน · crawler) จะอ่านผิดไป **543 ปี**

**ยืนยันจากการวัด:**

| แสดงผล | `dateTime` |
|---|---|
| 31 ธ.ค. 2569 | `2026-12-31` |
| 30 ก.ย. 2569 | `2026-09-30` |
| 15 ส.ค. 2569 | `2026-08-15` |

### ★ timezone ต้องเป็น `Asia/Bangkok` เสมอ

วันที่แปลงด้วย `new Date('2026-09-30T00:00:00+07:00')` และ format ด้วย `timeZone: 'Asia/Bangkok'`

ถ้าไม่ระบุ ผู้ใช้ที่เครื่องตั้ง timezone อื่น (คนไทยในต่างประเทศที่ดูโครงการรัฐ) จะเห็นวันคลาดไป 1 วัน — ซึ่งกับ **กำหนดปิดรับ** คือความต่างระหว่างทันกับไม่ทัน

---

## 6 · Tailwind implementation

```tsx
const VARIANT_FOR_STATUS = {
  open: 'success',
  'closing-soon': 'warning',
  closed: 'danger',
} as const;
```

```tsx
const formatted = new Intl.DateTimeFormat(locale, {
  day: 'numeric',
  month: format === 'long' ? 'long' : 'short',
  year: 'numeric',
  timeZone: 'Asia/Bangkok',
}).format(new Date(`${date}T00:00:00+07:00`));

<time dateTime={date} className="font-numeric">{formatted}</time>
```

`font-numeric` (tabular-nums) ทำให้วันที่ในกริดตรงแนวกัน — วันที่ 1 หลักกับ 2 หลักไม่ทำให้บรรทัดขยับ

---

## 7 · Figma Variant

Component set **`DeadlineBadge`**

| Property | Values |
|---|---|
| `Status` | `Open` · `Closing soon` · `Closed` |
| `Days left` | `True` · `False` |

**ทุกตัวอย่างวันที่ใน Figma ต้องเป็น พ.ศ.** — ถ้าใช้ 2026 ในไฟล์ออกแบบ จะมีคนคัดลอกไปใส่ในโค้ด

`DeadlineText` **ไม่เป็น component** — เป็น text style ที่ผูกกับ `font-numeric`

---

## 8 · Usage

```tsx
// ในการ์ด — status มาจาก API ที่คำนวณตามกฎของแต่ละโครงการ
<DeadlineBadge status={program.status} daysLeft={program.daysLeft} />
```

```tsx
// วันที่ในบรรทัด meta
<EntityMeta items={[
  { label: s.card.deadline, value: <DeadlineText date="2026-09-30" /> },
]} />
```

```tsx
// ช่วงวันอบรม
<span className="flex flex-wrap items-baseline gap-x-1">
  <DeadlineText date={startDate} />
  <span aria-hidden="true">–</span>
  <DeadlineText date={endDate} />
</span>
```

```tsx
// หน้ารายละเอียด — เดือนเต็ม
<DeadlineText date="2026-12-31" format="long" />   {/* 31 ธันวาคม 2569 */}
```

---

## 9 · Anti-patterns

| ❌ | ✅ | ทำไม |
|---|---|---|
| คำนวณ `status` จาก `Date.now()` ใน component | รับเป็น prop | SSR hydration mismatch + "ใกล้ปิด" คือกฎธุรกิจ |
| `<time dateTime="2569-09-30">` | `dateTime="2026-09-30"` | ผิดมาตรฐาน HTML — เครื่องอ่านคลาด 543 ปี |
| `th-TH-u-ca-gregory` | `th-TH-u-ca-buddhist` | ได้ ค.ศ. ในบริบทเอกสารราชการ |
| ไม่ระบุ `timeZone` | `'Asia/Bangkok'` | ผู้ใช้ต่างประเทศเห็นกำหนดคลาด 1 วัน |
| แถบสีอย่างเดียวบอกสถานะ | `<DeadlineBadge>` | ทองกับเหลืองห่าง 1.43:1 (SC 1.4.1) |
| นับถอยหลังเป็นวินาที | "เหลือ N วัน" | รบกวนและกระตุ้น `aria-live` ถี่เกินไป |
| เขียน `Intl.DateTimeFormat` ซ้ำในแต่ละ card | `<DeadlineText>` | 3 ที่ = มีที่หนึ่งลืมใส่ปฏิทินพุทธ |
| เลขไทย ๐–๙ ในวันที่ | เลขอารบิก | กว้างต่างกัน 36.6% em — บรรทัดขยับ |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง ไม่มีแถวไหนอธิบายพฤติกรรมซ้ำ (นั่นคืองานของ §4 และ §5)

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ⚠️ | §5 · **ไม่มีเทสที่ render `<DeadlineBadge>`/`<DeadlineText>` ตรง ๆ** — ครอบคลุมผ่าน 5 ตัวที่ใช้งาน (`GrantCard` · `ProgramCard` · `FundingCard` · `TrainingCard` · `OrderTimeline`) ซึ่ง axe ผ่านทั้งหมด และเทส "วันที่แสดงเป็น พ.ศ. แต่ `dateTime` เก็บ ค.ศ." วัด `DeadlineText` ผ่าน `GrantCard` · **หนี้:** ยังไม่มีเทสของตัวเอง |
| ตอบสนอง (Responsive) | ✅ | ป้ายและข้อความสั้นพอที่จะอยู่ในกล่อง **136px** ได้ — ยืนยันผ่าน `e2e/pass4.spec.ts:17` ซึ่ง render `FundingCard` ที่มี `DeadlineBadge` อยู่ |
| โหมดมืด (Dark Mode) | ✅ | `lint-classes.mjs` 0 จุด — ทุกสีมาจาก token ที่ override ในโหมดมืดแล้ว |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | `lint-quality.mjs` 0 จุด — ไม่มี `ml-`/`pl-`/`left-` ในไฟล์นี้ |
| คีย์บอร์ด (Keyboard) | — | ป้ายและข้อความวันที่เป็นของอ่านอย่างเดียว ไม่อยู่ใน tab order |
| กำลังโหลด (Loading) | — | วันที่มาพร้อมข้อมูลของการ์ด |
| ข้อผิดพลาด (Error) | — | §1 `status` เป็น **prop ไม่ใช่ค่าที่คำนวณ** — component ไม่มีทางคำนวณผิดเพราะไม่ได้คำนวณเลย |
| ว่างเปล่า (Empty) | — | ไม่มี `deadline` = ผู้เรียกไม่ render แถวนั้น (ยืนยันด้วยเทส "สินเชื่อที่เปิดตลอดไม่แสดงแถวปิดรับสมัคร" ใน `a11y/pass4.test.tsx`) |
| Skeleton | — | ข้อความสั้นบรรทัดเดียว |
| การเคลื่อนไหว (Animation) | — | ไม่มี `transition` หรือ `animate` ในไฟล์นี้เลย — ป้าย "ใกล้ปิดรับ" **ห้ามกระพริบ** เพราะ `SC 2.2.2` และเพราะความเร่งด่วนต้องมาจากข้อความ ไม่ใช่จากการเคลื่อนไหว |
| ประสิทธิภาพ (Performance) | ✅ | `SC 1.4.1` สถานะทั้ง 3 (`open`/`closing-soon`/`closed`) ต่างกันที่**ข้อความ** ไม่ใช่แค่สี · ไม่มี timer ที่เดินอยู่เบื้องหลัง |
