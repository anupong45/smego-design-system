# TrainingCard

**`@smego/ui`** · ชั้น 03 · [TrainingCard.tsx](./TrainingCard.tsx) · ฐาน: [EntityCard.md](./EntityCard.md)

---

## 1 · ภาพรวม

การ์ดหลักสูตรอบรม — อบรมของรัฐ · หลักสูตรสถาบัน · สัมมนา · workshop

ความต่างหลัก: มี **กำหนดการ (ช่วงวัน)** · **รูปแบบการอบรม** · **ที่นั่งคงเหลือ** ซึ่งไม่มีในการ์ดอื่น

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน |
|---|---|
| ที่ปรึกษาแบบตัวต่อตัว | `<ServiceCard>` |
| โครงการที่มีอบรมเป็นส่วนหนึ่ง | `<ProgramCard>` |
| ทุนเรียนต่อ | `<GrantCard>` |

---

## 2 · React API

```tsx
<TrainingCard
  as="li"
  href="/training/accounting-basics"
  name="การทำบัญชีและภาษีสำหรับผู้ประกอบการรายใหม่"
  organizer="สถาบันพัฒนาวิสาหกิจขนาดกลางและขนาดย่อม"
  format="hybrid"
  startDate="2026-08-15"
  endDate="2026-08-16"
  isFree
  seatsLeft={3}
  seatsLow
/>
```

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `href` · `name` · `organizer` | `string` | — | **บังคับ** |
| `format` | `'onsite' \| 'online' \| 'hybrid'` | — | **บังคับ** |
| `startDate` | `string` | — | ISO `YYYY-MM-DD` |
| `endDate` | `string` | — | ไม่ต้องส่งเมื่ออบรมวันเดียว |
| `fee` | `number` | — | ไม่ต้องส่งเมื่อ `isFree` |
| `isFree` | `boolean` | `false` | **แยกจาก `fee === 0`** |
| `seatsLeft` | `number` | — | `0` = เต็ม |
| `seatsLow` | `boolean` | `false` | **กฎธุรกิจ ผู้เรียกตัดสิน** |

---

## 3 · Variants

| ข้อมูล | ผลที่เห็น |
|---|---|
| `seatsLeft === 0` | Badge `danger` "ที่นั่งเต็ม" |
| `seatsLow` | Badge `warning` "เหลือ N ที่นั่ง" + **สามเหลี่ยม** |
| ที่นั่งปกติ | Badge `success` "เหลือ N ที่นั่ง" |
| `format` | Badge `neutral` เป็น **ข้อความ** |
| `isFree` | ช่องเงินแสดง "ไม่มีค่าใช้จ่าย" |

### ★★ **"ไม่มีค่าใช้จ่าย" ต้องเป็นคำ ไม่ใช่เลข 0**

"0 บาท" อ่านแล้วสะดุด และในบริบทราชการอาจถูกตีความว่า **ข้อมูลยังไม่กรอก**

`isFree` จึงเป็น prop แยก **ไม่ใช่ `fee === 0`** — ทำให้ความตั้งใจชัดในโค้ดด้วย

### ★★ ที่นั่งเหลือเป็น **สถานะ ไม่ใช่ตัวเลขเฉย ๆ**

หลักสูตรฟรีของรัฐ **เต็มเร็วมาก** ผู้ใช้ที่เห็น "เหลือ 3 ที่นั่ง" ตัดสินใจต่างจาก "เหลือ 80 ที่นั่ง" อย่างสิ้นเชิง

เกณฑ์ "เหลือน้อย" เป็น **กฎธุรกิจ** จึงให้ผู้เรียกส่ง `seatsLow` มาเอง — หลักสูตร 20 ที่นั่งกับ 500 ที่นั่งมีเกณฑ์ไม่เหมือนกัน

เหตุผลเดียวกับ `status` ใน [`Deadline.tsx`](./Deadline.md)

---

## 4 · States

สืบทอดจาก `EntityCard`

### ★ การ์ดที่นั่งเต็มยังกดได้

ผู้ใช้ต้องดูเนื้อหาหลักสูตรเพื่อรอรอบหน้า หรือกดเข้าคิวสำรอง — การปิดกั้นไม่ช่วยใคร

---

## 5 · Accessibility

