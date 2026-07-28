# ServiceCard

**`@smego/ui`** · ชั้น 03 · [ServiceCard.tsx](./ServiceCard.tsx) · ฐาน: [EntityCard.md](./EntityCard.md)

---

## 1 · ภาพรวม

การ์ดบริการ — ออกแบบ · ที่ปรึกษา · รับจ้างผลิต · ตรวจสอบมาตรฐาน · ขนส่ง

ความต่างหลักจาก `ProductCard` คือ **ค่าบริการมีโครงสร้างการคิดเงิน 5 แบบ** ไม่ใช่ตัวเลขเดียว

### ★★★ subscription บังคับแสดงยอดรวมต่อปี

`per-month` และ `per-year` เป็น **ภาระผูกพันต่อเนื่อง** ซึ่งต่างจากจ่ายครั้งเดียวโดยพื้นฐาน

SME ที่เห็น `990 บาท` แล้วเข้าใจว่าจ่ายครั้งเดียว จะเจอบิลปีละ **11,880** — ความเสียหายทางการเงินแบบเดียวกับที่ `GrantCard` ป้องกัน แค่กลับทิศ (ที่นั่นตัวเลขดูใหญ่เกินจริง ที่นี่ดูเล็กเกินจริง)

การ์ดจึงคำนวณและแสดงยอดรวมต่อปีให้เอง **ใน `<dl>` พร้อมชื่อกำกับ** ไม่ใช่ต่อท้ายตัวเลข เพราะที่ 136px ท้ายบรรทัดถูกตัดก่อน (`GrantCard.md §9`)

📌 ซอฟต์แวร์และ SaaS ไม่ต้องมีการ์ดของตัวเอง — ช่องว่างที่แท้จริงคือ *รูปแบบการจ่าย* ไม่ใช่ *หมวดสินค้า* · ซอฟต์แวร์ซื้อขาดใช้ `<ProductCard>` (`unit="ไลเซนส์"`) · SaaS ใช้ `per-month` ที่นี่

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน |
|---|---|
| สินค้าที่จับต้องได้ | `<ProductCard>` |
| หลักสูตรอบรม | `<TrainingCard>` |
| บริการของรัฐที่ไม่คิดเงิน | `<ProgramCard>` |

---

## 2 · React API

```tsx
<ServiceCard
  as="li"
  href="/services/pkg-design"
  name="ออกแบบบรรจุภัณฑ์และอัตลักษณ์แบรนด์"
  pricingModel="per-project"
  fee={85_000}
  leadTime="3–4 สัปดาห์"
  sellerName="สตูดิโอ ดีไซน์เฮาส์"
/>
```

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `href` · `name` | `string` | — | **บังคับ** |
| `pricingModel` | `'per-project' \| 'per-hour' \| 'per-month' \| 'per-year' \| 'quote'` | — | **บังคับ · ไม่มีค่าเริ่มต้น** |
| `fee` | `number` | — | ไม่ต้องส่งเมื่อ `pricingModel === 'quote'` · เมื่อเป็น `per-month` คือยอด**ต่อเดือน** และการ์ดคูณ 12 ให้เอง |
| `leadTime` | `string` | — | เช่น "3–4 สัปดาห์" |
| `sellerName` | `string` | — | **บังคับ** |
| `certifications` | `string[]` | — | |
| `media` · `actions` · `footer` | `ReactNode` | — | |

---

## 3 · Variants

### ★★ ค่าบริการมี 3 รูปแบบที่ **ต่างกันเชิงโครงสร้าง** ไม่ใช่แค่ตัวเลขต่างกัน

| `pricingModel` | ผู้ซื้อรู้อะไร | แสดงเป็น |
|---|---|---|
| `per-project` | **ยอดสุดท้าย** | `85,000 บาท ต่อโครงการ` |
| `per-hour` | อัตรา แต่ **ยอดสุดท้ายยังไม่รู้** | `1,500 บาท ต่อชั่วโมง` |
| `quote` | **ยังไม่มีตัวเลขเลย** | `ขอใบเสนอราคา` |

ถ้าแสดงทั้งสามแบบเป็น "12,000 บาท" เหมือนกัน **ผู้ซื้อจะเปรียบเทียบผิด** — บริการ 12,000 ต่อชั่วโมงกับ 12,000 ต่อโครงการต่างกันเป็นสิบเท่า

`pricingModel` จึงเป็น **prop จำเป็นที่ไม่มีค่าเริ่มต้น** — TypeScript บังคับให้เลือก ไม่มีทางส่งงานที่ "ยังไม่ได้ระบุ"

### ★ `quote` ไม่ใช่ "ราคา 0" และไม่ใช่ค่าว่าง

เป็น **สถานะของตัวมันเอง** — การ์ดแสดงคำว่า "ขอใบเสนอราคา" ในตำแหน่งที่ราคาควรอยู่ เพื่อให้สแกนกริดแล้วยัง **เทียบกันได้ว่าอันไหนบอกราคา อันไหนต้องคุยก่อน**

ถ้าปล่อยว่าง การ์ดจะดูเหมือนข้อมูลไม่ครบ

---

## 4 · States

สืบทอดจาก `EntityCard` — ดู [EntityCard.md §4](./EntityCard.md)

`ServiceCard` ไม่มีสถานะ "หมด" เพราะบริการไม่มีสต็อก · ถ้าผู้ให้บริการไม่รับงาน ให้ไม่แสดงการ์ดหรือใช้ `footer` บอก

---

## 5 · Accessibility

| เรื่อง | ข้อกำหนด |
|---|---|
| **SC 1.3.1** | ผู้ให้บริการและ lead time อยู่ใน `<dl>` |
| **SC 1.4.1** | Badge "บริการ" มีข้อความ ไม่พึ่งสี |
| ทั่วไป | ดู [EntityCard.md §5](./EntityCard.md) |

### ★★ ระยะเวลาดำเนินการสำคัญเท่าราคา

ผู้ซื้อที่ต้องส่งงานใน 2 สัปดาห์ **ไม่สนใจบริการที่ใช้เวลา 2 เดือน** ไม่ว่าราคาจะดีแค่ไหน

`leadTime` จึงอยู่ใน `meta` ของการ์ด ไม่ใช่ในหน้ารายละเอียด — เหตุผลเดียวกับ MOQ ใน `ProductCard`

### ★ `label` ของจำนวนเงินคือ "ค่าบริการ" ไม่ใช่ "ราคา"

`EntityAmount` บังคับ `label` และ ServiceCard ส่ง `s.card.serviceFee` — ผู้ใช้จึงรู้ว่าตัวเลขนี้เป็นค่าจ้างทำงาน ไม่ใช่ราคาของ

---

## 6 · Tailwind implementation

```tsx
const note =
  pricingModel === 'quote'   ? s.card.requestQuote
: pricingModel === 'per-hour' ? s.card.perHour
:                               s.card.perProject;

amount={
  <EntityAmount
    label={s.card.serviceFee}
    /* quote ไม่มีตัวเลข — null ทำให้ EntityAmount แสดง note แทน */
    value={pricingModel === 'quote' ? null : (fee ?? null)}
    note={note}
  />
}
```

`value ?? null` ครอบกรณีที่ `pricingModel` เป็น `per-project`/`per-hour` แต่ลืมส่ง `fee` — จะแสดง note แทนที่จะ crash หรือแสดง `NaN`

---

## 7 · Figma Variant

Component **`ServiceCard`**

| Property | Values |
|---|---|
| `Pricing model` | `Per project` · `Per hour` · **`Quote`** |
| `Lead time` | `True` · `False` |
| `Certifications` | `0` · `1` · `2` |

**ทั้งสาม pricing model ต้องมี frame แยก** — ถ้ามีแค่ "Price" frame เดียว นักพัฒนาจะไม่รู้ว่า `quote` แสดงยังไง แล้วจะปล่อยช่องว่าง

**`Quote` frame ต้องแสดงคำว่า "ขอใบเสนอราคา" ในตำแหน่งราคา** ไม่ใช่ซ่อนบล็อกทิ้ง

---

## 8 · Usage

```tsx
// ราคาเหมา
<ServiceCard href="#" name="ออกแบบบรรจุภัณฑ์และอัตลักษณ์แบรนด์"
  pricingModel="per-project" fee={85_000} leadTime="3–4 สัปดาห์"
  sellerName="สตูดิโอ ดีไซน์เฮาส์"
  footer={<Button size="sm" fullWidth>ขอใบเสนอราคา</Button>} />
```

```tsx
// ต่อชั่วโมง — ยอดสุดท้ายยังไม่รู้
<ServiceCard href="#" name="ที่ปรึกษาระบบคุณภาพ ISO 9001"
  pricingModel="per-hour" fee={2_500} leadTime="ตามแผนงาน"
  sellerName="บจก. คิวเอสคอนซัลท์" />
```