| เรื่อง | ข้อกำหนด |
|---|---|
| **SC 1.4.1** | ที่นั่งและรูปแบบมีข้อความ ไม่พึ่งสี |
| **SC 1.3.1** | ผู้จัดและกำหนดการอยู่ใน `<dl>` |
| วันที่ | **พ.ศ.** — วัดแล้ว `15 ส.ค. 2569` / `dateTime="2026-08-15"` |

### ★★ รูปแบบการอบรมต้องเป็น **ข้อความ** ไม่ใช่ไอคอน (ข้อ 09)

ผู้ใช้กลุ่มหลักคือ **เจ้าของกิจการอายุ 40–60 ปีที่ไม่คุ้นเคยดิจิทัล** — ไม่มีคลังสัญลักษณ์สำหรับ "hybrid"

ไอคอนจอ/อาคาร/คนสองคนที่ระบบอื่นใช้ต้องอาศัยการเรียนรู้ ซึ่งการ์ดในกริดไม่มีที่ให้อธิบาย

จึงใช้คำเต็ม: **"อบรมที่สถานที่" · "อบรมออนไลน์" · "อบรมแบบผสม"**

### ★ ช่วงวันใช้ `–` ที่มี `aria-hidden`

```tsx
<DeadlineText date={startDate} />
<span aria-hidden="true">–</span>
<DeadlineText date={endDate} />
```

เครื่องหมายขีดถูกซ่อนจาก screen reader เพราะบางตัวอ่านว่า "ลบ" — ผู้ใช้ได้ยิน "15 ส.ค. 2569, 16 ส.ค. 2569" ซึ่งเข้าใจได้จากบริบท label "กำหนดการ"

---

## 6 · Tailwind implementation

```tsx
const formatLabel = {
  onsite: s.card.formatOnsite,
  online: s.card.formatOnline,
  hybrid: s.card.formatHybrid,
}[format];

eyebrow={
  <>
    {isFull ? (
      <Badge variant="danger">{s.card.seatsFull}</Badge>
    ) : seatsLeft !== undefined ? (
      <Badge variant={seatsLow ? 'warning' : 'success'}>{s.card.seatsLeft(seatsLeft)}</Badge>
    ) : null}
    <Badge variant="neutral" showIcon={false}>{formatLabel}</Badge>
  </>
}
amount={
  <EntityAmount
    label={s.card.fee}
    value={isFree ? null : (fee ?? null)}
    note={isFree ? s.card.free : fee === undefined ? s.card.requestQuote : undefined}
  />
}
```

---

## 7 · Figma Variant

Component **`TrainingCard`**

| Property | Values |
|---|---|
| `Format` | `Onsite` · `Online` · `Hybrid` |
| `Seats` | `Available` · `Low` · **`Full`** |
| `Fee` | `Amount` · **`Free`** |
| `Duration` | `Single day` · `Range` |

**`Free` frame ต้องแสดงคำว่า "ไม่มีค่าใช้จ่าย" ไม่ใช่ "0 บาท"**

**`Format` ต้องเป็นข้อความในทุก frame** — ถ้านักออกแบบใส่ไอคอน นักพัฒนาจะต้องหาไอคอนที่ไม่มีในระบบ

---

## 8 · Usage

```tsx
// อบรมฟรี ที่นั่งเหลือน้อย
<TrainingCard as="li" href="/training/tax-basics"
  name="การทำบัญชีและภาษีสำหรับผู้ประกอบการรายใหม่"
  organizer="สถาบันพัฒนาวิสาหกิจขนาดกลางและขนาดย่อม"
  format="hybrid" startDate="2026-08-15" endDate="2026-08-16"
  isFree seatsLeft={3} seatsLow
  footer={<Button size="sm" fullWidth>ลงทะเบียน</Button>} />
```

```tsx
// มีค่าลงทะเบียน · ที่นั่งเต็ม · วันเดียว
<TrainingCard as="li" href="/training/export-strategy"
  name="กลยุทธ์การส่งออกสินค้าเกษตรแปรรูป"
  organizer="กรมส่งเสริมการค้าระหว่างประเทศ"
  format="online" startDate="2026-10-05" fee={3_500} seatsLeft={0}
  footer={<Button size="sm" variant="secondary" fullWidth>แจ้งเตือนรอบถัดไป</Button>} />
```

```tsx
// เกณฑ์ "เหลือน้อย" ตัดสินที่ฝั่งข้อมูล ไม่ใช่ในการ์ด
const seatsLow = course.seatsLeft / course.seatsTotal < 0.2;
```