```tsx
// ต้องคุยก่อน — ไม่ส่ง fee
<ServiceCard href="#" name="ที่ปรึกษาระบบบัญชีและภาษีสำหรับ SME"
  pricingModel="quote" leadTime="ตามข้อตกลง"
  sellerName="บจก. แอคเคาท์โปร" />
```

---

## 9 · Anti-patterns

| ❌ | ✅ | ทำไม |
|---|---|---|
| `pricingModel` มีค่าเริ่มต้น | บังคับให้เลือก | 12,000/ชั่วโมง กับ 12,000/โครงการ ต่างกันสิบเท่า |
| `fee={0}` แทน quote | `pricingModel="quote"` | "0 บาท" อ่านว่าฟรี |
| ซ่อนบล็อกราคาเมื่อเป็น quote | แสดง "ขอใบเสนอราคา" | การ์ดดูเหมือนข้อมูลไม่ครบ |
| `label="ราคา"` | `s.card.serviceFee` | ค่าจ้างทำงาน ≠ ราคาของ |
| `leadTime` อยู่แค่ในหน้ารายละเอียด | บนการ์ด | เวลาสำคัญเท่าราคาสำหรับบริการ |
| ใช้ `<ProductCard>` กับบริการ | `<ServiceCard>` | ProductCard มี MOQ และสต็อกที่ไม่มีความหมาย |
| Badge "บริการ" เป็นสีอย่างเดียว | มีข้อความ | SC 1.4.1 |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง ไม่มีแถวไหนอธิบายพฤติกรรมซ้ำ (นั่นคืองานของ §4 และ §5)

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · axe ผ่านใน `a11y/marketplace.test.tsx` และ `a11y/pass4.test.tsx` · เทส **"★★★ `per-month` บังคับแสดงยอดรวมต่อปี"** — ผู้ใช้เห็นภาระผูกพันจริง ไม่ใช่แค่ค่ารายเดือน |
| ตอบสนอง (Responsive) | ✅ | เทส "ยอดรวมต่อปีมีชื่อกำกับ ไม่ใช่ต่อท้ายตัวเลข" — เพราะข้อความต่อท้าย**ถูกตัดที่ 136px** ซึ่งวัดไว้ใน [`EntityCard §3`](./EntityCard.md) |
| โหมดมืด (Dark Mode) | ✅ | โครงและเงามาจาก [`EntityCard`](./EntityCard.md) → `<Card>` ซึ่งใช้ `--elevation-*` ไม่ใช่ `shadow-*` · `lint-classes.mjs` 0 จุด — ทุกสีมาจาก token ที่ override ในโหมดมืดแล้ว |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | `lint-quality.mjs` 0 จุด — ไม่มี `ml-`/`pl-`/`left-` ในไฟล์นี้ |
| คีย์บอร์ด (Keyboard) | ✅ | สืบทอดจาก [`EntityCard §5`](./EntityCard.md) — link overlay เป็น `<a href>` จริงจึงอยู่ใน tab order ตามธรรมชาติ · วงแหวน focus วาดที่**การ์ด** ไม่ใช่ที่ลิงก์ (SC 2.4.7) |
| กำลังโหลด (Loading) | — | §4 ของ [`EntityCard`](./EntityCard.md) — ผู้เรียกครอบกริดด้วย [`<SkeletonGroup>`](../feedback/Skeleton.md) |
| ข้อผิดพลาด (Error) | — | การ์ดไม่ทำ async · เทส "`per-year` แสดงยอดเดิม ไม่คูณ 12" ยืนยันว่าการคำนวณเป็น pure function |
| ว่างเปล่า (Empty) | — | บริการที่ไม่มีข้อมูลไม่ถูก render |
| Skeleton | — | ตัวแทนระหว่างโหลดอยู่ที่ระดับกริด |
| การเคลื่อนไหว (Animation) | ✅ | ไม่มี `transition` หรือ `animate` ในไฟล์นี้เลย — การเคลื่อนไหวเดียวคือ `transition-shadow` ที่สืบทอดมาจาก `<Card interactive>` ซึ่ง `box-shadow` อยู่ในรายการ ALLOW ของ `base.css §10` |
| ประสิทธิภาพ (Performance) | ✅ | สืบทอดจาก [`EntityCard §10`](./EntityCard.md) — `mt-auto` แทนการวัดความสูงด้วย JS · container query แทน ResizeObserver · ไม่มีความสูงตายตัว |