---

## 9 · Anti-patterns

| ❌ | ✅ | ทำไม |
|---|---|---|
| `fee={0}` สำหรับหลักสูตรฟรี | `isFree` | "0 บาท" อ่านว่าข้อมูลยังไม่กรอก |
| คำนวณ `seatsLow` ในการ์ด | รับเป็น prop | 20 ที่นั่งกับ 500 ที่นั่งมีเกณฑ์ต่างกัน |
| ไอคอนแทนรูปแบบการอบรม | ข้อความเต็ม | ผู้ใช้ 40–60 ปีไม่มีคลังสัญลักษณ์สำหรับ hybrid |
| ที่นั่งเป็นตัวเลขไม่มี Badge | Badge ที่เปลี่ยน variant | ที่นั่งคือสถานะ ไม่ใช่ข้อมูลเฉย ๆ |
| ปิดการ์ดที่นั่งเต็ม | ปล่อยให้กดได้ | ผู้ใช้รอรอบหน้าหรือเข้าคิวสำรอง |
| วันที่เป็น ค.ศ. | `<DeadlineText>` | 2026 ในบริบทหลักสูตรรัฐอ่านผิด |
| `–` ไม่มี `aria-hidden` | มี | screen reader บางตัวอ่านว่า "ลบ" |
| `<Badge variant="accent">` สำหรับที่นั่งเหลือน้อย | `warning` | ทองห้ามเป็นสถานะ (ข้อ 02 §9) |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง ไม่มีแถวไหนอธิบายพฤติกรรมซ้ำ (นั่นคืองานของ §4 และ §5)

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · axe ผ่านใน `a11y/marketplace.test.tsx` กรณี "ฟรี · ที่นั่งเหลือน้อย" · กำหนดการผ่าน [`<DeadlineText>`](./Deadline.md) ตัวเดียวกับการ์ดอื่นจึงเป็น **พ.ศ.** เสมอ |
| ตอบสนอง (Responsive) | ✅ | สืบทอดจาก [`EntityCard`](./EntityCard.md) — ทดสอบที่ **136px** ตาม §7 ของไฟล์นั้น |
| โหมดมืด (Dark Mode) | ✅ | โครงและเงามาจาก [`EntityCard`](./EntityCard.md) → `<Card>` ซึ่งใช้ `--elevation-*` ไม่ใช่ `shadow-*` · `lint-classes.mjs` 0 จุด — ทุกสีมาจาก token ที่ override ในโหมดมืดแล้ว |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | `lint-quality.mjs` 0 จุด — ไม่มี `ml-`/`pl-`/`left-` ในไฟล์นี้ |
| คีย์บอร์ด (Keyboard) | ✅ | สืบทอดจาก [`EntityCard §5`](./EntityCard.md) — link overlay เป็น `<a href>` จริงจึงอยู่ใน tab order ตามธรรมชาติ · วงแหวน focus วาดที่**การ์ด** ไม่ใช่ที่ลิงก์ (SC 2.4.7) |
| กำลังโหลด (Loading) | — | §4 ของ [`EntityCard`](./EntityCard.md) — ผู้เรียกครอบกริดด้วย [`<SkeletonGroup>`](../feedback/Skeleton.md) |
| ข้อผิดพลาด (Error) | — | การ์ดไม่ทำ async |
| ว่างเปล่า (Empty) | — | "ไม่มีค่าใช้จ่าย" เป็น**ค่าที่มีความหมาย** ไม่ใช่ค่าว่าง — ต่างจากราคาที่ยังไม่ประกาศ |
| Skeleton | — | ตัวแทนระหว่างโหลดอยู่ที่ระดับกริด |
| การเคลื่อนไหว (Animation) | ✅ | ไม่มี `transition` หรือ `animate` ในไฟล์นี้เลย — การเคลื่อนไหวเดียวคือ `transition-shadow` ที่สืบทอดมาจาก `<Card interactive>` ซึ่ง `box-shadow` อยู่ในรายการ ALLOW ของ `base.css §10` |
| ประสิทธิภาพ (Performance) | ✅ | สืบทอดจาก [`EntityCard §10`](./EntityCard.md) — `mt-auto` แทนการวัดความสูงด้วย JS · container query แทน ResizeObserver · ไม่มีความสูงตายตัว |
